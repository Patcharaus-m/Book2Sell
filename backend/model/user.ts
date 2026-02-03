import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // ชื่อ [cite: 36]
    password: { type: String, required: true }, // รหัส [cite: 37]
    email: { type: String, required: true, unique: true }, // อีเมล [cite: 39]
    phone: { type: String, required: true }, // เบอร์ [cite: 38]
    contactChannel: { type: String }, // ช่องทางติดต่อ [cite: 40]
    creditBalance: { type: Number, default: 0 }, // ระบบเครดิต [cite: 42]
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", UserSchema);