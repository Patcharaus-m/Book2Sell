import { successRes, errRes } from "../../main";
import Book from "@/model/book";
import { IBook } from "@/types/book";

export default async function create(data: IBook) {
  try {
    // ตรวจสอบราคาขาย: ต้องมากกว่า 0 และไม่เกิน 999,999
    if (!data.sellingPrice || data.sellingPrice <= 0) {
      return errRes.BAD_REQUEST({ message: "ราคาขายต้องมากกว่า 0" });
    }
    if (data.sellingPrice > 999999) {
      return errRes.BAD_REQUEST({ message: "ราคาขายต้องไม่เกิน 999,999" });
    }

    // ตรวจสอบ ISBN: ถ้ามีต้องยาว 13 หลักพอดี
    if (data.isbn && data.isbn.length !== 13) {
      return errRes.BAD_REQUEST({ message: "ISBN ต้องมี 13 หลัก" });
    }

    console.log("Creating book with title (duplicate allowed):", data.title);
    const newBook = await Book.create(data);
    return successRes(newBook);
  } catch (error: any) {
    console.log(`INTERNAL_SERVER_ERROR catch error: ${error.message}`);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
