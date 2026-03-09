import { Request, Response } from "express";
import controller from "@/controller/order/method";
import { errRes } from "../../controller/main";

async function createOrder(req: Request, res: Response) {
    const { bookId, userId, shippingAddress } = req.body;

    if (!bookId || !shippingAddress) {
        return res.status(400).json(errRes.BAD_REQUEST({ message: "กรุณาระบุที่อยู่จัดส่ง" }));
    }

    const data = await controller.create({ bookId, buyerId: userId, shippingAddress });
    return res.status(data.code).json(data);
}

async function getMyOrders(req: Request, res: Response) {
    const { userId } = req.body;
    const data = await controller.getHistory(userId);
    return res.status(data.code).json(data);
}

async function getSellerOrders(req: Request, res: Response) {
    const { sellerId } = req.body;
    if (!sellerId) {
        return res.status(400).json(errRes.BAD_REQUEST({ message: "กรุณาระบุ sellerId" }));
    }
    const data = await controller.getSellerOrders(sellerId);
    return res.status(data.code).json(data);
}

async function updateStatus(req: Request, res: Response) {
    const { orderId, shippingStatus } = req.body;
    if (!orderId || !shippingStatus) {
        return res.status(400).json(errRes.BAD_REQUEST({ message: "กรุณาระบุ orderId และ shippingStatus" }));
    }
    const data = await controller.updateStatus({ orderId, shippingStatus });
    return res.status(data.code).json(data);
}

export default {
    createOrder,
    getMyOrders,
    getSellerOrders,
    updateStatus
};