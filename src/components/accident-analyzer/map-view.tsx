"use client";

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { Region, Hotspot } from '@/lib/types';
import { Button } from '../ui/button';
import { Plus, Minus } from 'lucide-react';

interface MapViewProps {
  region: Region;
  hotspots: Hotspot[];
  selectedHotspot: Hotspot | null;
  onHotspotClick: (hotspot: Hotspot) => void;
}

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const MapControls = () => {
    const map = useMap();
    const [zoom, setZoom] = useState(map?.getZoom() || 10);

    const onZoom = (level: number) => {
        const newZoom = (map?.getZoom() ?? 10) + level;
        map?.setZoom(newZoom);
        setZoom(newZoom);
    }
    
    React.useEffect(() => {
        if (!map) return;
        const listener = map.addListener('zoom_changed', () => {
            setZoom(map.getZoom() ?? 10);
        });
        return () => google.maps.event.removeListener(listener);
    }, [map]);

    return (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <Button variant="secondary" size="icon" onClick={() => onZoom(1)}>
                <Plus className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => onZoom(-1)}>
                <Minus className="h-4 w-4" />
            </Button>
        </div>
    )
}

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
      <MapControls />
    </APIProvider>
  );
}
