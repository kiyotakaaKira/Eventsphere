import mongoose from "mongoose";

const ticketTierSchema = new mongoose.Schema(
  {
    tierName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    sold: {
      type: Number,
      default: 0,
    },
    benefits: {
      type: String,
      default: "",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    maxUsage: {
      type: Number,
      required: true,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const eventSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: 200,
    },
    tagline: {
      type: String,
      default: "",
      maxlength: 300,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Technology",
        "Business",
        "Cultural",
        "Sports",
        "Music",
        "Food",
        "Education",
        "Networking",
        "Other",
      ],
    },
    banner: {
      type: String,
      default: "",
    },
    venue: {
      type: {
        type: String,
        enum: ["physical", "online"],
        default: "physical",
      },
      name: { type: String, default: "" },
      city: { type: String, default: "" },
      address: { type: String, default: "" },
      googleMapsUrl: { type: String, default: "" },
      meetingLink: { type: String, default: "" },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    eventTime: {
      type: String,
      default: "",
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
    tickets: [ticketTierSchema],
    coupons: [couponSchema],
    status: {
      type: String,
      enum: ["draft", "upcoming", "live", "completed", "cancelled"],
      default: "upcoming",
    },
    registrationPaused: {
      type: Boolean,
      default: false,
    },
    capacity: {
      type: Number,
      required: [true, "Event capacity is required"],
      min: 1,
    },
  },
  { timestamps: true }
);

// computed: remaining seats across all ticket tiers
eventSchema.virtual("totalSold").get(function () {
  return this.tickets.reduce((sum, tier) => sum + tier.sold, 0);
});

eventSchema.virtual("seatsRemaining").get(function () {
  return this.capacity - this.totalSold;
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

eventSchema.index({ organizerId: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: "text", description: "text" });

const Event = mongoose.model("Event", eventSchema);
export default Event;
