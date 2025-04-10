
import React, { useState, useEffect } from "react";
import { fetchDashboardData } from "../api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    lowStock: [],
    categoryCosts: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData();
        console.log('Dashboard data received:', data);
        setDashboardData(data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Convert category costs array to object format for rendering
  const categoryCosts = dashboardData.categoryCosts.reduce((acc, item) => {
    acc[item.category] = parseFloat(item.total_cost);
    return acc;
  }, {});

  const lowStockItems = dashboardData.lowStock;
  const recentItems = dashboardData.recentTransactions;

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
