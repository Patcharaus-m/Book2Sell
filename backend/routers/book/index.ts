import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

// กำหนดว่าถ้า Client ส่ง POST มาที่ "/" (ซึ่งคือ /api/book) ให้ทำงานที่ resFunc.create 
routers.post("/", resFunc.create);

// กำหนดว่าถ้า Client ส่ง GET มาที่ "/" (ซึ่งคือ /api/book) ให้ทำงานที่ resFunc.getAll
routers.get("/", resFunc.getAll);

routers.get("/search", resFunc.searchBook);

// ดึงหนังสือตาม sellerId
routers.get("/seller/:sellerId", resFunc.getBySellerId);

// แก้ไขหนังสือ
routers.put("/:id", resFunc.updateBook);

// ลบหนังสือ
routers.delete("/:id", resFunc.deleteBook);

export default routers;