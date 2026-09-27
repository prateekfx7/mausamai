'use client';

import React from 'react';

interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHindi: boolean;
}

export default function PipelineModal({ isOpen, onClose, isHindi }: PipelineModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Broad Block Forecast',
      titleHi: 'विस्तृत ब्लॉक पूर्वानुमान',
      badge: '35 km Grid',
      desc: 'Synoptic Numerical Weather Prediction (NWP) model outputs from IMD / ECMWF. Smooths out local river basins, hillocks, and vegetative gradients.',
      descHi: 'आईएमडी / मौसम विभाग के 35 किमी ग्रिड वाले मॉडल। स्थानीय पहाड़ियों और नदी घाटियों की सूक्ष्म वर्षा को नहीं पकड़ पाते।',
      icon: '🌐',
    },
    {
      num: '02',
      title: 'AI Downscaling Engine',
      titleHi: 'एआई डाउनस्केलिंग इंजन',
      badge: 'Physics + ML Ensemble',
      desc: 'Combines INSAT-3DR cloud brightness temperature, Sentinel-2 NDVI canopy cover, high-resolution Digital Elevation Model (DEM), and AWS historical bias correction.',
      descHi: 'उपग्रह डेटा (INSAT-3DR), स्थलाकृति (डिजिटल एलिवेशन मॉडल), वनस्पति घनत्व एवं ऐतिहासिक वेधशाला रिकॉर्ड का मिश्रण।',
      icon: '⚡',
    },
    {
      num: '03',
      title: 'Panchayat Micro-Weather',
      titleHi: 'पंचायत सूक्ष्म मौसम',
      badge: '3 km Resolution',
      desc: 'Hyper-localized rainfall, humidity, temperature, and wind speed estimates tailored to the specific Gram Panchayat and its micro-zones with confidence scores.',
      descHi: 'ग्राम पंचायत और उसके सूक्ष्म क्षेत्रों के लिए 3 किमी रिज़ॉल्यूशन पर वर्षा, तापमान और आर्द्रता का सटीक अनुमान।',
      icon: '📍',
    },
    {
      num: '04',
      title: 'Crop Risk Modeling',
      titleHi: 'फसल जोखिम मॉडलिंग',
      badge: 'Agronomic Rules',
      desc: 'Cross-references phenological growth stages (Sowing, Vegetative, Flowering, Harvesting) with localized wet spells, heatwaves, and humidity traps.',
      descHi: 'फसल की वर्तमान अवस्था के साथ नमी, बारिश और तापमान के आधार पर फफूंद रोग व फसल गिरने के जोखिम का आकलन।',
      icon: '🔬',
    },
    {
      num: '05',
      title: 'Farmer Actionable Advice',
      titleHi: 'किसान उपयोगी परामर्श',
      badge: 'Decision Support',
      desc: 'Translates raw meteorological variables into simple, actionable farming decisions: whether to irrigate, spray, sow, harvest, or drain fields.',
      descHi: 'मौसम डेटा को किसान की भाषा में सीधे कदमों में बदलना: सिंचाई करें या रोकें, छिड़काव टालें, जल निकासी बनाएं।',
      icon: '🌾',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Scientific Methodology
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {isHindi ? 'मौसम सेतु: एआई डाउनस्केलिंग कार्यप्रणाली' : 'The Mausam Setu AI Downscaling Pipeline'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHindi
                ? 'ब्लॉक स्तर के सामान्य मौसम से पंचायत स्तर की सटीक कृषि सलाह तक की यात्रा'
                : 'Broad Block Forecast → AI Downscaling → Panchayat Weather → Crop Risk → Actionable Advice'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* 5-Step Visual Flow */}
        <div className="space-y-3">
          {steps.map((st, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-white text-slate-900 shadow-sm border border-slate-200/80 flex items-center justify-center text-xl flex-shrink-0">
                {st.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-600">{st.num}.</span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isHindi ? st.titleHi : st.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {st.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {isHindi ? st.descHi : st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scientific Transparency Alert Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span>🛡️</span>
            <span>{isHindi ? 'वैज्ञानिक पारदर्शिता घोषणा (Transparency Notice)' : 'Scientific Transparency & Confidence Notice'}</span>
          </div>
          <p className="leading-relaxed text-[11px] text-amber-800">
            {isHindi
              ? 'मौसम सेतु किसी भी विशिष्ट खेत (Field-level) के 100% सटीक मौसम का भ्रामक दावा नहीं करता है। सभी भविष्यवाणियां उपग्रह एवं स्थलाकृति द्वारा डाउनस्केल किए गए सांख्यिकीय अनुमान हैं, जिन्हें विश्वसनीयता प्रतिशत (Confidence Score) के साथ प्रदर्शित किया जाता है।'
              : 'Mausam Setu does not make unsupported claims of exact single-field accuracy. All predictions are localized probabilistic estimates downscaled via topographic and satellite physics, accompanied by clear confidence percentages.'}
          </p>
        </div>

        {/* Close button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            {isHindi ? 'समझ गया' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
}
