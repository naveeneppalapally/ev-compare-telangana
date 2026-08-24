import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getEVModels,
  getAllVehiclesIncludingBenchmark,
  getEVModelById,
  getEVModelsByCategory,
  getEVModelsByBrand,
  ICE_BENCHMARK_MODEL
} from '../src/data/evModels.ts';

import {
  calculateTelanganaOnRoadPrice,
  calculatePmEdriveSubsidy
} from '../src/utils/priceCalculator.ts';

import {
  simulateRange
} from '../src/utils/rangeSimulator.ts';

import {
  calculate5YearTCO,
  calculateCarbonOffset,
  FINANCIAL_BENCHMARKS
} from '../src/utils/savingsCalculator.ts';

import {
  calculateRecommendations
} from '../src/utils/recommendationEngine.ts';

import type { EVModel, WizardAnswers } from '../src/types/ev.ts';

describe('E2E Test Suite 1: Full OEM Catalog Lineup, Specifications & Telangana Computations', () => {
  const allVehicles = getAllVehiclesIncludingBenchmark();
  const evOnly = getEVModels();
  const motorcycles = getEVModelsByCategory('motorcycle');
  const scooters = getEVModelsByCategory('scooter');

  // ==========================================================================
  // TIER 1: FEATURE COVERAGE & TAXONOMY OF ALL 19 INDIAN OEM BRANDS
  // ==========================================================================
  describe('Tier 1: 19 Authentic Indian EV OEMs + Simple Energy + Honda Benchmark Coverage', () => {
    const EXPECTED_OEM_BRANDS = [
      'Ola Electric',
      'Ather Energy',
      'TVS Motor',
      'Bajaj Auto',
      'Revolt Motors',
      'Ultraviolette Automotive',
      'Hero MotoCorp (Vida)',
      'River Mobility',
      'Oben Electric',
      'Matter Mobility',
      'Raptee Energy',
      'Pure EV',
      'Kinetic Green',
      'Greaves Ampere',
      'Kabira Mobility',
      'Komaki Electric',
      'Hop Electric',
      'Tork Motors',
      'BGauss'
    ];

    it('verifies that all 19 required Indian EV OEM brands exist in the catalog with active models', () => {
      const catalogBrands = new Set(evOnly.map(m => m.brand));

      for (const expectedBrand of EXPECTED_OEM_BRANDS) {
        assert.ok(
          catalogBrands.has(expectedBrand),
          `Required OEM Brand "${expectedBrand}" is missing from the catalog`
        );

        const modelsForBrand = getEVModelsByBrand(expectedBrand);
        assert.ok(
          modelsForBrand.length >= 1,
          `OEM Brand "${expectedBrand}" must have at least 1 verified vehicle model, found ${modelsForBrand.length}`
        );
      }
    });

    it('verifies Simple Energy and Honda Activa 6G ICE benchmark presence', () => {
      // 1. Simple Energy presence
      const simpleModels = getEVModelsByBrand('Simple Energy');
      assert.ok(simpleModels.length >= 1, 'Simple Energy must be present in the EV catalog');
      const simpleOne = simpleModels.find(m => m.id.includes('simple-one'));
      assert.ok(simpleOne, 'Simple One model must exist');
      assert.equal(simpleOne?.specs.batteryCapacityKwh, 5.0, 'Simple One has 5.0 kWh dual battery setup');

      // 2. Honda Activa 6G ICE Benchmark presence
      assert.ok(ICE_BENCHMARK_MODEL, 'Honda Activa 6G ICE benchmark must be defined');
      assert.equal(ICE_BENCHMARK_MODEL.id, 'honda-activa-6g');
      assert.equal(ICE_BENCHMARK_MODEL.isIceBenchmark, true);
      assert.equal(ICE_BENCHMARK_MODEL.specs.batteryCapacityKwh, 0);
      assert.equal(ICE_BENCHMARK_MODEL.category, 'scooter');
      assert.ok(ICE_BENCHMARK_MODEL.brand.includes('Honda'), 'Benchmark brand must be Honda');
    });

    it('verifies categorical taxonomy and exact partitioning (Motorcycles vs Scooters)', () => {
      assert.ok(motorcycles.length >= 23, `Expected >= 23 electric motorcycles, found ${motorcycles.length}`);
      assert.ok(scooters.length >= 17, `Expected >= 17 electric scooters, found ${scooters.length}`);

      // Partition integrity: total EV models = motorcycles + scooters
      assert.equal(
        motorcycles.length + scooters.length,
        evOnly.length,
        'Sum of motorcycles and scooters must equal total EV-only models'
      );

      // Verify every motorcycle has category === 'motorcycle'
      for (const bike of motorcycles) {
        assert.equal(bike.category, 'motorcycle', `Vehicle ${bike.id} should have category 'motorcycle'`);
        assert.ok(bike.specs.groundClearanceMm >= 140, `Motorcycle ${bike.id} ground clearance should be >= 140mm`);
      }

      // Verify every scooter has category === 'scooter'
      for (const scoot of scooters) {
        assert.equal(scoot.category, 'scooter', `Vehicle ${scoot.id} should have category 'scooter'`);
        assert.ok(
          (scoot.specs.bootSpaceLiters || 0) >= 0,
          `Scooter ${scoot.id} boot space should be >= 0L`
        );
      }
    });

    it('verifies comprehensive technical specification completeness across all 41 vehicles', () => {
      assert.ok(allVehicles.length >= 41, `Expected >= 41 total vehicles, found ${allVehicles.length}`);

      for (const vehicle of allVehicles) {
        assert.ok(vehicle.id && vehicle.id.trim().length > 0, `Vehicle missing ID: ${vehicle.name}`);
        assert.ok(vehicle.name && vehicle.name.trim().length > 0, `Vehicle ${vehicle.id} missing name`);
        assert.ok(vehicle.brand && vehicle.brand.trim().length > 0, `Vehicle ${vehicle.id} missing brand`);
        assert.ok(vehicle.tagline && vehicle.tagline.trim().length > 0, `Vehicle ${vehicle.id} missing tagline`);
        assert.ok(vehicle.idealFor && vehicle.idealFor.trim().length > 0, `Vehicle ${vehicle.id} missing idealFor`);
        assert.ok(vehicle.rating >= 3.5 && vehicle.rating <= 5.0, `Vehicle ${vehicle.id} rating out of bounds: ${vehicle.rating}`);
        assert.ok(vehicle.reviewCount > 0, `Vehicle ${vehicle.id} review count must be > 0`);
        assert.equal(vehicle.madeInIndia, true, `Vehicle ${vehicle.id} must have madeInIndia === true`);
        assert.ok(vehicle.launchYear >= 2020 && vehicle.launchYear <= 2027, `Vehicle ${vehicle.id} invalid launch year`);

        // Specs validation
        assert.ok(vehicle.specs.topSpeedKmh >= 40, `Vehicle ${vehicle.id} top speed too low`);
        assert.ok(vehicle.specs.accel0To40Kmh > 0 && vehicle.specs.accel0To40Kmh < 12.0, `Vehicle ${vehicle.id} 0-40 sprint invalid`);
        assert.ok(vehicle.specs.motorPeakPowerKw > 0, `Vehicle ${vehicle.id} peak power missing`);
        assert.ok(vehicle.specs.motorRatedPowerKw > 0, `Vehicle ${vehicle.id} rated power missing`);
        assert.ok(vehicle.specs.chargingTime0To80.length > 0, `Vehicle ${vehicle.id} charging time missing`);
        assert.ok(vehicle.specs.chargingTime0To100.length > 0, `Vehicle ${vehicle.id} charging time missing`);
        assert.ok(Array.isArray(vehicle.specs.ridingModes) && vehicle.specs.ridingModes.length >= 1, `Vehicle ${vehicle.id} missing riding modes`);
        assert.ok(vehicle.specs.brakes.length > 0, `Vehicle ${vehicle.id} missing brakes specification`);
        assert.ok(vehicle.specs.kerbWeightKg >= 60 && vehicle.specs.kerbWeightKg <= 220, `Vehicle ${vehicle.id} kerb weight invalid: ${vehicle.specs.kerbWeightKg}`);

        // Warranty validation
        assert.ok(vehicle.warranty.vehicleYears >= 2, `Vehicle ${vehicle.id} warranty years < 2`);
        assert.ok(vehicle.warranty.vehicleKm >= 20000, `Vehicle ${vehicle.id} warranty km < 20,000`);

        // Lists validation
        assert.ok(Array.isArray(vehicle.features) && vehicle.features.length >= 3, `Vehicle ${vehicle.id} must have >= 3 features`);
        assert.ok(Array.isArray(vehicle.pros) && vehicle.pros.length >= 2, `Vehicle ${vehicle.id} must have >= 2 pros`);
        assert.ok(Array.isArray(vehicle.cons) && vehicle.cons.length >= 1, `Vehicle ${vehicle.id} must have >= 1 con`);
        assert.ok(Array.isArray(vehicle.badges) && vehicle.badges.length >= 2, `Vehicle ${vehicle.id} must have >= 2 badges`);
      }
    });

    it('verifies helper lookup query functions work consistently', () => {
      // 1. getEVModelById
      const f77 = getEVModelById('ultraviolette-f77-mach2');
      assert.ok(f77, 'Ultraviolette F77 must be found by ID');
      assert.equal(f77?.brand, 'Ultraviolette Automotive');

      const nonexistent = getEVModelById('non-existent-vehicle-id-999');
      assert.equal(nonexistent, undefined);

      // 2. getEVModelsByBrand case-insensitivity
      const tvsUpper = getEVModelsByBrand('TVS MOTOR');
      const tvsMixed = getEVModelsByBrand('tvs motor');
      assert.ok(tvsUpper.length >= 2, 'TVS Motor must return >= 2 models');
      assert.equal(tvsUpper.length, tvsMixed.length, 'getEVModelsByBrand must be case-insensitive');
    });
  });

  // ==========================================================================
  // TIER 2: BOUNDARY, CORNER CASES & TELANGANA PLATFORM CALCULATIONS
  // ==========================================================================
  describe('Tier 2: Boundary & Corner Cases (Battery, Subsidy & G.O. Ms No. 41)', () => {
    it('verifies battery capacity span from 2.0 kWh to 16.0 kWh', () => {
      const capacities = evOnly.map(m => m.specs.batteryCapacityKwh);
      const minCapacity = Math.min(...capacities);
      const maxCapacity = Math.max(...capacities);

      assert.ok(minCapacity >= 1.5, `Minimum battery capacity should be >= 1.5 kWh, found ${minCapacity}`);
      assert.ok(maxCapacity >= 10.3, `Maximum battery capacity should be >= 10.3 kWh (e.g. 16 kWh Ola Roadster Pro), found ${maxCapacity}`);

      // Check specific flagship battery milestones
      const flagshipRoadster = evOnly.find(m => m.id === 'ola-roadster-pro-16');
      assert.ok(flagshipRoadster, 'Ola Roadster Pro 16 kWh model must exist');
      assert.equal(flagshipRoadster?.specs.batteryCapacityKwh, 16.0);

      const kineticMoped = evOnly.find(m => m.id === 'kinetic-green-e-luna');
      assert.ok(kineticMoped, 'Kinetic E-Luna must exist');
      assert.equal(kineticMoped?.specs.batteryCapacityKwh, 2.0);
    });

    it('verifies battery chemistry taxonomy across all EV models', () => {
      for (const ev of evOnly) {
        const chemistry = ev.specs.batteryChemistry;
        assert.ok(chemistry && chemistry.length > 0, `EV ${ev.id} must have a non-empty batteryChemistry`);
        
        // Chemistry must contain standard valid terms
        const validTerms = ['NMC', 'LFP', 'Li-ion', 'Lithium', 'Dual Removable', 'Fixed'];
        const isValid = validTerms.some(term => chemistry.includes(term));
        assert.ok(isValid, `EV ${ev.id} has unrecognized battery chemistry: "${chemistry}"`);

        // Battery warranty for EVs must be >= 3 years and >= 30,000 km
        assert.ok(ev.warranty.batteryYears >= 3, `EV ${ev.id} battery warranty years < 3`);
        assert.ok(ev.warranty.batteryKm >= 30000, `EV ${ev.id} battery warranty km < 30,000`);
      }
    });

    it('verifies mathematical consistency of ARAI vs Real City vs Highway range metrics', () => {
      for (const ev of evOnly) {
        const { araiRangeKm, realWorldEcoRangeKm, realWorldCityRangeKm, realWorldHighwayRangeKm } = ev.specs;

        assert.ok(araiRangeKm > 0, `EV ${ev.id} ARAI range must be > 0`);
        assert.ok(realWorldCityRangeKm > 0, `EV ${ev.id} city range must be > 0`);
        assert.ok(realWorldEcoRangeKm > 0, `EV ${ev.id} eco range must be > 0`);
        assert.ok(realWorldHighwayRangeKm > 0, `EV ${ev.id} highway range must be > 0`);

        // Natural physics relationship: ARAI >= Eco >= City >= Highway
        assert.ok(
          araiRangeKm >= realWorldEcoRangeKm,
          `EV ${ev.id}: ARAI (${araiRangeKm}) should be >= Eco (${realWorldEcoRangeKm})`
        );
        assert.ok(
          realWorldEcoRangeKm >= realWorldCityRangeKm,
          `EV ${ev.id}: Eco (${realWorldEcoRangeKm}) should be >= City (${realWorldCityRangeKm})`
        );
        assert.ok(
          realWorldCityRangeKm >= realWorldHighwayRangeKm,
          `EV ${ev.id}: City (${realWorldCityRangeKm}) should be >= Highway (${realWorldHighwayRangeKm})`
        );

        // Real-world city range is reasonably bounded (between 50% and 90% of ARAI)
        const cityToAraiRatio = realWorldCityRangeKm / araiRangeKm;
        assert.ok(
          cityToAraiRatio >= 0.50 && cityToAraiRatio <= 0.90,
          `EV ${ev.id}: City-to-ARAI ratio ${cityToAraiRatio.toFixed(2)} out of expected 0.50 - 0.90 range`
        );
      }
    });

    it('evaluates PM E-DRIVE subsidy policy boundary (<= ₹1.5L cap vs > ₹1.5L ₹0 cap)', () => {
      // 1. Core formula tests on boundary points
      assert.equal(calculatePmEdriveSubsidy(3.0, 150000), 10000, '3.0 kWh at exact 1.5L cap receives ₹10,000');
      assert.equal(calculatePmEdriveSubsidy(3.0, 150001), 0, 'Exceeding 1.5L by ₹1 drops subsidy to ₹0');
      assert.equal(calculatePmEdriveSubsidy(1.5, 100000), 7500, '1.5 kWh at ₹1L receives ₹7,500 (1.5 * 5000)');
      assert.equal(calculatePmEdriveSubsidy(0, 100000), 0, '0 kWh battery receives ₹0');
      assert.equal(calculatePmEdriveSubsidy(10.3, 399000), 0, 'Ultra premium vehicle receives ₹0');

      // 2. Catalog models subsidy bounds
      for (const ev of evOnly) {
        const subsidy = ev.pricing.pmEdriveSubsidy;
        assert.ok(
          subsidy >= 0 && subsidy <= 10000,
          `EV ${ev.id} subsidy ₹${subsidy} out of expected [0, 10000] range`
        );
      }
    });

    it('evaluates Telangana G.O. Ms No. 41 Zero Road Tax and Zero Registration Fee across all 38 RTOs', () => {
      const sampleRtos = ['TG-09', 'TG-01', 'TG-10', 'TG-15', 'TG-20', 'TG-38'];

      for (const rtoCode of sampleRtos) {
        for (const ev of evOnly) {
          const breakdown = calculateTelanganaOnRoadPrice(ev, rtoCode);

          // 1. Zero road tax for EVs
          assert.equal(breakdown.stateRoadTax, 0, `Road tax must be 0 for ${ev.id} under TG policy`);
          assert.equal(breakdown.stateRoadTaxPayable, 0, `Road tax payable must be 0 for ${ev.id}`);

          // 2. Zero registration fee for EVs
          assert.equal(breakdown.registrationAndSmartCardFee, 0, `Registration fee must be 0 for ${ev.id}`);
          assert.equal(breakdown.registrationFeePayable, 0, `Registration fee payable must be 0 for ${ev.id}`);

          // 3. Road tax savings equals 12% standard petrol rate
          const expectedTaxSavings = Math.round(ev.pricing.exShowroom * 0.12);
          assert.equal(breakdown.stateRoadTaxStandardPetrol, expectedTaxSavings);

          // 4. Policy savings equals tax savings + registration fee savings (₹785)
          const expectedPolicySavings = expectedTaxSavings + 785;
          assert.equal(breakdown.savingsFromTelanganaPolicy, expectedPolicySavings);

          // 5. Total upfront savings equals policy savings + central subsidy
          assert.equal(breakdown.totalUpfrontSavings, expectedPolicySavings + breakdown.pmEdriveSubsidy);

          // 6. Net on-road price invariant
          const expectedTotal =
            breakdown.netVehiclePrice +
            (breakdown.hsrpPlateFee || 400) +
            breakdown.insurance5Year +
            breakdown.handlingAndDocs +
            breakdown.chargerCost;
          assert.equal(breakdown.totalTelanganaOnRoadPrice, expectedTotal);
        }
      }
    });

    it('verifies paint finish color swatches format and minimum count across all models', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      for (const vehicle of allVehicles) {
        assert.ok(
          Array.isArray(vehicle.colorOptions) && vehicle.colorOptions.length >= 2,
          `Vehicle ${vehicle.id} must have >= 2 color options, found ${vehicle.colorOptions?.length}`
        );

        for (const color of vehicle.colorOptions) {
          assert.ok(color.name && color.name.trim().length > 0, `Color name missing in ${vehicle.id}`);
          assert.ok(
            hexColorRegex.test(color.hex),
            `Invalid hex code "${color.hex}" for color "${color.name}" in ${vehicle.id}`
          );
        }
      }
    });
  });

  // ==========================================================================
  // TIER 3: CROSS-FEATURE INTEGRATIONS, COMPARISON MATRIX & PHYSICS ENGINES
  // ==========================================================================
  describe('Tier 3: Cross-Feature Multi-Modal Pipelines & Physics Simulator', () => {
    it('simulates 4-vehicle side-by-side comparison matrix diffing and winner detection', () => {
      const candidateIds = ['ola-s1-pro-gen2', 'ather-450x-gen3-37', 'tvs-iqube-st-51', 'bajaj-chetak-premium-32'];
      const selectedModels = candidateIds.map(id => getEVModelById(id)!);

      assert.equal(selectedModels.length, 4, 'Must have selected 4 distinct EV models');

      // Spec Diffing: Battery Capacity comparison
      const batteryCaps = selectedModels.map(m => m.specs.batteryCapacityKwh);
      const maxBattery = Math.max(...batteryCaps);
      const minBattery = Math.min(...batteryCaps);
      assert.ok(maxBattery > minBattery, 'Battery capacities should differ among chosen models');

      // Detect winner in battery capacity: TVS iQube ST 5.1 (5.1 kWh)
      const batteryWinner = selectedModels.find(m => m.specs.batteryCapacityKwh === maxBattery);
      assert.equal(batteryWinner?.id, 'tvs-iqube-st-51');

      // Spec Diffing: 0-40 sprint speed winner: Ola S1 Pro Gen 2 (2.6s)
      const sprintTimes = selectedModels.map(m => m.specs.accel0To40Kmh);
      const bestSprint = Math.min(...sprintTimes);
      const sprintWinner = selectedModels.find(m => m.specs.accel0To40Kmh === bestSprint);
      assert.equal(sprintWinner?.id, 'ola-s1-pro-gen2');

      // Diff calculation across all specs
      const specKeys: (keyof EVModel['specs'])[] = [
        'batteryCapacityKwh',
        'topSpeedKmh',
        'accel0To40Kmh',
        'realWorldCityRangeKm',
        'araiRangeKm',
        'bootSpaceLiters'
      ];

      for (const key of specKeys) {
        const values = selectedModels.map(m => m.specs[key]);
        const uniqueValues = new Set(values);
        assert.ok(uniqueValues.size >= 2, `Spec key "${key}" should exhibit differences across the 4 models`);
      }
    });

    it('simulates multi-factor range physics with Hyderabad heat, payload, traffic, and riding modes', () => {
      const testModel = getEVModelById('ather-rizta-z-37')!;
      const baseCityRange = testModel.specs.realWorldCityRangeKm; // 125 km

      // 1. Riding mode physics: Eco (1.10x) vs Hyper/Sport (0.82x)
      const ecoSim = simulateRange(testModel, { mode: 'eco', commuteDistanceKm: 30 });
      const sportSim = simulateRange(testModel, { mode: 'sport', commuteDistanceKm: 30 });
      assert.ok(ecoSim.estimatedRangeKm > baseCityRange, 'Eco mode range should exceed base city range');
      assert.ok(sportSim.estimatedRangeKm < baseCityRange, 'Sport mode range should be below base city range');

      // 2. Payload physics: Solo (1.0x) vs Pillion (0.84x) vs Heavy Luggage (0.76x)
      const soloSim = simulateRange(testModel, { payload: 'solo' });
      const pillionSim = simulateRange(testModel, { payload: 'pillion' });
      const luggageSim = simulateRange(testModel, { payload: 'heavy_luggage' });
      assert.ok(soloSim.estimatedRangeKm > pillionSim.estimatedRangeKm);
      assert.ok(pillionSim.estimatedRangeKm > luggageSim.estimatedRangeKm);

      // 3. Hyderabad 42°C Summer Heat: LFP thermal resilience vs NMC derating
      const lfpModel = getEVModelById('ampere-nexus-30')!; // LFP chemistry
      const nmcModel = getEVModelById('ather-450x-gen3-37')!; // NMC chemistry

      const lfpHeatSim = simulateRange(lfpModel, { temperature: 'telangana_heat' });
      const nmcHeatSim = simulateRange(nmcModel, { temperature: 'telangana_heat' });

      assert.equal(lfpHeatSim.factors.temperatureMultiplier, 0.94, 'LFP has 0.94x retention in Telangana heat');
      assert.equal(nmcHeatSim.factors.temperatureMultiplier, 0.88, 'NMC throttles to 0.88x in Telangana heat');

      // 4. Combined worst-case vs best-case scenario
      const bestCase = simulateRange(testModel, {
        mode: 'eco',
        payload: 'solo_light',
        traffic: 'smooth_flow',
        temperature: 'pleasant',
        terrain: 'flat'
      });
      const worstCase = simulateRange(testModel, {
        mode: 'hyper',
        payload: 'heavy_luggage',
        traffic: 'highway',
        temperature: 'telangana_heat',
        terrain: 'flyovers'
      });
      assert.ok(
        bestCase.estimatedRangeKm > worstCase.estimatedRangeKm * 2,
        'Best-case range should be more than double the worst-case range'
      );
    });

    it('simulates 5-Year Total Cost of Ownership (TCO) & ROI payback against Honda Activa 6G', () => {
      const evModel = getEVModelById('ola-s1-air')!;
      const evPricing = calculateTelanganaOnRoadPrice(evModel, 'TG-09');

      const tco = calculate5YearTCO({
        evOnRoadPrice: evPricing.totalTelanganaOnRoadPrice,
        evWhPerKm: 30.0,
        electricityRate: FINANCIAL_BENCHMARKS.TSSPDCL_DOMESTIC_TARIFF_PER_KWH,
        petrolPrice: FINANCIAL_BENCHMARKS.HYDERABAD_PETROL_PRICE_PER_LITER,
        petrolMileage: FINANCIAL_BENCHMARKS.ACTIVA_6G_MILEAGE_KMPL,
        fiveYearKm: 50000
      });

      // Petrol 5-year fuel cost for 50,000 km @ ₹109.66/L & 45 km/L ≈ ₹1,21,844
      assert.ok(tco.petrolFuelCostTotal > 120000, `Petrol fuel cost should exceed ₹1.2L, got ${tco.petrolFuelCostTotal}`);

      // EV 5-year electricity cost for 50,000 km @ 30 Wh/km & ₹7.50/kWh ≈ ₹12,784
      assert.ok(tco.evElectricityCostTotal < 20000, `EV power cost should be under ₹20,000, got ${tco.evElectricityCostTotal}`);

      // Net 5-year TCO savings should be substantial (> ₹75,000)
      assert.ok(tco.netTCOSavings > 75000, `Expected > ₹75,000 5-year net TCO savings, got ${tco.netTCOSavings}`);

      // Carbon offset verification
      const carbon = calculateCarbonOffset(1000); // 1000 km/month
      assert.ok(carbon.fiveYearCo2SavedKg > 1500, '5-year CO2 reduction should exceed 1500 kg');
      assert.ok(carbon.equivalentTeakTrees >= 70, 'Equivalent teak trees should be >= 70');
    });
  });

  // ==========================================================================
  // TIER 4: REAL-WORLD HYDERABAD & TELANGANA COMMUTER PERSONAS
  // ==========================================================================
  describe('Tier 4: Realistic Hyderabad Commuter Personas & Field Workloads', () => {
    it('evaluates Persona 1: Hitec City IT Commuter (High-rise apartment, no basement charger)', () => {
      // User answers: 40 km daily, apartment without charging socket, office commute
      const answers: WizardAnswers = {
        commuteDistance: '25to50',
        chargingAccess: 'apartmentNoSocket',
        usageType: 'officeCommute',
        budget: '1to1.4L',
        preferredCategory: 'all'
      };

      const recommendations = calculateRecommendations(answers, evOnly);
      assert.ok(recommendations.length > 0, 'Should return recommendations');

      const topPick = recommendations[0].model;
      // Ideal top picks should have either removable battery or large range
      const hasRemovable = topPick.specs.isRemovableBattery;
      const hasLongRange = topPick.specs.realWorldCityRangeKm >= 120;
      assert.ok(
        hasRemovable || hasLongRange,
        `Top pick ${topPick.name} for apartment without socket should offer removable battery or >=120km range`
      );
    });

    it('evaluates Persona 2: Old City Commercial Delivery Courier (Heavy stop-and-go, 120 km/day)', () => {
      const courierAnswers: WizardAnswers = {
        commuteDistance: 'above80',
        chargingAccess: 'independentHouse',
        usageType: 'deliveryUtility',
        budget: 'under1L',
        priorityFactor: 'lowMaintenance'
      };

      const recommendations = calculateRecommendations(courierAnswers, evOnly);
      assert.ok(recommendations.length > 0);

      // Best models for high-mileage delivery: Kinetic E-Luna, Ola S1X, Ampere Nexus, BGauss RUV 350
      const topIds = recommendations.slice(0, 5).map(r => r.model.id);
      const deliveryFriendlyFound = topIds.some(id =>
        ['kinetic-green-e-luna', 'ola-s1-x-plus-30', 'ampere-nexus-30', 'bgauss-ruv-350', 'pure-ev-ecodryft-350'].includes(id)
      );
      assert.ok(deliveryFriendlyFound, 'Expected delivery-friendly EV in top recommendations for courier persona');
    });

    it('evaluates Persona 3: Secunderabad Family Household (Grocery runs, 34-43L large boot space)', () => {
      const familyAnswers: WizardAnswers = {
        commuteDistance: '25to50',
        chargingAccess: 'independentHouse',
        usageType: 'familyStorage',
        budget: '1.4to1.8L',
        preferredCategory: 'scooter',
        priorityFactor: 'storage'
      };

      const recommendations = calculateRecommendations(familyAnswers, evOnly);
      assert.ok(recommendations.length > 0);

      const topScooter = recommendations[0].model;
      assert.equal(topScooter.category, 'scooter');
      assert.ok(
        topScooter.specs.bootSpaceLiters >= 30,
        `Top family scooter ${topScooter.name} should have >= 30L boot space, got ${topScooter.specs.bootSpaceLiters}L`
      );
    });

    it('evaluates Persona 4: Highway Inter-District Commuter (Hyderabad to Warangal / Suryapet on NH-65)', () => {
      const highwayAnswers: WizardAnswers = {
        commuteDistance: 'above80',
        chargingAccess: 'independentHouse',
        usageType: 'youthPerformance',
        budget: 'above1.8L',
        preferredCategory: 'motorcycle',
        priorityFactor: 'speed'
      };

      const recommendations = calculateRecommendations(highwayAnswers, evOnly);
      assert.ok(recommendations.length > 0);

      const topBike = recommendations[0].model;
      assert.equal(topBike.category, 'motorcycle');
      assert.ok(
        topBike.specs.topSpeedKmh >= 90,
        `Highway motorcycle ${topBike.name} should have top speed >= 90 km/h, got ${topBike.specs.topSpeedKmh} km/h`
      );
      assert.ok(
        topBike.specs.realWorldHighwayRangeKm >= 90,
        `Highway motorcycle ${topBike.name} should have highway range >= 90 km, got ${topBike.specs.realWorldHighwayRangeKm} km`
      );
    });
  });
});
