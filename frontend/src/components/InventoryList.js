import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryList = () => {
<<<<<<< HEAD
    const [inventory, setInventory] = useState([]); // State to store the inventory list
    const [editItem, setEditItem] = useState(null); // State to store the item being edited
    const [searchTerm, setSearchTerm] = useState(""); // State for the search input

    // Fetch inventory items from the backend when the component loads
=======
    const [inventory, setInventory] = useState([]); // State to store inventory

>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
    useEffect(() => {
        fetchInventory();
    }, []);

<<<<<<< HEAD
    // Function to fetch inventory items
    const fetchInventory = () => {
        axios
            .get("http://localhost:5001/api/inventory")
            .then((response) => setInventory(response.data))
            .catch((error) => console.error("Error fetching inventory:", error));
    };

    // Function to handle the edit button click
    const handleEdit = (item) => {
        setEditItem(item); // Set the item to be edited
    };

    // Function to handle form submission for editing an item
    const handleUpdate = (e) => {
        e.preventDefault();
        axios
            .put(`http://localhost:5001/api/inventory/${editItem.id}`, editItem)
            .then(() => {
                fetchInventory(); // Refresh the inventory list
                setEditItem(null); // Close the edit form
            })
            .catch((error) => console.error("Error updating item:", error));
    };

    // Function to handle changes in the edit form inputs
    const handleChange = (e) => {
        setEditItem({ ...editItem, [e.target.name]: e.target.value });
    };

    // Function to handle the delete button click
    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:5001/api/inventory/${id}`)
            .then(() => fetchInventory()) // Refresh the inventory list after deletion
            .catch((error) => console.error("Error deleting item:", error));
    };

    // Filter inventory items based on the search term
    const filteredInventory = inventory.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Inventory List</h1>
            {/* Add a search bar */}
            <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                style={{
                    marginBottom: "20px",
                    padding: "10px",
                    width: "90%",
                }}
            />
=======
    const fetchInventory = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/inventory");
            setInventory(response.data); // Store response in state
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    return (
        <div>
            <h2>Inventory List</h2>
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                    {filteredInventory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.category}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editItem && (
                <form onSubmit={handleUpdate}>
                    <h2>Edit Item</h2>
                    <input
                        type="text"
                        name="item_name"
                        value={editItem.item_name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="category"
                        value={editItem.category}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={editItem.quantity}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setEditItem(null)}>
                        Cancel
                    </button>
                </form>
            )}
=======
                    {inventory.length > 0 ? (
                        inventory.map((item) => (
                            <tr key={item.id}>
                                <td>{item.item_name}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No inventory items found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
        </div>
    );
};

export default InventoryList;
