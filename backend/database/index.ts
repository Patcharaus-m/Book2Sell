import mongoose from "mongoose";
import config from "../config";


export async function connectDB() {
  try {
    await mongoose.connect(
      config.DATABASE_URL ?? "mongodb://localhost:27017/book_selling"
    );
    console.log("Mongo DB connected");
  } catch (error) {
    console.error("Mongo DB connection error", error);
  }
}
