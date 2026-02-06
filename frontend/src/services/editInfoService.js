
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/user'; // เช็ค URL ให้ตรงกับที่นายยิงใน Postman

export const updateUserInfo = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/editInfo`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};