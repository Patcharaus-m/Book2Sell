import { Request, Response } from "express";
import controller from "@/controller/order/method";
import { errRes } from "../../controller/main";

async function createOrder(req: Request, res: Response) {
    // รับค่าจาก Frontend
    const { bookId, userId, shippingAddress } = req.body;
    
    // Debug: ดูข้อมูลที่ได้รับ
    console.log('=== ORDER CREATE API ===');
    console.log('Received body:', req.body);
    console.log('bookId:', bookId);
    console.log('userId:', userId);
    console.log('shippingAddress:', shippingAddress);

    if (!bookId || !shippingAddress) {
        console.log('VALIDATION FAILED: Missing bookId or shippingAddress');
        return res.status(400).json(errRes.BAD_REQUEST({ message: "กรุณาระบุที่อยู่จัดส่ง" }));
    }

    // เรียก Controller
    console.log('Calling controller.create...');
    const data = await controller.create({ bookId, buyerId: userId, shippingAddress });
    console.log('Controller response:', data);
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