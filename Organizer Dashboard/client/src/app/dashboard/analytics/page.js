"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/utils";

const palette = ["#2563eb", "#7c3aed", "#14b8a6", "#f59e0b", "#ec4899"];

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState({ dailyRevenue: [], tierRevenue: [] });
  const [registrations, setRegistrations] = useState({ dailyRegistrations: [], peakHours: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [overviewRes, revenueRes, registrationRes] = await Promise.all([
          apiClient.get("/analytics/overview"),
          apiClient.get("/analytics/revenue"),
          apiClient.get("/analytics/registrations"),
        ]);

        setOverview(overviewRes.data);
        setRevenue(revenueRes.data || { dailyRevenue: [], tierRevenue: [] });
        setRegistrations(registrationRes.data || { dailyRegistrations: [], peakHours: [] });
      } catch (err) {
        setError(err.message || "Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Revenue, registrations, and event performance</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-44 rounded-3xl bg-slate-100 dark:bg-slate-900" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-200">{error}</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Revenue trend</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Last 30 days</p>
                </div>
              </div>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenue.dailyRevenue} margin={{ top: 8, right: 20, left: -12, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="_id" tick={{ fill: "#64748b" }} />
                    <YAxis tickFormatter={(value) => `₹${value}`} tick={{ fill: "#64748b" }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Revenue by ticket tier</p>
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenue.tierRevenue} margin={{ top: 8, right: 0, left: -18, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="_id" tick={{ fill: "#64748b" }} />
                      <YAxis tickFormatter={(value) => value} tick={{ fill: "#64748b" }} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="revenue" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Peak booking hours</p>
                <div className="mt-6 h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={registrations.peakHours} innerRadius={50} outerRadius={90} dataKey="count" nameKey="_id">
                        {registrations.peakHours.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} bookings`, "Bookings"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-3">
                  {registrations.peakHours.map((entry, index) => (
                    <div key={entry._id} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                      <span>Hour {entry._id}: {entry.count} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Revenue summary</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total revenue</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{formatCurrency(overview.totalRevenue)}</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tickets sold</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{overview.totalAttendees}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Notes</p>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Use this report to compare daily revenue and understand the time windows when people are most likely to purchase tickets.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
