// use server'

/**
 * @fileOverview Analyzes accident hotspots and classifies their risk level based on contributing factors.
 *
 * - analyzeAccidentHotspotRisk - A function that handles the analysis and classification of accident hotspots.
 * - AnalyzeAccidentHotspotRiskInput - The input type for the analyzeAccidentHotspotRisk function.
 * - AnalyzeAccidentHotspotRiskOutput - The return type for the analyzeAccidentHotspotRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAccidentHotspotRiskInputSchema = z.object({
  accidentCount: z.number().describe('The number of accidents in the hotspot.'),
  averageSeverity: z.number().describe('The average severity of accidents in the hotspot (e.g., on a scale of 1 to 5).'),
  latitude: z.number().describe('The latitude of the accident hotspot.'),
  longitude: z.number().describe('The longitude of the accident hotspot.'),
  contributingFactors: z.string().describe('A comma-separated list of contributing factors to accidents in this hotspot (e.g., poor visibility, speeding, drunk driving).'),
});
export type AnalyzeAccidentHotspotRiskInput = z.infer<typeof AnalyzeAccidentHotspotRiskInputSchema>;

const AnalyzeAccidentHotspotRiskOutputSchema = z.object({
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The classified risk level of the accident hotspot.'),
  explanation: z.string().describe('A detailed explanation of why the hotspot was classified at this risk level, based on the input factors.'),
  suggestedActions: z.string().describe('A comma-separated list of suggested actions to mitigate the risk at this hotspot (e.g., increase police presence, improve signage, reduce speed limits).'),
});
export type AnalyzeAccidentHotspotRiskOutput = z.infer<typeof AnalyzeAccidentHotspotRiskOutputSchema>;

export async function analyzeAccidentHotspotRisk(input: AnalyzeAccidentHotspotRiskInput): Promise<AnalyzeAccidentHotspotRiskOutput> {
  return analyzeAccidentHotspotRiskFlow(input);
}

const analyzeAccidentHotspotRiskPrompt = ai.definePrompt({
  name: 'analyzeAccidentHotspotRiskPrompt',
  input: {schema: AnalyzeAccidentHotspotRiskInputSchema},
  output: {schema: AnalyzeAccidentHotspotRiskOutputSchema},
  prompt: `You are an expert in traffic accident risk assessment. You are provided with information about an accident hotspot, including the accident count, average severity, location (latitude and longitude), and contributing factors.

  Based on this information, classify the risk level of the hotspot as Low, Medium, or High, and provide a detailed explanation for your classification. Also, suggest specific actions that can be taken to mitigate the risk at this hotspot.

  Accident Count: {{{accidentCount}}}
  Average Severity: {{{averageSeverity}}}
  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}
  Contributing Factors: {{{contributingFactors}}}

  Respond with JSON:
  `,
});

const analyzeAccidentHotspotRiskFlow = ai.defineFlow(
  {
    name: 'analyzeAccidentHotspotRiskFlow',
    inputSchema: AnalyzeAccidentHotspotRiskInputSchema,
    outputSchema: AnalyzeAccidentHotspotRiskOutputSchema,
  },
  async input => {
    const {output} = await analyzeAccidentHotspotRiskPrompt(input);
    return output!;
  }
);
