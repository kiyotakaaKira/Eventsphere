"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { evs, fmtDate } from "@/data/events";

function ticketStatus(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T12:00:00");
  if (d < today) return "Expired";
  if (d.getTime() === today.getTime()) return "Checked In";
  return "Upcoming";
}

const badgeClass = {
  Upcoming: "bg-accent/20 text-accent border-accent/30",
  "Checked In": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Expired: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    try {
      setTickets(JSON.parse(localStorage.getItem("tickets") || "[]"));
    } catch {
      setTickets([]);
    }
  }, []);

  const rows = tickets
    .slice()
    .reverse()
    .map((ticket) => {
      const ev = evs.find((e) => e.id === ticket.eventId);
      return ev ? { ticket, ev } : null;
    })
    .filter(Boolean);

  return (
    <div>
      <div>
        <p className="text-sm text-accent">check-in ready</p>
        <h1 className="mt-1 text-4xl font-bold">My tickets</h1>
        <p className="mt-2 text-zinc-400">view all your bookings here</p>
      </div>

      <div className="mt-8 space-y-5">
        {rows.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center">
            <p className="text-4xl">🎟️</p>
            <p className="mt-4 text-zinc-400">no tickets yet</p>
            <Link href="/events" className="mt-6 inline-block rounded-xl bg-gradient-to-r from-glow to-accent px-5 py-2.5 text-sm font-medium text-white">
              find events
            </Link>
          </div>
        ) : (
          rows.map(({ ticket, ev }) => {
            const status = ticketStatus(ev.date);
            return (
              <div key={ticket.id} className="glass glow-ring overflow-hidden rounded-2xl">
                <div className="relative h-28">
                  <Image src={ev.image} alt={ev.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] to-transparent" />
                  <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs ${badgeClass[status]}`}>
                    {status}
                  </span>
                </div>
                <div className="p-5 sm:flex sm:gap-5">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{ev.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">📍 {ev.location}</p>
                    <p className="text-sm text-zinc-400">📅 {fmtDate(ev.date)}</p>
                    {ticket.ticketType && <p className="mt-1 text-sm text-zinc-500">🎫 {ticket.ticketType}</p>}
                    {ticket.bookingId && (
                      <p className="mt-2 font-mono text-xs text-zinc-500">
                        booking <span className="text-accent">{ticket.bookingId}</span>
                      </p>
                    )}
                    <p className="font-mono text-xs text-zinc-600">#{ticket.id}</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:mt-0">
                    <Link href={`/event/${ev.id}`} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-center text-white hover:bg-white/5">
                      event details
                    </Link>
                    <button type="button" disabled className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-400">
                      share soon
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
