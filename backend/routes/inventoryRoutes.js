const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const db = require("../database");

// GET all inventory items
router.get("/inventory", (req, res) => {
    db.all("SELECT * FROM inventory", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// GET a single inventory item by ID
router.get("/inventory/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM inventory WHERE id = ?", [id], (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (!row) {
          res.status(404).json({ error: "Item not found" });
          return;
      }
      res.json(row);
  });
});

// POST a new inventory item
router.post("/inventory", (req, res) => {
    const { item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price } = req.body;
    db.run(
        "INSERT INTO inventory (item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))",
        [item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: "Item added successfully" });
        }
    );
});

// PUT update an inventory item
router.put("/inventory/:id", (req, res) => {
  const { id } = req.params;
  const { quantity, item_name, category, vendor, unit, min_threshold, max_threshold, price } = req.body;

  if (!quantity && !item_name && !category && !vendor && !unit && !min_threshold && !max_threshold && !price) {
      return res.status(400).json({ error: "No update fields provided" });
  }

  let query = "UPDATE inventory SET ";
  const params = [];
  if (quantity !== undefined) { query += "quantity = ?, "; params.push(quantity); }
  if (item_name !== undefined) { query += "item_name = ?, "; params.push(item_name); }
  if (category !== undefined) { query += "category = ?, "; params.push(category); }
  if (vendor !== undefined) { query += "vendor = ?, "; params.push(vendor); }
  if (unit !== undefined) { query += "unit = ?, "; params.push(unit); }
  if (min_threshold !== undefined) { query += "min_threshold = ?, "; params.push(min_threshold); }
  if (max_threshold !== undefined) { query += "max_threshold = ?, "; params.push(max_threshold); }
  if (price !== undefined) { query += "price = ?, "; params.push(price); }

  query = query.slice(0, -2) + " WHERE id = ?";
  params.push(id);

  db.run(query, params, function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ message: "Item updated successfully" });
  });
});

// DELETE an inventory item
router.delete("/inventory/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM inventory WHERE id = ?", [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Item deleted successfully" });
    });
});

module.exports = router;
=======
const inventoryModel = require("../models/inventoryModel");

// ✅ Get all inventory items
router.get("/", async (req, res) => {
    try {
        const inventory = await inventoryModel.getAllInventory();
        res.json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get a single inventory item by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await inventoryModel.getInventoryById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(item);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Add a new inventory item
router.post("/", async (req, res) => {
    try {
        const newItem = await inventoryModel.addInventoryItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Update an inventory item
router.put("/:id", async (req, res) => {
    try {
        const updatedItem = await inventoryModel.updateInventoryItem(req.params.id, req.body);
        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Delete an inventory item
router.delete("/:id", async (req, res) => {
    try {
        const deletedItem = await inventoryModel.deleteInventoryItem(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
