"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      setFormError(err.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 dark:bg-slate-950 sm:px-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-soft dark:border-slate-800 dark:bg-slate-900/90 sm:px-12">
        <div className="mb-10 space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Organizer sign in</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Access your event dashboard</h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300">
            Sign in to manage upcoming events, check in attendees, and review live performance.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              placeholder="you@eventsphere.app"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              placeholder="Enter your password"
            />
          </div>

          {(formError || error) && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-200">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || authLoading}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting || authLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <p>
            New to EventSphere? <Link href="/register" className="font-semibold text-slate-950 hover:underline dark:text-white">Create an organizer account</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
