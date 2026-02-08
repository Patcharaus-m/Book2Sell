// ดึงรีวิวที่ผู้ใช้เขียน (By Reviewer)
import Review from "@/model/review"; 
import { successRes, errRes } from "../../main";

export default async function getByReviewer(reviewerId: string) {
  try {
    const reviews = await Review.find({ reviewerId: reviewerId })
      .populate("sellerId", "name email username") // ดึงข้อมูลคนขาย
      .populate("orderId") // ดึงข้อมูล order เพื่อแสดงหนังสือ
      .sort({ createdAt: -1 });

    return successRes(reviews);

  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}
