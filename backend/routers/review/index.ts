import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/create", resFunc.create);

export default routers;