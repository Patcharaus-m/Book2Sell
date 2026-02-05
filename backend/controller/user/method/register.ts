import { successRes, errRes } from "../../main";
import User from "../../../model/user";
import { IUser } from "../../../types/user";

export default async function register(data: IUser) {
  try {
    // 1. เช็คความยาวรหัสผ่าน (ต้องครบ 16 ตัว)
    if (data.password && data.password.length < 6) {
      return errRes.BAD_REQUEST({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" });
    }

    // 2. เช็คตัวอักษรพิมพ์ใหญ่ (ต้องมีอย่างน้อย 1 ตัว)
    const hasUpperCase = /[A-Z]/.test(data.password || "");
    if (!hasUpperCase) {
      return errRes.BAD_REQUEST({ message: "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว" });
    }

    // --- Logic เดิมของคุณ ---
    // เช็คว่า Username หรือ Email ซ้ำไหม
    const existingUser = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }]
    });

    if (existingUser) {
      return errRes.BAD_REQUEST({ message: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว" });
    }

    // สร้าง User ใหม่
    const newUser = await User.create(data);
    const formatdeta = {
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      phone: newUser.phone,
      creditBalance: 0,
      _id: newUser.id,
      success: true
    }
    console.log(newUser)

    return successRes(formatdeta);

  } catch (error: any) {
    console.log(error)
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}