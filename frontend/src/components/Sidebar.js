
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Inventory System</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Inventory
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
