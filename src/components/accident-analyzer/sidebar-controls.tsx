
"use client";

import React from 'react';
import { Siren, Check, ChevronsUpDown, MapPin, SlidersHorizontal, Info, RotateCcw } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import type { Region } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

interface SidebarControlsProps {
  regions: Region[];
  selectedRegion: Region;
  onRegionChange: (regionId: string) => void;
  params: { epsilon: number; minPts: number };
  onParamsChange: (params: { epsilon: number; minPts: number }) => void;
  onRunAnalysis: () => void;
  onResetParams: () => void;
  isAnalyzing: boolean;
}

export default function SidebarControls({
  regions,
  selectedRegion,
  onRegionChange,
  params,
  onParamsChange,
  onRunAnalysis,
  onResetParams,
  isAnalyzing,
}: SidebarControlsProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Siren className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">Accident Analyzer</h1>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Search
          </SidebarGroupLabel>
          <div className="p-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedRegion
                  ? regions.find((region) => region.id === selectedRegion.id)?.name
                  : "Select a region..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search region..." />
                <CommandEmpty>No region found.</CommandEmpty>
                <CommandGroup>
                  {regions.map((region) => (
                    <CommandItem
                      key={region.id}
                      value={region.name}
                      onSelect={() => {
                        onRegionChange(region.id)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRegion.id === region.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {region.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground mt-2">Search for a city to analyze accident hotspots.</p>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            DBSCAN Parameters
          </SidebarGroupLabel>
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="epsilon">Epsilon (ε) - Max Distance</Label>
                <span className="text-sm font-medium text-primary">{params.epsilon.toFixed(2)}km</span>
              </div>
              <Slider
                id="epsilon"
                min={0.1}
                max={2}
                step={0.05}
                value={[params.epsilon]}
                onValueChange={(value) => onParamsChange({ ...params, epsilon: value[0] })}
              />
               <p className="text-xs text-muted-foreground">Maximum distance between points to be considered neighbors.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="minPts">MinPts - Minimum Points</Label>
                <span className="text-sm font-medium text-primary">{params.minPts}</span>
              </div>
              <Slider
                id="minPts"
                min={2}
                max={10}
                step={1}
                value={[params.minPts]}
                onValueChange={(value) => onParamsChange({ ...params, minPts: value[0] })}
              />
              <p className="text-xs text-muted-foreground">Minimum number of points required to form a cluster.</p>
            </div>
             <Button variant="outline" size="sm" className="w-full" onClick={onResetParams}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
            </Button>
          </div>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Algorithm Info
          </SidebarGroupLabel>
            <CardContent className="pt-2 text-xs text-muted-foreground">
                <ul className="list-disc space-y-2 pl-4">
                    <li><span className="font-semibold text-foreground">DBSCAN:</span> Density-Based Spatial Clustering</li>
                    <li><span className="font-semibold text-foreground">Core Points:</span> Have ≥ minPts neighbors within ε</li>
                    <li><span className="font-semibold text-foreground">Border Points:</span> Within ε of core points</li>
                    <li><span className="font-semibold text-foreground">Noise Points:</span> Neither core nor border</li>
                    <li><span className="font-semibold text-foreground">Hotspots:</span> Clusters with ≥4 points or high severity accidents</li>
                </ul>
            </CardContent>
        </SidebarGroup>
        
        <div className="p-4 mt-auto">
          <Button
            className="w-full"
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            size="lg"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>
      </SidebarContent>
    </>
  );
}
