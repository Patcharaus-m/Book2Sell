import axios from "axios";

const API_URL = "http://localhost:3000/api/cart";

const getCart = async (userId) => {
    const response = await axios.get(`${API_URL}/getCart`, { params: { userId } });
    return response.data;
};

const addToCart = async (userId, bookId, quantity = 1) => {
    const response = await axios.post(`${API_URL}/addToCart`, { userId, bookId, quantity });
    return response.data;
};

const removeFromCart = async (userId, bookId) => {
    const response = await axios.delete(`${API_URL}/removeFromCart`, { data: { userId, bookId } });
    return response.data;
};

const increaseQuantity = async (userId, bookId) => {
    const response = await axios.put(`${API_URL}/increaseQuantity`, { userId, bookId });
    return response.data;
};

const decreaseQuantity = async (userId, bookId) => {
    const response = await axios.put(`${API_URL}/decreaseQuantity`, { userId, bookId });
    return response.data;
};

const clearCart = async (userId) => {
    const response = await axios.delete(`${API_URL}/clearCart`, { data: { userId } });
    return response.data;
};

export default {
    getCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
};
