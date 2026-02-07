import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // 1 User มี 1 ตะกร้า
    items: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
        quantity: { type: Number, default: 1 } // เผื่ออนาคตขายสินค้าที่มีหลายชิ้น
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Cart", CartSchema);