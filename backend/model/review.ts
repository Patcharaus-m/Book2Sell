import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true }, // ให้คะแนนคนขาย [cite: 44]
    comment: { type: String }, // รีวิวเบื้องต้นเพื่อใช้ตัดสินใจ [cite: 34]
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Review", ReviewSchema);