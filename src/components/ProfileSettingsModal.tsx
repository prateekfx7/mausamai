'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { ADMINISTRATIVE_TREE, PANCHAYAT_DATABASE } from '../data/panchayatData';
import { CROP_CONFIGS, STAGE_CONFIGS } from '../data/cropAdvisory';
import { CropType, GrowthStage } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { preferences, updatePreferences, resetOnboarding } = useUser();

  const [selectedCrop, setSelectedCrop] = useState<CropType>(preferences.crop || 'Wheat');
  const [selectedStage, setSelectedStage] = useState<GrowthStage>(preferences.cropStage || 'Flowering');
  const [language, setLanguage] = useState<'en' | 'hi'>(preferences.language || 'en');
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [audioVoiceAlerts, setAudioVoiceAlerts] = useState(true);

  // Administrative selection
  const currentPanchayat = PANCHAYAT_DATABASE.find(p => p.id === preferences.panchayatId) || PANCHAYAT_DATABASE[0];
  const [selectedState, setSelectedState] = useState(currentPanchayat.state);
  const [selectedDistrict, setSelectedDistrict] = useState(currentPanchayat.district);
  const [selectedBlock, setSelectedBlock] = useState(currentPanchayat.block);
  const [selectedPanchayatId, setSelectedPanchayatId] = useState(currentPanchayat.id);

  if (!isOpen) return null;

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

  const handleSave = () => {
    updatePreferences({
      panchayatId: selectedPanchayatId,
      crop: selectedCrop,
      cropStage: selectedStage,
      language: language,
    });
    onClose();
  };

  const handleResetOnboarding = () => {
    resetOnboarding();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              ⚙️
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {language === 'hi' ? 'किसान प्रोफाइल एवं सेटिंग्स' : 'Farmer Profile & Settings'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {language === 'hi' ? 'अपनी प्राथमिकताओं और फसल की जानकारी अपडेट करें' : 'Manage farm preferences and notification settings'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* 1. Location selection */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              📍 Gram Panchayat Location
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                >
                  {ADMINISTRATIVE_TREE.map((s) => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                >
                  {districts.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Block</label>
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                >
                  {blocks.map((b) => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Panchayat</label>
                <select
                  value={selectedPanchayatId}
                  onChange={(e) => setSelectedPanchayatId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                >
                  {panchayats.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Crop selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              🌾 Primary Crop
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CROP_CONFIGS.map((c) => (
                <button
                  key={c.type}
                  onClick={() => setSelectedCrop(c.type)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    selectedCrop === c.type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{c.emoji} {c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Crop Stage selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              🌱 Growth Stage
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STAGE_CONFIGS.map((stg) => (
                <button
                  key={stg.stage}
                  onClick={() => setSelectedStage(stg.stage)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedStage === stg.stage
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>{stg.name}</div>
                  <div className="text-[10px] opacity-70 font-normal">{stg.days}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Language Selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              🌐 Preferred Language / भाषा
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                English 🇬🇧
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                हिन्दी 🇮🇳
              </button>
            </div>
          </div>

          {/* 5. Notification Preferences */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              🔔 Notification Preferences
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">SMS Advisory Alerts</span>
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Audio Voice Readouts</span>
              <input
                type="checkbox"
                checked={audioVoiceAlerts}
                onChange={(e) => setAudioVoiceAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600"
              />
            </div>
          </div>

          {/* Re-trigger Onboarding Button */}
          <div className="pt-1">
            <button
              onClick={handleResetOnboarding}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              🔄 Re-run Welcome Onboarding Flow
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-1.5 py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>{language === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
