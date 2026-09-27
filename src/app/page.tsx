'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import WeatherOverviewCard from '../components/WeatherOverviewCard';
import RadialRiskGauge from '../components/RadialRiskGauge';
import InteractiveMap from '../components/InteractiveMap';
import ForecastBarChart from '../components/ForecastBarChart';

export default function Home() {
  const { preferences, selectedPanchayat, isHindi } = useUser();
  const weather = selectedPanchayat.weather;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header Greeting */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-4">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-300">
              <span>Good morning 👋</span>
              <span>•</span>
              <span>{preferences.crop} ({preferences.cropStage})</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
              {isHindi
                ? `मौसम बुद्धिमत्ता: Gram Panchayat ${selectedPanchayat.panchayat}`
                : `Weather Intelligence for ${selectedPanchayat.panchayat}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {selectedPanchayat.block} Block • {selectedPanchayat.district}, {selectedPanchayat.state}
            </p>
          </div>
        </div>

        {/* 4 Current Conditions Pills */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/15 text-xs">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-slate-300 uppercase font-bold">Current Temp</div>
            <div className="text-xl font-black text-white mt-0.5">{weather.temperatureCurrent}°C</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-blue-300 uppercase font-bold">Rain Probability</div>
            <div className="text-xl font-black text-blue-200 mt-0.5">{weather.rainfallProbability}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-cyan-300 uppercase font-bold">Air Humidity</div>
            <div className="text-xl font-black text-cyan-100 mt-0.5">{weather.humidity}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
            <div className="text-[10px] text-amber-300 uppercase font-bold">Wind Speed</div>
            <div className="text-xl font-black text-amber-100 mt-0.5">{weather.windSpeed} km/h</div>
          </div>
        </div>

        {/* Background decorative gradient glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* "Today's Farming Recommendation" Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-emerald-500/10 rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌧️</span>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
              {isHindi ? 'आज की कृषि सलाह' : "Today's Farming Recommendation"}
            </div>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {isHindi
                ? '24 घंटे के भीतर बारिश की संभावना। सिंचाई टालने पर विचार करें और खेत के जल निकास पर नजर रखें।'
                : 'Rain expected within 24 hours. Consider postponing irrigation and monitor field drainage.'}
            </p>
          </div>
        </div>

        <Link
          href="/advisory"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 whitespace-nowrap"
        >
          {isHindi ? 'पूरी सलाह देखें →' : 'View Full Advisory →'}
        </Link>
      </div>

      {/* 3-Question Core Summary Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-400">
          {isHindi ? 'त्वरित मौसम जवाब (Quick Answers):' : 'Immediate Dashboard Answers:'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            <div className="font-bold text-blue-900 uppercase text-[10px]">1. What is the weather?</div>
            <div className="font-extrabold text-slate-800 text-sm mt-1">
              {weather.temperatureCurrent}°C • {weather.rainfallExpected} rain ({weather.rainfallProbability}%)
            </div>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
            <div className="font-bold text-amber-900 uppercase text-[10px]">2. What does it mean for my crop?</div>
            <div className="font-extrabold text-slate-800 text-sm mt-1">
              Moderate Rain Risk for {preferences.crop} ({preferences.cropStage})
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
            <div className="font-bold text-emerald-900 uppercase text-[10px]">3. What should I do?</div>
            <div className="font-extrabold text-slate-800 text-sm mt-1">
              Postpone irrigation & check field drainage furrows
            </div>
          </div>
        </div>
      </div>

      {/* Top Row Grid: WeatherOverviewCard (Left) + Dark Hero Alert & Mini Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: WeatherOverviewCard */}
        <div className="lg:col-span-8">
          <WeatherOverviewCard
            weather={weather}
            isHindi={isHindi}
            onOpenPipelineModal={() => {}}
          />
        </div>

        {/* Right: Dark Hero Alert Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[#18181b] p-6 text-white shadow-xl shadow-slate-900/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                ⚠️ Heavy Rain Alert
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </div>

            <div>
              <h4 className="text-xl font-bold tracking-tight text-white leading-tight">
                {isHindi ? weather.todayAlert.titleHi : weather.todayAlert.title}
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {isHindi ? weather.todayAlert.messageHi : weather.todayAlert.message}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Peak Window:</span>
                <span className="font-semibold text-white">{weather.todayAlert.timeWindow}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">At-Risk Crops:</span>
                <span className="font-semibold text-amber-300">{weather.todayAlert.impactedCrops.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/alerts"
                className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-500/30 text-center"
              >
                <span>{isHindi ? 'अलर्ट देखें' : 'View Alert Center'}</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map & Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <InteractiveMap
            weather={weather}
            panchayatName={selectedPanchayat.panchayat}
            isHindi={isHindi}
            onOpenPipelineModal={() => {}}
            lat={selectedPanchayat.lat}
            lng={selectedPanchayat.lng}
            zoom={selectedPanchayat.zoom}
          />
        </div>
        <div className="lg:col-span-5">
          <RadialRiskGauge
            weather={weather}
            isHindi={isHindi}
            onOpenAdvisory={() => {
              window.location.href = '/advisory';
            }}
          />
        </div>
      </div>

      {/* 7-Day Forecast Bar Chart */}
      <ForecastBarChart
        forecasts={weather.sevenDayForecast}
        isHindi={isHindi}
      />
    </div>
  );
}
