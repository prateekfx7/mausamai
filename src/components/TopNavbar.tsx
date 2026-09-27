'use client';

import React from 'react';
import Link from 'next/link';
import { PanchayatLocation } from '../types';

interface TopNavbarProps {
  selectedPanchayat: PanchayatLocation;
  isHindi: boolean;
  onToggleLanguage: () => void;
  onOpenPanchayatSelector: () => void;
  onOpenBulletinModal: () => void;
  onOpenPipelineModal: () => void;
  onOpenProfileSettings: () => void;
  onOpenAlertsModal: () => void;
}

export default function TopNavbar({
  selectedPanchayat,
  isHindi,
  onToggleLanguage,
  onOpenPanchayatSelector,
  onOpenBulletinModal,
  onOpenPipelineModal,
  onOpenProfileSettings,
  onOpenAlertsModal,
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-4 py-2.5 sm:py-3.5 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm select-none">
      {/* Mobile Brand Logo & Desktop Location Switcher */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo (visible on < lg screens) */}
        <Link href="/" className="flex lg:hidden items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center p-1 shadow-sm overflow-hidden">
            <img src="/logo.png" alt="Mausam Setu Logo" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="font-extrabold text-slate-900 text-base tracking-tight">Mausam Setu</span>
        </Link>

        {/* Panchayat Location Selector (visible on lg screens and up, plus small location pill on mobile) */}
        <button
          onClick={onOpenPanchayatSelector}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200/70 text-blue-800 text-xs font-bold transition-all shadow-sm group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span>📍 {selectedPanchayat.panchayat}, {selectedPanchayat.district}</span>
          <svg className="w-3.5 h-3.5 text-blue-600 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop Quick Action Buttons (hidden on mobile, visible on lg+) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language switch button */}
          <button
            onClick={onToggleLanguage}
            title="Toggle Language"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
          >
            <span className="text-sm">🌐</span>
            <span>{isHindi ? 'English' : 'हिंदी'}</span>
          </button>

          {/* AI Pipeline Info */}
          <button
            onClick={onOpenPipelineModal}
            title="AI Downscaling Info"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>

          {/* Export / Bulletin print */}
          <button
            onClick={onOpenBulletinModal}
            title={isHindi ? 'बुलेटिन प्रिंट करें' : 'Print Advisory Bulletin'}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>

          {/* Notifications with badge */}
          <button
            onClick={onOpenAlertsModal}
            className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            title="Weather Alerts"
          >
            <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </div>

        {/* User Profile / Kisan ID Capsule & Logout Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfileSettings}
            title="Open Profile Settings"
            className="flex items-center gap-2 pl-2 lg:border-l lg:border-slate-200 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md ring-2 ring-blue-100">
              RP
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <div className="text-xs font-bold text-slate-800">Ramesh Patil</div>
              <div className="text-[10px] text-slate-400">KS-MP-8891</div>
            </div>
          </button>

          <Link
            href="/login"
            title={isHindi ? 'लॉग आउट' : 'Log Out'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all border border-red-100 shadow-sm ml-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">{isHindi ? 'लॉग आउट' : 'Logout'}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
