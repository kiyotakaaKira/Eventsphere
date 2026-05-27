"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { evs, gE } from "@/data/events";
import QRModal from "@/parts/QRModal";
import CountdownTimer from "@/parts/CountdownTimer";

function longDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventPage({ params }) {
  const { id } = use(params);
  const ev = gE(id);
  const [saved, setSaved] = useState(false);
  const [ticketId, setTicketId] = useState(ev?.tickets?.[0]?.id || "general");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [qrBooking, setQrBooking] = useState(null);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setSaved(list.includes(id));
    } catch {
      setSaved(false);
    }
    if (ev) {
      setTicketId(ev.tickets[0]?.id || "general");
      setQty(1);
      setMessage("");
    }
  }, [id, ev]);

  if (!ev) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-400">event not found</p>
        <Link href="/events" className="mt-4 inline-block text-accent">
          ← back
        </Link>
      </div>
    );
  }

  const picked = ev.tickets.find((t) => t.id === ticketId) || ev.tickets[0];
  const total = picked.price * qty;
  const similar = evs.filter((e) => e.category === ev.category && e.id !== ev.id).slice(0, 4);
  const left = ev.remaining;

  function toggleWishlist() {
    try {
      const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      setSaved(!saved);
    } catch {
      localStorage.setItem("wishlist", JSON.stringify([id]));
      setSaved(true);
    }
  }

  function buyTicket() {
    try {
      const old = JSON.parse(localStorage.getItem("tickets") || "[]");
      const bookingId = "BK-" + Date.now().toString(36).toUpperCase();
      const added = Array.from({ length: qty }, (_, index) => ({
        id: `TKT-${Date.now().toString(36).toUpperCase()}-${index}`,
        bookingId,
        eventId: ev.id,
        ticketType: picked.label,
        purchasedAt: new Date().toISOString(),
      }));
      localStorage.setItem("tickets", JSON.stringify([...old, ...added]));
      setMessage(`Booked ${qty} ticket${qty === 1 ? "" : "s"}!`);
      // show QR modal for the booking
      setQrBooking({ id: bookingId, title: ev.title });
    } catch {
      setMessage("Could not save ticket. Reload and try again.");
    }
  }

  const sidebar = (
    <div className="glass glow-ring rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Book tickets</h2>
      <p className="mt-1 text-sm text-zinc-500">{left} left</p>

      <div className="mt-4 space-y-2">
        {ev.tickets.map((t) => (
          <label
            key={t.id}
            className={`flex cursor-pointer justify-between rounded-xl border px-3 py-2.5 text-sm ${
              ticketId === t.id ? "border-accent/50 bg-accent/10" : "border-white/10"
            }`}
          >
            <span>
              <input
                type="radio"
                className="mr-2 accent-accent"
                checked={ticketId === t.id}
                onChange={() => setTicketId(t.id)}
              />
              {t.label}
            </span>
            <span className="text-accent">{t.price === 0 ? "Free" : `$${t.price}`}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-zinc-400">qty</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 rounded border border-white/10">
            −
          </button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(Math.min(left, qty + 1))} className="h-8 w-8 rounded border border-white/10">
            +
          </button>
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-accent">{total === 0 ? "Free" : `$${total}`}</p>

      <button
        type="button"
        disabled={left < 1}
        onClick={buyTicket}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-glow to-accent py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {left < 1 ? "sold out" : "Buy ticket"}
      </button>
      <button type="button" onClick={toggleWishlist} className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-sm">
        {saved ? "♥ saved" : "♡ wishlist"}
      </button>
      {message && <p className="mt-4 text-sm text-accent">{message}</p>}
    </div>
  );

  return (
    <div className="pb-12">
      <Link href="/events" className="mb-4 inline-block text-sm text-zinc-400 hover:text-white">
        ← events
      </Link>

      <div className="relative mb-8 h-56 overflow-hidden rounded-3xl sm:h-72 lg:h-96">
        <Image src={ev.image} alt={ev.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
        <div className="absolute bottom-0 p-6 sm:p-8">
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs capitalize backdrop-blur-md">{ev.category}</span>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">{ev.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-zinc-300">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-white/5">
              <Image src={ev.organizer.logo} alt={ev.organizer.name} width={32} height={32} />
            </div>
            <div className="text-sm">by <strong className="text-zinc-100">{ev.organizer.name}</strong></div>
          </div>
        </div>
      </div>

      <div className="mb-8 lg:hidden">{sidebar}</div>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <section className="glass rounded-2xl p-5 sm:p-6">
            <h2 className="text-sm uppercase text-zinc-500">about</h2>
            <p className="mt-3 text-zinc-300 leading-relaxed">{ev.description}</p>
          </section>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase text-zinc-500">venue</p>
              <p className="mt-2 font-medium">{ev.location}</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase text-zinc-500">when</p>
              <p className="mt-2 font-medium">{longDate(ev.date)}</p>
              <p className="text-sm text-zinc-400">{ev.time} – {ev.endTime}</p>
            </div>
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">{sidebar}</div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold">similar stuff</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {similar.map((item) => (
              <Link key={item.id} href={`/event/${item.id}`} className="glass w-60 shrink-0 overflow-hidden rounded-2xl">
                <div className="relative h-28">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="240px" />
                </div>
                <div className="p-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-zinc-500">{item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {qrBooking && <QRModal id={qrBooking.id} title={qrBooking.title} onClose={() => setQrBooking(null)} />}
    </div>
  );
}
