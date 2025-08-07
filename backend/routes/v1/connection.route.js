import express from "express";
const router = express.Router();

import {
  establishConnection,
  acceptConnection,
  removeConnection,
  receivedConnectionRequest,
  sentConnectionRequest,
  // blockConnection,
  // getBlockedConnection,
} from "../../controllers/v1/connection.controller.js";

router.post("/connect", establishConnection);
router.patch("/:connection_id/accept", acceptConnection);
router.delete("/:connection_id/remove", removeConnection);

// router.post("/block", blockConnection);
router.get("/incoming", receivedConnectionRequest);
router.get("/sent", sentConnectionRequest);
// router.get("/", sentConnectionRequest);

export default router;
