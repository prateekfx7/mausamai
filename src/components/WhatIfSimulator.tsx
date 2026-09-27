'use client';

import React, { useState } from 'react';
import { ActionPlan, CropType, GrowthStage, WeatherData } from '../types';
import { evaluateWhatIf } from '../data/cropAdvisory';

interface WhatIfSimulatorProps {
  weather: WeatherData;
  isHindi: boolean;
}

export default function WhatIfSimulator({ weather, isHindi }: WhatIfSimulatorProps) {
  const [selectedAction, setSelectedAction] = useState<ActionPlan>('irrigate');
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Wheat');
  const [selectedStage, setSelectedStage] = useState<GrowthStage>('Flowering');

  const result = evaluateWhatIf(selectedAction, selectedCrop, selectedStage, weather.rainfallMm, weather.windSpeed);

  const actionButtons: { id: ActionPlan; label: string; labelHi: string; icon: string; desc: string }[] = [
    { id: 'irrigate', label: 'Irrigate', labelHi: 'सिंचाई करना', icon: '💧', desc: 'Water field / tubewell' },
    { id: 'spray', label: 'Spray Pesticide', labelHi: 'कीटनाशक छिड़कना', icon: '🧪', desc: 'Fungicide or insecticide' },
    { id: 'sow', label: 'Sow Seeds', labelHi: 'बीज बोना', icon: '🌱', desc: 'Planting / seeding' },
    { id: 'harvest', label: 'Harvest Crop', labelHi: 'फसल काटना', icon: '🚜', desc: 'Combine or manual' },
  ];

  const getVerdictStyle = (verdict: 'recommended' | 'caution' | 'not_recommended') => {
    switch (verdict) {
      case 'not_recommended':
        return {
          cardBg: 'bg-red-50/70 border-red-200 text-red-900',
          badge: 'bg-red-600 text-white',
          statusText: isHindi ? 'अनुशंसित नहीं (जोखिम भरा)' : 'NOT RECOMMENDED',
          icon: '🚫',
        };
      case 'caution':
        return {
          cardBg: 'bg-amber-50/70 border-amber-200 text-amber-900',
          badge: 'bg-amber-500 text-white',
          statusText: isHindi ? 'सावधानी से करें' : 'PROCEED WITH CAUTION',
          icon: '⚠️',
        };
      case 'recommended':
      default:
        return {
          cardBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          statusText: isHindi ? 'सुरक्षित एवं अनुशंसित' : 'RECOMMENDED / SAFE',
          icon: '✅',
        };
    }
  };

  const style = getVerdictStyle(result.verdict);

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              {isHindi ? 'क्या-अगर कृषि निर्णय सिमुलेटर' : 'What-If Farm Action Simulator'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Interactive Decision Support
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isHindi
              ? 'आप क्या करने की योजना बना रहे हैं? मौसम पूर्वानुमान के आधार पर त्वरित प्रभाव का विश्लेषण करें।'
              : 'What are you planning to do today? Simulate weather risk before investing time and labor.'}
          </p>
        </div>

        {/* Live Weather Reference Pill */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600">
          <span>🌧 Expected: <strong>{weather.rainfallExpected}</strong></span>
          <span>•</span>
          <span>💨 Wind: <strong>{weather.windSpeed} km/h</strong></span>
        </div>
      </div>

      {/* Action Selection Buttons */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          {isHindi ? 'आप क्या करने की योजना बना रहे हैं?' : 'What are you planning to do?'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actionButtons.map((btn) => {
            const isSelected = selectedAction === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedAction(btn.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="text-2xl mb-1.5">{btn.icon}</div>
                <div className="text-xs font-bold">
                  {isHindi ? btn.labelHi : btn.label}
                </div>
                <div className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {btn.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcome Simulation Card (Matching Prompt Section 7 Exact Format) */}
      <div className={`rounded-2xl p-5 sm:p-6 border transition-all ${style.cardBg} space-y-4`}>
        {/* Verdict Bar: Is [action] advisable? */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/10">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {isHindi ? `क्या ${selectedAction} करना उचित है?` : `Is ${selectedAction} advisable?`}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">{style.icon}</span>
              <h4 className="text-xl font-black tracking-tight text-slate-900">
                {isHindi ? result.titleHi : result.title}
              </h4>
            </div>
          </div>

          <span className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${style.badge}`}>
            {result.verdict === 'caution' ? (isHindi ? '🟡 प्रतीक्षा पर विचार करें' : '🟡 Consider Waiting') : result.verdict === 'not_recommended' ? (isHindi ? '🔴 बचें / न करें' : '🔴 Avoid Action') : (isHindi ? '🟢 अनुशंसित' : '🟢 Recommended')}
          </span>
        </div>

        {/* Reason Box */}
        <div className="bg-white/90 rounded-xl p-3.5 border border-black/10 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isHindi ? 'कारण (Reason):' : 'Reason:'}
          </div>
          <p className="text-xs font-bold text-slate-900 leading-relaxed">
            {isHindi ? 'अगले 24 घंटों में बारिश होने की पूरी संभावना है।' : 'Rainfall is likely within the next 24 hours.'}
          </p>
        </div>

        {/* "If you [action] now" vs "If you wait" Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* If you act now */}
          <div className="bg-rose-50/90 rounded-xl p-4 border border-rose-200 space-y-1.5">
            <div className="font-bold text-rose-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{isHindi ? `यदि आप अभी ${selectedAction} करते हैं:` : `If you ${selectedAction} now`}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              ↓ {selectedAction === 'irrigate' ? (isHindi ? 'संभावित पानी और बिजली की बर्बादी तथा जड़ों में ऑक्सीजन की कमी।' : 'Possible water & power wastage and root saturation risk.') : selectedAction === 'spray' ? (isHindi ? 'कीटनाशक दवा धुलने से वित्तीय नुकसान।' : 'Chemical washout and financial loss.') : (isHindi ? 'बुवाई/कटाई प्रभावित होने का जोखिम।' : 'Soil crusting or crop wetting risk.')}
            </p>
          </div>

          {/* If you wait */}
          <div className="bg-emerald-50/90 rounded-xl p-4 border border-emerald-200 space-y-1.5">
            <div className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>🌱</span>
              <span>{isHindi ? 'यदि आप प्रतीक्षा करते हैं:' : 'If you wait'}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              ↓ {selectedAction === 'irrigate' ? (isHindi ? 'संभावित वर्षा से सिंचाई की आवश्यकता स्वाभाविक रूप से कम हो सकती है।' : 'Expected rainfall may reduce irrigation requirement naturally.') : selectedAction === 'spray' ? (isHindi ? 'बारिश के बाद दवा का बेहतर असर मिलेगा।' : 'Pest knockdown efficacy will be much higher after rain clears.') : (isHindi ? 'खेत सूखने पर कार्य सुरक्षित होगा।' : 'Fields will stabilize after the rain event.')}
            </p>
          </div>
        </div>

        {/* Actionable Steps */}
        <div className="bg-white/90 rounded-xl p-4 border border-black/10 space-y-2">
          <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            {isHindi ? 'सुझाए गए कदम (Actionable Next Steps):' : 'Actionable Next Steps:'}
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {result.actionableSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">👉</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Decision Support Disclaimer */}
        <div className="text-[10px] text-slate-500 font-medium italic pt-1 border-t border-black/10 text-center">
          🛡️ {isHindi ? 'मौसम सेतु निर्णय सहायता: यह सिमुलेशन निर्णय सहायता के लिए है, गारंटीकृत निर्देश नहीं।' : 'Decision support note: This simulator provides probabilistic risk analysis to assist your decision, not a guaranteed instruction.'}
        </div>
      </div>
    </div>
  );
}
