'use client';

import React, { useState } from 'react';
import { GOVERNMENT_DISTRICT_MONITOR } from '../data/panchayatData';

interface OfficialGovDashboardProps {
  isHindi: boolean;
  onOpenBulletinModal: () => void;
}

export default function OfficialGovDashboard({
  isHindi,
  onOpenBulletinModal,
}: OfficialGovDashboardProps) {
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('all');

  const data = GOVERNMENT_DISTRICT_MONITOR;

  const handleBroadcastSms = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3500);
  };

  const filteredPanchayats = data.panchayatList.filter((p) => {
    if (filterBlock !== 'all' && p.block !== filterBlock) return false;
    if (selectedRiskCategory === 'high_rain' && p.rainRisk !== 'high') return false;
    if (selectedRiskCategory === 'high_crop' && p.cropRisk !== 'high') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-[28px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                IMD & Agrimet Monitoring Command
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">Live Telemetry Sync</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isHindi ? 'जिला एवं ब्लॉक कृषि-मौसम निगरानी' : 'District Agromet Operations Console'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isHindi
                ? 'नासिक जिला: ब्लॉक स्तर के पूर्वानुमान का 248 ग्राम पंचायतों में एआई डाउनस्केलिंग एवं त्वरित किसान चेतावनी तंत्र।'
                : 'Real-time multi-panchayat risk downscaling, automated crop vulnerability scoring, and mass emergency farmer advisory dispatch.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleBroadcastSms}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                broadcastSent
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
              }`}
            >
              <span>{broadcastSent ? '✓' : '📢'}</span>
              <span>
                {broadcastSent
                  ? (isHindi ? 'एसएमएस चेतावनी प्रसारित!' : 'SMS Broadcast Dispatched!')
                  : (isHindi ? 'रेड अलर्ट एसएमएस भेजें' : 'Broadcast Red Alert SMS')}
              </span>
            </button>

            <button
              onClick={onOpenBulletinModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-md"
            >
              <span>📄</span>
              <span>{isHindi ? 'जिला बुलेटिन प्रिंट' : 'District Bulletin (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Ambient background circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 5 Aggregation Metric Cards (Matching prompt specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Panchayats */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isHindi ? 'कुल पंचायतें' : 'Total Panchayats'}
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900">{data.totalPanchayats}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Across 8 sub-blocks</div>
          </div>
          <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
            100% Monitored
          </div>
        </div>

        {/* High Rainfall Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isHindi ? 'भारी वर्षा जोखिम' : 'High Rainfall Risk'}
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-red-600">{data.highRainfallRiskCount}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">&gt;25 mm within 24h</div>
          </div>
          <div className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md inline-block">
            Priority Alert Zone
          </div>
        </div>

        {/* Heat Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isHindi ? 'गर्मी / लू जोखिम' : 'Heat Risk (>38°C)'}
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-amber-600">{data.heatRiskCount}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Eastern rain-shadow</div>
          </div>
          <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
            Watch Advised
          </div>
        </div>

        {/* Crop Vulnerability High */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isHindi ? 'फसल क्षति जोखिम' : 'Crop Risk Index'}
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-rose-600">{data.cropVulnerabilityHighCount}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Tomato & Early Wheat</div>
          </div>
          <div className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block">
            Fungal Blight Risk
          </div>
        </div>

        {/* Average Confidence */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isHindi ? 'औसत सटीकता' : 'Avg Confidence'}
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-emerald-600">{data.averageConfidencePercent}%</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Ensemble Agreement</div>
          </div>
          <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            Calibrated AWS
          </div>
        </div>
      </div>

      {/* Regional Map & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Regional Risk Distribution Map (India / District visual representation) */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">
              {isHindi ? 'क्षेत्रीय जोखिम मानचित्र (नासिक संभाग)' : 'Regional Risk Map (Nashik Division)'}
            </h3>
            <span className="text-xs text-slate-400 font-medium">35km → 3km Grid Overlay</span>
          </div>

          {/* District SVG Map Illustration with hot-spots */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 relative flex items-center justify-center min-h-[280px]">
            <svg viewBox="0 0 450 300" className="w-full h-auto drop-shadow-sm">
              {/* Stylized District Boundary Polygons */}
              <path
                d="M 60 40 L 190 20 L 290 50 L 410 70 L 420 180 L 370 260 L 230 280 L 100 240 L 40 150 Z"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              {/* Block 1: Niphad (High Rain) */}
              <path
                d="M 190 60 L 290 50 L 320 150 L 210 160 Z"
                fill="#fecaca"
                stroke="#ef4444"
                strokeWidth="2"
                className="hover:opacity-80 cursor-pointer transition-opacity"
              />
              <text x="250" y="105" textAnchor="middle" className="text-[11px] font-bold fill-red-800 pointer-events-none">
                Niphad Block
              </text>
              <text x="250" y="125" textAnchor="middle" className="text-[9px] font-extrabold fill-red-600 pointer-events-none">
                38 High Risk Panchayats
              </text>

              {/* Block 2: Dindori (Moderate) */}
              <path
                d="M 100 60 L 190 60 L 210 160 L 120 170 Z"
                fill="#fef08a"
                stroke="#eab308"
                strokeWidth="2"
                className="hover:opacity-80 cursor-pointer transition-opacity"
              />
              <text x="150" y="115" textAnchor="middle" className="text-[11px] font-bold fill-amber-900 pointer-events-none">
                Dindori
              </text>

              {/* Block 3: Yeola (Low Rain / Heat) */}
              <path
                d="M 290 50 L 410 70 L 400 170 L 320 150 Z"
                fill="#fed7aa"
                stroke="#f97316"
                strokeWidth="2"
                className="hover:opacity-80 cursor-pointer transition-opacity"
              />
              <text x="355" y="115" textAnchor="middle" className="text-[11px] font-bold fill-amber-950 pointer-events-none">
                Yeola
              </text>

              {/* Block 4: Sinnar (Safe / Normal) */}
              <path
                d="M 120 170 L 210 160 L 250 250 L 150 240 Z"
                fill="#bbf7d0"
                stroke="#22c55e"
                strokeWidth="2"
                className="hover:opacity-80 cursor-pointer transition-opacity"
              />
              <text x="180" y="210" textAnchor="middle" className="text-[11px] font-bold fill-emerald-900 pointer-events-none">
                Sinnar
              </text>
            </svg>

            {/* Map floating tag */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm">
              District Center: 20.0° N, 73.8° E
            </div>
          </div>

          {/* Risk Distribution Breakdown */}
          <div className="space-y-2 pt-1">
            {data.riskDistribution.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-slate-700 font-medium">{r.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{r.count} Panchayats</span>
                  <span className="text-slate-400">({r.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Panchayat Action Table */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isHindi ? 'पंचायत चेतावनी तालिका' : 'Panchayat Risk Matrix'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {isHindi ? 'उच्च जोखिम वाली पंचायतों की सूची एवं चेतावनी स्थिति' : 'Live dispatch queue and confidence scores'}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-semibold">
              <button
                onClick={() => setSelectedRiskCategory('all')}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedRiskCategory === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRiskCategory('high_rain')}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedRiskCategory === 'high_rain' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                High Rain
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-white border-b border-slate-100">
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Panchayat</th>
                  <th className="py-2.5 px-3">Rain (mm)</th>
                  <th className="py-2.5 px-3">Risk</th>
                  <th className="py-2.5 px-3">Farmers</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPanchayats.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.block} Block</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {p.rainfall}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.rainRisk === 'high' ? 'bg-red-50 text-red-700' : p.rainRisk === 'moderate' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.rainRisk.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {p.farmers}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        SMS Sent
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
