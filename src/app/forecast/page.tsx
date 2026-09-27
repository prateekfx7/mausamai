'use client';

import React from 'react';
import { useUser } from '../../context/UserContext';
import ForecastBarChart from '../../components/ForecastBarChart';

export default function ForecastPage() {
  const { selectedPanchayat, isHindi } = useUser();
  const weather = selectedPanchayat.weather;

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600">
          <span>7-Day Meteorological Outlook</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {isHindi ? '7-दिवसीय पंचायत मौसम पूर्वानुमान' : '7-Day Panchayat Weather Forecast'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {isHindi
            ? `ग्राम पंचायत ${selectedPanchayat.panchayat} के लिए दैनिक वर्षा, आर्द्रता और हवा का अनुमान`
            : `Daily precipitation, temperature, humidity, and wind trend predictions for Gram Panchayat ${selectedPanchayat.panchayat}`}
        </p>
      </div>

      <ForecastBarChart
        forecasts={weather.sevenDayForecast}
        isHindi={isHindi}
      />

      {/* Grid of Daily Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {weather.sevenDayForecast.map((day, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">{day.day}</span>
              <span className="text-xs text-slate-400 font-medium">{day.date}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Temp Range:</span>
              <span className="font-bold text-slate-800">{day.tempMin}°C - {day.tempMax}°C</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Expected Rain:</span>
              <span className="font-bold text-blue-600">{day.rainMm} mm ({day.rainProb}%)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Humidity:</span>
              <span className="font-bold text-slate-700">{day.humidity}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Wind:</span>
              <span className="font-bold text-slate-700">{day.windKm} km/h</span>
            </div>
            <div className="pt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
              Condition: {day.condition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
