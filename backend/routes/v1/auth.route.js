import express from "express";

const router = express.Router();

// Controllers
import { register } from "../../controllers/v1/auth.controller.js";

router.post("/register", register);

router.post("/login", (req, res) => {
  res.json({ message: "This is login route" });
});

export default router;
