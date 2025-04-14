import { users, contactSubmissions, menuItems, orders, orderItems, 
  type User, type InsertUser, type ContactSubmission, type InsertContactSubmission,
  type MenuItem, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray, sql } from "drizzle-orm";

// Expanded storage interface to include order management
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
}

export const storage = new DatabaseStorage();
