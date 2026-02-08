import Review from "@/model/review";
import Order from "@/model/order";
import Book from "@/model/book";
import { successRes, errRes } from "../../main";

export default async function getReviewsBySeller(sellerId: string) {
  try {
    // 1. Find all books by this seller
    const books = await Book.find({ sellerId }).select("_id");
    const bookIds = books.map(book => book._id);

    if (bookIds.length === 0) {
      return successRes({ message: "No books found for this seller", payload: [] });
    }

    // 2. Find all orders containing these books
    const orders = await Order.find({ bookId: { $in: bookIds } }).select("_id");
    const orderIds = orders.map(order => order._id);

    if (orderIds.length === 0) {
      return successRes({ message: "No orders found for this seller", payload: [] });
    }

    // 3. Find reviews linked to these orders
    const reviews = await Review.find({ orderId: { $in: orderIds } })
      .populate("reviewerId", "username email") // Get reviewer details
      .populate({
        path: "orderId",
        select: "bookId",
        populate: {
          path: "bookId",
          select: "title images"
        }
      })
      .sort({ createdAt: -1 });

    return successRes({ message: "Reviews fetched successfully", payload: reviews });

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
