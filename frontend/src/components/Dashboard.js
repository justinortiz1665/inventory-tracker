
import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard Overview</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="card-title">Low Stock Items</h2>
          <div className="alert-list">
            <div className="alert-item warning">
              <span>Printer Paper</span>
              <span className="quantity">5 left</span>
            </div>
            <div className="alert-item critical">
              <span>Ink Cartridges</span>
              <span className="quantity">2 left</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <h2 className="card-title">Category Costs</h2>
          <div className="cost-list">
            <div className="cost-item">
              <span>Office Supplies</span>
              <span className="cost">$2,450</span>
            </div>
            <div className="cost-item">
              <span>Electronics</span>
              <span className="cost">$5,230</span>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <h2 className="card-title">Recent Transactions</h2>
          <div className="transaction-list">
            <div className="transaction-item">
              <span>Monitors → IT Dept</span>
              <span className="date">Today</span>
            </div>
            <div className="transaction-item">
              <span>Paper → HR Dept</span>
              <span className="date">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
