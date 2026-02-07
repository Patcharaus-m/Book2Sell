import express from "express";
import resFunc from "./resFunc";

const router = express.Router();

router.post("/addToCart", resFunc.addToCart);
router.get("/getCart", resFunc.getCart);
router.delete("/removeFromCart", resFunc.removeFromCart);
router.put("/increaseQuantity", resFunc.increaseQuantity);
router.put("/decreaseQuantity", resFunc.decreaseQuantity);
router.delete("/clearCart", resFunc.clearCart);

export default router;
