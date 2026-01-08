export type TrackingStatus =
  | "BOOKED"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELAYED";

export interface TrackingEvent {
  id: string;
  label: string;
  location: string;
  timestamp: string; // ISO
}

export interface TrackingPayload {
  trackingId: string;
  status: TrackingStatus;
  mode: "AIR" | "SURFACE";
  origin: string;
  destination: string;
  eta: string; // ISO
  lastUpdated: string; // ISO
  pieces: number;
  weightKg: number;
  events: TrackingEvent[];
}
