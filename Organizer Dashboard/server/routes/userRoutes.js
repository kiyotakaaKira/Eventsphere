import { Router } from "express";
import { updateProfile, getPublicProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.put("/profile", authenticate, upload.single("avatar"), updateProfile);
router.get("/:id", getPublicProfile);

export default router;
