import { Router } from "express";
import {
  getOverviewStats,
  getRevenueAnalytics,
  getRegistrationAnalytics,
  getRecentActivity,
} from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";

const router = Router();

router.get("/overview", authenticate, roleGuard("organizer"), getOverviewStats);
router.get("/revenue", authenticate, roleGuard("organizer"), getRevenueAnalytics);
router.get("/registrations", authenticate, roleGuard("organizer"), getRegistrationAnalytics);
router.get("/recent-activity", authenticate, roleGuard("organizer"), getRecentActivity);

export default router;
