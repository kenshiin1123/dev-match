import express from "express";

const router = express.Router();

// Controllers
import { register, login } from "../../controllers/v1/auth.controller.js";

router.post("/register", register);

router.post("/login", login);

export default router;
