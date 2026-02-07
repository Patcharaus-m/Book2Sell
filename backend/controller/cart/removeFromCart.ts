import Cart from "../../model/cart";
import { successRes, errRes } from "../main";

export default async function removeFromCart(userId: string, bookId: string) {
  try {
    // 1. ใช้ findOneAndUpdate เพื่อลบและขอข้อมูลใหม่คืนมาทีเดียว
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { 
        $pull: { items: { bookId: bookId } } // ✅ ลบ item ที่มี bookId ตรงกันออกจาก array
      },
      { new: true } // ขอข้อมูลใหม่หลังลบเสร็จ
    ).populate("items.bookId"); // Populate กลับไปด้วย เพื่อให้หน้าจอลบแล้วเห็นผลทันที

    if (!updatedCart) {
        return errRes.DATA_NOT_FOUND({ message: "ไม่พบตะกร้าสินค้า" });
    }

    return successRes(updatedCart);

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}