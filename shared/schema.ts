import { pgTable, text, serial, timestamp, integer, pgEnum, doublePrecision, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema (keep this as required by the framework)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact form submission schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof contactSchema>;

// Menu category enum
export const categoryEnum = pgEnum('category', [
  'starters',
  'burgers',
  'grill',
  'sides',
  'drinks'
]);

// Menu item schema
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  image: text("image").notNull(),
  category: categoryEnum("category").notNull(),
  featured: integer("featured").default(0),
});

export const menuItemSchema = createInsertSchema(menuItems).pick({
  name: true,
  description: true,
  price: true,
  image: true,
  category: true,
  featured: true,
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof menuItemSchema>;

// Order status enum
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
]);

// Orders schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: orderStatusEnum("status").default('pending').notNull(),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  status: true,
  total: true,
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof orderSchema>;

// Order items schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const orderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  menuItemId: true,
  quantity: true,
  price: true,
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof orderItemSchema>;

// Relations
export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  orderItems: many(orderItems),
}));

// Marketing leads schema
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  locationId: text("location_id").notNull(),
  marketingConsent: boolean("marketing_consent").default(true),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  phone: true,
  locationId: true,
  marketingConsent: true,
  source: true,
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof leadSchema>;

// Lead service tracking schema
export const leadServiceTracking = pgTable("lead_service_tracking", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  service: text("service").notNull(), // 'ubereats', 'doordash', or 'grubhub'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const leadServiceTrackingSchema = createInsertSchema(leadServiceTracking).pick({
  leadId: true,
  service: true,
});

export type LeadServiceTracking = typeof leadServiceTracking.$inferSelect;
export type InsertLeadServiceTracking = z.infer<typeof leadServiceTrackingSchema>;

// Lead relations
export const leadRelations = relations(leads, ({ many }) => ({
  serviceSelections: many(leadServiceTracking),
}));

export const leadServiceTrackingRelations = relations(leadServiceTracking, ({ one }) => ({
  lead: one(leads, {
    fields: [leadServiceTracking.leadId],
    references: [leads.id],
  }),
}));
