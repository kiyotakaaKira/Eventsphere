"use client";

import { useEffect, useState } from "react";
import { getMockProfile } from "@/data/user";

export default function ProfilePage() {
  const [profile, setProfile] = useState(getMockProfile());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("profile") || "null");
      if (saved) setProfile(saved);
    } catch {}
  }, []);

  function save() {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile saved");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="glass rounded-2xl p-6 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <div className="text-xs text-slate-400">Name</div>
          <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
        </label>
        <label className="space-y-1">
          <div className="text-xs text-slate-400">Email</div>
          <input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
        </label>
        <label className="space-y-1">
          <div className="text-xs text-slate-400">Bio</div>
          <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
        </label>
        <div />
      </div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={save}>Save</button>
        <button className="btn-secondary" onClick={() => { localStorage.removeItem('profile'); setProfile(getMockProfile()); }}>Reset</button>
      </div>
    </div>
  );
}
