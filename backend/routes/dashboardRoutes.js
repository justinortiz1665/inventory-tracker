
const express = require("express");
const router = express.Router();
const pool = require("../database");

// Get low stock items
router.get("/low-stock", async (req, res) => {
    try {
        console.log('Fetching low stock items...');
        const result = await pool.query(
            "SELECT * FROM inventory WHERE quantity <= min_threshold ORDER BY quantity ASC LIMIT 3"
        );
        console.log(`Found ${result.rows.length} low stock items`);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching low stock items:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Get category costs
router.get("/category-costs", async (req, res) => {
    try {
        console.log('Calculating category costs...');
        const result = await pool.query(`
            SELECT 
                category,
                SUM(price * quantity) as total_cost
            FROM inventory 
            GROUP BY category
            ORDER BY total_cost DESC
        `);
        console.log(`Found costs for ${result.rows.length} categories`);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching category costs:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Get recent transactions
router.get("/recent-transactions", async (req, res) => {
    try {
        console.log('Fetching recent transactions...');
        const result = await pool.query(
            "SELECT * FROM inventory ORDER BY created_at DESC LIMIT 3"
        );
        console.log(`Found ${result.rows.length} recent transactions`);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching recent transactions:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

module.exports = router;
