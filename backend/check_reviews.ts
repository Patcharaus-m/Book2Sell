import mongoose from "mongoose";
import config from "./config";
import Review from "./model/review";

const connectDB = async () => {
    try {
        console.log("Connecting to DB...");
        if (!config.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in config");
        }
        await mongoose.connect(config.DATABASE_URL);
        console.log("MongoDB Connected");
        
        const reviews = await Review.find({});
        console.log(`Found ${reviews.length} reviews.`);
        
        if (reviews.length > 0) {
            reviews.forEach((review: any) => {
                console.log("Review:", {
                    id: review._id,
                    orderId: review.orderId,
                    reviewerId: review.reviewerId,
                    sellerId: review.sellerId,
                    rating: review.rating,
                    comment: review.comment
                });
            });
        }
        
        // Also check if there are any reviews with missing sellerId
        const badReviews = await Review.find({ sellerId: { $exists: false } });
        console.log(`Found ${badReviews.length} reviews without sellerId.`);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

connectDB();
