'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import ScrollReveal from '../../components/ScrollReveal';

export default function LandingPage() {
  const router = useRouter();
  const { detectCurrentLocation, selectedPanchayat: userPanchayat, isHindi } = useUser();

  // Search Bar State
  const [selectedState, setSelectedState] = useState('Madhya Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState('Ujjain');
  const [selectedBlock, setSelectedBlock] = useState('Badnagar');
  const [selectedPanchayat, setSelectedPanchayat] = useState('Pipla Khurd');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLocationName, setDetectedLocationName] = useState<string | null>(null);

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    const loc = await detectCurrentLocation();
    setIsDetecting(false);
    if (loc) {
      setSelectedState(loc.state);
      setSelectedDistrict(loc.district);
      setSelectedBlock(loc.block);
      setSelectedPanchayat(loc.panchayat);
      setDetectedLocationName(`${loc.panchayat}, ${loc.district} (${loc.state})`);
    } else {
      alert('Could not access real GPS location. Please ensure location access is enabled in your browser.');
    }
  };

  // Downscaling comparison state
  const [downscaleMode, setDownscaleMode] = useState<'traditional' | 'mausamsetu'>('mausamsetu');

  // ROI Calculator state
  const [farmAcres, setFarmAcres] = useState<number>(10);
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');

  // Audio Player State
  const [audioLanguage, setAudioLanguage] = useState<'hi' | 'en' | 'mr'>('hi');
  const [isPlaying, setIsPlaying] = useState(false);

  // Testimonial Carousel Index State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Crop multiplier mapping for ROI calculator
  const cropMultipliers: Record<string, { savingsPerAcre: number; riskReduction: number }> = {
    Wheat: { savingsPerAcre: 3400, riskReduction: 88 },
    Rice: { savingsPerAcre: 4800, riskReduction: 92 },
    Soybean: { savingsPerAcre: 2900, riskReduction: 82 },
    Cotton: { savingsPerAcre: 5200, riskReduction: 90 },
    Tomato: { savingsPerAcre: 7100, riskReduction: 95 },
  };

  const currentMultiplier = cropMultipliers[selectedCrop] || cropMultipliers['Wheat'];
  const totalSavings = farmAcres * currentMultiplier.savingsPerAcre;

  // 7-Day Live Weather Preview Data
  const forecastDays = [
    { day: 'Today', date: 'Sep 27', tempMax: 29, tempMin: 21, rain: 78, condition: 'Moderate Rain 🌧️', wind: '14 km/h' },
    { day: 'Sun', date: 'Sep 28', tempMax: 31, tempMin: 22, rain: 85, condition: 'Heavy Thunderstorm 🌩️', wind: '18 km/h' },
    { day: 'Mon', date: 'Sep 29', tempMax: 30, tempMin: 20, rain: 40, condition: 'Light Drizzle 🌦️', wind: '10 km/h' },
    { day: 'Tue', date: 'Sep 30', tempMax: 32, tempMin: 22, rain: 15, condition: 'Partly Cloudy ⛅', wind: '12 km/h' },
    { day: 'Wed', date: 'Oct 01', tempMax: 33, tempMin: 23, rain: 10, condition: 'Sunny & Clear ☀️', wind: '8 km/h' },
    { day: 'Thu', date: 'Oct 02', tempMax: 32, tempMin: 21, rain: 5, condition: 'Clear Sky 🌤️', wind: '9 km/h' },
    { day: 'Fri', date: 'Oct 03', tempMax: 31, tempMin: 20, rain: 20, condition: 'Scattered Clouds 🌥️', wind: '11 km/h' },
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: 'Ramesh Patel',
      location: 'Pipla Khurd, Ujjain (M.P.)',
      crop: 'Wheat & Soybean (14 Acres)',
      quote: 'Mausam Setu alerted me 12 hours before heavy rain during wheat flowering. I held my irrigation and saved ₹48,000 in fuel and fertilizer wash-off!',
      yieldGain: '+24% Yield',
      avatarBg: 'bg-emerald-600',
    },
    {
      name: 'Sunita Deshmukh',
      location: 'Nashik District (Maharashtra)',
      crop: 'Tomato & Grapes (8 Acres)',
      quote: 'The spray window advisory warned us about high humidity aphids risk. We sprayed exactly in the 4-hour dry window before rain hit.',
      yieldGain: '3 Sprays Saved',
      avatarBg: 'bg-blue-600',
    },
    {
      name: 'Harpreet Singh',
      location: 'Ludhiana (Punjab)',
      crop: 'Paddy Rice (22 Acres)',
      quote: 'The 100-meter micro-zone downscaling showed rain in our block while the main district weather app showed clear sky. 100% accurate prediction.',
      yieldGain: '₹95,000 Saved',
      avatarBg: 'bg-indigo-600',
    },
  ];

  const audioContent = {
    hi: 'नमस्कार किसान भाइयों! मौसम सेतु बुलेटिन: उज्जैन पिपला खुर्द में अगले 24 घंटों में 78% बारिश का अनुमान है। गेहूं की फसल में सिंचाई रोकें।',
    en: 'Greetings Farmers! Mausam Setu Bulletin: 78% rain expected in Pipla Khurd within 24h. Hold irrigation for wheat crops.',
    mr: 'नमस्कार शेतकरी बंधूंनो! हवामान सेतू बुलेटिन: पुढील २४ तासांत ७८% पावसाची शक्यता. गव्हाच्या पिकाला पाणी देणे पुढे ढकला.',
  };

  const faqs = [
    {
      q: 'How does Mausam Setu downscale 12km IMD grid forecasts to a 100m farm level?',
      a: 'Mausam Setu fuses regional IMD GFS weather models with high-resolution topographic elevation data (SRTM), satellite vegetation density (MODIS/NDVI), and real-time Automatic Weather Station (AWS) telemetry using physics-informed neural downscaling.',
    },
    {
      q: 'Can farmers receive advisories via SMS or WhatsApp without active internet?',
      a: 'Yes! Mausam Setu generates localized SMS alerts in 12 regional Indian languages (Hindi, Marathi, Punjabi, Gujarati, etc.) for extreme weather events, spray warnings, and irrigation holds.',
    },
    {
      q: 'How does the "What-If" simulator assist in farming decisions?',
      a: 'The simulator models future scenarios (e.g., "If I apply pesticide today vs waiting 48 hours") using rain probability, temperature, and wind threshold matrices to give explicit "Advisable" or "Not Advisable" recommendations with quantitative confidence scores.',
    },
    {
      q: 'Is Mausam Setu free for individual farmers and FPOs?',
      a: 'Yes, basic Panchayat micro-zone weather forecasts, advisory risk matrix cards, and SMS alerts are completely free under Digital India agricultural initiatives.',
    },
  ];

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/map?panchayat=${encodeURIComponent(selectedPanchayat)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* HERO SECTION WITH VIBRANT SKY CLOUDS BACKGROUND */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-slate-950 text-white min-h-[95vh] flex flex-col justify-between pb-12 sm:pb-16">
        {/* Background Atmosphere Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none animate-moving-clouds"
          style={{ backgroundImage: `url('/sky_clouds_hero.jpg')` }}
        />

        {/* Ambient Animated Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Top Header Navbar */}
        <header className="relative z-20 max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto w-full px-4 sm:px-6 2xl:px-12 py-4 sm:py-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img src="/logo.png" alt="Mausam Setu Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg sm:text-xl 2xl:text-3xl font-black tracking-tight text-white">Mausam Setu</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 2xl:gap-12 text-xs 2xl:text-base font-bold uppercase tracking-wider text-white/90">
            <Link href="/" className="hover:text-[#ccff00] transition-colors">Home</Link>
            <Link href="#forecast-preview" className="hover:text-[#ccff00] transition-colors">7-Day Forecast</Link>
            <Link href="#engine" className="hover:text-[#ccff00] transition-colors">AI Downscaling</Link>
            <Link href="#audio-bulletin" className="hover:text-[#ccff00] transition-colors">Audio Advisory</Link>
            <Link href="#testimonials" className="hover:text-[#ccff00] transition-colors">Stories</Link>
          </nav>

          {/* CTA Header Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-4 sm:px-5 2xl:px-8 py-2 sm:py-2.5 2xl:py-4 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 text-[11px] sm:text-xs 2xl:text-base font-black uppercase tracking-wider shadow-lg shadow-lime-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
            >
              Get Started ↗
            </Link>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-5xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 2xl:px-12 pt-4 sm:pt-6 pb-8 sm:pb-10 text-center space-y-4 sm:space-y-6 2xl:space-y-10 my-auto">
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 2xl:px-6 py-1.5 2xl:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs 2xl:text-base font-bold text-[#ccff00] shadow-md animate-slideup max-w-full truncate">
            <span className="truncate">✨ Micro-Zone Weather Downscaling Engine</span>
            <span className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-[#ccff00] animate-ping flex-shrink-0" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl 2xl:text-8xl 3xl:text-[100px] font-black tracking-tight leading-[1.1] sm:leading-[1.08] drop-shadow-md animate-slideup">
            Hyperlocal Weather Intelligence for <br className="hidden sm:inline" />
            <span className="text-[#ccff00] underline decoration-blue-400 decoration-wavy underline-offset-4 sm:underline-offset-8">
              Smarter Indian Agriculture
            </span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg 2xl:text-2xl 3xl:text-3xl text-blue-50/90 max-w-xl sm:max-w-2xl 2xl:max-w-4xl mx-auto leading-relaxed font-medium animate-slideup-delayed">
            Designed to help Indian farmers make smarter irrigation, spraying, and harvest decisions with 100m micro-zone weather intelligence.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 2xl:gap-6 pt-1 animate-slideup-delayed w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 2xl:px-10 py-3 sm:py-3.5 2xl:py-5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs 2xl:text-lg font-black uppercase tracking-wider border border-white/20 backdrop-blur-md transition-all shadow-md text-center"
            >
              View Demo
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-7 2xl:px-11 py-3 sm:py-3.5 2xl:py-5 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 text-xs 2xl:text-lg font-black uppercase tracking-wider shadow-xl shadow-lime-500/20 flex items-center justify-center gap-2.5 transition-all"
            >
              <span>Get Started</span>
              <span className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-8 2xl:h-8 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] sm:text-xs 2xl:text-sm">
                ↗
              </span>
            </Link>
          </div>

          {/* FEATURE 1: STATE / DISTRICT MICRO-ZONE HERO SEARCH BAR & GPS DETECTOR */}
          <div className="pt-2 sm:pt-4 max-w-3xl 2xl:max-w-5xl mx-auto animate-slideup-slow w-full space-y-3">
            {/* Real GPS Location Detector Button */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm border border-white/40 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isDetecting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Detecting GPS Location...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">📍</span>
                    <span>Detect My Real Location</span>
                    <span className="bg-[#ccff00] text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Live GPS</span>
                  </>
                )}
              </button>

              {detectedLocationName && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-xs font-bold backdrop-blur-md animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real Location: {detectedLocationName}</span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleHeroSearchSubmit}
              className="bg-white/95 backdrop-blur-xl p-2.5 sm:p-3 2xl:p-5 rounded-2xl sm:rounded-3xl 2xl:rounded-[36px] shadow-2xl border border-white/40 grid grid-cols-1 sm:grid-cols-4 gap-2 text-slate-900"
            >
              <div className="text-left px-3 py-1.5 2xl:px-5 2xl:py-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                <label className="text-[10px] 2xl:text-xs font-extrabold uppercase text-slate-400 tracking-wider">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-transparent font-bold text-xs 2xl:text-base outline-none cursor-pointer text-slate-900"
                >
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div className="text-left px-3 py-1.5 2xl:px-5 2xl:py-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                <label className="text-[10px] 2xl:text-xs font-extrabold uppercase text-slate-400 tracking-wider">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-transparent font-bold text-xs 2xl:text-base outline-none cursor-pointer text-slate-900"
                >
                  <option value="Ujjain">Ujjain</option>
                  <option value="Indore">Indore</option>
                  <option value="Dewas">Dewas</option>
                  <option value="Ratlam">Ratlam</option>
                </select>
              </div>

              <div className="text-left px-3 py-1.5 2xl:px-5 2xl:py-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                <label className="text-[10px] 2xl:text-xs font-extrabold uppercase text-slate-400 tracking-wider">Panchayat</label>
                <select
                  value={selectedPanchayat}
                  onChange={(e) => setSelectedPanchayat(e.target.value)}
                  className="w-full bg-transparent font-bold text-xs 2xl:text-base outline-none cursor-pointer text-slate-900"
                >
                  <option value="Pipla Khurd">Pipla Khurd</option>
                  <option value="Bichrod">Bichrod</option>
                  <option value="Dhatrawada">Dhatrawada</option>
                  <option value="Runija">Runija</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 2xl:py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs 2xl:text-base uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Check Farm Weather</span>
                <span>🔍</span>
              </button>
            </form>
          </div>

          {/* MAUSAM SETU APP DASHBOARD PREVIEW MOCKUP */}
          <div className="pt-6 sm:pt-8 max-w-5xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto w-full">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl 2xl:rounded-[40px] border border-white/20 shadow-2xl overflow-hidden text-left animate-slideup-slow group">
              {/* Window Title Bar */}
              <div className="bg-slate-950 px-3 sm:px-4 2xl:px-8 py-2.5 sm:py-3 2xl:py-5 border-b border-slate-800 flex items-center justify-between text-xs 2xl:text-base text-slate-400">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 2xl:w-4 2xl:h-4 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 2xl:w-4 2xl:h-4 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 2xl:w-4 2xl:h-4 rounded-full bg-emerald-500/80" />
                </div>

                <div className="bg-slate-900 px-3 sm:px-4 py-1 rounded-full border border-slate-800 text-[10px] sm:text-[11px] 2xl:text-sm font-mono text-slate-300 flex items-center gap-1.5 sm:gap-2 max-w-[200px] sm:max-w-md 2xl:max-w-xl w-full justify-center">
                  <span className="text-emerald-400 text-xs 2xl:text-base">🔒</span>
                  <span className="truncate">mausamsetu.gov.in/dashboard</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] 2xl:text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 sm:px-2.5 2xl:px-4 py-0.5 sm:py-1 2xl:py-2 rounded-full border border-emerald-800/40">
                  <span className="w-1.5 h-1.5 2xl:w-2.5 2xl:h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="hidden sm:inline">AWS Live Telemetry</span>
                  <span className="sm:hidden">Telemetry</span>
                </div>
              </div>

              {/* Dashboard Content Mockup */}
              <div className="p-3.5 sm:p-7 2xl:p-12 space-y-4 sm:space-y-6 2xl:space-y-10 text-slate-900 bg-slate-900">
                {/* Dashboard Top Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-slate-950 p-3.5 sm:p-4 2xl:p-8 rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-slate-800 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-16 2xl:h-16 rounded-xl 2xl:rounded-2xl bg-blue-600 text-white font-black text-base sm:text-lg 2xl:text-3xl flex items-center justify-center flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-sm sm:text-base 2xl:text-2xl">Pipla Khurd Panchayat</h3>
                        <span className="bg-blue-500/20 text-blue-400 text-[9px] sm:text-[10px] 2xl:text-xs font-extrabold px-2 py-0.5 rounded-full border border-blue-500/30">
                          Ujjain
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs 2xl:text-lg text-slate-400 font-semibold mt-0.5">
                        Crop: <span className="text-emerald-400 font-bold">Wheat</span> • 14 Ha
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-4 2xl:px-8 py-2 2xl:py-4 rounded-xl 2xl:rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 text-xs 2xl:text-base font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-lime-500/20"
                  >
                    <span>Launch Live App</span>
                    <span>↗</span>
                  </Link>
                </div>

                {/* 4 Stat Widgets Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 2xl:gap-6">
                  <div className="bg-slate-950/90 p-3 sm:p-4 2xl:p-6 rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-slate-800 space-y-0.5">
                    <div className="text-[9px] sm:text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-slate-400">Temperature</div>
                    <div className="text-lg sm:text-2xl 2xl:text-4xl font-black text-white">29.4 °C</div>
                    <div className="text-[9px] sm:text-[10px] 2xl:text-sm text-sky-400 font-bold">Humidity 82%</div>
                  </div>

                  <div className="bg-slate-950/90 p-3 sm:p-4 2xl:p-6 rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-slate-800 space-y-0.5">
                    <div className="text-[9px] sm:text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-slate-400">Rainfall Prob</div>
                    <div className="text-lg sm:text-2xl 2xl:text-4xl font-black text-blue-400">78% (22mm)</div>
                    <div className="text-[9px] sm:text-[10px] 2xl:text-sm text-amber-400 font-bold">Rain in 6h</div>
                  </div>

                  <div className="bg-amber-950/40 p-3 sm:p-4 2xl:p-6 rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-amber-800/60 space-y-0.5">
                    <div className="text-[9px] sm:text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-amber-400">Advisory Action</div>
                    <div className="text-xs sm:text-sm 2xl:text-xl font-black text-amber-200">HOLD IRRIGATION</div>
                    <div className="text-[9px] sm:text-[10px] 2xl:text-sm text-amber-300 font-bold">Prevent Damage</div>
                  </div>

                  <div className="bg-slate-950/90 p-3 sm:p-4 2xl:p-6 rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-slate-800 space-y-0.5">
                    <div className="text-[9px] sm:text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-slate-400">Confidence</div>
                    <div className="text-lg sm:text-2xl 2xl:text-4xl font-black text-emerald-400">88%</div>
                    <div className="text-[9px] sm:text-[10px] 2xl:text-sm text-emerald-300 font-bold">100m Model</div>
                  </div>
                </div>

                {/* Dashboard Split View: Map + Risk Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 2xl:gap-8">
                  {/* Left: Map Preview Box */}
                  <div className="md:col-span-7 bg-slate-950 rounded-xl sm:rounded-2xl 2xl:rounded-3xl p-3.5 sm:p-4 2xl:p-6 border border-slate-800 space-y-2 sm:space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs 2xl:text-base font-bold text-slate-300">
                      <span>🗺️ Micro-Zone GIS Overlay</span>
                      <span className="text-[#ccff00] text-[9px] sm:text-[10px] 2xl:text-xs">Esri Satellite</span>
                    </div>

                    <div className="h-36 sm:h-44 2xl:h-64 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 rounded-xl 2xl:rounded-2xl border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex justify-between items-center text-[9px] sm:text-[10px] 2xl:text-sm font-bold text-slate-400">
                        <span className="bg-blue-900/60 px-2 py-0.5 rounded text-blue-300">AWS #8891 Active</span>
                        <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">Zone A: 24.2 mm</span>
                      </div>

                      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                      <div className="relative z-10 flex items-center justify-between text-[11px] sm:text-xs 2xl:text-base font-bold text-white pt-6">
                        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] sm:text-[11px] 2xl:text-sm">
                          🛰️ INSAT-3DR Radar Stream
                        </div>
                        <span className="text-[#ccff00] font-black">Live Heatmap</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Calculated Risk Badges */}
                  <div className="md:col-span-5 bg-slate-950 rounded-xl sm:rounded-2xl 2xl:rounded-3xl p-3.5 sm:p-4 2xl:p-6 border border-slate-800 space-y-2.5 sm:space-y-3">
                    <div className="text-xs 2xl:text-base font-bold text-slate-300">⚡ Calculated Risk Vectors</div>

                    <div className="space-y-2">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] sm:text-xs 2xl:text-sm font-bold">
                        <span className="text-slate-300">🌾 Yellow Rust Risk</span>
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] 2xl:text-xs border border-amber-500/30">
                          Moderate (28%)
                        </span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] sm:text-xs 2xl:text-sm font-bold">
                        <span className="text-slate-300">🐛 Aphids Infestation</span>
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] 2xl:text-xs border border-emerald-500/30">
                          Low (12%)
                        </span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] sm:text-xs 2xl:text-sm font-bold">
                        <span className="text-slate-300">🧪 Spray Window Status</span>
                        <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] 2xl:text-xs border border-red-500/30">
                          Closed (Rain Imminent)
                        </span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] sm:text-xs 2xl:text-sm font-bold">
                        <span className="text-slate-300">☀️ Heat Stress Level</span>
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] 2xl:text-xs border border-emerald-500/30">
                          Normal (&lt; 34°C)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-badge below dashboard frame */}
            <div className="pt-3 text-[11px] sm:text-xs 2xl:text-base font-semibold text-blue-100 flex items-center justify-center gap-1.5 sm:gap-2 text-center">
              <span>⚡ High-Impact Live Dashboard • Panchayat Precision Weather</span>
              <span className="text-amber-300">✦ ✦ ✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS ANIMATED MARQUEE LOGOS STRIP */}
      <section className="bg-white py-4 sm:py-6 2xl:py-10 border-b border-slate-200/80 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap items-center gap-10 sm:gap-16 2xl:gap-24 text-[11px] sm:text-xs 2xl:text-base font-extrabold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg 2xl:text-2xl">📡</span>
            <span>IMD WEATHER TELEMETRY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg 2xl:text-2xl">🌾</span>
            <span>ICAR AGRICULTURAL RESEARCH</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg 2xl:text-2xl">🛰️</span>
            <span>INSAT-3DR SATELLITE RADAR</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg 2xl:text-2xl">🇮🇳</span>
            <span>DIGITAL INDIA AGRI STACK</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg 2xl:text-2xl">🌱</span>
            <span>KRISHI VIGYAN KENDRA (KVK)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg 2xl:text-2xl">⚡</span>
            <span>AWS TELEMETRY SENSORS</span>
          </div>
        </div>
      </section>

      {/* FEATURE 2: INTERACTIVE 7-DAY LIVE WEATHER PREVIEW WIDGET */}
      <section id="forecast-preview" className="py-12 sm:py-16 2xl:py-24 px-4 sm:px-6 2xl:px-12 max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto space-y-6 sm:space-y-8 2xl:space-y-12">
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
            <div>
              <div className="text-[11px] sm:text-xs 2xl:text-base font-black uppercase tracking-widest text-blue-600">
                • LIVE MICRO-ZONE TELEMETRY
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl 2xl:text-6xl font-black text-slate-900 mt-1">
                7-Day Weather Forecast: {selectedPanchayat}
              </h2>
            </div>
            <Link
              href="/map"
              className="px-3.5 sm:px-4 py-2 2xl:px-6 2xl:py-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs 2xl:text-base transition-all flex items-center gap-1.5"
            >
              <span>View Satellite Map</span>
              <span>→</span>
            </Link>
          </div>
        </ScrollReveal>

        {/* 7-Day Forecast Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 2xl:gap-6">
          {forecastDays.map((item, idx) => (
            <ScrollReveal key={idx} delayMs={idx * 60} direction="up">
              <div
                className={`p-3 sm:p-4 2xl:p-6 rounded-xl sm:rounded-2xl 2xl:rounded-3xl border transition-all text-center space-y-1.5 sm:space-y-2 2xl:space-y-4 ${
                  idx === 0
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30 scale-[1.02] sm:scale-105'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="text-xs 2xl:text-base font-extrabold">{item.day}</div>
                <div className={`text-[10px] 2xl:text-sm font-bold ${idx === 0 ? 'text-blue-100' : 'text-slate-400'}`}>
                  {item.date}
                </div>

                <div className="text-xl sm:text-2xl 2xl:text-4xl my-1">{item.condition.split(' ')[2] || '🌦️'}</div>

                <div className="text-sm sm:text-base 2xl:text-2xl font-black">
                  {item.tempMax}° / <span className={idx === 0 ? 'text-blue-200' : 'text-slate-400'}>{item.tempMin}°</span>
                </div>

                <div className={`text-[10px] sm:text-[11px] 2xl:text-sm font-bold px-2 py-0.5 rounded-full inline-block ${
                  item.rain > 50
                    ? idx === 0 ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                    : idx === 0 ? 'bg-white/10 text-blue-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  💧 {item.rain}%
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FEATURE 3: MULTILINGUAL AUDIO ADVISORY PLAYER DEMO */}
      <section id="audio-bulletin" className="py-12 sm:py-16 2xl:py-24 bg-slate-900 text-white px-4 sm:px-6 2xl:px-12">
        <ScrollReveal direction="up">
          <div className="max-w-5xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto bg-slate-800/90 rounded-2xl sm:rounded-[32px] 2xl:rounded-[40px] p-5 sm:p-8 2xl:p-14 border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2.5 sm:space-y-3 2xl:space-y-5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 2xl:px-5 2xl:py-2 rounded-full bg-[#ccff00]/10 text-[#ccff00] text-[11px] sm:text-xs 2xl:text-base font-black uppercase tracking-wider">
                🔊 Voice Advisory Bulletin
              </div>
              <h3 className="text-xl sm:text-3xl 2xl:text-5xl font-black">
                Listen to Today's Weather Report
              </h3>
              <p className="text-xs 2xl:text-xl text-slate-400 font-semibold max-w-md 2xl:max-w-xl">
                Generates instant spoken alerts for farmers without requiring smartphone literacy.
              </p>

              {/* Language Selector */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAudioLanguage('hi')}
                  className={`px-3.5 sm:px-4 2xl:px-6 py-1.5 2xl:py-3 rounded-xl text-xs 2xl:text-base font-black transition-all ${
                    audioLanguage === 'hi' ? 'bg-[#ccff00] text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  🇮🇳 Hindi (हिंदी)
                </button>
                <button
                  type="button"
                  onClick={() => setAudioLanguage('mr')}
                  className={`px-3.5 sm:px-4 2xl:px-6 py-1.5 2xl:py-3 rounded-xl text-xs 2xl:text-base font-black transition-all ${
                    audioLanguage === 'mr' ? 'bg-[#ccff00] text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  🌾 Marathi (मराठी)
                </button>
                <button
                  type="button"
                  onClick={() => setAudioLanguage('en')}
                  className={`px-3.5 sm:px-4 2xl:px-6 py-1.5 2xl:py-3 rounded-xl text-xs 2xl:text-base font-black transition-all ${
                    audioLanguage === 'en' ? 'bg-[#ccff00] text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Audio Player Controls Box */}
            <div className="w-full md:w-auto bg-slate-950 p-4 sm:p-6 2xl:p-10 rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-slate-800 space-y-3.5 sm:space-y-4 2xl:space-y-6 text-center">
              <div className="text-xs 2xl:text-lg font-bold text-slate-400 italic max-w-xs 2xl:max-w-md mx-auto">
                "{audioContent[audioLanguage]}"
              </div>

              {/* Equalizer Bars Simulation */}
              <div className="flex items-center justify-center gap-1.5 2xl:gap-2 h-7 sm:h-8 2xl:h-12">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 2xl:w-2 bg-[#ccff00] rounded-full transition-all duration-300 ${
                      isPlaying ? 'animate-bounce' : 'h-2 opacity-40'
                    }`}
                    style={{ animationDelay: `${i * 100}ms`, height: isPlaying ? `${Math.random() * 24 + 8}px` : '8px' }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full py-3 2xl:py-5 px-6 2xl:px-10 rounded-xl 2xl:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs 2xl:text-lg uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>{isPlaying ? '⏸ Pause Bulletin' : '▶ Play Audio Advisory'}</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FEATURE 4: FARMER TESTIMONIALS & CASE STUDIES CAROUSEL */}
      <section id="testimonials" className="py-16 sm:py-20 2xl:py-28 px-4 sm:px-6 2xl:px-12 max-w-5xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto space-y-8 sm:space-y-12">
        <ScrollReveal direction="up">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="text-[11px] sm:text-xs 2xl:text-base font-black uppercase tracking-widest text-slate-400">
              • REAL FARMER FIELD USE CASES
            </div>
            <h2 className="text-2xl sm:text-4xl 2xl:text-6xl font-black tracking-tight text-slate-900">
              Designed for Real Agricultural Impact
            </h2>
          </div>
        </ScrollReveal>

        {/* Carousel Container */}
        <ScrollReveal direction="up" delayMs={150}>
          <div className="bg-white rounded-2xl sm:rounded-[32px] 2xl:rounded-[40px] p-5 sm:p-12 2xl:p-16 border border-slate-200/90 shadow-xl relative overflow-hidden space-y-4 sm:space-y-6 2xl:space-y-10">
            <div className="flex items-center justify-between text-[11px] sm:text-xs 2xl:text-lg font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Case Study #{testimonialIndex + 1}</span>
              <span className="text-emerald-600 font-black">{testimonials[testimonialIndex].yieldGain}</span>
            </div>

            <blockquote className="text-base sm:text-2xl 2xl:text-4xl font-black text-slate-900 leading-relaxed italic">
              "{testimonials[testimonialIndex].quote}"
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6 2xl:pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 2xl:w-16 2xl:h-16 rounded-full ${testimonials[testimonialIndex].avatarBg} text-white font-black text-sm sm:text-base 2xl:text-2xl flex items-center justify-center shadow-md flex-shrink-0`}>
                  {testimonials[testimonialIndex].name[0]}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base 2xl:text-2xl">
                    {testimonials[testimonialIndex].name}
                  </div>
                  <div className="text-[11px] sm:text-xs 2xl:text-lg text-slate-500 font-semibold">
                    {testimonials[testimonialIndex].location} • {testimonials[testimonialIndex].crop}
                  </div>
                </div>
              </div>

              {/* Carousel Navigation Buttons */}
              <div className="flex gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length)}
                  className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base 2xl:text-xl flex items-center justify-center transition-colors"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)}
                  className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-14 2xl:h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base 2xl:text-xl flex items-center justify-center transition-colors shadow-md"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ABOUT / BENTO GRID FEATURE SECTION */}
      <section className="py-16 sm:py-20 2xl:py-28 px-4 sm:px-6 2xl:px-12 max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto space-y-12 sm:space-y-16">
        <ScrollReveal direction="up">
          <div className="text-center space-y-3 sm:space-y-4 max-w-4xl 2xl:max-w-6xl mx-auto">
            <div className="text-[11px] sm:text-xs 2xl:text-base font-black uppercase tracking-widest text-slate-400">
              • ABOUT US
            </div>
            <h2 className="text-2xl sm:text-5xl lg:text-6xl 2xl:text-7xl 3xl:text-8xl font-black tracking-tight leading-[1.15] text-slate-900">
              A dedicated agricultural intelligence portal building{' '}
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 2xl:w-14 2xl:h-14 rounded-full bg-blue-600 text-white text-xs sm:text-base 2xl:text-2xl align-middle mx-1 shadow-md">
                🌐
              </span>{' '}
              smarter and{' '}
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 2xl:w-14 2xl:h-14 rounded-full bg-[#ccff00] text-slate-900 text-xs sm:text-base 2xl:text-2xl align-middle mx-1 shadow-md">
                🟢
              </span>{' '}
              more adaptive farming
            </h2>
          </div>
        </ScrollReveal>

        {/* 4 Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 2xl:gap-10 items-stretch">
          {/* Card 1: Left Blue Photo Card (5 cols) */}
          <div className="md:col-span-4">
            <ScrollReveal direction="left" delayMs={100} className="h-full">
              <div className="bg-[#0284c7] rounded-2xl sm:rounded-[32px] 2xl:rounded-[40px] p-5 sm:p-6 2xl:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[420px] 2xl:min-h-[550px] h-full group">
                {/* Background Farmer Photo */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url('/farmer_avatar.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-base sm:text-lg 2xl:text-2xl font-black tracking-wider text-[#ccff00]">MAUSAM SETU</span>
                  <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-xl 2xl:rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-sm sm:text-base 2xl:text-xl">
                    📊
                  </div>
                </div>

                {/* Bottom White Overlay Card */}
                <div className="relative z-10 bg-white text-slate-900 rounded-xl sm:rounded-2xl 2xl:rounded-3xl p-4 sm:p-5 2xl:p-8 shadow-2xl space-y-1">
                  <div className="text-3xl sm:text-4xl 2xl:text-6xl font-black tracking-tight text-slate-900">120+</div>
                  <p className="text-xs 2xl:text-base text-slate-500 font-semibold leading-relaxed">
                    Automatic Weather Stations & Krishi Vigyan Kendras synced.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 3 Cards (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 2xl:gap-10">
            {/* Card 2: Middle White Testimonial Card (7 cols) */}
            <div className="md:col-span-7">
              <ScrollReveal direction="up" delayMs={200} className="h-full">
                <div className="bg-slate-100/90 rounded-2xl sm:rounded-[32px] 2xl:rounded-[40px] p-5 sm:p-7 2xl:p-10 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 sm:space-y-6 h-full">
                  <div>
                    <div className="text-[11px] sm:text-xs 2xl:text-base font-bold text-slate-400 uppercase tracking-wider">
                      Commitment to measurable
                    </div>
                    <div className="text-4xl sm:text-5xl 2xl:text-7xl font-black text-slate-900 mt-1 sm:mt-2">100%</div>
                  </div>

                  <div className="space-y-3 pt-3 sm:pt-4 border-t border-slate-200">
                    <div className="flex items-center -space-x-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-12 2xl:h-12 rounded-full bg-blue-600 text-white font-bold text-[10px] sm:text-xs 2xl:text-base flex items-center justify-center ring-2 ring-white">
                        RP
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-12 2xl:h-12 rounded-full bg-emerald-600 text-white font-bold text-[10px] sm:text-xs 2xl:text-base flex items-center justify-center ring-2 ring-white">
                        SK
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-12 2xl:h-12 rounded-full bg-amber-600 text-white font-bold text-[10px] sm:text-xs 2xl:text-base flex items-center justify-center ring-2 ring-white">
                        MK
                      </div>
                    </div>

                    <p className="text-xs 2xl:text-lg text-slate-600 font-semibold leading-relaxed italic">
                      "Their downscaling automation strategy completely reshaped how we irrigate. It's efficient, intelligent, and seamless."
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Card 3: Top Right Lime Green Card (5 cols) */}
            <div className="md:col-span-5">
              <ScrollReveal direction="right" delayMs={300} className="h-full">
                <div className="bg-[#ccff00] text-slate-950 rounded-2xl sm:rounded-[32px] 2xl:rounded-[40px] p-5 sm:p-7 2xl:p-10 shadow-sm flex flex-col justify-between space-y-3 sm:space-y-4 h-full">
                  <div>
                    <div className="text-[11px] sm:text-xs 2xl:text-base font-bold uppercase tracking-wider text-slate-800">
                      Data Points
                    </div>
                    <div className="text-3xl sm:text-5xl 2xl:text-7xl font-black tracking-tight mt-1 sm:mt-2">520k+</div>
                  </div>

                  <p className="text-xs 2xl:text-lg font-bold leading-relaxed text-slate-900">
                    Analyzed monthly to power smarter business and farming strategies.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Card 4: Bottom Right Dark Card (12 cols) */}
            <div className="md:col-span-12">
              <ScrollReveal direction="up" delayMs={400}>
                <div className="bg-[#18181b] text-white rounded-2xl sm:rounded-[28px] 2xl:rounded-[36px] p-5 sm:p-6 2xl:p-10 shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] sm:text-xs 2xl:text-base font-bold uppercase tracking-wider text-slate-400">
                      Districts Covered
                    </div>
                    <div className="text-xs sm:text-sm 2xl:text-xl font-semibold text-slate-300 mt-0.5">
                      Active across 28+ states and UTs in India
                    </div>
                  </div>

                  <div className="text-2xl sm:text-4xl 2xl:text-6xl font-black text-[#ccff00]">20+</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNSCALING COMPARISON ENGINE */}
      <section id="engine" className="py-16 sm:py-20 2xl:py-28 bg-slate-900 text-white px-4 sm:px-6 2xl:px-12 relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto space-y-8 sm:space-y-12 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center space-y-3 sm:space-y-4 max-w-3xl 2xl:max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 2xl:px-6 2xl:py-2 rounded-full bg-blue-500/10 text-blue-400 text-[11px] sm:text-xs 2xl:text-base font-extrabold uppercase tracking-wider border border-blue-500/20">
                ⚡ Downscaling Technology
              </div>
              <h2 className="text-2xl sm:text-5xl 2xl:text-7xl font-black tracking-tight leading-tight">
                Why Standard 12km Grids Fail Farmers
              </h2>
              <p className="text-xs sm:text-sm 2xl:text-xl text-slate-400 font-medium">
                Toggle below to compare standard regional weather models with Mausam Setu's 100m micro-zone physics downscaling.
              </p>

              {/* Toggle Switch */}
              <div className="inline-flex p-1 bg-slate-800 rounded-full border border-slate-700 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setDownscaleMode('traditional')}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 2xl:px-10 py-2 sm:py-2.5 2xl:py-4 rounded-full text-[11px] sm:text-xs 2xl:text-lg font-black transition-all ${
                    downscaleMode === 'traditional'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Traditional 12km Grid
                </button>
                <button
                  type="button"
                  onClick={() => setDownscaleMode('mausamsetu')}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 2xl:px-10 py-2 sm:py-2.5 2xl:py-4 rounded-full text-[11px] sm:text-xs 2xl:text-lg font-black transition-all ${
                    downscaleMode === 'mausamsetu'
                      ? 'bg-[#ccff00] text-slate-950 shadow-md shadow-lime-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  100m Micro-Zone
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Dynamic Comparison Card */}
          <ScrollReveal direction="up" delayMs={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 2xl:gap-14 items-center bg-slate-800/80 rounded-2xl sm:rounded-[32px] 2xl:rounded-[40px] p-5 sm:p-8 2xl:p-14 border border-slate-700 backdrop-blur-md">
              {/* Visual Radar Box */}
              <div className="bg-slate-950 rounded-xl sm:rounded-2xl 2xl:rounded-3xl p-4 sm:p-6 2xl:p-10 min-h-[260px] sm:min-h-[300px] 2xl:min-h-[420px] flex flex-col justify-between relative overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between text-[11px] sm:text-xs 2xl:text-base font-bold text-slate-400">
                  <span>{downscaleMode === 'traditional' ? 'IMD Standard GFS Grid' : 'Mausam Setu Micro-Zone Radar'}</span>
                  <span className={downscaleMode === 'traditional' ? 'text-amber-400' : 'text-[#ccff00]'}>
                    {downscaleMode === 'traditional' ? '12 km x 12 km' : '100 m x 100 m'}
                  </span>
                </div>

                {/* Grid representation */}
                <div className="my-4 sm:my-6 grid grid-cols-6 gap-1.5 sm:gap-2 2xl:gap-4 h-32 sm:h-40 2xl:h-60">
                  {Array.from({ length: 24 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-md sm:rounded-lg 2xl:rounded-xl transition-all duration-500 ${
                        downscaleMode === 'traditional'
                          ? 'bg-blue-600/30 border border-blue-500/20'
                          : idx === 10 || idx === 11 || idx === 16
                          ? 'bg-[#ccff00] animate-pulse shadow-lg shadow-lime-500/50'
                          : 'bg-blue-900/40 border border-blue-800/30'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-[11px] sm:text-xs 2xl:text-lg font-semibold text-slate-300 flex items-center justify-between">
                  <span className="truncate">{downscaleMode === 'traditional' ? '⚠️ District Average' : '✅ Field Accuracy'}</span>
                  <span className="font-extrabold text-white flex-shrink-0">
                    {downscaleMode === 'traditional' ? '54% Acc' : '88% Confidence'}
                  </span>
                </div>
              </div>

              {/* Explanation Column */}
              <div className="space-y-4 sm:space-y-6 2xl:space-y-10">
                <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black text-white">
                  {downscaleMode === 'traditional'
                    ? 'Coarse Average Grid Misses Micro-zone Rain'
                    : 'Physics-Informed Downscaling for Individual Farms'}
                </h3>
                <p className="text-xs sm:text-sm 2xl:text-xl text-slate-300 leading-relaxed font-medium">
                  {downscaleMode === 'traditional'
                    ? 'Standard weather forecasts average atmospheric pressure and cloud cover over 144 square kilometers. A farmer 5 km away might face heavy thunderstorm damage while the station reports clear sky.'
                    : 'Mausam Setu blends digital elevation models, canopy wetness sensors, and INSAT satellite cloud motion vectors to predict rain onset down to Panchayat micro-zones.'}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 2xl:gap-6 text-xs 2xl:text-base">
                  <div className="bg-slate-900 p-3.5 sm:p-4 2xl:p-6 rounded-xl 2xl:rounded-2xl border border-slate-700">
                    <div className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Decision Window</div>
                    <div className="text-base sm:text-lg 2xl:text-3xl font-black text-white mt-0.5">
                      {downscaleMode === 'traditional' ? '6-12 Hours' : '30-90 Mins'}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3.5 sm:p-4 2xl:p-6 rounded-xl 2xl:rounded-2xl border border-slate-700">
                    <div className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs">Pest Risk Warning</div>
                    <div className="text-base sm:text-lg 2xl:text-3xl font-black text-white mt-0.5">
                      {downscaleMode === 'traditional' ? 'Generic District' : 'Crop Stage Specific'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INTERACTIVE YIELD & SAVINGS CALCULATOR */}
      <section id="calculator" className="py-16 sm:py-20 2xl:py-28 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 text-white px-4 sm:px-6 2xl:px-12 relative overflow-hidden">
        <div className="max-w-5xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto space-y-8 sm:space-y-12 2xl:space-y-16 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center space-y-3 sm:space-y-4 max-w-3xl 2xl:max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 2xl:px-6 2xl:py-2 rounded-full bg-[#ccff00]/10 text-[#ccff00] text-[11px] sm:text-xs 2xl:text-base font-extrabold uppercase tracking-wider border border-[#ccff00]/20">
                💰 ROI & Cost Savings Calculator
              </div>
              <h2 className="text-2xl sm:text-5xl 2xl:text-7xl font-black tracking-tight leading-tight">
                Estimate Your Seasonal Input Savings
              </h2>
              <p className="text-xs sm:text-sm 2xl:text-xl text-blue-100/80 font-medium">
                See how avoiding wasted spray and timely irrigation holds saves money on your farm.
              </p>
            </div>
          </ScrollReveal>

          {/* Calculator Card */}
          <ScrollReveal direction="up" delayMs={200}>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-[32px] 2xl:rounded-[40px] p-5 sm:p-8 2xl:p-14 border border-white/20 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 2xl:gap-14 items-center">
              {/* Controls */}
              <div className="space-y-5 sm:space-y-6 2xl:space-y-10">
                {/* Farm Acres Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs 2xl:text-lg font-bold">
                    <label className="text-blue-100 uppercase tracking-wider">Farm Land Area</label>
                    <span className="text-base sm:text-lg 2xl:text-3xl font-black text-[#ccff00]">{farmAcres} Acres</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={farmAcres}
                    onChange={(e) => setFarmAcres(Number(e.target.value))}
                    className="w-full h-2 2xl:h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ccff00]"
                  />
                </div>

                {/* Crop Selector Buttons */}
                <div className="space-y-2">
                  <label className="text-xs 2xl:text-base font-bold text-blue-100 uppercase tracking-wider">Select Primary Crop</label>
                  <div className="flex flex-wrap gap-2">
                    {['Wheat', 'Rice', 'Soybean', 'Cotton', 'Tomato'].map((crop) => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => setSelectedCrop(crop)}
                        className={`px-3.5 sm:px-4 2xl:px-7 py-1.5 sm:py-2 2xl:py-3.5 rounded-xl 2xl:rounded-2xl text-xs 2xl:text-base font-black transition-all ${
                          selectedCrop === crop
                            ? 'bg-[#ccff00] text-slate-950 shadow-md scale-105'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Display Box */}
              <div className="bg-slate-950/80 rounded-xl sm:rounded-2xl 2xl:rounded-3xl p-4 sm:p-6 2xl:p-10 border border-white/10 space-y-4 sm:space-y-6 text-center md:text-left">
                <div>
                  <div className="text-[11px] sm:text-xs 2xl:text-base font-bold text-slate-400 uppercase tracking-wider">
                    Estimated Input Savings (Fertilizer + Fuel)
                  </div>
                  <div className="text-3xl sm:text-5xl 2xl:text-7xl font-black text-[#ccff00] mt-1 sm:mt-2">
                    ₹{totalSavings.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] sm:text-[11px] 2xl:text-base text-slate-400 mt-1 font-semibold">
                    Based on preventing 2 unnecessary spray applications and holding 1 flood irrigation.
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 sm:gap-4 text-xs 2xl:text-base">
                  <div>
                    <div className="text-slate-400 font-bold text-[10px] sm:text-xs">Crop Damage Avoided</div>
                    <div className="text-base sm:text-lg 2xl:text-3xl font-black text-emerald-400 mt-0.5">
                      {currentMultiplier.riskReduction}% Risk Cut
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-bold text-[10px] sm:text-xs">Advisory Accuracy</div>
                    <div className="text-base sm:text-lg 2xl:text-3xl font-black text-sky-400 mt-0.5">88% Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="py-16 sm:py-20 2xl:py-28 px-4 sm:px-6 2xl:px-12 max-w-4xl 2xl:max-w-[1400px] 3xl:max-w-[1800px] mx-auto space-y-8 sm:space-y-12">
        <ScrollReveal direction="up">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="text-[11px] sm:text-xs 2xl:text-base font-black uppercase tracking-widest text-slate-400">
              • FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-2xl sm:text-5xl 2xl:text-7xl font-black tracking-tight text-slate-900">
              Got Questions? We Have Answers.
            </h2>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4 2xl:space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <ScrollReveal key={index} direction="up" delayMs={index * 80}>
                <div className="bg-white rounded-xl sm:rounded-2xl 2xl:rounded-3xl border border-slate-200/90 overflow-hidden transition-all shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-6 2xl:p-9 text-left flex items-center justify-between gap-3 font-black text-slate-900 text-xs sm:text-base 2xl:text-2xl hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 2xl:w-12 2xl:h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs sm:text-sm 2xl:text-xl transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 bg-blue-600 text-white' : ''}`}>
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-6 2xl:px-9 pb-4 sm:pb-6 2xl:pb-9 text-xs sm:text-sm 2xl:text-xl text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3 sm:pt-4 2xl:pt-6 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* FINAL HIGH-IMPACT ANIMATED CTA BANNER */}
      <section className="py-12 sm:py-16 2xl:py-24 px-4 sm:px-6 2xl:px-12 max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto">
        <ScrollReveal direction="up">
          <div className="bg-gradient-to-r from-[#0284c7] via-blue-600 to-indigo-700 text-white rounded-2xl sm:rounded-[36px] 2xl:rounded-[48px] p-6 sm:p-14 2xl:p-20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-[#ccff00]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-3 sm:space-y-4 2xl:space-y-8 max-w-xl 2xl:max-w-3xl text-center md:text-left z-10">
              <span className="px-3 sm:px-3.5 2xl:px-6 py-1 2xl:py-2.5 rounded-full bg-white/20 text-[#ccff00] text-[10px] sm:text-xs 2xl:text-lg font-black uppercase tracking-wider backdrop-blur-md inline-block">
                🌱 Ready to optimize your harvest?
              </span>
              <h2 className="text-2xl sm:text-5xl 2xl:text-7xl font-black tracking-tight leading-tight">
                Start Receiving Advisories Today
              </h2>
              <p className="text-xs sm:text-sm 2xl:text-2xl text-blue-100 font-medium">
                Empower your farm with 100-meter micro-zone rainfall forecasts and crop-specific advisories.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 2xl:gap-6 z-10 w-full md:w-auto">
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 sm:px-8 2xl:px-12 py-3.5 sm:py-4 2xl:py-6 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-slate-950 font-black text-xs 2xl:text-xl uppercase tracking-wider text-center shadow-xl shadow-lime-500/20 transition-all hover:scale-105"
              >
                Log In to Portal ↗
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 sm:px-8 2xl:px-12 py-3.5 sm:py-4 2xl:py-6 rounded-full bg-white/15 hover:bg-white/25 text-white font-black text-xs 2xl:text-xl uppercase tracking-wider text-center border border-white/20 backdrop-blur-md transition-all hover:scale-105"
              >
                Open Live Dashboard
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-8 sm:py-12 2xl:py-16 px-4 sm:px-6 2xl:px-12 border-t border-slate-800">
        <div className="max-w-7xl 2xl:max-w-[1800px] 3xl:max-w-[2200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs 2xl:text-lg text-slate-400 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-white text-sm sm:text-base 2xl:text-2xl">Mausam Setu</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[11px] sm:text-xs">Hyperlocal Agricultural Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 2xl:gap-10 font-semibold text-[11px] sm:text-xs">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/map" className="hover:text-white transition-colors">
              Weather Map
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
