import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/create", resFunc.create);
routers.get("/seller/:id", resFunc.getSellerReviews);
routers.get("/reviewer/:id", resFunc.getReviewerReviews);

export default routers;