import QRCode from "qrcode";

/**
 * Generate a QR code as a data URI (base64 PNG).
 * Encodes the booking code so it can be scanned at check-in.
 */
export const generateQRCode = async (bookingCode) => {
  try {
    const qrDataUri = await QRCode.toDataURL(bookingCode, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
      color: {
        dark: "#1e1b4b",
        light: "#ffffff",
      },
    });
    return qrDataUri;
  } catch (err) {
    console.error("QR generation failed:", err.message);
    return "";
  }
};
