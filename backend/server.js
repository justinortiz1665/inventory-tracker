require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database"); // Ensure database connection is correct

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Import routes
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Use the API Base URL from .env
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5001";

app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Inventory Tracker API is running...");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log('✅ Dashboard routes available at:');
    console.log(`   - /api/dashboard/low-stock`);
    console.log(`   - /api/dashboard/category-costs`);
    console.log(`   - /api/dashboard/recent-transactions`);
});