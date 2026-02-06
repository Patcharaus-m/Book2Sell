import express from "express";
import resFunc from "./resFunc";

const router = express.Router();

router.post("/create", resFunc.createOrder); // สร้างคำสั่งซื้อ
router.post("/history", resFunc.getMyOrders); // ดูประวัติ

export default router;