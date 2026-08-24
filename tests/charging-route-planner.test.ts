import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  TELANGANA_CHARGING_STATIONS,
  getAllChargingStations,
  getChargingStationById,
  getStationsByDistrict,
  getStationsByNetwork,
  getStationsByConnector
} from '../src/data/telanganaChargingData.ts';
import {
  TELANGANA_HIGHWAY_CORRIDORS,
  getAllHighwayCorridors,
  getHighwayCorridorById
} from '../src/data/highwayCorridorsData.ts';
import {
  calculateHighwayRoutePlan
} from '../src/utils/routePlannerEngine.ts';
import { getEVModels, getEVModelById } from '../src/data/evModels.ts';

describe('Milestone: Telangana EV Charging & Highway Route Planner Test Suite', () => {
  const allStations = getAllChargingStations();
  const allCorridors = getAllHighwayCorridors();
  const evModels = getEVModels();

  describe('1. Telangana Charging Station Dataset Integrity', () => {
    it('verifies dataset size and non-empty station properties', () => {
      assert.ok(allStations.length >= 20, `Expected >= 20 stations, got ${allStations.length}`);

      for (const station of allStations) {
        assert.ok(station.id && station.id.startsWith('ts-chg-'), `Invalid ID: ${station.id}`);
        assert.ok(station.name && station.name.length > 0, `Missing name: ${station.id}`);
        assert.ok(station.address && station.address.length > 0, `Missing address: ${station.id}`);
        assert.ok(station.district && station.district.length > 0, `Missing district: ${station.id}`);
        assert.ok(station.cityOrHighway && station.cityOrHighway.length > 0, `Missing highway: ${station.id}`);
        
        // Coordinates in Telangana bounding box: Lat [15.5, 19.5], Long [77.0, 81.5]
        assert.ok(
          station.latitude >= 15.0 && station.latitude <= 20.0,
          `Latitude out of bounds for ${station.id}: ${station.latitude}`
        );
        assert.ok(
          station.longitude >= 77.0 && station.longitude <= 82.0,
          `Longitude out of bounds for ${station.id}: ${station.longitude}`
        );

        assert.ok(station.maxPowerKw > 0, `maxPowerKw must be > 0 for ${station.id}`);
        assert.ok(station.connectors.length > 0, `Connectors array cannot be empty for ${station.id}`);
        assert.ok(station.amenities.length > 0, `Amenities array cannot be empty for ${station.id}`);
      }
    });

    it('verifies filtering helpers by district, network, and connector', () => {
      const hydStations = getStationsByDistrict('Hyderabad');
      assert.ok(hydStations.length >= 5, `Expected >= 5 Hyderabad stations, got ${hydStations.length}`);

      const atherStations = getStationsByNetwork('Ather Grid');
      assert.ok(atherStations.length >= 2, `Expected >= 2 Ather Grid stations, got ${atherStations.length}`);

      const ccs2Stations = getStationsByConnector('CCS2_DC');
      assert.ok(ccs2Stations.length >= 5, `Expected >= 5 CCS2 stations, got ${ccs2Stations.length}`);
    });
  });

  describe('2. Telangana Highway Corridors Integrity', () => {
    it('verifies all 5 pre-configured corridors exist with valid monotonic waypoints', () => {
      assert.strictEqual(allCorridors.length, 5, 'Must have exactly 5 pre-configured highway corridors');

      for (const corridor of allCorridors) {
        assert.ok(corridor.totalDistanceKm > 0, `Invalid totalDistance for ${corridor.id}`);
        assert.ok(corridor.waypoints.length >= 4, `Corridor ${corridor.id} must have at least 4 waypoints`);

        let prevDistance = -1;
        for (let i = 0; i < corridor.waypoints.length; i++) {
          const wp = corridor.waypoints[i];
          assert.ok(
            wp.distanceFromStartKm >= prevDistance,
            `Waypoint distances must be monotonic for ${corridor.id}`
          );
          prevDistance = wp.distanceFromStartKm;

          // Start waypoint at KM 0, End waypoint matches totalDistanceKm
          if (i === 0) {
            assert.strictEqual(wp.distanceFromStartKm, 0);
          }
          if (i === corridor.waypoints.length - 1) {
            assert.strictEqual(wp.distanceFromStartKm, corridor.totalDistanceKm);
          }
        }
      }
    });
  });

  describe('3. Highway Route Calculation Engine & Simulation Physics', () => {
    const warangalCorridor = getHighwayCorridorById('corridor-hyderabad-warangal-nh163')!;
    const orrLoopCorridor = getHighwayCorridorById('corridor-hyderabad-orr-loop-158')!;

    it('calculates non-stop feasibility for long-range motorcycle (Ultraviolette Concept X47, 10.3 kWh)', () => {
      const x47 = getEVModelById('ultraviolette-concept-x47')!;
      const plan = calculateHighwayRoutePlan(x47, warangalCorridor, {
        startingBatteryPercent: 100,
        riderStyle: 'balanced'
      });

      assert.strictEqual(plan.totalDistanceKm, 148);
      assert.ok(plan.highwayRangeKm >= 160, `Highway range should be >= 160 km, got ${plan.highwayRangeKm}`);
      assert.strictEqual(plan.isFeasibleNonStop, true);
      assert.strictEqual(plan.requiredStopsCount, 0);
      assert.ok(plan.batteryAtDestinationPercent >= 15);
    });

    it('correctly schedules charging stop for short-range commuter (Bounce Infinity E.1+, 2.5 kWh)', () => {
      const bounce = getEVModelById('bounce-infinity-e1-plus')!;
      const plan = calculateHighwayRoutePlan(bounce, warangalCorridor, {
        startingBatteryPercent: 100,
        riderStyle: 'balanced'
      });

      assert.strictEqual(plan.totalDistanceKm, 148);
      assert.strictEqual(plan.isFeasibleNonStop, false);
      assert.ok(plan.requiredStopsCount >= 1, 'Must require at least 1 charging stop');
      assert.ok(plan.stops.length >= 1);
      assert.ok(plan.estimatedTotalChargingTimeMinutes > 0);
      assert.ok(plan.totalEstimatedChargingCostInr > 0);
    });

    it('empirically evaluates all 53+ EV models across the 158 km ORR Expressway loop', () => {
      for (const model of evModels) {
        const plan = calculateHighwayRoutePlan(model, orrLoopCorridor, {
          startingBatteryPercent: 100,
          riderStyle: 'balanced'
        });

        assert.strictEqual(plan.totalDistanceKm, 158);
        assert.ok(Number.isFinite(plan.estimatedTotalTravelTimeMinutes));
        assert.ok(Number.isFinite(plan.totalEstimatedEnergyKwh));
        assert.ok(plan.batteryAtDestinationPercent >= 0 && plan.batteryAtDestinationPercent <= 100);
      }
    });
  });
});
