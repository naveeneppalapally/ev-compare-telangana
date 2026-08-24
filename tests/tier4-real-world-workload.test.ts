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
  VehicleCategory
} from '../src/types/ev.ts';

describe('Tier 4: Realistic Real-World Workload Scenarios (Indian & Telangana Buyers)', () => {

  // --------------------------------------------------------------------------
  // Scenario 1: Hyderabad Hitec City / Gachibowli IT Corridor Commuter
  // --------------------------------------------------------------------------
  it('Scenario 1: Hyderabad IT Corridor Commuter Living in High-Rise Apartment Without Parking Socket', () => {
    const evs = getEVModels();

    // 1. User answers Smart Wizard: Apartment dweller with no ground socket access
    const answers: WizardAnswers = {
      commuteDistance: '25to50',
      chargingAccess: 'apartmentNoSocket',
      usageType: 'officeCommute',
      budget: '1.4to1.8L',
      preferredCategory: 'all'
    };

    const recs = calculateRecommendations(answers, evs);
    assert.ok(recs.length > 0);

    // 2. Highest scoring vehicle must be a removable battery EV (Hero Vida V1 Pro or Revolt RV400)
    const topMatch = recs[0];
    assert.equal(topMatch.model.specs.isRemovableBattery, true, 'Top recommendation must have removable battery');
    assert.equal(topMatch.subScores?.chargingScore, 100);

    // 3. Real-world range simulation for Gachibowli / Financial District commute (35 km) in summer
    const rangeSim = simulateRange(topMatch.model, {
      mode: 'city',
      payload: 'solo',
      traffic: 'mixed_city',
      temperature: 'telangana_heat',
      terrain: 'flyovers',
      commuteDistanceKm: 35
    });

    assert.ok(rangeSim.estimatedRangeKm >= 65, 'Vida V1 Pro dual battery handles 35km commute with ample reserve');
    assert.ok(rangeSim.batteryReserveRemainingPercent! > 40);
    assert.equal(rangeSim.rechargeFeasibilityStatus, 'safe');

    // 4. On-Road Price in Ranga Reddy / Attapur (TG-07)
    const price = calculateTelanganaOnRoadPrice(topMatch.model, 'TG-07');
    assert.equal(price.rtoCode, 'TG-07');
    assert.equal(price.stateRoadTax, 0);
    assert.equal(price.pmEdriveSubsidy, 10000);
    assert.ok(price.savingsFromTelanganaPolicy > 12000);
  });

  // --------------------------------------------------------------------------
  // Scenario 2: Warangal Rural & Semi-Urban Agricultural Trader
  // --------------------------------------------------------------------------
  it('Scenario 2: Warangal Rural Daily Commuter with Heavy Pillion & Agricultural Goods Payload', () => {
    const river = getEVModelById('river-indie-40')!; // River Indie "SUV of Scooters"

    // 1. Commute: 55 km daily round-trip from Geesugonda (TG-24) to Warangal Hanamkonda (TG-03) Market
    // 170 kg payload: rider + pillion + luggage sacks
    const heavySim = simulateRange(river, {
      mode: 'city',
      payload: 'heavy_with_luggage',
      traffic: 'mixed_city',
      temperature: 'telangana_heat',
      terrain: 'plains',
      commuteDistanceKm: 55
    });

    // 4.0 kWh battery provides strong range even under 170 kg payload
    assert.ok(heavySim.estimatedRangeKm >= 65, 'River Indie should deliver >65 km range under heavy payload');
    assert.ok(heavySim.batteryReserveRemainingPercent! >= 15);
    assert.equal(heavySim.factors.payloadMultiplier, 0.76);

    // 2. On-Road Pricing in Warangal Rural (TG-24)
    const price = calculateTelanganaOnRoadPrice(river, 'TG-24');
    assert.equal(price.rtoCode, 'TG-24');
    assert.ok(price.districtName?.includes('Warangal'));
    assert.equal(price.stateRoadTax, 0);
    assert.equal(price.pmEdriveSubsidy, 10000);

    // 3. Operational fuel savings vs Activa 6G hauling heavy cargo
    const savings = calculateSavings(river, {
      dailyKm: 55,
      daysPerMonth: 28,
      evOnRoadPrice: price.totalTelanganaOnRoadPrice
    });

    assert.ok(savings.monthlySavings > 3500, 'Heavy monthly commute saves > ₹3,500/month');
    assert.ok(savings.annualSavings > 42000, 'Annual savings exceeds ₹42,000');
    assert.ok(savings.paybackPeriodMonths < 18, 'Breakeven achieved in under 18 months');
  });

  // --------------------------------------------------------------------------
  // Scenario 3: Secunderabad Strict Budget Buyer (Under ₹1.0 Lakh Net Price)
  // --------------------------------------------------------------------------
  it('Scenario 3: Secunderabad Budget Buyer Comparing Ola S1X vs Ampere Nexus vs Activa 6G', () => {
    const olaS1X = getEVModelById('ola-s1-x-plus-30')!;
    const ampere = getEVModelById('ampere-nexus-30')!;
    const activa = ICE_BENCHMARK_MODEL;

    // 1. On-Road Price in Secunderabad (TG-10)
    const olaPrice = calculateTelanganaOnRoadPrice(olaS1X, 'TG-10');
    const amperePrice = calculateTelanganaOnRoadPrice(ampere, 'TG-10');
    const activaPrice = calculateTelanganaOnRoadPrice(activa, 'TG-10');

    // Ola S1X is under ₹1.0 Lakh on-road
    assert.ok(olaPrice.totalTelanganaOnRoadPrice < 100000);
    // Activa 6G exceeds ₹1.0 Lakh due to 12% road tax
    assert.ok(activaPrice.totalTelanganaOnRoadPrice > 100000);

    // 2. Savings and immediate breakeven payback
    const olaSavings = calculateSavings(olaS1X, {
      dailyKm: 35,
      daysPerMonth: 26,
      evOnRoadPrice: olaPrice.totalTelanganaOnRoadPrice,
      petrolOnRoadPrice: activaPrice.totalTelanganaOnRoadPrice
    });

    // Since Ola S1X is cheaper upfront than Activa 6G in Telangana, payback is immediate
    assert.equal(olaSavings.paybackPeriodMonths, 0);
    assert.equal(olaSavings.paybackFormatted, 'Immediate (Cheaper Upfront)');
    assert.ok(olaSavings.annualSavings > 25000);
  });

  // --------------------------------------------------------------------------
  // Scenario 4: Banjara Hills Performance Enthusiast & Highway Rider
  // --------------------------------------------------------------------------
  it('Scenario 4: Banjara Hills Performance Enthusiast Choosing Ultraviolette F77 with Road Tax Savings', () => {
    const uvF77 = getEVModelById('ultraviolette-f77-mach2')!;

    // 1. High-Speed Outer Ring Road (ORR) simulation
    const orrSim = simulateRange(uvF77, {
      mode: 'hyper',
      payload: 'solo',
      traffic: 'fast_highway',
      temperature: 'pleasant',
      terrain: 'flat',
      commuteDistanceKm: 80
    });

    // Massive 10.3 kWh battery handles 80 km highway blast easily
    assert.ok(orrSim.estimatedRangeKm >= 115, 'UV F77 delivers >=115 km highway range in Hyper mode');
    assert.ok(orrSim.batteryReserveRemainingPercent! > 30);
    assert.equal(orrSim.rechargeFeasibilityStatus, 'moderate');

    // 2. Telangana Road Tax Exemption math in Banjara Hills / Khairatabad (TG-09)
    const price = calculateTelanganaOnRoadPrice(uvF77, 'TG-09');
    assert.equal(price.stateRoadTax, 0);
    assert.equal(price.stateRoadTaxSavings, Math.round(399000 * 0.12)); // ₹47,880
    assert.equal(price.savingsFromTelanganaPolicy, 47880 + 785); // ₹48,665

    // 3. 5-Year TCO comparison
    const tco = calculate5YearTCO({
      evOnRoadPrice: price.totalTelanganaOnRoadPrice,
      evWhPerKm: 48,
      electricityRate: 7.50,
      petrolPrice: 109.66,
      petrolMileage: 45.0,
      fiveYearKm: 50000
    });

    assert.ok(tco.petrolFuelCostTotal > 120000);
    assert.ok(tco.evElectricityCostTotal < 30000);
    assert.ok(tco.petrolFuelCostTotal > tco.evElectricityCostTotal * 4, 'Operational electricity running cost is 4x cheaper than petrol fuel');
  });

  // --------------------------------------------------------------------------
  // Scenario 5: Nizamabad Commercial Delivery Executive (High Mileage in 44°C Heat)
  // --------------------------------------------------------------------------
  it('Scenario 5: Nizamabad Delivery Executive Riding 120 km/day in Peak Summer with LFP Battery', () => {
    const ampereLFP = getEVModelById('ampere-nexus-30')!; // Safe LFP chemistry

    // 1. Summer Heat Range Simulation: 120 km daily route in Nizamabad (TG-16) at 44°C
    const lfpSim = simulateRange(ampereLFP, {
      mode: 'city',
      payload: 'solo',
      traffic: 'city_stop_go',
      temperature: 'telangana_heat',
      commuteDistanceKm: 120
    });

    // LFP thermal multiplier is 0.94x (superior to NMC 0.88x)
    assert.equal(lfpSim.factors.temperatureMultiplier, 0.94);

    // 2. High-Mileage Operational Financials: 120 km/day * 30 days = 3,600 km/month
    const savings = calculateSavings(ampereLFP, {
      dailyKm: 120,
      daysPerMonth: 30,
      petrolPricePerLiter: TELANGANA_CURRENT_PETROL_PRICE,
      electricityCostPerKwh: TELANGANA_AVG_ELECTRICITY_RATE
    });

    assert.equal(savings.monthlyKm, 3600);
    assert.ok(savings.monthlySavings > 8000, 'Heavy delivery use saves > ₹8,000/month');
    assert.ok(savings.annualSavings > 100000, 'Annual savings exceeds ₹1.0 Lakh');
    assert.ok(savings.paybackPeriodMonths < 8.0, 'Full vehicle payback within 8 months');
  });

  // --------------------------------------------------------------------------
  // Scenario 6: Karimnagar College Student (Daily 30 km Campus Commute)
  // --------------------------------------------------------------------------
  it('Scenario 6: Karimnagar College Student Daily 30 km Campus Run with Low Monthly Expense', () => {
    const atherRizta = getEVModelById('ather-rizta-z-37')!;

    // 1. Smart Wizard query: Student seeking tech dashboard + low monthly fuel
    const recs = calculateRecommendations({
      commuteDistance: 'under25',
      chargingAccess: 'independentHouse',
      usageType: 'youthStyle',
      budget: '1.4to1.8L',
      preferredCategory: 'scooter'
    }, getEVModels());

    const topMatch = recs[0];
    assert.ok(topMatch.model.specs.touchscreen, 'Recommended scooter should have smart touchscreen');

    // 2. Monthly fuel cost computation for 30 km/day (26 days/mo = 780 km)
    const savings = calculateSavings(atherRizta, {
      dailyKm: 30,
      daysPerMonth: 26,
      electricityCostPerKwh: 7.50
    });

    assert.ok(savings.monthlyEvCost < 350, 'Monthly electric charging cost under ₹350');
    assert.ok(savings.monthlyPetrolCost > 2000, 'Equivalent petrol cost > ₹2,000');
    assert.ok(savings.monthlySavings > 1800);
  });

  // --------------------------------------------------------------------------
  // Scenario 7: Secunderabad Joint Family Hauler (Boot > 30L & Wide Seat)
  // --------------------------------------------------------------------------
  it('Scenario 7: Secunderabad Family Household Needing Large Grocery Storage & Dual Helmet Boot', () => {
    const evs = getEVModels();

    // 1. Filter models with large boot space (>=34L)
    const familyEVs = evs.filter(m => m.specs.bootSpaceLiters >= 34);
    assert.ok(familyEVs.length >= 3);

    const rizta = familyEVs.find(m => m.id === 'ather-rizta-z-37')!;
    const river = familyEVs.find(m => m.id === 'river-indie-40')!;
    const ola = familyEVs.find(m => m.id === 'ola-s1-pro-gen2')!;

    assert.ok(rizta && river && ola);
    assert.equal(rizta.specs.bootSpaceLiters, 34);
    assert.equal(river.specs.bootSpaceLiters, 43);
    assert.equal(ola.specs.bootSpaceLiters, 34);

    // 2. Family safety features
    assert.ok(rizta.features.some(f => f.toLowerCase().includes('skidcontrol') || f.toLowerCase().includes('traction')));
    assert.ok(rizta.features.some(f => f.toLowerCase().includes('seat')));
  });

  // --------------------------------------------------------------------------
  // Scenario 8: Khammam to Suryapet Inter-District Highway Commuter
  // --------------------------------------------------------------------------
  it('Scenario 8: Khammam to Suryapet Highway Commuter with Fast Charging Network Support', () => {
    const olaPro = getEVModelById('ola-s1-pro-gen2')!;

    // 1. Commute: 75 km each way along NH-65 (Khammam TG-04 to Suryapet TG-29)
    const highwaySim = simulateRange(olaPro, {
      mode: 'city',
      payload: 'solo',
      traffic: 'fast_highway',
      temperature: 'pleasant',
      terrain: 'flat',
      commuteDistanceKm: 75
    });

    assert.ok(highwaySim.estimatedRangeKm >= 95, 'Ola S1 Pro 4.0 kWh handles 75km one-way trip');
    assert.equal(highwaySim.rechargeFeasibilityStatus, 'moderate');

    // 2. Fast charging support for midday top-up
    assert.equal(olaPro.specs.fastChargingSupport, true);
    assert.ok(olaPro.specs.fastChargingRate.includes('Hypercharger'));
  });

  // --------------------------------------------------------------------------
  // Scenario 9: Old City Hyderabad (Charminar TG-12) Dense Traffic Commuter
  // --------------------------------------------------------------------------
  it('Scenario 9: Old City Hyderabad Dense Traffic Commuter with Stop-and-Go Regenerative Braking', () => {
    const iqube = getEVModelById('tvs-iqube-s-34')!;

    // 1. Simulation in heavy stop-and-go urban traffic in Charminar / Old City (TG-12)
    const trafficSim = simulateRange(iqube, {
      mode: 'city',
      payload: 'with_pillion',
      traffic: 'heavy_stop_go',
      temperature: 'telangana_heat',
      terrain: 'flat',
      commuteDistanceKm: 25
    });

    assert.ok(trafficSim.estimatedRangeKm >= 65);
    assert.ok(trafficSim.roundTripsPerCharge! >= 2.5);
    assert.equal(trafficSim.rechargeFeasibilityStatus, 'safe');

    // 2. On-Road Price in Hyderabad South (TG-12)
    const price = calculateTelanganaOnRoadPrice(iqube, 'TG-12');
    assert.equal(price.rtoCode, 'TG-12');
    assert.ok(price.districtName?.includes('Hyderabad South'));
    assert.equal(price.stateRoadTax, 0);
  });

  // --------------------------------------------------------------------------
  // Scenario 10: Mahabubnagar Rural to Jadcherla Industrial Corridor Commuter
  // --------------------------------------------------------------------------
  it('Scenario 10: Mahabubnagar to Jadcherla Industrial Corridor Commuter on Matter AERA 5000+', () => {
    const matter = getEVModelById('matter-aera-5000-plus')!;

    // 1. Commute: 45 km daily on state highway between Mahabubnagar (TG-06) and Jadcherla SEZ
    const highwaySim = simulateRange(matter, {
      mode: 'city',
      payload: 'solo',
      traffic: 'mixed_city',
      temperature: 'pleasant',
      terrain: 'plains',
      commuteDistanceKm: 45
    });

    assert.ok(highwaySim.estimatedRangeKm >= 100);
    assert.ok(highwaySim.batteryReserveRemainingPercent! > 50);

    // 2. Liquid-cooled motor & manual transmission motorcycle verification
    assert.equal(matter.category, 'motorcycle');
    assert.ok(
      matter.badges.some(b => b.toLowerCase().includes('gearbox') || b.toLowerCase().includes('liquid')) ||
      matter.features.some(f => f.toLowerCase().includes('gearbox') || f.toLowerCase().includes('liquid'))
    );

    // 3. 5-Year TCO savings in Mahabubnagar (TG-06)
    const savings = calculateSavings(matter, {
      dailyKm: 45,
      daysPerMonth: 26
    });

    assert.ok(savings.tco!.netTCOSavings > 100000, '5-Year net savings exceeds ₹1.0 Lakh');
  });

});
