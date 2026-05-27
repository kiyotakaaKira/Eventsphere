"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { evs } from "@/data/events";
import EventCard from "@/parts/EventCard";

export default function WishlistPage() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    } catch {
      setIds([]);
    }
  }, []);

  function toggle(id) {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  }

  const saved = ids.map((id) => evs.find((e) => e.id === id)).filter(Boolean);

  return (
    <div>
      <div>
        <p className="text-sm text-accent">saved for later</p>
        <h1 className="mt-1 text-4xl font-bold">Wishlist</h1>
        <p className="mt-2 text-slate-400">{saved.length} events</p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {saved.length === 0 ? (
          <div className="glass col-span-full rounded-2xl py-16 text-center">
            <p className="text-4xl">♡</p>
            <p className="mt-4 text-slate-400">nothing here yet</p>
            <Link href="/events" className="mt-6 inline-block text-accent">
              browse events →
            </Link>
          </div>
        ) : (
          saved.map((ev) => <EventCard key={ev.id} ev={ev} onToggleWishlist={toggle} saved={ids.includes(ev.id)} />)
        )}
      </div>
    </div>
  );
}
