'use client';

import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Link from 'next/link';

export default function AlertsPage() {
  const { selectedPanchayat, isHindi } = useUser();
  const alert = selectedPanchayat.weather.todayAlert;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioReadout = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const msg = new SpeechSynthesisUtterance();
      msg.text = isHindi
        ? `${alert.titleHi}। ${alert.messageHi} प्रभावित फसलें: ${alert.impactedCrops.join(', ')}`
        : `${alert.title}. ${alert.message} Impacted crops: ${alert.impactedCrops.join(', ')}`;
      msg.lang = isHindi ? 'hi-IN' : 'en-IN';
      msg.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-red-600">
          <span>Early Warning System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {isHindi ? 'मौसम चेतावनियां एवं अलर्ट केंद्र' : 'Weather Alert & Emergency Center'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {isHindi
            ? `ग्राम पंचायत ${selectedPanchayat.panchayat} के लिए आज की मौसम चेतावनियां`
            : `Real-time agricultural risk alerts and heavy weather notifications for Gram Panchayat ${selectedPanchayat.panchayat}`}
        </p>
      </div>

      {/* Hero Active Warning Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6 border border-red-500/30 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-600 text-white shadow-md">
            ⚠️ ACTIVE WARNING
          </span>
          <span className="text-xs text-slate-300 font-semibold">
            Issued: IMD Downscaled AWS Hub
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isHindi ? alert.titleHi : alert.title}
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl font-medium">
            {isHindi ? alert.messageHi : alert.message}
          </p>
        </div>

        {/* Structured 5 Answers requested in Prompt Section 8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          {/* 1. What is happening & 2. When */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <div className="text-[10px] text-red-300 font-bold uppercase">1. What is happening? & When?</div>
            <div className="font-bold text-white text-sm">{alert.timeWindow}</div>
            <p className="text-slate-300">{alert.message}</p>
          </div>

          {/* 3. Where & 4. Crop Impact */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <div className="text-[10px] text-amber-300 font-bold uppercase">3. Impacted Area & Crops</div>
            <div className="font-bold text-white text-sm">{selectedPanchayat.panchayat} (Micro-zones B & C)</div>
            <div className="text-amber-200 font-semibold mt-1">At-risk crops: {alert.impactedCrops.join(', ')}</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleAudioReadout}
            className="py-3 px-5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/20"
          >
            <span>{isPlayingAudio ? '⏹' : '🔊'}</span>
            <span>{isPlayingAudio ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'ऑडियो सुनें' : 'Listen Voice Alert')}</span>
          </button>

          <Link
            href="/advisory"
            className="py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-500/30"
          >
            <span>{isHindi ? 'फसल सुरक्षा सलाह देखें' : 'View Full Crop Advisory'}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Preparedness Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          🛡️ Farmer Preparedness Action Checklist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800">1. Drainage Furrows</div>
            <p className="text-slate-600 leading-relaxed">Clear trash and debris from field boundary channels to let excess surface runoff escape quickly.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800">2. Pause Spraying</div>
            <p className="text-slate-600 leading-relaxed">Postpone liquid pesticide or fertilizer applications until wind speeds drop below 12 km/h and rain clears.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800">3. Harvest Protection</div>
            <p className="text-slate-600 leading-relaxed">Cover all threshed or cut produce with 200 GSM waterproof tarpaulins secured with stone weights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
