'use client';

import React, { useState } from 'react';
import { WeatherData } from '../types';

interface WeatherOverviewCardProps {
  weather: WeatherData;
  isHindi: boolean;
  onOpenPipelineModal: () => void;
}

export default function WeatherOverviewCard({
  weather,
  isHindi,
  onOpenPipelineModal,
}: WeatherOverviewCardProps) {
  const [timeRange, setTimeRange] = useState<'weekly' | 'hourly'>('weekly');

  // Micro-zone rows for the dot matrix matching the reference image's layout
  const zones = [
    { label: isHindi ? 'उत्तर कगार' : 'North Ridge', dots: [3, 3, 2, 1, 0, 0, 1] },
    { label: isHindi ? 'नहर बेसिन' : 'Canal Basin', dots: [3, 2, 2, 0, 0, 0, 1] },
    { label: isHindi ? 'केंद्रीय कृषि' : 'Central Farm', dots: [2, 2, 1, 0, 0, 0, 1] },
    { label: isHindi ? 'फलवाटिका' : 'Orchards', dots: [1, 1, 0, 0, 0, 0, 0] },
  ];

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Dot color mapper (matching the blue, dark, light blue, and gray dots from reference image)
  const getDotStyle = (intensity: number) => {
    switch (intensity) {
      case 3:
        // Heavy rain (>20mm) - Deep navy/black
        return 'bg-[#18181b] shadow-sm';
      case 2:
        // Moderate rain (10-20mm) - Vibrant royal blue
        return 'bg-blue-600 shadow-sm shadow-blue-500/30';
      case 1:
        // Light rain (2-10mm) - Soft sky blue
        return 'bg-blue-300';
      case 0:
      default:
        // Clear/Trace - Light gray
        return 'bg-slate-200/80';
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Header matching reference */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            {isHindi ? 'वर्षा एवं मौसम विश्लेषण' : 'Precipitation Breakdown'}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isHindi ? 'पंचायत स्तर पर परिष्कृत सूक्ष्म जलवायु पूर्वानुमान' : 'AI-downscaled 3km micro-cluster forecast'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'weekly' | 'hourly')}
              className="appearance-none bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="weekly">{isHindi ? 'साप्ताहिक' : 'Weekly'}</option>
              <option value="hourly">{isHindi ? 'दैनिक (24 घंटे)' : '24 Hours'}</option>
            </select>
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button
            onClick={onOpenPipelineModal}
            title="View Downscaling Science"
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Stat & Dot Matrix Grid Row (Identical layout to reference image) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Headline: Big Stat */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {weather.rainfallExpected}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">
                {isHindi ? 'संभावित वर्षा:' : 'Expected Rain:'} {weather.rainfallMm} mm ({weather.rainfallProbability}% {isHindi ? 'संभावना' : 'Prob.'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700">
                {isHindi ? 'पूर्वानुमान सटीकता:' : 'Forecast Confidence:'} {weather.forecastConfidence}%
              </span>
            </div>
          </div>

          {/* Downscaling comparison tag */}
          <div className="inline-flex items-center gap-1.5 bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-xl text-[11px] text-blue-700 font-medium">
            <span className="font-bold">IMD Block (35km):</span>
            <span>12 mm</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold text-blue-900">Panchayat: 22.4 mm</span>
          </div>
        </div>

        {/* Right Section: The Dot Matrix (Matching reference image's circular dot grid) */}
        <div className="md:col-span-7 bg-slate-50/60 rounded-2xl p-4 border border-slate-100">
          {/* Matrix Legend */}
          <div className="flex flex-wrap items-center justify-end gap-3 mb-3 text-[10px] font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#18181b]" />
              <span>&gt;20mm ({isHindi ? 'भारी' : 'Heavy'})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>10–20mm ({isHindi ? 'मध्यम' : 'Mod'})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-300" />
              <span>2–10mm ({isHindi ? 'हल्की' : 'Light'})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span>0–2mm ({isHindi ? 'शुष्क' : 'Dry'})</span>
            </div>
          </div>

          {/* Dot Grid */}
          <div className="space-y-2.5">
            {zones.map((zone, zIdx) => (
              <div key={zIdx} className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-500 w-24 truncate text-left">
                  {zone.label}
                </span>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                  {zone.dots.map((val, dIdx) => (
                    <div
                      key={dIdx}
                      title={`${zone.label} • Day ${days[dIdx]}`}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform hover:scale-125 cursor-pointer ${getDotStyle(
                        val
                      )}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Days axis labels */}
          <div className="flex items-center justify-end pt-2 border-t border-slate-200/60 mt-2.5 text-[10px] font-bold text-slate-400">
            <div className="flex items-center gap-2 sm:gap-3">
              {days.map((d, i) => (
                <div key={i} className="w-5 sm:w-6 text-center">
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Bottom Weather Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
        {/* Temperature */}
        <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold">
            🌡
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isHindi ? 'तापमान' : 'Temperature'}
            </div>
            <div className="text-sm font-bold text-slate-800">
              {weather.temperatureCurrent}°C
            </div>
            <div className="text-[10px] text-slate-500">{weather.tempRange}</div>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
            💧
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isHindi ? 'आर्द्रता' : 'Humidity'}
            </div>
            <div className="text-sm font-bold text-slate-800">
              {weather.humidity}%
            </div>
            <div className="text-[10px] text-blue-600 font-medium">
              {weather.humidity > 70 ? (isHindi ? 'उच्च नमी' : 'High Moisture') : (isHindi ? 'सामान्य' : 'Normal')}
            </div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-lg font-bold">
            💨
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isHindi ? 'हवा की गति' : 'Wind Speed'}
            </div>
            <div className="text-sm font-bold text-slate-800">
              {weather.windSpeed} km/h
            </div>
            <div className="text-[10px] text-slate-500">{weather.windDirection}</div>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="bg-slate-50/70 rounded-2xl p-3 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">
            🌱
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isHindi ? 'मृदा नमी' : 'Soil Moisture'}
            </div>
            <div className="text-sm font-bold text-slate-800">
              {weather.soilMoisturePercent}%
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              {isHindi ? 'पर्याप्त जलधारण' : 'Good Field Cap'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
