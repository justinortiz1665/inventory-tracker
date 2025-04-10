
import React, { useState, useEffect } from "react";
import { fetchInventory } from "../api";

const Dashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    const getInventoryData = async () => {
      const data = await fetchInventory();
      setInventoryData(data);
    };
    getInventoryData();
  }, []);

  // Calculate low stock items
  const lowStockItems = inventoryData
    .filter(item => item.quantity <= item.min_threshold)
    .slice(0, 3);

  // Calculate category costs
  const categoryCosts = inventoryData.reduce((acc, item) => {
    const cost = item.price * item.quantity;
    acc[item.category] = (acc[item.category] || 0) + cost;
    return acc;
  }, {});

  // Get recent items (using the most recently added/updated items)
  const recentItems = [...inventoryData]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard Overview</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="card-title">Low Stock Items</h2>
          <div className="alert-list">
            {lowStockItems.map(item => (
              <div key={item.id} className={item.quantity === 0 ? "alert-item critical" : "alert-item warning"}>
                <span>{item.item_name}</span>
                <span className="quantity">{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card">
          <h2 className="card-title">Category Costs</h2>
          <div className="cost-list">
            {Object.entries(categoryCosts).map(([category, cost]) => (
              <div key={category} className="cost-item">
                <span>{category}</span>
                <span className="cost">${cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card">
          <h2 className="card-title">Recent Transactions</h2>
          <div className="transaction-list">
            {recentItems.map(item => (
              <div key={item.id} className="transaction-item">
                <span>{item.item_name} → {item.vendor}</span>
                <span className="date">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
