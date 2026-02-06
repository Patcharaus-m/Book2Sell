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

async function editInfo(req: Request, res: Response) {
  // รวมข้อมูลจาก body และดึง id จาก req.user (หรือจาก body ตามที่นายสะดวก)
  // สมมติว่านายใช้ Middleware และเก็บ id ไว้ใน req.user
  const payload = {
    ...req.body,
    userId: (req as any).user?.id || req.body.userId 
  };

  const data = await controller.editInfo(payload);
  return res.status(data.code).json(data);
}

export default {
  register,
  login,
  editInfo
};