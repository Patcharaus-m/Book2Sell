import { successRes, errRes } from "../../main";
import Book from "@/model/book";

export default async function getAll() {
  try {
    // ดึงเฉพาะหนังสือที่ยังขายอยู่ (status: 'available') และไม่ถูกลบ
    // populate sellerId เพื่อดึงชื่อผู้ลงขาย
    const books = await Book.find({ 
      status: 'available',
      isDeleted: { $ne: true }
    }).populate('sellerId', 'name').sort({ createdAt: -1 });

    return successRes(books);
  } catch (error: any) {
    console.log(`INTERNAL_SERVER_ERROR catch error: ${error.message}`);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}