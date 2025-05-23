import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  facilities, type Facility, type InsertFacility,
  inventoryItems, type InventoryItem, type InsertInventoryItem,
  facilityInventoryItems, type FacilityInventoryItem, type InsertFacilityInventoryItem,
  transactions, type InventoryTransaction, type InsertInventoryTransaction,
  activityLogs, type ActivityLog, type InsertActivityLog
} from "@shared/schema";
import { or, like, sql } from "drizzle-orm";

// Storage interface for all CRUD operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Facility methods
  getAllFacilities(): Promise<Facility[]>;
  getFacilityById(id: number): Promise<Facility | undefined>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: number, facility: Partial<InsertFacility>): Promise<Facility | undefined>;
  deleteFacility(id: number): Promise<boolean>;

  // Inventory item methods
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | undefined>;
  getInventoryItemsByCategoryId(categoryId: number): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  searchInventoryItems(query: string): Promise<InventoryItem[]>;

  // Facility inventory methods
  getFacilityInventory(facilityId: number): Promise<{item: InventoryItem, quantity: number}[]>;
  addItemToFacility(facilityId: number, itemId: number, quantity: number): Promise<FacilityInventoryItem>;
  updateFacilityInventoryItem(id: number, quantity: number): Promise<FacilityInventoryItem | undefined>;
  removeFacilityInventoryItem(id: number): Promise<boolean>;

  // Transaction methods
  createTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  getTransactionsByFacility(facilityId: number): Promise<InventoryTransaction[]>;
  getAllTransactions(): Promise<InventoryTransaction[]>;

  // Activity log methods
  getAllActivityLogs(): Promise<ActivityLog[]>;
  getRecentActivityLogs(limit: number): Promise<ActivityLog[]>;
  getFacilityActivityLogs(facilityId: number, limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Dashboard methods
  getInventoryStats(): Promise<{
    totalItems: number;
    lowStockItems: number;
    outOfStock: number;
    categoriesCount: number;
    facilitiesCount: number;
  }>;

  getFacilityStats(facilityId: number): Promise<{
    totalItems: number;
    totalQuantity: number;
    uniqueItems: number;
    facilityName: string;
  }>;
}

import { db } from './db';
import { eq } from 'drizzle-orm';

export class DbStorage implements IStorage {
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.facilities = new Map();
    this.inventoryItems = new Map();
    this.facilityInventoryItems = new Map();
    this.inventoryTransactions = new Map();
    this.activityLogs = new Map();

    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.facilityCurrentId = 1;
    this.inventoryItemCurrentId = 1;
    this.facilityInventoryItemCurrentId = 1;
    this.transactionCurrentId = 1;
    this.activityLogCurrentId = 1;

    // Initialize with sample data
    this.initializeData().catch(console.error);
  }

  private async initializeData() {
    // Add categories from inventory items
    try {
      const items = await db.select().from(inventoryItems);
      const categoriesFromInventory = new Set();

      items.forEach(item => {
        if (item.category) {
          categoriesFromInventory.add(item.category);
        }
      });

      // Create categories based on inventory items
      for (const category of Array.from(categoriesFromInventory)) {
        await db.insert(categories).values({ 
          name: category.toString()
        }).onConflictDoNothing();
      }
    } catch (error) {
      console.error("Error initializing categories:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    try {
      // Get unique categories directly from inventory items
      const items = await db.select().from(inventoryItems);
      const uniqueCategories = new Set(items.map(item => item.category));

      // Convert to array and format
      const categoryArray = Array.from(uniqueCategories).map(categoryName => ({
        id: Math.random(), // Temporary ID for display
        name: categoryName
      }));

      return categoryArray;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory: Category = { ...category, ...updateData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Check if category has items before deletion
    const hasItems = Array.from(this.inventoryItems.values()).some(
      item => item.categoryId === id
    );

    if (hasItems) {
      return false;
    }

    return this.categories.delete(id);
  }

  // Inventory item methods
  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | undefined> {
    try {
      const result = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      return undefined;
    }
  }

  async getInventoryItemsByCategory(category: string): Promise<InventoryItem[]> {
    try {
      const result = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.category, category))
        .execute();
      return result;
    } catch (error) {
      console.error('Error getting items by category:', error);
      return [];
    }
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.inventoryItemCurrentId++;
    const now = new Date();
    const item: InventoryItem = { ...insertItem, id, createdAt: now };
    this.inventoryItems.set(id, item);

    // Add activity log
    await this.createActivityLog({
      action: "add",
      itemId: id,
      itemName: item.name,
      description: `Added ${item.name} to inventory with ${item.stock} units`,
    });

    return item;
  }

  async updateInventoryItem(id: number, updateData: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const result = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id)).execute();
    if (!result.length) return undefined;

    await db.update(inventoryItems)
      .set(updateData)
      .where(eq(inventoryItems.id, id))
      .execute();

    const updatedItem = { ...result[0], ...updateData };

    // Add activity log
    await this.createActivityLog({
      action: "update",
      itemId: id,
      itemName: updatedItem.name,
      description: `Updated ${updatedItem.name} details`,
    });

    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const item = this.inventoryItems.get(id);
    if (!item) return false;

    const result = this.inventoryItems.delete(id);

    // Add activity log if deletion was successful
    if (result) {
      await this.createActivityLog({
        action: "delete",
        itemId: id,
        itemName: item.name,
        description: `Removed ${item.name} from inventory`,
      });
    }

    return result;
  }

  async searchInventoryItems(query: string): Promise<InventoryItem[]> {
    try {
      const lowercaseQuery = query.toLowerCase();
      const result = await db
        .select()
        .from(inventoryItems)
        .where(
          or(
            like(sql`lower(${inventoryItems.item_name})`, `%${lowercaseQuery}%`),
            like(sql`lower(${inventoryItems.item_number})`, `%${lowercaseQuery}%`)
          )
        )
        .orderBy(inventoryItems.id)
        .execute();

      return result;
    } catch (error) {
      console.error('Error searching inventory items:', error);
      return this.getAllInventoryItems(); // Fallback to all items if search fails
    }
  }

  // Activity log methods
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getRecentActivityLogs(limit: number): Promise<ActivityLog[]> {
    return (await this.getAllActivityLogs()).slice(0, limit);
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogCurrentId++;
    const now = new Date();
    const log: ActivityLog = { ...insertLog, id, timestamp: now };
    this.activityLogs.set(id, log);
    return log;
  }

  // Facility methods
  async getAllFacilities(): Promise<Facility[]> {
    try {
      return await db.select().from(facilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }
  }

  async getFacilityById(id: number): Promise<Facility | undefined> {
    try {
      const result = await db.select().from(facilities).where(eq(facilities.id, id));
      return result[0];
    } catch (error) {
      console.error('Error fetching facility:', error);
      return undefined;
    }
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const result = await db.insert(facilities).values(insertFacility).returning();
    const facility = result[0];

    // Add activity log
    await this.createActivityLog({
      action: "add",
      itemName: facility.facility_name,
      description: `Added facility: ${facility.facility_name}`,
      facilityId: facility.id
    });

    return facility;
  }

  async updateFacility(id: number, updateData: Partial<InsertFacility>): Promise<Facility | undefined> {
    const result = await db.update(facilities)
      .set(updateData)
      .where(eq(facilities.id, id))
      .returning();

    if (!result.length) return undefined;
    const facility = result[0];

    // Add activity log
    await this.createActivityLog({
      action: "update",
      itemName: facility.facility_name,
      description: `Updated facility: ${facility.facility_name}`,
      facilityId: id
    });

    return facility;
  }

  async deleteFacility(id: number): Promise<boolean> {
    try {
      // Check if facility has inventory items
      const facilityItems = await db.select()
        .from(facilityInventoryItems)
        .where(eq(facilityInventoryItems.facility_id, id));

      if (facilityItems.length > 0) {
        return false;
      }

      const facility = await this.getFacilityById(id);
      if (!facility) return false;

      await db.delete(facilities).where(eq(facilities.id, id));

      // Add activity log
      await this.createActivityLog({
        action: "delete",
        itemName: facility.facility_name,
        description: `Removed facility: ${facility.facility_name}`,
      });

      return true;
    } catch (error) {
      console.error('Error deleting facility:', error);
      return false;
    }
  }

  // Facility inventory methods
  async getFacilityInventory(facilityId: number): Promise<{item: InventoryItem, quantity: number}[]> {
    const facilityItems = Array.from(this.facilityInventoryItems.values())
      .filter(item => item.facilityId === facilityId);

    return Promise.all(facilityItems.map(async (facilityItem) => {
      const item = await this.getInventoryItemById(facilityItem.itemId);
      if (!item) {
        throw new Error(`Inventory item with id ${facilityItem.itemId} not found`);
      }

      return {
        item,
        quantity: facilityItem.quantity
      };
    }));
  }

  async addItemToFacility(facilityId: number, itemId: number, quantity: number): Promise<FacilityInventoryItem> {
    // Verify the facility exists
    const facility = await this.getFacilityById(facilityId);
    if (!facility) {
      throw new Error(`Facility with id ${facilityId} not found`);
    }

    // Verify the item exists
    const item = await this.getInventoryItemById(itemId);
    if (!item) {
      throw new Error(`Inventory item with id ${itemId} not found`);
    }

    // Check if the item is already in the facility
    const existingItem = Array.from(this.facilityInventoryItems.values())
      .find(fi => fi.facilityId === facilityId && fi.itemId === itemId);

    if (existingItem) {
      // Update the quantity if the item already exists
      return this.updateFacilityInventoryItem(existingItem.id, existingItem.quantity + quantity);
    }

    // Otherwise, create a new facility inventory item
    const id = this.facilityInventoryItemCurrentId++;
    const now = new Date();
    const facilityItem: FacilityInventoryItem = {
      id,
      facilityId,
      itemId,
      quantity,
      lastUpdated: now
    };

    this.facilityInventoryItems.set(id, facilityItem);

    // Add activity log
    await this.createActivityLog({
      action: "add",
      itemId,
      itemName: item.name,
      description: `Added ${quantity} units of ${item.name} to ${facility.name}`,
      facilityId
    });

    // Create transaction record
    await this.createTransaction({
      itemId,
      fromFacilityId: null, // null indicates main inventory
      toFacilityId: facilityId,
      quantity,
      notes: `Initial transfer to ${facility.name}`
    });

    return facilityItem;
  }

  async updateFacilityInventoryItem(id: number, quantity: number): Promise<FacilityInventoryItem | undefined> {
    const facilityItem = this.facilityInventoryItems.get(id);
    if (!facilityItem) return undefined;

    const now = new Date();
    const updatedItem: FacilityInventoryItem = {
      ...facilityItem,
      quantity,
      lastUpdated: now
    };

    this.facilityInventoryItems.set(id, updatedItem);

    // Get related data for logging
    const item = await this.getInventoryItemById(updatedItem.itemId);
    const facility = await this.getFacilityById(updatedItem.facilityId);

    if (item && facility) {
      // Add activity log
      await this.createActivityLog({
        action: "update",
        itemId: item.id,
        itemName: item.name,
        description: `Updated quantity of ${item.name} to ${quantity} units at ${facility.name}`,
        facilityId: facility.id
      });
    }

    return updatedItem;
  }

  async removeFacilityInventoryItem(id: number): Promise<boolean> {
    const facilityItem = this.facilityInventoryItems.get(id);
    if (!facilityItem) return false;

    const result = this.facilityInventoryItems.delete(id);

    if (result) {
      // Get related data for logging
      const item = await this.getInventoryItemById(facilityItem.itemId);
      const facility = await this.getFacilityById(facilityItem.facilityId);

      if (item && facility) {
        // Add activity log
        await this.createActivityLog({
          action: "delete",
          itemId: item.id,
          itemName: item.name,
          description: `Removed ${item.name} from ${facility.name}`,
          facilityId: facility.id
        });

        // Create transaction record
        await this.createTransaction({
          itemId: item.id,
          fromFacilityId: facility.id,
          toFacilityId: null, // null indicates main inventory
          quantity: facilityItem.quantity,
          notes: `Removed from ${facility.name}`
        });
      }
    }

    return result;
  }

  // Transaction methods
  async createTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const id = this.transactionCurrentId++;
    const now = new Date();
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id,
      transactionDate: now
    };

    this.inventoryTransactions.set(id, newTransaction);
    return newTransaction;
  }

  async getTransactionsByFacility(facilityId: number): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values())
      .filter(t => t.fromFacilityId === facilityId || t.toFacilityId === facilityId)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  async getAllTransactions(): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values())
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  // Additional activity log methods
  async getFacilityActivityLogs(facilityId: number, limit?: number): Promise<ActivityLog[]> {
    const logs = Array.from(this.activityLogs.values())
      .filter(log => log.facilityId === facilityId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return limit ? logs.slice(0, limit) : logs;
  }

  // Dashboard methods
  async getAllInventoryItems(filters: { search?: string, category?: string, status?: string } = {}) {
    try {
      let query = db.select().from(inventoryItems);

      if (filters.category && filters.category !== 'all') {
        query = query.where(eq(inventoryItems.category, filters.category));
      }

      if (filters.status && filters.status !== 'all') {
        switch (filters.status) {
          case 'in-stock':
            query = query.where(sql`quantity > min_threshold`);
            break;
          case 'low-stock':
            query = query.where(sql`quantity > 0 AND quantity <= min_threshold`);
            break;
          case 'out-of-stock':
            query = query.where(sql`quantity = 0`);
            break;
        }
      }

      if (filters.search) {
        query = query.where(like(sql`LOWER(item_name)`, `%${filters.search.toLowerCase()}%`));
      }

      return await query;
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      return [];
    }
  }

  async getInventoryStats(): Promise<{ 
    totalItems: number; 
    lowStockItems: number; 
    outOfStock: number; 
    categoriesCount: number;
    facilitiesCount: number;
  }> {
    const items = await this.getAllInventoryItems();

    return {
      totalItems: items.length,
      lowStockItems: items.filter(item => item.quantity > 0 && item.quantity <= item.min_threshold).length,
      outOfStock: items.filter(item => item.quantity === 0).length,
      categoriesCount: await db.select().from(categories).execute().then(r => r.length),
      facilitiesCount: await db.select().from(facilities).execute().then(r => r.length)
    };
  }

  async getFacilityStats(facilityId: number): Promise<{
    totalItems: number;
    totalQuantity: number;
    uniqueItems: number;
    facilityName: string;
  }> {
    const facility = await this.getFacilityById(facilityId);
    if (!facility) {
      throw new Error(`Facility with id ${facilityId} not found`);
    }

    const facilityItems = Array.from(this.facilityInventoryItems.values())
      .filter(item => item.facilityId === facilityId);

    return {
      totalItems: facilityItems.length,
      totalQuantity: facilityItems.reduce((sum, item) => sum + item.quantity, 0),
      uniqueItems: new Set(facilityItems.map(item => item.itemId)).size,
      facilityName: facility.name
    };
  }
}

export const storage = new DbStorage();