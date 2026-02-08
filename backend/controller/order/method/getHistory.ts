import mongoose from "mongoose";
import order from "@/model/order";
import { successRes, errRes } from "../../main";

export default async function getHistory(userId: string) {
  try {
    console.log('=== GET ORDER HISTORY ===');
    console.log('userId received:', userId);
    
    // แปลง string เป็น ObjectId
    const buyerObjectId = new mongoose.Types.ObjectId(userId);
    console.log('Converted to ObjectId:', buyerObjectId);
    
    const orders = await order.find({ buyerId: buyerObjectId })
      .populate("bookId") // ดึงข้อมูลหนังสือมาโชว์ด้วย (รูป, ชื่อเรื่อง)
      .sort({ createdAt: -1 }); // เรียงจากล่าสุดไปเก่าสุด

    console.log('Found orders:', orders.length);
    return successRes(orders);
  } catch (error: any) {
    console.error('getHistory error:', error);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}