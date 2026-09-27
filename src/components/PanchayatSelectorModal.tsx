'use client';

import React, { useState } from 'react';
import { ADMINISTRATIVE_TREE, PANCHAYAT_DATABASE } from '../data/panchayatData';
import { PanchayatLocation } from '../types';

interface PanchayatSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPanchayat: PanchayatLocation;
  onSelectPanchayat: (panchayat: PanchayatLocation) => void;
  isHindi: boolean;
}

export default function PanchayatSelectorModal({
  isOpen,
  onClose,
  selectedPanchayat,
  onSelectPanchayat,
  isHindi,
}: PanchayatSelectorModalProps) {
  const [selectedState, setSelectedState] = useState<string>(selectedPanchayat.state);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(selectedPanchayat.district);
  const [selectedBlock, setSelectedBlock] = useState<string>(selectedPanchayat.block);
  const [selectedPanchayatId, setSelectedPanchayatId] = useState<string>(selectedPanchayat.id);

  if (!isOpen) return null;

  const currentStateObj = ADMINISTRATIVE_TREE.find((s) => s.state === selectedState);
  const districts = currentStateObj?.districts || [];
  const currentDistrictObj = districts.find((d) => d.name === selectedDistrict);
  const blocks = currentDistrictObj?.blocks || [];
  const currentBlockObj = blocks.find((b) => b.name === selectedBlock);
  const panchayats = currentBlockObj?.panchayats || [];

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const sObj = ADMINISTRATIVE_TREE.find((s) => s.state === stateName);
    if (sObj && sObj.districts.length > 0) {
      const firstDist = sObj.districts[0];
      setSelectedDistrict(firstDist.name);
      if (firstDist.blocks.length > 0) {
        const firstBlock = firstDist.blocks[0];
        setSelectedBlock(firstBlock.name);
        if (firstBlock.panchayats.length > 0) {
          setSelectedPanchayatId(firstBlock.panchayats[0].id);
        }
      }
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const dObj = districts.find((d) => d.name === distName);
    if (dObj && dObj.blocks.length > 0) {
      const firstBlock = dObj.blocks[0];
      setSelectedBlock(firstBlock.name);
      if (firstBlock.panchayats.length > 0) {
        setSelectedPanchayatId(firstBlock.panchayats[0].id);
      }
    }
  };

  const handleBlockChange = (blkName: string) => {
    setSelectedBlock(blkName);
    const bObj = blocks.find((b) => b.name === blkName);
    if (bObj && bObj.panchayats.length > 0) {
      setSelectedPanchayatId(bObj.panchayats[0].id);
    }
  };

  const handleConfirm = () => {
    // Look up detailed panchayat or fallback to available
    const found = PANCHAYAT_DATABASE.find((p) => p.id === selectedPanchayatId);
    if (found) {
      onSelectPanchayat(found);
    } else {
      // Create a localized clone from the active one with chosen names
      const base = PANCHAYAT_DATABASE[0];
      const cloned: PanchayatLocation = {
        ...base,
        id: selectedPanchayatId,
        state: selectedState,
        district: selectedDistrict,
        block: selectedBlock,
        panchayat: panchayats.find((p) => p.id === selectedPanchayatId)?.name || 'Gram Panchayat',
        panchayatHi: panchayats.find((p) => p.id === selectedPanchayatId)?.name || 'ग्राम पंचायत',
      };
      onSelectPanchayat(cloned);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <h3 className="text-lg font-bold text-slate-900">
                {isHindi ? 'ग्राम पंचायत चुनें' : 'Select Gram Panchayat'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isHindi
                ? 'राज्य → जिला → ब्लॉक → ग्राम पंचायत का पदानुक्रम चुनें'
                : 'State → District → Block → Panchayat cascading selector'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* 4 Cascading Dropdowns */}
        <div className="space-y-4">
          {/* 1. State */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              {isHindi ? '1. राज्य (State)' : '1. State'}
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {ADMINISTRATIVE_TREE.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              {isHindi ? '2. जिला (District)' : '2. District'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Block */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              {isHindi ? '3. ब्लॉक / तहसील (Block)' : '3. Block / Tehsil'}
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {blocks.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Panchayat */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              {isHindi ? '4. ग्राम पंचायत (Gram Panchayat)' : '4. Gram Panchayat'}
            </label>
            <select
              value={selectedPanchayatId}
              onChange={(e) => setSelectedPanchayatId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {panchayats.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.hasDetailedData ? '⭐ (Full 3km GIS telemetry)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Summary Pill */}
        <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-800 flex items-center justify-between">
          <span>Active Selection:</span>
          <span className="font-bold">
            {selectedState} &gt; {selectedDistrict} &gt; {selectedBlock} &gt; {panchayats.find((p) => p.id === selectedPanchayatId)?.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            {isHindi ? 'लागू करें एवं मौसम देखें' : 'Apply & View Panchayat Weather'}
          </button>
        </div>
      </div>
    </div>
  );
}
