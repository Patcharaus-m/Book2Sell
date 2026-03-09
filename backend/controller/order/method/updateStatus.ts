import Order from "@/model/order";
import Book from "@/model/book";
import { successRes, errRes } from "../../main";

const VALID_TRANSITIONS: Record<string, string> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};

export default async function updateStatus(data: { orderId: string; shippingStatus: string; sellerId?: string }) {
  try {
    const { orderId, shippingStatus } = data;

    const order = await Order.findById(orderId).populate("bookId");
    if (!order) return errRes.DATA_NOT_FOUND({ message: "ไม่พบออเดอร์" });

    // ตรวจสอบว่าสถานะใหม่ถูกต้องตาม flow
    const currentStatus = order.shippingStatus || "pending";
    const expectedNext = VALID_TRANSITIONS[currentStatus];

    if (shippingStatus !== expectedNext) {
      return errRes.BAD_REQUEST({
        message: `ไม่สามารถเปลี่ยนสถานะจาก "${currentStatus}" เป็น "${shippingStatus}" ได้`,
      });
    }

    order.shippingStatus = shippingStatus as "pending" | "confirmed" | "shipped" | "delivered";
    await order.save();

    return successRes({ order, message: "อัปเดตสถานะสำเร็จ" });
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
