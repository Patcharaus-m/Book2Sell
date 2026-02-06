import { Request, Response } from "express";
import controller from "@/controller/order/method";
import { errRes } from "../../controller/main";

async function createOrder(req: Request, res: Response) {
    // รับค่าจาก Frontend
    const { bookId, userId, shippingAddress } = req.body;

    if (!bookId || !shippingAddress) {
        return res.status(400).json(errRes.BAD_REQUEST({ message: "กรุณาระบุที่อยู่จัดส่ง" }));
    }

    // เรียก Controller
    const data = await controller.create({ bookId, buyerId: userId, shippingAddress });
    return res.status(data.code).json(data);
}

async function getMyOrders(req: Request, res: Response) {
    const { userId } = req.body; // หรือดึงจาก req.user.id
    const data = await controller.getHistory(userId);
    return res.status(data.code).json(data);
}

export default {
    createOrder,
    getMyOrders
};