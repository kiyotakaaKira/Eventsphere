import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import { sendResponse } from "../utils/responseHandler.js";

/**
 * Get dashboard overview stats for the organizer.
 * GET /api/analytics/overview
 */
export const getOverviewStats = async (req, res, next) => {
  try {
    const organizerId = req.user._id;

    // organizer's events
    const events = await Event.find({ organizerId }).lean();
    const eventIds = events.map((e) => e._id);

    // aggregate bookings
    const bookingStats = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds }, paymentStatus: "success" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalAttendees: { $sum: "$quantity" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    const stats = bookingStats.length > 0 ? bookingStats[0] : {
      totalRevenue: 0,
      totalAttendees: 0,
      totalBookings: 0,
    };

    const upcomingEvents = events.filter((e) => e.status === "upcoming").length;

    return sendResponse(res, 200, "Overview stats retrieved.", {
      totalEvents: events.length,
      totalRevenue: stats.totalRevenue,
      totalAttendees: stats.totalAttendees,
      upcomingEvents,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get revenue analytics (daily revenue for the last 30 days).
 * GET /api/analytics/revenue
 */
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const organizerId = req.user._id;
    const events = await Event.find({ organizerId }).select("_id").lean();
    const eventIds = events.map((e) => e._id);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          paymentStatus: "success",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // revenue per ticket tier
    const tierRevenue = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: "$ticketTier",
          revenue: { $sum: "$amount" },
          count: { $sum: "$quantity" },
        },
      },
    ]);

    return sendResponse(res, 200, "Revenue analytics retrieved.", {
      dailyRevenue,
      tierRevenue,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get registration analytics (registrations over time, peak hours).
 * GET /api/analytics/registrations
 */
export const getRegistrationAnalytics = async (req, res, next) => {
  try {
    const organizerId = req.user._id;
    const events = await Event.find({ organizerId }).select("_id").lean();
    const eventIds = events.map((e) => e._id);

    // registrations per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRegistrations = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          paymentStatus: "success",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          registrations: { $sum: "$quantity" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // peak booking hours
    const peakHours = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          paymentStatus: "success",
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return sendResponse(res, 200, "Registration analytics retrieved.", {
      dailyRegistrations,
      peakHours,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get recent activity feed for the organizer.
 * GET /api/analytics/recent-activity
 */
export const getRecentActivity = async (req, res, next) => {
  try {
    const organizerId = req.user._id;
    const events = await Event.find({ organizerId }).select("_id title").lean();
    const eventIds = events.map((e) => e._id);
    const eventMap = {};
    events.forEach((e) => { eventMap[e._id.toString()] = e.title; });

    const recentBookings = await Booking.find({
      eventId: { $in: eventIds },
      paymentStatus: "success",
    })
      .populate("userId", "fullname avatar")
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    const activity = recentBookings.map((b) => ({
      id: b._id,
      type: b.checkedIn ? "checkin" : "booking",
      user: b.userId?.fullname || "Unknown",
      avatar: b.userId?.avatar || "",
      event: eventMap[b.eventId.toString()] || "Unknown Event",
      ticketTier: b.ticketTier,
      amount: b.amount,
      timestamp: b.checkedIn ? b.checkedInAt : b.createdAt,
    }));

    return sendResponse(res, 200, "Recent activity retrieved.", activity);
  } catch (err) {
    next(err);
  }
};
