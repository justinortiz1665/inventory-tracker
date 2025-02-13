import React from "react";
import InventoryList from "./components/InventoryList";
import AddItemForm from "./components/AddItemForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Inventory Tracker</h1>
      </header>
      <main>
        <AddItemForm />
        <InventoryList />
      </main>
    </div>
  );
}

export default App;
