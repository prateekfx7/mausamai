'use client';

import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { ADMINISTRATIVE_TREE, PANCHAYAT_DATABASE } from '../data/panchayatData';
import { CropType, GrowthStage } from '../types';

export default function OnboardingModal() {
  const { preferences, updatePreferences, detectCurrentLocation, selectedPanchayat } = useUser();
  const [step, setStep] = useState<number>(1);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsDetectedInfo, setGpsDetectedInfo] = useState<string | null>(null);

  // Temporary selection state during wizard
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nashik');
  const [selectedBlock, setSelectedBlock] = useState<string>('Niphad');
  const [selectedPanchayatId, setSelectedPanchayatId] = useState<string>('mh-nsk-nip-pip');
  const [locationMode, setLocationMode] = useState<'current' | 'manual'>('current');

  const handleGpsDetect = async () => {
    setLocationMode('current');
    setIsDetectingGps(true);
    const loc = await detectCurrentLocation();
    setIsDetectingGps(false);
    if (loc) {
      setSelectedState(loc.state);
      setSelectedDistrict(loc.district);
      setSelectedBlock(loc.block);
      setSelectedPanchayatId(loc.id);
      setGpsDetectedInfo(`${loc.panchayat}, ${loc.district} (${loc.state})`);
    }
  };

  const [selectedCrop, setSelectedCrop] = useState<CropType>(preferences.crop || 'Wheat');
  const [selectedStage, setSelectedStage] = useState<GrowthStage>(preferences.cropStage || 'Flowering');

  if (preferences.onboardingComplete) {
    return null;
  }

  const currentStateObj = ADMINISTRATIVE_TREE.find((s) => s.state === selectedState);
  const districts = currentStateObj?.districts || [];
  const currentDistrictObj = districts.find((d) => d.name === selectedDistrict);
  const blocks = currentDistrictObj?.blocks || [];
  const currentBlockObj = blocks.find((b) => b.name === selectedBlock);
  const panchayats = currentBlockObj?.panchayats || [];

  const handleStateChange = (st: string) => {
    setSelectedState(st);
    const sObj = ADMINISTRATIVE_TREE.find((s) => s.state === st);
    if (sObj && sObj.districts.length > 0) {
      const d = sObj.districts[0];
      setSelectedDistrict(d.name);
      if (d.blocks.length > 0) {
        const b = d.blocks[0];
        setSelectedBlock(b.name);
        if (b.panchayats.length > 0) {
          setSelectedPanchayatId(b.panchayats[0].id);
        }
      }
    }
  };

  const handleDistrictChange = (d: string) => {
    setSelectedDistrict(d);
    const dObj = districts.find((item) => item.name === d);
    if (dObj && dObj.blocks.length > 0) {
      const b = dObj.blocks[0];
      setSelectedBlock(b.name);
      if (b.panchayats.length > 0) {
        setSelectedPanchayatId(b.panchayats[0].id);
      }
    }
  };

  const handleBlockChange = (b: string) => {
    setSelectedBlock(b);
    const bObj = blocks.find((item) => item.name === b);
    if (bObj && bObj.panchayats.length > 0) {
      setSelectedPanchayatId(bObj.panchayats[0].id);
    }
  };

  const cropsList: { type: CropType; label: string; desc: string }[] = [
    { type: 'Wheat', label: 'Wheat', desc: 'Rabi cereal grain' },
    { type: 'Rice', label: 'Rice', desc: 'Kharif paddy' },
    { type: 'Soybean', label: 'Soybean', desc: 'Oilseed crop' },
    { type: 'Cotton', label: 'Cotton', desc: 'Commercial cash fiber' },
    { type: 'Tomato', label: 'Tomato', desc: 'Horticulture vegetable' },
    { type: 'Other', label: 'Other', desc: 'General / custom crop' },
  ];

  const stagesList: { stage: GrowthStage; label: string; desc: string }[] = [
    { stage: 'Sowing', label: 'Sowing', desc: 'Germination and early root development' },
    { stage: 'Vegetative', label: 'Growing', desc: 'Canopy growth and tillering' },
    { stage: 'Flowering', label: 'Flowering', desc: 'Heading and grain/fruit formation' },
    { stage: 'Harvesting', label: 'Harvesting', desc: 'Maturity, drying, and field picking' },
  ];

  const activePanchayatName =
    PANCHAYAT_DATABASE.find((p) => p.id === selectedPanchayatId)?.panchayat ||
    'Pipla Khurd';

  const handleFinish = () => {
    updatePreferences({
      panchayatId: selectedPanchayatId,
      crop: selectedCrop,
      cropStage: selectedStage,
      onboardingComplete: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between min-h-[460px]">
        {/* Progress Bar (Screens 1 to 5) */}
        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx <= step ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* SCREEN 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 my-auto text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome to Mausam Setu
              </h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Understand your local weather. Make smarter farming decisions.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/25"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: Location */}
        {step === 2 && (
          <div className="space-y-5 my-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 2 of 5</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Where is your farm?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Localize forecasts down to your specific Gram Panchayat.
              </p>
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleGpsDetect}
                className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                  locationMode === 'current'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{isDetectingGps ? 'Detecting GPS...' : '📍 Real GPS Location'}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-normal">Detect live browser location</div>
              </button>

              <button
                onClick={() => setLocationMode('manual')}
                className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                  locationMode === 'manual'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span>Select Manually</span>
                </div>
                <div className="text-[11px] text-slate-500 font-normal">Choose State & District</div>
              </button>
            </div>

            {locationMode === 'current' ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Detected Location:</span>
                  <button
                    onClick={handleGpsDetect}
                    className="text-[10px] text-blue-600 font-bold hover:underline"
                  >
                    🔄 Re-detect
                  </button>
                </div>
                <div className="text-sm font-black text-blue-700">
                  {gpsDetectedInfo || `${activePanchayatName}, Niphad`}
                </div>
                <div className="text-xs text-slate-500">Live GPS Coordinates • 3km Grid Active</div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      {ADMINISTRATIVE_TREE.map((s) => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      {districts.map((d) => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Block</label>
                    <select
                      value={selectedBlock}
                      onChange={(e) => handleBlockChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      {blocks.map((b) => (
                        <option key={b.name} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Panchayat</label>
                    <select
                      value={selectedPanchayatId}
                      onChange={(e) => setSelectedPanchayatId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      {panchayats.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                Next: Select Crop
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: Crop Selection */}
        {step === 3 && (
          <div className="space-y-4 my-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 3 of 5</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                What do you grow?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your primary standing crop to customize weather sensitivity thresholds.
              </p>
            </div>

            <div className="space-y-2">
              {cropsList.map((crop) => {
                const isSelected = selectedCrop === crop.type;
                return (
                  <button
                    key={crop.type}
                    onClick={() => setSelectedCrop(crop.type)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{crop.label}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{crop.desc}</div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                Next: Select Stage
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: Crop Stage */}
        {step === 4 && (
          <div className="space-y-4 my-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Step 4 of 5</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                What is your crop stage?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Crop water requirements and disease susceptibility vary drastically across stages.
              </p>
            </div>

            <div className="space-y-2">
              {stagesList.map((stg) => {
                const isSelected = selectedStage === stg.stage;
                return (
                  <button
                    key={stg.stage}
                    onClick={() => setSelectedStage(stg.stage)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{stg.label}</div>
                      <div className={`text-[11px] font-medium ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {stg.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep(3)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                Next: Review Setup
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: Confirmation */}
        {step === 5 && (
          <div className="space-y-6 my-auto">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Final Step</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                You're all set.
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your localized agricultural intelligence profile is configured.
              </p>
            </div>

            {/* Selected preferences summary card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase">Gram Panchayat</span>
                <span className="text-sm font-black text-slate-900">{activePanchayatName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase">Crop</span>
                <span className="text-sm font-black text-blue-600">{selectedCrop}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Growth Stage</span>
                <span className="text-sm font-black text-slate-800">{selectedStage}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/25"
            >
              View My Forecast
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
