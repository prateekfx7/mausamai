'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'kisanId'>('mobile');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [kisanId, setKisanId] = useState('KS-MP-2026-8891');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#bbe2f8] via-[#d6effc] to-[#eaf5fc] text-slate-900 font-sans relative overflow-hidden flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Atmosphere Clouds & Moving Effect matching reference design */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay pointer-events-none animate-moving-clouds"
        style={{ backgroundImage: `url('/sky_clouds_hero.jpg')` }}
      />

      {/* Concentric Orbital Rings Floating Behind Center Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/40 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/30 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[1300px] border border-white/20 rounded-full pointer-events-none" />

      {/* Top Header Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        {/* Top Left Brand Pill matching reference logo badge */}
        <Link href="/landing" className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-sm hover:bg-white transition-all">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center p-1 overflow-hidden">
            <img src="/logo.png" alt="Mausam Setu Logo" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="text-sm font-black tracking-tight text-slate-900">Mausam Setu</span>
        </Link>

        {/* Top Right Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/landing"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-black text-xs font-bold transition-all shadow-md"
          >
            Demo App
          </Link>
        </div>
      </header>

      {/* Center Frosted Glass Login Card matching reference screenshot */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center">
        <div className="w-full bg-white/85 backdrop-blur-2xl text-slate-900 rounded-[36px] p-7 sm:p-9 shadow-2xl shadow-sky-900/10 border border-white/90 space-y-6">
          {/* Top Center Icon Badge matching reference ->] */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 flex items-center justify-center text-xl font-bold shadow-inner border border-slate-200/80">
              <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Sign in with mobile
            </h1>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
              Access hyperlocal weather intelligence, downscaled forecasts, and agricultural advisories.
            </p>
          </div>

          {/* Dual Method Tabs */}
          <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => setLoginMethod('mobile')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                loginMethod === 'mobile'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📱 Mobile + OTP
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('kisanId')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                loginMethod === 'kisanId'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🆔 Kisan ID / Aadhaar
            </button>
          </div>

          {/* Login Form */}
          {loginMethod === 'mobile' ? (
            <form onSubmit={otpSent ? handleLoginSubmit : handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">📱 +91</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full pl-20 pr-4 py-3.5 rounded-2xl border border-slate-200/80 bg-slate-100/70 text-slate-900 text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1 animate-fadeIn">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-extrabold text-slate-600">Enter OTP Code</label>
                    <span className="text-[10px] text-emerald-600 font-bold">Code sent to +91 {phoneNumber}</span>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200/80 bg-slate-100/70 text-slate-900 text-sm font-extrabold tracking-widest text-center focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    required
                  />
                </div>
              )}

              {/* Main Dark Button matching reference screenshot */}
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#18181b] hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {otpSent ? 'Verify & Access Dashboard' : 'Get Started'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <input
                  type="text"
                  value={kisanId}
                  onChange={(e) => setKisanId(e.target.value)}
                  placeholder="e.g. KS-MP-2026-8891"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200/80 bg-slate-100/70 text-slate-900 text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#18181b] hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Get Started
              </button>
            </form>
          )}

          {/* One-Click Fast Demo Login */}
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all border border-blue-200/60 flex items-center justify-center gap-1.5"
          >
            <span>🚀 Enter Demo App Instantly</span>
          </button>

          {/* Divider matching reference "Or sign in with" */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white/90 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
              Or sign in with
            </span>
          </div>

          {/* Social / Government Auth Row matching reference */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="py-3 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-sm"
              title="Sign in with PM-Kisan"
            >
              <span className="text-base">🇮🇳</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="py-3 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-sm"
              title="Sign in with Google"
            >
              <span className="text-base">🌐</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="py-3 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-sm"
              title="Sign in with Krishi Kendra"
            >
              <span className="text-base">🌾</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-500 font-medium">
        <p>Mausam Setu • Hyperlocal Weather Intelligence & Advisory Platform</p>
      </footer>
    </div>
  );
}
