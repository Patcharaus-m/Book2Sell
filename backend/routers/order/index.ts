import express from "express";
import resFunc from "./resFunc";

const router = express.Router();

router.post("/create", resFunc.createOrder);
router.post("/history", resFunc.getMyOrders);
router.post("/seller-orders", resFunc.getSellerOrders);
router.post("/update-status", resFunc.updateStatus);

export default router;