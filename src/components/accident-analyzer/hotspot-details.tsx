"use client";

import React, { useEffect, useState } from 'react';
import { X, Bot, Shield, AlertTriangle, TrafficCone } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Hotspot } from '@/lib/types';
import { getRiskAnalysis } from '@/app/actions';
import type { AnalyzeAccidentHotspotRiskOutput } from '@/ai/flows/analyze-accident-hotspot-risk';
import { useToast } from '@/hooks/use-toast';

interface HotspotDetailsProps {
  hotspot: Hotspot;
  onClose: () => void;
}

const RiskBadge = ({ riskLevel }: { riskLevel: 'Low' | 'Medium' | 'High' }) => {
  const variants = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive',
  } as const;
  
  const colors = {
      Low: 'bg-green-500',
      Medium: 'bg-yellow-500',
      High: 'bg-red-500',
  }

  return <Badge variant={variants[riskLevel]} className={`text-white ${colors[riskLevel]}`}>{riskLevel} Risk</Badge>;
};

export default function HotspotDetails({ hotspot, onClose }: HotspotDetailsProps) {
  const [analysis, setAnalysis] = useState<AnalyzeAccidentHotspotRiskOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setAnalysis(null);
      
      const input = {
        accidentCount: hotspot.accidentCount,
        averageSeverity: hotspot.averageSeverity,
        latitude: hotspot.lat,
        longitude: hotspot.lng,
        contributingFactors: hotspot.contributingFactors,
      };

      const result = await getRiskAnalysis(input);

      if (result.success) {
        setAnalysis(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'AI Analysis Failed',
          description: result.error,
        });
      }
      setIsLoading(false);
    };

    fetchAnalysis();
  }, [hotspot, toast]);

  return (
    <Card className="shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-right-2 duration-300">
      <CardHeader className="relative pb-4">
        <CardTitle className="pr-10">Hotspot Details</CardTitle>
        <CardDescription>
          Lat: {hotspot.lat.toFixed(4)}, Lng: {hotspot.lng.toFixed(4)}
        </CardDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="font-semibold">Accident Count:</div>
          <div>{hotspot.accidentCount}</div>
          <div className="font-semibold">Avg. Severity:</div>
          <div>{hotspot.averageSeverity} / 5</div>
          <div className="font-semibold col-span-2">Contributing Factors:</div>
          <div className="col-span-2 text-muted-foreground">{hotspot.contributingFactors || 'N/A'}</div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Risk Assessment</h3>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full mt-2" />
               <Skeleton className="h-4 w-4/6" />
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4"/> Risk Level</h4>
                <RiskBadge riskLevel={analysis.riskLevel} />
              </div>
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2"><Shield className="h-4 w-4" /> Explanation</h4>
                <p className="text-sm text-muted-foreground">{analysis.explanation}</p>
              </div>
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2"><TrafficCone className="h-4 w-4" /> Suggested Actions</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {analysis.suggestedActions.split(',').map((action, i) => (
                    <li key={i}>{action.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-destructive">Could not retrieve AI analysis.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
