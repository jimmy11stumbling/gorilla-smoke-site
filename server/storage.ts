import { users, contactSubmissions, menuItems, orders, orderItems, leads, leadServiceTracking,
  type User, type InsertUser, type ContactSubmission, type InsertContactSubmission,
  type MenuItem, type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Lead, type InsertLead, type LeadServiceTracking, type InsertLeadServiceTracking } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";

// Expanded storage interface to include order and lead management
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Contact form submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Menu items management
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getFeaturedItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Order management
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<{order: Order, items: (OrderItem & {menuItem: MenuItem})[]} | undefined>;
  updateOrderStatus(id: number, status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'): Promise<Order | undefined>;
  getAllOrders(limit?: number, offset?: number): Promise<Order[]>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getLeadsByLocation(locationId: string): Promise<Lead[]>;
  getAllLeads(limit?: number, offset?: number): Promise<Lead[]>;
  trackLeadServiceSelection(leadId: number, service: string): Promise<LeadServiceTracking>;
  getLeadServiceSelections(leadId: number): Promise<LeadServiceTracking[]>;
  getServiceSelectionCounts(): Promise<{service: string, count: number}[]>;
}

// Database implementation of Storage
export class DatabaseStorage implements IStorage {
  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(users.username);
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Contact form methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    // Ensure phone is null instead of undefined if not provided
    const values = {
      ...submission,
      phone: submission.phone ?? null,
    };

    const [contactSubmission] = await db
      .insert(contactSubmissions)
      .values(values)
      .returning();
    
    return contactSubmission;
  }
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }
  
  // Menu item methods
  async getMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems).orderBy(menuItems.category, menuItems.name);
  }
  
  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    // Using SQL method to handle enum comparison properly
    return db.select().from(menuItems)
      .where(sql`${menuItems.category} = ${category}`)
      .orderBy(menuItems.name);
  }
  
  async getFeaturedItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems)
      .where(eq(menuItems.featured, 1))
      .orderBy(menuItems.name);
  }
  
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || undefined;
  }
  
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db
      .insert(menuItems)
      .values(item)
      .returning();
    return newItem;
  }
  
  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updatedItem] = await db
      .update(menuItems)
      .set(item)
      .where(eq(menuItems.id, id))
      .returning();
    return updatedItem || undefined;
  }
  
  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id));
    return result.rowCount > 0;
  }
  
  // Order management methods
  async createOrder(order: InsertOrder, orderItemsData: InsertOrderItem[]): Promise<Order> {
    // Use a transaction to ensure both the order and items are created atomically
    return await db.transaction(async (tx) => {
      // Create the order first
      const [newOrder] = await tx.insert(orders).values(order).returning();
      
      // Then create all the order items with the new order ID
      if (orderItemsData.length > 0) {
        await tx.insert(orderItems).values(
          orderItemsData.map(item => ({
            ...item,
            orderId: newOrder.id
          }))
        );
      }
      
      return newOrder;
    });
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }
  
  async getOrderWithItems(id: number): Promise<{order: Order, items: (OrderItem & {menuItem: MenuItem})[]} | undefined> {
    // First get the order
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    // Then get all items for this order with their menu item details
    const orderItemsWithMenuItems = await db.select({
      orderItem: orderItems,
      menuItem: menuItems
    })
    .from(orderItems)
    .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
    .where(eq(orderItems.orderId, id));
    
    // Transform the results to the expected format
    const items = orderItemsWithMenuItems.map(({ orderItem, menuItem }) => ({
      ...orderItem,
      menuItem
    }));
    
    return { order, items };
  }
  
  async updateOrderStatus(id: number, status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    
    return updatedOrder || undefined;
  }
  
  async getAllOrders(limit: number = 50, offset: number = 0): Promise<Order[]> {
    return db.select().from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return db.select().from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }
  
  // Lead management methods
  async createLead(lead: InsertLead): Promise<Lead> {
    // Ensure phone is null instead of undefined if not provided
    const values = {
      ...lead,
      phone: lead.phone ?? null,
    };
    
    const [newLead] = await db
      .insert(leads)
      .values(values)
      .returning();
    
    return newLead;
  }
  
  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }
  
  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.email, email));
    return lead || undefined;
  }
  
  async getLeadsByLocation(locationId: string): Promise<Lead[]> {
    return db.select().from(leads)
      .where(eq(leads.locationId, locationId))
      .orderBy(desc(leads.createdAt));
  }
  
  async getAllLeads(limit: number = 50, offset: number = 0): Promise<Lead[]> {
    return db.select().from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async trackLeadServiceSelection(leadId: number, service: string): Promise<LeadServiceTracking> {
    const [tracking] = await db
      .insert(leadServiceTracking)
      .values({
        leadId,
        service
      })
      .returning();
    
    return tracking;
  }
  
  async getLeadServiceSelections(leadId: number): Promise<LeadServiceTracking[]> {
    return db.select().from(leadServiceTracking)
      .where(eq(leadServiceTracking.leadId, leadId))
      .orderBy(desc(leadServiceTracking.timestamp));
  }
  
  async getServiceSelectionCounts(): Promise<{service: string, count: number}[]> {
    const result = await db.execute(sql`
      SELECT service, COUNT(*) as count 
      FROM ${leadServiceTracking} 
      GROUP BY service 
      ORDER BY count DESC
    `);
    
    return result.rows.map(row => ({
      service: row.service as string,
      count: Number(row.count)
    }));
  }
}

export const storage = new DatabaseStorage();
