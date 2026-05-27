"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function EventCard({ ev, onToggleWishlist, saved, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3 }}
      className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[rgba(15,23,42,0.65)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-white/[0.1] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={ev.image}
          alt={ev.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <button
          type="button"
          onClick={() => onToggleWishlist?.(ev.id)}
          className="absolute right-3 top-3 rounded-full bg-black/40 p-2 backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:scale-110"
        >
          <Heart
            size={14}
            className={`transition-colors duration-200 ${saved ? "text-pink-400 fill-pink-400" : "text-white/80"}`}
          />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-glow/70 px-2.5 py-0.5 text-[11px] font-medium capitalize text-white backdrop-blur-sm">
          {ev.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[15px] leading-tight">{ev.title}</h3>
        <p className="mt-1.5 text-sm text-slate-400">{ev.date} · {ev.location}</p>
        <p className="mt-1 text-sm text-slate-500">👥 {(ev.attendees || ev.spots).toLocaleString()} going</p>
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
          <span className="font-semibold text-accent">{ev.price === 0 ? "Free" : `$${ev.price}`}</span>
          <Link
            href={`/event/${ev.id}`}
            className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
          >
            details →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
