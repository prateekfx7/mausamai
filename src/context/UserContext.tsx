'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PanchayatLocation, CropType, GrowthStage } from '../types';
import { PANCHAYAT_DATABASE } from '../data/panchayatData';

export interface UserPreferences {
  panchayatId: string;
  crop: CropType;
  cropStage: GrowthStage;
  language: 'en' | 'hi';
  onboardingComplete: boolean;
}

interface UserContextType {
  preferences: UserPreferences;
  selectedPanchayat: PanchayatLocation;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  setPanchayatById: (id: string) => void;
  detectCurrentLocation: () => Promise<PanchayatLocation | null>;
  resetOnboarding: () => void;
  isHindi: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  panchayatId: PANCHAYAT_DATABASE[0].id,
  crop: 'Wheat',
  cropStage: 'Flowering',
  language: 'en',
  onboardingComplete: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mausam_setu_user_pref');
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch {
      // ignore storage failure
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('mausam_setu_user_pref', JSON.stringify(next));
      } catch {
        // ignore storage failure
      }
      return next;
    });
  };

  const setPanchayatById = (id: string) => {
    updatePreferences({ panchayatId: id });
  };

  const detectCurrentLocation = (): Promise<PanchayatLocation | null> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let closest = PANCHAYAT_DATABASE[0];
          let minDistance = Infinity;

          PANCHAYAT_DATABASE.forEach((p) => {
            if (p.lat !== undefined && p.lng !== undefined) {
              const latDiff = p.lat - latitude;
              const lngDiff = p.lng - longitude;
              const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
              if (dist < minDistance) {
                minDistance = dist;
                closest = p;
              }
            }
          });

          updatePreferences({ panchayatId: closest.id });
          resolve(closest);
        },
        (error) => {
          console.warn('Geolocation failed or permission denied:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const resetOnboarding = () => {
    updatePreferences({ onboardingComplete: false });
  };

  const selectedPanchayat =
    PANCHAYAT_DATABASE.find((p) => p.id === preferences.panchayatId) ||
    PANCHAYAT_DATABASE[0];

  const isHindi = preferences.language === 'hi';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f1f3f7] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        preferences,
        selectedPanchayat,
        updatePreferences,
        setPanchayatById,
        detectCurrentLocation,
        resetOnboarding,
        isHindi,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}
