import express from "express";

// Routes
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import jobRoute from "./jobpost.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/users/jobposts", jobRoute);

export default router;
