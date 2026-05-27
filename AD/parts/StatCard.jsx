"use client";

export default function StatCard({ icon: Icon, value, label, href }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-400">{label}</p>
        </div>
        {Icon && (
          <div className="h-12 w-12 rounded-xl bg-white/6 flex items-center justify-center">
            <Icon />
          </div>
        )}
      </div>
    </div>
  );
}
