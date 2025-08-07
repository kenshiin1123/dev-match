import express from "express";
const router = express.Router();
import authMiddleware from "../../middlewares/authMiddleware.js";

import {
  getConnections,
  establishConnection,
  acceptConnection,
  removeConnection,
  receivedConnectionRequest,
  sentConnectionRequest,
  // blockConnection,
  // getBlockedConnection,
} from "../../controllers/v1/connection.controller.js";

// AUTH MIDDLEWARE
router.use(authMiddleware);

// CONNECTION ROUTES
router.post("/connect", establishConnection);
router.get("/sent", sentConnectionRequest);
router.get("/incoming", receivedConnectionRequest);
router.get("/", getConnections);
router.patch("/:connection_id/accept", acceptConnection);
router.delete("/:connection_id/remove", removeConnection);
// router.post("/block", blockConnection);
// router.get("/block", getBlockedConnection);

export default router;
