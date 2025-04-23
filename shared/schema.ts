import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
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

// Categories for inventory items
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Facilities (replacing categories in the UI)
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  facility_name: text("facility_name").notNull().unique(),
  location: text("location").notNull(),
});

export const insertFacilitySchema = createInsertSchema(facilities).pick({
  facility_name: true,
  location: true,
});

export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;

// Main inventory items
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  categoryId: integer("category_id").notNull(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  sku: true,
  description: true,
  categoryId: true,
  price: true,
  stock: true,
  imageUrl: true,
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Facility inventory items (sub-inventory)
export const facilityInventoryItems = pgTable("facility_inventory_items", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").notNull(),
  itemId: integer("item_id").notNull(), // References main inventory item
  quantity: integer("quantity").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertFacilityInventoryItemSchema = createInsertSchema(facilityInventoryItems).pick({
  facilityId: true,
  itemId: true,
  quantity: true,
});

export type InsertFacilityInventoryItem = z.infer<typeof insertFacilityInventoryItemSchema>;
export type FacilityInventoryItem = typeof facilityInventoryItems.$inferSelect;

// Inventory transactions (for tracking movement between main storage and facilities)
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  fromFacilityId: integer("from_facility_id"), // null means from main inventory
  toFacilityId: integer("to_facility_id"), // null means to main inventory
  quantity: integer("quantity").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow(),
  notes: text("notes"),
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).pick({
  itemId: true,
  fromFacilityId: true,
  toFacilityId: true,
  quantity: true,
  notes: true,
});

export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;

// Activity log for inventory changes
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(), // "add", "update", "delete", "transfer"
  itemId: integer("item_id"),
  itemName: text("item_name").notNull(),
  description: text("description").notNull(),
  facilityId: integer("facility_id"), // Optional, for facility-related activities
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  action: true,
  itemId: true,
  itemName: true,
  description: true,
  facilityId: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
