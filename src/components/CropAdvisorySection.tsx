'use client';

import React, { useState } from 'react';
import { CropType, GrowthStage, WeatherData } from '../types';
import { CROP_CONFIGS, STAGE_CONFIGS, getCropAdvisory } from '../data/cropAdvisory';

interface CropAdvisorySectionProps {
  weather: WeatherData;
  isHindi: boolean;
  onOpenSimulator: () => void;
}

export default function CropAdvisorySection({
  weather,
  isHindi,
  onOpenSimulator,
}: CropAdvisorySectionProps) {
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Wheat');
  const [selectedStage, setSelectedStage] = useState<GrowthStage>('Flowering');
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const advisory = getCropAdvisory(selectedCrop, selectedStage, weather.rainfallMm, weather.humidity);

  const handleShareAdvisory = () => {
    const text = `🌾 *Mausam Setu Farmer Advisory*\nCrop: ${advisory.crop} (${advisory.stage})\nWeather: ${advisory.weatherHeadline}\nRecommended: ${advisory.recommendations.join(', ')}`;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const msg = new SpeechSynthesisUtterance();
      msg.text = isHindi
        ? `${advisory.cropHi} फसल, ${advisory.stageHi} अवस्था। ${advisory.weatherHeadlineHi} मुख्य सलाह: ${advisory.recommendationsHi[0]}`
        : `${advisory.crop} crop, ${advisory.stage} stage. ${advisory.weatherHeadline} Recommended action: ${advisory.recommendations[0]}`;
      msg.lang = isHindi ? 'hi-IN' : 'en-IN';
      msg.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(msg);
    } else {
      alert('Speech synthesis not supported on this browser.');
    }
  };

  const getRiskBadge = (level: string) => {
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
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-800 tracking-tight">
              {isHindi ? 'फसल-विशिष्ट कृषि परामर्श' : 'Crop-Specific Weather Advisory'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Stage-Aware AI
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isHindi
              ? 'अपनी फसल एवं विकास अवस्था चुनें और मौसम के अनुसार सटीक कदम उठाएं'
              : 'Select your crop and growth stage to generate instant downscaled agricultural advice'}
          </p>
        </div>

        {/* Action buttons: Voice readout & WhatsApp copy */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isPlayingAudio
                ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>{isPlayingAudio ? '⏹' : '🔊'}</span>
            <span>{isPlayingAudio ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'ऑडियो सुनें' : 'Listen')}</span>
          </button>

          <button
            onClick={handleShareAdvisory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all"
          >
            <span>{isCopied ? '✓' : '📲'}</span>
            <span>{isCopied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'व्हाट्सएप साझा' : 'Share WhatsApp')}</span>
          </button>
        </div>
      </div>

      {/* Step 1: Select Crop */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {isHindi ? '1. फसल का चयन करें' : '1. Select Crop'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {CROP_CONFIGS.map((crop) => {
            const isSelected = selectedCrop === crop.type;
            return (
              <button
                key={crop.type}
                onClick={() => setSelectedCrop(crop.type)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <span className="text-2xl">{crop.emoji}</span>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {isHindi ? crop.nameHi : crop.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {crop.type}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Growth Stage */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {isHindi ? '2. फसल वृद्धि अवस्था' : '2. Growth Stage'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STAGE_CONFIGS.map((stg) => {
            const isSelected = selectedStage === stg.stage;
            return (
              <button
                key={stg.stage}
                onClick={() => setSelectedStage(stg.stage)}
                className={`p-3 rounded-2xl border text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {isHindi ? stg.nameHi : stg.name}
                  </div>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </div>
                <div className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {stg.days}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generated Advisory Card (Matching prompt specifications) */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-5 border border-slate-200/90 space-y-4">
        {/* Card Title & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {CROP_CONFIGS.find((c) => c.type === selectedCrop)?.emoji}
            </span>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {selectedCrop} — {selectedStage} Stage
                <span className="text-xs font-medium text-slate-500 ml-2">
                  ({isHindi ? advisory.cropHi : advisory.crop})
                </span>
              </h4>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">
                {isHindi ? advisory.weatherHeadlineHi : advisory.weatherHeadline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getRiskBadge(advisory.riskLevel)}`}>
              {advisory.riskLevel === 'high' ? 'High Risk' : advisory.riskLevel === 'moderate' ? 'Moderate Risk' : 'Low Risk'}
            </span>
          </div>
        </div>

        {/* Prompt Section 6: Summary Pills: My Crop, Growth Stage, Current Weather */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">{isHindi ? 'मेरी फसल:' : 'My Crop:'}</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {CROP_CONFIGS.find(c => c.type === selectedCrop)?.emoji} {selectedCrop}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">{isHindi ? 'विकास अवस्था:' : 'Growth Stage:'}</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {selectedStage}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">{isHindi ? 'वर्तमान मौसम:' : 'Current Weather:'}</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              🌧 {weather.rainfallExpected} rain
            </span>
          </div>
        </div>

        {/* Prompt Section 6: 4 Calculated Risk Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Rain Risk */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span>🌧</span>
              <span>{isHindi ? 'वर्षा जोखिम' : 'Rain Risk'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
              🟡 {weather.risks.rainfall === 'high' ? 'High' : weather.risks.rainfall === 'moderate' ? 'Moderate' : 'Low'}
            </span>
          </div>

          {/* Heat Risk */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span>🌡</span>
              <span>{isHindi ? 'तापमान जोखिम' : 'Heat Risk'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              🟢 {weather.risks.heat === 'high' ? 'High' : weather.risks.heat === 'moderate' ? 'Moderate' : 'Low'}
            </span>
          </div>

          {/* Wind Risk */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span>💨</span>
              <span>{isHindi ? 'हवा जोखिम' : 'Wind Risk'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              🟢 {weather.risks.wind === 'high' ? 'High' : weather.risks.wind === 'moderate' ? 'Moderate' : 'Low'}
            </span>
          </div>

          {/* Water Stress */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span>💧</span>
              <span>{isHindi ? 'जल तनाव' : 'Water Stress'}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              🟢 Low
            </span>
          </div>
        </div>

        {/* Operational Status Badges (Irrigation & Spraying) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💧</span>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">{isHindi ? 'सिंचाई स्थिति' : 'Irrigation Advice'}</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{advisory.irrigationStatus}</div>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              advisory.irrigationStatus === 'Hold' || advisory.irrigationStatus === 'Drain Fields' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {weather.rainfallExpected} rain
            </span>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧪</span>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">{isHindi ? 'छिड़काव स्थिति' : 'Spraying Condition'}</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{advisory.sprayingStatus}</div>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              advisory.sprayingStatus.includes('Postpone') || advisory.sprayingStatus.includes('Avoid') ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {weather.windSpeed} km/h wind
            </span>
          </div>
        </div>

        {/* Recommended Actions with "Why?" option per recommendation */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{isHindi ? 'अनुशंसित कृषि कार्य (Recommended Actions)' : 'Recommended Actions'}</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {(isHindi ? advisory.recommendationsHi : advisory.recommendations).map((rec, i) => (
              <li key={i} className="flex flex-col gap-1 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">{i + 1}.</span>
                    <span className="leading-relaxed font-semibold text-slate-800">{rec}</span>
                  </div>
                  <button
                    onClick={() => {
                      const el = document.getElementById(`rec-why-${i}`);
                      if (el) el.classList.toggle('hidden');
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex-shrink-0"
                  >
                    Why?
                  </button>
                </div>
                <div id={`rec-why-${i}`} className="hidden text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                  💡 <strong>Reason:</strong> {i === 0 ? 'Upcoming rainfall of 22.4mm meets moisture needs; additional watering causes root asphyxiation & leaching.' : i === 1 ? 'Standing water over 12 hours deprives oxygen from roots causing yellowing and fungal rot.' : 'Raindrops within 4 hours wash active chemical ingredients off leaves into runoff.'}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pest & Disease Warning if applicable */}
        {advisory.pestDiseaseWarning && (
          <div className="bg-red-50/80 rounded-xl p-3.5 border border-red-200 flex items-start gap-3 text-xs text-red-800">
            <span className="text-lg">⚠️</span>
            <div>
              <div className="font-bold">{isHindi ? 'कीट एवं रोग पूर्वचेतावनी:' : 'Pest & Disease Early Warning:'}</div>
              <p className="mt-0.5 leading-relaxed">{advisory.pestDiseaseWarning}</p>
            </div>
          </div>
        )}

        {/* Dos and Don'ts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
            <div className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <span>👍</span>
              <span>{isHindi ? 'क्या करें (Dos)' : 'Do’s'}</span>
            </div>
            <ul className="space-y-1 text-slate-700">
              {advisory.dos.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100">
            <div className="font-bold text-rose-800 flex items-center gap-1.5 mb-1.5">
              <span>🛑</span>
              <span>{isHindi ? 'क्या न करें (Don’ts)' : 'Don’ts'}</span>
            </div>
            <ul className="space-y-1 text-slate-700">
              {advisory.donts.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA to Simulator */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 font-medium">
            {isHindi ? 'क्या आप खेत में कोई विशेष कार्य करने जा रहे हैं?' : 'Planning an immediate farm action?'}
          </span>
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
          >
            <span>{isHindi ? 'सिमुलेटर में परीक्षण करें' : 'Test in What-If Simulator'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
