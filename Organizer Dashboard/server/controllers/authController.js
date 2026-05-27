import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendResponse } from "../utils/responseHandler.js";

/**
 * Register a new user (organizer or attendee).
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password) {
      return sendResponse(res, 400, "Name, email, and password are required.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, "An account with this email already exists.");
    }

    const user = await User.create({
      fullname,
      email,
      password,
      role: role || "attendee",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 201, "Account created successfully.", {
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log in an existing user.
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, "Email and password are required.");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return sendResponse(res, 401, "Invalid email or password.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, "Invalid email or password.");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // strip password before sending
    user.password = undefined;

    return sendResponse(res, 200, "Logged in successfully.", {
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log out (clear cookie).
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return sendResponse(res, 200, "Logged out successfully.");
};

/**
 * Get the currently authenticated user.
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return sendResponse(res, 200, "User profile retrieved.", req.user);
};
