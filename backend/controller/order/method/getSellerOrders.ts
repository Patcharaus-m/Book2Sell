import Order from "@/model/order";
import Book from "@/model/book";
import { successRes, errRes } from "../../main";

export default async function getSellerOrders(sellerId: string) {
  try {
    // ดึงหนังสือทั้งหมดของ seller
    const sellerBooks = await Book.find({ sellerId }).select("_id");
    const bookIds = sellerBooks.map(b => b._id);

    // ดึง order ที่มี bookId ตรงกับหนังสือของ seller
    const orders = await Order.find({ bookId: { $in: bookIds } })
      .populate("bookId")
      .populate("buyerId", "name username profileImage")
      .sort({ createdAt: -1 });

    return successRes(orders);
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
