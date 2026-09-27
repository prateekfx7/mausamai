export interface MicroZone {
  id: string;
  name: string;
  nameHi: string;
  rainfallLevel: 'low' | 'moderate' | 'high';
  expectedRainfall: string;
  rainfallMm: number;
  confidence: number;
  elevation: string;
  soilType: string;
  soilMoisture: string;
  riskDescription: string;
  pathData: string; // SVG path
  centerCoord: { x: number; y: number };
  polygonCoords?: [number, number][]; // Real Leaflet LatLng coordinates
}

export interface DayForecast {
  day: string;
  dayShort: string;
  date: string;
  tempMax: number;
  tempMin: number;
  rainMm: number;
  rainProb: number;
  humidity: number;
  windKm: number;
  condition: string;
  blockRainMm: number; // Generic block level prediction before downscaling
  actualObservedMm?: number; // For verification
}

export interface WeatherData {
  temperatureCurrent: number;
  tempRange: string;
  rainfallExpected: string;
  rainfallMm: number;
  rainfallProbability: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  forecastConfidence: number;
  uvIndex: number;
  pressureHpa: number;
  soilMoisturePercent: number;
  cloudCoverPercent: number;
  lastUpdated: string;
  blockLevelForecast: {
    name: string;
    gridResolution: string;
    rainfallMm: number;
    tempC: number;
    differenceReason: string;
  };
  downscalingFactors: {
    terrainElevation: string;
    insatSatelliteAlbedo: string;
    ndviVegetationDensity: string;
    historicalLocalBias: string;
    drainageBasinEffect: string;
  };
  risks: {
    rainfall: 'low' | 'moderate' | 'high';
    heat: 'low' | 'moderate' | 'high';
    wind: 'low' | 'moderate' | 'high';
    cropOverall: 'low' | 'moderate' | 'high';
  };
  todayAlert: {
    id: string;
    type: 'heavy_rain' | 'heatwave' | 'pest_risk' | 'wind_gust';
    severity: 'warning' | 'critical' | 'advisory';
    title: string;
    titleHi: string;
    message: string;
    messageHi: string;
    timeWindow: string;
    impactedCrops: string[];
    audioAvailable: boolean;
  };
  microZones: MicroZone[];
  sevenDayForecast: DayForecast[];
  pastVerification: {
    date: string;
    day: string;
    predictedMm: number;
    actualMm: number;
    errorMm: number;
    accuracyPercent: number;
  }[];
}

export interface PanchayatLocation {
  id: string;
  state: string;
  district: string;
  block: string;
  panchayat: string;
  panchayatHi: string;
  pincode: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  totalFarmlandHa: number;
  activeFarmers: number;
  primaryCrops: string[];
  weather: WeatherData;
}

export type CropType = 'Wheat' | 'Rice' | 'Soybean' | 'Cotton' | 'Tomato' | 'Other';
export type GrowthStage = 'Sowing' | 'Vegetative' | 'Flowering' | 'Harvesting';

export interface CropAdvisoryData {
  crop: CropType;
  cropHi: string;
  stage: GrowthStage;
  stageHi: string;
  riskLevel: 'low' | 'moderate' | 'high';
  weatherHeadline: string;
  weatherHeadlineHi: string;
  recommendations: string[];
  recommendationsHi: string[];
  dos: string[];
  donts: string[];
  pestDiseaseWarning?: string;
  irrigationStatus: 'Hold' | 'Recommended' | 'Light Irrigation' | 'Drain Fields';
  sprayingStatus: 'Safe' | 'Postpone (Rain Likely)' | 'Avoid (High Wind)';
}

export type ActionPlan = 'irrigate' | 'spray' | 'sow' | 'harvest';

export interface WhatIfResult {
  action: ActionPlan;
  verdict: 'recommended' | 'caution' | 'not_recommended';
  title: string;
  titleHi: string;
  summary: string;
  summaryHi: string;
  expectedWeather: string;
  cropImpact: string;
  actionableSteps: string[];
}
