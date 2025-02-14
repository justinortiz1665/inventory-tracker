import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api"; // Update if deployed

export const fetchInventory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/inventory`);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return [];
    }
};

export const addItem = async (itemData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/inventory`, itemData);
        return response.data;
    } catch (error) {
        console.error("Error adding item:", error);
    }
};

export const updateItem = async (id, itemData) => {
    try {
        await axios.put(`${API_BASE_URL}/inventory/${id}`, itemData);
    } catch (error) {
        console.error("Error updating item:", error);
    }
};

export const deleteItem = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/inventory/${id}`);
    } catch (error) {
        console.error("Error deleting item:", error);
    }
};
