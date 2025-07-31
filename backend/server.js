import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors("*"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  console.log(req.body);
  return res.json({
    message: "This is the root route of dev-match!",
    success: true,
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const { message = "Internal Server Error", status = 500, stack } = err;
  res.status(status).json({ message, success: false, data: { stack } });
});

app.listen(PORT, () => {
  console.log("Listening to port", PORT);
  connectDB();
});
