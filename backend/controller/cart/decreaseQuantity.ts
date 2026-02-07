import Cart from "../../model/cart";
import { successRes, errRes } from "../main";

export default async function decreaseQuantity(userId: string, bookId: string) {
    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบตะกร้าสินค้า" });
        }

        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);

        if (itemIndex === -1) {
            return errRes.BAD_REQUEST({ message: "ไม่พบสินค้านี้ในตะกร้า" });
        }

        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            // ถ้าเหลือ 1 แล้วลดอีก ก็ลบออกเลย
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();

        // Populate for frontend
        const populatedCart = await Cart.findById(cart._id).populate("items.bookId");

        return successRes(populatedCart);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
