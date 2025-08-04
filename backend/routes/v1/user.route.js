import express from "express";
const router = express.Router();
import authMiddleware from "../../middlewares/authMiddleware.js";

// Controllers
import {
  patchUser,
  getUser,
  getUsers,
} from "../../controllers/v1/user.controller.js";

// Get specific user
router.get("/:user_id", getUser);

// Get all users
router.get("/", getUsers);

// Validate authorization token
router.use(authMiddleware);

// This route can only modify these following user data:
// name, location, skills, and company
router.patch("/", patchUser);

export default router;
