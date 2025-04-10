const express = require("express");
    const router = express.Router();
    const pool = require("../database");

    // ✅ GET all inventory items
    router.get("/", async (req, res) => {
        try {
            const result = await pool.query("SELECT * FROM inventory ORDER BY id ASC");
            res.json(result.rows);
        } catch (err) {
            console.error("Error fetching inventory:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // ✅ GET a single inventory item by ID
    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query("SELECT * FROM inventory WHERE id = $1", [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Item not found" });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error("Error fetching item:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // ✅ POST - Add a new inventory item
    router.post("/", async (req, res) => {
        try {
            const { item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price } = req.body;

            const result = await pool.query(
                "INSERT INTO inventory (item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price]
            );

            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error("Error adding item:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // ✅ PUT - Update an inventory item
    router.put("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price } = req.body;

            const result = await pool.query(
                "UPDATE inventory SET item_number = $1, item_name = $2, category = $3, vendor = $4, quantity = $5, unit = $6, min_threshold = $7, max_threshold = $8, price = $9 WHERE id = $10 RETURNING *",
                [item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Item not found" });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error("Error updating item:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // ✅ DELETE - Remove an inventory item
    // Get categories with total costs
    router.get("/categories/costs", async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT 
                    category,
                    SUM(price * quantity) as total_cost
                FROM inventory 
                GROUP BY category
                ORDER BY total_cost DESC
            `);
            res.json(result.rows);
        } catch (err) {
            console.error("Error fetching category costs:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query("DELETE FROM inventory WHERE id = $1 RETURNING *", [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Item not found" });
            }
            res.json({ message: "Item deleted successfully" });
        } catch (err) {
            console.error("Error deleting item:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    module.exports = router;