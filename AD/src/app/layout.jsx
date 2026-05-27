import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/parts/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "DevFusion • Attendee Dashboard",
  description:
    "Premium event discovery, ticket management, and attendee experience for hackathons, workshops, and conferences.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen bg-slate-950 text-slate-100">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_20%)]"></div>
          <Navbar />
          <main className="relative mx-auto max-w-6xl px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
