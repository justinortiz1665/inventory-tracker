// frontend/src/components/Dashboard/Dashboard.js
import React from 'react';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;


// frontend/src/components/Inventory/InventoryList.js
import React from 'react';

function InventoryList() {
  return (
    <div>
      <h1>Inventory List</h1>
    </div>
  );
}

export default InventoryList;

// frontend/src/components/Inventory/AddItemForm.js
import React from 'react';

function AddItemForm() {
  return (
    <div>
      <h1>Add Item Form</h1>
    </div>
  );
}

export default AddItemForm;

// frontend/src/components/App.js (example usage)
import React from 'react';
import Dashboard from './Dashboard/Dashboard';
import InventoryList from './Inventory/InventoryList';
import AddItemForm from './Inventory/AddItemForm';

function App() {
  return (
    <div>
      <Dashboard />
      <InventoryList />
      <AddItemForm />
    </div>
  );
}

export default App;