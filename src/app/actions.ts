"use server";

import { analyzeAccidentHotspotRisk, AnalyzeAccidentHotspotRiskInput, AnalyzeAccidentHotspotRiskOutput } from '@/ai/flows/analyze-accident-hotspot-risk';

export async function getRiskAnalysis(input: AnalyzeAccidentHotspotRiskInput): Promise<{ success: true; data: AnalyzeAccidentHotspotRiskOutput } | { success: false; error: string }> {
  try {
    const result = await analyzeAccidentHotspotRisk(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getRiskAnalysis server action:', error);
    return { success: false, error: 'Failed to get risk analysis from AI model.' };
  }
}
