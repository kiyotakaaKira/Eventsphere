"use client";

import Link from "next/link";
import { Home, Ticket, Heart, User, Settings, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar({ className = "" }) {
  const path = usePathname();
  const items = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/tickets", label: "My Tickets", icon: Ticket },
    { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={`space-y-4 ${className}`}>
      <nav className="rounded-2xl glass p-3">
        <ul className="space-y-1">
          {items.map((it) => {
            const active = path === it.href || path?.startsWith(it.href + "/");
            const Icon = it.icon;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active ? "bg-white/6 text-white" : "text-slate-300 hover:bg-white/4"
                  }`}
                >
                  <Icon size={16} />
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="rounded-2xl glass p-3">
        <p className="text-xs text-slate-400">Need help?</p>
        <p className="mt-2 text-sm">Visit the community or contact support.</p>
        <div className="mt-3 flex gap-2">
          <button className="btn-secondary w-full">Docs</button>
          <button 
            className="btn-primary w-full flex items-center justify-center gap-1.5" 
            onClick={() => window.dispatchEvent(new Event('open-ai-assistant'))}
          >
            <Sparkles size={14} /> AI Support
          </button>
        </div>
      </div>

      <div className="rounded-2xl glass p-3 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>DevFusion</span>
          <small className="text-slate-500">v0.1</small>
        </div>
      </div>
    </aside>
  );
}
