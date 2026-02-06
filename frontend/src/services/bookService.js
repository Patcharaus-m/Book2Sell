export const searchBooks = async (query) => {
  try {
    const response = await fetch(`http://localhost:3000/api/book/search?q=${query}`);
    const data = await response.json();
    return data; // จะได้ code, status, payload (รายการหนังสือ)
  } catch (error) {
    console.error("Search API Error:", error);
    return { status: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
  }
};