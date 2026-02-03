import { successRes, errRes } from "../../main"; 
import Book from "@/model/book";
import { IBook } from "@/types/book";

export default async function create(data: IBook) {
  try {
    // ตรวจสอบว่าชื่อหนังสือซ้ำไหม (ตามตัวอย่างที่คุณส่งมา)
    const existingBook = await Book.findOne({ title: data.title });
    if (existingBook) {
      return errRes.BAD_REQUEST({ message: "หนังสือเล่มนี้มีในระบบแล้ว" });
    }

    const newBook = await Book.create(data);
    return successRes(newBook);
  } catch (error: any) {
    console.log(`INTERNAL_SERVER_ERROR catch error: ${error.message}`);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}