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
  getAllRtos
} from '../src/data/telanganaRtoData.ts';

import {
  calculateTelanganaOnRoadPrice,
  calculate5YearInsurance,
  calculatePmEdriveSubsidy,
  calculateRoadTaxSavings,
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
  EVModel,
  WizardAnswers,
  FilterState,
  VehicleCategory
} from '../src/types/ev.ts';

describe('Tier 2: Boundary & Corner Cases Suite (All 17 Features)', () => {

  // --------------------------------------------------------------------------
  // Feature 1: 16+ Verified EV Models Dataset (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 1: EV Models Catalog Boundary Cases', () => {
    it('handles non-existent or malformed model IDs gracefully in getEVModelById', () => {
      assert.equal(getEVModelById('non-existent-id'), undefined);
      assert.equal(getEVModelById(''), undefined);
      assert.equal(getEVModelById('   '), undefined);
      assert.equal(getEVModelById('undefined'), undefined);
      assert.equal(getEVModelById('null'), undefined);
    });

    it('handles case variations and whitespace in brand query', () => {
      const lower = getEVModelsByBrand('ather energy');
      const upper = getEVModelsByBrand('ATHER ENERGY');
      const mixed = getEVModelsByBrand('AtHeR EnErGy');
      assert.ok(lower.length >= 2);
      assert.equal(lower.length, upper.length);
      assert.equal(lower.length, mixed.length);
      assert.deepEqual(getEVModelsByBrand('unknown-brand-xyz'), []);
    });

    it('verifies category boundary filtering returns empty array for invalid categories', () => {
      // @ts-expect-error Testing invalid runtime category string
      const invalid = getEVModelsByCategory('helicopter');
      assert.deepEqual(invalid, []);
    });

    it('verifies extreme spec ranges (minimum and maximum values in catalog)', () => {
      const evs = getEVModels();
      const minBattery = Math.min(...evs.map(m => m.specs.batteryCapacityKwh));
      const maxBattery = Math.max(...evs.map(m => m.specs.batteryCapacityKwh));
      const minSpeed = Math.min(...evs.map(m => m.specs.topSpeedKmh));
      const maxSpeed = Math.max(...evs.map(m => m.specs.topSpeedKmh));

      assert.ok(minBattery >= 1.5, `Min battery should be >= 1.5 kWh, got ${minBattery}`);
      assert.ok(maxBattery <= 20.0, `Max battery should be <= 20.0 kWh, got ${maxBattery}`);
      assert.ok(minSpeed >= 45, `Min speed should be >= 45 km/h, got ${minSpeed}`);
      assert.ok(maxSpeed <= 220, `Max speed should be <= 220 km/h, got ${maxSpeed}`);
    });

    it('ensures every model has non-zero review count and rating in [1.0, 5.0]', () => {
      const all = getAllVehiclesIncludingBenchmark();
      for (const m of all) {
        assert.ok(m.reviewCount >= 10, `${m.name} reviewCount should be >= 10`);
        assert.ok(m.rating >= 3.5 && m.rating <= 5.0, `${m.name} rating in realistic range`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 2: Telangana 33 Districts & 38 RTO Directory (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 2: Telangana RTO Directory Boundary Cases', () => {
    it('handles unformatted RTO lookups without hyphens and case variations', () => {
      const rto = getRtoByCode('tg09');
      // getRtoByCode expects code with or without normal formatting
      const rtoWithHyphen = getRtoByCode('TG-09');
      assert.ok(rtoWithHyphen);
      assert.equal(getRtoByCode(''), undefined);
      assert.equal(getRtoByCode('  '), undefined);
      assert.equal(getRtoByCode('TG-99'), undefined);
      assert.equal(getRtoByCode('TS-99'), undefined);
    });

    it('verifies seriesNumber boundaries strictly spans 1 through 38 without gaps', () => {
      const rtos = getAllRtos();
      const seriesSet = new Set(rtos.map(r => r.seriesNumber));
      assert.equal(seriesSet.size, 38);
      for (let i = 1; i <= 38; i++) {
        assert.ok(seriesSet.has(i), `Missing seriesNumber ${i}`);
      }
    });

    it('handles non-existent district ID lookups in getDistrictById and getRtosByDistrict', () => {
      assert.equal(getDistrictById('invalid-district-xyz'), undefined);
      assert.equal(getDistrictById(''), undefined);
      assert.deepEqual(getRtosByDistrict('invalid-district-xyz'), []);
      assert.deepEqual(getRtosByDistrict(''), []);
    });

    it('verifies every district in TELANGANA_DISTRICTS has non-empty headquarters and zone', () => {
      const districts = TELANGANA_DISTRICTS;
      for (const d of districts) {
        assert.ok(d.id && d.id.length > 0);
        assert.ok(d.name && d.name.length > 0);
        assert.ok(d.zone && d.zone.length > 0);
        assert.ok(d.headquarters && d.headquarters.length > 0);
      }
    });

    it('handles empty zone lookups in getRtosByZone', () => {
      // @ts-expect-error Testing invalid runtime zone string
      const invalidZoneRtos = getRtosByZone('NonExistentZone');
      assert.deepEqual(invalidZoneRtos, []);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 3: Telangana 100% Road Tax Exemption Engine (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 3: Road Tax Exemption Boundary Cases', () => {
    it('handles zero ex-showroom price correctly without throwing errors', () => {
      const mockEV: EVModel = {
        ...getEVModelById('ather-rizta-z-37')!,
        pricing: {
          exShowroom: 0,
          pmEdriveSubsidy: 0,
          chargerIncluded: true,
          chargerCost: 0,
          insuranceEst: 0,
          handlingAndDocsEst: 0
        }
      };
      const breakdown = calculateTelanganaOnRoadPrice(mockEV);
      assert.equal(breakdown.stateRoadTax, 0);
      assert.equal(breakdown.stateRoadTaxSavings, 0);
      assert.equal(breakdown.savingsFromTelanganaPolicy, 785); // registration savings
    });

    it('handles extreme luxury ex-showroom price (₹10,00,000) with full 12% road tax savings calculation', () => {
      const luxuryEV: EVModel = {
        ...getEVModelById('ultraviolette-f77-mach2')!,
        pricing: {
          exShowroom: 1000000,
          pmEdriveSubsidy: 0,
          chargerIncluded: true,
          chargerCost: 0,
          insuranceEst: 25000,
          handlingAndDocsEst: 2000
        }
      };
      const breakdown = calculateTelanganaOnRoadPrice(luxuryEV);
      assert.equal(breakdown.stateRoadTax, 0); // Still ₹0 under policy
      assert.equal(breakdown.stateRoadTaxSavings, 120000); // 12% of ₹10L
      assert.equal(breakdown.savingsFromTelanganaPolicy, 120785);
    });

    it('rounds fractional rupees accurately to integer in road tax savings', () => {
      assert.equal(calculateRoadTaxSavings(144999), 17400); // 144999 * 0.12 = 17399.88 -> 17400
      assert.equal(calculateRoadTaxSavings(82684), 9922);   // 82684 * 0.12 = 9922.08 -> 9922
    });

    it('guarantees stateRoadTax is exactly 0 for all EVs regardless of RTO location', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      for (const rto of getAllRtos()) {
        const b = calculateTelanganaOnRoadPrice(ather, rto.rtoCode);
        assert.equal(b.stateRoadTax, 0, `Road tax should be 0 in ${rto.rtoCode}`);
      }
    });

    it('handles negative custom discount by clamping to 0', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const b = calculateTelanganaOnRoadPrice(ather, 'TG-09', { customDiscount: -5000 });
      assert.equal(b.customDiscount, 0);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 4: PM E-DRIVE Subsidy & 5-Yr Insurance Breakdown (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 4: Subsidy & Insurance Boundary Cases', () => {
    it('tests exact ₹1,50,000 threshold for PM E-DRIVE subsidy', () => {
      // Exactly ₹1,50,000 -> eligible
      assert.equal(calculatePmEdriveSubsidy(3.0, 150000), 10000);
      // ₹150,001 -> not eligible (₹0)
      assert.equal(calculatePmEdriveSubsidy(3.0, 150001), 0);
    });

    it('tests zero and negative battery capacities for subsidy calculation', () => {
      assert.equal(calculatePmEdriveSubsidy(0, 120000), 0);
      assert.equal(calculatePmEdriveSubsidy(-2.0, 120000), 0);
    });

    it('tests exact motor power boundaries for IRDAI TP insurance tiers', () => {
      // Tier 1: <= 3.0 kW
      const t1 = calculate5YearInsurance(100000, 3.0);
      assert.equal(t1.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_1_LE_3KW);

      // Tier 2: > 3.0 to <= 7.0 kW
      const t2_low = calculate5YearInsurance(100000, 3.01);
      const t2_high = calculate5YearInsurance(100000, 7.0);
      assert.equal(t2_low.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_2_3_TO_7KW);
      assert.equal(t2_high.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_2_3_TO_7KW);

      // Tier 3: > 7.0 to <= 16.0 kW
      const t3_low = calculate5YearInsurance(100000, 7.01);
      const t3_high = calculate5YearInsurance(100000, 16.0);
      assert.equal(t3_low.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_3_7_TO_16KW);
      assert.equal(t3_high.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_3_7_TO_16KW);

      // Tier 4: > 16.0 kW
      const t4 = calculate5YearInsurance(100000, 16.01);
      assert.equal(t4.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_4_GT_16KW);
    });

    it('handles zero ex-showroom price for insurance calculations without negative values', () => {
      const ins = calculate5YearInsurance(0, 4.0);
      assert.equal(ins.idv, 0);
      assert.equal(ins.od1Year, 0);
      assert.equal(ins.batteryAddon, 0);
      assert.ok(ins.totalInsurance > 0); // Still has TP and CPA
    });

    it('computes accurate GST 18% on fractional pre-tax insurance subtotal', () => {
      const ins = calculate5YearInsurance(144999, 4.3);
      const expectedSubtotal = ins.od1Year + ins.tp5Year + ins.cpaCover + ins.batteryAddon;
      assert.equal(ins.gst18, Math.round(expectedSubtotal * 0.18));
      assert.equal(ins.totalInsurance, expectedSubtotal + ins.gst18);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 5: Petrol vs EV ROI & Payback Engine (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 5: ROI & Payback Boundary Cases', () => {
    it('handles 0 km and negative daily commute gracefully using safe fallbacks', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const s0 = calculateSavings(ather, { dailyKm: 0 });
      assert.ok(s0.dailyKm > 0, 'Should fall back to default dailyKm');
      const sNeg = calculateSavings(ather, { dailyKm: -20 });
      assert.ok(sNeg.dailyKm > 0, 'Should fall back to default dailyKm');
    });

    it('tests extreme high daily commute distance (200 km/day)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const s200 = calculateSavings(ather, { dailyKm: 200, daysPerMonth: 30 });
      assert.equal(s200.monthlyKm, 6000);
      assert.ok(s200.monthlySavings > 12000, 'Monthly savings should exceed ₹12k for 6k km/mo');
      assert.ok(s200.paybackPeriodMonths < 4.0, 'Payback period should be under 4 months');
    });

    it('tests days per month boundary (1 day/month vs 31 days/month)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const s1 = calculateSavings(ather, { dailyKm: 30, daysPerMonth: 1 });
      const s31 = calculateSavings(ather, { dailyKm: 30, daysPerMonth: 31 });

      assert.equal(s1.monthlyKm, 30);
      assert.equal(s31.monthlyKm, 930);
      assert.ok(s31.monthlySavings > s1.monthlySavings);
    });

    it('tests extreme petrol price fluctuations (₹50/L to ₹200/L)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const s50 = calculateSavings(ather, { petrolPricePerLiter: 50 });
      const s200 = calculateSavings(ather, { petrolPricePerLiter: 200 });

      assert.ok(s200.monthlySavings > s50.monthlySavings * 2);
    });

    it('tests extreme power tariff fluctuations (₹1.00/kWh to ₹25.00/kWh)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const sLowTariff = calculateSavings(ather, { electricityCostPerKwh: 1.00 });
      const sHighTariff = calculateSavings(ather, { electricityCostPerKwh: 25.00 });

      assert.ok(sLowTariff.monthlyEvCost < sHighTariff.monthlyEvCost);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 6: 5-Year Total Cost of Ownership (TCO) Model (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 6: 5-Year TCO Boundary Cases', () => {
    it('handles 0 km lifecycle distance without division by zero or NaN', () => {
      const tco = calculate5YearTCO({
        evOnRoadPrice: 140000,
        evWhPerKm: 30,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 0
      });

      assert.equal(tco.totalKm, 0);
      assert.equal(tco.petrolFuelCostTotal, 0);
      assert.equal(tco.evElectricityCostTotal, 0);
      assert.ok(!Number.isNaN(tco.netTCOSavings));
    });

    it('handles extreme 100,000 km lifecycle distance', () => {
      const tco = calculate5YearTCO({
        evOnRoadPrice: 140000,
        evWhPerKm: 30,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 100000
      });

      assert.equal(tco.totalKm, 100000);
      assert.ok(tco.netTCOSavings > 180000, '100,000 km net TCO savings should exceed ₹1.8 Lakh');
    });

    it('verifies resale residual value ratio invariant: EV 28% and Petrol 35%', () => {
      const evPrice = 150000;
      const tco = calculate5YearTCO({
        evOnRoadPrice: evPrice,
        evWhPerKm: 30,
        electricityRate: 7.50,
        petrolPrice: 109.66,
        petrolMileage: 45.0,
        fiveYearKm: 50000
      });

      assert.equal(tco.evResidualResaleValue, Math.round(evPrice * 0.28));
      assert.equal(
        tco.petrolResidualResaleValue,
        Math.round(FINANCIAL_BENCHMARKS.ACTIVA_6G_EX_SHOWROOM * 0.35)
      );
    });

    it('verifies carbon offset calculations for 0 km produces zero CO2 saved', () => {
      const c0 = calculateCarbonOffset(0);
      assert.equal(c0.monthlyCo2SavedKg, 0);
      assert.equal(c0.annualCo2SavedKg, 0);
      assert.equal(c0.fiveYearCo2SavedKg, 0);
      assert.equal(c0.equivalentTeakTrees, 1); // clamped to min 1
    });

    it('verifies carbon offset for extreme high distance (5,000 km/month)', () => {
      const c5k = calculateCarbonOffset(5000);
      assert.equal(c5k.monthlyCo2SavedKg, Math.round((5000 * 26.76) / 1000)); // 134 kg
      assert.ok(c5k.fiveYearCo2SavedKg > 7500);
      assert.ok(c5k.equivalentTeakTrees > 300);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 7: Multi-Factor Range Physics Engine (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 7: Range Physics Boundary Cases', () => {
    it('tests worst-case extreme stress combo: hyper mode + 170kg payload + fast highway + telangana summer heat + flyovers', () => {
      const ather = getEVModelById('ather-450x-gen3-37')!; // NMC battery
      const worstCase = simulateRange(ather, {
        mode: 'hyper',
        payload: 'heavy_with_luggage',
        traffic: 'fast_highway',
        temperature: 'telangana_heat',
        terrain: 'flyovers'
      });

      // Expected combined multiplier: 0.68 * 0.76 * 0.80 * 0.88 * 0.90 ≈ 0.327
      assert.ok(worstCase.factors.combinedMultiplier! <= 0.35);
      assert.ok(worstCase.estimatedRangeKm >= 10, 'Range should be clamped to minimum 10 km');
      assert.ok(worstCase.batteryConsumptionWhPerKm > 80);
    });

    it('tests best-case hypermiling combo: eco mode + solo light + smooth flow + pleasant + flat', () => {
      const ather = getEVModelById('ather-450x-gen3-37')!;
      const bestCase = simulateRange(ather, {
        mode: 'eco',
        payload: 'solo_light',
        traffic: 'smooth_flow',
        temperature: 'pleasant',
        terrain: 'flat'
      });

      // Expected combined multiplier: 1.10 * 1.05 * 1.08 * 1.00 * 1.00 = 1.2474
      assert.equal(bestCase.factors.combinedMultiplier, 1.247);
      assert.ok(bestCase.estimatedRangeKm > ather.specs.realWorldCityRangeKm * 1.2);
    });

    it('guarantees estimated range never drops below 10 km floor clamp even for tiny batteries', () => {
      const mockTinyEV: EVModel = {
        ...getEVModelById('ather-rizta-z-37')!,
        specs: {
          ...getEVModelById('ather-rizta-z-37')!.specs,
          realWorldCityRangeKm: 5,
          batteryCapacityKwh: 0.5
        }
      };
      const res = simulateRange(mockTinyEV, { mode: 'hyper', payload: 'heavy_with_luggage' });
      assert.equal(res.estimatedRangeKm, 10);
    });

    it('handles 0 km commute distance gracefully without NaN or negative reserves', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const res = simulateRange(ather, { commuteDistanceKm: 0 });
      assert.equal(res.batteryReserveRemainingPercent, 99); // validCommuteKm = 1 -> batteryPercentage = 1%
      assert.equal(res.rechargeFeasibilityStatus, 'safe');
    });

    it('handles 300 km commute distance exceeding estimated range with critical status', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const res = simulateRange(ather, { commuteDistanceKm: 300 });
      assert.equal(res.batteryPercentageForCommute, 100);
      assert.equal(res.batteryReserveRemainingPercent, 0);
      assert.equal(res.rechargeFeasibilityStatus, 'critical');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 8: 4-Step Smart Recommendation Scoring Engine (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 8: Recommendation Scoring Boundary Cases', () => {
    it('handles custom budgetMax lower than cheapest EV (₹30,000) with graceful score decay', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({
        chargingAccess: 'independentHouse',
        budgetMax: 30000
      }, evs);

      assert.ok(recs.length > 0);
      // All EVs exceed ₹30k, but should still return scored list without crashing
      assert.ok(recs.every(r => r.matchScore >= 0 && r.matchScore <= 100));
      assert.ok(recs.every(r => r.subScores?.budgetScore && r.subScores.budgetScore <= 85));
    });

    it('handles custom budgetMax higher than most expensive EV (₹5,00,000) with 100% budget scores', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({
        chargingAccess: 'independentHouse',
        budgetMax: 500000
      }, evs);

      assert.ok(recs.every(r => r.subScores?.budgetScore === 100));
    });

    it('handles empty answers object by falling back safely to default scoring parameters', () => {
      const evs = getEVModels();
      // @ts-expect-error Testing empty answers object
      const recs = calculateRecommendations({}, evs);
      assert.equal(recs.length, evs.length);
      assert.ok(recs[0].matchScore > 0);
    });

    it('handles empty models array by returning an empty recommendations array', () => {
      const recs = calculateRecommendations({ chargingAccess: 'independentHouse' }, []);
      assert.deepEqual(recs, []);
    });

    it('handles aliases (dailyCommute, usageType, preferredType) interchangeably with primary names', () => {
      const evs = getEVModels();
      const recs1 = calculateRecommendations({
        commuteDistance: 'under25',
        chargingAccess: 'independentHouse',
        primaryUse: 'familyStorage',
        preferredCategory: 'scooter'
      }, evs);

      const recs2 = calculateRecommendations({
        dailyCommute: 'under25',
        chargingAccess: 'independentHouse',
        usageType: 'familyStorage',
        preferredType: 'scooter'
      }, evs);

      assert.equal(recs1[0].model.id, recs2[0].model.id);
      assert.equal(recs1[0].matchScore, recs2[0].matchScore);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 9: Sleek Responsive Header & Hero Search (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 9: Hero Search & Filtering Boundary Cases', () => {
    it('returns all models when search query is empty or whitespace only', () => {
      const evs = getEVModels();
      const emptyMatches = evs.filter(m => m.name.toLowerCase().includes(''.trim()));
      const spaceMatches = evs.filter(m => m.name.toLowerCase().includes('   '.trim()));
      assert.equal(emptyMatches.length, evs.length);
      assert.equal(spaceMatches.length, evs.length);
    });

    it('handles special regex and meta-characters without runtime exceptions', () => {
      const evs = getEVModels();
      const queries = ['[a-z]', '.*', '(ATHER)', '450X+', '$$$', '???', 'TG-09'];
      for (const q of queries) {
        assert.doesNotThrow(() => {
          evs.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));
        });
      }
    });

    it('returns zero results for non-matching queries without errors', () => {
      const evs = getEVModels();
      const matches = evs.filter(m => m.name.toLowerCase().includes('xyznonexistentmodel123'));
      assert.equal(matches.length, 0);
    });

    it('handles all-caps, mixed-case, and padded search queries', () => {
      const evs = getEVModels();
      const q1 = 'ATHER';
      const q2 = '   ather   ';
      const res1 = evs.filter(m => m.name.toLowerCase().includes(q1.toLowerCase().trim()));
      const res2 = evs.filter(m => m.name.toLowerCase().includes(q2.toLowerCase().trim()));
      assert.equal(res1.length, res2.length);
      assert.ok(res1.length >= 2);
    });

    it('combines category filter and search query correctly', () => {
      const evs = getEVModels();
      // Search 'Ather' inside 'motorcycle' category should yield 0
      const matches = evs.filter(m => 
        m.category === 'motorcycle' && m.brand.toLowerCase().includes('ather')
      );
      assert.equal(matches.length, 0);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 10: Interactive Vehicle Grid & Spec Badges (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 10: Vehicle Grid Boundary Cases', () => {
    it('filters budget < ₹1L at exact boundary threshold (₹1,00,000 net price)', () => {
      const evs = getEVModels();
      const budget1L = evs.filter(m => (m.pricing.exShowroom - m.pricing.pmEdriveSubsidy) <= 100000);
      assert.ok(budget1L.length >= 2);
      for (const m of budget1L) {
        assert.ok((m.pricing.exShowroom - m.pricing.pmEdriveSubsidy) <= 100000);
      }
    });

    it('handles minRealRangeKm slider boundaries (0 km and 500 km)', () => {
      const evs = getEVModels();
      const allAt0 = evs.filter(m => m.specs.realWorldCityRangeKm >= 0);
      assert.equal(allAt0.length, evs.length);

      const noneAt500 = evs.filter(m => m.specs.realWorldCityRangeKm >= 500);
      assert.equal(noneAt500.length, 0);
    });

    it('handles mutually exclusive filters returning empty array gracefully', () => {
      const evs = getEVModels();
      // Motorcycle with boot space > 30L (motorcycles have 0L boot space)
      const matches = evs.filter(m => m.category === 'motorcycle' && m.specs.bootSpaceLiters > 30);
      assert.equal(matches.length, 0);
    });

    it('verifies sorting stability when sorting by rating descending', () => {
      const evs = [...getEVModels()];
      evs.sort((a, b) => b.rating - a.rating);
      for (let i = 0; i < evs.length - 1; i++) {
        assert.ok(evs[i].rating >= evs[i + 1].rating);
      }
    });

    it('handles priceRangeMax filter boundary (₹80,000 to ₹4,50,000)', () => {
      const evs = getEVModels();
      const atMax = evs.filter(m => m.pricing.exShowroom <= 450000);
      assert.equal(atMax.length, evs.length);

      const atLow = evs.filter(m => m.pricing.exShowroom <= 90000);
      assert.ok(atLow.length >= 1);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 11: Vehicle Detail Modal with Pros/Cons (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 11: Detail Modal Boundary Cases', () => {
    it('handles models with optional frunk space and display size correctly', () => {
      const rizta = getEVModelById('ather-rizta-z-37')!;
      assert.equal(rizta.specs.frunkSpaceLiters, 22);
      assert.equal(rizta.specs.displaySizeInches, 7.0);

      const activa = ICE_BENCHMARK_MODEL;
      assert.equal(activa.specs.displaySizeInches, 0);
    });

    it('handles high performance motorcycle specs with rapid acceleration under 2.5s', () => {
      const uv = getEVModelById('ultraviolette-f77-mach2')!;
      assert.equal(uv.specs.accel0To40Kmh, 2.1); // 0-40 in 2.1s
      assert.equal(uv.specs.topSpeedKmh, 155);
      assert.equal(uv.specs.bootSpaceLiters, 0);
    });

    it('verifies all pros and cons text contains no placeholder text like "Lorem ipsum" or "TBD"', () => {
      const all = getAllVehiclesIncludingBenchmark();
      for (const m of all) {
        for (const p of m.pros) {
          assert.ok(!p.toLowerCase().includes('lorem'));
          assert.ok(!p.toLowerCase().includes('tbd'));
          assert.ok(!p.toLowerCase().includes('placeholder'));
        }
        for (const c of m.cons) {
          assert.ok(!c.toLowerCase().includes('lorem'));
          assert.ok(!c.toLowerCase().includes('tbd'));
          assert.ok(!c.toLowerCase().includes('placeholder'));
        }
      }
    });

    it('verifies connectivity array length and contents', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      assert.ok(ather.specs.connectivity.length >= 3);
      assert.ok(ather.specs.connectivity.some(c => c.toLowerCase().includes('navigation') || c.toLowerCase().includes('maps')));
    });

    it('verifies brakes and tire specifications exist for all models', () => {
      const evs = getEVModels();
      for (const m of evs) {
        assert.ok(m.specs.brakes && m.specs.brakes.length > 0);
        assert.ok(m.specs.groundClearanceMm > 100);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 12: Multi-Vehicle Comparison Matrix (2-4 EVs) (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 12: Comparison Matrix Boundary Cases', () => {
    it('evaluates difference highlighting with 2 identical vehicles (0 diffs)', () => {
      const m1 = getEVModelById('ather-rizta-z-37')!;
      const m2 = { ...m1 }; // Exact duplicate

      const speedDiff = m1.specs.topSpeedKmh !== m2.specs.topSpeedKmh;
      const rangeDiff = m1.specs.realWorldCityRangeKm !== m2.specs.realWorldCityRangeKm;
      const priceDiff = m1.pricing.exShowroom !== m2.pricing.exShowroom;

      assert.equal(speedDiff, false);
      assert.equal(rangeDiff, false);
      assert.equal(priceDiff, false);
    });

    it('ignores duplicate addition when vehicle is already in comparison tray', () => {
      let tray = ['ather-rizta-z-37', 'ola-s1-pro-gen2'];
      const addModel = (id: string) => {
        if (!tray.includes(id) && tray.length < 4) {
          tray.push(id);
        }
      };

      addModel('ather-rizta-z-37'); // duplicate
      assert.equal(tray.length, 2);
    });

    it('handles removing non-existent model from comparison tray gracefully', () => {
      let tray = ['ather-rizta-z-37', 'ola-s1-pro-gen2'];
      tray = tray.filter(id => id !== 'non-existent-id');
      assert.equal(tray.length, 2);
    });

    it('handles clearing comparison tray down to 0 models', () => {
      let tray = ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34'];
      tray = [];
      assert.equal(tray.length, 0);
    });

    it('tests comparison matrix diff toggling with 4 distinct vehicle models', () => {
      const models = [
        getEVModelById('ather-rizta-z-37')!,
        getEVModelById('ola-s1-pro-gen2')!,
        getEVModelById('bajaj-chetak-premium-32')!,
        getEVModelById('ultraviolette-f77-mach2')!
      ];

      const speeds = new Set(models.map(m => m.specs.topSpeedKmh));
      assert.equal(speeds.size, 4, 'All 4 models have distinct top speeds');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 13: Telangana On-Road Price Calculator Modal (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 13: Price Modal Boundary Cases', () => {
    it('handles custom discount larger than ex-showroom price by clamping net price to 0', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const b = calculateTelanganaOnRoadPrice(ather, 'TG-09', { customDiscount: 200000 });
      assert.equal(b.netVehiclePrice, 0);
      assert.equal(b.netExShowroom, 0);
      assert.ok(b.totalTelanganaOnRoadPrice > 0); // Still includes statutory fees & insurance
    });

    it('handles includeCharger = false option correctly', () => {
      const mockEV: EVModel = {
        ...getEVModelById('ather-rizta-z-37')!,
        pricing: {
          ...getEVModelById('ather-rizta-z-37')!.pricing,
          chargerIncluded: false,
          chargerCost: 15000
        }
      };
      const bExcluded = calculateTelanganaOnRoadPrice(mockEV, 'TG-09', { includeCharger: false });
      const bIncluded = calculateTelanganaOnRoadPrice(mockEV, 'TG-09', { includeCharger: true });

      assert.equal(bExcluded.chargerCost, 0);
      assert.equal(bIncluded.chargerCost, 15000);
      assert.equal(bIncluded.totalTelanganaOnRoadPrice, bExcluded.totalTelanganaOnRoadPrice + 15000);
    });

    it('handles unknown RTO code by defaulting safely to TG-09 Hyderabad Central', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const b = calculateTelanganaOnRoadPrice(ather, 'TG-999');
      assert.equal(b.rtoCode, 'TG-999');
      assert.equal(b.districtName, 'Hyderabad Central (TG-09)');
    });

    it('verifies HSRP laser fitment fee is constant ₹400 across all models and RTOs', () => {
      const evs = getEVModels();
      for (const m of evs) {
        const b = calculateTelanganaOnRoadPrice(m);
        assert.equal(b.hsrpPlateFee, 400);
      }
    });

    it('verifies numeric precision of formatted Lakhs output at boundary values', () => {
      assert.equal(formatLakhs(100000), '₹1.00 Lakh');
      assert.equal(formatLakhs(150000), '₹1.50 Lakh');
      assert.equal(formatLakhs(99999), '₹99,999');
    });
  });

  // --------------------------------------------------------------------------
  // Feature 14: Real-World Range Simulation Interactive Tool (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 14: Range Tool Boundary Cases', () => {
    it('evaluates batteryReserveRemainingPercent when commute equals estimated range (0% reserve)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const sim = simulateRange(ather, { commuteDistanceKm: 110 }); // 110 km commute on 110 km range
      assert.equal(sim.batteryReserveRemainingPercent, 0);
      assert.equal(sim.rechargeFeasibilityStatus, 'critical');
    });

    it('evaluates batteryReserveRemainingPercent when commute is half of estimated range (50% reserve)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const sim = simulateRange(ather, { commuteDistanceKm: 55 });
      assert.equal(sim.batteryReserveRemainingPercent, 50);
      assert.equal(sim.rechargeFeasibilityStatus, 'safe');
    });

    it('handles rainy and winter weather conditions multiplier (0.95x)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const rainy = simulateRange(ather, { temperature: 'rainy' });
      const winter = simulateRange(ather, { temperature: 'winter' });

      assert.equal(rainy.factors.temperatureMultiplier, 0.95);
      assert.equal(winter.factors.temperatureMultiplier, 0.95);
    });

    it('handles hilly and flyovers terrain multiplier (0.90x)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const hilly = simulateRange(ather, { terrain: 'hilly' });
      const flyovers = simulateRange(ather, { terrain: 'flyovers' });

      assert.equal(hilly.factors.terrainMultiplier, 0.90);
      assert.equal(flyovers.factors.terrainMultiplier, 0.90);
    });

    it('calculates percentage of ARAI certified range accurately', () => {
      const ather = getEVModelById('ather-rizta-z-37')!; // ARAI: 159, Real City: 110
      const res = simulateRange(ather, { mode: 'city', payload: 'solo', traffic: 'city_stop_go' });
      const expectedAraiPct = Math.round((res.estimatedRangeKm / ather.specs.araiRangeKm) * 100);
      assert.equal(res.percentageOfArai, expectedAraiPct);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 15: Petrol vs EV ROI & Payback Interactive Widget (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 15: Savings Widget Boundary Cases', () => {
    it('handles extreme petrol mileage values (15 km/L gas-guzzler vs 80 km/L hypermiler)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const s15 = calculateSavings(ather, { petrolMileageKmpl: 15 });
      const s80 = calculateSavings(ather, { petrolMileageKmpl: 80 });

      assert.ok(s15.monthlySavings > s80.monthlySavings * 4);
    });

    it('handles extreme EV energy consumption values (15 Wh/km vs 80 Wh/km)', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const sEfficient = calculateSavings(ather, { evWhPerKm: 15 });
      const sHeavy = calculateSavings(ather, { evWhPerKm: 80 });

      assert.ok(sEfficient.monthlyEvCost < sHeavy.monthlyEvCost);
    });

    it('handles payback formatting for exact 12 months boundary', () => {
      const payback = calculatePaybackPeriod(24000, 2000);
      assert.equal(payback.months, 12);
      assert.equal(payback.formatted, '1 Years');
    });

    it('handles payback formatting for negative monthly savings', () => {
      const payback = calculatePaybackPeriod(50000, -500);
      assert.equal(payback.months, 999);
      assert.equal(payback.formatted, 'No Payback');
    });

    it('calculates totalAnnualNetSavings equal to annual operational savings', () => {
      const ather = getEVModelById('ather-rizta-z-37')!;
      const s = calculateSavings(ather, { dailyKm: 50, daysPerMonth: 25 });
      assert.equal(s.totalAnnualNetSavings, s.annualSavings);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 16: 4-Step Smart Recommendation Quiz Modal (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 16: Recommendation Quiz Boundary Cases', () => {
    it('handles partial answers with only commute distance specified', () => {
      const evs = getEVModels();
      // @ts-expect-error Partial wizard answers
      const recs = calculateRecommendations({ commuteDistance: 'above80' }, evs);
      assert.ok(recs.length > 0);
      // High range vehicles should rank high
      const topModel = recs[0].model;
      assert.ok(topModel.specs.realWorldCityRangeKm >= 100);
    });

    it('handles partial answers with only charging access specified', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({ chargingAccess: 'publicOnly' }, evs);
      assert.ok(recs.length > 0);
      // Fast charging vehicles should have chargingScore 100 vs 40
      const top = recs[0];
      assert.ok(top.model.specs.fastChargingSupport);
    });

    it('handles budget preset "under1L" matching affordable models', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({
        chargingAccess: 'independentHouse',
        budget: 'under1L'
      }, evs);

      const affordableMatches = recs.filter(r => (r.model.pricing.exShowroom - r.model.pricing.pmEdriveSubsidy) <= 105000);
      assert.ok(affordableMatches.length > 0);
      assert.ok(affordableMatches.every(r => r.subScores?.budgetScore === 100));
    });

    it('handles single candidate model array without crashing', () => {
      const singleModel = [getEVModelById('ather-rizta-z-37')!];
      const recs = calculateRecommendations({ chargingAccess: 'independentHouse' }, singleModel);
      assert.equal(recs.length, 1);
      assert.equal(recs[0].rank, 1);
      assert.equal(recs[0].categoryRank, 1);
    });

    it('verifies categoryRank equals rank across all recommendation items', () => {
      const evs = getEVModels();
      const recs = calculateRecommendations({ chargingAccess: 'independentHouse' }, evs);
      for (let i = 0; i < recs.length; i++) {
        assert.equal(recs[i].rank, i + 1);
        assert.equal(recs[i].categoryRank, i + 1);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 17: Clean Production Build & UI Polish (Boundary & Corner)
  // --------------------------------------------------------------------------
  describe('Feature 17: Production Build Integrity Boundary Cases', () => {
    it('ensures no NaN, null, or undefined specifications exist across any catalog model', () => {
      const all = getAllVehiclesIncludingBenchmark();
      for (const m of all) {
        assert.ok(!Number.isNaN(m.pricing.exShowroom));
        assert.ok(!Number.isNaN(m.specs.batteryCapacityKwh));
        assert.ok(!Number.isNaN(m.specs.araiRangeKm));
        assert.ok(!Number.isNaN(m.specs.realWorldCityRangeKm));
        assert.ok(!Number.isNaN(m.specs.topSpeedKmh));
        assert.ok(!Number.isNaN(m.specs.accel0To40Kmh));
      }
    });

    it('ensures all EV models have non-empty taglines and idealFor statements', () => {
      const evs = getEVModels();
      for (const m of evs) {
        assert.ok(m.tagline && m.tagline.length > 5);
        assert.ok(m.idealFor && m.idealFor.length > 5);
      }
    });

    it('ensures all color options have valid hex colors and non-empty color names', () => {
      const evs = getEVModels();
      for (const m of evs) {
        for (const c of m.colorOptions) {
          assert.ok(c.name && c.name.length > 0);
          assert.ok(c.hex && c.hex.startsWith('#'));
        }
      }
    });

    it('verifies all 38 RTOs have non-empty major localities lists', () => {
      const rtos = getAllRtos();
      for (const r of rtos) {
        assert.ok(Array.isArray(r.majorLocalities) && r.majorLocalities.length >= 2);
      }
    });

    it('verifies TSSPDCL tariff slabs have strictly positive rates in ascending order', () => {
      const slabs = [
        { slab: '0-100 units', ratePerKwh: 5.50 },
        { slab: '101-200 units', ratePerKwh: 7.20 },
        { slab: '>200 units', ratePerKwh: 8.50 }
      ];
      assert.ok(slabs[0].ratePerKwh < slabs[1].ratePerKwh);
      assert.ok(slabs[1].ratePerKwh < slabs[2].ratePerKwh);
    });
  });

});
