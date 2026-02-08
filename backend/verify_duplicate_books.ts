
import mongoose from "mongoose";
import Book from "./model/book";
import { connectDB } from "./database";

async function run() {
    try {
        await connectDB();
        const sellerId = "698838c037cfe40024eefdc8"; // Using a valid sellerId (assuming from previous context)
        const commonTitle = "Test Duplicate Book " + Date.now();
        
        console.log(`Attempting to create two books with title: "${commonTitle}"`);

        const book1Data = {
            sellerId,
            title: commonTitle,
            author: "Author A",
            category: "Fiction",
            sellingPrice: 100,
            condition: "90%",
            status: "available"
        };

        const book2Data = {
           sellerId,
            title: commonTitle,
            author: "Author B",
            category: "Non-Fiction",
            sellingPrice: 150,
            condition: "80%",
             status: "available"
        };

        const book1 = await Book.create(book1Data);
        console.log("Book 1 created:", book1._id);

        try {
             const book2 = await Book.create(book2Data);
             console.log("Book 2 created:", book2._id);
             console.log("SUCCESS: Created duplicate titles.");
        } catch (err) {
            console.error("FAILED to create second book:", err);
        }

        // Cleanup
        await Book.deleteMany({ title: commonTitle });
        console.log("Cleanup complete.");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
