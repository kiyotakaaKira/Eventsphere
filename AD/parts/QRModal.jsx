"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRModal({ id, title, onClose }) {
  const ref = useRef();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass p-6 rounded-2xl text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">Booking #{id}</p>
          <div className="mt-4 inline-block bg-white/6 p-4 rounded-lg">
            <QRCodeCanvas ref={ref} value={id} size={220} bgColor="#0a0f1a" fgColor="#ffffff" />
          </div>
          <div className="mt-4 flex justify-center gap-3">
            <button className="btn-primary" onClick={() => window.print()}>Download</button>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
