import controller from "@/controller/user/method"; // ดึง controller/user/index.ts มาใช้
import { IUser } from "@/types/user";
import { Request, Response } from "express";

// ฟังก์ชันสำหรับสมัครสมาชิก
async function register(req: Request, res: Response) {
  const data = await controller.register(req.body);
  return res.status(data.code).json(data);
}

// ฟังก์ชันสำหรับเข้าสู่ระบบ
async function login(req: Request, res: Response) {
  const data = await controller.login(req.body);
  return res.status(data.code).json(data);
}

export default {
  register,
  login,
};