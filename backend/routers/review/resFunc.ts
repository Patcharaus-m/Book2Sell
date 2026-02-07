import { Request, Response } from "express";
import controller from "../../controller/review/method"; // อย่าลืมสร้าง index.ts ให้ controller น้า
import { errRes } from "../../controller/main";

async function create(req: Request, res: Response) {
    const { orderId, userId, rating, comment } = req.body;

    // Validate ข้อมูลเบื้องต้น
    if (!orderId || !rating) {
        return res.status(400).json(errRes.BAD_REQUEST({ message: "กรุณาระบุข้อมูลให้ครบถ้วน (OrderId, Rating)" }));
    }

    // ส่งต่อให้ Controller ทำงาน
    const data = await controller.create({
        orderId,
        reviewerId: userId, // หรือ req.user.id ถ้าใช้ Token
        rating,
        comment
    });

    return res.status(data.code).json(data);
}

export default {
    create
};