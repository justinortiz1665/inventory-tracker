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

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Debug middleware - log all requests before routing
app.use((req, res, next) => {
  console.log('📍 Incoming request:', req.method, req.url);
  next();
});

// Mount routes with better error handling
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Handle 404s for API routes
app.use('/api/*', (req, res) => {
  console.log('❌ API route not found:', req.method, req.url);
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve static frontend in production
app.use(express.static('public'));

// Handle other routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Debug route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

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