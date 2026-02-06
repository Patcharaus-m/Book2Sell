import Book from "@/model/book";
import { successRes, errRes } from "../../main";

export default async function getBySellerld(sellerId: string) {
  try {
    if (!sellerId) {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุ sellerId" });
    }

    // ดึงหนังสือของ seller คนนี้ที่ยังไม่ถูกลบ
    const books = await Book.find({ 
      sellerId: sellerId, 
      isDeleted: { $ne: true } 
    }).sort({ createdAt: -1 }); // เรียงจากใหม่ไปเก่า

    return successRes(books);
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
