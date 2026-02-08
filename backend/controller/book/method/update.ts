import mongoose from "mongoose";
import book from "@/model/book";
import { successRes, errRes } from "../../main";

interface UpdateBookPayload {
  bookId: string;
  userId: string;
  title?: string;
  author?: string;
  category?: string;
  isbn?: string;
  coverPrice?: number;
  sellingPrice?: number;
  condition?: string;
  description?: string;
  stock?: number;
  images?: string[];
}

export default async function updateBook(payload: UpdateBookPayload) {
  try {
    const { bookId, userId, ...updateData } = payload;

    console.log('=== UPDATE BOOK ===');
    console.log('bookId:', bookId);
    console.log('userId:', userId);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return errRes.BAD_REQUEST({ message: "รหัสหนังสือไม่ถูกต้อง" });
    }

    // หาหนังสือที่จะอัปเดต
    const existingBook = await book.findById(bookId);

    if (!existingBook) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบหนังสือนี้ในระบบ" });
    }

    // ตรวจสอบว่าเป็นเจ้าของหนังสือหรือไม่
    if (existingBook.sellerId.toString() !== userId) {
      return errRes.FORBIDDEN({ message: "คุณไม่มีสิทธิ์แก้ไขหนังสือนี้" });
    }

    // อัปเดตข้อมูล
    const updatedBook = await book.findByIdAndUpdate(
      bookId,
      { $set: updateData },
      { new: true } // ส่งกลับข้อมูลที่อัปเดตแล้ว
    );

    console.log('Book updated successfully:', updatedBook?.title);
    return successRes(updatedBook);

  } catch (error: any) {
    console.error('updateBook error:', error);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
