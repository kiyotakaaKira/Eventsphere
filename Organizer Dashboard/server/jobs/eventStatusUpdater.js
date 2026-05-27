import cron from "node-cron";
import Event from "../models/Event.js";

/**
 * Periodically update event statuses:
 * - "upcoming" → "live" when startDate is reached
 * - "live" → "completed" when endDate has passed
 *
 * Runs every 15 minutes.
 */
export const startEventStatusUpdater = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const now = new Date();

      // upcoming → live
      const activatedCount = await Event.updateMany(
        { status: "upcoming", startDate: { $lte: now }, endDate: { $gte: now } },
        { $set: { status: "live" } }
      );

      // live → completed
      const completedCount = await Event.updateMany(
        { status: "live", endDate: { $lt: now } },
        { $set: { status: "completed" } }
      );

      if (activatedCount.modifiedCount > 0 || completedCount.modifiedCount > 0) {
        console.log(
          `[StatusUpdater] ${activatedCount.modifiedCount} events activated, ${completedCount.modifiedCount} events completed.`
        );
      }
    } catch (err) {
      console.error("[StatusUpdater] Error:", err.message);
    }
  });

  console.log("Event status updater scheduled (every 15 min).");
};
