'use client';

import React from 'react';
import { WeatherData } from '../types';

interface PredictionVerificationProps {
  weather: WeatherData;
  isHindi: boolean;
}

export default function PredictionVerification({ weather, isHindi }: PredictionVerificationProps) {
  const history = weather.pastVerification;

  // Calculate Average Error and Overall Accuracy
  const avgError = (history.reduce((acc, h) => acc + h.errorMm, 0) / history.length).toFixed(1);
  const avgAccuracy = (history.reduce((acc, h) => acc + h.accuracyPercent, 0) / history.length).toFixed(1);

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              {isHindi ? 'पूर्वानुमान सत्यापन (अनुमान बनाम वास्तविक)' : 'Forecast Verification (Prediction vs Actual)'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              AWS Ground-Truth
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isHindi
              ? 'स्वचालित मौसम स्टेशन (AWS) के वास्तविक वर्षा आंकड़ों से एआई मॉडल की निष्पक्ष जांच'
              : 'Empirical model accuracy validation against Automatic Weather Station (AWS) records'}
          </p>
        </div>

        {/* Accuracy badge */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100 text-right">
            <div className="text-[10px] text-emerald-600 font-bold uppercase">{isHindi ? 'औसत शुद्धता' : 'Avg Accuracy'}</div>
            <div className="text-base font-black text-emerald-700 leading-none">{avgAccuracy}%</div>
          </div>
          <div className="bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 text-right">
            <div className="text-[10px] text-blue-600 font-bold uppercase">{isHindi ? 'औसत अंतर (MAE)' : 'Mean Error (MAE)'}</div>
            <div className="text-base font-black text-blue-700 leading-none">±{avgError} mm</div>
          </div>
        </div>
      </div>

      {/* Featured Prediction vs Actual Callout Card (Matching prompt example) */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-2xl p-5 border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isHindi ? 'कल का पूर्वानुमान' : 'Yesterday Prediction'}
          </span>
          <div className="text-2xl font-black text-slate-900">
            {history[0].predictedMm} mm
          </div>
          <div className="text-xs text-slate-500">
            {isHindi ? 'एआई मॉडल द्वारा अनुमानित' : 'Downscaled Model Estimate'}
          </div>
        </div>

        <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isHindi ? 'वास्तविक दर्ज वर्षा' : 'Actual Observed'}
          </span>
          <div className="text-2xl font-black text-blue-600">
            {history[0].actualMm} mm
          </div>
          <div className="text-xs text-slate-500">
            {isHindi ? 'स्थानीय वर्षामापी द्वारा मापा गया' : 'Observed by Village AWS Gauge'}
          </div>
        </div>

        <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isHindi ? 'अंतर एवं शुद्धता' : 'Error & Reliability'}
          </span>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <span>±{history[0].errorMm} mm</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {history[0].accuracyPercent}%
            </span>
          </div>
          <div className="text-xs text-emerald-700 font-medium">
            {isHindi ? 'अति-सटीक श्रेणी में' : 'Within high-confidence tolerance'}
          </div>
        </div>
      </div>

      {/* Visual Comparison Chart / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">{isHindi ? 'दिनांक' : 'Date'}</th>
              <th className="py-2.5 px-3">{isHindi ? 'अनुमानित वर्षा' : 'Predicted (mm)'}</th>
              <th className="py-2.5 px-3">{isHindi ? 'वास्तविक वर्षा' : 'Actual (mm)'}</th>
              <th className="py-2.5 px-3">{isHindi ? 'अंतर' : 'Error (Δ)'}</th>
              <th className="py-2.5 px-3">{isHindi ? 'विजुअल तुलना' : 'Visual Comparison'}</th>
              <th className="py-2.5 px-3 text-right">{isHindi ? 'शुद्धता' : 'Accuracy'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((row, idx) => {
              const maxVal = Math.max(row.predictedMm, row.actualMm, 30);
              const predWidth = Math.round((row.predictedMm / maxVal) * 100);
              const actWidth = Math.round((row.actualMm / maxVal) * 100);

              return (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {row.date} <span className="text-slate-400 font-normal">({row.day})</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {row.predictedMm} mm
                  </td>
                  <td className="py-3 px-3 font-bold text-blue-600">
                    {row.actualMm} mm
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-600">
                    ±{row.errorMm} mm
                  </td>
                  <td className="py-3 px-3 w-48">
                    {/* Visual Comparison Mini Bars */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-400 w-7">Pred</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${predWidth}%` }}
                            className="bg-slate-800 h-full rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-blue-500 font-bold w-7">Act</span>
                        <div className="flex-1 bg-blue-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${actWidth}%` }}
                            className="bg-blue-600 h-full rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[11px]">
                      {row.accuracyPercent}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transparency Note */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            {isHindi
              ? 'मौसम सेतु भविष्यवाणियों को अनुमान के रूप में प्रस्तुत करता है। 100% सटीक वर्षा का दावा नहीं किया जाता।'
              : 'Predictions are localized statistical estimates with confidence scores, continuously calibrated with ground AWS sensors.'}
          </span>
        </div>
      </div>
    </div>
  );
}
