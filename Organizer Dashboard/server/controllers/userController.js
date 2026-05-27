import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { sendResponse } from "../utils/responseHandler.js";

/**
 * Update current user's profile.
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { fullname, phone, bio, organization, socialLinks, notificationPrefs } = req.body;

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (organization !== undefined) updateData.organization = organization;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (notificationPrefs) updateData.notificationPrefs = notificationPrefs;

    // handle avatar upload
    if (req.file) {
      const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploaded = await cloudinary.uploader.upload(b64, {
        folder: "eventsphere/avatars",
        resource_type: "image",
        transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }],
      });
      updateData.avatar = uploaded.secure_url;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, 200, "Profile updated successfully.", user);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a user's public profile.
 * GET /api/users/:id
 */
export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("fullname avatar bio organization socialLinks role")
      .lean();

    if (!user) return sendResponse(res, 404, "User not found.");

    return sendResponse(res, 200, "Profile retrieved.", user);
  } catch (err) {
    next(err);
  }
};
