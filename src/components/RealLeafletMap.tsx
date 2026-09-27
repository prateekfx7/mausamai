'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MicroZone, WeatherData } from '../types';

interface RealLeafletMapProps {
  weather: WeatherData;
  panchayatName: string;
  lat: number;
  lng: number;
  zoom: number;
  selectedZone: MicroZone;
  onSelectZone: (zone: MicroZone) => void;
  isHindi: boolean;
}

export default function RealLeafletMap({
  weather,
  panchayatName,
  lat,
  lng,
  zoom,
  selectedZone,
  onSelectZone,
  isHindi,
}: RealLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const polygonGroupRef = useRef<any>(null);

  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Fix marker default icons with fast inline SVG data URIs
      const svgMarker = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path fill="%232563eb" stroke="%23ffffff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z"/><circle cx="12.5" cy="12.5" r="5.5" fill="%23ffffff"/></svg>`;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: svgMarker,
        iconRetinaUrl: svgMarker,
        shadowUrl: '',
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: zoom || 13,
          zoomControl: false,
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        const streetUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const tileLayer = L.tileLayer(mapType === 'satellite' ? satelliteUrl : streetUrl, {
          attribution: mapType === 'satellite' ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS' : '&copy; OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        tileLayerRef.current = tileLayer;
        polygonGroupRef.current = L.featureGroup().addTo(map);
        mapInstanceRef.current = map;

        // Add Village AWS Weather Station Marker
        const awsIcon = L.divIcon({
          className: 'custom-aws-pin',
          html: `<div style="background:#2563eb;color:white;padding:4px 8px;border-radius:12px;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;">📡 AWS Station</div>`,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });
        L.marker([lat, lng], { icon: awsIcon }).addTo(map).bindPopup(`<b>${panchayatName} AWS Station</b><br/>24h Rain: ${weather.rainfallMm} mm`);

        if (isMounted) setMapLoaded(true);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map layer when mapType changes
  useEffect(() => {
    async function updateTiles() {
      if (!mapInstanceRef.current || !tileLayerRef.current) return;
      const L = (await import('leaflet')).default;

      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      const streetUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const newTile = L.tileLayer(mapType === 'satellite' ? satelliteUrl : streetUrl, {
        attribution: mapType === 'satellite' ? '&copy; Esri World Imagery' : '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newTile;
    }
    updateTiles();
  }, [mapType]);

  // Re-render polygons when selectedZone or microZones change
  useEffect(() => {
    async function updatePolygons() {
      if (!mapInstanceRef.current || !polygonGroupRef.current) return;
      const L = (await import('leaflet')).default;
      const group = polygonGroupRef.current;
      group.clearLayers();

      weather.microZones.forEach((zone) => {
        const isSelected = selectedZone.id === zone.id;
        const color = zone.rainfallLevel === 'high' ? '#ef4444' : zone.rainfallLevel === 'moderate' ? '#f59e0b' : '#10b981';

        const coords = zone.polygonCoords || [
          [lat + 0.01, lng - 0.01],
          [lat + 0.015, lng + 0.01],
          [lat - 0.005, lng + 0.015],
          [lat - 0.01, lng - 0.005],
        ];

        const polygon = L.polygon(coords, {
          color: isSelected ? '#ffffff' : color,
          weight: isSelected ? 3 : 2,
          fillColor: color,
          fillOpacity: isSelected ? 0.65 : 0.4,
        });

        polygon.on('click', () => {
          onSelectZone(zone);
        });

        polygon.bindTooltip(`<b>${isHindi ? zone.nameHi : zone.name}</b><br/>Rain: ${zone.expectedRainfall}`, {
          permanent: false,
          direction: 'top',
        });

        group.addLayer(polygon);
      });
    }

    if (mapLoaded) {
      updatePolygons();
    }
  }, [selectedZone, weather.microZones, mapLoaded, lat, lng]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], zoom || 13);
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-slate-900" />

      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-md">
        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapType === 'satellite' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          🛰️ {isHindi ? 'उपग्रह' : 'Satellite'}
        </button>
        <button
          onClick={() => setMapType('street')}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapType === 'street' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          🗺️ {isHindi ? 'नक्शा' : 'Street Map'}
        </button>
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        title="Re-center Map"
        className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-md flex items-center gap-1.5 transition-all"
      >
        <span>🎯</span>
        <span>{isHindi ? 'केंद्रित करें' : 'Re-center'}</span>
      </button>
    </div>
  );
}
