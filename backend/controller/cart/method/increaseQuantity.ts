import Cart from "../../../model/cart";
import Book from "../../../model/book";
import { successRes, errRes } from "../../main";

export default async function increaseQuantity(userId: string, bookId: string) {
    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบตะกร้าสินค้า" });
        }

        const itemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId);

        if (itemIndex === -1) {
            return errRes.BAD_REQUEST({ message: "ไม่พบสินค้านี้ในตะกร้า" });
        }

        // Check stock
        const book = await Book.findById(bookId);
        if (!book) {
             return errRes.DATA_NOT_FOUND({ message: "ไม่พบข้อมูลหนังสือ" });
        }

        if (cart.items[itemIndex].quantity >= book.stock) {
             return errRes.BAD_REQUEST({ message: `สินค้าหมด หรือมีจำนวนไม่เพียงพอ (เหลือ ${book.stock} เล่ม)` });
        }

        cart.items[itemIndex].quantity += 1;
        await cart.save();

        // Populate for frontend
        const populatedCart = await Cart.findById(cart._id).populate("items.bookId");

        return successRes(populatedCart);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: "เกิดข้อผิดพลาด: " + error.message });
    }
}
