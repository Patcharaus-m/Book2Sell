import Book from "@/model/book";
import { successRes, errRes } from "../../main";

interface AddReviewPayload {
    bookId: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
}

export default async function addReview(payload: AddReviewPayload) {
    try {
        const { bookId, userId, userName, rating, comment } = payload;

        if (!bookId || !rating || !comment) {
            return errRes.BAD_REQUEST({ message: "กรุณากรอกข้อมูลให้ครบ" });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return errRes.BAD_REQUEST({ message: "ไม่พบหนังสือ" });
        }

        // Add new review to the book
        const newReview = {
            userId,
            userName: userName || "Anonymous",
            rating: Number(rating),
            comment,
            createdAt: new Date()
        };

        book.reviews.push(newReview);
        await book.save();

        return { status: true, code: 201, payload: book };
    } catch (error: any) {
        console.log(`Add Review Error: ${error.message}`);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
