
import React from "react";
import InventoryList from "./InventoryList";
import AddItemForm from "./AddItemForm";

const MainInventory = () => {
  return (
    <div className="inventory-container">
      <h1>Main Inventory</h1>
      <AddItemForm />
      <InventoryList />
    </div>
  );
};

export default MainInventory;
