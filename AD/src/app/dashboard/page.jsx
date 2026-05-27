"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import StatCard from "@/parts/StatCard";
import { evs } from "@/data/events";

const activity = [
  { icon: "🎟️", text: "Booked 2 tickets — Code & Coffee Sprint", when: "2h ago" },
  { icon: "♥", text: "Saved Stripe Dev Day", when: "yesterday" },
  { icon: "✓", text: "Checked in Campus Demo Day", when: "3d ago" },
  { icon: "↗", text: "Shared AI Builders Night ticket", when: "last week" },
];

export default function DashboardPage() {
  const [ticketCount, setTicketCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    try {
      setTicketCount(JSON.parse(localStorage.getItem("tickets") || "[]").length);
      setWishCount(JSON.parse(localStorage.getItem("wishlist") || "[]").length);
    } catch {}
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = evs
    .filter((e) => new Date(e.date + "T12:00:00") >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  const picks = [evs[3], evs[5], evs[1]].filter(Boolean);

  return (
    <div className="pb-10">
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-glow/20 via-panel/80 to-accent/10 p-6 backdrop-blur-xl sm:p-8"
      >
        <p className="text-sm text-accent">hey alex 👋</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">your dashboard</h1>
        <p className="mt-2 text-zinc-400">what&apos;s on this week</p>
        <div className="mt-4 flex gap-3">
          <Link href="/events" className="rounded-xl bg-gradient-to-r from-glow to-accent px-4 py-2 text-sm font-medium text-white">
            find events
          </Link>
          <Link href="/dashboard/tickets" className="glass rounded-xl px-4 py-2 text-sm">
            tickets
          </Link>
        </div>
      </motion.section>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard value={ticketCount} label="tickets" />
        <StatCard value={wishCount} label="wishlist" />
        <StatCard value={evs.length} label="live events" />
        <StatCard value={3} label="check-ins" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className="glass rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex justify-between">
              <h2 className="font-semibold">upcoming</h2>
              <Link href="/events" className="text-xs text-accent">all →</Link>
            </div>
            <ul className="mt-4 space-y-2">
              {upcoming.map((ev) => (
                <li key={ev.id}>
                  <Link href={`/event/${ev.id}`} className="flex justify-between rounded-xl border border-white/5 p-3 hover:bg-white/5">
                    <div>
                      <p className="font-medium">{ev.title}</p>
                      <p className="text-xs text-zinc-500">{ev.date} · {ev.category}</p>
                    </div>
                    <span className="text-accent">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass rounded-2xl p-5 backdrop-blur-xl">
            <h2 className="font-semibold">recent activity</h2>
            <ul className="mt-4 space-y-3">
              {activity.map((a, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">{a.icon}</span>
                  <div>
                    <p className="text-zinc-300">{a.text}</p>
                    <p className="text-xs text-zinc-500">{a.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="glass rounded-2xl p-5 backdrop-blur-xl lg:col-span-2">
          <h2 className="font-semibold">recommended</h2>
          <p className="text-xs text-zinc-500">you might like these</p>
          <div className="mt-4 space-y-3">
            {picks.map((ev) => (
              <Link key={ev.id} href={`/event/${ev.id}`} className="block overflow-hidden rounded-xl border border-white/10">
                <div className="relative h-20">
                  <Image src={ev.image} alt="" fill className="object-cover" sizes="280px" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{ev.title}</p>
                  <p className="text-xs text-zinc-500">{ev.price === 0 ? "free" : `$${ev.price}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
