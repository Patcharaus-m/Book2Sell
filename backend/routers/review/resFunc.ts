import { Request, Response } from "express";
import controller from "../../controller/review/method"; // หรือ path ที่ถูกต้อง
import { errRes } from "../../controller/main";

async function create(req: Request, res: Response) {
    // 👇 รับมาทั้งคู่เลย กันพลาด
    const { orderId, reviewerId, userId, rating, comment } = req.body;

    // 👇 ตัวแปรจริงที่จะใช้ คืออันไหนก็ได้ที่มีค่าส่งมา
    const finalReviewerId = reviewerId || userId;

    // Validate
    if (!orderId || !finalReviewerId || !rating) {
        return res.status(400).json(errRes.BAD_REQUEST({ message: "ข้อมูลไม่ครบ (ขาด orderId, reviewerId หรือ rating)" }));
    }

    const data = await controller.create({
        orderId,
        reviewerId: finalReviewerId, // ✅ ส่งตัวที่ถูกต้องไป
        rating,
        comment
    });

    return res.status(data.code).json(data);
}

async function getSellerReviews(req: Request, res: Response) {
    const { id } = req.params; 
    const data = await controller.getBySeller(id as string);
    return res.status(data.code).json(data);
}

async function getReviewerReviews(req: Request, res: Response) {
    const { id } = req.params; 
    const data = await controller.getByReviewer(id as string);
    return res.status(data.code).json(data);
}

export default {
    create,
    getSellerReviews,
    getReviewerReviews
};