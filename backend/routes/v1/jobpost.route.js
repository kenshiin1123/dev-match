import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
const router = express.Router();

// Controllers
import {
  patchJob,
  postJob,
  getListOfJobs,
  getJob,
  applyJob,
} from "../../controllers/v1/jobpost.controller.js";

// For retrieving jobs or specific job
router.get("/", getListOfJobs);
router.get("/:jobpost_id", getJob);

// Verify token
router.use(authMiddleware);

// This is responsible for posting a job. the employers can only do this
router.post("/", postJob);
router.patch("/:jobpost_id", patchJob);

// This is for developers
router.patch("/:jobpost_id/apply", applyJob);

export default router;
