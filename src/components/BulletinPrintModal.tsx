'use client';

import React from 'react';
import { PanchayatLocation } from '../types';

interface BulletinPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  panchayat: PanchayatLocation;
  isHindi: boolean;
}

export default function BulletinPrintModal({
  isOpen,
  onClose,
  panchayat,
  isHindi,
}: BulletinPrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h3 className="text-lg font-bold text-slate-900">
              {isHindi ? 'ग्राम पंचायत कृषि मौसम बुलेटिन' : 'Gram Panchayat Agromet Advisory Bulletin'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              🖨️ {isHindi ? 'प्रिंट करें' : 'Print / Save PDF'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document */}
        <div className="border border-slate-300 rounded-2xl p-6 sm:p-8 bg-slate-50/40 text-slate-900 space-y-6">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              Gramin Krishi Mausam Sewa (GKMS) • Mausam Setu AI
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Hyperlocal Agromet Advisory Bulletin
            </h2>
            <div className="text-xs font-bold text-blue-700">
              Gram Panchayat: {panchayat.panchayat} ({panchayat.block} Block, {panchayat.district}, {panchayat.state})
            </div>
            <div className="text-[10px] text-slate-500">
              Issued On: Sep 27, 2026 • Valid for: Next 72 Hours • Downscaled Model: IMD-WRF + Sentinel-2
            </div>
          </div>

          {/* Weather Summary Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Weather Synopsis (Next 24–48 Hours)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500">Rainfall:</span>
                <div className="font-bold text-slate-900">{panchayat.weather.rainfallExpected}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500">Temp Range:</span>
                <div className="font-bold text-slate-900">{panchayat.weather.tempRange}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500">Humidity:</span>
                <div className="font-bold text-slate-900">{panchayat.weather.humidity}%</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500">Confidence:</span>
                <div className="font-bold text-emerald-600">{panchayat.weather.forecastConfidence}%</div>
              </div>
            </div>
          </div>

          {/* Active Alert */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
            <div className="font-bold">⚠️ {panchayat.weather.todayAlert.title}</div>
            <p className="text-[11px] leading-relaxed text-red-800">{panchayat.weather.todayAlert.message}</p>
          </div>

          {/* Crop Specific Advisories */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. Crop Specific Directives
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-900">🌾 Wheat (Flowering Stage):</strong> Avoid supplemental irrigation. Open boundary drainage to prevent waterlogging. Postpone foliar spraying.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-900">🍅 Tomato (Fruiting):</strong> High risk of Early/Late Blight in humid conditions. Ensure staking of vines. Remove fallen infected leaves.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-900">🌿 Soybean (Pod Filling / Harvest):</strong> Cover harvested heaps with tarpaulins immediately. Speed up harvesting of mature fields.
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 text-center leading-relaxed">
            Note: Predictions are statistical downscaled estimates from multi-source meteorological telemetry. Farmers should cross-check field drainage prior to chemical applications.
          </div>
        </div>
      </div>
    </div>
  );
}
