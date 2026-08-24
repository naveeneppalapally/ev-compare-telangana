import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getEVModels,
  getAllVehiclesIncludingBenchmark,
  getEVModelById,
  ICE_BENCHMARK_MODEL
} from '../src/data/evModels.ts';

import {
  getAllRtos,
  getRtoByCode
} from '../src/data/telanganaRtoData.ts';

import {
  calculateTelanganaOnRoadPrice,
  calculate5YearInsurance,
  calculatePmEdriveSubsidy,
  calculateRoadTaxSavings,
  formatINR,
  formatLakhs
} from '../src/utils/priceCalculator.ts';

import {
  simulateRange,
  simulateRealWorldRange
} from '../src/utils/rangeSimulator.ts';

import {
  calculateSavings,
  calculate5YearTCO,
  calculatePaybackPeriod,
  calculateCarbonOffset,
  FINANCIAL_BENCHMARKS
} from '../src/utils/savingsCalculator.ts';

import {
  calculateRecommendations
} from '../src/utils/recommendationEngine.ts';

import type {
  EVModel,
  WizardAnswers,
  RidingModeType,
  RiderLoadType,
  TrafficConditionType,
  WeatherConditionType,
  TerrainType
} from '../src/types/ev.ts';

describe('PREVIEW CHALLENGER 2: Comprehensive Empirical Mathematical & Algorithmic Verification Suite', () => {
  const evModels = getEVModels();
  const allRtos = getAllRtos();
  const allVehiclesWithBenchmark = getAllVehiclesIncludingBenchmark();

  // =========================================================================
  // 1. MULTIPLICATIVE RANGE PHYSICS MODEL ACROSS EXTREME COMBINATIONS
  // =========================================================================
  describe('1. Range Physics Multiplicative Model & Chemistry Thermal Degradation', () => {
    it('verifies catalog size and composition (40 EV models)', () => {
      assert.strictEqual(evModels.length, 40, 'Should have exactly 40 authentic EV models');
    });

    it('empirically verifies the extreme worst-case physics scenario across all 40 EV models', () => {
      // Extreme conditions: Hyper mode + 170kg payload (heavy_luggage) + 50°C summer heat + highway aerodynamic drag + flyovers/hills
      let count = 0;
      for (const model of evModels) {
        count++;
        const isLfp = (model.specs.batteryChemistry || '').toUpperCase().includes('LFP');
        const expectedTempMultiplier = isLfp ? 0.94 : 0.88;

        const res = simulateRange(model, {
          mode: 'hyper',
          payload: 'heavy_luggage',
          traffic: 'highway',
          temperature: 'telangana_heat',
          terrain: 'flyovers',
          commuteDistanceKm: 45
        });

        // 1. Verify individual factor multipliers
        assert.strictEqual(res.factors.modeMultiplier, 0.68, `Mode multiplier mismatch for ${model.id}`);
        assert.strictEqual(res.factors.payloadMultiplier, 0.76, `Payload multiplier mismatch for ${model.id}`);
        assert.strictEqual(res.factors.trafficMultiplier, 0.80, `Traffic multiplier mismatch for ${model.id}`);
        assert.strictEqual(res.factors.temperatureMultiplier, expectedTempMultiplier, `Temp multiplier mismatch for ${model.id}`);
        assert.strictEqual(res.factors.terrainMultiplier, 0.90, `Terrain multiplier mismatch for ${model.id}`);

        // 2. Verify combined multiplier: 0.68 * 0.76 * 0.80 * temp * 0.90
        const rawCombined = 0.68 * 0.76 * 0.80 * expectedTempMultiplier * 0.90;
        const expectedCombinedRounded = Math.round(rawCombined * 1000) / 1000;
        assert.strictEqual(res.factors.combinedMultiplier, expectedCombinedRounded, `Combined multiplier mismatch for ${model.id}`);

        // 3. Verify estimated range: max(10, round(baseRange * combinedMultiplier))
        const baseRange = model.specs.realWorldCityRangeKm || Math.round(model.specs.araiRangeKm * 0.70) || 100;
        const expectedRange = Math.max(10, Math.round(baseRange * rawCombined));
        assert.strictEqual(res.estimatedRangeKm, expectedRange, `Estimated range mismatch for ${model.id}`);

        // 4. Verify min range clamp >= 10 km
        assert.ok(res.estimatedRangeKm >= 10, `Estimated range below 10 km for ${model.id}`);

        // 5. Verify battery consumption Wh/km = round((batteryKwh * 1000) / estimatedRangeKm)
        const batteryKwh = model.specs.batteryCapacityKwh || 3.0;
        const expectedWhPerKm = Math.round((batteryKwh * 1000) / Math.max(1, expectedRange));
        assert.strictEqual(res.batteryConsumptionWhPerKm, expectedWhPerKm, `Wh/km mismatch for ${model.id}`);

        // 6. Efficiency km/kWh = round((estimatedRangeKm / batteryKwh) * 10) / 10
        const expectedEfficiency = Math.round((expectedRange / batteryKwh) * 10) / 10;
        assert.strictEqual(res.efficiencyKmPerKwh, expectedEfficiency, `Efficiency km/kWh mismatch for ${model.id}`);
      }

      assert.strictEqual(count, 40, 'Must verify all 40 EV models under extreme worst-case');
    });

    it('empirically verifies LFP (-6%) vs NMC (-12%) thermal degradation difference under 50°C summer heat', () => {
      const lfpModels = evModels.filter(m => (m.specs.batteryChemistry || '').toUpperCase().includes('LFP'));
      const nmcModels = evModels.filter(m => (m.specs.batteryChemistry || '').toUpperCase().includes('NMC'));

      assert.ok(lfpModels.length >= 3, `Expected at least 3 LFP models, got ${lfpModels.length}`);
      assert.ok(nmcModels.length >= 10, `Expected at least 10 NMC models, got ${nmcModels.length}`);

      // Check LFP models
      for (const lfp of lfpModels) {
        const simIdeal = simulateRange(lfp, { temperature: 'ideal' });
        const simHeat = simulateRange(lfp, { temperature: 'telangana_heat' });

        assert.strictEqual(simIdeal.factors.temperatureMultiplier, 1.00);
        assert.strictEqual(simHeat.factors.temperatureMultiplier, 0.94, `LFP model ${lfp.name} must have 0.94 temp multiplier (-6% penalty)`);
        
        // Exact 6% drop
        const base = lfp.specs.realWorldCityRangeKm;
        const expectedHeatRange = Math.max(10, Math.round(base * 0.94));
        assert.strictEqual(simHeat.estimatedRangeKm, expectedHeatRange);
      }

      // Check NMC models
      for (const nmc of nmcModels) {
        const simIdeal = simulateRange(nmc, { temperature: 'ideal' });
        const simHeat = simulateRange(nmc, { temperature: 'telangana_heat' });

        assert.strictEqual(simIdeal.factors.temperatureMultiplier, 1.00);
        assert.strictEqual(simHeat.factors.temperatureMultiplier, 0.88, `NMC model ${nmc.name} must have 0.88 temp multiplier (-12% penalty)`);

        // Exact 12% drop
        const base = nmc.specs.realWorldCityRangeKm;
        const expectedHeatRange = Math.max(10, Math.round(base * 0.88));
        assert.strictEqual(simHeat.estimatedRangeKm, expectedHeatRange);
      }

      // Direct Head-to-Head Comparison: LFP retains 6 percentage points more range than NMC
      const sampleLfp = lfpModels[0];
      const sampleNmc = nmcModels[0];
      const simLfp = simulateRange(sampleLfp, { temperature: 'telangana_heat' });
      const simNmc = simulateRange(sampleNmc, { temperature: 'telangana_heat' });
      const diff = Math.round((simLfp.factors.temperatureMultiplier - simNmc.factors.temperatureMultiplier) * 100) / 100;
      assert.strictEqual(diff, 0.06);
    });

    it('empirically verifies best-case hypermiling physics scenario across all 40 EV models', () => {
      for (const model of evModels) {
        const res = simulateRange(model, {
          mode: 'eco',
          payload: 'solo_light',
          traffic: 'smooth_flow',
          temperature: 'ideal',
          terrain: 'flat'
        });

        // Combined: 1.10 * 1.05 * 1.08 * 1.00 * 1.00 = 1.2474
        const expectedCombined = 1.10 * 1.05 * 1.08 * 1.00 * 1.00;
        assert.strictEqual(res.factors.modeMultiplier, 1.10);
        assert.strictEqual(res.factors.payloadMultiplier, 1.05);
        assert.strictEqual(res.factors.trafficMultiplier, 1.08);
        assert.strictEqual(res.factors.temperatureMultiplier, 1.00);
        assert.strictEqual(res.factors.terrainMultiplier, 1.00);
        assert.strictEqual(res.factors.combinedMultiplier, 1.247);

        const baseRange = model.specs.realWorldCityRangeKm;
        const expectedRange = Math.round(baseRange * expectedCombined);
        assert.strictEqual(res.estimatedRangeKm, expectedRange);
        assert.ok(res.estimatedRangeKm > baseRange, 'Hypermiling must produce higher range than city baseline');
      }
    });
  });

  // =========================================================================
  // 2. FEASIBILITY STATUS TRANSITIONS ACROSS COMMUTE DISTANCE SWEEPS (10 TO 150 KM)
  // =========================================================================
  describe('2. Feasibility Status Transitions Across Commute Distance Sweeps (10 to 150 km)', () => {
    function computeFeasibilityBadge(estimatedRangeKm: number, commuteDistanceKm: number, batteryPercentageForCommute: number, batteryReserveRemainingPercent: number) {
      if (commuteDistanceKm > estimatedRangeKm || batteryPercentageForCommute >= 100) {
        return 'exceeds';
      }
      if (batteryReserveRemainingPercent < 15) {
        return 'caution';
      }
      if (batteryReserveRemainingPercent < 35) {
        return 'moderate';
      }
      return 'comfortable';
    }

    it('empirically sweeps commute distances from 10 to 150 km in 1 km steps for all 40 EV models', () => {
      let totalEvaluations = 0;

      for (const model of evModels) {
        const baseSim = simulateRange(model, { mode: 'city', payload: 'solo', traffic: 'city_stop_go' });
        const estimatedRange = baseSim.estimatedRangeKm;

        let previousStateRank = 1; // 1: comfortable, 2: moderate, 3: caution, 4: exceeds

        for (let commute = 10; commute <= 150; commute++) {
          totalEvaluations++;
          const sim = simulateRange(model, {
            mode: 'city',
            payload: 'solo',
            traffic: 'city_stop_go',
            commuteDistanceKm: commute
          });

          // Verify percentage math
          const expectedBatteryPct = Math.min(100, Math.round((commute / estimatedRange) * 100));
          const expectedReserve = Math.max(0, 100 - expectedBatteryPct);
          assert.strictEqual(sim.batteryPercentageForCommute, expectedBatteryPct);
          assert.strictEqual(sim.batteryReserveRemainingPercent, expectedReserve);
          assert.strictEqual(sim.batteryPercentageForCommute + sim.batteryReserveRemainingPercent, 100);

          // Verify rechargeFeasibilityStatus in rangeSimulator
          if (expectedReserve < 15) {
            assert.strictEqual(sim.rechargeFeasibilityStatus, 'critical');
          } else if (expectedReserve < 35) {
            assert.strictEqual(sim.rechargeFeasibilityStatus, 'moderate');
          } else {
            assert.strictEqual(sim.rechargeFeasibilityStatus, 'safe');
          }

          // Verify 4-state UI badge
          const badgeStatus = computeFeasibilityBadge(
            sim.estimatedRangeKm,
            commute,
            sim.batteryPercentageForCommute,
            sim.batteryReserveRemainingPercent
          );

          let currentRank = 1;
          if (badgeStatus === 'comfortable') currentRank = 1;
          else if (badgeStatus === 'moderate') currentRank = 2;
          else if (badgeStatus === 'caution') currentRank = 3;
          else if (badgeStatus === 'exceeds') currentRank = 4;

          // Monotonicity: Rank can never decrease as commute increases
          assert.ok(
            currentRank >= previousStateRank,
            `State regressed from ${previousStateRank} to ${currentRank} at commute ${commute} km for ${model.name}`
          );
          previousStateRank = currentRank;

          // Boundary assertions
          if (commute >= estimatedRange || expectedBatteryPct >= 100) {
            assert.strictEqual(badgeStatus, 'exceeds', `Commute ${commute} km >= Range ${estimatedRange} km must be exceeds`);
          } else if (expectedReserve < 15) {
            assert.strictEqual(badgeStatus, 'caution');
          } else if (expectedReserve < 35) {
            assert.strictEqual(badgeStatus, 'moderate');
          } else {
            assert.strictEqual(badgeStatus, 'comfortable');
          }
        }
      }

      assert.strictEqual(totalEvaluations, 40 * (150 - 10 + 1), 'Must evaluate exactly 5,640 commute distance sweep iterations');
    });
  });

  // =========================================================================
  // 3. ON-ROAD PRICING CALCULATIONS ACROSS ALL 40 EV MODELS AND 38 RTOS (1,520 COMBINATIONS)
  // =========================================================================
  describe('3. Telangana On-Road Pricing Calculations (1,520 Combinations)', () => {
    it('verifies exactly 38 official Telangana RTO districts exist (TG-01 through TG-38)', () => {
      assert.strictEqual(allRtos.length, 38);
      for (let i = 1; i <= 38; i++) {
        const code = `TG-${String(i).padStart(2, '0')}`;
        const rto = getRtoByCode(code);
        assert.ok(rto, `RTO ${code} must exist in telanganaRtoData`);
        assert.strictEqual(rto.rtoCode, code);
        assert.ok(rto.districtName.length > 0);
      }
    });

    it('empirically evaluates all 1,520 combinations (40 models * 38 RTOs) under G.O. Ms No. 41', () => {
      let combinationCount = 0;

      for (const model of evModels) {
        for (const rto of allRtos) {
          combinationCount++;
          const pricing = calculateTelanganaOnRoadPrice(model, rto.rtoCode);

          // 1. 100% Road Tax Waiver under G.O. Ms No. 41
          assert.strictEqual(pricing.stateRoadTaxPayable, 0, `EV ${model.name} in ${rto.rtoCode} must have 0 road tax`);
          assert.strictEqual(pricing.stateRoadTax, 0);
          assert.strictEqual(pricing.stateRoadTaxRate, 0);

          // 2. 100% Registration Fee Waiver under G.O. Ms No. 41
          assert.strictEqual(pricing.registrationFeePayable, 0, `EV ${model.name} in ${rto.rtoCode} must have 0 reg fee`);
          assert.strictEqual(pricing.registrationAndSmartCardFee, 0);

          // 3. Benchmark ICE statutory savings computed correctly
          const expectedTaxSavings = Math.round(model.pricing.exShowroom * 0.12);
          assert.strictEqual(pricing.stateRoadTaxSavings, expectedTaxSavings);
          assert.strictEqual(pricing.stateRoadTaxStandardPetrol, expectedTaxSavings);
          assert.strictEqual(pricing.registrationFeeSavings, 785);
          assert.strictEqual(pricing.savingsFromTelanganaPolicy, expectedTaxSavings + 785);

          // 4. Central PM E-DRIVE Subsidy
          const expectedSubsidy = model.pricing.pmEdriveSubsidy !== undefined
            ? model.pricing.pmEdriveSubsidy
            : calculatePmEdriveSubsidy(model.specs.batteryCapacityKwh, model.pricing.exShowroom);
          assert.strictEqual(pricing.pmEdriveSubsidy, expectedSubsidy);

          // 5. Total Upfront Savings = Telangana Policy (Tax + Reg) + PM E-DRIVE Subsidy
          assert.strictEqual(pricing.totalUpfrontSavings, expectedTaxSavings + 785 + expectedSubsidy);

          // 6. Net Ex-showroom = Ex-showroom - Subsidy - CustomDiscount
          const netExShowroom = Math.max(0, model.pricing.exShowroom - expectedSubsidy);
          assert.strictEqual(pricing.netExShowroom, netExShowroom);
          assert.strictEqual(pricing.netVehiclePrice, netExShowroom);

          // 7. 5-Year IRDAI Insurance validation
          const insuranceBreakdown = calculate5YearInsurance(model.pricing.exShowroom, model.specs.motorRatedPowerKw || model.specs.motorPeakPowerKw || 4.0);
          const expectedInsurance = model.pricing.insuranceEst || insuranceBreakdown.totalInsurance;
          assert.strictEqual(pricing.totalInsurance5Yr, expectedInsurance);

          // 8. Total Telangana On-Road Price summation
          const handling = model.pricing.handlingAndDocsEst || 1500;
          const charger = !model.pricing.chargerIncluded ? (model.pricing.chargerCost || 0) : 0;
          const expectedOnRoad = netExShowroom + 0 + 0 + 400 + expectedInsurance + handling + charger;
          assert.strictEqual(pricing.totalTelanganaOnRoadPrice, expectedOnRoad, `On-road price mismatch for ${model.name} in ${rto.rtoCode}`);
          assert.strictEqual(pricing.netTelanganaOnRoadPrice, expectedOnRoad);

          // 9. District Name & RTO Code resolution
          assert.strictEqual(pricing.rtoCode, rto.rtoCode);
          assert.strictEqual(pricing.districtName, `${rto.districtName} (${rto.rtoCode})`);

          // 10. Finite and positive numbers
          assert.ok(pricing.totalTelanganaOnRoadPrice > 0);
          assert.ok(Number.isFinite(pricing.totalTelanganaOnRoadPrice));
          assert.ok(!Number.isNaN(pricing.totalTelanganaOnRoadPrice));
        }
      }

      assert.strictEqual(combinationCount, 1520, 'Must execute exactly 1,520 on-road pricing evaluations');
    });

    it('verifies Honda Activa 6G ICE benchmark correctly pays full 12% Road Tax and ₹785 Registration Fee', () => {
      const activa = ICE_BENCHMARK_MODEL;
      assert.ok(activa, 'Activa 6G benchmark model must exist');

      for (const rto of allRtos) {
        const pricing = calculateTelanganaOnRoadPrice(activa, rto.rtoCode);
        const expectedTax = Math.round(activa.pricing.exShowroom * 0.12);

        assert.strictEqual(pricing.stateRoadTaxPayable, expectedTax, 'Activa 6G must pay 12% road tax');
        assert.strictEqual(pricing.registrationFeePayable, 785, 'Activa 6G must pay ₹785 registration fee');
        assert.strictEqual(pricing.pmEdriveSubsidy, 0, 'Activa 6G receives ₹0 PM E-DRIVE subsidy');
        assert.strictEqual(pricing.savingsFromTelanganaPolicy, 0, 'Activa 6G has ₹0 policy savings');
        assert.strictEqual(pricing.totalUpfrontSavings, 0, 'Activa 6G has ₹0 total savings');
        assert.strictEqual(pricing.stateRoadTaxRate, 12);
      }
    });

    it('verifies formatINR and formatLakhs precision and formatting', () => {
      assert.strictEqual(formatINR(143260), '₹1,43,260');
      assert.strictEqual(formatINR(82684), '₹82,684');
      assert.strictEqual(formatLakhs(143260), '₹1.43 Lakh');
      assert.strictEqual(formatLakhs(99000), '₹99,000');
      assert.strictEqual(formatLakhs(250000), '₹2.50 Lakh');
    });
  });

  // =========================================================================
  // 4. 5-YEAR TCO LIFECYCLE EQUATIONS VS HONDA ACTIVA 6G
  // =========================================================================
  describe('4. 5-Year TCO Lifecycle Math vs Honda Activa 6G & Carbon Offsets', () => {
    it('empirically verifies Honda Activa 6G 5-year TCO benchmark balance sheet', () => {
      const tco = calculate5YearTCO({
        evOnRoadPrice: 143260,
        evWhPerKm: 30,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 50000
      });

      // 1. Initial on-road: ₹100,616
      assert.strictEqual(tco.petrolInitialOnRoad, FINANCIAL_BENCHMARKS.ACTIVA_6G_ON_ROAD_TELANGANA);
      assert.strictEqual(tco.petrolInitialOnRoad, 100616);

      // 2. Fuel cost: 50,000 km * (109.66 / 45) = 121,844.4 -> ₹121,844
      const expectedFuelCost = Math.round(50000 * (109.66 / 45.0));
      assert.strictEqual(tco.petrolFuelCostTotal, expectedFuelCost);
      assert.strictEqual(tco.petrolFuelCostTotal, 121844);

      // 3. Maintenance: 50,000 km * 0.429 = ₹21,450
      assert.strictEqual(tco.petrolMaintenanceTotal, 21450);

      // 4. Insurance renewals: ₹4,200
      assert.strictEqual(tco.petrolInsuranceRenewals, 4200);

      // 5. Gross TCO = 100616 + 121844 + 21450 + 4200 = ₹248,110
      assert.strictEqual(tco.petrolGrossTCO, 248110);

      // 6. Resale residual value = 35% of ex-showroom (82684) = ₹28,939
      const expectedPetrolResale = Math.round(0.35 * FINANCIAL_BENCHMARKS.ACTIVA_6G_EX_SHOWROOM);
      assert.strictEqual(tco.petrolResidualResaleValue, expectedPetrolResale);
      assert.strictEqual(tco.petrolResidualResaleValue, 28939);

      // 7. Net TCO = Gross - Resale = 248110 - 28939 = ₹219,171
      assert.strictEqual(tco.petrolNetTCO, 219171);
    });

    it('empirically verifies EV 5-year TCO equations across all 40 EV models', () => {
      for (const model of evModels) {
        const pricing = calculateTelanganaOnRoadPrice(model);
        const savings = calculateSavings(model, {
          dailyKm: 35,
          daysPerMonth: 26
        });

        const tco = savings.tco;
        assert.ok(tco, `TCO missing for ${model.name}`);

        // 1. Grid kWh/km = (Wh/km / 1000) / 0.88
        const gridKwhPerKm = (savings.evWhPerKm / 1000) / 0.88;
        const expectedElectricityCost = Math.round(tco.totalKm * gridKwhPerKm * 7.50);
        assert.strictEqual(tco.evElectricityCostTotal, expectedElectricityCost);

        // 2. EV Maintenance = totalKm * 0.117
        const expectedEvMaintenance = Math.round(tco.totalKm * 0.117);
        assert.strictEqual(tco.evMaintenanceTotal, expectedEvMaintenance);

        // 3. EV Insurance renewals = 4800
        assert.strictEqual(tco.evInsuranceRenewals, 4800);

        // 4. EV Gross TCO = OnRoad + Electricity + Maintenance + Insurance
        const expectedEvGross = tco.evInitialOnRoad + expectedElectricityCost + expectedEvMaintenance + 4800;
        assert.strictEqual(tco.evGrossTCO, expectedEvGross);

        // 5. EV Resale Residual = round(0.28 * evOnRoadPrice)
        const expectedEvResale = Math.round(0.28 * tco.evInitialOnRoad);
        assert.strictEqual(tco.evResidualResaleValue, expectedEvResale);

        // 6. EV Net TCO = Gross - Resale
        assert.strictEqual(tco.evNetTCO, expectedEvGross - expectedEvResale);

        // 7. Net 5-year TCO Savings = Petrol Net TCO - EV Net TCO
        assert.strictEqual(tco.netTCOSavings, tco.petrolNetTCO - tco.evNetTCO);
        assert.strictEqual(savings.fiveYearNetTcoSavings, tco.netTCOSavings);
      }
    });

    it('empirically verifies payback period calculations and formatting rules', () => {
      // Rule 1: Cheaper upfront (upfront diff <= 0)
      const immediate1 = calculatePaybackPeriod(-10000, 2000);
      assert.strictEqual(immediate1.months, 0);
      assert.strictEqual(immediate1.years, 0);
      assert.strictEqual(immediate1.formatted, 'Immediate (Cheaper Upfront)');

      const immediate2 = calculatePaybackPeriod(0, 2500);
      assert.strictEqual(immediate2.formatted, 'Immediate (Cheaper Upfront)');

      // Rule 2: Zero or negative monthly savings
      const noPayback1 = calculatePaybackPeriod(40000, 0);
      assert.strictEqual(noPayback1.months, 999);
      assert.strictEqual(noPayback1.formatted, 'No Payback');

      const noPayback2 = calculatePaybackPeriod(40000, -100);
      assert.strictEqual(noPayback2.months, 999);
      assert.strictEqual(noPayback2.formatted, 'No Payback');

      // Rule 3: < 12 months
      const pb6 = calculatePaybackPeriod(18000, 3000);
      assert.strictEqual(pb6.months, 6.0);
      assert.strictEqual(pb6.formatted, '6 Months');

      const pb75 = calculatePaybackPeriod(15000, 2000);
      assert.strictEqual(pb75.months, 7.5);
      assert.strictEqual(pb75.formatted, '7.5 Months');

      // Rule 4: >= 12 months
      const pb12 = calculatePaybackPeriod(24000, 2000);
      assert.strictEqual(pb12.months, 12.0);
      assert.strictEqual(pb12.formatted, '1 Years');

      const pb18 = calculatePaybackPeriod(36000, 2000);
      assert.strictEqual(pb18.months, 18.0);
      assert.strictEqual(pb18.formatted, '1 Yr 6 Mo');

      const pb24 = calculatePaybackPeriod(48000, 2000);
      assert.strictEqual(pb24.months, 24.0);
      assert.strictEqual(pb24.formatted, '2 Years');
    });

    it('empirically verifies carbon offset and teak tree equivalent equations', () => {
      const distances = [300, 910, 1500, 2500];
      for (const monthlyKm of distances) {
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

  // =========================================================================
  // 5. 4-STEP RECOMMENDATION QUIZ SCORING ACROSS 1,152 PERMUTATIONS
  // =========================================================================
  describe('5. 4-Step Smart Recommendation Engine (1,152 Permutations)', () => {
    const commuteOptions: WizardAnswers['commuteDistance'][] = ['under25', '25to50', '50to80', 'above80'];
    const chargingOptions: WizardAnswers['chargingAccess'][] = ['independentHouse', 'apartmentWithSocket', 'apartmentNoSocket', 'publicOnly'];
    const usageOptions: WizardAnswers['primaryUse'][] = ['familyStorage', 'officeCommute', 'youthPerformance', 'youthStyle', 'heavyDuty', 'budgetEconomy'];
    const budgetOptions: WizardAnswers['budget'][] = ['under1L', '1to1.4L', '1.4to1.8L', 'above1.8L'];
    const categoryOptions: WizardAnswers['preferredCategory'][] = ['all', 'scooter', 'motorcycle'];

    it('empirically evaluates all 1,152 permutations (4 x 4 x 6 x 4 x 3) with mathematical integrity', () => {
      let totalPermutations = 0;

      for (const commute of commuteOptions) {
        for (const charging of chargingOptions) {
          for (const usage of usageOptions) {
            for (const budget of budgetOptions) {
              for (const category of categoryOptions) {
                totalPermutations++;
                const answers: WizardAnswers = {
                  commuteDistance: commute,
                  chargingAccess: charging,
                  primaryUse: usage,
                  budget: budget,
                  preferredCategory: category
                };

                const recs = calculateRecommendations(answers, allVehiclesWithBenchmark);

                // 1. Result count: exactly 40 EV models (Activa filtered out)
                assert.strictEqual(recs.length, 40, `Permutation #${totalPermutations} returned ${recs.length} items`);

                // 2. Invariant: ICE benchmark is never present
                const icePresent = recs.some(r => r.model.isIceBenchmark || r.model.id === 'honda-activa-6g');
                assert.strictEqual(icePresent, false, `ICE benchmark present in permutation #${totalPermutations}`);

                // 3. Monotonic sorting
                for (let i = 0; i < recs.length - 1; i++) {
                  assert.ok(
                    recs[i].matchScore >= recs[i + 1].matchScore,
                    `Sort order violation at index ${i} in permutation #${totalPermutations}`
                  );
                  assert.strictEqual(recs[i].rank, i + 1);
                  assert.strictEqual(recs[i].categoryRank, i + 1);
                }

                // 4. Subscores and weights verification: 30% commute + 25% charging + 25% usage + 20% budget
                for (const rec of recs) {
                  const sub = rec.subScores;
                  assert.ok(sub.commuteScore >= 0 && sub.commuteScore <= 100);
                  assert.ok(sub.chargingScore >= 0 && sub.chargingScore <= 100);
                  assert.ok(sub.usageScore >= 0 && sub.usageScore <= 100);
                  assert.ok(sub.budgetScore >= 0 && sub.budgetScore <= 100);

                  let expectedRaw = 0.30 * sub.commuteScore + 0.25 * sub.chargingScore + 0.25 * sub.usageScore + 0.20 * sub.budgetScore;
                  if (category && category !== 'all' && rec.model.category !== category) {
                    expectedRaw *= 0.60;
                  }
                  const expectedMatchScore = Math.min(100, Math.max(0, Math.round(expectedRaw)));
                  assert.strictEqual(rec.matchScore, expectedMatchScore, `Match score calculation mismatch for ${rec.model.id}`);

                  // Invariant: reasons, pros, caveats
                  assert.ok(rec.matchingReasons.length >= 3);
                }

                // 5. Explicit Rule: apartmentNoSocket charging access
                if (charging === 'apartmentNoSocket') {
                  for (const rec of recs) {
                    if (rec.model.specs.isRemovableBattery) {
                      assert.strictEqual(rec.subScores.chargingScore, 100, `${rec.model.name} removable battery must get 100 charging score`);
                      assert.ok(rec.matchingReasons.some(r => r.includes('Removable battery pack')));
                    } else {
                      assert.strictEqual(rec.subScores.chargingScore, 20, `${rec.model.name} fixed battery must get 20 charging score hard penalty`);
                      assert.ok(rec.matchingReasons.some(r => r.includes('Fixed battery pack')));
                      assert.ok(rec.caveatsToConsider.some(c => c.includes('Fixed battery cannot be removed')));
                      // Max score for fixed battery cannot exceed 80% (0.30*100 + 0.25*20 + 0.25*100 + 0.20*100 = 80)
                      assert.ok(rec.matchScore <= 80, `Fixed battery model ${rec.model.name} scored ${rec.matchScore} > 80 in apartmentNoSocket`);
                    }
                  }

                  // When category is 'all', top ranked vehicle MUST be a removable battery EV
                  if (category === 'all') {
                    assert.strictEqual(
                      recs[0].model.specs.isRemovableBattery,
                      true,
                      `Top recommendation in apartmentNoSocket must have removable battery in permutation #${totalPermutations}`
                    );
                  }
                }
              }
            }
          }
        }
      }

      assert.strictEqual(totalPermutations, 1152, 'Must evaluate exactly 1,152 quiz permutation matrix paths');
    });
  });
});
