import express from "express";
import config from "./config";
import { cors } from "./middleware";
import { connectDB } from "./database";
import routers from "./routers/book";
import userRouter from "./routers/user";
import reviewRouter from "./routers/review";
import orderRouter from "./routers/order";

const app = express();

// Middleware
app.use(cors);
app.use(express.json());

app.use("/api/book", routers);
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);
app.use("/api/order", orderRouter);

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
