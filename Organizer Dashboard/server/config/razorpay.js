import Razorpay from "razorpay";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance;

if (KEY_ID && KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
  });
} else {
  // Create a lightweight stub so the app doesn't crash at import time.
  // Calls to payment functions will throw a clear error explaining how
  // to enable Razorpay (set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`).
  console.warn(
    "Razorpay keys not found in environment. Payments will be disabled until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set."
  );

  razorpayInstance = {
    orders: {
      create: () => {
        throw new Error(
          "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment (or use server/.env)."
        );
      },
    },
  };
}

export default razorpayInstance;
