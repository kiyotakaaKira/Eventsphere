import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent,
  cancelEvent,
  toggleRegistration,
} from "../controllers/eventController.js";
import { authenticate } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";
import upload from "../middleware/upload.js";

const router = Router();

// public
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// organizer only
router.get("/dashboard/my-events", authenticate, roleGuard("organizer"), getMyEvents);
router.post("/", authenticate, roleGuard("organizer"), upload.single("banner"), createEvent);
router.put("/:id", authenticate, roleGuard("organizer"), upload.single("banner"), updateEvent);
router.delete("/:id", authenticate, roleGuard("organizer"), deleteEvent);
router.patch("/:id/cancel", authenticate, roleGuard("organizer"), cancelEvent);
router.patch("/:id/toggle-registration", authenticate, roleGuard("organizer"), toggleRegistration);

export default router;
