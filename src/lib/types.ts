export type Region = {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
};

export type Accident = {
  id: number;
  lat: number;
  lng: number;
  severity: number; // 1-5
  factors: string[];
};

export type Hotspot = {
  id: string;
  lat: number;
  lng: number;
  accidentCount: number;
  averageSeverity: number;
  contributingFactors: string;
  accidents: Accident[];
};
