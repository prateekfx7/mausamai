'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanchayatLocation } from '../types';

interface SidebarProps {
  selectedPanchayat: PanchayatLocation;
  isHindi: boolean;
  onOpenPipelineModal: () => void;
}

export default function Sidebar({
  selectedPanchayat,
  isHindi,
  onOpenPipelineModal,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      id: 'dashboard',
      label: isHindi ? 'डैशबोर्ड' : 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: '/map',
      id: 'map',
      label: isHindi ? 'मौसम नक्शा' : 'Weather Map',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      href: '/forecast',
      id: 'forecast',
      label: isHindi ? 'पंचायत पूर्वानुमान' : 'Panchayat Forecast',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      href: '/advisory',
      id: 'advisory',
      label: isHindi ? 'फसल परामर्श' : 'Crop Advisory',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      href: '/simulator',
      id: 'simulator',
      label: isHindi ? 'क्या-अगर सिमुलेटर' : 'What-If Simulator',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      href: '/verification',
      id: 'verification',
      label: isHindi ? 'पूर्वानुमान सत्यापन' : 'Prediction vs Actual',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      href: '/alerts',
      id: 'alerts',
      label: isHindi ? 'मौसम चेतावनियां' : 'Alerts',
      badge: '1 High',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      href: '/official',
      id: 'official',
      label: isHindi ? 'सरकारी / आईएमडी' : 'Gov / IMD Official',
      badge: 'Admin',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 xl:w-72 flex-shrink-0 flex-col justify-between py-6 px-4 sm:px-6 bg-white border-r border-slate-100 select-none">
      <div className="space-y-6">
        {/* Brand Logo - Mausam Setu */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center p-1 shadow-md shadow-slate-900/10 overflow-hidden">
            <img src="/logo.png" alt="Mausam Setu Logo" className="w-full h-full object-contain filter invert" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Mausam Setu</span>
        </Link>

        {/* Welcome Greeting */}
        <div className="pt-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            {isHindi ? 'नमस्ते, किसान भाई 👋' : 'Welcome'}
            <br />
            <span className="text-blue-600">{isHindi ? 'रामेश पाटिल' : 'Back, Ramesh! 👋'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
            {isHindi
              ? `आपकी ग्राम पंचायत ${selectedPanchayat.panchayat} के लिए आज का सटीक मौसम पूर्वानुमान।`
              : `Here's your weather intelligence for ${selectedPanchayat.panchayat}.`}
          </p>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4 pt-1">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              {isHindi ? 'मुख्य नेविगेशन' : 'MAIN MENU'}
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#18181b] text-white shadow-sm shadow-slate-900/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-red-500 text-white'
                            : item.badge === 'Admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && !item.badge && (
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* AI Downscaling Pipeline Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 text-white shadow-lg shadow-blue-500/15">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                AI Downscaling
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div>
              <h4 className="text-base font-bold leading-tight">
                {isHindi ? '35 किमी ब्लॉक → 3 किमी पंचायत' : '35km Block → 3km Panchayat'}
              </h4>
              <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
                {isHindi
                  ? 'सैटेलाइट + स्थलाकृति + स्थानीय वर्षामापी से परिष्कृत पूर्वानुमान।'
                  : 'Terrain & INSAT satellite downscaling active.'}
              </p>
            </div>

            <button
              onClick={onOpenPipelineModal}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-sm"
            >
              <span>{isHindi ? 'प्रक्रिया देखें' : 'View Pipeline'}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* User Profile Pill & Log Out at Bottom */}
      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm ring-1 ring-slate-100">
            RP
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 truncate max-w-[90px]">
              {isHindi ? 'रामेश पाटिल' : 'Ramesh Patil'}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[90px]">
              {selectedPanchayat.panchayat}
            </div>
          </div>
        </div>

        <Link
          href="/login"
          title={isHindi ? 'लॉग आउट' : 'Log Out'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition-all border border-transparent hover:border-red-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>{isHindi ? 'लॉग आउट' : 'Log Out'}</span>
        </Link>
      </div>
    </aside>
  );
}
