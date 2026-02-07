import Cart from "../../model/cart";
import Book from "../../model/book";
import { successRes, errRes } from "../main";

export default async function addToCart(userId: string, bookId: string, quantity: number = 1) {
    try {
        // 1. ตรวจสอบสต็อกหนังสือ
        const book = await Book.findById(bookId);
        if (!book) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบหนังสือเล่มนี้" });
        }

        if (book.stock < quantity) {
            return errRes.BAD_REQUEST({ message: `สินค้าหมด หรือมีจำนวนไม่เพียงพอ (เหลือ ${book.stock} เล่ม)` });
        }

        let cart = await Cart.findOne({ userId });

        // 2. ถ้ายังไม่มีตะกร้า ให้สร้างใหม่
        if (!cart) {
            cart = await Cart.create({ userId, items: [{ bookId, quantity }] });
        } else {
            // เช็คว่ามีเล่มนี้ในตะกร้าหรือยัง
            const existingItem = cart.items.find(item => item.bookId.toString() === bookId);
            
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                
                if (newQuantity > book.stock) {
                    existingItem.quantity = book.stock;
                    await cart.save();
                    const populatedCart = await Cart.findById(cart._id).populate("items.bookId");
                    return successRes(populatedCart);
                }
                
                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({ bookId, quantity });
            }
            await cart.save();
        }

        // 3. Populate ข้อมูลหนังสือกลับไปเพื่อให้ Frontend แสดงผลได้ทันที
        const populatedCart = await Cart.findById(cart._id).populate("items.bookId");

        return successRes(populatedCart);
    } catch (error) {
        return errRes.INTERNAL_SERVER_ERROR({ message: "เกิดข้อผิดพลาดในการเพิ่มลงตะกร้า", payload: error });
    }
}