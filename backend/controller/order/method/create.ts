import Order from "@/model/order";
import Book from "@/model/book"; // ต้องเช็คสถานะและราคาหนังสือ
import User from "@/model/user"; // ต้องตัดเงินผู้ซื้อ
import { successRes, errRes } from "../../main";

export default async function create(data: { bookId: string, buyerId: string, shippingAddress: string }) {
  try {
    const { bookId, buyerId, shippingAddress } = data;

    // 1. เช็คข้อมูลหนังสือ (มีอยู่จริงไหม? ขายไปรึยัง?)
    const book = await Book.findById(bookId);
    if (!book) return errRes.DATA_NOT_FOUND({ message: "ไม่พบหนังสือ" });
    if (book.status !== 'available' || book.isDeleted) {
      return errRes.BAD_REQUEST({ message: "ขออภัย หนังสือเล่มนี้ถูกขายไปแล้ว" });
    }

    // 2. เช็คเงินในกระเป๋าผู้ซื้อ
    const buyer = await User.findById(buyerId);
    if (!buyer) return errRes.DATA_NOT_FOUND({ message: "ไม่พบข้อมูลผู้ซื้อ" });
    
    // ราคาขาย (sellingPrice)
    const price = book.sellingPrice || 0;

    if (buyer.creditBalance < price) {
        return errRes.BAD_REQUEST({ message: "ยอดเงินคงเหลือไม่พอ กรุณาเติมเครดิต" });
    }

    // 3. เริ่ม Transaction (ทำทุกอย่างให้เสร็จ)
    // 3.1 ตัดเงินผู้ซื้อ
    buyer.creditBalance -= price;
    await buyer.save();

    // 3.2 เปลี่ยนสถานะหนังสือเป็น 'ขายแล้ว'
    book.status = 'sold';
    await book.save();

    // 3.3 สร้าง Order
    const newOrder = await Order.create({
      bookId,
      buyerId,
      shippingAddress,
      paymentStatus: "paid", // ตัดเครดิตแล้วถือว่าจ่ายเลย
      shippingStatus: "preparing"
    });

    return successRes({ 
        message: "สั่งซื้อสำเร็จ! หักเครดิตเรียบร้อยแล้ว", 
        order: newOrder, 
        newBalance: buyer.creditBalance 
    });

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}