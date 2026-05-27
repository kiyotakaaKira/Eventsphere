"use client";

import { useMemo, useState } from "react";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";

const initialTicket = { tierName: "General", price: 499, quantity: 100, benefits: "Standard entry", expiresAt: "" };
const initialCoupon = { code: "EARLY10", discountPercent: 10, expiresAt: "", maxUsage: 50 };

export default function CreateEventPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    title: "",
    tagline: "",
    description: "",
    category: "Technology",
    startDate: "",
    endDate: "",
    eventTime: "",
    registrationDeadline: "",
    venueType: "physical",
    venueName: "",
    venueCity: "",
    venueAddress: "",
    meetingLink: "",
    capacity: 150,
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [tickets, setTickets] = useState([initialTicket]);
  const [coupons, setCoupons] = useState([]);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleInput = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const addTicket = () => setTickets((prev) => [...prev, { ...initialTicket, tierName: `Tier ${prev.length + 1}` }]);
  const removeTicket = (index) => setTickets((prev) => prev.filter((_, idx) => idx !== index));
  const updateTicket = (index, key, value) => {
    setTickets((prev) => prev.map((ticket, idx) => (idx === index ? { ...ticket, [key]: value } : ticket)));
  };
  const addCoupon = () => setCoupons((prev) => [...prev, { ...initialCoupon, code: `SAVE${prev.length + 1}` }]);
  const removeCoupon = (index) => setCoupons((prev) => prev.filter((_, idx) => idx !== index));
  const updateCoupon = (index, key, value) => {
    setCoupons((prev) => prev.map((coupon, idx) => (idx === index ? { ...coupon, [key]: value } : coupon)));
  };

  const venuePayload = useMemo(
    () => ({
      type: formState.venueType,
      name: formState.venueName,
      city: formState.venueCity,
      address: formState.venueAddress,
      meetingLink: formState.meetingLink,
    }),
    [formState]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const payload = new FormData();
      payload.append("title", formState.title);
      payload.append("tagline", formState.tagline);
      payload.append("description", formState.description);
      payload.append("category", formState.category);
      payload.append("startDate", formState.startDate);
      payload.append("endDate", formState.endDate);
      payload.append("eventTime", formState.eventTime);
      payload.append("registrationDeadline", formState.registrationDeadline);
      payload.append("capacity", formState.capacity.toString());
      payload.append("venue", JSON.stringify(venuePayload));
      payload.append("tickets", JSON.stringify(tickets));
      payload.append("coupons", JSON.stringify(coupons));
      payload.append("status", "upcoming");
      if (bannerFile) {
        payload.append("banner", bannerFile);
      }

      await apiClient.post("/events", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/dashboard/my-events");
    } catch (err) {
      setStatus(err.message || "Unable to save event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Create event</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Add a new event listing</h1>
          </div>
          <p className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Organizer flow only
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Event title</label>
            <input
              value={formState.title}
              onChange={(e) => handleInput("title", e.target.value)}
              required
              placeholder="DevFusion Summit 2026"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Category</label>
            <select
              value={formState.category}
              onChange={(e) => handleInput("category", e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {[
                "Technology",
                "Business",
                "Cultural",
                "Sports",
                "Music",
                "Food",
                "Education",
                "Networking",
                "Other",
              ].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Event description</label>
          <textarea
            value={formState.description}
            onChange={(e) => handleInput("description", e.target.value)}
            required
            rows={5}
            placeholder="A short description for the organizer listing"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Start date</label>
            <input
              type="date"
              value={formState.startDate}
              onChange={(e) => handleInput("startDate", e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">End date</label>
            <input
              type="date"
              value={formState.endDate}
              onChange={(e) => handleInput("endDate", e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Time slot</label>
            <input
              value={formState.eventTime}
              onChange={(e) => handleInput("eventTime", e.target.value)}
              placeholder="10:00 AM - 4:00 PM"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Capacity</label>
            <input
              type="number"
              value={formState.capacity}
              onChange={(e) => handleInput("capacity", Number(e.target.value))}
              min={1}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Venue</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleInput("venueType", "physical")}
                className={`rounded-3xl border px-4 py-3 text-sm font-medium transition ${formState.venueType === "physical" ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
              >
                Physical
              </button>
              <button
                type="button"
                onClick={() => handleInput("venueType", "online")}
                className={`rounded-3xl border px-4 py-3 text-sm font-medium transition ${formState.venueType === "online" ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
              >
                Online
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Banner image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>

        {formState.venueType === "physical" ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Venue name</label>
                <input
                  value={formState.venueName}
                  onChange={(e) => handleInput("venueName", e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Convention Hall A"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">City</label>
                <input
                  value={formState.venueCity}
                  onChange={(e) => handleInput("venueCity", e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Bangalore"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Address</label>
              <input
                value={formState.venueAddress}
                onChange={(e) => handleInput("venueAddress", e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="123 Conference Ave"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Meeting link</label>
            <input
              value={formState.meetingLink}
              onChange={(e) => handleInput("meetingLink", e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              placeholder="https://meet.example.com/session"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Ticket tiers</p>
            <button type="button" onClick={addTicket} className="text-sm font-semibold text-slate-950 hover:text-slate-700 dark:text-slate-100">
              + Add tier
            </button>
          </div>
          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900 dark:text-white">Tier {index + 1}</p>
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicket(index)}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <input
                    value={ticket.tierName}
                    onChange={(e) => updateTicket(index, "tierName", e.target.value)}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Ticket name"
                  />
                  <input
                    type="number"
                    value={ticket.price}
                    onChange={(e) => updateTicket(index, "price", Number(e.target.value))}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    value={ticket.quantity}
                    onChange={(e) => updateTicket(index, "quantity", Number(e.target.value))}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Quantity"
                  />
                  <input
                    value={ticket.benefits}
                    onChange={(e) => updateTicket(index, "benefits", e.target.value)}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Notes / perks"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Discount coupons</p>
            <button type="button" onClick={addCoupon} className="text-sm font-semibold text-slate-950 hover:text-slate-700 dark:text-slate-100">
              + Add coupon
            </button>
          </div>
          <div className="space-y-4">
            {coupons.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400">Add a promo code to manage discounts and early bird pricing.</p>
            )}
            {coupons.map((coupon, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900 dark:text-white">Coupon {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeCoupon(index)}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <input
                    value={coupon.code}
                    onChange={(e) => updateCoupon(index, "code", e.target.value.toUpperCase())}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="CODE10"
                  />
                  <input
                    type="number"
                    value={coupon.discountPercent}
                    onChange={(e) => updateCoupon(index, "discountPercent", Number(e.target.value))}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Discount %"
                  />
                  <input
                    type="date"
                    value={coupon.expiresAt}
                    onChange={(e) => updateCoupon(index, "expiresAt", e.target.value)}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <input
                    type="number"
                    value={coupon.maxUsage}
                    onChange={(e) => updateCoupon(index, "maxUsage", Number(e.target.value))}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="Max uses"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {status && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-200">
            {status}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-900 dark:text-white">Ready to publish</p>
            <p>Once submitted, your event will appear in the public event list.</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Publishing…" : "Publish event"}
          </button>
        </div>
      </form>
    </div>
  );
}
