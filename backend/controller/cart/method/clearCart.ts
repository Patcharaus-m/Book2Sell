import Cart from "../../../model/cart";
import { successRes, errRes } from "../../main";

export default async function clearCart(userId: string) {
  try {
    // ลบสินค้าทั้งหมดในตะกร้าของ user
    const result = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!result) {
      // ถ้าไม่มีตะกร้า ก็ไม่ต้องทำอะไร (ถือว่าสำเร็จ)
      return successRes({ items: [] });
    }

    return successRes(result);
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
