'use client';

import React, { useState } from 'react';
import { DayForecast } from '../types';

interface ForecastBarChartProps {
  forecasts: DayForecast[];
  isHindi: boolean;
}

export default function ForecastBarChart({ forecasts, isHindi }: ForecastBarChartProps) {
  const [activeTab, setActiveTab] = useState<'downscaled' | 'comparison'>('downscaled');
  const [hoveredDay, setHoveredDay] = useState<DayForecast | null>(null);

  // Maximum rainfall for scaling bar heights
  const maxRain = Math.max(...forecasts.map((f) => Math.max(f.rainMm, f.blockRainMm)), 25);

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow">
      {/* Header matching reference "Income Sources" card */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            {isHindi ? '7-दिवसीय मौसम पूर्वानुमान' : '7-Day Weather Forecast'}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isHindi ? 'दैनिक वर्षा एवं तापमान का विस्तृत रुझान' : 'Panchayat AI downscaled vs synoptic block forecast'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Pill Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setActiveTab('downscaled')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'downscaled'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isHindi ? 'पंचायत स्तर' : 'Panchayat (3km)'}
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'comparison'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isHindi ? 'ब्लॉक तुलना' : 'Block Comparison'}
            </button>
          </div>
        </div>
      </div>

      {/* Stat banner matching reference */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
              7 Days
            </span>
            <span className="text-xs text-slate-500 font-medium">Cumulative Rain</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {(forecasts.reduce((acc, f) => acc + f.rainMm, 0)).toFixed(1)} mm
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">
            {isHindi ? '7 दिनों में कुल संभावित वर्षा' : 'Total projected rainfall across week'}
          </div>
        </div>

        {/* Big percentage improvement badge like in reference (+73.6%) */}
        <div className="bg-emerald-50 border border-emerald-100/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            ↗
          </div>
          <div>
            <div className="text-emerald-700 font-black text-xl leading-none">
              +91.4%
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              {isHindi ? 'पूर्वानुमान सत्यापन शुद्धता' : 'Model Verification Accuracy'}
            </div>
          </div>
        </div>
      </div>

      {/* Striped SVG pattern definitions */}
      <svg className="h-0 w-0 absolute">
        <defs>
          {/* Diagonal stripes for active blue bar */}
          <pattern id="striped-blue" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#3b82f6" strokeWidth="4" />
            <line x1="4" y1="0" x2="4" y2="8" stroke="#1d4ed8" strokeWidth="4" />
          </pattern>
          {/* Diagonal stripes for dark navy bar */}
          <pattern id="striped-dark" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#27272a" strokeWidth="4" />
            <line x1="4" y1="0" x2="4" y2="8" stroke="#18181b" strokeWidth="4" />
          </pattern>
          {/* Diagonal stripes for light blue comparison bar */}
          <pattern id="striped-lightblue" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#93c5fd" strokeWidth="4" />
            <line x1="4" y1="0" x2="4" y2="8" stroke="#bfdbfe" strokeWidth="4" />
          </pattern>
        </defs>
      </svg>

      {/* Visual Bar Chart (Styled identically to the reference "Income Sources" striped bars) */}
      <div className="relative pt-6 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 px-2">
          {forecasts.map((f, idx) => {
            const heightPercent = Math.max(12, Math.round((f.rainMm / maxRain) * 100));
            const blockHeightPercent = Math.max(8, Math.round((f.blockRainMm / maxRain) * 100));
            const isToday = idx === 0;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(f)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Floating pill badge like reference: ↗ 12K */}
                <div
                  className={`mb-2 px-2 py-1 rounded-full text-[10px] font-bold transition-all shadow-sm whitespace-nowrap ${
                    isToday
                      ? 'bg-slate-900 text-white'
                      : f.rainMm > 15
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 opacity-90 group-hover:bg-slate-900 group-hover:text-white'
                  }`}
                >
                  {f.rainMm > 0 ? `${f.rainMm} mm` : '0 mm'}
                </div>

                {/* Bars Container */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-40">
                  {/* Panchayat Downscaled Bar (Striped) */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-7 sm:w-10 rounded-2xl transition-all duration-300 relative overflow-hidden group-hover:scale-105 shadow-sm ${
                      isToday
                        ? 'bg-gradient-to-t from-blue-700 to-blue-500 ring-2 ring-blue-400'
                        : f.rainMm > 15
                        ? 'bg-gradient-to-t from-blue-600 to-indigo-500'
                        : f.rainMm > 5
                        ? 'bg-gradient-to-t from-blue-400 to-sky-300'
                        : 'bg-slate-200'
                    }`}
                  >
                    {/* Diagonal striped texture overlay */}
                    <div
                      className="absolute inset-0 opacity-40 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)',
                      }}
                    />
                  </div>

                  {/* Block Model Comparison Bar (Shown if activeTab === 'comparison') */}
                  {activeTab === 'comparison' && (
                    <div
                      style={{ height: `${blockHeightPercent}%` }}
                      className="w-3 sm:w-4 rounded-xl bg-slate-300/80 transition-all duration-300 relative overflow-hidden group-hover:bg-slate-400"
                      title={`IMD Block Model: ${f.blockRainMm} mm`}
                    />
                  )}
                </div>

                {/* Day Labels and Temperature */}
                <div className="mt-3 text-center">
                  <div className={`text-xs font-bold ${isToday ? 'text-blue-600' : 'text-slate-800'}`}>
                    {f.dayShort}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {f.tempMax}° / {f.tempMin}°
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover / Active Day Details Card */}
        {hoveredDay && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{hoveredDay.day} ({hoveredDay.date}):</span>
              <span className="text-slate-600">{hoveredDay.condition}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 font-medium">
              <span>🌧 Downscaled: <strong>{hoveredDay.rainMm} mm</strong></span>
              <span>🏢 IMD Block: <strong>{hoveredDay.blockRainMm} mm</strong></span>
              <span>💧 Humidity: <strong>{hoveredDay.humidity}%</strong></span>
              <span>💨 Wind: <strong>{hoveredDay.windKm} km/h</strong></span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-600" />
            <span>{isHindi ? 'पंचायत स्तर एआई पूर्वानुमान (3 किमी)' : 'Panchayat Downscaled (3km)'}</span>
          </div>
          {activeTab === 'comparison' && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-300" />
              <span>{isHindi ? 'आईएमडी ब्लॉक मॉडल (35 किमी)' : 'IMD Block Model (35km)'}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">🌡</span>
            <span>{isHindi ? 'दैनिक अधिकतम / न्यूनतम तापमान' : 'Daily High / Low (°C)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
