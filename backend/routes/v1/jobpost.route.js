import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
const router = express.Router();

// Controllers
import { postJob } from "../../controllers/v1/jobpost.controller.js";

// Verify token
router.use(authMiddleware);

// This is responsible for posting a job. the employers can only do this
router.post("/", postJob);

export default router;
