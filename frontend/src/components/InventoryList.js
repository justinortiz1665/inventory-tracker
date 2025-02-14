import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config"; // Import API URL from config.js

const InventoryList = () => {
    const [inventory, setInventory] = useState([]); // Store inventory items
    const [editItem, setEditItem] = useState(null); // Track item being edited
    const [searchTerm, setSearchTerm] = useState(""); // Store search input

    // Fetch inventory on component mount
    useEffect(() => {
        fetchInventory();
    }, []);

    // Function to fetch inventory from the backend
    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/inventory`);
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    // Function to handle editing an item
    const handleEdit = (item) => {
        setEditItem(item);
    };

    // Function to handle form submission when updating an item
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/api/inventory/${editItem.id}`, editItem);
            fetchInventory();
            setEditItem(null); // Reset edit form
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    // Function to handle changes in the edit form inputs
    const handleChange = (e) => {
        setEditItem({ ...editItem, [e.target.name]: e.target.value });
    };

    // Function to delete an inventory item
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/inventory/${id}`);
            fetchInventory();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    // Filter inventory items based on search term
    const filteredInventory = inventory.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Inventory List</h1>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    marginBottom: "20px",
                    padding: "10px",
                    width: "90%",
                }}
            />
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
                    {filteredInventory.length > 0 ? (
                        filteredInventory.map((item) => (
                            <tr key={item.id}>
                                <td>{item.item_name}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
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

            {/* Edit Form */}
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
        </div>
    );
};

export default InventoryList;
