import { successRes, errRes } from "../../main";
import User from "../../../model/user";
import Book from "../../../model/book";

export default async function editInfo(body: any) {
  try {
    // 1. ดึงข้อมูลและ ID จาก body
    const { userId, username, email, phone, profileImage } = body;

    if (!userId) {
      return errRes.BAD_REQUEST({ message: "ไม่พบ User ID สำหรับการแก้ไข" });
    }

    // 2. ค้นหาและอัปเดตข้อมูล
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        phone,
        profileImage
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบข้อมูลผู้ใช้ในระบบ" });
    }

    // 3. Cascade Update: อัปเดตชื่อผู้ใช้ในรีวิวและหนังสือที่เกี่ยวข้อง
    // 3.1 อัปเดตชื่อในรีวิวที่ฝังอยู่ใน Book Schema (embedded reviews)
    if (username) {
        // อัปเดต userName ใน embedded reviews ของหนังสือที่ user นี้ไปรีวิวไว้
        await Book.updateMany(
            { "reviews.userId": userId },
            { $set: { "reviews.$[elem].userName": username } },
            { arrayFilters: [{ "elem.userId": userId }] }
        );
        
        // 3.2 (Optional) ถ้ามี sellerName ที่ denormalized ไว้ใน Book (แม้ไม่อยู่ใน schema หลัก) ให้ลองอัปเดตดู
        // เผื่อกรณี schema strict: false หรือข้อมูลเก่า
        try {
            await Book.updateMany(
                { sellerId: userId },
                { $set: { sellerName: username } } // ถ้า field ไม่มีใน schema อาจจะไม่ถูก save เว้นแต่ schema options อนุญาต
            );
        } catch (err) {
            console.log("Skipped sellerName update (schema restriction or field missing)");
        }
    }

    // 4. ส่งข้อมูลที่แก้ไขแล้วกลับไป
    return successRes(updatedUser);

  } catch (error: any) {
    console.error("Edit Info Error:", error);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}