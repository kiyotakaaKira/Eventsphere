"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";

export default function CheckInPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingCode, setBookingCode] = useState("");
  const [message, setMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setMessage(err.message || "Unable to load events.");
        setFeedbackType("error");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleCheckIn = async (event) => {
    event.preventDefault();
    if (!bookingCode || !selectedEvent) return;
    setSaving(true);
    setMessage(null);
    setFeedbackType("");

    try {
      const response = await apiClient.post("/checkin", {
        bookingCode: bookingCode.trim(),
        eventId: selectedEvent._id,
      });
      setMessage(response.message || "Checked in successfully.");
      setFeedbackType("success");
    } catch (err) {
      setMessage(err.message || "Check-in failed.");
      setFeedbackType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Check in</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Quick attendee verification</h1>
          </div>
          <p className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Scan or enter booking code
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Event</label>
              <select
                value={selectedEvent?._id || ""}
                onChange={(e) => setSelectedEvent(events.find((item) => item._id === e.target.value))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {events.map((event) => (
                  <option key={event._id} value={event._id}>{event.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Booking code</label>
              <input
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                placeholder="Enter attendee booking code"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            {message && (
              <div className={`rounded-3xl px-4 py-3 text-sm ${feedbackType === "success" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200"}`}>
                {message}
              </div>
            )}

            <button
              onClick={handleCheckIn}
              disabled={saving || loading || !selectedEvent}
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Confirming…" : "Check in attendee"}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Instructions</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>1. Select the event from the list.</li>
              <li>2. Enter the attendee’s booking code.</li>
              <li>3. Use this panel on event day to verify QR checkout manually.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
