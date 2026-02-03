import { successRes, errRes } from "../../main";
import Book from "@/model/book";

export default async function getAll() {
  try {
    // ดึงข้อมูลหนังสือทั้งหมด และเรียงจากใหม่ไปเก่า (createdAt: -1)
    const books = await Book.find().sort({ createdAt: -1 });
    
    return successRes(books);
  } catch (error: any) {
    console.log(`INTERNAL_SERVER_ERROR catch error: ${error.message}`);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}