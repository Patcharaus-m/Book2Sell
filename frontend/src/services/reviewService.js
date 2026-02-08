// frontend/src/services/reviewService.js
import axios from "axios";

const API_URL = "https://book2-backend.onrender.com/api/review";

export const createReviewService = async (reviewData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, reviewData);
        return response.data;
    } catch (error) {
        console.error("Create Review Error:", error);
        // ✅ แก้ตรงนี้: เช็คว่า Backend ส่ง Error Message มาให้ไหม
        if (error.response && error.response.data) {
            return error.response.data; // ส่ง { code: 400, message: "รีวิวไปแล้ว" } กลับไป
        }
        return { status: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
    }
};

export const getReviewsBySeller = async (sellerId) => {
    try {
        const response = await axios.get(`${API_URL}/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        console.error("Get Reviews Error:", error);
        // ✅ แก้ตรงนี้เหมือนกัน
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return { status: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
    }
};

export const getMyReceivedReviews = async (userId) => {
    try {
        // ยิงไปที่ endpoint ที่เราเพิ่งทำเสร็จ (getBySeller)
        const response = await axios.get(`${API_URL}/seller/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Get My Reviews Error:", error);
        return { status: false, message: "ดึงข้อมูลรีวิวไม่สำเร็จ" };
    }
};

export const getReviewsBySellerService = async (sellerId) => {
    try {
        const response = await axios.get(`${API_URL}/seller/${sellerId}`);
        return response.data;
    } catch (error) {
        console.error("Get Seller Reviews Error:", error);
        return { status: false, payload: [] }; // Return array ว่างถ้า error
    }
};

// ดึงรีวิวที่ user เขียน (By Reviewer)
export const getReviewsByReviewerService = async (reviewerId) => {
    try {
        const response = await axios.get(`${API_URL}/reviewer/${reviewerId}`);
        return response.data;
    } catch (error) {
        console.error("Get Reviewer Reviews Error:", error);
        return { status: false, payload: [] };
    }
};
