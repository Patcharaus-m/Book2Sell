import Book from "@/model/book";
import { successRes, errRes } from "../../main";

export default async function deleteBook(data: { bookId: string, userId: string }) {
  try {
    const { bookId, userId } = data;

    // ค้นหาหนังสือ และเช็คว่าเป็นของ User คนนี้จริงไหม (ถ้ามีระบบ Login)
    // หมายเหตุ: ถ้าใน BookSchema ไม่ได้เก็บ sellerId ไว้ ให้ใช้แค่ findById(bookId) ก็ได้
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบหนังสือที่ต้องการลบ" });
    }

    // เช็คสิทธิ์เจ้าของ
    if (book.sellerId.toString() !== userId) {
      return errRes.FORBIDDEN({ message: "คุณไม่มีสิทธิ์ลบหนังสือเล่มนี้" });
    }

    // ทำ Soft Delete (แนะนำ)
    book.isDeleted = true;
    book.status = "closed"; // ปิดการขายไปด้วยเลย
    await book.save();

    // หรือถ้าจะลบถาวรให้ใช้: await Book.findByIdAndDelete(bookId);

    return successRes({ message: "ลบหนังสือเรียบร้อยแล้ว", id: bookId });
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}