import { Router } from "express";
import {
  createBooking,
  verifyPayment,
  getMyBookings,
  getEventBookings,
} from "../controllers/bookingController.js";
import { authenticate } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";

const router = Router();

// attendee
router.post("/", authenticate, roleGuard("attendee"), createBooking);
router.post("/verify-payment", authenticate, verifyPayment);
router.get("/my-bookings", authenticate, getMyBookings);

// organizer
router.get("/event/:eventId", authenticate, roleGuard("organizer"), getEventBookings);

export default router;
