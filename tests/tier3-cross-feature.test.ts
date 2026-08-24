import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  EV_MODELS,
  getEVModels,
  getAllVehiclesIncludingBenchmark,
  getEVModelById,
  getEVModelsByCategory,
  getEVModelsByBrand,
  ICE_BENCHMARK_MODEL
} from '../src/data/evModels.ts';

import {
  TELANGANA_RTOS,
  TELANGANA_DISTRICTS,
  getRtoByCode,
  getDistrictById,
  getRtosByDistrict,
  getRtosByZone,
  getAllRtos,
  TELANGANA_CURRENT_PETROL_PRICE,
  TELANGANA_AVG_ELECTRICITY_RATE
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
  calculateSavings,
  calculate5YearTCO,
  calculatePaybackPeriod,
  calculateCarbonOffset,
  FINANCIAL_BENCHMARKS
} from '../src/utils/savingsCalculator.ts';

import {
  simulateRange,
  simulateRealWorldRange
} from '../src/utils/rangeSimulator.ts';

import {
  calculateRecommendations
} from '../src/utils/recommendationEngine.ts';

import type {
  EVModel,
  WizardAnswers,
  FilterState,
  VehicleCategory,
  EVPriceBreakdown,
  SavingsComparison,
  RangeSimulationResult,
  RecommendationResult
} from '../src/types/ev.ts';

describe('Tier 3: Cross-Feature Interactions & Multi-Modal State Pipelines', () => {

  // --------------------------------------------------------------------------
  // Pipeline 1: Quiz -> Range Simulator -> On-Road Price -> Comparison Matrix
  // --------------------------------------------------------------------------
  it('Pipeline 1: Quiz Recommendation -> Range Simulator -> On-Road Price Modal -> Comparison Matrix', () => {
    // 1. User answers 4-step recommendation quiz
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'independentHouse',
      usageType: 'familyStorage',
      budget: '1to1.4L',
      preferredCategory: 'scooter'
    };

    const evs = getEVModels();
    const recommendations = calculateRecommendations(answers, evs);
    assert.ok(recommendations.length >= 3, 'Should produce ranked recommendation list');

    // 2. Top recommended model is Ather Rizta Z
    const topMatch = recommendations[0];
    assert.equal(topMatch.model.category, 'scooter');
    assert.ok(topMatch.model.specs.bootSpaceLiters >= 34, 'Top match should satisfy family storage requirement');

    // 3. User drills into Real-World Range Simulator with calculated 40 km commute
    const rangeSim = simulateRange(topMatch.model, {
      mode: 'city',
      payload: 'with_pillion',
      traffic: 'city_stop_go',
      temperature: 'telangana_heat',
      commuteDistanceKm: 40
    });

    assert.ok(rangeSim.estimatedRangeKm >= 60, 'Simulated range should comfortably exceed daily commute');
    assert.ok(rangeSim.batteryReserveRemainingPercent! > 30, 'Should retain safe battery reserve');
    assert.equal(rangeSim.rechargeFeasibilityStatus === 'safe' || rangeSim.rechargeFeasibilityStatus === 'moderate', true);

    // 4. User opens Telangana On-Road Price Breakdown for Hyderabad Central (TG-09)
    const priceBreakdown = calculateTelanganaOnRoadPrice(topMatch.model, 'TG-09');
    assert.equal(priceBreakdown.rtoCode, 'TG-09');
    assert.equal(priceBreakdown.stateRoadTax, 0, 'Road tax must be ₹0 under Telangana EV Policy');
    assert.ok(priceBreakdown.stateRoadTaxSavings! > 15000, 'Road tax savings should exceed ₹15k');
    assert.equal(priceBreakdown.pmEdriveSubsidy, 10000, 'PM E-DRIVE subsidy should be applied');

    // 5. User adds Top 3 Recommendations into Comparison Matrix Tray
    const compareTray = recommendations.slice(0, 3).map(r => r.model.id);
    assert.equal(compareTray.length, 3);

    const compareModels = compareTray.map(id => getEVModelById(id)!);
    const maxBoot = Math.max(...compareModels.map(m => m.specs.bootSpaceLiters));
    const bootWinner = compareModels.find(m => m.specs.bootSpaceLiters === maxBoot);
    assert.ok(bootWinner, 'Comparison matrix should compute winning badge for boot space');
  });

  // --------------------------------------------------------------------------
  // Pipeline 2: Catalog Filtering -> Comparison Tray FIFO -> Diff Highlighting -> Detail Modal
  // --------------------------------------------------------------------------
  it('Pipeline 2: Catalog Filtering -> Multi-Vehicle Tray FIFO -> Difference Highlighting -> Detail Modal Drilldown', () => {
    const evs = getEVModels();

    // 1. User applies quick filters: Fast Charging + Boot Space >= 30L
    const filteredCatalog = evs.filter(m => 
      m.specs.fastChargingSupport && m.specs.bootSpaceLiters >= 30
    );
    assert.ok(filteredCatalog.length >= 3, 'Should match multiple family scooters');

    // 2. User selects 4 models into comparison tray
    let tray = ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34', 'river-indie-40'];
    assert.equal(tray.length, 4);

    // 3. User attempts to add a 5th model (Bajaj Chetak Premium) -> Triggers FIFO replacement
    const addWithFifo = (currentTray: string[], newId: string): string[] => {
      if (currentTray.includes(newId)) return currentTray;
      if (currentTray.length >= 4) {
        return [...currentTray.slice(1), newId];
      }
      return [...currentTray, newId];
    };

    tray = addWithFifo(tray, 'bajaj-chetak-premium-32');
    assert.equal(tray.length, 4);
    assert.equal(tray[0], 'ola-s1-pro-gen2', 'First model (ather-rizta-z-37) was dropped');
    assert.equal(tray[3], 'bajaj-chetak-premium-32', 'New model was appended to end');

    // 4. Difference Highlighting across all 4 models
    const comparedModels = tray.map(id => getEVModelById(id)!);
    const speeds = comparedModels.map(m => m.specs.topSpeedKmh);
    const ranges = comparedModels.map(m => m.specs.realWorldCityRangeKm);
    const boots = comparedModels.map(m => m.specs.bootSpaceLiters);

    assert.ok(new Set(speeds).size > 1, 'Top speeds should differ');
    assert.ok(new Set(ranges).size > 1, 'City ranges should differ');
    assert.ok(new Set(boots).size > 1, 'Boot spaces should differ');

    // 5. User opens deep-dive Vehicle Detail Modal on River Indie
    const detailModel = getEVModelById('river-indie-40')!;
    assert.ok(detailModel.pros.length >= 2, 'Detail modal should provide verified pros');
    assert.ok(detailModel.cons.length >= 1, 'Detail modal should provide verified cons');
    assert.ok(detailModel.colorOptions.length >= 2, 'Detail modal should provide authentic color options');
    assert.equal(detailModel.specs.bootSpaceLiters, 43, 'River Indie class-leading boot space verified');
  });

  // --------------------------------------------------------------------------
  // Pipeline 3: District RTO Switching -> Price Breakdown -> Savings ROI & Payback
  // --------------------------------------------------------------------------
  it('Pipeline 3: Regional RTO District Switching -> Price Breakdown Recalculation -> Savings ROI & Payback Dynamic Updates', () => {
    const ather = getEVModelById('ather-rizta-z-37')!;

    // 1. Initial lookup in Hyderabad Central (TG-09)
    const hydBreakdown = calculateTelanganaOnRoadPrice(ather, 'TG-09');
    assert.equal(hydBreakdown.rtoCode, 'TG-09');
    assert.ok(hydBreakdown.districtName?.includes('Hyderabad Central'));

    // 2. User switches to Warangal Urban / Hanamkonda (TG-03)
    const warangalBreakdown = calculateTelanganaOnRoadPrice(ather, 'TG-03');
    assert.equal(warangalBreakdown.rtoCode, 'TG-03');
    assert.ok(warangalBreakdown.districtName?.includes('Hanamkonda'));

    // Road tax exemption remains identical across all Telangana RTOs
    assert.equal(hydBreakdown.totalTelanganaOnRoadPrice, warangalBreakdown.totalTelanganaOnRoadPrice);
    assert.equal(hydBreakdown.stateRoadTaxSavings, warangalBreakdown.stateRoadTaxSavings);

    // 3. User calculates Petrol vs EV savings using Warangal on-road price
    const savings = calculateSavings(ather, {
      dailyKm: 45,
      daysPerMonth: 26,
      petrolPricePerLiter: TELANGANA_CURRENT_PETROL_PRICE,
      electricityCostPerKwh: TELANGANA_AVG_ELECTRICITY_RATE,
      evOnRoadPrice: warangalBreakdown.totalTelanganaOnRoadPrice
    });

    assert.ok(savings.monthlySavings > 2500, 'Monthly savings should exceed ₹2,500');
    assert.ok(savings.annualSavings > 30000, 'Annual savings should exceed ₹30,000');
    assert.ok(savings.paybackPeriodMonths > 0 && savings.paybackPeriodMonths < 24, 'Payback within 24 months');

    // 4. 5-Year TCO & Carbon Reduction
    assert.ok(savings.tco!.netTCOSavings > 100000, '5-Year net TCO savings should exceed ₹1.0 Lakh');
    assert.ok(savings.carbonOffset!.fiveYearCo2SavedKg > 1500, '5-Year CO2 reduction should exceed 1.5 tons');
    assert.ok(savings.carbonOffset!.equivalentTeakTrees >= 50, 'Teak trees offset should be calculated');
  });

  // --------------------------------------------------------------------------
  // Pipeline 4: Range Physics -> Commute Feasibility -> Recommendation Matching
  // --------------------------------------------------------------------------
  it('Pipeline 4: Real-World Range Physics -> Commute Feasibility Engine -> Recommendation Matching Alignment', () => {
    const highCommuteKm = 90; // 90 km/day heavy inter-district commute

    // 1. Simulate range for low-range model (Bajaj Chetak: 95 km city base)
    const chetak = getEVModelById('bajaj-chetak-premium-32')!;
    const chetakSim = simulateRange(chetak, {
      mode: 'city',
      payload: 'with_pillion',
      traffic: 'mixed_city',
      commuteDistanceKm: highCommuteKm
    });

    // Range with pillion drops below 90 km -> reserve < 15% -> Critical Status
    assert.ok(chetakSim.estimatedRangeKm < highCommuteKm || chetakSim.batteryReserveRemainingPercent! < 15);
    assert.equal(chetakSim.rechargeFeasibilityStatus, 'critical');

    // 2. Simulate range for high-range model (Ultraviolette F77: 220 km city base)
    const uv = getEVModelById('ultraviolette-f77-mach2')!;
    const uvSim = simulateRange(uv, {
      mode: 'city',
      payload: 'with_pillion',
      traffic: 'mixed_city',
      commuteDistanceKm: highCommuteKm
    });

    assert.ok(uvSim.estimatedRangeKm > 150);
    assert.ok(uvSim.batteryReserveRemainingPercent! > 40);
    assert.equal(uvSim.rechargeFeasibilityStatus, 'safe');

    // 3. Recommendation Engine scoring alignment for 'above80' commute distance
    const evs = getEVModels();
    const recs = calculateRecommendations({
      commuteDistance: 'above80',
      chargingAccess: 'independentHouse',
      budget: '1.4to1.8L'
    }, evs);

    const olaRec = recs.find(r => r.model.id === 'ola-s1-pro-gen2')!;
    const chetakRec = recs.find(r => r.model.id === 'bajaj-chetak-premium-32')!;

    assert.equal(olaRec.subScores?.commuteScore, 75, 'Ola S1 Pro (130 km) should score 75 on >80km commute');
    assert.equal(chetakRec.subScores?.commuteScore, 50, 'Bajaj Chetak (95 km) should score 50 on >80km commute');
    assert.ok(olaRec.matchScore > chetakRec.matchScore);
  });

  // --------------------------------------------------------------------------
  // Pipeline 5: Comparison Matrix with ICE Benchmark (Honda Activa 6G)
  // --------------------------------------------------------------------------
  it('Pipeline 5: Comparison Matrix with ICE Benchmark (Honda Activa 6G) vs Top EV Models', () => {
    const activa = ICE_BENCHMARK_MODEL;
    const rizta = getEVModelById('ather-rizta-z-37')!;
    const ola = getEVModelById('ola-s1-pro-gen2')!;

    // 1. On-Road Price Comparison
    const activaPrice = calculateTelanganaOnRoadPrice(activa, 'TG-09');
    const riztaPrice = calculateTelanganaOnRoadPrice(rizta, 'TG-09');
    const olaPrice = calculateTelanganaOnRoadPrice(ola, 'TG-09');

    // Activa pays 12% road tax + ₹785 registration
    assert.equal(activaPrice.stateRoadTax, Math.round(activa.pricing.exShowroom * 0.12));
    assert.equal(activaPrice.registrationAndSmartCardFee, 785);
    assert.equal(activaPrice.savingsFromTelanganaPolicy, 0);

    // EVs pay ₹0 road tax + ₹0 registration
    assert.equal(riztaPrice.stateRoadTax, 0);
    assert.equal(olaPrice.stateRoadTax, 0);
    assert.ok(riztaPrice.savingsFromTelanganaPolicy > 18000);
    assert.ok(olaPrice.savingsFromTelanganaPolicy > 16000);

    // 2. Running Cost & Savings Comparison
    const riztaSavings = calculateSavings(rizta, { dailyKm: 35, daysPerMonth: 26 });
    assert.ok(riztaSavings.petrolTotalCostPerKm! > 2.8, 'Activa running cost ~ ₹2.87/km');
    assert.ok(riztaSavings.evTotalCostPerKm! < 0.6, 'Rizta running cost ~ ₹0.40/km');
    assert.ok(riztaSavings.netSavingsPerKm! > 2.2, 'Net savings ~ ₹2.40/km');

    // 3. 5-Year TCO Comparison
    assert.ok(riztaSavings.tco!.petrolNetTCO > 210000, 'Activa 5-Year Net TCO > ₹2.1L');
    assert.ok(riztaSavings.tco!.evNetTCO < 140000, 'Rizta 5-Year Net TCO < ₹1.4L');
    assert.ok(riztaSavings.tco!.netTCOSavings > 75000, '5-Year net TCO advantage > ₹75k');
  });

  // --------------------------------------------------------------------------
  // Pipeline 6: Apartment No Socket Logic Cross-Verification
  // --------------------------------------------------------------------------
  it('Pipeline 6: Apartment No Socket Logic Cross-Verification Across Recommendation, Range, and Specs', () => {
    const evs = getEVModels();

    // 1. Quiz for apartment dweller without parking socket
    const recs = calculateRecommendations({
      chargingAccess: 'apartmentNoSocket',
      usageType: 'officeCommute',
      commuteDistance: '25to50'
    }, evs);

    // 2. Removable battery EVs must rank at the top
    const topRemovable = recs[0];
    assert.equal(topRemovable.model.specs.isRemovableBattery, true);
    assert.equal(topRemovable.subScores?.chargingScore, 100);
    assert.ok(
      topRemovable.matchingReasons?.some(r => r.includes('Removable battery')),
      'Matching reasons should highlight removable indoor charging advantage'
    );

    // 3. Fixed battery EVs must receive warning caveats
    const fixedBatteryRec = recs.find(r => !r.model.specs.isRemovableBattery)!;
    assert.equal(fixedBatteryRec.subScores?.chargingScore, 20);
    assert.ok(
      fixedBatteryRec.caveatsToConsider?.some(c => c.includes('Fixed battery cannot be removed') || c.includes('plug near your parking spot')),
      'Fixed battery EV must include caveat about parking socket requirement'
    );

    // 4. On-Road Price in Medchal-Malkajgiri (TG-08 Kukatpally)
    const priceBreakdown = calculateTelanganaOnRoadPrice(topRemovable.model, 'TG-08');
    assert.equal(priceBreakdown.rtoCode, 'TG-08');
    assert.equal(priceBreakdown.stateRoadTax, 0);
  });

  // --------------------------------------------------------------------------
  // Pipeline 7: Budget Optimization & ROI Payback Pipeline
  // --------------------------------------------------------------------------
  it('Pipeline 7: Budget Constrained Search -> Affordability Filtering -> ROI Payback Optimization', () => {
    const evs = getEVModels();

    // 1. Filter models under ₹1 Lakh net budget
    const budgetModels = evs.filter(m => 
      (m.pricing.exShowroom - m.pricing.pmEdriveSubsidy) <= 100000
    );
    assert.ok(budgetModels.length >= 2, 'Should have multiple affordable models');

    // 2. Select Ola S1 X+ (3.0 kWh)
    const olaS1X = budgetModels.find(m => m.id === 'ola-s1-x-plus-30')!;
    assert.ok(olaS1X, 'Ola S1X must exist in budget category');

    // 3. Calculate on-road price in Secunderabad (TG-10)
    const price = calculateTelanganaOnRoadPrice(olaS1X, 'TG-10');
    assert.ok(price.totalTelanganaOnRoadPrice < 100000, 'Ola S1X on-road price should be under ₹1.0 Lakh');

    // 4. Calculate Payback Period against Activa 6G
    const savings = calculateSavings(olaS1X, {
      dailyKm: 40,
      daysPerMonth: 26,
      evOnRoadPrice: price.totalTelanganaOnRoadPrice,
      petrolOnRoadPrice: FINANCIAL_BENCHMARKS.ACTIVA_6G_ON_ROAD_TELANGANA
    });

    // Since Ola S1X on-road is cheaper or comparable to Activa 6G (₹1,00,616), payback is immediate or under 6 months
    assert.ok(savings.paybackPeriodMonths < 6.0);
    assert.ok(savings.monthlySavings > 2200);
  });

  // --------------------------------------------------------------------------
  // Pipeline 8: Performance Enthusiast Pipeline (Ultraviolette vs Matter vs Tork)
  // --------------------------------------------------------------------------
  it('Pipeline 8: Performance Enthusiast Pipeline (Ultraviolette F77 Mach 2 vs Matter AERA vs Tork Kratos R)', () => {
    const evs = getEVModels();

    // 1. Recommendation quiz for high performance buyer
    const recs = calculateRecommendations({
      chargingAccess: 'independentHouse',
      usageType: 'youthPerformance',
      budget: 'above1.8L',
      preferredCategory: 'motorcycle'
    }, evs);

    const topMotorcycle = recs[0];
    assert.equal(topMotorcycle.model.category, 'motorcycle');
    assert.ok(topMotorcycle.model.specs.topSpeedKmh >= 100);

    // 2. Range simulator in Ballistic / Sport Mode at high speed on Hyderabad ORR
    const uvF77 = getEVModelById('ultraviolette-f77-mach2')!;
    const highSpeedSim = simulateRange(uvF77, {
      mode: 'hyper',
      payload: 'solo',
      traffic: 'fast_highway',
      temperature: 'pleasant',
      terrain: 'flat',
      commuteDistanceKm: 70
    });

    assert.ok(highSpeedSim.estimatedRangeKm >= 100, 'UV F77 10.3 kWh battery handles high-speed highway commute');
    assert.equal(highSpeedSim.rechargeFeasibilityStatus, 'safe');

    // 3. Price breakdown in Banjara Hills (TG-09) showing massive tax savings
    const uvPrice = calculateTelanganaOnRoadPrice(uvF77, 'TG-09');
    assert.equal(uvPrice.stateRoadTax, 0);
    assert.ok(uvPrice.stateRoadTaxSavings! >= 47000, '12% road tax savings on ₹3.99L ex-showroom should exceed ₹47,000');
    assert.equal(uvPrice.pmEdriveSubsidy, 0, 'No PM E-DRIVE subsidy above ₹1.5L');

    // 4. Comparison Matrix between 3 performance motorcycles
    const perfModels = [
      getEVModelById('ultraviolette-f77-mach2')!,
      getEVModelById('matter-aera-5000-plus')!,
      getEVModelById('tork-kratos-r')!
    ];

    const maxSpeed = Math.max(...perfModels.map(m => m.specs.topSpeedKmh));
    const speedWinner = perfModels.find(m => m.specs.topSpeedKmh === maxSpeed);
    assert.equal(speedWinner?.id, 'ultraviolette-f77-mach2'); // 155 km/h winner
  });

});
