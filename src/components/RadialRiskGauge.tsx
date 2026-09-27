'use client';

import React from 'react';
import { WeatherData } from '../types';

interface RadialRiskGaugeProps {
  weather: WeatherData;
  isHindi: boolean;
  onOpenAdvisory: () => void;
}

export default function RadialRiskGauge({
  weather,
  isHindi,
  onOpenAdvisory,
}: RadialRiskGaugeProps) {
  // Semicircular gauge tick calculation (from 180 deg to 360 deg)
  const totalTicks = 24;
  // Risk score percentage (e.g. 68% for high rain/pest risk)
  const riskScore = 68;
  const activeTicksCount = Math.round((riskScore / 100) * totalTicks);

  // Generate tick paths around a semicircle
  const radius = 70;
  const centerX = 100;
  const centerY = 95;

  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    // angle from PI (180deg) to 2*PI (360deg)
    const angle = Math.PI + (i / (totalTicks - 1)) * Math.PI;
    const x1 = centerX + (radius - 12) * Math.cos(angle);
    const y1 = centerY + (radius - 12) * Math.sin(angle);
    const x2 = centerX + radius * Math.cos(angle);
    const y2 = centerY + radius * Math.sin(angle);
    const isActive = i < activeTicksCount;

    return {
      x1,
      y1,
      x2,
      y2,
      isActive,
      color:
        i > totalTicks * 0.75
          ? 'stroke-red-500'
          : i > totalTicks * 0.45
          ? 'stroke-blue-600'
          : 'stroke-sky-400',
    };
  });

  const getRiskBadge = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-500',
          label: isHindi ? 'उच्च जोखिम' : 'High Risk',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: isHindi ? 'मध्यम जोखिम' : 'Moderate',
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: isHindi ? 'सुरक्षित / कम' : 'Low / Safe',
        };
    }
  };

  const rainRisk = getRiskBadge(weather.risks.rainfall);
  const heatRisk = getRiskBadge(weather.risks.heat);
  const windRisk = getRiskBadge(weather.risks.wind);
  const cropRisk = getRiskBadge(weather.risks.cropOverall);

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Header matching reference "Financial Balance" card */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          {isHindi ? 'मौसम जोखिम सूचकांक' : 'Crop Weather Risk'}
        </h3>
        <button
          onClick={onOpenAdvisory}
          title="Open Detailed Advisory"
          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Semicircular Radial Gauge (Identical aesthetic to reference image) */}
      <div className="relative flex flex-col items-center justify-center py-2">
        <svg viewBox="0 0 200 120" className="w-56 h-auto drop-shadow-sm select-none">
          {ticks.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              strokeWidth={3.8}
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                t.isActive ? t.color : 'stroke-slate-200/90'
              }`}
            />
          ))}
        </svg>

        {/* Center score readout */}
        <div className="text-center -mt-6">
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {riskScore}%
          </div>
          <div className="text-[11px] font-bold text-red-600 mt-0.5 uppercase tracking-wider">
            {isHindi ? 'मध्यम-उच्च कृषि जोखिम' : 'Moderate-High Risk'}
          </div>
          <div className="text-[10px] text-slate-400 font-medium max-w-[200px] mx-auto mt-0.5">
            {isHindi ? 'वर्षा और आर्द्रता से फंगस रोग की संभावना' : 'Rainfall & humidity elevate fungal spore risk'}
          </div>
        </div>
      </div>

      {/* 4 Risk Indicators Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
        {/* Rainfall Risk */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>🌧</span>
            <span className="text-[11px] font-semibold text-slate-700">{isHindi ? 'वर्षा' : 'Rain'}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rainRisk.bg}`}>
            {rainRisk.label}
          </span>
        </div>

        {/* Heat Risk */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>🌡</span>
            <span className="text-[11px] font-semibold text-slate-700">{isHindi ? 'गर्मी' : 'Heat'}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${heatRisk.bg}`}>
            {heatRisk.label}
          </span>
        </div>

        {/* Wind Risk */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>💨</span>
            <span className="text-[11px] font-semibold text-slate-700">{isHindi ? 'हवा' : 'Wind'}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${windRisk.bg}`}>
            {windRisk.label}
          </span>
        </div>

        {/* Crop Overall */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span>🌾</span>
            <span className="text-[11px] font-semibold text-slate-700">{isHindi ? 'फसल' : 'Crop'}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cropRisk.bg}`}>
            {cropRisk.label}
          </span>
        </div>
      </div>
    </div>
  );
}
