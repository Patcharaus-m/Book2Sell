import Review from "@/model/review";
import Order from "@/model/order"; // สมมติว่ามี Model Order
import { successRes, errRes } from "../../main";

export default async function create(data: { orderId: string, reviewerId: string, rating: number, comment: string }) {
  try {
    const { orderId, reviewerId, rating, comment } = data;

    // 1. ตรวจสอบว่ามี Order นี้จริงไหม
    const order = await Order.findById(orderId);
    if (!order) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบคำสั่งซื้อนี้" });
    }

    // 2. (Optional) ตรวจสอบว่าคนที่รีวิว คือคนซื้อจริงไหม
    // if (order.buyerId.toString() !== reviewerId) return errRes.FORBIDDEN(...)

    // 3. ตรวจสอบว่า Order นี้เคยถูกรีวิวไปแล้วหรือยัง (กันการรีวิวซ้ำ)
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return errRes.BAD_REQUEST({ message: "คำสั่งซื้อนี้ได้รับการรีวิวไปแล้ว" });
    }

    // 4. สร้างรีวิว
    const newReview = await Review.create({
      orderId,
      reviewerId,
      rating,
      comment
    });

    return successRes({ message: "บันทึกรีวิวสำเร็จ", payload: newReview });

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}