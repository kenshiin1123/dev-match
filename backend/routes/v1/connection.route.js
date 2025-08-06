import express from "express";
const router = express.Router();

import {
  establishConnection,
  acceptConnection,
  rejectConnection,
  cancelConnection,
  removeConnection,
  blockConnection,
  unblockConnection,
  receivedConnectionRequest,
  sentConnectionRequest,
} from "../../controllers/v1/connection.controller.js";

router.post("/connect", establishConnection);
router.patch("/:connection_id/accept", acceptConnection);
router.patch("/:connection_id/reject", rejectConnection);
router.delete("/:connection_id/cancel", cancelConnection);
router.delete("/:connection_id/remove", removeConnection);

router.post("/block", blockConnection);
router.delete("/:connection_id/unblock", unblockConnection);

router.get("/:incoming", receivedConnectionRequest);

router.get("/:sent", sentConnectionRequest);

export default router;
