export const topUpService = async (userId, amount) => {
    try {
        const response = await fetch("https://book2-backend.onrender.com/api/user/topUp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, amount })
        });
        return await response.json();
    } catch {
        return { status: false, message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" };
    }
};