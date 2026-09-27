'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '../context/UserContext';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import MobileBottomNav from './MobileBottomNav';
import OnboardingModal from './OnboardingModal';
import PanchayatSelectorModal from './PanchayatSelectorModal';
import PipelineModal from './PipelineModal';
import BulletinPrintModal from './BulletinPrintModal';
import AlertModal from './AlertModal';
import ProfileSettingsModal from './ProfileSettingsModal';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedPanchayat, setPanchayatById, isHindi, updatePreferences } = useUser();

  // Modals state
  const [isPanchayatModalOpen, setIsPanchayatModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // If viewing Landing Page or Login Page, render full screen without internal SaaS dashboard sidebar
  if (pathname === '/landing' || pathname === '/login' || pathname === '/') {
    return <>{children}</>;
  }

  const handleToggleLanguage = () => {
    updatePreferences({ language: isHindi ? 'en' : 'hi' });
  };

  return (
    <div className="min-h-screen bg-[#f1f3f7] p-2 sm:p-4 lg:p-6 flex items-center justify-center pb-20 lg:pb-6">
      {/* First-Time User Onboarding Wizard Modal */}
      <OnboardingModal />

      {/* Main SaaS App Container */}
      <div className="w-full max-w-[1600px] bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-slate-300/40 border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <Sidebar
          selectedPanchayat={selectedPanchayat}
          isHindi={isHindi}
          onOpenPipelineModal={() => setIsPipelineModalOpen(true)}
        />

        {/* Right Main Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f8]">
          {/* Top Navbar */}
          <TopNavbar
            selectedPanchayat={selectedPanchayat}
            isHindi={isHindi}
            onToggleLanguage={handleToggleLanguage}
            onOpenPanchayatSelector={() => setIsPanchayatModalOpen(true)}
            onOpenBulletinModal={() => setIsBulletinModalOpen(true)}
            onOpenPipelineModal={() => setIsPipelineModalOpen(true)}
            onOpenProfileSettings={() => setIsProfileModalOpen(true)}
            onOpenAlertsModal={() => setIsAlertModalOpen(true)}
          />

          {/* Inner Page Viewport */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-7 flex-1">
            {children}
          </main>

          {/* SaaS Footer */}
          <footer className="mt-auto px-8 py-5 border-t border-slate-200/80 bg-white/50 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Mausam Setu (मौसम सेतु)</span>
              <span>•</span>
              <span>Hyperlocal Weather Intelligence for Indian Agriculture</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button
                onClick={() => setIsPipelineModalOpen(true)}
                className="hover:text-blue-600 font-medium transition-colors"
              >
                Downscaling Methodology
              </button>
              <span>•</span>
              <button
                onClick={() => setIsBulletinModalOpen(true)}
                className="hover:text-blue-600 font-medium transition-colors"
              >
                Agromet Bulletin
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenProfileSettings={() => setIsProfileModalOpen(true)}
        isHindi={isHindi}
      />

      {/* Cascading Panchayat Selector Modal */}
      <PanchayatSelectorModal
        isOpen={isPanchayatModalOpen}
        onClose={() => setIsPanchayatModalOpen(false)}
        selectedPanchayat={selectedPanchayat}
        onSelectPanchayat={(p) => setPanchayatById(p.id)}
        isHindi={isHindi}
      />

      {/* AI Downscaling Pipeline Visualizer Modal */}
      <PipelineModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        isHindi={isHindi}
      />

      {/* Printable Agromet Bulletin Modal */}
      <BulletinPrintModal
        isOpen={isBulletinModalOpen}
        onClose={() => setIsBulletinModalOpen(false)}
        panchayat={selectedPanchayat}
        isHindi={isHindi}
      />

      {/* Weather Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        panchayat={selectedPanchayat}
        isHindi={isHindi}
        onOpenAdvisory={() => {
          window.location.href = '/advisory';
        }}
      />

      {/* Farmer Profile & Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
