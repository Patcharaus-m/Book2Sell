import express from "express";
import config from "./config";
import { cors } from "./middleware";
import { connectDB } from "./database";
import routers from "./routers/book";
import userRouter from "./routers/user";
import reviewRouter from "./routers/review";
import orderRouter from "./routers/order";
import cartRouter from "./routers/cart";

const app = express();

// Middleware
app.use(cors);
app.use(express.json({ limit: '50mb' }));  // เพิ่ม limit สำหรับรูปภาพขนาดใหญ่
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/book", routers);
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

// Connect to database
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Book Selling API is running!" });
});

// Start server
const PORT = config.HOST_API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
