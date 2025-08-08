import express from "express";
const router = express.Router();
import authMiddleware from "../../middlewares/authMiddleware.js";

// Controllers
import {
  patchUser,
  getUser,
  getEmployerPostedJobs,
  getUserApplications,
  employerApplicationResponse,
  getUsers,
  deleteUser,
} from "../../controllers/v1/user.controller.js";

// Get user applications
router.get("/applications", authMiddleware, getUserApplications);

// prettier-ignore
// This is used for employers to respond to an application
router.patch( "/applications/:application_id", authMiddleware, employerApplicationResponse );

// Employer role gets its posted jobs
router.get("/jobs", authMiddleware, getEmployerPostedJobs);

// Get specific user
router.get("/:user_id", getUser);

// Get all users
router.get("/", getUsers);

// Validate authorization token
router.use(authMiddleware);

// This route can only modify these following user data:
// name, location, skills, and company
router.patch("/", patchUser);

// Delete user
router.delete("/", deleteUser);

export default router;
