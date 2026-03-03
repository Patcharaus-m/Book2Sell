import User from "../../../model/user";
import { successRes, errRes } from "../../main";

export default async function checkUsername(username: string) {
  try {
    if (!username || username.trim() === '') {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุ username" });
    }

    const existingUser = await User.findOne({ username: username.trim() });

    if (existingUser) {
      return successRes({
        available: false,
        message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"
      });
    }

    return successRes({
      available: true,
      message: "ชื่อผู้ใช้นี้สามารถใช้ได้"
    });

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
