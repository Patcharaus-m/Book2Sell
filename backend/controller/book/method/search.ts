import Book from "@/model/book";
import { successRes, errRes } from "../../main";

export default async function search(query: string) {
  try {
    // ใช้ $regex เพื่อค้นหาคำที่ใกล้เคียง และ $options: "i" เพื่อให้ไม่สนตัวพิมพ์เล็ก-ใหญ่
    const books = await Book.find({
      title: { $regex: query, $options: "i" },
      status: "available", // ค้นหาเฉพาะเล่มที่ยังว่าง
      isDeleted: false     // และยังไม่ถูกลบ
    })
      .populate('sellerId', 'username email') // ดึงชื่อผู้ลงขาย
      .limit(10); // จำกัดผลลัพธ์ไว้ที่ 10 เล่มเพื่อความเร็ว

    return successRes(books);
  } catch (error: any) {
    console.log(`Search Error: ${error.message}`);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}