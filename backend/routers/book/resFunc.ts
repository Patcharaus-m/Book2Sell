import controllers from "@/controller/book/method";
import { IBook } from "@/types/book";
import { Request, Response } from "express";

async function create(req: Request, res: Response) {
  // รับข้อมูลหนังสือจาก req.body แล้วส่งไปให้ controller.create ประมวลผล 
  const data = await controllers.create(req.body);
  
  // ส่ง Status Code และข้อมูลกลับไปให้ Client ในรูปแบบ JSON 
  return res.status(data.code).json(data);
}

const getAll = async (req: Request, res: Response) => {
    const result = await controllers.getAll(); // เรียก logic จาก controller
    res.status(result.code).json(result);
};

export default {
  create,
  getAll,
};