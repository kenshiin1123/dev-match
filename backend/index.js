import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import indexRouteV1 from "./routes/v1/index.route.js";
import { Server } from "socket.io";
import { establishConnection } from "./controllers/v2/connection.controller.js";
import wrapAsyncSocket from "./utils/wrapAsyncSocket.js";
import { removeConnection } from "./controllers/v2/connection.controller.js";
import authMiddleware, {
  socketAuthMiddleware,
} from "./middlewares/authMiddleware.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// For socket.io
const eventListeners = [
  { event: "establish_connection", fn: establishConnection },
  { event: "remove_connection", fn: removeConnection },
];

const userSocketMap = new Map();
export const getUserSocketId = (user_id) => {
  return userSocketMap.get(user_id);
};

app.use(cors("*"));
// app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
// app.use(limiter);

app.get("/", (req, res) => {
  return res.json({
    message: "This is the root route of dev-match!",
    success: true,
  });
});

app.use("/api/v1", indexRouteV1);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Resource not found. Please check the URL and try again.",
    success: false,
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const { message = "Internal Server Error", status = 500, stack, data } = err;
  res.status(status).json({ message, success: false, data });
});

io.use(socketAuthMiddleware);

// Loop instead of hard code
io.on("connection", (socket) => {
  const user_id = socket.data.token.user_id;
  userSocketMap.set(user_id, socket.id);

  eventListeners.forEach((listener) => {
    const evt = listener.event;
    const fn = listener.fn;

    socket.on(
      evt,
      // This wrapper is used to handle errors
      wrapAsyncSocket((data) => fn(evt, data, socket), socket, evt)
    );
  });
});

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
  connectDB();
});
