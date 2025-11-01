
"use client";

import React from 'react';
import { Siren, Check, ChevronsUpDown, MapPin, SlidersHorizontal } from 'lucide-react';
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

interface SidebarControlsProps {
  regions: Region[];
  selectedRegion: Region;
  onRegionChange: (regionId: string) => void;
  params: { epsilon: number; minPts: number };
  onParamsChange: (params: { epsilon: number; minPts: number }) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  isApiKeyMissing: boolean;
}

export default function SidebarControls({
  regions,
  selectedRegion,
  onRegionChange,
  params,
  onParamsChange,
  onRunAnalysis,
  isAnalyzing,
  isApiKeyMissing,
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
            Parameter Tuning (DBSCAN)
          </SidebarGroupLabel>
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="epsilon">Epsilon (km)</Label>
                <span className="text-sm font-medium text-primary">{params.epsilon.toFixed(2)}</span>
              </div>
              <Slider
                id="epsilon"
                min={0.1}
                max={2}
                step={0.05}
                value={[params.epsilon]}
                onValueChange={(value) => onParamsChange({ ...params, epsilon: value[0] })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="minPts">Min Points</Label>
                <span className="text-sm font-medium text-primary">{params.minPts}</span>
              </div>
              <Slider
                id="minPts"
                min={2}
                max={50}
                step={1}
                value={[params.minPts]}
                onValueChange={(value) => onParamsChange({ ...params, minPts: value[0] })}
              />
            </div>
          </div>
        </SidebarGroup>
        
        <div className="p-4 mt-auto">
          <Button
            className="w-full"
            onClick={onRunAnalysis}
            disabled={isAnalyzing || isApiKeyMissing}
            size="lg"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>
      </SidebarContent>
    </>
  );
}
