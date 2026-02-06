import order from "@/model/order";
import { successRes, errRes } from "../../main";

export default async function getHistory(userId: string) {
  try {
    const orders = await order.find({ buyerId: userId })
      .populate("bookId") // ดึงข้อมูลหนังสือมาโชว์ด้วย (รูป, ชื่อเรื่อง)
      .sort({ createdAt: -1 }); // เรียงจากล่าสุดไปเก่าสุด

    return successRes({ payload: orders });
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}