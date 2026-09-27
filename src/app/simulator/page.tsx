'use client';

import React from 'react';
import { useUser } from '../../context/UserContext';
import WhatIfSimulator from '../../components/WhatIfSimulator';

export default function SimulatorPage() {
  const { selectedPanchayat, isHindi } = useUser();
  const weather = selectedPanchayat.weather;

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600">
          <span>Decision Support Tool</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {isHindi ? 'क्या-अगर कृषि निर्णय सिमुलेटर' : 'What-If Farm Action Simulator'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {isHindi
            ? 'सिंचाई, छिड़काव, बुवाई या कटाई से पहले मौसम के जोखिम का परीक्षण करें'
            : 'Simulate crop risk and financial outcome before investing labor or input costs in irrigation, spraying, sowing, or harvesting'}
        </p>
      </div>

      <WhatIfSimulator
        weather={weather}
        isHindi={isHindi}
      />
    </div>
  );
}
