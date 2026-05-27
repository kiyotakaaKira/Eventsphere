"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { formatDateOnly } from "@/lib/utils";

export default function AttendeesPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await apiClient.get("/events/dashboard/my-events");
        const eventsData = response.data?.events || [];
        setEvents(eventsData);
        if (eventsData.length) {
          setSelectedEvent(eventsData[0]);
        }
      } catch (err) {
        setError(err.message || "Unable to load events.");
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadAttendees = async () => {
      if (!selectedEvent) return;
      setLoading(true);
      try {
        const response = await apiClient.get(`/bookings/event/${selectedEvent._id}`);
        setAttendees(response.data || []);
      } catch (err) {
        setError(err.message || "Unable to load attendees.");
      } finally {
        setLoading(false);
      }
    };

    loadAttendees();
  }, [selectedEvent]);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Attendee roster</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">View registered attendees</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Select event</label>
            <select
              value={selectedEvent?._id || ""}
              onChange={(e) => setSelectedEvent(events.find((event) => event._id === e.target.value))}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {events.map((event) => (
                <option key={event._id} value={event._id}>{event.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-20 rounded-3xl bg-slate-100 dark:bg-slate-900" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        ) : attendees.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No attendees have registered for this event yet.</p>
        ) : (
          <div className="space-y-4">
            {attendees.map((attendee) => (
              <div key={attendee._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950 dark:text-white">{attendee.userId?.fullname || "Unknown attendee"}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{attendee.userId?.email || "No email"}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 text-sm text-slate-600 dark:text-slate-300">
                    <span>Ticket: {attendee.ticketTier}</span>
                    <span>Qty: {attendee.quantity}</span>
                    <span>{formatDateOnly(attendee.createdAt)}</span>
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
