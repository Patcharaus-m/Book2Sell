// ✅ เปลี่ยน review เป็น Review (ตัวใหญ่) เพื่อความไม่งง
import Review from "@/model/review"; 
import { successRes, errRes } from "../../main";

export default async function getBySeller(sellerId: string) {
  try {
    const reviews = await Review.find({ sellerId: sellerId }) 
      // ✅ เพิ่ม "username" เข้าไปตรงนี้ด้วยครับ (สำคัญมากสำหรับหน้าเว็บ)
      .populate("reviewerId", "name email username profileImage") 
      .sort({ createdAt: -1 });

    return successRes(reviews);

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}