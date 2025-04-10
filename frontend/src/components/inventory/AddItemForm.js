import React, { useState } from "react";
import axios from "axios";

const AddItemForm = () => {
    const [formData, setFormData] = useState({
        item_name: "",
        category: "",
        quantity: 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:5001/api/inventory", formData)
            .then(() => {
                alert("Item added successfully!");
                setFormData({ item_name: "", category: "", quantity: 0 });
            })
            .catch((error) => console.error("Error adding item:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="item_name"
                placeholder="Item Name"
                value={formData.item_name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
            />
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddItemForm;
