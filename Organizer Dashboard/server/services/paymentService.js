import razorpayInstance from "../config/razorpay.js";
import crypto from "crypto";

/**
 * Create a Razorpay order for the given amount (in INR).
 */
export const createRazorpayOrder = async (amount, bookingId) => {
  const options = {
    amount: amount * 100, // Razorpay expects paise
    currency: "INR",
    receipt: `booking_${bookingId}`,
    notes: {
      bookingId: bookingId.toString(),
    },
  };

  const order = await razorpayInstance.orders.create(options);
  return order;
};

/**
 * Verify the Razorpay payment signature to confirm authenticity.
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};
