'use client';

import React from 'react';
import { useUser } from '../../context/UserContext';
import CropAdvisorySection from '../../components/CropAdvisorySection';
import RadialRiskGauge from '../../components/RadialRiskGauge';

export default function AdvisoryPage() {
  const { selectedPanchayat, isHindi } = useUser();
  const weather = selectedPanchayat.weather;

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600">
          <span>Stage-Aware Agricultural AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {isHindi ? 'फसल-विशिष्ट कृषि परामर्श' : 'Crop-Specific Weather Advisory'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {isHindi
            ? 'अपनी फसल एवं विकास अवस्था के अनुसार मौसम जोखिम तथा अनुशंसित कदम देखें'
            : 'Personalized agricultural advice calculated from downscaled weather risks for your selected crop and stage'}
        </p>
      </div>

      <CropAdvisorySection
        weather={weather}
        isHindi={isHindi}
        onOpenSimulator={() => {
          window.location.href = '/simulator';
        }}
      />

      <RadialRiskGauge
        weather={weather}
        isHindi={isHindi}
        onOpenAdvisory={() => {}}
      />
    </div>
  );
}
