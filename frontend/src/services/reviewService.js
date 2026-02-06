// frontend/src/services/reviewService.js

export const createReviewService = async (reviewData) => {
    // reviewData ต้องมี { orderId, userId, rating, comment }
    try {
        const response = await fetch("http://localhost:3000/api/review/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData)
        });
        return await response.json();
    } catch (error) {
        return { status: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
    }
};