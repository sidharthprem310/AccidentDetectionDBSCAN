"use client";

import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Region, Hotspot } from '@/lib/types';

interface MapViewProps {
  region: Region;
  hotspots: Hotspot[];
  selectedHotspot: Hotspot | null;
  onHotspotClick: (hotspot: Hotspot) => void;
}

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
];


export default function MapView({ region, hotspots, selectedHotspot, onHotspotClick }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        key={region.id}
        center={region.center}
        zoom={region.zoom}
        mapId="accident-analyzer-map"
        styles={mapStyles}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        className="w-full h-full transition-all duration-500"
      >
        {hotspots.map((hotspot) => {
          const maxAccidents = Math.max(...hotspots.map(h => h.accidentCount), 1);
          const intensity = Math.min(hotspot.accidentCount / maxAccidents, 1);
          const size = 24 + intensity * 24;
          const isSelected = selectedHotspot?.id === hotspot.id;

          return (
            <AdvancedMarker
              key={hotspot.id}
              position={{ lat: hotspot.lat, lng: hotspot.lng }}
              onClick={() => onHotspotClick(hotspot)}
            >
              <div
                className="rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-lg cursor-pointer transition-all duration-300"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.6 + intensity * 0.4,
                  border: isSelected ? '3px solid hsl(var(--primary))' : '2px solid rgba(255, 255, 255, 0.5)',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {hotspot.accidentCount}
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
