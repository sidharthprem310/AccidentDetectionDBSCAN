import type { Region, Accident, Hotspot } from '@/lib/types';

export const regions: Region[] = [
  { id: 'sf', name: 'San Francisco', center: { lat: 37.7749, lng: -122.4194 }, zoom: 12 },
  { id: 'nyc', name: 'New York City', center: { lat: 40.7128, lng: -74.0060 }, zoom: 11 },
  { id: 'london', name: 'London', center: { lat: 51.5074, lng: -0.1278 }, zoom: 11 },
  { id: 'tokyo', name: 'Tokyo', center: { lat: 35.6895, lng: 139.6917 }, zoom: 11 },
  { id: 'paris', name: 'Paris', center: { lat: 48.8566, lng: 2.3522 }, zoom: 12 },
  { id: 'sydney', name: 'Sydney', center: { lat: -33.8688, lng: 151.2093 }, zoom: 11 },
];

const factors = ["speeding", "poor visibility", "road design", "distracted driving", "weather conditions", "traffic congestion"];

const generateAccidents = (region: Region, count: number): Accident[] => {
  const accidents: Accident[] = [];
  for (let i = 0; i < count; i++) {
    // Generate points clustered around a few centers
    const clusterCenterLat = region.center.lat + (Math.random() - 0.5) * 0.1;
    const clusterCenterLng = region.center.lng + (Math.random() - 0.5) * 0.2;
    
    accidents.push({
      id: i,
      lat: clusterCenterLat + (Math.random() - 0.5) * 0.01,
      lng: clusterCenterLng + (Math.random() - 0.5) * 0.02,
      severity: Math.floor(Math.random() * 5) + 1,
      factors: [factors[Math.floor(Math.random() * factors.length)]]
    });
  }
  return accidents;
}


export const accidentData: Record<string, Accident[]> = {
  sf: generateAccidents(regions[0], 500),
  nyc: generateAccidents(regions[1], 800),
  london: generateAccidents(regions[2], 600),
  tokyo: generateAccidents(regions[3], 900),
  paris: generateAccidents(regions[4], 550),
  sydney: generateAccidents(regions[5], 450),
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const simulateDbscan = (points: Accident[], epsilon: number, minPts: number): Hotspot[] => {
  let clusteredPoints = new Set<number>();
  const hotspots: Hotspot[] = [];
  let hotspotId = 0;

  for (const point of points) {
    if (clusteredPoints.has(point.id)) {
      continue;
    }

    const neighbors = points.filter(p => getDistance(point.lat, point.lng, p.lat, p.lng) < epsilon);

    if (neighbors.length >= minPts) {
      neighbors.forEach(n => clusteredPoints.add(n.id));
      
      const latSum = neighbors.reduce((sum, p) => sum + p.lat, 0);
      const lngSum = neighbors.reduce((sum, p) => sum + p.lng, 0);
      const severitySum = neighbors.reduce((sum, p) => sum + p.severity, 0);
      
      const allFactors = new Set(neighbors.flatMap(p => p.factors));

      hotspots.push({
        id: `hotspot-${hotspotId++}`,
        lat: latSum / neighbors.length,
        lng: lngSum / neighbors.length,
        accidentCount: neighbors.length,
        averageSeverity: parseFloat((severitySum / neighbors.length).toFixed(2)),
        contributingFactors: Array.from(allFactors).join(', '),
        accidents: neighbors,
      });
    }
  }

  return hotspots;
};
