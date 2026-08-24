/**
 * Type definitions for Telangana EV Charging Infrastructure & Highway Route Planner
 */

import type { EVModel } from './ev';

export type ConnectorType =
  | 'CCS2_DC'
  | 'TYPE_2_AC'
  | 'ATHER_GRID'
  | 'OLA_HYPERCHARGER'
  | 'STANDARD_15A'
  | 'BHARAT_AC001';

export type ChargingNetwork =
  | 'Ather Grid'
  | 'Ola Hypercharger'
  | 'Tata Power EZ Charge'
  | 'TS REDCO Public'
  | 'Kazam EV'
  | 'Bolt.earth'
  | 'Zeon Charging'
  | 'ChargeZone'
  | 'Jio-bp pulse';

export interface ChargingStation {
  id: string;
  name: string;
  network: ChargingNetwork;
  district: string;
  cityOrHighway: string;
  address: string;
  latitude: number;
  longitude: number;
  connectors: Array<{
    type: ConnectorType;
    powerKw: number;
    count: number;
    pricePerUnit: string;
  }>;
  maxPowerKw: number;
  is24x7: boolean;
  amenities: string[];
  contactPhone?: string;
  googleMapsUrl?: string;
  landmark?: string;
}

export interface CorridorWaypoint {
  id: string;
  name: string;
  distanceFromStartKm: number;
  description: string;
  chargingStationIds: string[];
}

export interface HighwayCorridor {
  id: string;
  name: string;
  highwayCode: string;
  totalDistanceKm: number;
  startLocation: string;
  endLocation: string;
  popularScenicSpots?: string[];
  waypoints: CorridorWaypoint[];
}

export interface ChargingStopPlan {
  stopIndex: number;
  waypointName: string;
  distanceFromStartKm: number;
  station: ChargingStation;
  batteryArrivalPercent: number;
  batteryDeparturePercent: number;
  chargeGainedKwh: number;
  chargingDurationMinutes: number;
  estimatedCostInr: number;
}

export interface RoutePlanResult {
  corridor: HighwayCorridor;
  model: EVModel;
  totalDistanceKm: number;
  highwayRangeKm: number;
  isFeasibleNonStop: boolean;
  requiredStopsCount: number;
  stops: ChargingStopPlan[];
  estimatedTotalTravelTimeMinutes: number;
  estimatedTotalChargingTimeMinutes: number;
  batteryAtDestinationPercent: number;
  totalEstimatedEnergyKwh: number;
  totalEstimatedChargingCostInr: number;
  routeSummaryText: string;
}
