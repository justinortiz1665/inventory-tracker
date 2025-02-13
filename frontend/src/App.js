import React from "react";
<<<<<<< HEAD
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


=======
import InventoryList from "./components/InventoryList"; // Importing the component
import "./App.css"; // Keep the styles

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Inventory Tracker</h1>
      </header>
      <main>
        <InventoryList /> {/* Displaying the inventory */}
      </main>
    </div>
  );
}

export default App;
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
