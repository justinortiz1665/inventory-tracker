const express = require("express");
const router = express.Router();
const dashboardModel = require("../models/dashboardModel");

// Get low stock items
router.get("/low-stock", async (req, res) => {
    try {
        console.log('Fetching low stock items...');
        const result = await dashboardModel.getLowStockItems();
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
        console.log('📊 Fetching category costs...');
        const result = await dashboardModel.getCategoryCosts();
        console.log('📊 Category costs result:', result);
        res.json(result);
    } catch (err) {
        console.error('❌ Error in category costs:', err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Get recent transactions
router.get("/recent-transactions", async (req, res) => {
    try {
        console.log('Fetching recent transactions...');
        const result = await dashboardModel.getRecentTransactions();
        console.log(`Found ${result.length} recent transactions`);
        res.json(result);
    } catch (err) {
        console.error("Error fetching recent transactions:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

module.exports = router;