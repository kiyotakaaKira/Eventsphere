"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Bell, Search, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import AIAssistant from "./AIAssistant";

const navItems = [
  { href: "/events", label: "Events" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tickets", label: "Tickets" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
];

export default function Navbar() {
  const path = usePathname();
  const { scrollY } = useScroll();
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const handleOpenAi = () => setAiOpen(true);
    window.addEventListener("open-ai-assistant", handleOpenAi);
    return () => window.removeEventListener("open-ai-assistant", handleOpenAi);
  }, []);

  // blur intensifies and border becomes visible as user scrolls
  const bgOpacity = useTransform(scrollY, [0, 60], [0.5, 0.85]);
  const borderOpacity = useTransform(scrollY, [0, 60], [0.04, 0.1]);

  return (
    <>
      <motion.nav
        className="sticky top-0 z-50 border-b"
        style={{
          backdropFilter: "blur(20px) saturate(1.3)",
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(15, 23, 42, ${v})`),
          borderColor: useTransform(borderOpacity, (v) => `rgba(255, 255, 255, ${v})`),
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/events" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm transition-transform duration-200 group-hover:scale-105">DF</div>
              <div>
                <div className="text-sm font-semibold">DevFusion</div>
                <div className="text-xs text-slate-400">attendee</div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 transition-colors duration-200 focus-within:border-sky-400/30 focus-within:bg-white/[0.06]">
                <Search size={14} className="text-slate-400" />
                <input placeholder="Search events, venues" className="bg-transparent text-sm placeholder:text-slate-500 outline-none border-none ring-0 focus:ring-0 w-40" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden gap-1 text-sm md:flex">
              {navItems.map((item) => {
                const isActive = path === item.href || (item.href !== "/dashboard" && path.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-lg px-3 py-1.5 transition-colors duration-200 ${
                      isActive
                        ? "text-white bg-white/8"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => setAiOpen(true)}
              className="rounded-full p-2 text-slate-300 hover:text-sky-400 hover:bg-white/[0.06] transition-colors duration-200"
              title="AI Discovery"
            >
              <Sparkles size={17} />
            </button>

            <button className="rounded-full p-2 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors duration-200">
              <Bell size={17} />
            </button>

            <Link href="/dashboard/profile" className="flex items-center gap-2 ml-1">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                <Image src="https://ui.avatars.com/api/?name=Alex+R&background=111827&color=60a5fa" alt="avatar" width={32} height={32} />
              </div>
              <div className="hidden text-sm md:block text-slate-300">Alex</div>
            </Link>
          </div>
        </div>
      </motion.nav>

      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
