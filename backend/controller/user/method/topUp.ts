import User from "../../../model/user";
import { successRes, errRes } from "../../main";

export default async function topUp(data: { userId: string, amount: number }) {
  try {
    const { userId, amount } = data;

    if (amount <= 0) {
        return errRes.BAD_REQUEST({ message: "ยอดเติมเงินต้องมากกว่า 0 บาท" });
    }

    // ✅ แก้ชื่อฟิลด์เป็น creditBalance ให้ตรงกับ Schema
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { creditBalance: amount } }, 
      { new: true }
    );

    if (!updatedUser) {
        return errRes.DATA_NOT_FOUND({ message: "ไม่พบผู้ใช้งาน" });
    }

    return successRes({ 
        message: `เติมเครดิตสำเร็จ ${amount} บาท`, 
        // ✅ ส่งกลับไปชื่อ creditBalance เหมือนกัน
        payload: { creditBalance: updatedUser.creditBalance } 
    });

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}