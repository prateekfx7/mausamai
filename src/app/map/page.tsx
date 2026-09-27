'use client';

import React from 'react';
import { useUser } from '../../context/UserContext';
import InteractiveMap from '../../components/InteractiveMap';
import WeatherOverviewCard from '../../components/WeatherOverviewCard';

export default function WeatherMapPage() {
  const { selectedPanchayat, isHindi } = useUser();
  const weather = selectedPanchayat.weather;

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600">
          <span>Panchayat GIS • 3km Grid</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {isHindi ? 'पंचायत सूक्ष्म-क्षेत्र मौसम नक्शा' : 'Panchayat Micro-Zone Weather Map'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {isHindi
            ? `${selectedPanchayat.panchayat} पंचायत के सूक्ष्म-क्षेत्रों का हाइपरलोकल 3km वर्षा नक्शा`
            : `Hyperlocal 3km downscaled precipitation map across micro-zones in ${selectedPanchayat.panchayat}`}
        </p>
      </div>

      <InteractiveMap
        weather={weather}
        panchayatName={selectedPanchayat.panchayat}
        isHindi={isHindi}
        onOpenPipelineModal={() => {}}
        lat={selectedPanchayat.lat}
        lng={selectedPanchayat.lng}
        zoom={selectedPanchayat.zoom}
      />

      <WeatherOverviewCard
        weather={weather}
        isHindi={isHindi}
        onOpenPipelineModal={() => {}}
      />
    </div>
  );
}
