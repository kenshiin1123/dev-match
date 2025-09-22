import express from "express";
const router = express.Router();
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
  retrieveUserContacts,
  retrieveUserMessages,
} from "../../controllers/v1/messages.controller.js";

router.get("/", authMiddleware, retrieveUserContacts);
router.get("/:receiver_id", authMiddleware, retrieveUserMessages);

export default router;
