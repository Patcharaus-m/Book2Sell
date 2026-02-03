import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shippingAddress: { type: String, required: true }, // ที่อยู่จัดส่ง [cite: 29]
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid"], 
      default: "pending" 
    },
    shippingStatus: { 
      type: String, 
      enum: ["preparing", "shipped"], // รอชำระเงิน -> กำลังเตรียมส่ง -> ส่งแล้ว [cite: 14]
      default: "preparing" 
    },
    trackingNumber: { type: String }, // เลข Tracking [cite: 15]
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Order", OrderSchema);