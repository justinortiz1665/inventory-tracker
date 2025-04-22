import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  inventoryItems, type InventoryItem, type InsertInventoryItem,
  activityLogs, type ActivityLog, type InsertActivityLog
} from "@shared/schema";

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

  // Inventory item methods
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | undefined>;
  getInventoryItemsByCategoryId(categoryId: number): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  searchInventoryItems(query: string): Promise<InventoryItem[]>;

  // Activity log methods
  getAllActivityLogs(): Promise<ActivityLog[]>;
  getRecentActivityLogs(limit: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Dashboard methods
  getInventoryStats(): Promise<{
    totalItems: number;
    lowStockItems: number;
    outOfStock: number;
    categoriesCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private inventoryItems: Map<number, InventoryItem>;
  private activityLogs: Map<number, ActivityLog>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private inventoryItemCurrentId: number;
  private activityLogCurrentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.inventoryItems = new Map();
    this.activityLogs = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.inventoryItemCurrentId = 1;
    this.activityLogCurrentId = 1;

    // Initialize with sample categories
    this.initializeData();
  }

  private initializeData() {
    // Add default categories
    const defaultCategories = ["Electronics", "Furniture", "Office Supplies", "Clothing"];
    defaultCategories.forEach(name => {
      this.createCategory({ name });
    });
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
    return Array.from(this.categories.values());
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
    return this.inventoryItems.get(id);
  }

  async getInventoryItemsByCategoryId(categoryId: number): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values()).filter(
      item => item.categoryId === categoryId
    );
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
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;

    const updatedItem: InventoryItem = { ...item, ...updateData };
    this.inventoryItems.set(id, updatedItem);

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
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.inventoryItems.values()).filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) || 
      item.sku.toLowerCase().includes(lowercaseQuery) ||
      (item.description && item.description.toLowerCase().includes(lowercaseQuery))
    );
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

  // Dashboard methods
  async getInventoryStats(): Promise<{ totalItems: number; lowStockItems: number; outOfStock: number; categoriesCount: number; }> {
    const items = Array.from(this.inventoryItems.values());
    
    return {
      totalItems: items.length,
      lowStockItems: items.filter(item => item.stock > 0 && item.stock <= 5).length,
      outOfStock: items.filter(item => item.stock === 0).length,
      categoriesCount: this.categories.size,
    };
  }
}

export const storage = new MemStorage();
