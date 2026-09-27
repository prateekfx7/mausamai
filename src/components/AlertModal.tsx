'use client';

import React, { useState } from 'react';
import { PanchayatLocation } from '../types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  panchayat: PanchayatLocation;
  isHindi: boolean;
  onOpenAdvisory: () => void;
}

export default function AlertModal({
  isOpen,
  onClose,
  panchayat,
  isHindi,
  onOpenAdvisory,
}: AlertModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const alert = panchayat.weather.todayAlert;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold shadow-sm">
              ⚠️
            </span>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                {isHindi ? 'मौसम चेतावनी' : 'Weather Alert'}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {isHindi ? alert.titleHi : alert.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Structured 5 Answers requested in Prompt Section 8 */}
        <div className="space-y-3 text-xs">
          {/* 1. What is happening? */}
          <div className="bg-red-50/70 rounded-2xl p-4 border border-red-200/80 space-y-1">
            <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>⛈</span>
              <span>{isHindi ? '1. क्या हो रहा है? (What is happening?)' : '1. What is happening?'}</span>
            </div>
            <p className="text-slate-800 font-semibold leading-relaxed">
              {isHindi ? alert.messageHi : alert.message}
            </p>
          </div>

          {/* 2. When & 3. Where */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-0.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                {isHindi ? '2. कब? (When?)' : '2. When?'}
              </div>
              <div className="text-sm font-bold text-slate-900">{alert.timeWindow}</div>
              <div className="text-[11px] text-slate-500">Next 12–24 Hours Window</div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-0.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                {isHindi ? '3. कहां? (Where?)' : '3. Where?'}
              </div>
              <div className="text-sm font-bold text-blue-700">{panchayat.panchayat}</div>
              <div className="text-[11px] text-slate-500">Micro-zones B & C High Intensity</div>
            </div>
          </div>

          {/* 4. Potential crop impact? */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-1">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌾</span>
              <span>{isHindi ? '4. संभावित फसल प्रभाव? (Potential crop impact?)' : '4. Potential crop impact?'}</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-medium">
              {isHindi
                ? `प्रभावित फसलें: ${alert.impactedCrops.join(', ')}। तेज वर्षा और हवा से फूल झड़ने, जलग्रहण और फसल गिरने (lodging) का गंभीर खतरा।`
                : `Affected crops: ${alert.impactedCrops.join(', ')}. Flower drop during bloom phase and root lodging under wind gusts.`}
            </p>
          </div>

          {/* 5. What can the farmer prepare for? */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-1">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🛡️</span>
              <span>{isHindi ? '5. किसान क्या तैयारी करें? (What can you prepare for?)' : '5. What can you prepare for?'}</span>
            </div>
            <ul className="space-y-1 text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{isHindi ? 'अनावश्यक सिंचाई रोकें और पानी का निकास मार्ग खोलें।' : 'Postpone all planned field irrigation immediately.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{isHindi ? 'रासायनिक कीटनाशक/फफूंदनाशक छिड़काव टालें।' : 'Pause pesticide spraying until wind & rain cease.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{isHindi ? 'कटी फसल को वाटरप्रूफ तिरपाल से सुरक्षित स्थान पर रखें।' : 'Cover any harvested produce with waterproof tarpaulins.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleAudioReadout}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
          >
            <span>{isPlayingAudio ? '⏹' : '🔊'}</span>
            <span>{isPlayingAudio ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'वॉइस अलर्ट सुनें' : 'Listen Voice Alert')}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAdvisory();
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/25"
          >
            <span>{isHindi ? 'फसल सुरक्षा सलाह देखें' : 'View Full Crop Advisory'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
