import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendResponse } from "../utils/responseHandler.js";
import { sendCheckInConfirmation } from "../services/emailService.js";

/**
 * Check in an attendee by booking code (scanned from QR or entered manually).
 * POST /api/checkin
 */
export const checkInAttendee = async (req, res, next) => {
  try {
    const { bookingCode, eventId } = req.body;
    const organizerId = req.user._id;

    if (!bookingCode) {
      return sendResponse(res, 400, "Booking code is required.");
    }

    // verify the organizer owns this event
    const event = await Event.findById(eventId);
    if (!event) return sendResponse(res, 404, "Event not found.");
    if (event.organizerId.toString() !== organizerId.toString()) {
      return sendResponse(res, 403, "You can only check in attendees for your own events.");
    }

    // find the booking
    const booking = await Booking.findOne({ bookingCode, eventId })
      .populate("userId", "fullname email avatar");

    if (!booking) {
      return sendResponse(res, 404, "Invalid booking code for this event.");
    }

    if (booking.paymentStatus !== "success") {
      return sendResponse(res, 400, "Payment not completed for this booking.");
    }

    if (booking.checkedIn) {
      return sendResponse(res, 409, "This attendee has already been checked in.", {
        attendee: booking.userId,
        checkedInAt: booking.checkedInAt,
      });
    }

    // perform check-in
    booking.checkedIn = true;
    booking.checkedInAt = new Date();
    await booking.save();

    // send check-in email (non-blocking)
    const attendee = await User.findById(booking.userId);
    if (attendee) {
      sendCheckInConfirmation(attendee, event).catch(() => {});
    }

    return sendResponse(res, 200, "Check-in successful!", {
      attendee: booking.userId,
      ticketTier: booking.ticketTier,
      checkedInAt: booking.checkedInAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get live check-in stats for an event.
 * GET /api/checkin/stats/:eventId
 */
export const getCheckInStats = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return sendResponse(res, 404, "Event not found.");
    if (event.organizerId.toString() !== organizerId.toString()) {
      return sendResponse(res, 403, "Access denied.");
    }

    const stats = await Booking.aggregate([
      { $match: { eventId: event._id, paymentStatus: "success" } },
      {
        $group: {
          _id: null,
          totalRegistered: { $sum: "$quantity" },
          totalCheckedIn: {
            $sum: { $cond: ["$checkedIn", "$quantity", 0] },
          },
        },
      },
    ]);

    const result = stats.length > 0
      ? stats[0]
      : { totalRegistered: 0, totalCheckedIn: 0 };

    return sendResponse(res, 200, "Check-in stats retrieved.", {
      totalRegistered: result.totalRegistered,
      checkedIn: result.totalCheckedIn,
      remaining: result.totalRegistered - result.totalCheckedIn,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get list of checked-in attendees for an event.
 * GET /api/checkin/list/:eventId
 */
export const getCheckedInList = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const bookings = await Booking.find({
      eventId,
      paymentStatus: "success",
      checkedIn: true,
    })
      .populate("userId", "fullname email avatar")
      .sort({ checkedInAt: -1 })
      .lean();

    return sendResponse(res, 200, "Checked-in attendees retrieved.", bookings);
  } catch (err) {
    next(err);
  }
};
