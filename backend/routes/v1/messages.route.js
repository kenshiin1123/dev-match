import express from "express";
const router = express.Router();
import authMiddleware from "../../middlewares/authMiddleware.js";
import { retrieveUserContacts } from "../../controllers/v1/messages.controller.js";

router.get("/", authMiddleware, retrieveUserContacts);

export default router;
