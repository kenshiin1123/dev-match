import express from "express";

// Routes
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import jobRoute from "./jobpost.route.js";
import connectionRoute from "./connection.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/connections", connectionRoute);
router.use("/jobposts", jobRoute);

export default router;
