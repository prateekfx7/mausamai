'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MicroZone, WeatherData } from '../types';

const RealLeafletMap = dynamic(() => import('./RealLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xs font-semibold animate-pulse">
      🌐 Loading Real Satellite Map...
    </div>
  ),
});

interface InteractiveMapProps {
  weather: WeatherData;
  panchayatName: string;
  isHindi: boolean;
  onOpenPipelineModal: () => void;
  lat?: number;
  lng?: number;
  zoom?: number;
}

export default function InteractiveMap({
  weather,
  panchayatName,
  isHindi,
  onOpenPipelineModal,
  lat = 20.0768,
  lng = 74.1089,
  zoom = 13,
}: InteractiveMapProps) {
  const [selectedZone, setSelectedZone] = useState<MicroZone>(weather.microZones[0]);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'real' | 'diagram'>('real');

  const getZoneColor = (level: MicroZone['rainfallLevel'], isSelected: boolean) => {
    switch (level) {
      case 'high':
        return isSelected
          ? 'fill-red-500/90 stroke-red-700 stroke-[3]'
          : 'fill-red-400/75 hover:fill-red-500/85 stroke-red-600 stroke-2';
      case 'moderate':
        return isSelected
          ? 'fill-amber-400/90 stroke-amber-600 stroke-[3]'
          : 'fill-amber-300/75 hover:fill-amber-400/85 stroke-amber-500 stroke-2';
      case 'low':
      default:
        return isSelected
          ? 'fill-emerald-400/90 stroke-emerald-600 stroke-[3]'
          : 'fill-emerald-300/75 hover:fill-emerald-400/85 stroke-emerald-500 stroke-2';
    }
  };

  const getBadgeStyle = (level: MicroZone['rainfallLevel']) => {
    switch (level) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'moderate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              {isHindi ? 'पंचायत सूक्ष्म-क्षेत्र मौसम नक्शा' : 'Panchayat Micro-Zone Weather Map'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Real GIS Leaflet Map
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isHindi
              ? `${panchayatName} के विभिन्न सूक्ष्म-क्षेत्रों पर क्लिक करके संभावित वर्षा देखें`
              : `Click any micro-zone to inspect downscaled rainfall & terrain risk for ${panchayatName}`}
          </p>
        </div>

        {/* View Mode Toggle & Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('real')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'real' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛰️ Real Map
            </button>
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'diagram' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📐 SVG View
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-400 border border-emerald-500" />
              <span className="text-slate-600">{isHindi ? 'कम वर्षा' : 'Low (<15mm)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-500" />
              <span className="text-slate-600">{isHindi ? 'मध्यम वर्षा' : 'Mod (15-25mm)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-red-500 border border-red-600" />
              <span className="text-slate-600">{isHindi ? 'भारी वर्षा' : 'High (>25mm)'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Map Canvas Column */}
        <div className="lg:col-span-7 space-y-2">
          {viewMode === 'real' ? (
            <RealLeafletMap
              weather={weather}
              panchayatName={panchayatName}
              lat={lat}
              lng={lng}
              zoom={zoom}
              selectedZone={selectedZone}
              onSelectZone={(z) => setSelectedZone(z)}
              isHindi={isHindi}
            />
          ) : (
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 relative overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />
              <svg
                viewBox="0 0 400 370"
                className="w-full max-w-[380px] h-auto drop-shadow-md select-none transition-all"
              >
                <defs>
                  <filter id="zone-glow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                  </filter>
                </defs>
                {weather.microZones.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <g key={zone.id} className="cursor-pointer group" onClick={() => setSelectedZone(zone)}>
                      <path
                        d={zone.pathData}
                        className={`transition-all duration-200 ${getZoneColor(zone.rainfallLevel, isSelected)}`}
                        filter={isSelected ? 'url(#zone-glow)' : undefined}
                      />
                      <text
                        x={zone.centerCoord.x}
                        y={zone.centerCoord.y - 6}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-900 pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                      >
                        {isHindi ? zone.nameHi : zone.name}
                      </text>
                      <text
                        x={zone.centerCoord.x}
                        y={zone.centerCoord.y + 10}
                        textAnchor="middle"
                        className="text-[10px] font-extrabold fill-slate-800 pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                      >
                        {zone.expectedRainfall}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Bottom map status bar */}
          <div className="w-full flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isHindi ? 'क्षेत्रफल:' : 'Area:'} 1,420 Ha • 5 Micro-Zones
            </span>
            <span className="text-[10px] text-slate-400">
              {isHindi ? 'क्लिक करके विवरण देखें' : 'Click zone to view forecast'}
            </span>
          </div>
        </div>

        {/* Right Inspector Box: Detailed zone prediction & 'Why this prediction?' */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(selectedZone.rainfallLevel)}`}>
                  {selectedZone.rainfallLevel === 'high' ? (isHindi ? 'भारी वर्षा जोखिम' : 'High Rain Risk') : selectedZone.rainfallLevel === 'moderate' ? (isHindi ? 'मध्यम वर्षा' : 'Moderate Rain') : (isHindi ? 'कम वर्षा' : 'Low Rain')}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-1.5">
                  {isHindi ? selectedZone.nameHi : selectedZone.name}
                </h4>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">Confidence</div>
                <div className="text-lg font-black text-emerald-600">{selectedZone.confidence}%</div>
              </div>
            </div>

            {/* Expected Rainfall Highlight */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  {isHindi ? 'अनुमानित वर्षा' : 'Expected Rainfall'}
                </div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedZone.expectedRainfall}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                🌧
              </div>
            </div>

            {/* Micro Terrain & Soil attributes */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-medium">{isHindi ? 'ऊंचाई एवं स्थलाकृति' : 'Elevation / Terrain'}</div>
                <div className="font-semibold text-slate-800 text-[11px] truncate mt-0.5">{selectedZone.elevation}</div>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-medium">{isHindi ? 'मृदा प्रकार एवं नमी' : 'Soil & Moisture'}</div>
                <div className="font-semibold text-slate-800 text-[11px] truncate mt-0.5">{selectedZone.soilMoisture}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-100">
              💡 <span className="font-semibold">{isHindi ? 'कृषि प्रभाव:' : 'Field Impact:'}</span> {selectedZone.riskDescription}
            </p>

            {/* "Check Crop Impact" & "Why this prediction?" Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  window.location.href = '/advisory';
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-500/20"
              >
                <span>🌾</span>
                <span>{isHindi ? 'फसल प्रभाव जांचें' : 'Check Crop Impact'}</span>
                <span>→</span>
              </button>

              <button
                onClick={() => setShowWhyModal(!showWhyModal)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-700 text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>🔍</span>
                  <span className="truncate">{isHindi ? 'यह पूर्वानुमान क्यों?' : 'Why this prediction?'}</span>
                </div>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${showWhyModal ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* "Why this prediction?" Explanation Box */}
          {showWhyModal && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <div>
                  <h5 className="text-sm font-bold text-blue-300 tracking-wide">
                    {isHindi ? 'यह पूर्वानुमान क्यों?' : 'Why this prediction?'}
                  </h5>
                  <div className="text-[11px] text-emerald-400 font-bold mt-0.5">
                    {isHindi ? 'पूर्वानुमान विश्वसनीयता (Forecast Confidence):' : 'Forecast Confidence:'} {selectedZone.confidence}%
                  </div>
                </div>
                <button
                  onClick={() => setShowWhyModal(false)}
                  className="text-slate-400 hover:text-white text-xs w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Farmer-Friendly Simple Checklist */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {isHindi ? 'अनुमान में शामिल कारक:' : 'The estimate uses:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                  <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>IMD forecast</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Historical weather</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Satellite observations</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Terrain / elevation</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Soil information</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Local observations</span>
                  </div>
                </div>
              </div>

              {/* Simple Language Explanation of Confidence */}
              <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-xl">
                💡 <strong className="text-white">{isHindi ? 'सरल भाषा में अर्थ:' : 'Confidence Explained:'}</strong>{' '}
                {isHindi
                  ? `${selectedZone.confidence}% विश्वसनीयता का अर्थ है कि आपके क्षेत्र में 10 में से 8 से अधिक बार वास्तविक वर्षा इस अनुमान के बहुत करीब रहती है।`
                  : `A ${selectedZone.confidence}% confidence means that over 8 out of 10 historical weather occurrences in your Panchayat matched this rainfall estimate.`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
