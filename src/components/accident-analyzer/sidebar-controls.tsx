"use client";

import React, { useRef } from 'react';
import { CarCrash, Upload, MapPin, SlidersHorizontal } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Region } from '@/lib/types';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileName = event.target.files[0].name;
      toast({
        title: "File Uploaded (Simulated)",
        description: `${fileName} is ready for analysis.`,
      });
    }
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <CarCrash className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline">Accident Analyzer</h1>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Data Upload
          </SidebarGroupLabel>
          <div className="p-2">
            <Input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleFileUploadClick}
            >
              Upload CSV File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Upload accident datasets (e.g., from Kaggle).</p>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Region Selection
          </SidebarGroupLabel>
          <div className="p-2">
            <Select value={selectedRegion.id} onValueChange={onRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
