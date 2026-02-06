import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Login Service - จัดการการล็อกอินผ่าน Backend
 * ใช้ axios แทน Fetch
 */

export const loginService = {
    /**
     * ฟังก์ชัน login - ตรวจสอบข้อมูลผู้ใช้กับ Backend
     * @param {string} username - ชื่อผู้ใช้
     * @param {string} password - รหัสผ่าน
     * @returns {Object} ข้อมูลผู้ใช้และสถานะ
     */
    async login(username, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/user/login`, {
                username,
                password
            });
            console.log('Login API response:', response.data); // Debug log

            // Backend ใช้รูปแบบ { code, status, error, payload }
            const payload = response.data.payload;
            
            // เช็คจาก status code 201 และ payload มีข้อมูล
            if (response.data.code === 201 && payload) {
                const userData = {
                    id: payload._id,
                    username: payload.username,
                    email: payload.email,
                    phone: payload.phone,
                    name: payload.username, // ใช้ username เป็น display name
                    creditBalance: payload.creditBalance || 0
                };

                return {
                    success: true,
                    user: userData,
                    message: 'เข้าสู่ระบบสำเร็จ'
                };
            }

            return {
                success: false,
                message: response.data.error?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์';

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    /**
     * ฟังก์ชัน logout - ล้างข้อมูล (Frontend only)
     */
    logout() {
        try {
            localStorage.removeItem('auth_user');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false };
        }
    },

    /**
     * ฟังก์ชัน checkAuth - ตรวจสอบสถานะการเข้าสู่ระบบ
     * @returns {Object|null} ข้อมูลผู้ใช้หรือ null
     */
    checkAuth() {
        try {
            const storedUser = localStorage.getItem('auth_user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('auth_user');
            return null;
        }
    }
};

export default loginService;
