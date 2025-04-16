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
  
  // Contact form submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Menu items management
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getFeaturedItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  
  // Order management
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<{order: Order, items: (OrderItem & {menuItem: MenuItem})[]} | undefined>;
  updateOrderStatus(id: number, status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'): Promise<Order | undefined>;
  
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getLeadsByLocation(locationId: string): Promise<Lead[]>;
  trackLeadServiceSelection(leadId: number, service: string): Promise<LeadServiceTracking>;
  getLeadServiceSelections(leadId: number): Promise<LeadServiceTracking[]>;
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
}

export const storage = new DatabaseStorage();
