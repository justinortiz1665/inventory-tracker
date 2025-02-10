import React from "react";
import InventoryList from "./components/InventoryList";
import AddItemForm from "./components/AddItemForm";

const App = () => {
    return (
        <div>
            <h1>Inventory Tracker</h1>
            <AddItemForm />
            <InventoryList />
        </div>
    );
};

export default App;


