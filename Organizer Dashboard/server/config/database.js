import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;
  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsphere";

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });
      console.log(`✓ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      retries++;
      if (retries < maxRetries) {
        console.warn(
          `⚠ MongoDB connection failed. Retrying... (${retries}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds before retry
      } else {
        console.error(
          `✗ Database connection failed after ${maxRetries} attempts`
        );
        console.error(`\n⚠ Make sure MongoDB is running!`);
        console.error(`   Run in a separate terminal: mongod\n`);
        console.error(`   Error: ${err.message}\n`);
        process.exit(1);
      }
    }
  }
};

// graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

export default connectDB;
