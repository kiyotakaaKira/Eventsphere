"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { formatCurrency, formatDateOnly, getEventStatusColor } from "@/lib/utils";

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/events/dashboard/my-events");
        const eventsData = response.data?.events || [];
        setEvents(eventsData);
      } catch (err) {
        setError(err.message || "Unable to load your events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">My events</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Your published events</h1>
          </div>
          <p className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {events.length} events available
          </p>
        </div>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-24 rounded-3xl bg-slate-100 dark:bg-slate-900" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">You haven’t created any events yet. Create one to see it here.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-950 dark:text-white">{event.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{event.tagline}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`rounded-full px-3 py-1 ${getEventStatusColor(event.status)}`}>{event.status}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{event.category}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Starts {formatDateOnly(event.startDate)}</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      <p className="font-semibold text-slate-900 dark:text-white">{event.ticketsSold || 0}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tickets sold</p>
                    </div>
                    <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(event.revenue || 0)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Revenue</p>
                    </div>
                    <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      <p className="font-semibold text-slate-900 dark:text-white">{event.capacity - (event.totalSold || 0)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Seats remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
