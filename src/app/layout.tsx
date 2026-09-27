import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "../context/UserContext";
import AppShell from "../components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mausam Setu (मौसम सेतु) — Hyperlocal Weather Intelligence & Crop Advisory",
  description: "AI-downscaled Panchayat weather intelligence, micro-zone rainfall mapping, and crop-specific farming advisories.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f5f8] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <UserProvider>
          <AppShell>
            {children}
          </AppShell>
        </UserProvider>
      </body>
    </html>
  );
}
