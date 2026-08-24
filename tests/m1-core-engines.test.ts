import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  EV_MODELS,
  ICE_BENCHMARK_MODEL,
  getEVModels,
  getAllVehiclesIncludingBenchmark,
  getEVModelById,
  getEVModelsByCategory,
  getEVModelsByBrand
} from '../src/data/evModels.ts';

import {
  TELANGANA_RTOS,
  TELANGANA_DISTRICTS,
  TELANGANA_CURRENT_PETROL_PRICE,
  TELANGANA_AVG_ELECTRICITY_RATE,
  TELANGANA_EV_POLICY_HIGHLIGHTS,
  getRtoByCode,
  getDistrictById,
  getRtosByDistrict,
  getRtosByZone,
  getTelanganaDistricts,
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

describe('Milestone 1: EV Models Dataset (src/data/evModels.ts)', () => {
  it('contains at least 16 authentic EV models plus 1 ICE benchmark', () => {
    assert.ok(EV_MODELS.length >= 17, `Expected at least 17 models in EV_MODELS, got ${EV_MODELS.length}`);
    const evs = getEVModels();
    assert.ok(evs.length >= 16, `Expected at least 16 EV models, got ${evs.length}`);
    const all = getAllVehiclesIncludingBenchmark();
    assert.equal(all.length, evs.length + 1);
  });

  it('includes key required real-world Indian EV models', () => {
    const requiredModelIds = [
      'ather-rizta-z-37',
      'ather-450x-gen3-37',
      'ather-apex-450',
      'ola-s1-pro-gen2',
      'ola-s1-air',
      'ola-s1-x-plus-30',
      'tvs-iqube-s-34',
      'tvs-iqube-st-51',
      'bajaj-chetak-premium-32',
      'hero-vida-v1-pro',
      'river-indie-40',
      'revolt-rv400-32',
      'ultraviolette-f77-mach2',
      'oben-rorr-44',
      'matter-aera-5000-plus',
      'tork-kratos-r',
      'ampere-nexus-30'
    ];

    for (const id of requiredModelIds) {
      const model = getEVModelById(id);
      assert.ok(model, `Missing required model ID: ${id}`);
      assert.ok(model.specs.batteryCapacityKwh > 0, `Model ${id} must have non-zero battery capacity`);
      assert.ok(model.specs.topSpeedKmh > 0, `Model ${id} must have non-zero top speed`);
      assert.ok(model.specs.realWorldCityRangeKm > 0, `Model ${id} must have non-zero real world range`);
      assert.ok(model.pricing.exShowroom > 0, `Model ${id} must have non-zero ex-showroom price`);
    }
  });

  it('verifies removable battery flags on Hero Vida V1 Pro and Revolt RV400', () => {
    const vida = getEVModelById('hero-vida-v1-pro');
    assert.ok(vida && vida.specs.isRemovableBattery === true);

    const revolt = getEVModelById('revolt-rv400-32');
    assert.ok(revolt && revolt.specs.isRemovableBattery === true);

    const ather = getEVModelById('ather-rizta-z-37');
    assert.ok(ather && ather.specs.isRemovableBattery === false);
  });

  it('verifies Honda Activa 6G ICE benchmark specifications', () => {
    assert.ok(ICE_BENCHMARK_MODEL);
    assert.equal(ICE_BENCHMARK_MODEL.id, 'honda-activa-6g');
    assert.equal(ICE_BENCHMARK_MODEL.isIceBenchmark, true);
    assert.equal(ICE_BENCHMARK_MODEL.specs.realWorldCityRangeKm, 45); // 45 km/L
    assert.equal(ICE_BENCHMARK_MODEL.pricing.exShowroom, 82684);
  });

  it('verifies query helper functions filter correctly', () => {
    const scooters = getEVModelsByCategory('scooter');
    assert.ok(scooters.length >= 10);
    assert.ok(scooters.every(m => m.category === 'scooter' && !m.isIceBenchmark));

    const motorcycles = getEVModelsByCategory('motorcycle');
    assert.ok(motorcycles.length >= 5);
    assert.ok(motorcycles.every(m => m.category === 'motorcycle' && !m.isIceBenchmark));

    const atherModels = getEVModelsByBrand('Ather Energy');
    assert.ok(atherModels.length >= 3);
  });
});

describe('Milestone 1: Telangana RTO & Policy Data (src/data/telanganaRtoData.ts)', () => {
  it('contains all 38 official RTO codes (TG-01 to TG-38)', () => {
    assert.equal(TELANGANA_RTOS.length, 38);
    for (let i = 1; i <= 38; i++) {
      const code = `TG-${String(i).padStart(2, '0')}`;
      const rto = getRtoByCode(code);
      assert.ok(rto, `Missing RTO code: ${code}`);
      assert.equal(rto.seriesNumber, i);
    }
  });

  it('supports lookup via legacy TS-xx code format', () => {
    const rto9 = getRtoByCode('TS-09');
    assert.ok(rto9);
    assert.equal(rto9.rtoCode, 'TG-09');
    assert.equal(rto9.districtName, 'Hyderabad Central (Khairatabad)');
  });

  it('contains all 33 Telangana districts', () => {
    const districts = getTelanganaDistricts();
    assert.ok(districts.length >= 33);
    assert.equal(TELANGANA_DISTRICTS.length, districts.length);
    const hyd = getDistrictById('hyderabad-central');
    assert.ok(hyd);
    assert.equal(hyd.rtoCode, 'TG-09');

    const hydRtos = getRtosByDistrict('hyderabad-central');
    assert.ok(hydRtos.length >= 1);

    const allRtos = getAllRtos();
    assert.equal(allRtos.length, 38);
  });

  it('verifies statutory economic constants and policy highlights', () => {
    assert.equal(TELANGANA_CURRENT_PETROL_PRICE, 109.66);
    assert.equal(TELANGANA_AVG_ELECTRICITY_RATE, 7.50);
    assert.ok(TELANGANA_EV_POLICY_HIGHLIGHTS.governmentOrder.includes('G.O. Ms No. 41'));
  });

  it('verifies zoning helper functions', () => {
    const metroRtos = getRtosByZone('Hyderabad Metro');
    assert.ok(metroRtos.length >= 6);
  });
});

describe('Milestone 1: Telangana On-Road Price Calculator (src/utils/priceCalculator.ts)', () => {
  it('calculates ₹0 road tax and ₹0 registration fee for EV models under G.O. Ms No. 41', () => {
    const rizta = getEVModelById('ather-rizta-z-37')!;
    const price = calculateTelanganaOnRoadPrice(rizta, 'TG-09');

    assert.equal(price.stateRoadTax, 0);
    assert.equal(price.registrationAndSmartCardFee, 0);
    assert.equal(price.hsrpPlateFee, 400);
    assert.equal(price.pmEdriveSubsidy, 10000);
    // Standard petrol road tax saved = 12% of 144,999 = 17,400
    assert.equal(price.stateRoadTaxStandardPetrol, Math.round(144999 * 0.12));
    assert.equal(price.savingsFromTelanganaPolicy, Math.round(144999 * 0.12) + 785);
    assert.ok(price.totalTelanganaOnRoadPrice > 0);
  });

  it('applies PM E-DRIVE subsidy correctly: capped at ₹10,000 for <= ₹1.5L; ₹0 for > ₹1.5L', () => {
    // 3.0 kWh pack @ ₹5000/kWh = ₹15,000 -> capped at ₹10,000
    assert.equal(calculatePmEdriveSubsidy(3.0, 104999), 10000);
    // 1.5 kWh pack @ ₹5000/kWh = ₹7,500
    assert.equal(calculatePmEdriveSubsidy(1.5, 90000), 7500);
    // Luxury EV > ₹1,50,000 -> ₹0 subsidy
    assert.equal(calculatePmEdriveSubsidy(10.3, 399000), 0);
  });

  it('calculates IRDAI 5-year insurance tiers correctly', () => {
    const insSmall = calculate5YearInsurance(100000, 2.5); // Tier 1 (<= 3 kW)
    assert.equal(insSmall.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_1_LE_3KW);

    const insMid = calculate5YearInsurance(140000, 5.0); // Tier 2 (3-7 kW)
    assert.equal(insMid.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_2_3_TO_7KW);

    const insLarge = calculate5YearInsurance(180000, 11.0); // Tier 3 (7-16 kW)
    assert.equal(insLarge.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_3_7_TO_16KW);

    const insSuper = calculate5YearInsurance(399000, 30.0); // Tier 4 (> 16 kW)
    assert.equal(insSuper.tp5Year, IRDAI_EV_TP_5YR_RATES.TIER_4_GT_16KW);
  });

  it('formats currency in Indian Rupees and Lakhs correctly', () => {
    assert.equal(calculateRoadTaxSavings(100000), 12000);
    assert.ok(formatINR(145000).includes('1,45,000'));
    assert.equal(formatLakhs(145000), '₹1.45 Lakh');
    assert.equal(formatLakhs(399000), '₹3.99 Lakh');
  });
});

describe('Milestone 1: Petrol vs EV Savings & ROI Calculator (src/utils/savingsCalculator.ts)', () => {
  it('computes realistic operating costs per km (~₹2.87/km petrol vs ~₹0.37/km EV)', () => {
    assert.equal(FINANCIAL_BENCHMARKS.HYDERABAD_PETROL_PRICE_PER_LITER, 109.66);
    assert.equal(FINANCIAL_BENCHMARKS.ACTIVA_6G_MILEAGE_KMPL, 45.0);
    const savings = calculateSavings({
      dailyKm: 35,
      daysPerMonth: 26,
      petrolPricePerLiter: 109.66,
      petrolMileageKmpl: 45.0,
      electricityCostPerKwh: 7.50,
      evWhPerKm: 30.0
    });

    // Petrol: ₹109.66 / 45 km/L = ~₹2.44/km fuel + ₹0.43/km maint = ~₹2.87/km
    assert.ok(savings.petrolTotalCostPerKm >= 2.80 && savings.petrolTotalCostPerKm <= 2.95);
    // EV: (30/1000/0.88)*7.50 = ~₹0.26/km power + ₹0.12/km maint = ~₹0.37/km
    assert.ok(savings.evTotalCostPerKm >= 0.30 && savings.evTotalCostPerKm <= 0.45);
    // Net pocket savings: ~₹2.50/km
    assert.ok(savings.netSavingsPerKm >= 2.40 && savings.netSavingsPerKm <= 2.60);
  });

  it('computes monthly and annual savings dynamically', () => {
    const rizta = getEVModelById('ather-rizta-z-37')!;
    const res = calculateSavings(rizta, { dailyKm: 35, daysPerMonth: 26 });

    assert.equal(res.monthlyKm, 35 * 26); // 910 km/mo
    assert.ok(res.monthlySavings > 2000, `Expected monthly savings > ₹2,000, got ${res.monthlySavings}`);
    assert.equal(res.annualSavings, res.monthlySavings * 12);
    assert.ok(res.paybackPeriodMonths > 0 && res.paybackPeriodMonths < 30);
  });

  it('computes 5-year TCO and carbon offsets against Activa 6G', () => {
    const tco = calculate5YearTCO({
      evOnRoadPrice: 143260,
      evWhPerKm: 30,
      electricityRate: 7.50,
      petrolPrice: 109.66,
      petrolMileage: 45.0,
      fiveYearKm: 50000
    });

    assert.ok(tco.petrolNetTCO > tco.evNetTCO);
    assert.ok(tco.netTCOSavings > 60000, `Expected 5-year TCO savings > ₹60,000, got ${tco.netTCOSavings}`);

    const offset = calculateCarbonOffset(910);
    assert.ok(offset.fiveYearCo2SavedKg > 1000);
    assert.ok(offset.equivalentTeakTrees >= 40);
  });

  it('handles edge case: EV cheaper than petrol returns immediate payback', () => {
    const payback = calculatePaybackPeriod(0, 2200);
    assert.equal(payback.months, 0);
    assert.equal(payback.formatted, 'Immediate (Cheaper Upfront)');
  });
});

describe('Milestone 1: Range Physics Simulation Engine (src/utils/rangeSimulator.ts)', () => {
  it('applies mode multiplier: Eco (1.10), City (1.00), Sport (0.82), Hyper (0.68)', () => {
    const rizta = getEVModelById('ather-rizta-z-37')!;
    const city = simulateRange(rizta, { mode: 'city', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });
    const eco = simulateRange(rizta, { mode: 'eco', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });
    const sport = simulateRange(rizta, { mode: 'sport', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });
    const hyper = simulateRange(rizta, { mode: 'hyper', payload: 'solo', traffic: 'city_stop_go', temperature: 'ideal', terrain: 'flat' });

    assert.equal(city.estimatedRangeKm, 110);
    assert.equal(eco.estimatedRangeKm, Math.round(110 * 1.10));
    assert.equal(sport.estimatedRangeKm, Math.round(110 * 0.82));
    assert.equal(hyper.estimatedRangeKm, Math.round(110 * 0.68));
  });

  it('models thermal sensitivity in Telangana Summer (>38°C): LFP (0.94) vs NMC (0.88)', () => {
    const nmcModel = getEVModelById('ather-rizta-z-37')!; // NMC
    const lfpModel = getEVModelById('ampere-nexus-30')!;   // LFP

    const nmcSim = simulateRange(nmcModel, { temperature: 'telangana_heat' });
    const lfpSim = simulateRange(lfpModel, { temperature: 'telangana_heat' });

    assert.equal(nmcSim.factors.temperatureMultiplier, 0.88);
    assert.equal(lfpSim.factors.temperatureMultiplier, 0.94);
  });

  it('computes commute feasibility and reserve cushion correctly', () => {
    const model = getEVModelById('ather-rizta-z-37')!;
    // 35 km commute on 110 km range
    const sim = simulateRange(model, { commuteDistanceKm: 35 });
    assert.ok(sim.batteryReserveRemainingPercent > 60);
    assert.equal(sim.rechargeFeasibilityStatus, 'safe');

    // 100 km commute on 110 km range
    const simTight = simulateRange(model, { commuteDistanceKm: 100 });
    assert.ok(simTight.batteryReserveRemainingPercent < 15);
    assert.equal(simTight.rechargeFeasibilityStatus, 'critical');
  });

  it('provides backward compatibility wrapper simulateRealWorldRange', () => {
    const model = getEVModelById('ola-s1-pro-gen2')!;
    const res = simulateRealWorldRange({ model, mode: 'eco', load: 'with_pillion' });
    assert.ok(res.estimatedRangeKm > 0);
    assert.ok(res.batteryConsumptionWhPerKm > 0);
  });
});

describe('Milestone 1: 4-Step Recommendation Engine (src/utils/recommendationEngine.ts)', () => {
  it('strictly prioritizes removable battery models for apartment dwellers without socket', () => {
    const evs = getEVModels();
    const recommendations = calculateRecommendations(
      {
        commuteDistance: '25to50',
        chargingAccess: 'apartmentNoSocket',
        primaryUse: 'officeCommute',
        budget: '1to1.4L'
      },
      evs
    );

    const topMatch = recommendations[0];
    assert.ok(topMatch.model.specs.isRemovableBattery, 'Top match must have a removable battery');
    assert.ok(
      topMatch.model.specs.isRemovableBattery,
      `Expected removable battery model as top match, got ${topMatch.model.id}`
    );
    assert.equal(topMatch.subScores?.chargingScore, 100);

    // Fixed battery model should have heavy penalty in charging score
    const fixedModelRec = recommendations.find(r => !r.model.specs.isRemovableBattery);
    assert.ok(fixedModelRec);
    assert.equal(fixedModelRec.subScores?.chargingScore, 20);
  });

  it('recommends high performance long-range models for >80 km commute', () => {
    const evs = getEVModels();
    const recommendations = calculateRecommendations(
      {
        commuteDistance: 'above80',
        chargingAccess: 'independentHouse',
        primaryUse: 'youthPerformance',
        budget: 'above1.8L'
      },
      evs
    );

    const topMatch = recommendations[0];
    assert.ok(
      ['ultraviolette-f77-mach2', 'ola-roadster-pro-16', 'raptee-hv-t30'].includes(topMatch.model.id),
      `Expected high performance EV, got ${topMatch.model.id}`
    );
    assert.ok(topMatch.matchScore >= 90);
  });

  it('recommends large boot space family models for familyStorage priority', () => {
    const evs = getEVModels();
    const recommendations = calculateRecommendations(
      {
        commuteDistance: '25to50',
        chargingAccess: 'independentHouse',
        primaryUse: 'familyStorage',
        budget: '1to1.4L'
      },
      evs
    );

    const topIds = recommendations.slice(0, 3).map(r => r.model.id);
    assert.ok(
      topIds.includes('ather-rizta-z-37') || topIds.includes('river-indie-40') || topIds.includes('ola-s1-pro-gen2'),
      `Expected family models in top 3, got ${topIds.join(', ')}`
    );
  });

  it('never recommends the ICE benchmark vehicle in EV recommendations', () => {
    const all = getAllVehiclesIncludingBenchmark();
    const recommendations = calculateRecommendations(
      {
        commuteDistance: 'under25',
        chargingAccess: 'independentHouse',
        primaryUse: 'budgetEconomy',
        budget: 'under1L'
      },
      all
    );

    assert.ok(!recommendations.some(r => r.model.isIceBenchmark));
  });
});
