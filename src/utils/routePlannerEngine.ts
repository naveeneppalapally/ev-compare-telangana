/**
 * Highway Route Planner & Battery Range Simulation Engine
 */

import type { EVModel } from '../types/ev.ts';
import type {
  HighwayCorridor,
  RoutePlanResult,
  ChargingStopPlan,
  ChargingStation
} from '../types/charging.ts';
import { getChargingStationById } from '../data/telanganaChargingData.ts';

export interface RoutePlanOptions {
  startingBatteryPercent?: number;
  riderStyle?: 'eco_cruising' | 'balanced' | 'fast_expressway';
  minimumReservePercent?: number; // default 15%
}

/**
 * Calculates a complete highway route plan for any EV model along a Telangana corridor
 */
export function calculateHighwayRoutePlan(
  model: EVModel,
  corridor: HighwayCorridor,
  options: RoutePlanOptions = {}
): RoutePlanResult {
  const {
    startingBatteryPercent = 100,
    riderStyle = 'balanced',
    minimumReservePercent = 15
  } = options;

  // Aerodynamic highway range factor based on rider cruising style
  let styleMultiplier = 0.75;
  let avgCruisingSpeedKmh = 65;
  if (riderStyle === 'eco_cruising') {
    styleMultiplier = 0.82;
    avgCruisingSpeedKmh = 55;
  } else if (riderStyle === 'fast_expressway') {
    styleMultiplier = 0.68;
    avgCruisingSpeedKmh = 75;
  }

  // Base highway range — realWorldHighwayRangeKm is already riding-style aware; only scale city fallback.
  const hasHighwayRange = typeof model.specs.realWorldHighwayRangeKm === 'number' && model.specs.realWorldHighwayRangeKm > 0;
  const effectiveHighwayRangeKm = hasHighwayRange
    ? Math.max(25, model.specs.realWorldHighwayRangeKm)
    : Math.max(25, Math.round(model.specs.realWorldCityRangeKm * styleMultiplier));
  const batteryCapacityKwh = model.specs.batteryCapacityKwh || 3.0;

  // Energy consumption Wh per km on highway
  const whPerKm = Math.round((batteryCapacityKwh * 1000) / effectiveHighwayRangeKm);

  const totalDistanceKm = corridor.totalDistanceKm;
  let currentSoC = startingBatteryPercent;
  const stops: ChargingStopPlan[] = [];

  let accumulatedChargingMinutes = 0;
  let totalChargingCostInr = 0;
  let totalEnergyConsumedKwh = 0;

  // Traverse waypoints
  for (let i = 1; i < corridor.waypoints.length; i++) {
    const wp = corridor.waypoints[i];
    const segmentDistanceKm = wp.distanceFromStartKm - corridor.waypoints[i - 1].distanceFromStartKm;

    // Calculate battery used for this segment
    const segmentEnergyKwh = (segmentDistanceKm * whPerKm) / 1000;
    totalEnergyConsumedKwh += segmentEnergyKwh;
    const segmentBatteryDropPercent = Math.round((segmentDistanceKm / effectiveHighwayRangeKm) * 100);
    const projectedSoC = currentSoC - segmentBatteryDropPercent;

    // Check if next waypoint (or final destination) would cause battery to drop below minimumReservePercent
    const nextDistanceKm = i < corridor.waypoints.length - 1
      ? corridor.waypoints[i + 1].distanceFromStartKm - wp.distanceFromStartKm
      : 0;
    const projectedNextDrop = Math.round((nextDistanceKm / effectiveHighwayRangeKm) * 100);

    const isLastWaypoint = i === corridor.waypoints.length - 1;
    const mustStopHere = !isLastWaypoint && (projectedSoC - projectedNextDrop < minimumReservePercent || projectedSoC <= minimumReservePercent + 5);

    if (mustStopHere && wp.chargingStationIds.length > 0) {
      // Pick best station at this waypoint
      const candidateStation = wp.chargingStationIds
        .map(id => getChargingStationById(id))
        .find(s => s !== undefined) as ChargingStation | undefined;

      if (candidateStation) {
        const arrivalPercent = Math.max(5, projectedSoC);
        const targetDeparturePercent = 85; // Fast charge sweet-spot
        const percentToCharge = Math.max(10, targetDeparturePercent - arrivalPercent);
        const kwhToCharge = Math.round(((percentToCharge / 100) * batteryCapacityKwh) * 10) / 10;

        // Charging duration calculation
        let chargingMinutes = 60;
        let ratePerKwh = 18;

        if (model.specs.fastChargingSupport && candidateStation.maxPowerKw >= 15) {
          // Fast DC / Boost charging (e.g. 20-80% in 35-45 mins)
          chargingMinutes = Math.max(20, Math.round((percentToCharge / 65) * 40));
          ratePerKwh = 21;
        } else {
          // Standard 15A socket AC charging (e.g. 3-4 hours 0-100%)
          const standardFullHours = 4.0;
          chargingMinutes = Math.max(30, Math.round((percentToCharge / 100) * standardFullHours * 60));
          ratePerKwh = 14;
        }

        const stopCost = Math.round(kwhToCharge * ratePerKwh);
        accumulatedChargingMinutes += chargingMinutes;
        totalChargingCostInr += stopCost;

        stops.push({
          stopIndex: stops.length + 1,
          waypointName: wp.name,
          distanceFromStartKm: wp.distanceFromStartKm,
          station: candidateStation,
          batteryArrivalPercent: arrivalPercent,
          batteryDeparturePercent: targetDeparturePercent,
          chargeGainedKwh: kwhToCharge,
          chargingDurationMinutes: chargingMinutes,
          estimatedCostInr: stopCost
        });

        // Reset current SoC to departure percentage
        currentSoC = targetDeparturePercent;
        continue;
      }
    }

    currentSoC = Math.max(0, projectedSoC);
  }

  const isFeasibleNonStop = stops.length === 0 && currentSoC >= minimumReservePercent;
  const ridingTimeMinutes = Math.round((totalDistanceKm / avgCruisingSpeedKmh) * 60);
  const totalTravelTimeMinutes = ridingTimeMinutes + accumulatedChargingMinutes;

  let summaryText = '';
  if (isFeasibleNonStop) {
    summaryText = `✅ Non-Stop Corridor Feasible! ${model.name} can comfortably complete ${corridor.name} (${totalDistanceKm} km) on a single full charge with ~${currentSoC}% battery reserve remaining at destination.`;
  } else {
    summaryText = `⚡ Requires ${stops.length} charging stop${stops.length > 1 ? 's' : ''} along ${corridor.highwayCode}. Total estimated journey time is ${Math.floor(totalTravelTimeMinutes / 60)}h ${totalTravelTimeMinutes % 60}m including ${accumulatedChargingMinutes} mins charging downtime.`;
  }

  return {
    corridor,
    model,
    totalDistanceKm,
    highwayRangeKm: effectiveHighwayRangeKm,
    isFeasibleNonStop,
    requiredStopsCount: stops.length,
    stops,
    estimatedTotalTravelTimeMinutes: totalTravelTimeMinutes,
    estimatedTotalChargingTimeMinutes: accumulatedChargingMinutes,
    batteryAtDestinationPercent: Math.max(0, Math.min(100, currentSoC)),
    totalEstimatedEnergyKwh: Math.round(totalEnergyConsumedKwh * 10) / 10,
    totalEstimatedChargingCostInr: totalChargingCostInr,
    routeSummaryText: summaryText
  };
}
