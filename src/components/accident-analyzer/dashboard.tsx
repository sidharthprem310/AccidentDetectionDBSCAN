"use client";

import React, { useState, useTransition, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import SidebarControls from '@/components/accident-analyzer/sidebar-controls';
import MapView from '@/components/accident-analyzer/map-view';
import HotspotDetails from '@/components/accident-analyzer/hotspot-details';
import { accidentData, regions, simulateDbscan } from '@/lib/data';
import type { Region, Hotspot } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import ApiKeyWarning from './api-key-warning';

export default function Dashboard() {
  const [region, setRegion] = useState<Region>(regions[0]);
  const [params, setParams] = useState({ epsilon: 0.5, minPts: 5 });
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isAnalyzing, startAnalysis] = useTransition();
  const { toast } = useToast();
  
  const isApiKeyMissing = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleRunAnalysis = useCallback(() => {
    startAnalysis(() => {
      const points = accidentData[region.id];
      const newHotspots = simulateDbscan(points, params.epsilon, params.minPts);
      setHotspots(newHotspots);
      setSelectedHotspot(null);
      toast({
        title: "Analysis Complete",
        description: `Found ${newHotspots.length} hotspots in ${region.name}.`,
      });
    });
  }, [region, params, toast]);

  const handleRegionChange = useCallback((regionId: string) => {
    const newRegion = regions.find(r => r.id === regionId);
    if (newRegion) {
      setRegion(newRegion);
      setHotspots([]);
      setSelectedHotspot(null);
    }
  }, []);

  if (isApiKeyMissing) {
    return <ApiKeyWarning />;
  }

  return (
    <SidebarProvider>
      <div className="relative min-h-screen">
        <Sidebar>
          <SidebarControls
            regions={regions}
            selectedRegion={region}
            onRegionChange={handleRegionChange}
            params={params}
            onParamsChange={setParams}
            onRunAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </Sidebar>
        <SidebarInset>
          <div className="relative h-screen w-full">
            <MapView
              region={region}
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onHotspotClick={setSelectedHotspot}
            />
            {selectedHotspot && (
              <div className="absolute top-4 right-4 z-10 w-full max-w-sm">
                <HotspotDetails
                  hotspot={selectedHotspot}
                  onClose={() => setSelectedHotspot(null)}
                />
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
