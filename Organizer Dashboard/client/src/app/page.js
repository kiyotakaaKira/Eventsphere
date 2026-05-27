import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.12),_transparent_30%),#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 px-6 py-16 sm:px-10 lg:px-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/90 dark:text-slate-100 dark:ring-slate-700">
              Event organizer dashboard — built for real coordination
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Bring your events to life with a dashboard that feels like your own.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Publish events, manage registrations, and review check-in activity from a clean control panel built for organizers.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign in to dashboard
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Create organizer account
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900/80">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_35%)]" />
            <div className="relative grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">live overview</p>
                <p className="mt-4 text-3xl font-semibold">Keep tabs on every event</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">attendee flow</p>
                <p className="mt-4 text-3xl font-semibold">Easy check-in, attendee view</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">ticketing</p>
                <p className="mt-4 text-3xl font-semibold">Custom ticket tiers</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">insights</p>
                <p className="mt-4 text-3xl font-semibold">Revenue and registration trends</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          {[
            "Publish events in minutes",
            "Manage attendee lists",
            "Review check-in status",
          ].map((statement) => (
            <div key={statement} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/85">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{statement}</p>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{statement} with an interface that focuses on speed and clarity.</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
