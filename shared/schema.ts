import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  role: text("role").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password_hash: true,
  role: true,
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
export const inventoryItems = pgTable("inventory", {
  id: serial("id").primaryKey(),
  item_number: text("item_number").notNull().unique(),
  item_name: text("item_name").notNull(),
  category: text("category").notNull(),
  vendor: text("vendor").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(),
  min_threshold: integer("min_threshold").notNull(),
  max_threshold: integer("max_threshold").notNull(),
  price: doublePrecision("price").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  item_number: true,
  item_name: true,
  category: true,
  vendor: true,
  quantity: true,
  unit: true,
  min_threshold: true,
  max_threshold: true,
  price: true,
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Facility inventory items (sub-inventory)
export const facilityInventoryItems = pgTable("facility_inventory", {
  id: serial("id").primaryKey(),
  facility_id: integer("facility_id").notNull(),
  item_id: integer("item_id").notNull(),
  quantity: integer("quantity").notNull(),
  last_updated: timestamp("last_updated").defaultNow(),
});

export const insertFacilityInventoryItemSchema = createInsertSchema(facilityInventoryItems).pick({
  facility_id: true,
  item_id: true,
  quantity: true,
});

export type InsertFacilityInventoryItem = z.infer<typeof insertFacilityInventoryItemSchema>;
export type FacilityInventoryItem = typeof facilityInventoryItems.$inferSelect;

// Inventory transactions
export const inventoryTransactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  item_id: integer("item_id").notNull(),
  facility_id: integer("facility_id").notNull(),
  transaction_type: text("transaction_type").notNull(),
  quantity: integer("quantity").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).pick({
  user_id: true,
  item_id: true,
  facility_id: true,
  transaction_type: true,
  quantity: true,
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
