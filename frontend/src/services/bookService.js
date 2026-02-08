export const searchBooks = async (query) => {
  try {
    const response = await fetch(`https://book2-backend.onrender.com/api/book/search?q=${query}`);
    const data = await response.json();
    return data; // จะได้ code, status, payload (รายการหนังสือ)
  } catch (error) {
    console.error("Search API Error:", error);
    return { status: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
  }
};

// ดึงหนังสือตาม sellerId (สำหรับหน้าสินค้าในร้าน)
export const getBooksBySellerId = async (sellerId) => {
  try {
    const response = await fetch(`https://book2-backend.onrender.com/api/book/seller/${sellerId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get Books by Seller API Error:", error);
    return { status: false, message: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้" };
  }
};

// ฟังก์ชันลบหนังสือ (ต้องส่ง userId ไปยืนยันตัวตนด้วย)
export const deleteBookService = async (bookId, userId) => {
  try {
    const response = await fetch(`https://book2-backend.onrender.com/api/book/${bookId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    return await response.json();
  } catch (error) {
    return { status: false, message: error.message };
  }
};

// ฟังก์ชันอัปเดตหนังสือ
export const updateBookService = async (bookId, bookData, userId) => {
  try {
    const response = await fetch(`https://book2-backend.onrender.com/api/book/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...bookData, userId })
    });
    return await response.json();
  } catch (error) {
    return { status: false, message: error.message };
  }
};