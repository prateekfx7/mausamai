'use client';

import React from 'react';
import { useUser } from '../../context/UserContext';
import PredictionVerification from '../../components/PredictionVerification';

export default function VerificationPage() {
  const { selectedPanchayat, isHindi } = useUser();
  const weather = selectedPanchayat.weather;

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600">
          <span>AWS Ground-Truth Accuracy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {isHindi ? 'पूर्वानुमान सत्यापन (अनुमान बनाम वास्तविक)' : 'Prediction Accuracy & Ground Verification'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {isHindi
            ? 'स्वचालित मौसम स्टेशन (AWS) द्वारा दर्ज वास्तविक आंकड़ों से एआई मॉडल की निष्पक्ष तुलना'
            : 'Transparent model performance validation against village Automatic Weather Station (AWS) rain gauge sensors'}
        </p>
      </div>

      <PredictionVerification
        weather={weather}
        isHindi={isHindi}
      />
    </div>
  );
}
