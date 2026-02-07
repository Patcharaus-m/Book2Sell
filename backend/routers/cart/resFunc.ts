import { Request, Response } from "express";
import controllers from "../../controller/cart";

async function addToCart(req: Request, res: Response) {
    const { userId, bookId, quantity } = req.body;
    const data = await controllers.addToCart(userId, bookId, quantity);
    return res.status(data.code).json(data);
}

async function getCart(req: Request, res: Response) {
    const userId = req.query.userId as string;
    const data = await controllers.getCart(userId);
    return res.status(data.code).json(data);
}

async function removeFromCart(req: Request, res: Response) {
    const { userId, bookId } = req.body;
    const data = await controllers.removeFromCart(userId, bookId);
    return res.status(data.code).json(data);
}

async function increaseQuantity(req: Request, res: Response) {
    const { userId, bookId } = req.body;
    const data = await controllers.increaseQuantity(userId, bookId);
    return res.status(data.code).json(data);
}

async function decreaseQuantity(req: Request, res: Response) {
    const { userId, bookId } = req.body;
    const data = await controllers.decreaseQuantity(userId, bookId);
    return res.status(data.code).json(data);
}

async function clearCart(req: Request, res: Response) {
    const { userId } = req.body;
    const data = await controllers.clearCart(userId);
    return res.status(data.code).json(data);
}

export default {
    addToCart,
    getCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart
};