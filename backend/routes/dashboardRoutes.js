const express = require("express");
const router = express.Router();
const { getLowStockItems, getCategoryCosts, getRecentTransactions } = require("../models/dashboardModel");

// Get low stock items
router.get("/low-stock", async (req, res) => {
    try {
        console.log('Fetching low stock items...');
        const result = await getLowStockItems();
        console.log(`Found ${result.length} low stock items`);
        res.json(result);
    } catch (err) {
        console.error("Error fetching low stock items:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Get category costs
router.get("/category-costs", async (req, res) => {
    try {
        console.log('Calculating category costs...');
        const result = await getCategoryCosts();
        console.log(`Found costs for ${result.length} categories`);
        res.json(result);
    } catch (err) {
        console.error("Error fetching category costs:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Get recent transactions
router.get("/recent-transactions", async (req, res) => {
    try {
        console.log('Fetching recent transactions...');
        const result = await getRecentTransactions();
        console.log(`Found ${result.length} recent transactions`);
        res.json(result);
    } catch (err) {
        console.error("Error fetching recent transactions:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

module.exports = router;