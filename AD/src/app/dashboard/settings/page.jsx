"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [prefs, setPrefs] = useState({ notifications: true, publicProfile: false });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("prefs") || "null");
      if (saved) setPrefs(saved);
    } catch {}
  }, []);

  function toggle(key) {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem("prefs", JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Notifications</div>
            <div className="text-xs text-slate-400">Receive event updates</div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={prefs.notifications} onChange={() => toggle('notifications')} />
            <span />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Public profile</div>
            <div className="text-xs text-slate-400">Show basic info to organizers</div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={prefs.publicProfile} onChange={() => toggle('publicProfile')} />
            <span />
          </label>
        </div>
      </div>
    </div>
  );
}
