'use client';

import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import OfficialGovDashboard from '../../components/OfficialGovDashboard';
import BulletinPrintModal from '../../components/BulletinPrintModal';

export default function OfficialPortalPage() {
  const { selectedPanchayat, isHindi } = useUser();
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-7">
      <div>
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-700">
          <span>Official Government & IMD Node</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {isHindi ? 'सरकारी / आईएमडी कृषि पोर्टल' : 'Official IMD Agromet Advisory Portal'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          {isHindi
            ? 'भारत मौसम विज्ञान विभाग (IMD) और कृषि विज्ञान केंद्र (KVK) आधिकारिक बुलेटिन'
            : 'Official India Meteorological Department (IMD) and Krishi Vigyan Kendra (KVK) district bulletin synchronization node'}
        </p>
      </div>

      <OfficialGovDashboard
        isHindi={isHindi}
        onOpenBulletinModal={() => setIsBulletinOpen(true)}
      />

      <BulletinPrintModal
        isOpen={isBulletinOpen}
        onClose={() => setIsBulletinOpen(false)}
        panchayat={selectedPanchayat}
        isHindi={isHindi}
      />
    </div>
  );
}
