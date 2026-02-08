// frontend/src/services/orderService.js

export const createOrderService = async (orderData) => {
    // orderData ต้องมี { bookId, userId, shippingAddress }
    try {
        const response = await fetch("http://localhost:3000/api/order/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    } catch {
        return { status: false, message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" };
    }
};

// ดึงประวัติการสั่งซื้อของ user
export const getOrderHistoryService = async (userId) => {
    try {
        const response = await fetch("http://localhost:3000/api/order/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });
        return await response.json();
    } catch {
        return { status: false, message: "ไม่สามารถดึงประวัติการสั่งซื้อได้" };
    }
};