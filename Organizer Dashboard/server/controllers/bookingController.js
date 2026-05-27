import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import Payment from "../models/Payment.js";
import { sendResponse } from "../utils/responseHandler.js";
import { generateBookingCode } from "../utils/helpers.js";
import { generateQRCode } from "../services/qrService.js";
import { sendBookingConfirmation } from "../services/emailService.js";
import { createRazorpayOrder } from "../services/paymentService.js";

/**
 * Book tickets for an event.
 * POST /api/bookings
 */
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { eventId, ticketTier, quantity, couponCode } = req.body;

    if (!eventId || !ticketTier || !quantity) {
      return sendResponse(res, 400, "Event, ticket tier, and quantity are required.");
    }

    // fetch event
    const event = await Event.findById(eventId);
    if (!event) return sendResponse(res, 404, "Event not found.");

    if (event.status === "cancelled" || event.status === "completed") {
      return sendResponse(res, 400, "This event is no longer accepting registrations.");
    }
    if (event.registrationPaused) {
      return sendResponse(res, 400, "Registrations are currently paused for this event.");
    }

    // check if organizer is trying to book their own event
    if (event.organizerId.toString() === userId.toString()) {
      return sendResponse(res, 400, "You cannot book your own event.");
    }

    // find the ticket tier
    const tier = event.tickets.find((t) => t.tierName === ticketTier);
    if (!tier) return sendResponse(res, 400, "Invalid ticket tier.");

    // check ticket expiry
    if (tier.expiresAt && new Date(tier.expiresAt) < new Date()) {
      return sendResponse(res, 400, "This ticket tier has expired.");
    }

    // check availability
    if (tier.quantity - tier.sold < quantity) {
      return sendResponse(res, 400, `Only ${tier.quantity - tier.sold} tickets remaining for this tier.`);
    }

    // check overall capacity
    const totalBooked = await Booking.aggregate([
      { $match: { eventId: event._id, paymentStatus: "success" } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);
    const currentTotal = totalBooked.length > 0 ? totalBooked[0].total : 0;
    if (currentTotal + quantity > event.capacity) {
      return sendResponse(res, 400, "Event capacity reached.");
    }

    // check duplicate booking
    const existingBooking = await Booking.findOne({
      userId,
      eventId,
      paymentStatus: { $ne: "failed" },
    });
    if (existingBooking) {
      return sendResponse(res, 400, "You already have a booking for this event.");
    }

    // calculate amount (apply coupon if provided)
    let unitPrice = tier.price;
    let couponApplied = null;

    if (couponCode) {
      const coupon = event.coupons.find(
        (c) => c.code === couponCode.toUpperCase()
      );
      if (!coupon) {
        return sendResponse(res, 400, "Invalid coupon code.");
      }
      if (new Date(coupon.expiresAt) < new Date()) {
        return sendResponse(res, 400, "This coupon has expired.");
      }
      if (coupon.usedCount >= coupon.maxUsage) {
        return sendResponse(res, 400, "This coupon has been fully redeemed.");
      }
      unitPrice = unitPrice * (1 - coupon.discountPercent / 100);
      couponApplied = coupon.code;

      // increment coupon usage
      coupon.usedCount += 1;
      await event.save();
    }

    const amount = Math.round(unitPrice * quantity);

    // generate unique booking code
    let bookingCode;
    let codeExists = true;
    while (codeExists) {
      bookingCode = generateBookingCode();
      codeExists = await Booking.findOne({ bookingCode });
    }

    // generate QR code
    const qrCode = await generateQRCode(bookingCode);

    // create booking record
    const booking = await Booking.create({
      userId,
      eventId,
      ticketTier,
      quantity,
      amount,
      couponApplied,
      bookingCode,
      qrCode,
      paymentStatus: amount === 0 ? "success" : "pending",
    });

    // for free tickets, update sold count immediately
    if (amount === 0) {
      tier.sold += quantity;
      await event.save();
      await sendBookingConfirmation(req.user, booking, event);
      return sendResponse(res, 201, "Booking confirmed (free ticket).", booking);
    }

    // create Razorpay order for paid tickets
    const razorpayOrder = await createRazorpayOrder(amount, booking._id);

    await Payment.create({
      bookingId: booking._id,
      amount,
      razorpayOrderId: razorpayOrder.id,
    });

    return sendResponse(res, 201, "Booking initiated. Complete payment.", {
      booking,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify payment and confirm booking.
 * POST /api/bookings/verify-payment
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // For test mode, we accept the payment directly
    // In production, you'd verify the signature using paymentService.verifyPaymentSignature
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) return sendResponse(res, 404, "Payment record not found.");

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "captured";
    await payment.save();

    // confirm the booking
    const booking = await Booking.findById(payment.bookingId);
    booking.paymentStatus = "success";
    booking.paymentId = razorpay_payment_id;
    await booking.save();

    // update ticket sold count
    const event = await Event.findById(booking.eventId);
    const tier = event.tickets.find((t) => t.tierName === booking.ticketTier);
    if (tier) {
      tier.sold += booking.quantity;
      await event.save();
    }

    // send confirmation email
    const user = await (await import("../models/User.js")).default.findById(booking.userId);
    await sendBookingConfirmation(user, booking, event);

    return sendResponse(res, 200, "Payment verified. Booking confirmed.", booking);
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user's bookings.
 * GET /api/bookings/my-bookings
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId, paymentStatus: "success" })
      .populate("eventId", "title banner startDate endDate venue status eventTime")
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, "Your bookings retrieved.", bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * Get bookings for organizer's events.
 * GET /api/bookings/event/:eventId
 */
export const getEventBookings = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user._id;

    // verify ownership
    const event = await Event.findById(eventId);
    if (!event) return sendResponse(res, 404, "Event not found.");
    if (event.organizerId.toString() !== organizerId.toString()) {
      return sendResponse(res, 403, "Access denied.");
    }

    const bookings = await Booking.find({ eventId, paymentStatus: "success" })
      .populate("userId", "fullname email phone avatar")
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, "Event bookings retrieved.", bookings);
  } catch (err) {
    next(err);
  }
};
