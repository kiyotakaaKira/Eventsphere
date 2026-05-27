import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import cloudinary from "../config/cloudinary.js";
import { sendResponse } from "../utils/responseHandler.js";
import mongoose from "mongoose";

/**
 * Create a new event.
 * POST /api/events
 */
export const createEvent = async (req, res, next) => {
  try {
    const organizerId = req.user._id;
    let {
      title,
      tagline,
      description,
      category,
      venue,
      startDate,
      endDate,
      eventTime,
      registrationDeadline,
      tickets,
      coupons,
      capacity,
      status,
    } = req.body;

    if (!title || !description || !category || !startDate || !endDate || !capacity) {
      return sendResponse(res, 400, "Please fill in all required fields.");
    }

    // parse JSON strings from form-data
    if (typeof tickets === "string") tickets = JSON.parse(tickets);
    if (typeof coupons === "string") coupons = JSON.parse(coupons);
    if (typeof venue === "string") venue = JSON.parse(venue);

    let bannerUrl = "";
    if (req.file) {
      const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploaded = await cloudinary.uploader.upload(b64, {
        folder: "eventsphere/banners",
        resource_type: "image",
      });
      bannerUrl = uploaded.secure_url;
    }

    const event = await Event.create({
      organizerId,
      title,
      tagline: tagline || "",
      description,
      category,
      banner: bannerUrl,
      venue: venue || {},
      startDate,
      endDate,
      eventTime: eventTime || "",
      registrationDeadline: registrationDeadline || null,
      tickets: tickets || [],
      coupons: coupons || [],
      capacity: Number(capacity),
      status: status || "upcoming",
    });

    return sendResponse(res, 201, "Event created successfully.", event);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all public events with filtering, searching, and pagination.
 * GET /api/events
 */
export const getAllEvents = async (req, res, next) => {
  try {
    const {
      category,
      search,
      city,
      dateRange,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // build filter — only show non-draft, non-cancelled events publicly
    const filter = {
      status: { $in: ["upcoming", "live"] },
      registrationPaused: false,
    };

    if (category) {
      const cats = category.split(",").map((c) => c.trim());
      filter.category = { $in: cats };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (city) {
      filter["venue.city"] = { $regex: new RegExp(city, "i") };
    }

    if (dateRange) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateRange === "today") {
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        filter.startDate = { $gte: today, $lte: end };
      } else if (dateRange === "this-week") {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        filter.startDate = { $gte: today, $lte: endOfWeek };
      } else if (dateRange === "this-month") {
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filter.startDate = { $gte: today, $lte: endOfMonth };
      }
    }

    // sorting
    let sortOption = { startDate: 1 }; // default: soonest first
    if (sortBy === "newest") sortOption = { createdAt: -1 };
    if (sortBy === "price-low") sortOption = { "tickets.price": 1 };
    if (sortBy === "price-high") sortOption = { "tickets.price": -1 };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate("organizerId", "fullname avatar organization")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Event.countDocuments(filter),
    ]);

    return sendResponse(res, 200, "Events retrieved.", {
      events,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single event by ID.
 * GET /api/events/:id
 */
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, "Invalid event ID.");
    }

    const event = await Event.findById(id)
      .populate("organizerId", "fullname email avatar phone organization bio socialLinks")
      .lean();

    if (!event) {
      return sendResponse(res, 404, "Event not found.");
    }

    return sendResponse(res, 200, "Event retrieved.", event);
  } catch (err) {
    next(err);
  }
};

/**
 * Get organizer's own events.
 * GET /api/events/my-events
 */
export const getMyEvents = async (req, res, next) => {
  try {
    const organizerId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const filter = { organizerId };
    if (status) filter.status = status;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Event.countDocuments(filter),
    ]);

    // attach booking counts for each event
    const eventIds = events.map((e) => e._id);
    const bookingCounts = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds }, paymentStatus: "success" } },
      { $group: { _id: "$eventId", count: { $sum: "$quantity" }, revenue: { $sum: "$amount" } } },
    ]);

    const countMap = {};
    bookingCounts.forEach((b) => {
      countMap[b._id.toString()] = { ticketsSold: b.count, revenue: b.revenue };
    });

    const enriched = events.map((e) => ({
      ...e,
      ticketsSold: countMap[e._id.toString()]?.ticketsSold || 0,
      revenue: countMap[e._id.toString()]?.revenue || 0,
    }));

    return sendResponse(res, 200, "Your events retrieved.", {
      events: enriched,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an event.
 * PUT /api/events/:id
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizerId = req.user._id;

    const event = await Event.findById(id);
    if (!event) return sendResponse(res, 404, "Event not found.");

    if (event.organizerId.toString() !== organizerId.toString()) {
      return sendResponse(res, 403, "You can only edit your own events.");
    }

    let updateData = { ...req.body };

    // parse JSON strings from form-data
    if (typeof updateData.tickets === "string") updateData.tickets = JSON.parse(updateData.tickets);
    if (typeof updateData.coupons === "string") updateData.coupons = JSON.parse(updateData.coupons);
    if (typeof updateData.venue === "string") updateData.venue = JSON.parse(updateData.venue);

    // handle banner upload
    if (req.file) {
      const b64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploaded = await cloudinary.uploader.upload(b64, {
        folder: "eventsphere/banners",
        resource_type: "image",
      });
      updateData.banner = uploaded.secure_url;
    }

    const updated = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, 200, "Event updated successfully.", updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete an event.
 * DELETE /api/events/:id
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizerId = req.user._id;

    const event = await Event.findById(id);
    if (!event) return sendResponse(res, 404, "Event not found.");

    if (event.organizerId.toString() !== organizerId.toString()) {
      return sendResponse(res, 403, "You can only delete your own events.");
    }

    await Event.findByIdAndDelete(id);
    return sendResponse(res, 200, "Event deleted successfully.");
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel an event (soft delete — sets status to "cancelled").
 * PATCH /api/events/:id/cancel
 */
export const cancelEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizerId = req.user._id;

    const event = await Event.findById(id);
    if (!event) return sendResponse(res, 404, "Event not found.");

    if (event.organizerId.toString() !== organizerId.toString()) {
      return sendResponse(res, 403, "You can only cancel your own events.");
    }

    if (event.status === "cancelled") {
      return sendResponse(res, 400, "Event is already cancelled.");
    }

    event.status = "cancelled";
    await event.save();

    return sendResponse(res, 200, "Event cancelled.", event);
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle registration pause.
 * PATCH /api/events/:id/toggle-registration
 */
export const toggleRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return sendResponse(res, 404, "Event not found.");

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return sendResponse(res, 403, "Unauthorized.");
    }

    event.registrationPaused = !event.registrationPaused;
    await event.save();

    const msg = event.registrationPaused
      ? "Registrations paused."
      : "Registrations resumed.";

    return sendResponse(res, 200, msg, event);
  } catch (err) {
    next(err);
  }
};
