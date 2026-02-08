
import mongoose from "mongoose";
import Book from "./model/book";
import User from "./model/user";
import { connectDB } from "./database";

async function run() {
    try {
        await connectDB();
        const bookId = "69880209073d04f2e37c2587";
        console.log(`Checking book: ${bookId}`);
        
        const book = await Book.findById(bookId);
        if (!book) {
            console.log("Book not found");
            return;
        }
        console.log("Book found:", JSON.stringify(book, null, 2));
        
        if (!book.sellerId) {
            console.log("Book has no sellerId");
            return;
        }
        
        console.log(`Checking sellerId: ${book.sellerId}`);
        const seller = await User.findById(book.sellerId);
        if (!seller) {
            console.log("Seller not found in Database");
        } else {
            console.log("Seller found:", JSON.stringify(seller, null, 2));
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
