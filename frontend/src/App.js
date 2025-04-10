import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./components/dashboard/Dashboard.js";
import MainInventory from "./components/inventory/MainInventory";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<MainInventory />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;