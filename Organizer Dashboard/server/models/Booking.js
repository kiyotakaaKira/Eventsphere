import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketTier: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    couponApplied: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    qrCode: {
      type: String,
      default: "",
    },
    bookingCode: {
      type: String,
      unique: true,
      required: true,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, eventId: 1 });
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ paymentStatus: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
