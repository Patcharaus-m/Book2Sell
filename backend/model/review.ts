import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // ✅ เพิ่มบรรทัดนี้: เก็บว่ารีวิวนี้ให้คะแนนใคร (คนขาย)
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Review", ReviewSchema);