export const topUpService = async (userId, amount) => {
    try {
        const response = await fetch("http://localhost:3000/api/user/topUp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, amount })
        });
        return await response.json();
    } catch {
        return { status: false, message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" };
    }
};