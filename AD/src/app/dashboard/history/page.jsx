"use client";

import { useEffect, useState } from "react";
import { evs } from "@/data/events";

export default function HistoryPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("tickets") || "[]");
      const past = raw.filter((t) => {
        const ev = evs.find((e) => e.id === t.eventId);
        if (!ev) return false;
        return new Date(ev.date + "T12:00:00") < new Date();
      });
      setTickets(past);
    } catch {
      setTickets([]);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">History</h1>
      <p className="text-sm text-slate-400 mt-1">Events you've attended in the past</p>
      <div className="mt-6 space-y-4">
        {tickets.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-slate-400">No past events yet</div>
        ) : (
          tickets.map((t) => {
            const ev = evs.find((e) => e.id === t.eventId) || { title: "Event" };
            return (
              <div key={t.id} className="glass rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-xs text-slate-400">{t.ticketType} · {new Date(t.purchasedAt).toLocaleDateString()}</div>
                </div>
                <div className="text-xs text-slate-400">Attended</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
