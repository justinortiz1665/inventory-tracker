
import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="card-title">Low Stock Items</h2>
          {/* Low stock items will be implemented here */}
        </div>
        <div className="dashboard-card">
          <h2 className="card-title">Category Costs</h2>
          {/* Category costs will be implemented here */}
        </div>
        <div className="dashboard-card">
          <h2 className="card-title">Recent Transactions</h2>
          {/* Recent transactions will be implemented here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
