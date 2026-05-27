"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formState, setFormState] = useState({ fullname: "", phone: "", organization: "", bio: "", website: "", twitter: "", linkedin: "" });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        setProfile(response.data);
        setFormState({
          fullname: response.data.fullname || "",
          phone: response.data.phone || "",
          organization: response.data.organization || "",
          bio: response.data.bio || "",
          website: response.data.socialLinks?.website || "",
          twitter: response.data.socialLinks?.twitter || "",
          linkedin: response.data.socialLinks?.linkedin || "",
        });
      } catch (err) {
        setMessage(err.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
          <div className="h-10 w-1/4 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-8 w-1/2 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="h-96 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
            <div className="h-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-96 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
            <div className="h-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("fullname", formState.fullname);
      data.append("phone", formState.phone);
      data.append("organization", formState.organization);
      data.append("bio", formState.bio);
      data.append("socialLinks", JSON.stringify({ website: formState.website, twitter: formState.twitter, linkedin: formState.linkedin }));
      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      const response = await apiClient.put("/users/profile", data);
      setProfile(response.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Organizer profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950/90 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
              <input
                value={formState.fullname}
                onChange={(e) => setFormState((prev) => ({ ...prev, fullname: e.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Phone</label>
              <input
                value={formState.phone}
                onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Organization</label>
              <input
                value={formState.organization}
                onChange={(e) => setFormState((prev) => ({ ...prev, organization: e.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Bio</label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState((prev) => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Website</label>
              <input
                value={formState.website}
                onChange={(e) => setFormState((prev) => ({ ...prev, website: e.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Twitter</label>
              <input
                value={formState.twitter}
                onChange={(e) => setFormState((prev) => ({ ...prev, twitter: e.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">LinkedIn</label>
              <input
                value={formState.linkedin}
                onChange={(e) => setFormState((prev) => ({ ...prev, linkedin: e.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {message && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving profile…" : "Save changes"}
          </button>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="Profile avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-400">A</div>
                )}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Current user</p>
                <p className="text-lg font-semibold text-slate-950 dark:text-white">{profile?.fullname || "Organizer"}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>
                Upload a new avatar if you want a polished profile for event pages and attendee contact.
              </p>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Profile image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="text-sm text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
