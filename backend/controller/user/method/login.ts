import { successRes, errRes } from "../../main";
import User from "../../../model/user";
import { error } from "node:console";

export default async function login(body: any) {
  try {
    const { username, password } = body;

    // 1. หา User จาก Username [cite: 36]
    const user = await User.findOne({ username });
    if (!user) {
      console.log(user)
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบชื่อผู้ใช้งานนี้" });
    }

    // 2. เช็ครหัสผ่าน (เทียบตรงๆ ตามที่เก็บใน Model) [cite: 37]
    if (user.password !== password) {
      console.log(user)
      return errRes.BAD_REQUEST({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // 3. ถ้าผ่าน ให้ส่งข้อมูลกลับไป (ไม่ส่งรหัสผ่านกลับไปนะ) [cite: 35]
    const { password: _, ...userData } = user.toObject();

    return successRes(userData);
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}