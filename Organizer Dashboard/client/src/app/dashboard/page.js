"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { formatCurrency, formatDateOnly } from "@/lib/utils";
import Link from "next/link";

const statsLabels = [
  { key: "totalEvents", label: "Events created" },
  { key: "totalAttendees", label: "Tickets sold" },
  { key: "totalRevenue", label: "Revenue" },
  { key: "upcomingEvents", label: "Upcoming events" },
];

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [overviewRes, activityRes] = await Promise.all([
          apiClient.get("/analytics/overview"),
          apiClient.get("/analytics/recent-activity"),
        ]);
        setOverview(overviewRes.data);
        setActivity(activityRes.data.slice(0, 6));
      } catch (err) {
        setError(err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Organizer control center</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              This is where your live event pipeline, attendee flow, and daily earnings come together.
            </p>
          </div>
          <Link
            href="/dashboard/create-event"
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Publish new event
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsLabels.map((item) => {
            const value = overview?.[item.key] ?? 0;
            return (
              <div key={item.key} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
                  {item.key === "totalRevenue" ? formatCurrency(value) : value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Recent activity</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">Latest ticket flow</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Live updates
            </span>
          </div>

          {loading ? (
            <div className="mt-8 h-52 rounded-3xl bg-slate-100 dark:bg-slate-900" />
          ) : error ? (
            <p className="mt-6 text-sm text-red-600 dark:text-red-300">{error}</p>
          ) : (
            <div className="mt-6 space-y-4">
              {activity.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">No recent activity yet. Your first registration will appear here.</p>
              ) : (
                activity.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.user}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.type === "checkin" ? "Checked in" : "Booked"} • {item.event}</p>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{formatDateOnly(item.timestamp)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <p>{item.ticketTier} ticket</p>
                      <p>{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Organizer quick links</p>
          <div className="mt-6 grid gap-3">
            <Link href="/dashboard/my-events" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              Manage events
            </Link>
            <Link href="/dashboard/attendees" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              View attendee roster
            </Link>
            <Link href="/dashboard/check-in" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              Start check-in
            </Link>
            <Link href="/dashboard/analytics" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              Review analytics
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
