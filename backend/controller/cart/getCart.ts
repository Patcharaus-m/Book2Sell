import Cart from "../../model/cart";
import { successRes, errRes } from "../main";

export default async function getCart(userId: string) {
  try {
    // 1. ค้นหาตะกร้าของ user คนนี้
    const cart = await Cart.findOne({ userId })
      .populate("items.bookId"); 

    if (cart && cart.items.length > 0) {
        const firstItem = cart.items[0];
        console.log("getCart: First item bookId type:", typeof firstItem.bookId);
        console.log("getCart: First item bookId value:", firstItem.bookId);
        // Check if it's populated (should have title)
        if (firstItem.bookId && (firstItem.bookId as any).title) {
             console.log("getCart: Population SUCCESS. Title:", (firstItem.bookId as any).title);
        } else {
             console.log("getCart: Population FAILED. Not an object or missing title.");
        }
    } 

    // 2. ถ้ายังไม่มีตะกร้า ให้ส่ง items ว่างกลับไป
    if (!cart) {
      return successRes({ payload: { items: [] } });
    }

    // 3. ตรวจสอบว่ามีสินค้าที่หนังสือถูกลบไปแล้วหรือไม่ (Ghost Items)
    const validItems = cart.items.filter(item => item.bookId !== null);
    
    if (validItems.length !== cart.items.length) {
        console.log(`getCart: Found ${cart.items.length - validItems.length} invalid items. Cleaning up...`);
        cart.items = validItems as any;
        await cart.save(); // บันทึกการลบสินค้าที่ไม่มีอยู่จริงออกจาก DB ถาวร
    }

    return successRes(cart);

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}