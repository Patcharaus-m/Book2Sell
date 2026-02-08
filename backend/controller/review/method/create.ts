import Review from "@/model/review";
import Order from "@/model/order"; 
import { successRes, errRes } from "../../main";

export default async function create(data: { orderId: string, reviewerId: string, rating: number, comment: string }) {
  try {
    const { orderId, reviewerId, rating, comment } = data;

    // 1. ตรวจสอบ Order + ✅ ดึงข้อมูลหนังสือมาด้วย (เพื่อหาคนขาย)
    const order: any = await Order.findById(orderId).populate("bookId"); 
    
    if (!order) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบคำสั่งซื้อนี้" });
    }

    // ✅ 2. เจาะเข้าไปเอา ID คนขาย (Seller)
    // โครงสร้างคือ: Order -> bookId (Book Model) -> sellerId (User Model)
    const sellerId = order.bookId?.sellerId;

    if (!sellerId) {
        return errRes.BAD_REQUEST({ message: "ไม่พบข้อมูลผู้ขายในสินค้านี้" });
    }

    // 3. ตรวจสอบว่าเคยรีวิวไปแล้วหรือยัง
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return errRes.BAD_REQUEST({ message: "คำสั่งซื้อนี้ได้รับการรีวิวไปแล้ว" });
    }

    // 4. สร้างรีวิว + ✅ บันทึก sellerId
    const newReview = await Review.create({
      orderId,
      reviewerId,
      sellerId, // <--- เพิ่มตรงนี้สำคัญมาก!
      rating,
      comment
    });

    return successRes({ message: "บันทึกรีวิวสำเร็จ", payload: newReview });

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}