import { users, contactSubmissions, menuItems, orders, orderItems, leads, leadServiceTracking,
  type User, type InsertUser, type ContactSubmission, type InsertContactSubmission,
  type MenuItem, type InsertMenuItem, type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Lead, type InsertLead, type LeadServiceTracking, type InsertLeadServiceTracking } from "@shared/schema";
import { menuItems as staticMenuItems } from "../client/src/lib/data";

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  people: string;
  locationId: string;
  specialRequests?: string;
  createdAt: Date;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getFeaturedItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<{order: Order, items: (OrderItem & {menuItem: MenuItem})[]} | undefined>;
  updateOrderStatus(id: number, status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'): Promise<Order | undefined>;
  getAllOrders(limit?: number, offset?: number): Promise<Order[]>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getLeadsByLocation(locationId: string): Promise<Lead[]>;
  getAllLeads(limit?: number, offset?: number): Promise<Lead[]>;
  trackLeadServiceSelection(leadId: number, service: string): Promise<LeadServiceTracking>;
  getLeadServiceSelections(leadId: number): Promise<LeadServiceTracking[]>;
  getServiceSelectionCounts(): Promise<{service: string, count: number}[]>;
  createReservation(data: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation>;
  getAllReservations(): Promise<Reservation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private leads: Map<number, Lead>;
  private leadServiceTracking: Map<number, LeadServiceTracking>;
  private reservations: Map<number, Reservation>;
  private userId: number = 1;
  private contactId: number = 1;
  private menuItemId: number = 1;
  private orderId: number = 1;
  private orderItemId: number = 1;
  private leadId: number = 1;
  private trackingId: number = 1;
  private reservationId: number = 1;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.leads = new Map();
    this.leadServiceTracking = new Map();
    this.reservations = new Map();
    this.seedMenu();
  }

  private seedMenu() {
    staticMenuItems.forEach(item => {
      const id = this.menuItemId++;
      // Mark items as featured if they're in the popular category (burgers, tacos, sandwiches, sides)
      const isFeatured = ["burgers", "tacos", "sandwiches", "sides"].includes(item.category);
      this.menuItems.set(id, { ...item, id, featured: isFeatured && id <= 4 ? 1 : 0 });
    });
  }

  async seedAdminUser(hashedPassword: string): Promise<void> {
    const existing = await this.getUserByUsername('admin');
    if (!existing) {
      await this.createUser({
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        email: 'admin@gorillasmokegrill.com',
        role: 'admin',
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> { return this.users.get(id); }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user = { ...insertUser, id, createdAt: new Date(), lastLogin: null };
    this.users.set(id, user);
    return user;
  }
  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updated = { ...user, lastLogin: new Date() };
      this.users.set(id, updated);
      return updated;
    }
    return undefined;
  }
  async getAllUsers(): Promise<User[]> { return Array.from(this.users.values()); }
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updated = { ...user, ...userData };
      this.users.set(id, updated);
      return updated;
    }
    return undefined;
  }
  async deleteUser(id: number): Promise<boolean> { return this.users.delete(id); }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.contactId++;
    const contact = { ...submission, id, createdAt: new Date(), phone: submission.phone ?? null };
    this.contactSubmissions.set(id, contact);
    return contact;
  }
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getMenuItems(): Promise<MenuItem[]> { return Array.from(this.menuItems.values()); }
  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(i => i.category === category);
  }
  async getFeaturedItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(i => i.featured === 1);
  }
  async getMenuItem(id: number): Promise<MenuItem | undefined> { return this.menuItems.get(id); }
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemId++;
    const newItem = { ...item, id };
    this.menuItems.set(id, newItem);
    return newItem;
  }
  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existing = this.menuItems.get(id);
    if (existing) {
      const updated = { ...existing, ...item };
      this.menuItems.set(id, updated);
      return updated;
    }
    return undefined;
  }
  async deleteMenuItem(id: number): Promise<boolean> { return this.menuItems.delete(id); }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderId++;
    const newOrder = { ...order, id, createdAt: new Date(), status: order.status as any };
    this.orders.set(id, newOrder);
    items.forEach(item => {
      const itemId = this.orderItemId++;
      this.orderItems.set(itemId, { ...item, id: itemId, orderId: id });
    });
    return newOrder;
  }
  async getOrder(id: number): Promise<Order | undefined> { return this.orders.get(id); }
  async getOrderWithItems(id: number): Promise<{order: Order, items: (OrderItem & {menuItem: MenuItem})[]} | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const items = Array.from(this.orderItems.values())
      .filter(i => i.orderId === id)
      .map(i => ({ ...i, menuItem: this.menuItems.get(i.menuItemId)! }));
    return { order, items };
  }
  async updateOrderStatus(id: number, status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updated = { ...order, status: status as any };
      this.orders.set(id, updated);
      return updated;
    }
    return undefined;
  }
  async getAllOrders(limit: number = 50, offset: number = 0): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).slice(offset, offset + limit);
  }
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).slice(0, limit);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = this.leadId++;
    const newLead = { ...lead, id, createdAt: new Date(), phone: lead.phone ?? null, marketingConsent: lead.marketingConsent ?? true };
    this.leads.set(id, newLead);
    return newLead;
  }
  async getLead(id: number): Promise<Lead | undefined> { return this.leads.get(id); }
  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    return Array.from(this.leads.values()).find(l => l.email === email);
  }
  async getLeadsByLocation(locationId: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(l => l.locationId === locationId);
  }
  async getAllLeads(limit: number = 50, offset: number = 0): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()).slice(offset, offset + limit);
  }
  async trackLeadServiceSelection(leadId: number, service: string): Promise<LeadServiceTracking> {
    const id = this.trackingId++;
    const tracking = { id, leadId, service, timestamp: new Date() };
    this.leadServiceTracking.set(id, tracking);
    return tracking;
  }
  async getLeadServiceSelections(leadId: number): Promise<LeadServiceTracking[]> {
    return Array.from(this.leadServiceTracking.values()).filter(t => t.leadId === leadId);
  }
  async getServiceSelectionCounts(): Promise<{service: string, count: number}[]> {
    const counts: Record<string, number> = {};
    this.leadServiceTracking.forEach(t => counts[t.service] = (counts[t.service] || 0) + 1);
    return Object.entries(counts).map(([service, count]) => ({ service, count }));
  }

  async createReservation(data: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> {
    const id = this.reservationId++;
    const reservation: Reservation = { ...data, id, createdAt: new Date() };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
