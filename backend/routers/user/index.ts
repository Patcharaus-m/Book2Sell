import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

// ใช้ POST ทั้งคู่เพราะมีการส่งข้อมูลสำคัญ (Password)
routers.post("/register", resFunc.register);
routers.post("/login", resFunc.login);
routers.post("/editInfo", resFunc.editInfo);
routers.post("/topUp", resFunc.topUp);

export default routers;