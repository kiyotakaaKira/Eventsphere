"use client";

import { useEffect, useState } from "react";
import TicketCard from "@/parts/TicketCard";
import { evs } from "@/data/events";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("tickets") || "[]");
      const enriched = raw.map((t) => {
        const ev = evs.find((e) => e.id === t.eventId) || {};
        return { ...t, eventTitle: ev.title || "Event" };
      });
      setTickets(enriched);
    } catch {
      setTickets([]);
    }
  }, []);

  if (tickets.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-2xl">No tickets yet</p>
        <p className="mt-3 text-slate-400">Book an event and your tickets will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((t) => (
        <TicketCard key={t.id} ticket={t} />
      ))}
    </div>
  );
}
