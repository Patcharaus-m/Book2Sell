import User from "../../../model/user";
import { successRes, errRes } from "../../main";

const CREDIT_RATE = 0.875; // 1 THB = 0.875 Credits

// Bonus tiers (same as frontend): 5% at 100 THB, +1% per tier
const AMOUNTS = [50, 100, 200, 300, 500, 1000];
function getBonusPct(amount: number): number {
  const idx = AMOUNTS.indexOf(amount);
  if (idx <= 0) return 0;
  return 4 + idx;
}

export default async function topUp(data: { userId: string, amount: number }) {
  try {
    const { userId, amount } = data;

    if (amount <= 0) {
      return errRes.BAD_REQUEST({ message: "ยอดเติมเงินต้องมากกว่า 0 บาท" });
    }

    const baseCredits = amount * CREDIT_RATE;
    const bonusPct = getBonusPct(amount);
    const bonusCredits = (baseCredits * bonusPct) / 100;
    const totalCredits = baseCredits + bonusCredits;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { creditBalance: totalCredits } },
      { new: true }
    );

    if (!updatedUser) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบผู้ใช้งาน" });
    }

    return successRes({
      message: `เติมเครดิตสำเร็จ ${amount} บาท = ${totalCredits} เครดิต`,
      payload: { creditBalance: updatedUser.creditBalance }
    });

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
