import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Routes
import indexRouteV1 from "./routes/v1/index.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(cors("*"));
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.get("/", (req, res) => {
  return res.json({
    message: "This is the root route of dev-match!",
    success: true,
  });
});

app.use("/api/v1", indexRouteV1);

// Error Handler Middleware
app.use((err, req, res, next) => {
  const { message = "Internal Server Error", status = 500, stack, data } = err;
  res.status(status).json({ message, success: false, data });
});

app.listen(PORT, () => {
  console.log("Listening to port", PORT);
  connectDB();
});
