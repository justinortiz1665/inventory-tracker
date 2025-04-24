import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCategorySchema, 
  insertInventoryItemSchema, 
  insertActivityLogSchema,
  insertFacilitySchema,
  insertFacilityInventoryItemSchema,
  insertInventoryTransactionSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      
      const updatedCategory = await storage.updateCategory(id, validatedData);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteCategory(id);
      
      if (!result) {
        return res.status(400).json({ message: "Category cannot be deleted or not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Inventory items routes
  app.get("/api/inventory", async (req: Request, res: Response) => {
    try {
      const { search, category } = req.query;
      
      let items;
      if (search && typeof search === 'string') {
        items = await storage.searchInventoryItems(search);
      } else if (category && typeof category === 'string') {
        items = await storage.getInventoryItemsByCategory(category);
      } else {
        items = await storage.getAllInventoryItems();
      }
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });

  app.get("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getInventoryItemById(id);
      
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const newItem = await storage.createInventoryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      
      const updatedItem = await storage.updateInventoryItem(id, validatedData);
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteInventoryItem(id);
      
      if (!result) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  // Activity logs routes
  app.get("/api/activity", async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;
      let logs;
      
      if (limit && typeof limit === 'string') {
        logs = await storage.getRecentActivityLogs(parseInt(limit));
      } else {
        logs = await storage.getAllActivityLogs();
      }
      
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  app.post("/api/activity", async (req: Request, res: Response) => {
    try {
      const validatedData = insertActivityLogSchema.parse(req.body);
      const newLog = await storage.createActivityLog(validatedData);
      res.status(201).json(newLog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity log data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity log" });
    }
  });

  // Facilities routes
  app.get("/api/facilities", async (req: Request, res: Response) => {
    try {
      const facilities = await storage.getAllFacilities();
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facilities" });
    }
  });

  app.get("/api/facilities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const facility = await storage.getFacilityById(id);
      
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      
      res.json(facility);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility" });
    }
  });

  app.post("/api/facilities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFacilitySchema.parse(req.body);
      const newFacility = await storage.createFacility(validatedData);
      res.status(201).json(newFacility);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid facility data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create facility" });
    }
  });

  app.put("/api/facilities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFacilitySchema.partial().parse(req.body);
      
      const updatedFacility = await storage.updateFacility(id, validatedData);
      if (!updatedFacility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      
      res.json(updatedFacility);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid facility data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update facility" });
    }
  });

  app.delete("/api/facilities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteFacility(id);
      
      if (!result) {
        return res.status(400).json({ message: "Facility cannot be deleted or not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete facility" });
    }
  });

  // Facility inventory routes
  app.get("/api/facilities/:id/inventory", async (req: Request, res: Response) => {
    try {
      const facilityId = parseInt(req.params.id);
      const inventory = await storage.getFacilityInventory(facilityId);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility inventory" });
    }
  });

  app.post("/api/facilities/:id/inventory", async (req: Request, res: Response) => {
    try {
      const facilityId = parseInt(req.params.id);
      const { itemId, quantity } = req.body;
      
      if (!itemId || !quantity) {
        return res.status(400).json({ message: "Item ID and quantity are required" });
      }
      
      const result = await storage.addItemToFacility(facilityId, parseInt(itemId), parseInt(quantity));
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: `Failed to add item to facility: ${error.message}` });
    }
  });

  app.put("/api/facilities/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (quantity === undefined) {
        return res.status(400).json({ message: "Quantity is required" });
      }
      
      const updatedItem = await storage.updateFacilityInventoryItem(id, parseInt(quantity));
      if (!updatedItem) {
        return res.status(404).json({ message: "Facility inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update facility inventory item" });
    }
  });

  app.delete("/api/facilities/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.removeFacilityInventoryItem(id);
      
      if (!result) {
        return res.status(404).json({ message: "Facility inventory item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove facility inventory item" });
    }
  });

  // Facility statistics route
  app.get("/api/facilities/:id/stats", async (req: Request, res: Response) => {
    try {
      const facilityId = parseInt(req.params.id);
      const stats = await storage.getFacilityStats(facilityId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility statistics" });
    }
  });

  // Facility activity logs
  app.get("/api/facilities/:id/activity", async (req: Request, res: Response) => {
    try {
      const facilityId = parseInt(req.params.id);
      const { limit } = req.query;
      
      let logs;
      if (limit && typeof limit === 'string') {
        logs = await storage.getFacilityActivityLogs(facilityId, parseInt(limit));
      } else {
        logs = await storage.getFacilityActivityLogs(facilityId);
      }
      
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility activity logs" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req: Request, res: Response) => {
    try {
      const { facilityId } = req.query;
      
      let transactions;
      if (facilityId && typeof facilityId === 'string') {
        transactions = await storage.getTransactionsByFacility(parseInt(facilityId));
      } else {
        transactions = await storage.getAllTransactions();
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInventoryTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      
      // Add activity log for the transaction
      const item = await storage.getInventoryItemById(validatedData.itemId);
      if (item) {
        const fromFacility = validatedData.fromFacilityId ? 
          await storage.getFacilityById(validatedData.fromFacilityId) : null;
        const toFacility = validatedData.toFacilityId ?
          await storage.getFacilityById(validatedData.toFacilityId) : null;
          
        const fromName = fromFacility ? fromFacility.name : "Main Inventory";
        const toName = toFacility ? toFacility.name : "Main Inventory";
        
        await storage.createActivityLog({
          action: "transfer",
          itemId: item.id,
          itemName: item.name,
          description: `Transferred ${validatedData.quantity} units of ${item.name} from ${fromName} to ${toName}`,
          facilityId: validatedData.toFacilityId || validatedData.fromFacilityId
        });
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Dashboard statistics route
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getInventoryStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
