"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { evs, cats } from "@/data/events";
import EventCard from "@/parts/EventCard";

export default function EventsPage() {
  const [q, setQ] = useState("");
  const [c, setC] = useState("all");
  const [sv, setSv] = useState([]);

  useEffect(() => {
    try {
      setSv(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    } catch {
      setSv([]);
    }
  }, []);

  function toggleHeart(id) {
    setSv((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  }

  const list = evs
    .filter((ev) => c === "all" || ev.category === c)
    .filter((ev) => {
      if (!q.trim()) return true;
      const qq = q.toLowerCase();
      return ev.title.toLowerCase().includes(qq) || ev.location.toLowerCase().includes(qq) || ev.category.includes(qq);
    });

  return (
    <div>
      {/* ── Hero section ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative mb-8"
      >
        {/* subtle glow orb behind the heading */}
        <div className="hero-glow-orb pointer-events-none absolute -top-12 -left-16 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="hero-glow-orb pointer-events-none absolute -top-8 right-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" style={{ animationDelay: "3s" }} />

        <p className="text-sm font-medium text-accent tracking-wide">Spring 2026</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          Discover events
        </h1>
        <p className="mt-2 text-zinc-400 text-[15px]">hackathons + workshops near you</p>
      </motion.div>

      {/* ── Search bar ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 transition-colors duration-200 focus-within:border-sky-400/20 focus-within:bg-white/[0.05] sm:p-4"
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search title, venue..."
          className="w-full rounded-xl border border-white/8 bg-white/[0.04] py-3 px-4 text-sm focus:border-sky-400/40"
        />
      </motion.div>

      {/* ── Category pills ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-6 flex gap-2 overflow-x-auto pb-1"
      >
        {cats.map((cItem) => {
          const active = c === cItem;
          return (
            <button
              key={cItem}
              type="button"
              onClick={() => setC(cItem)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm capitalize transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-glow to-accent font-medium text-white shadow-md shadow-sky-500/10"
                  : "border border-white/8 bg-white/[0.04] text-zinc-400 hover:text-zinc-200 hover:border-white/12"
              }`}
            >
              {cItem}
            </button>
          );
        })}
      </motion.div>

      {/* ── Results count ─────────────────────────── */}
      <p className="mb-5 text-sm text-zinc-500">{list.length} events</p>

      {/* ── Event grid ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ev, i) => (
          <EventCard key={ev.id} ev={ev} index={i} onToggleWishlist={toggleHeart} saved={sv.includes(ev.id)} />
        ))}
      </div>

      {list.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] py-16 text-center text-zinc-500"
        >
          nothing matched that search
        </motion.p>
      )}
    </div>
  );
}
