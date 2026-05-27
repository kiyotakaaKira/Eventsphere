import { Router } from "express";
import {
  checkInAttendee,
  getCheckInStats,
  getCheckedInList,
} from "../controllers/checkinController.js";
import { authenticate } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";

const router = Router();

router.post("/", authenticate, roleGuard("organizer"), checkInAttendee);
router.get("/stats/:eventId", authenticate, roleGuard("organizer"), getCheckInStats);
router.get("/list/:eventId", authenticate, roleGuard("organizer"), getCheckedInList);

export default router;
