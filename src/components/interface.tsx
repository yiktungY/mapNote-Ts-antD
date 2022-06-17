export interface MarkerType {
  address: string;
  id: string;
  timeZone: string;
  localTime: Date;
  createdAt: Date;
  latLng: LatLngLiteral;
  length?: number;
}

export type LatLngLiteral = google.maps.LatLngLiteral;

export interface GeolocationType {
  coords: Coords;
  timestamp: number;
}

export interface Coords {
  latitude: number;
  longitude: number;
}

