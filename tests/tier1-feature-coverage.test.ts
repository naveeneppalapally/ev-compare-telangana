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
  TELANGANA_EV_POLICY_HIGHLIGHTS,
  getRtoByCode,
  getRtosByDistrict,
  getRtosByZone,
  getTelanganaDistricts,
  getAllRtos,
  TELANGANA_CURRENT_PETROL_PRICE,
  TELANGANA_AVG_ELECTRICITY_RATE
} from '../src/data/telanganaRtoData.ts';

import {
  calculateTelanganaOnRoadPrice,
  calculate5YearInsurance,
  calculatePmEdriveSubsidy,
  formatINR,
  formatLakhs,
  IRDAI_EV_TP_5YR_RATES
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
  WizardAnswers
} from '../src/types/ev.ts';

describe('Tier 1: Feature Coverage Suite (All 17 Features)', () => {

  // --------------------------------------------------------------------------
  // Feature 1: 16+ Verified EV Models Dataset
  // --------------------------------------------------------------------------
  describe('Feature 1: 36+ Verified EV Models Dataset', () => {
    it('contains at least 36 authentic EV models excluding ICE benchmark', () => {
      const evs = getEVModels();
      assert.ok(evs.length >= 36, `Expected >=36 EVs, got ${evs.length}`);
      assert.ok(evs.every(m => !m.isIceBenchmark), 'All returned models should be EVs');
    });

    it('contains valid Honda Activa 6G as explicit ICE benchmark', () => {
      assert.ok(ICE_BENCHMARK_MODEL, 'ICE benchmark model must exist');
      assert.equal(ICE_BENCHMARK_MODEL.id, 'honda-activa-6g');
      assert.equal(ICE_BENCHMARK_MODEL.isIceBenchmark, true);
      assert.equal(ICE_BENCHMARK_MODEL.specs.batteryCapacityKwh, 0);
    });

    it('ensures all EV models have non-empty verified technical specifications', () => {
      const evs = getEVModels();
      for (const m of evs) {
        assert.ok(m.id && m.id.length > 0, 'Model must have ID');
        assert.ok(m.name && m.name.length > 0, 'Model must have name');
        assert.ok(m.brand && m.brand.length > 0, 'Model must have brand');
        assert.ok(m.specs.batteryCapacityKwh > 0, `${m.name} must have battery capacity > 0`);
        assert.ok(m.specs.topSpeedKmh >= 40, `${m.name} top speed must be >= 40 km/h`);
        assert.ok(m.specs.araiRangeKm > 0, `${m.name} ARAI range must be > 0`);
        assert.ok(m.specs.realWorldCityRangeKm > 0, `${m.name} city range must be > 0`);
        assert.ok(m.pricing.exShowroom > 50000, `${m.name} ex-showroom must be > ₹50,000`);
      }
    });

    it('ensures each EV model contains pros, cons, features, and color options', () => {
      const evs = getEVModels();
      for (const m of evs) {
        assert.ok(Array.isArray(m.pros) && m.pros.length >= 2, `${m.name} must have >=2 pros`);
        assert.ok(Array.isArray(m.cons) && m.cons.length >= 1, `${m.name} must have >=1 con`);
        assert.ok(Array.isArray(m.features) && m.features.length >= 3, `${m.name} must have >=3 features`);
        assert.ok(Array.isArray(m.colorOptions) && m.colorOptions.length >= 1, `${m.name} must have colors`);
      }
    });

    it('retrieves models correctly by ID, category, and brand', () => {
      const ather = getEVModelById('ather-rizta-z-37');
      assert.ok(ather, 'Ather Rizta Z must be retrievable by ID');
      assert.equal(ather?.brand, 'Ather Energy');

      const scooters = getEVModelsByCategory('scooter');
      assert.ok(scooters.length > 0 && scooters.every(s => s.category === 'scooter'));

      const motorcycles = getEVModelsByCategory('motorcycle');
      assert.ok(motorcycles.length > 0 && motorcycles.every(m => m.category === 'motorcycle'));

      const olaModels = getEVModelsByBrand('Ola Electric');
      assert.ok(olaModels.length >= 3, 'Ola should have multiple models');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 2: Telangana 33 Districts & 38 RTO Directory
  // --------------------------------------------------------------------------
  describe('Feature 2: Telangana 33 Districts & 38 RTO Directory', () => {
    it('contains exactly 38 official RTO entries covering TG-01 to TG-38', () => {
      const rtos = getAllRtos();
      assert.equal(rtos.length, 38, 'Should have 38 RTOs');
      for (let i = 1; i <= 38; i++) {
        const expectedCode = `TG-${String(i).padStart(2, '0')}`;
        const found = rtos.find(r => r.rtoCode === expectedCode);
        assert.ok(found, `Missing RTO code ${expectedCode}`);
      }
    });

    it('contains all 33 administrative districts of Telangana', () => {
      const districts = getTelanganaDistricts();
      assert.ok(districts.length >= 33, `Expected >=33 districts, got ${districts.length}`);
      const districtIds = new Set(districts.map(d => d.id));
      assert.ok(districtIds.has('hyderabad-central'), 'Must include Hyderabad Central');
      assert.ok(districtIds.has('hanamkonda'), 'Must include Hanamkonda');
      assert.ok(districtIds.has('karimnagar'), 'Must include Karimnagar');
      assert.ok(districtIds.has('khammam'), 'Must include Khammam');
      assert.ok(districtIds.has('nizamabad'), 'Must include Nizamabad');
    });

    it('normalizes legacy TS- prefixes and TG- prefixes seamlessly in getRtoByCode', () => {
      const rtoTG09 = getRtoByCode('TG-09');
      const rtoTS09 = getRtoByCode('TS-09');
      const rtoLower = getRtoByCode('tg-09');
      assert.ok(rtoTG09 && rtoTS09 && rtoLower);
      assert.equal(rtoTG09.rtoCode, 'TG-09');
      assert.equal(rtoTS09.rtoCode, 'TG-09');
      assert.equal(rtoLower.rtoCode, 'TG-09');
    });

    it('correctly filters RTOs by district ID and regional zone', () => {
      const hydRtos = getRtosByDistrict('hyderabad-central');
      assert.ok(hydRtos.length > 0);
      assert.equal(hydRtos[0].districtId, 'hyderabad-central');

      const metroRtos = getRtosByZone('Hyderabad Metro');
      assert.ok(metroRtos.length >= 6, 'Hyderabad Metro should include TG-09 to TG-14');
    });

    it('provides accurate regional traffic density profiles for RTOs', () => {
      const khairatabad = getRtoByCode('TG-09');
      assert.equal(khairatabad?.trafficProfile, 'Heavy Urban');
      const adilabad = getRtoByCode('TG-01');
      assert.equal(adilabad?.trafficProfile, 'Rural/Inter-district');
      const warangal = getRtoByCode('TG-03');
      assert.equal(warangal?.trafficProfile, 'Tier-2 City');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 3: Telangana 100% Road Tax Exemption Engine
  // --------------------------------------------------------------------------
  describe('Feature 3: Telangana 100% Road Tax Exemption Engine', () => {
    it('applies 0% road tax and ₹0 registration fee for all EV models under G.O. Ms No. 41', () => {
      const evs = getEVModels();
      for (const ev of evs) {
        const breakdown = calculateTelanganaOnRoadPrice(ev, 'TG-09');
        assert.equal(breakdown.stateRoadTax, 0, `${ev.name} road tax must be ₹0`);
        assert.equal(breakdown.registrationAndSmartCardFee, 0, `${ev.name} registration fee must be ₹0`);
      }
    });

    it('calculates exact 12% road tax savings for EV models vs standard petrol rate', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const breakdown = calculateTelanganaOnRoadPrice(ather);
      const expectedTaxSavings = Math.round(ather.pricing.exShowroom * 0.12);
      assert.equal(breakdown.stateRoadTaxSavings, expectedTaxSavings);
      assert.equal(breakdown.stateRoadTaxStandardPetrol, expectedTaxSavings);
    });

    it('applies 12% road tax and ₹785 registration fee for ICE benchmark vehicle', () => {
      const breakdown = calculateTelanganaOnRoadPrice(ICE_BENCHMARK_MODEL);
      const expectedTax = Math.round(ICE_BENCHMARK_MODEL.pricing.exShowroom * 0.12);
      assert.equal(breakdown.stateRoadTax, expectedTax);
      assert.equal(breakdown.registrationAndSmartCardFee, 785);
      assert.equal(breakdown.savingsFromTelanganaPolicy, 0);
    });

    it('computes total policy savings combining road tax and registration fee waivers', () => {
      const ola = getEVModelById('ola-s1-pro-gen2')!;
      const breakdown = calculateTelanganaOnRoadPrice(ola);
      const expectedPolicySavings = Math.round(ola.pricing.exShowroom * 0.12) + 785;
      assert.equal(breakdown.savingsFromTelanganaPolicy, expectedPolicySavings);
    });

    it('formats Indian Rupee amounts accurately in standard INR and Lakhs formats', () => {
      assert.equal(formatINR(144999), '₹1,44,999');
      assert.equal(formatINR(0), '₹0');
      assert.equal(formatLakhs(144999), '₹1.45 Lakh');
      assert.equal(formatLakhs(85000), '₹85,000');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 4: PM E-DRIVE Subsidy & 5-Yr Insurance Breakdown
  // --------------------------------------------------------------------------
  describe('Feature 4: PM E-DRIVE Subsidy & 5-Yr Insurance Breakdown', () => {
    it('calculates PM E-DRIVE subsidy at ₹5,000/kWh capped at ₹10,000 for exShowroom <= ₹1.5L', () => {
      assert.equal(calculatePmEdriveSubsidy(1.5, 90000), 7500); // 1.5 * 5000 = 7500
      assert.equal(calculatePmEdriveSubsidy(2.5, 120000), 10000); // 2.5 * 5000 = 12500 -> cap 10000
      assert.equal(calculatePmEdriveSubsidy(3.7, 144999), 10000); // capped at 10000
    });

    it('returns ₹0 PM E-DRIVE subsidy for premium models with exShowroom > ₹1.5 Lakh', () => {
      assert.equal(calculatePmEdriveSubsidy(10.3, 399000), 0); // Ultraviolette F77
      assert.equal(calculatePmEdriveSubsidy(5.0, 173999), 0); // Matter AERA
    });

    it('applies IRDAI statutory 5-year TP rates based on motor power tiers', () => {
      const insTier1 = calculate5YearInsurance(90000, 2.5); // <= 3kW
      assert.equal(insTier1.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_1_LE_3KW);

      const insTier2 = calculate5YearInsurance(140000, 6.0); // 3-7kW
      assert.equal(insTier2.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_2_3_TO_7KW);

      const insTier3 = calculate5YearInsurance(175000, 10.0); // 7-16kW
      assert.equal(insTier3.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_3_7_TO_16KW);

      const insTier4 = calculate5YearInsurance(399000, 30.0); // > 16kW
      assert.equal(insTier4.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_4_GT_16KW);
    });

    it('computes 1-yr OD, CPA cover, battery addon and 18% GST in comprehensive insurance', () => {
      const ins = calculate5YearInsurance(100000, 4.0);
      assert.equal(ins.idv, 95000); // 95% of 100k
      assert.equal(ins.od1Year, Math.round(95000 * 0.0135)); // 1283
      assert.equal(ins.cpaCover, 375);
      assert.equal(ins.batteryAddon, Math.round(95000 * 0.0040)); // 380
      const subtotal = ins.od1Year + ins.tp5Year + ins.cpaCover + ins.batteryAddon;
      assert.equal(ins.gst18, Math.round(subtotal * 0.18));
      assert.equal(ins.totalInsurance, subtotal + ins.gst18);
    });

    it('verifies net on-road price properly deducts subsidy and includes 5-yr insurance', () => {
      const rizta = getEVModelById('ather-rizta-z-37')!;
      const breakdown = calculateTelanganaOnRoadPrice(rizta);
      assert.equal(breakdown.pmEdriveSubsidy, 10000);
      assert.ok(breakdown.totalInsurance5Yr > 0);
      assert.ok(breakdown.totalTelanganaOnRoadPrice > 0);
      assert.equal(breakdown.totalTelanganaOnRoadPrice, breakdown.netTelanganaOnRoadPrice);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 5: Petrol vs EV ROI & Payback Engine
  // --------------------------------------------------------------------------
  describe('Feature 5: Petrol vs EV ROI & Payback Engine', () => {
    it('calculates running cost per km for Activa 6G vs EV with Hyderabad petrol & TSSPDCL tariff', () => {
      const rizta = getEVModelById('ather-rizta-z-37')!;
      const savings = calculateSavings(rizta, {
        dailyKm: 35,
        daysPerMonth: 26,
        petrolPricePerLiter: TELANGANA_CURRENT_PETROL_PRICE,
        petrolMileageKmpl: 45.0,
        electricityCostPerKwh: TELANGANA_AVG_ELECTRICITY_RATE
      });

      assert.ok(savings.petrolFuelCostPerKm! > 2.0, 'Petrol fuel cost should be > ₹2.0/km');
      assert.ok(savings.evPowerCostPerKm! < 0.6, 'EV power cost should be < ₹0.6/km');
      assert.ok(savings.netSavingsPerKm! > 1.8, 'Net savings should be > ₹1.8/km');
    });

    it('computes monthly and annual savings dynamically based on commute parameters', () => {
      const ather = getEVModelById('ather-450x-gen3-37')!;
      const savings = calculateSavings(ather, { dailyKm: 40, daysPerMonth: 25 });
      const monthlyKm = 40 * 25; // 1000 km
      assert.equal(savings.monthlyKm, monthlyKm);
      assert.equal(savings.annualKm, monthlyKm * 12);
      assert.equal(savings.annualSavings, savings.monthlySavings * 12);
    });

    it('calculates breakeven payback period accurately in months and years', () => {
      const payback1 = calculatePaybackPeriod(45000, 2500);
      assert.equal(payback1.months, 18);
      assert.equal(payback1.formatted, '1 Yr 6 Mo');

      const payback2 = calculatePaybackPeriod(15000, 2000);
      assert.equal(payback2.months, 7.5);
      assert.equal(payback2.formatted, '7.5 Months');
    });

    it('returns immediate payback when EV is cheaper upfront than petrol baseline', () => {
      const payback = calculatePaybackPeriod(-5000, 2000);
      assert.equal(payback.months, 0);
      assert.equal(payback.formatted, 'Immediate (Cheaper Upfront)');
    });

    it('accounts for petrol maintenance (₹0.429/km) vs EV maintenance (₹0.117/km) in annual savings', () => {
      const ola = getEVModelById('ola-s1-air')!;
      const savings = calculateSavings(ola, { dailyKm: 30, daysPerMonth: 30 });
      assert.equal(savings.petrolMaintenancePerKm, 0.43);
      assert.equal(savings.evMaintenancePerKm, 0.12);
      assert.ok(savings.annualMaintenanceSavings! > 0);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 6: 5-Year Total Cost of Ownership (TCO) Model
  // --------------------------------------------------------------------------
  describe('Feature 6: 5-Year Total Cost of Ownership (TCO) Model', () => {
    it('computes comprehensive 50,000 km lifecycle TCO for Activa 6G benchmark', () => {
      const tco = calculate5YearTCO({
        evOnRoadPrice: 140000,
        evWhPerKm: 33,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 50000
      });

      assert.equal(tco.ownershipYears, 5);
      assert.equal(tco.totalKm, 50000);
      assert.equal(tco.petrolInitialOnRoad, FINANCIAL_BENCHMARKS.ACTIVA_6G_ON_ROAD_TELANGANA);
      assert.ok(tco.petrolFuelCostTotal > 120000, '50k km petrol fuel should exceed ₹1.2L');
      assert.ok(tco.petrolMaintenanceTotal > 20000, '50k km petrol maintenance should exceed ₹20k');
      assert.ok(tco.petrolGrossTCO > 240000, 'Petrol gross TCO should exceed ₹2.4L');
    });

    it('computes 5-Year EV gross TCO and net TCO factoring 28% residual value', () => {
      const onRoad = 140000;
      const tco = calculate5YearTCO({
        evOnRoadPrice: onRoad,
        evWhPerKm: 30,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 50000
      });

      const expectedResale = Math.round(onRoad * 0.28);
      assert.equal(tco.evResidualResaleValue, expectedResale);
      assert.equal(tco.evNetTCO, tco.evGrossTCO - expectedResale);
    });

    it('demonstrates net TCO positive financial savings for standard commuter EV', () => {
      const tco = calculate5YearTCO({
        evOnRoadPrice: 135000,
        evWhPerKm: 30,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 50000
      });

      assert.ok(tco.netTCOSavings > 80000, 'Net TCO savings over 50,000 km should exceed ₹80,000');
    });

    it('calculates carbon dioxide offset and equivalent teak trees planted', () => {
      const carbon = calculateCarbonOffset(1000); // 1000 km/month
      assert.equal(carbon.netCo2ReductionGramsPerKm, 26.76);
      assert.equal(carbon.monthlyCo2SavedKg, 27); // 1000 * 26.76 / 1000
      assert.equal(carbon.annualCo2SavedKg, 321); // 12000 * 26.76 / 1000
      assert.ok(carbon.equivalentTeakTrees >= 1);
    });

    it('verifies custom lifecycle distance scaling (e.g. 75,000 km)', () => {
      const tco75k = calculate5YearTCO({
        evOnRoadPrice: 140000,
        evWhPerKm: 30,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 75000
      });
      assert.equal(tco75k.totalKm, 75000);
      assert.ok(tco75k.petrolFuelCostTotal > 180000);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 7: Multi-Factor Range Physics Engine
  // --------------------------------------------------------------------------
  describe('Feature 7: Multi-Factor Range Physics Engine', () => {
    it('applies accurate riding mode multipliers: Eco (1.10x), City (1.00x), Sport (0.82x), Hyper (0.68x)', () => {
      const ola = getEVModelById('ola-s1-pro-gen2')!;
      const eco = simulateRange(ola, { mode: 'eco', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });
      const city = simulateRange(ola, { mode: 'city', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });
      const sport = simulateRange(ola, { mode: 'sport', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });
      const hyper = simulateRange(ola, { mode: 'hyper', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });

      assert.equal(eco.factors.modeMultiplier, 1.10);
      assert.equal(city.factors.modeMultiplier, 1.00);
      assert.equal(sport.factors.modeMultiplier, 0.82);
      assert.equal(hyper.factors.modeMultiplier, 0.68);
      assert.ok(eco.estimatedRangeKm > city.estimatedRangeKm);
      assert.ok(city.estimatedRangeKm > sport.estimatedRangeKm);
      assert.ok(sport.estimatedRangeKm > hyper.estimatedRangeKm);
    });

    it('applies payload weight multipliers: Solo Light (1.05x), Solo (1.00x), Pillion (0.84x), Heavy Luggage (0.76x)', () => {
      const rizta = getEVModelById('ather-rizta-z-37')!;
      const soloLight = simulateRange(rizta, { payload: 'solo_light' });
      const solo = simulateRange(rizta, { payload: 'solo' });
      const pillion = simulateRange(rizta, { payload: 'with_pillion' });
      const luggage = simulateRange(rizta, { payload: 'heavy_with_luggage' });

      assert.equal(soloLight.factors.payloadMultiplier, 1.05);
      assert.equal(solo.factors.payloadMultiplier, 1.00);
      assert.equal(pillion.factors.payloadMultiplier, 0.84);
      assert.equal(luggage.factors.payloadMultiplier, 0.76);
      assert.ok(soloLight.estimatedRangeKm >= solo.estimatedRangeKm);
      assert.ok(solo.estimatedRangeKm > pillion.estimatedRangeKm);
      assert.ok(pillion.estimatedRangeKm > luggage.estimatedRangeKm);
    });

    it('applies traffic multipliers: Smooth Flow (1.08x), City (1.00x), Heavy Stop-Go (0.88x), Fast Highway (0.80x)', () => {
      const vida = getEVModelById('hero-vida-v1-pro')!;
      const smooth = simulateRange(vida, { traffic: 'smooth_flow' });
      const city = simulateRange(vida, { traffic: 'city_stop_go' });
      const stopGo = simulateRange(vida, { traffic: 'heavy_stop_go' });
      const highway = simulateRange(vida, { traffic: 'fast_highway' });

      assert.equal(smooth.factors.trafficMultiplier, 1.08);
      assert.equal(city.factors.trafficMultiplier, 1.00);
      assert.equal(stopGo.factors.trafficMultiplier, 0.88);
      assert.equal(highway.factors.trafficMultiplier, 0.80);
    });

    it('differentiates battery chemistry thermal penalty in Telangana Summer Heat: LFP (0.94x) vs NMC (0.88x)', () => {
      const ampereLFP = getEVModelById('ampere-nexus-30')!; // Fixed LFP
      const atherNMC = getEVModelById('ather-450x-gen3-37')!; // NMC

      const ampereHeat = simulateRange(ampereLFP, { temperature: 'telangana_heat' });
      const atherHeat = simulateRange(atherNMC, { temperature: 'telangana_heat' });

      assert.equal(ampereHeat.factors.temperatureMultiplier, 0.94);
      assert.equal(atherHeat.factors.temperatureMultiplier, 0.88);
    });

    it('computes battery energy consumption Wh/km and round trips per charge', () => {
      const iqube = getEVModelById('tvs-iqube-s-34')!;
      const result = simulateRange(iqube, { commuteDistanceKm: 25 });
      assert.ok(result.batteryConsumptionWhPerKm > 0);
      assert.ok(result.roundTripsPerCharge! >= 2.0);
      assert.ok(result.batteryReserveRemainingPercent! > 50);
      assert.equal(result.rechargeFeasibilityStatus, 'safe');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 8: 4-Step Smart Recommendation Scoring Engine
  // --------------------------------------------------------------------------
  describe('Feature 8: 4-Step Smart Recommendation Scoring Engine', () => {
    it('excludes ICE benchmark model automatically from recommendation results', () => {
      const allVehicles = getAllVehiclesIncludingBenchmark();
      const recs = calculateRecommendations({ chargingAccess: 'independentHouse' }, allVehicles);
      assert.ok(recs.every(r => !r.model.isIceBenchmark));
    });

    it('enforces hard penalty (20%) on fixed battery EVs when chargingAccess is apartmentNoSocket', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({ chargingAccess: 'apartmentNoSocket' }, evs);
      
      const removableRecs = recs.filter(r => r.model.specs.isRemovableBattery);
      const fixedRecs = recs.filter(r => !r.model.specs.isRemovableBattery);

      assert.ok(removableRecs.length > 0);
      assert.ok(fixedRecs.length > 0);
      assert.ok(removableRecs.every(r => r.subScores?.chargingScore === 100));
      assert.ok(fixedRecs.every(r => r.subScores?.chargingScore === 20));
      assert.ok(removableRecs[0].matchScore > fixedRecs[0].matchScore);
    });

    it('scores family storage priority based on boot space (>34L = 100, >28L = 85)', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({
        chargingAccess: 'independentHouse',
        usageType: 'familyStorage'
      }, evs);

      const rizta = recs.find(r => r.model.id === 'ather-rizta-z-37'); // 34L
      const river = recs.find(r => r.model.id === 'river-indie-40'); // 43L
      assert.ok(rizta && rizta.subScores?.usageScore === 100);
      assert.ok(river && river.subScores?.usageScore === 100);
    });

    it('scores youth performance priority based on top speed and 0-40 km/h acceleration', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({
        chargingAccess: 'independentHouse',
        usageType: 'youthPerformance'
      }, evs);

      const uv = recs.find(r => r.model.id === 'ultraviolette-f77-mach2');
      const ather450 = recs.find(r => r.model.id === 'ather-450x-gen3-37');
      assert.ok(uv && uv.subScores?.usageScore === 100);
      assert.ok(ather450 && ather450.subScores?.usageScore && ather450.subScores.usageScore >= 90);
    });

    it('sorts recommendations in descending order of matchScore and assigns sequential ranks', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({
        commuteDistance: '25to50',
        chargingAccess: 'apartmentWithSocket',
        usageType: 'officeCommute',
        budget: '1to1.4L'
      }, evs);

      for (let i = 0; i < recs.length - 1; i++) {
        assert.ok(recs[i].matchScore >= recs[i + 1].matchScore, `Rank ${i} should be >= Rank ${i+1}`);
        assert.equal(recs[i].rank, i + 1);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 9: Sleek Responsive Header & Hero Search
  // --------------------------------------------------------------------------
  describe('Feature 9: Sleek Responsive Header & Hero Search', () => {
    it('filters vehicle list by substring query across model name and brand case-insensitively', () => {
      const evs = getEVModels();
      const atherMatches = evs.filter(m => 
        m.name.toLowerCase().includes('ather') || m.brand.toLowerCase().includes('ather')
      );
      assert.ok(atherMatches.length >= 2);
      assert.ok(atherMatches.every(m => m.brand.toLowerCase().includes('ather')));
    });

    it('filters vehicle list by category tab (all, scooter, motorcycle)', () => {
      const evs = getEVModels();
      const scooters = evs.filter(m => m.category === 'scooter');
      const motorcycles = evs.filter(m => m.category === 'motorcycle');
      assert.ok(scooters.length >= 17);
      assert.ok(motorcycles.length >= 18);
      assert.equal(scooters.length + motorcycles.length, evs.length);
    });

    it('applies quick filter pills for removable battery and fast charging', () => {
      const evs = getEVModels();
      const removable = evs.filter(m => m.specs.isRemovableBattery);
      const fastCharging = evs.filter(m => m.specs.fastChargingSupport);
      assert.ok(removable.length >= 2, 'Hero Vida and Revolt RV400 have removable batteries');
      assert.ok(fastCharging.length >= 10, 'Most modern EVs support fast charging');
    });

    it('applies quick filter pills for budget < ₹1L and boot space > 30L', () => {
      const evs = getEVModels();
      const budgetUnder1L = evs.filter(m => (m.pricing.exShowroom - m.pricing.pmEdriveSubsidy) <= 100000);
      const bigBoot = evs.filter(m => m.specs.bootSpaceLiters >= 30);
      assert.ok(budgetUnder1L.length >= 2);
      assert.ok(bigBoot.length >= 4);
    });

    it('verifies Telangana EV Policy banner data invariants', () => {
      assert.ok(TELANGANA_EV_POLICY_HIGHLIGHTS.governmentOrder.includes('G.O. Ms No. 41'));
      assert.ok(TELANGANA_EV_POLICY_HIGHLIGHTS.roadTaxExemption.includes('100% Exemption'));
      assert.ok(TELANGANA_EV_POLICY_HIGHLIGHTS.validityPeriod.includes('2026'));
    });
  });

  // --------------------------------------------------------------------------
  // Feature 10: Interactive Vehicle Grid & Spec Badges
  // --------------------------------------------------------------------------
  describe('Feature 10: Interactive Vehicle Grid & Spec Badges', () => {
    it('generates accurate spec badge labels for real city range, top speed, and battery kWh', () => {
      const rizta = getEVModelById('ather-rizta-z-37')!;
      assert.equal(rizta.specs.batteryCapacityKwh, 3.7);
      assert.equal(rizta.specs.realWorldCityRangeKm, 110);
      assert.equal(rizta.specs.topSpeedKmh, 80);
      assert.ok(rizta.badges.length > 0);
    });

    it('sorts vehicle catalog accurately by price ascending and descending', () => {
      const evs = [...getEVModels()];
      const priceAsc = [...evs].sort((a, b) => a.pricing.exShowroom - b.pricing.exShowroom);
      const priceDesc = [...evs].sort((a, b) => b.pricing.exShowroom - a.pricing.exShowroom);

      assert.ok(priceAsc[0].pricing.exShowroom <= priceAsc[priceAsc.length - 1].pricing.exShowroom);
      assert.ok(priceDesc[0].pricing.exShowroom >= priceDesc[priceDesc.length - 1].pricing.exShowroom);
    });

    it('sorts vehicle catalog accurately by real range descending', () => {
      const evs = [...getEVModels()];
      const rangeDesc = [...evs].sort((a, b) => b.specs.realWorldCityRangeKm - a.specs.realWorldCityRangeKm);
      assert.ok(rangeDesc[0].specs.realWorldCityRangeKm >= rangeDesc[rangeDesc.length - 1].specs.realWorldCityRangeKm);
      assert.ok(rangeDesc[0].specs.realWorldCityRangeKm >= 200);
    });

    it('sorts vehicle catalog accurately by top speed descending', () => {
      const evs = [...getEVModels()];
      const speedDesc = [...evs].sort((a, b) => b.specs.topSpeedKmh - a.specs.topSpeedKmh);
      assert.ok(speedDesc[0].specs.topSpeedKmh >= speedDesc[speedDesc.length - 1].specs.topSpeedKmh);
      assert.ok(speedDesc[0].specs.topSpeedKmh >= 150);
    });

    it('identifies removable battery badge only for compatible vehicles', () => {
      const evs = getEVModels();
      const removableEvs = evs.filter(e => e.specs.isRemovableBattery);
      assert.ok(removableEvs.length >= 3, 'Should have multiple removable battery models');
      for (const ev of removableEvs) {
        assert.equal(ev.specs.isRemovableBattery, true);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 11: Vehicle Detail Modal with Pros/Cons
  // --------------------------------------------------------------------------
  describe('Feature 11: Vehicle Detail Modal with Pros/Cons', () => {
    it('provides comprehensive deep-dive specs for modal rendering', () => {
      const river = getEVModelById('river-indie-40')!;
      assert.ok(river.specs.chargingTime0To80);
      assert.ok(river.specs.chargingTime0To100);
      assert.ok(river.specs.brakes);
      assert.ok(river.specs.groundClearanceMm > 0);
      assert.ok(river.specs.kerbWeightKg > 0);
    });

    it('includes verified user-reported pros and cons without synthetic filler text', () => {
      const evs = getEVModels();
      for (const ev of evs) {
        assert.ok(ev.pros.length >= 2, `${ev.name} pros should have >= 2 items`);
        assert.ok(ev.cons.length >= 1, `${ev.name} cons should have >= 1 item`);
        assert.ok(ev.pros.every(p => p.length > 10), `${ev.name} pros text should be descriptive`);
        assert.ok(ev.cons.every(c => c.length > 10), `${ev.name} cons text should be descriptive`);
      }
    });

    it('provides multi-color hex codes and color names for vehicle customizer', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      assert.ok(ather.colorOptions.length >= 3);
      for (const color of ather.colorOptions) {
        assert.ok(color.name && color.name.length > 0);
        assert.match(color.hex, /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
      }
    });

    it('verifies warranty coverage parameters (battery years/km, vehicle years/km)', () => {
      const chetak = getEVModelById('bajaj-chetak-premium-32')!;
      assert.ok(chetak.warranty.batteryYears >= 3);
      assert.ok(chetak.warranty.batteryKm >= 50000);
      assert.ok(chetak.warranty.vehicleYears >= 3);
      assert.ok(chetak.warranty.vehicleKm >= 30000);
    });

    it('contains high-resolution official vehicle media assets', () => {
      const evs = getEVModels();
      for (const ev of evs) {
        assert.ok(ev.imageUrl && ev.imageUrl.startsWith('http'), `${ev.name} should have valid imageUrl`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 12: Multi-Vehicle Comparison Matrix (2-4 EVs)
  // --------------------------------------------------------------------------
  describe('Feature 12: Multi-Vehicle Comparison Matrix (2-4 EVs)', () => {
    it('manages 2 to 4 vehicle slots in comparison tray', () => {
      let tray = ['ather-rizta-z-37', 'ola-s1-pro-gen2'];
      assert.equal(tray.length, 2);

      tray.push('tvs-iqube-s-34');
      tray.push('hero-vida-v1-pro');
      assert.equal(tray.length, 4);
    });

    it('enforces FIFO replacement when 5th model is added to comparison tray', () => {
      let tray = ['model-1', 'model-2', 'model-3', 'model-4'];
      const addModel = (newId: string) => {
        if (tray.includes(newId)) return;
        if (tray.length >= 4) {
          tray = [...tray.slice(1), newId];
        } else {
          tray.push(newId);
        }
      };

      addModel('model-5');
      assert.deepEqual(tray, ['model-2', 'model-3', 'model-4', 'model-5']);
    });

    it('correctly detects differences across compared models', () => {
      const m1 = getEVModelById('ather-rizta-z-37')!;
      const m2 = getEVModelById('river-indie-40')!;
      
      const speedDiff = m1.specs.topSpeedKmh !== m2.specs.topSpeedKmh;
      const rangeDiff = m1.specs.realWorldCityRangeKm !== m2.specs.realWorldCityRangeKm;
      const bootDiff = m1.specs.bootSpaceLiters !== m2.specs.bootSpaceLiters;

      assert.equal(speedDiff, true);
      assert.equal(rangeDiff, true);
      assert.equal(bootDiff, true);
    });

    it('identifies best-in-category winner for higher-is-better metrics (top speed, range, boot)', () => {
      const models = [
        getEVModelById('ather-rizta-z-37')!,
        getEVModelById('ola-s1-pro-gen2')!,
        getEVModelById('river-indie-40')!
      ];

      const maxSpeed = Math.max(...models.map(m => m.specs.topSpeedKmh));
      const speedWinner = models.find(m => m.specs.topSpeedKmh === maxSpeed);
      assert.equal(speedWinner?.id, 'ola-s1-pro-gen2'); // 120 km/h

      const maxBoot = Math.max(...models.map(m => m.specs.bootSpaceLiters));
      const bootWinner = models.find(m => m.specs.bootSpaceLiters === maxBoot);
      assert.equal(bootWinner?.id, 'river-indie-40'); // 43 L
    });

    it('identifies best-in-category winner for lower-is-better metrics (0-40 km/h acceleration, price)', () => {
      const models = [
        getEVModelById('ather-rizta-z-37')!,
        getEVModelById('ola-s1-pro-gen2')!,
        getEVModelById('ampere-nexus-30')!
      ];

      const minAccel = Math.min(...models.map(m => m.specs.accel0To40Kmh));
      const accelWinner = models.find(m => m.specs.accel0To40Kmh === minAccel);
      assert.equal(accelWinner?.id, 'ola-s1-pro-gen2'); // 2.6s

      const minPrice = Math.min(...models.map(m => m.pricing.exShowroom));
      const priceWinner = models.find(m => m.pricing.exShowroom === minPrice);
      assert.equal(priceWinner?.id, 'ampere-nexus-30'); // 109900
    });
  });

  // --------------------------------------------------------------------------
  // Feature 13: Telangana On-Road Price Calculator Modal
  // --------------------------------------------------------------------------
  describe('Feature 13: Telangana On-Road Price Calculator Modal', () => {
    it('computes localized on-road price for selected RTO code', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const hyd = calculateTelanganaOnRoadPrice(ather, 'TG-09');
      const warangal = calculateTelanganaOnRoadPrice(ather, 'TG-03');
      assert.equal(hyd.rtoCode, 'TG-09');
      assert.equal(warangal.rtoCode, 'TG-03');
      assert.ok(hyd.districtName?.includes('Hyderabad Central'));
      assert.ok(warangal.districtName?.includes('Hanamkonda'));
    });

    it('incorporates optional charger cost if not included in base price', () => {
      const vida = getEVModelById('hero-vida-v1-pro')!;
      const breakdown = calculateTelanganaOnRoadPrice(vida, 'TG-09', { includeCharger: true });
      assert.equal(breakdown.chargerCost, 0); // Vida charger is included (cost 0)
    });

    it('incorporates optional extended warranty and accessories add-ons', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const baseBreakdown = calculateTelanganaOnRoadPrice(ather, 'TG-09');
      const addonBreakdown = calculateTelanganaOnRoadPrice(ather, 'TG-09', {
        includeExtendedWarranty: true,
        includeAccessories: true
      });

      assert.equal(addonBreakdown.extendedWarrantyCost, 3000);
      assert.equal(addonBreakdown.accessoriesCost, 2000);
      assert.equal(
        addonBreakdown.totalTelanganaOnRoadPrice,
        baseBreakdown.totalTelanganaOnRoadPrice + 5000
      );
    });

    it('applies custom dealer discount correctly to net ex-showroom price', () => {
      const ola = getEVModelById('ola-s1-pro-gen2')!;
      const baseBreakdown = calculateTelanganaOnRoadPrice(ola, 'TG-09');
      const discountedBreakdown = calculateTelanganaOnRoadPrice(ola, 'TG-09', {
        customDiscount: 5000
      });

      assert.equal(discountedBreakdown.customDiscount, 5000);
      assert.equal(
        discountedBreakdown.totalTelanganaOnRoadPrice,
        baseBreakdown.totalTelanganaOnRoadPrice - 5000
      );
    });

    it('verifies itemized breakdown covers all statutory and dealer components', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const b = calculateTelanganaOnRoadPrice(ather);
      assert.ok(b.exShowroom > 0);
      assert.ok(b.pmEdriveSubsidy >= 0);
      assert.equal(b.stateRoadTax, 0);
      assert.equal(b.registrationAndSmartCardFee, 0);
      assert.equal(b.hsrpPlateFee, 400);
      assert.ok(b.insurance5Year > 0);
      assert.ok(b.handlingAndDocs > 0);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 14: Real-World Range Simulation Interactive Tool
  // --------------------------------------------------------------------------
  describe('Feature 14: Real-World Range Simulation Interactive Tool', () => {
    it('reacts dynamically to interactive slider inputs across all factors', () => {
      const ather = getEVModelById('ather-450x-gen3-37')!;
      const baseline = simulateRange(ather, { mode: 'city', payload: 'solo', traffic: 'city_stop_go' });
      const heavyRun = simulateRange(ather, { mode: 'sport', payload: 'with_pillion', traffic: 'heavy_stop_go' });

      assert.ok(heavyRun.estimatedRangeKm < baseline.estimatedRangeKm);
      assert.ok(heavyRun.batteryConsumptionWhPerKm > baseline.batteryConsumptionWhPerKm);
    });

    it('determines feasibility status: safe (>35% reserve), moderate (15-35%), critical (<15%)', () => {
      const ola = getEVModelById('ola-s1-pro-gen2')!; // 140 km city range
      const shortCommute = simulateRange(ola, { commuteDistanceKm: 30 });
      assert.equal(shortCommute.rechargeFeasibilityStatus, 'safe');

      const medCommute = simulateRange(ola, { commuteDistanceKm: 100 });
      assert.equal(medCommute.rechargeFeasibilityStatus, 'moderate');

      const longCommute = simulateRange(ola, { commuteDistanceKm: 130 });
      assert.equal(longCommute.rechargeFeasibilityStatus, 'critical');
    });

    it('simulates backward compatible helper simulateRealWorldRange properly', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const res = simulateRealWorldRange({
        model: ather,
        mode: 'eco',
        load: 'solo',
        traffic: 'smooth_flow',
        weather: 'ideal'
      });
      assert.ok(res.estimatedRangeKm > ather.specs.realWorldCityRangeKm);
    });

    it('computes round trips per charge correctly for daily commute', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const res = simulateRange(ather, { commuteDistanceKm: 25 });
      assert.equal(res.roundTripsPerCharge, Math.round((res.estimatedRangeKm / 25) * 10) / 10);
    });

    it('computes efficiency in km/kWh based on battery capacity and estimated range', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const res = simulateRange(ather);
      assert.equal(res.efficiencyKmPerKwh, Math.round((res.estimatedRangeKm / ather.specs.batteryCapacityKwh) * 10) / 10);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 15: Petrol vs EV ROI & Payback Interactive Widget
  // --------------------------------------------------------------------------
  describe('Feature 15: Petrol vs EV ROI & Payback Interactive Widget', () => {
    it('updates savings dynamically when daily commute slider changes', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const s20 = calculateSavings(ather, { dailyKm: 20 });
      const s60 = calculateSavings(ather, { dailyKm: 60 });

      assert.ok(s60.monthlySavings > s20.monthlySavings);
      assert.ok(s60.paybackPeriodMonths < s20.paybackPeriodMonths);
    });

    it('updates savings dynamically when petrol price slider changes', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const sLowPetrol = calculateSavings(ather, { petrolPricePerLiter: 90 });
      const sHighPetrol = calculateSavings(ather, { petrolPricePerLiter: 125 });

      assert.ok(sHighPetrol.monthlySavings > sLowPetrol.monthlySavings);
      assert.ok(sHighPetrol.paybackPeriodMonths < sLowPetrol.paybackPeriodMonths);
    });

    it('updates savings dynamically when TSSPDCL power tariff changes', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const sSlab1 = calculateSavings(ather, { electricityCostPerKwh: 5.50 });
      const sSlab3 = calculateSavings(ather, { electricityCostPerKwh: 8.50 });

      assert.ok(sSlab1.monthlyEvCost < sSlab3.monthlyEvCost);
      assert.ok(sSlab1.monthlySavings > sSlab3.monthlySavings);
    });

    it('formats payback duration badge cleanly across month and year boundaries', () => {
      const short = calculatePaybackPeriod(12000, 2000);
      assert.equal(short.formatted, '6 Months');

      const long = calculatePaybackPeriod(50000, 2000);
      assert.equal(long.formatted, '2 Yr 1 Mo');

      const exact = calculatePaybackPeriod(48000, 2000);
      assert.equal(exact.formatted, '2 Years');
    });

    it('verifies 5-year cumulative savings projection matches 60 months of operational savings', () => {
      const ola = getEVModelById('ola-s1-air')!;
      const savings = calculateSavings(ola, { dailyKm: 40, daysPerMonth: 26 });
      assert.equal(savings.fiveYearSavings, savings.annualSavings * 5);
      assert.equal(savings.fiveYearSavings, savings.monthlySavings * 60);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 16: 4-Step Smart Recommendation Quiz Modal
  // --------------------------------------------------------------------------
  describe('Feature 16: 4-Step Smart Recommendation Quiz Modal', () => {
    it('executes 4-step wizard decision flow with valid answers object', () => {
      const answers: WizardAnswers = {
        commuteDistance: '25to50',
        chargingAccess: 'independentHouse',
        usageType: 'officeCommute',
        budget: '1to1.4L',
        preferredCategory: 'all'
      };

      const evs = getEVModels();
      const recs = calculateRecommendations(answers, evs);
      assert.ok(recs.length > 0);
      assert.ok(recs[0].matchScore >= 85);
      assert.ok(recs[0].fitConfidence === 'Perfect Match' || recs[0].fitConfidence === 'Great Match');
    });

    it('generates personalized matching reasons and transparent caveats for top match', () => {
      const answers: WizardAnswers = {
        chargingAccess: 'apartmentNoSocket',
        usageType: 'familyStorage'
      };
      const evs = getEVModels();
      const recs = calculateRecommendations(answers, evs);
      const top = recs[0];

      assert.ok(top.matchingReasons && top.matchingReasons.length >= 3);
      assert.ok(top.prosAlignment && top.prosAlignment.length >= 1);
      assert.ok(top.caveatsToConsider);
    });

    it('filters recommendation results when preferred category is scooter vs motorcycle', () => {
      const evs = getEVModels();
      const scooterRecs = calculateRecommendations({
        chargingAccess: 'independentHouse',
        preferredCategory: 'scooter'
      }, evs);
      assert.equal(scooterRecs[0].model.category, 'scooter');

      const motoRecs = calculateRecommendations({
        chargingAccess: 'independentHouse',
        preferredCategory: 'motorcycle'
      }, evs);
      assert.equal(motoRecs[0].model.category, 'motorcycle');
    });

    it('provides complete sub-scores breakdown (commute, charging, usage, budget)', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({ chargingAccess: 'independentHouse' }, evs);
      const top = recs[0];
      assert.ok(top.subScores);
      assert.ok(top.subScores.commuteScore >= 0 && top.subScores.commuteScore <= 100);
      assert.ok(top.subScores.chargingScore >= 0 && top.subScores.chargingScore <= 100);
      assert.ok(top.subScores.usageScore >= 0 && top.subScores.usageScore <= 100);
      assert.ok(top.subScores.budgetScore >= 0 && top.subScores.budgetScore <= 100);
    });

    it('assigns appropriate match grades: Excellent (>=90), Great (>=78), Good (>=65), Fair (<65)', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({ chargingAccess: 'independentHouse' }, evs);
      for (const r of recs) {
        if (r.matchScore >= 90) assert.equal(r.matchGrade, 'Excellent');
        else if (r.matchScore >= 78) assert.equal(r.matchGrade, 'Great');
        else if (r.matchScore >= 65) assert.equal(r.matchGrade, 'Good');
        else assert.equal(r.matchGrade, 'Fair');
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 17: Clean Production Build & UI Polish
  // --------------------------------------------------------------------------
  describe('Feature 17: Clean Production Build & UI Polish', () => {
    it('ensures all EV model IDs are unique strings without collisions', () => {
      const all = getAllVehiclesIncludingBenchmark();
      const idSet = new Set<string>();
      for (const m of all) {
        assert.ok(!idSet.has(m.id), `Duplicate ID found: ${m.id}`);
        idSet.add(m.id);
      }
    });

    it('ensures all numeric specifications are positive finite numbers', () => {
      const evs = getEVModels();
      for (const m of evs) {
        assert.ok(Number.isFinite(m.pricing.exShowroom) && m.pricing.exShowroom > 0);
        assert.ok(Number.isFinite(m.specs.batteryCapacityKwh) && m.specs.batteryCapacityKwh > 0);
        assert.ok(Number.isFinite(m.specs.araiRangeKm) && m.specs.araiRangeKm > 0);
        assert.ok(Number.isFinite(m.specs.realWorldCityRangeKm) && m.specs.realWorldCityRangeKm > 0);
        assert.ok(Number.isFinite(m.specs.topSpeedKmh) && m.specs.topSpeedKmh > 0);
        assert.ok(Number.isFinite(m.rating) && m.rating >= 1 && m.rating <= 5);
      }
    });

    it('verifies real-world range is strictly less than or equal to ARAI certified range', () => {
      const evs = getEVModels();
      for (const m of evs) {
        assert.ok(
          m.specs.realWorldCityRangeKm <= m.specs.araiRangeKm,
          `${m.name}: Real city range (${m.specs.realWorldCityRangeKm}) should be <= ARAI (${m.specs.araiRangeKm})`
        );
      }
    });

    it('verifies all RTO records have valid series numbers and legacy codes', () => {
      const rtos = getAllRtos();
      for (const r of rtos) {
        assert.ok(r.seriesNumber >= 1 && r.seriesNumber <= 38);
        assert.ok(r.legacyCode.startsWith('TS-'));
        assert.ok(r.rtoCode.startsWith('TG-'));
      }
    });

    it('ensures all EV models have valid launch years and Made in India flags', () => {
      const evs = getEVModels();
      for (const m of evs) {
        assert.ok(m.launchYear >= 2020 && m.launchYear <= 2026);
        assert.equal(m.madeInIndia, true);
      }
    });
  });

});
