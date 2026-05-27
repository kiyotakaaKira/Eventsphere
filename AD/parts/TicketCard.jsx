"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function TicketCard({ ticket }) {
  const [showQR, setShowQR] = useState(false);
  return (
    <article className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{ticket.eventTitle}</p>
          <p className="text-sm text-slate-400">{ticket.ticketType} · {new Date(ticket.purchasedAt).toLocaleDateString()}</p>
          <p className="mt-2 text-xs text-slate-500">Booking: {ticket.bookingId}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button onClick={() => setShowQR(true)} className="btn-secondary">View QR</button>
          <div className="h-16 w-16 rounded-lg bg-white/6 p-1">
            <QRCodeCanvas value={ticket.id} size={64} bgColor="#0a0f1a" fgColor="#ffffff" />
          </div>
        </div>
      </div>

      {showQR && (
        <div className="mt-3">
          <div className="glass p-4 rounded-xl">
            <QRCodeCanvas value={ticket.id} size={200} bgColor="#0a0f1a" fgColor="#ffffff" />
            <div className="mt-2 flex justify-between">
              <button className="btn-primary" onClick={() => window.print()}>Download</button>
              <button className="btn-secondary" onClick={() => setShowQR(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
