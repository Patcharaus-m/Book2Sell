import controllers from "@/controller/book/method";
import { errRes } from "@/controller/main";
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

async function searchBook(req: Request, res: Response) {
  // รับค่าจาก query string เช่น /api/book/search?q=แฮร์รี่
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json(errRes.BAD_REQUEST({ message: "กรุณาใส่ชื่อหนังสือที่ต้องการค้นหา" }));
  }

  const data = await controllers.search(query);
  return res.status(data.code).json(data);
}

async function deleteBook(req: Request, res: Response) {
  // รับ bookId จาก params และ userId จาก body (หรือจาก token middleware ถ้ามี)
  const payload = {
    bookId: req.params.id as string,
    userId: req.body.userId as string // หรือ req.user.id
  };

  const data = await controllers.deleteBook(payload);
  return res.status(data.code).json(data);
}

async function getBySellerId(req: Request, res: Response) {
  const sellerId = req.params.sellerId as string;
  const data = await controllers.getBySellerId(sellerId);
  return res.status(data.code).json(data);
}

async function addReview(req: Request, res: Response) {
  const bookId = req.params.bookId as string;
  const { userId, userName, rating, comment } = req.body;
  const data = await controllers.addReview({ bookId, userId, userName, rating, comment });
  return res.status(data.code).json(data);
}

export default {
  create,
  getAll,
  searchBook,
  deleteBook,
  getBySellerId,
  addReview
};