import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Register Service - จัดการการสมัครสมาชิกใหม่ผ่าน Backend
 * ใช้ axios แทน Fetch
 */

export const registerService = {
    /**
     * ฟังก์ชัน register - สมัครสมาชิกใหม่
     * @param {string} username - ชื่อผู้ใช้
     * @param {string} email - อีเมล
     * @param {string} password - รหัสผ่าน
     * @param {string} phone - เบอร์โทรศัพท์
     * @returns {Object} ข้อมูลผู้ใช้และสถานะ
     */
    async register(username, email, password, phone = '') {
        try {
            // ตรวจสอบความถูกต้องของข้อมูลพื้นฐาน
            if (!username || !email || !password) {
                return {
                    success: false,
                    message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
                };
            }

            if (password.length < 6) {
                return {
                    success: false,
                    message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
                };
            }

            // ตรวจสอบ format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    success: false,
                    message: 'รูปแบบอีเมลไม่ถูกต้อง'
                };
            }

            const response = await axios.post(`${API_BASE_URL}/user/register`, {
                username,
                email,
                password,
                phone: phone || '', // ส่งเบอร์โทรศัพท์ไป
                creditBalance: 0
            });
            console.log('Register API response:', response.data); // Debug log

            // Backend ใช้รูปแบบ { code, status, error, payload }
            // success อยู่ใน payload และ user data อยู่ใน payload ด้วย
            const payload = response.data.payload;
            
            if (payload && (payload.success === true || payload.success === "true")) {
                // ข้อมูล user อยู่ใน payload โดยตรง
                const userData = {
                    id: payload._id,
                    username: payload.username,
                    email: payload.email,
                    phone: payload.phone,
                    name: payload.username, // ใช้ username เป็น display name
                    storeCredits: payload.creditBalance || 0
                };
                

                return {
                    success: true,
                    user: userData,
                    message: 'สมัครสมาชิกสำเร็จ'
                };
            }

            // ถ้าไม่มี success ใน payload ให้เช็คจาก status code
            if (response.data.code === 201 && payload) {
                const userData = {
                    id: payload._id,
                    username: payload.username,
                    email: payload.email,
                    phone: payload.phone,
                    name: payload.username,
                    storeCredits: payload.creditBalance || 0
                };

                return {
                    success: true,
                    user: userData,
                    message: 'สมัครสมาชิกสำเร็จ'
                };
            }

            return {
                success: false,
                message: response.data.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
            };
        } catch (error) {
            let errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'ชื่อผู้ใช้นี้มีอยู่แล้ว หรือข้อมูลไม่ถูกต้อง';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    /**
     * ฟังก์ชัน validateUsername - ตรวจสอบว่าชื่อผู้ใช้มีอยู่แล้วหรือไม่ (Optional)
     * @param {string} username - ชื่อผู้ใช้
     * @returns {Object} ผลการตรวจสอบ
     */
    async validateUsername(username) {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/check-username`, {
                params: { username }
            });

            return {
                available: response.data.available,
                message: response.data.message
            };
        } catch (error) {
            console.error('Username validation error:', error);
            return {
                available: false,
                message: 'ไม่สามารถตรวจสอบชื่อผู้ใช้ได้'
            };
        }
    }
};

export default registerService;
