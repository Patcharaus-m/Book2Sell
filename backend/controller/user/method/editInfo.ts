import { successRes, errRes } from "../../main";
import User from "../../../model/user";

export default async function editInfo(body: any) {
  try {
    // 1. ดึงข้อมูลและ ID จาก body (สมมติว่า middleware ส่ง userId มาให้ใน body แล้ว)
    const { userId, username, email, phone, profileImage } = body;

    if (!userId) {
      return errRes.BAD_REQUEST({ message: "ไม่พบ User ID สำหรับการแก้ไข" });
    }

    // 2. ค้นหาและอัปเดตข้อมูล
    // ใช้ { new: true } เพื่อให้ได้ข้อมูลที่อัปเดตแล้วกลับมาทันที
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        phone,
        profileImage
      },
      { new: true, runValidators: true }
    ).select("-password"); // ไม่ดึงรหัสผ่านออกมา

    if (!updatedUser) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบข้อมูลผู้ใช้ในระบบ" });
    }

    // 3. ส่งข้อมูลที่แก้ไขแล้วกลับไป
    return successRes(updatedUser);

  } catch (error: any) {
    console.error("Edit Info Error:", error);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}