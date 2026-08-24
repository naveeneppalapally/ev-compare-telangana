import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getEVModels, getEVModelById } from '../src/data/evModels.ts';
import { simulateRange } from '../src/utils/rangeSimulator.ts';
import { 
  calculateSavings, 
  calculate5YearTCO, 
  calculatePaybackPeriod, 
  calculateCarbonOffset,
  FINANCIAL_BENCHMARKS 
} from '../src/utils/savingsCalculator.ts';
import { calculateTelanganaOnRoadPrice } from '../src/utils/priceCalculator.ts';
import type { 
  EVModel, 
  RidingModeType, 
  RiderLoadType, 
  TrafficConditionType, 
  WeatherConditionType, 
  TerrainType 
} from '../src/types/ev.ts';

// -----------------------------------------------------------------------------
// Helper: Feasibility status calculator as defined in RangeSimulatorModal.tsx
// -----------------------------------------------------------------------------
function computeFeasibilityBadge(estimatedRangeKm: number, commuteDistanceKm: number, batteryPercentageForCommute: number, batteryReserveRemainingPercent: number) {
  if (commuteDistanceKm > estimatedRangeKm || batteryPercentageForCommute >= 100) {
    return {
      status: 'exceeds',
      title: 'Exceeds Single-Charge Range'
    };
  }
  if (batteryReserveRemainingPercent < 15) {
    return {
      status: 'caution',
      title: 'Caution - Low Reserve Cushion'
    };
  }
  if (batteryReserveRemainingPercent < 35) {
    return {
      status: 'moderate',
      title: 'Moderate - Charge Daily'
    };
  }
  return {
    status: 'comfortable',
    title: 'Comfortable Range Cushion'
  };
}

// -----------------------------------------------------------------------------
// Helper: Check if vehicle supports Hyper mode (from RangeSimulatorModal.tsx)
// -----------------------------------------------------------------------------
function checkSupportsHyper(model: EVModel): boolean {
  const modes = (model.specs.ridingModes || []).map(m => m.toLowerCase());
  return modes.some(m => 
    m.includes('hyper') || 
    m.includes('warp') || 
    m.includes('ballistic') || 
    m.includes('havoc') || 
    m.includes('rush') ||
    m.includes('track')
  );
}

// =============================================================================
// TEST SUITE 1: All Catalog EV Models Exhaustive Multiplier Permutations & Invariants
// =============================================================================
describe('M3 Challenger 1: Range Simulator Multiplier Permutations & Mathematical Invariants', () => {
  const allModels = getEVModels();
  const evModels = allModels.filter(m => !m.isIceBenchmark);

  it('verifies count of catalog EV models to stress test', () => {
    assert.ok(evModels.length >= 36, `Expected at least 36 EV models, got ${evModels.length}`);
  });

  it('evaluates all parameter combinations across all EV models without errors or NaNs', () => {
    const modes: RidingModeType[] = ['eco', 'city', 'sport', 'hyper'];
    const payloads: RiderLoadType[] = ['solo_light', 'solo', 'heavy', 'pillion', 'heavy_luggage'];
    const traffics: TrafficConditionType[] = ['smooth_flow', 'city_stop_go', 'heavy_stop_go', 'mixed', 'highway'];
    const temperatures: WeatherConditionType[] = ['ideal', 'moderate', 'winter', 'telangana_heat'];
    const terrains: TerrainType[] = ['flat', 'flyovers'];

    let combinationCount = 0;

    for (const model of evModels) {
      for (const mode of modes) {
        for (const payload of payloads) {
          for (const traffic of traffics) {
            for (const temperature of temperatures) {
              for (const terrain of terrains) {
                const res = simulateRange(model, {
                  mode,
                  payload,
                  traffic,
                  temperature,
                  terrain,
                  commuteDistanceKm: 35
                });
                combinationCount++;

                // Invariant 3: Battery consumption Wh/km must be positive and finite
                assert.ok(Number.isFinite(res.batteryConsumptionWhPerKm), `Wh/km must be finite for ${model.id}`);
                assert.ok(res.batteryConsumptionWhPerKm > 0, `Wh/km must be > 0 for ${model.id}`);

                // Invariant 4: Efficiency km/kWh must be positive and finite
                assert.ok(Number.isFinite(res.efficiencyKmPerKwh), `km/kWh must be finite for ${model.id}`);
                assert.ok(res.efficiencyKmPerKwh > 0, `km/kWh must be > 0 for ${model.id}`);

                // Invariant 5: Multiplier factors must match physics definitions
                assert.ok(res.factors.modeMultiplier > 0, 'Mode multiplier must be positive');
                assert.ok(res.factors.payloadMultiplier > 0, 'Payload multiplier must be positive');
                assert.ok(res.factors.trafficMultiplier > 0, 'Traffic multiplier must be positive');
                assert.ok(res.factors.temperatureMultiplier > 0, 'Temperature multiplier must be positive');
                assert.ok(res.factors.terrainMultiplier > 0, 'Terrain multiplier must be positive');
                assert.ok(res.factors.combinedMultiplier > 0, 'Combined multiplier must be positive');

                // Invariant 6: Commute analytics must be valid percentages
                assert.ok(res.batteryPercentageForCommute >= 0 && res.batteryPercentageForCommute <= 100);
                assert.ok(res.batteryReserveRemainingPercent >= 0 && res.batteryReserveRemainingPercent <= 100);
                assert.strictEqual(res.batteryPercentageForCommute + res.batteryReserveRemainingPercent, 100);
              }
            }
          }
        }
      }
    }

    assert.strictEqual(combinationCount, evModels.length * 4 * 5 * 5 * 4 * 2);
  });
});

// =============================================================================
// TEST SUITE 2: Extreme Environmental Stress Conditions & Chemistry Calibration
// =============================================================================
describe('M3 Challenger 1: Extreme Environmental Stress & Battery Thermal Physics', () => {
  const evModels = getEVModels().filter(m => !m.isIceBenchmark);

  it('worst-case extreme stress test: Hyper mode + 170kg Luggage + Highway Drag + Telangana 50°C Heat + Flyovers', () => {
    for (const model of evModels) {
      const isLfp = (model.specs.batteryChemistry || '').toUpperCase().includes('LFP');
      const res = simulateRange(model, {
        mode: 'hyper',
        payload: 'heavy_luggage',
        traffic: 'highway',
        temperature: 'telangana_heat',
        terrain: 'flyovers',
        commuteDistanceKm: 50
      });

      // Expected combined multiplier:
      // Hyper (0.68) * Heavy Luggage (0.76) * Highway (0.80) * Temp (0.88 NMC / 0.94 LFP) * Flyovers (0.90)
      const expectedMode = 0.68;
      const expectedPayload = 0.76;
      const expectedTraffic = 0.80;
      const expectedTemp = isLfp ? 0.94 : 0.88;
      const expectedTerrain = 0.90;
      const expectedCombined = expectedMode * expectedPayload * expectedTraffic * expectedTemp * expectedTerrain;

      assert.strictEqual(res.factors.modeMultiplier, 0.68);
      assert.strictEqual(res.factors.payloadMultiplier, 0.76);
      assert.strictEqual(res.factors.trafficMultiplier, 0.80);
      assert.strictEqual(res.factors.temperatureMultiplier, expectedTemp);
      assert.strictEqual(res.factors.terrainMultiplier, 0.90);
      assert.strictEqual(res.factors.combinedMultiplier, Math.round(expectedCombined * 1000) / 1000);

      const expectedRange = Math.max(10, Math.round(model.specs.realWorldCityRangeKm * expectedCombined));
      assert.strictEqual(res.estimatedRangeKm, expectedRange, `Worst-case range mismatch for ${model.name}`);

      // Under severe stress, range should drop by over 50% compared to claimed ARAI
      assert.ok(res.estimatedRangeKm < model.specs.araiRangeKm * 0.55, `Worst case range should be < 55% ARAI for ${model.name}`);
      // Wh/km consumption should be substantially higher than standard baseline
      assert.ok(res.batteryConsumptionWhPerKm > (model.specs.batteryCapacityKwh * 1000) / model.specs.realWorldCityRangeKm);
    }
  });

  it('best-case hypermiling scenario: Eco mode + 70kg Solo Light + Smooth Suburbs Flow + Ideal 25°C + Flat Plains', () => {
    for (const model of evModels) {
      const res = simulateRange(model, {
        mode: 'eco',
        payload: 'solo_light',
        traffic: 'smooth_flow',
        temperature: 'ideal',
        terrain: 'flat',
        commuteDistanceKm: 35
      });

      // Eco (1.10) * Solo Light (1.05) * Smooth Flow (1.08) * Ideal (1.00) * Flat (1.00) = 1.2474
      const expectedCombined = 1.10 * 1.05 * 1.08 * 1.00 * 1.00; // 1.2474
      assert.strictEqual(res.factors.modeMultiplier, 1.10);
      assert.strictEqual(res.factors.payloadMultiplier, 1.05);
      assert.strictEqual(res.factors.trafficMultiplier, 1.08);
      assert.strictEqual(res.factors.temperatureMultiplier, 1.00);
      assert.strictEqual(res.factors.terrainMultiplier, 1.00);
      assert.strictEqual(res.factors.combinedMultiplier, 1.247);

      const expectedRange = Math.round(model.specs.realWorldCityRangeKm * expectedCombined);
      assert.strictEqual(res.estimatedRangeKm, expectedRange, `Best-case range mismatch for ${model.name}`);
      assert.ok(res.estimatedRangeKm > model.specs.realWorldCityRangeKm, 'Best case must exceed city baseline');
    }
  });

  it('strictly validates battery chemistry thermal penalty: LFP (0.94x) vs NMC (0.88x) in Telangana Summer Heat', () => {
    let lfpCount = 0;
    let nmcCount = 0;

    for (const model of evModels) {
      const chemistry = (model.specs.batteryChemistry || '').toUpperCase();
      const isLfp = chemistry.includes('LFP');

      const simHeat = simulateRange(model, { temperature: 'telangana_heat' });
      const simIdeal = simulateRange(model, { temperature: 'ideal' });

      if (isLfp) {
        lfpCount++;
        assert.strictEqual(simHeat.factors.temperatureMultiplier, 0.94, `LFP model ${model.name} must have 0.94 heat multiplier`);
        // LFP penalty is exactly 6%
        const expectedHeatRange = Math.max(10, Math.round(model.specs.realWorldCityRangeKm * 0.94));
        assert.strictEqual(simHeat.estimatedRangeKm, expectedHeatRange);
      } else {
        nmcCount++;
        assert.strictEqual(simHeat.factors.temperatureMultiplier, 0.88, `NMC model ${model.name} must have 0.88 heat multiplier`);
        // NMC penalty is exactly 12%
        const expectedHeatRange = Math.max(10, Math.round(model.specs.realWorldCityRangeKm * 0.88));
        assert.strictEqual(simHeat.estimatedRangeKm, expectedHeatRange);
      }

      // Heat range must strictly be less than ideal range
      assert.ok(simHeat.estimatedRangeKm < simIdeal.estimatedRangeKm, `Heat range must be less than ideal for ${model.name}`);
    }

    assert.ok(lfpCount >= 3, 'Catalog has verified authentic LFP models');
    assert.ok(nmcCount >= 10, 'Catalog has verified authentic NMC models');
  });
});

// =============================================================================
// TEST SUITE 3: Feasibility Badge State Transitions & Commute Distance Sweep
// =============================================================================
describe('M3 Challenger 1: Feasibility Badge State Transitions & Commute Boundary Sweeps', () => {
  const evModels = getEVModels().filter(m => !m.isIceBenchmark);

  it('verifies deterministic 4-state monotonic transitions across 1 km to 300 km commute sweeps', () => {
    for (const model of evModels) {
      const simBase = simulateRange(model, { mode: 'city', payload: 'solo', traffic: 'city_stop_go' });
      const estimatedRange = simBase.estimatedRangeKm;

      let lastStateRank = 0; // 1: comfortable, 2: moderate, 3: caution, 4: exceeds

      for (let commute = 1; commute <= 300; commute++) {
        const sim = simulateRange(model, {
          mode: 'city',
          payload: 'solo',
          traffic: 'city_stop_go',
          commuteDistanceKm: commute
        });

        const badge = computeFeasibilityBadge(
          sim.estimatedRangeKm,
          commute,
          sim.batteryPercentageForCommute,
          sim.batteryReserveRemainingPercent
        );

        let currentStateRank = 0;
        if (badge.status === 'comfortable') currentStateRank = 1;
        else if (badge.status === 'moderate') currentStateRank = 2;
        else if (badge.status === 'caution') currentStateRank = 3;
        else if (badge.status === 'exceeds') currentStateRank = 4;

        // Monotonic progression: As commute distance increases, state can only advance, never regress
        assert.ok(
          currentStateRank >= lastStateRank,
          `State regressed from rank ${lastStateRank} to ${currentStateRank} at commute ${commute} km for ${model.name}`
        );
        lastStateRank = currentStateRank;

        // Verify boundary invariants:
        if (commute > estimatedRange) {
          assert.strictEqual(badge.status, 'exceeds', `Commute ${commute} km > Range ${estimatedRange} km must be exceeds status`);
        }
        if (commute <= estimatedRange * 0.5) {
          // At <= 50% range, reserve >= 50% > 35% -> MUST be comfortable
          assert.strictEqual(badge.status, 'comfortable', `Commute ${commute} km <= 50% of Range ${estimatedRange} km must be comfortable`);
        }
      }
    }
  });

  it('verifies exact threshold boundaries: 35% reserve (Comfortable vs Moderate) and 15% reserve (Moderate vs Caution)', () => {
    const atherRizta = getEVModelById('ather-rizta-z-37')!;
    assert.ok(atherRizta);

    // City range = 110 km
    // If commute is 71 km -> battery % = round(71/110 * 100) = 65% -> reserve = 35% -> Comfortable
    const sim35 = simulateRange(atherRizta, { commuteDistanceKm: 71 });
    assert.strictEqual(sim35.batteryReserveRemainingPercent, 35);
    const badge35 = computeFeasibilityBadge(sim35.estimatedRangeKm, 71, sim35.batteryPercentageForCommute, sim35.batteryReserveRemainingPercent);
    assert.strictEqual(badge35.status, 'comfortable');

    // If commute is 73 km -> battery % = round(73/110 * 100) = 66% -> reserve = 34% -> Moderate
    const sim34 = simulateRange(atherRizta, { commuteDistanceKm: 73 });
    assert.strictEqual(sim34.batteryReserveRemainingPercent, 34);
    const badge34 = computeFeasibilityBadge(sim34.estimatedRangeKm, 73, sim34.batteryPercentageForCommute, sim34.batteryReserveRemainingPercent);
    assert.strictEqual(badge34.status, 'moderate');

    // If commute is 93 km -> battery % = round(93/110 * 100) = 85% -> reserve = 15% -> Moderate
    const sim15 = simulateRange(atherRizta, { commuteDistanceKm: 93 });
    assert.strictEqual(sim15.batteryReserveRemainingPercent, 15);
    const badge15 = computeFeasibilityBadge(sim15.estimatedRangeKm, 93, sim15.batteryPercentageForCommute, sim15.batteryReserveRemainingPercent);
    assert.strictEqual(badge15.status, 'moderate');

    // If commute is 95 km -> battery % = round(95/110 * 100) = 86% -> reserve = 14% -> Caution
    const sim14 = simulateRange(atherRizta, { commuteDistanceKm: 95 });
    assert.strictEqual(sim14.batteryReserveRemainingPercent, 14);
    const badge14 = computeFeasibilityBadge(sim14.estimatedRangeKm, 95, sim14.batteryPercentageForCommute, sim14.batteryReserveRemainingPercent);
    assert.strictEqual(badge14.status, 'caution');

    // If commute is 111 km -> commute > estimatedRangeKm (110) -> Exceeds
    const simExceed = simulateRange(atherRizta, { commuteDistanceKm: 111 });
    const badgeExceed = computeFeasibilityBadge(simExceed.estimatedRangeKm, 111, simExceed.batteryPercentageForCommute, simExceed.batteryReserveRemainingPercent);
    assert.strictEqual(badgeExceed.status, 'exceeds');
  });

  it('handles degenerate commute distances (0, negative, 1000 km) gracefully', () => {
    const atherRizta = getEVModelById('ather-rizta-z-37')!;

    // 0 km commute
    const simZero = simulateRange(atherRizta, { commuteDistanceKm: 0 });
    assert.ok(simZero.batteryPercentageForCommute >= 0);
    assert.ok(simZero.batteryReserveRemainingPercent <= 100);

    // Negative commute
    const simNeg = simulateRange(atherRizta, { commuteDistanceKm: -50 });
    assert.ok(simNeg.batteryPercentageForCommute >= 0);
    assert.ok(simNeg.batteryReserveRemainingPercent <= 100);

    // Extreme high commute (1000 km)
    const simHigh = simulateRange(atherRizta, { commuteDistanceKm: 1000 });
    assert.strictEqual(simHigh.batteryPercentageForCommute, 100);
    assert.strictEqual(simHigh.batteryReserveRemainingPercent, 0);
    const badgeHigh = computeFeasibilityBadge(simHigh.estimatedRangeKm, 1000, simHigh.batteryPercentageForCommute, simHigh.batteryReserveRemainingPercent);
    assert.strictEqual(badgeHigh.status, 'exceeds');
  });
});

// =============================================================================
// TEST SUITE 4: Hyper/Warp Mode Support Integrity Across All Models
// =============================================================================
describe('M3 Challenger 1: Riding Mode Capability & Hyper/Warp Detection', () => {
  it('identifies hyper/warp capable performance vehicles accurately', () => {
    const performanceModelsWithHyper = [
      'ather-450x-gen3-37',
      'ola-s1-pro-gen2',
      'ultraviolette-f77-mach2',
      'oben-rorr'
    ];

    for (const id of performanceModelsWithHyper) {
      const model = getEVModelById(id);
      if (model) {
        const supports = checkSupportsHyper(model);
        assert.ok(supports, `Model ${model.name} should support Hyper/Warp/Track/Ballistic/Havoc mode`);
      }
    }
  });

  it('identifies family and commuter vehicles without Hyper mode', () => {
    const commuterModelsWithoutHyper = [
      'ather-rizta-z-37',
      'tvs-iqube-s-34',
      'bajaj-chetak-premium',
      'river-indie',
      'ampere-nexus',
      'revolt-rv400',
      'tork-kratos-r'
    ];

    for (const id of commuterModelsWithoutHyper) {
      const model = getEVModelById(id);
      if (model) {
        const supports = checkSupportsHyper(model);
        assert.strictEqual(supports, false, `Commuter model ${model.name} should NOT support Hyper mode`);
      }
    }
  });
});

// =============================================================================
// TEST SUITE 5: Savings ROI & Payback Engine Parameter Boundaries & Sweeps
// =============================================================================
describe('M3 Challenger 1: Savings ROI & Payback Multi-Parameter Stress Testing', () => {
  const evModels = getEVModels().filter(m => !m.isIceBenchmark);

  it('tests daily commute slider sweep (5 km to 120 km) across all EV models', () => {
    const commuteDistances = [5, 10, 20, 35, 50, 75, 100, 120];

    for (const model of evModels) {
      let previousMonthlySavings = 0;

      for (const dailyKm of commuteDistances) {
        const res = calculateSavings(model, {
          dailyKm,
          daysPerMonth: 26,
          petrolPricePerLiter: FINANCIAL_BENCHMARKS.HYDERABAD_PETROL_PRICE_PER_LITER,
          petrolMileageKmpl: FINANCIAL_BENCHMARKS.ACTIVA_6G_MILEAGE_KMPL,
          electricityCostPerKwh: FINANCIAL_BENCHMARKS.TSSPDCL_DOMESTIC_TARIFF_PER_KWH
        });

        assert.strictEqual(res.dailyKm, dailyKm);
        assert.strictEqual(res.monthlyKm, dailyKm * 26);
        assert.strictEqual(res.annualKm, dailyKm * 26 * 12);

        // Monthly savings must be strictly positive for all EV models
        assert.ok(res.monthlySavings > 0, `Monthly savings must be > 0 for ${model.name} at ${dailyKm} km/day`);
        // Monotonicity: Higher daily commute must yield higher monthly savings
        assert.ok(res.monthlySavings > previousMonthlySavings, `Savings did not increase with dailyKm for ${model.name}`);
        previousMonthlySavings = res.monthlySavings;

        // Payback period should decrease or stay very short as daily commute increases
        assert.ok(res.paybackPeriodMonths >= 0);
        assert.ok(Number.isFinite(res.paybackPeriodMonths));
      }
    }
  });

  it('tests petrol price variation (₹70 to ₹160/L) and verifies economic elasticity', () => {
    const petrolPrices = [70, 90, 100, 109.66, 120, 140, 160];
    const atherRizta = getEVModelById('ather-rizta-z-37')!;

    let lastPetrolCostPerKm = 0;
    let lastMonthlySavings = 0;
    let lastPaybackMonths = 999;

    for (const price of petrolPrices) {
      const res = calculateSavings(atherRizta, {
        dailyKm: 35,
        daysPerMonth: 26,
        petrolPricePerLiter: price,
        petrolMileageKmpl: 45.0,
        electricityCostPerKwh: 7.50
      });

      // Petrol running cost must increase linearly with price
      assert.ok(res.petrolFuelCostPerKm > lastPetrolCostPerKm);
      lastPetrolCostPerKm = res.petrolFuelCostPerKm;

      // Net monthly savings must increase
      assert.ok(res.monthlySavings > lastMonthlySavings);
      lastMonthlySavings = res.monthlySavings;

      // Payback period must shorten
      assert.ok(res.paybackPeriodMonths <= lastPaybackMonths);
      lastPaybackMonths = res.paybackPeriodMonths;
    }
  });

  it('tests TSSPDCL domestic power tariff variations (₹4.00 to ₹15.00/kWh)', () => {
    const tariffs = [4.00, 5.50, 7.20, 7.50, 8.50, 10.00, 12.00, 15.00];
    const tvsIqube = getEVModelById('tvs-iqube-s-34')!;

    let lastEvCostPerKm = 0;

    for (const tariff of tariffs) {
      const res = calculateSavings(tvsIqube, {
        dailyKm: 35,
        daysPerMonth: 26,
        petrolPricePerLiter: 109.66,
        petrolMileageKmpl: 45.0,
        electricityCostPerKwh: tariff
      });

      // EV power cost per km must increase with higher electricity rate
      assert.ok(res.evPowerCostPerKm >= lastEvCostPerKm);
      lastEvCostPerKm = res.evPowerCostPerKm;

      // Even at highest commercial tariff ₹15/kWh, EV running cost must be significantly cheaper than petrol
      assert.ok(
        res.evTotalCostPerKm < res.petrolTotalCostPerKm * 0.5,
        `EV total cost (₹${res.evTotalCostPerKm}) should be < 50% petrol cost (₹${res.petrolTotalCostPerKm}) even at ₹15/kWh`
      );
      assert.ok(res.monthlySavings > 1000, `Monthly savings should exceed ₹1000 even at ₹15/kWh`);
    }
  });

  it('tests days per month slider variation (15 to 31 days)', () => {
    const daysList = [15, 20, 22, 26, 30, 31];
    const olaS1 = getEVModelById('ola-s1-pro-gen2')!;

    let lastMonthlySavings = 0;

    for (const days of daysList) {
      const res = calculateSavings(olaS1, {
        dailyKm: 40,
        daysPerMonth: days
      });

      assert.strictEqual(res.daysPerMonth, days);
      assert.strictEqual(res.monthlyKm, 40 * days);
      assert.ok(res.monthlySavings > lastMonthlySavings);
      lastMonthlySavings = res.monthlySavings;
    }
  });
});

// =============================================================================
// TEST SUITE 6: 5-Year TCO Lifecycle Math Stress Testing Against Activa 6G
// =============================================================================
describe('M3 Challenger 1: 5-Year TCO Lifecycle Mathematical Verification', () => {
  const evModels = getEVModels().filter(m => !m.isIceBenchmark);

  it('empirically verifies 5-Year TCO breakdown formula components for Honda Activa 6G benchmark', () => {
    const tco = calculate5YearTCO({
      evOnRoadPrice: 140000,
      evWhPerKm: 30,
      electricityRate: 7.50,
      petrolPrice: 109.66,
      petrolMileage: 45.0,
      fiveYearKm: 50000
    });

    // Activa 6G standard constants
    assert.strictEqual(tco.petrolInitialOnRoad, 100616);
    // Fuel cost for 50,000 km @ (109.66 / 45) = 2.43688 -> 50000 * 2.43688 = 121,844.4 -> 121,844
    const expectedFuelCost = Math.round(50000 * (109.66 / 45.0));
    assert.strictEqual(tco.petrolFuelCostTotal, expectedFuelCost);
    assert.strictEqual(tco.petrolFuelCostTotal, 121844);

    // Maintenance for 50,000 km @ 0.429 = 21,450
    assert.strictEqual(tco.petrolMaintenanceTotal, 21450);
    // Insurance renewals = 4200
    assert.strictEqual(tco.petrolInsuranceRenewals, 4200);

    // Gross TCO = 100616 + 121844 + 21450 + 4200 = 248,110
    const expectedGrossPetrol = 100616 + 121844 + 21450 + 4200;
    assert.strictEqual(tco.petrolGrossTCO, expectedGrossPetrol);
    assert.strictEqual(tco.petrolGrossTCO, 248110);

    // Residual resale value = 35% of 82,684 = 28,939 (Math.round(28939.4))
    assert.strictEqual(tco.petrolResidualResaleValue, 28939);

    // Net TCO = 248110 - 28939 = 219,171
    assert.strictEqual(tco.petrolNetTCO, 219171);
  });

  it('empirically verifies 5-Year TCO calculations for all EV models', () => {
    for (const model of evModels) {
      const priceBreakdown = calculateTelanganaOnRoadPrice(model);
      const evOnRoad = priceBreakdown.totalTelanganaOnRoadPrice;

      const savings = calculateSavings(model, {
        dailyKm: 35,
        daysPerMonth: 26,
        evOnRoadPrice: evOnRoad
      });

      const tco = savings.tco;
      assert.ok(tco, `TCO breakdown missing for ${model.name}`);

      // EV Gross TCO = evOnRoad + evElectricity + evMaintenance + evInsurance
      const expectedEvGross = tco.evInitialOnRoad + tco.evElectricityCostTotal + tco.evMaintenanceTotal + tco.evInsuranceRenewals;
      assert.strictEqual(tco.evGrossTCO, expectedEvGross, `EV gross TCO mismatch for ${model.name}`);

      // EV Residual = round(0.28 * evOnRoadPrice)
      const expectedResidual = Math.round(0.28 * evOnRoad);
      assert.strictEqual(tco.evResidualResaleValue, expectedResidual, `EV residual mismatch for ${model.name}`);

      // EV Net TCO = evGross - evResidual
      assert.strictEqual(tco.evNetTCO, tco.evGrossTCO - tco.evResidualResaleValue);

      // Net 5-year savings = petrolNetTCO - evNetTCO
      assert.strictEqual(tco.netTCOSavings, tco.petrolNetTCO - tco.evNetTCO);

      // TCO savings must be finite
      assert.ok(Number.isFinite(tco.netTCOSavings));

      // For commuter EVs (< ₹2.4L), 5-year TCO savings are positive against Activa 6G
      const isHighEndSuperbike = model.pricing.exShowroom >= 240000;
      if (!isHighEndSuperbike) {
        assert.ok(tco.netTCOSavings > 0, `Expected positive 5-year TCO savings for ${model.name}, got ${tco.netTCOSavings}`);
      } else {
        // High-end superbikes (> ₹2.3L) reflect performance premium over 110cc commuter
        assert.ok(Number.isFinite(tco.netTCOSavings));
      }
    }
  });

  it('tests 5-Year TCO with custom lifecycle distances (25,000 km to 100,000 km)', () => {
    const distances = [25000, 50000, 75000, 100000];
    const heroVida = getEVModelById('hero-vida-v1-pro')!;
    const evOnRoad = calculateTelanganaOnRoadPrice(heroVida).totalTelanganaOnRoadPrice;

    for (const dist of distances) {
      const tco = calculate5YearTCO({
        evOnRoadPrice: evOnRoad,
        evWhPerKm: 35,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: dist
      });

      assert.strictEqual(tco.totalKm, dist);
      assert.strictEqual(tco.petrolMaintenanceTotal, Math.round(dist * 0.429));
      assert.strictEqual(tco.evMaintenanceTotal, Math.round(dist * 0.117));
      assert.ok(tco.netTCOSavings > 0);
    }
  });
});

// =============================================================================
// TEST SUITE 7: Breakeven Payback Period Math & Boundary Conditions
// =============================================================================
describe('M3 Challenger 1: Payback Period Math & Degenerate Boundaries', () => {
  it('handles EV cheaper than Activa 6G upfront (upfront difference <= 0)', () => {
    const payback = calculatePaybackPeriod(-5000, 2500);
    assert.strictEqual(payback.months, 0);
    assert.strictEqual(payback.years, 0);
    assert.strictEqual(payback.formatted, 'Immediate (Cheaper Upfront)');

    const paybackZero = calculatePaybackPeriod(0, 2500);
    assert.strictEqual(paybackZero.months, 0);
    assert.strictEqual(paybackZero.years, 0);
    assert.strictEqual(paybackZero.formatted, 'Immediate (Cheaper Upfront)');
  });

  it('handles negative or zero monthly savings (no payback)', () => {
    const paybackZeroSavings = calculatePaybackPeriod(30000, 0);
    assert.strictEqual(paybackZeroSavings.months, 999);
    assert.strictEqual(paybackZeroSavings.formatted, 'No Payback');

    const paybackNegSavings = calculatePaybackPeriod(30000, -500);
    assert.strictEqual(paybackNegSavings.months, 999);
    assert.strictEqual(paybackNegSavings.formatted, 'No Payback');
  });

  it('formats payback durations under 12 months correctly ("X Months")', () => {
    // 20,000 upfront / 2,500 monthly = 8.0 months
    const payback8 = calculatePaybackPeriod(20000, 2500);
    assert.strictEqual(payback8.months, 8.0);
    assert.strictEqual(payback8.formatted, '8 Months');

    // 15,000 upfront / 2,200 monthly = 6.818 -> 6.8 months
    const payback68 = calculatePaybackPeriod(15000, 2200);
    assert.strictEqual(payback68.months, 6.8);
    assert.strictEqual(payback68.formatted, '6.8 Months');
  });

  it('formats payback durations over 12 months correctly ("X Yr Y Mo" or "X Years")', () => {
    // 36,000 upfront / 2,000 monthly = 18.0 months -> 1 Yr 6 Mo
    const payback18 = calculatePaybackPeriod(36000, 2000);
    assert.strictEqual(payback18.months, 18.0);
    assert.strictEqual(payback18.formatted, '1 Yr 6 Mo');

    // 48,000 upfront / 2,000 monthly = 24.0 months -> 2 Years
    const payback24 = calculatePaybackPeriod(48000, 2000);
    assert.strictEqual(payback24.months, 24.0);
    assert.strictEqual(payback24.formatted, '2 Years');
  });
});

// =============================================================================
// TEST SUITE 8: Environmental Carbon Offset & Tree Offset Scaling
// =============================================================================
describe('M3 Challenger 1: Environmental Carbon Offset Verification', () => {
  it('calculates carbon offset and equivalent teak trees accurately across distance scales', () => {
    const monthlyDistances = [500, 910, 1500, 3000];

    for (const monthlyKm of monthlyDistances) {
      const offset = calculateCarbonOffset(monthlyKm);

      assert.strictEqual(offset.petrolCo2GramsPerKm, 51.3);
      assert.strictEqual(offset.evCo2GramsPerKm, 24.54);
      assert.strictEqual(offset.netCo2ReductionGramsPerKm, 26.76);

      const expectedMonthlyKg = Math.round((monthlyKm * 26.76) / 1000);
      const expectedAnnualKg = Math.round((monthlyKm * 12 * 26.76) / 1000);
      const expected5YrKg = Math.round((monthlyKm * 60 * 26.76) / 1000);
      const expectedTrees = Math.max(1, Math.round(expected5YrKg / 22.0));

      assert.strictEqual(offset.monthlyCo2SavedKg, expectedMonthlyKg);
      assert.strictEqual(offset.annualCo2SavedKg, expectedAnnualKg);
      assert.strictEqual(offset.fiveYearCo2SavedKg, expected5YrKg);
      assert.strictEqual(offset.equivalentTeakTrees, expectedTrees);
    }
  });
});
