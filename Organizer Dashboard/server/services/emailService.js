import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

/**
 * Send booking confirmation email with QR code attached inline.
 */
export const sendBookingConfirmation = async (user, booking, event) => {
  try {
    const transporter = createTransporter();
    const eventDate = new Date(event.startDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await transporter.sendMail({
      from: `"EventSphere" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Booking Confirmed — ${event.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed ✓</h1>
          </div>
          <div style="padding: 32px;">
            <p style="color: #334155; font-size: 16px;">Hi <strong>${user.fullname}</strong>,</p>
            <p style="color: #475569;">Your booking for <strong>${event.title}</strong> has been confirmed.</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="color: #64748b; padding: 8px 0;">Event</td><td style="color: #1e293b; font-weight: 600; padding: 8px 0;">${event.title}</td></tr>
                <tr><td style="color: #64748b; padding: 8px 0;">Date</td><td style="color: #1e293b; padding: 8px 0;">${eventDate}</td></tr>
                <tr><td style="color: #64748b; padding: 8px 0;">Ticket</td><td style="color: #1e293b; padding: 8px 0;">${booking.ticketTier} × ${booking.quantity}</td></tr>
                <tr><td style="color: #64748b; padding: 8px 0;">Amount</td><td style="color: #1e293b; font-weight: 600; padding: 8px 0;">₹${booking.amount}</td></tr>
                <tr><td style="color: #64748b; padding: 8px 0;">Booking Code</td><td style="color: #4f46e5; font-weight: 700; font-size: 18px; padding: 8px 0;">${booking.bookingCode}</td></tr>
              </table>
            </div>
            <p style="color: #475569; font-size: 14px;">Show your booking code or QR at the venue for check-in.</p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">— EventSphere Team</p>
          </div>
        </div>
      `,
    });

    console.log(`Booking email sent to ${user.email}`);
  } catch (err) {
    // email failure shouldn't break the booking flow
    console.error("Failed to send booking email:", err.message);
  }
};

/**
 * Send check-in confirmation email.
 */
export const sendCheckInConfirmation = async (user, event) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"EventSphere" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `You're Checked In — ${event.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome! 🎉</h1>
          </div>
          <div style="padding: 32px; background: #f8fafc; border-radius: 0 0 12px 12px;">
            <p style="color: #334155;">Hi <strong>${user.fullname}</strong>,</p>
            <p style="color: #475569;">You've been successfully checked in to <strong>${event.title}</strong>. Enjoy the event!</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send check-in email:", err.message);
  }
};
