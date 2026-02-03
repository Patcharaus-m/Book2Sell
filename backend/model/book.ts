import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // ชื่อเรื่อง [cite: 4]
    author: { type: String, required: true }, // ชื่อคนแต่ง [cite: 4]
    category: { type: String, required: true }, // หมวดหมู่ (นิยาย, การ์ตูน) [cite: 21]
    isbn: { type: String }, // ISBN [cite: 34]
    coverPrice: { type: Number }, // ราคาปก [cite: 4]
    sellingPrice: { type: Number, required: true }, // ราคามือสอง [cite: 4]
    condition: { type: String, required: true }, // สภาพหนังสือ (เช่น 90%) [cite: 4]
    description: { type: String }, // คำอธิบายตำหนิรายเล่ม [cite: 34]
    stock: { type: Number, default: 1 }, // สต็อก (มักมี 1 เล่ม) [cite: 4]
    status: { 
      type: String, 
      enum: ["available", "sold", "closed"], // สถานะ "ขายแล้ว" หรือ "ปิดการขาย" [cite: 8]
      default: "available" 
    },
    images: [{ type: String }], // รูปถ่ายจริงเห็นตำหนิชัดเจน (หลายรูป) [cite: 3, 34]
    isDeleted: { type: Boolean, default: false } // สำหรับ Soft Delete [cite: 8]
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Book", BookSchema);