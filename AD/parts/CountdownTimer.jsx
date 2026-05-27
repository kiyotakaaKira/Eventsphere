"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer({ iso }) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    function tick() {
      const t = Math.max(0, new Date(iso).getTime() - Date.now());
      setDiff(t);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [iso]);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <div className="inline-flex gap-2 text-sm">
      <div className="glass rounded-lg px-3 py-2 text-center">
        <div className="font-semibold">{days}</div>
        <div className="text-xs text-slate-400">days</div>
      </div>
      <div className="glass rounded-lg px-3 py-2 text-center">
        <div className="font-semibold">{hours}</div>
        <div className="text-xs text-slate-400">hrs</div>
      </div>
      <div className="glass rounded-lg px-3 py-2 text-center">
        <div className="font-semibold">{minutes}</div>
        <div className="text-xs text-slate-400">min</div>
      </div>
      <div className="glass rounded-lg px-3 py-2 text-center">
        <div className="font-semibold">{seconds}</div>
        <div className="text-xs text-slate-400">sec</div>
      </div>
    </div>
  );
}
