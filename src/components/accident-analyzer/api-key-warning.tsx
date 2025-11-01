"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function ApiKeyWarning() {
  return (
    <div className="flex items-center justify-center h-full bg-muted/50">
      <Alert variant="destructive" className="max-w-md m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Configuration Error</AlertTitle>
        <AlertDescription>
          The Google Maps API key is missing. Please set the <code className="font-mono bg-destructive-foreground/20 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> environment variable to use the map features.
        </AlertDescription>
      </Alert>
    </div>
  );
}
