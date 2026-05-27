"use client";

import Sidebar from "@/parts/Sidebar";
import PageTransition from "@/parts/PageTransition";

export default function DashboardLayout({ children }) {
  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      <main>
        <PageTransition keyProp={typeof window !== "undefined" ? window.location.pathname : ""}>
          <div className="min-h-[60vh]">{children}</div>
        </PageTransition>
      </main>
    </div>
  );
}
