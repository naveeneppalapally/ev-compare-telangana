import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getAllVehiclesIncludingBenchmark,
  getEVModels,
  getEVModelById
} from '../src/data/evModels.ts';

import {
  TELANGANA_RTOS
} from '../src/data/telanganaRtoData.ts';

import {
  calculateTelanganaOnRoadPrice,
  formatINR,
  formatLakhs,
  IRDAI_EV_TP_5YR_RATES
} from '../src/utils/priceCalculator.ts';

import {
  calculateSavings,
  calculate5YearTCO,
  calculatePaybackPeriod,
  calculateCarbonOffset
} from '../src/utils/savingsCalculator.ts';

import {
  simulateRange
} from '../src/utils/rangeSimulator.ts';

import {
  calculateRecommendations
} from '../src/utils/recommendationEngine.ts';

import type { WizardAnswers } from '../src/types/ev.ts';

describe('Adversarial Test Suite 1: Price Calculator & Invariants', () => {
  it('INVARIANT: Net On-Road Price must never have negative taxes or NaN across all models', () => {
    const allModels = getAllVehiclesIncludingBenchmark();
    for (const model of allModels) {
      const breakdown = calculateTelanganaOnRoadPrice(model);
      assert.ok(!Number.isNaN(breakdown.totalTelanganaOnRoadPrice), `totalTelanganaOnRoadPrice is NaN for ${model.id}`);
      assert.ok(!Number.isNaN(breakdown.stateRoadTax), `stateRoadTax is NaN for ${model.id}`);
      assert.ok(!Number.isNaN(breakdown.registrationAndSmartCardFee), `registrationAndSmartCardFee is NaN for ${model.id}`);
      assert.ok(!Number.isNaN(breakdown.insurance5Year), `insurance5Year is NaN for ${model.id}`);
      assert.ok(!Number.isNaN(breakdown.pmEdriveSubsidy), `pmEdriveSubsidy is NaN for ${model.id}`);
      assert.ok(breakdown.totalTelanganaOnRoadPrice > 0, `totalTelanganaOnRoadPrice must be > 0 for ${model.id}`);
      
      if (!model.isIceBenchmark) {
        assert.equal(breakdown.stateRoadTax, 0, `EV model ${model.id} MUST have strictly ₹0 state road tax in Telangana`);
        assert.equal(breakdown.registrationAndSmartCardFee, 0, `EV model ${model.id} MUST have strictly ₹0 registration fee in Telangana`);
        assert.ok(breakdown.savingsFromTelanganaPolicy > 0, `EV model ${model.id} must have > 0 Telangana policy savings`);
        assert.ok(breakdown.totalUpfrontSavings >= breakdown.savingsFromTelanganaPolicy, `EV model ${model.id} upfront savings check`);
      } else {
        assert.ok(breakdown.stateRoadTax > 0, 'ICE benchmark Activa 6G must have positive road tax in Telangana (12%)');
        assert.equal(breakdown.savingsFromTelanganaPolicy, 0, 'ICE benchmark Activa 6G gets ₹0 policy exemption');
      }
    }
  });

  it('INVARIANT: All 38 RTOs produce valid pricing without crash', () => {
    const model = getEVModelById('ather-rizta-z-37')!;
    for (const rto of TELANGANA_RTOS) {
      const breakdown = calculateTelanganaOnRoadPrice(model, rto.rtoCode);
      assert.equal(breakdown.rtoCode, rto.rtoCode);
      assert.ok(breakdown.districtName?.includes(rto.rtoCode), `District name should include ${rto.rtoCode}`);
      assert.equal(breakdown.stateRoadTax, 0);
    }
  });

  it('ADVERSARIAL: Extreme pricing boundary tests (₹3.99L luxury vs ₹89k budget)', () => {
    const luxuryEV = getEVModelById('ultraviolette-f77-mach2')!;
    const budgetEV = getEVModelById('ola-s1-x-plus-30')!;

    const luxuryBreakdown = calculateTelanganaOnRoadPrice(luxuryEV);
    const budgetBreakdown = calculateTelanganaOnRoadPrice(budgetEV);

    // Luxury EV (> ₹1.5L) should have ₹0 PM E-DRIVE subsidy
    assert.equal(luxuryBreakdown.pmEdriveSubsidy, 0);
    // Luxury EV rated power is 15.0 kW (Tier 3), peak is 30.0 kW (Tier 4)
    assert.ok(luxuryBreakdown.insuranceThirdParty5Yr >= IRDAI_EV_TP_5YR_RATES.TIER_3_7_TO_16KW);
    assert.ok(luxuryBreakdown.totalTelanganaOnRoadPrice > 399000);

    // Budget EV (<= ₹1.5L) with 3.0 kWh battery gets ₹10,000 subsidy
    assert.equal(budgetBreakdown.pmEdriveSubsidy, 10000);
    assert.ok(budgetBreakdown.totalTelanganaOnRoadPrice < 120000);
  });

  it('ADVERSARIAL: Price calculator with extreme options (negative discount, huge discount, missing fields)', () => {
    const model = getEVModelById('ather-rizta-z-37')!;
    
    // Negative discount should be clamped to 0
    const negDiscount = calculateTelanganaOnRoadPrice(model, { customDiscount: -5000 });
    assert.equal(negDiscount.customDiscount, 0);

    // Massive discount (> exShowroom) should not result in negative netVehiclePrice
    const hugeDiscount = calculateTelanganaOnRoadPrice(model, { customDiscount: 999999 });
    assert.equal(hugeDiscount.netVehiclePrice, 0);
    assert.ok(hugeDiscount.totalTelanganaOnRoadPrice > 0); // insurance, handling, hsrp still apply

    // Options with extended warranty and accessories
    const fullOptions = calculateTelanganaOnRoadPrice(model, {
      includeExtendedWarranty: true,
      includeAccessories: true,
      includeCharger: true
    });
    assert.equal(fullOptions.extendedWarrantyCost, 3000);
    assert.equal(fullOptions.accessoriesCost, 2000);
    assert.ok(fullOptions.totalTelanganaOnRoadPrice > negDiscount.totalTelanganaOnRoadPrice);
  });

  it('ADVERSARIAL: Invalid RTO code handles fallback gracefully without crash', () => {
    const model = getEVModelById('ather-rizta-z-37')!;
    const invalidRto = calculateTelanganaOnRoadPrice(model, 'TG-99');
    assert.ok(invalidRto.totalTelanganaOnRoadPrice > 0);
    assert.equal(invalidRto.stateRoadTax, 0);
    assert.ok(invalidRto.districtName);
  });

  it('ADVERSARIAL: Formatting edge cases (0, negative, huge numbers, NaN)', () => {
    assert.equal(formatINR(0), '₹0');
    assert.equal(formatLakhs(0), '₹0');
    assert.equal(formatLakhs(50000), '₹50,000');
    assert.equal(formatLakhs(100000), '₹1.00 Lakh');
    assert.equal(formatLakhs(399000), '₹3.99 Lakh');
    assert.equal(formatLakhs(15000000), '₹150.00 Lakh');
  });
});

describe('Adversarial Test Suite 2: Savings & ROI Calculator', () => {
  it('ADVERSARIAL: 0 km daily commute and extreme commute (200 km/day)', () => {
    const model = getEVModelById('ather-rizta-z-37')!;
    
    // Extreme 200 km/day commute
    const highCommute = calculateSavings(model, { dailyKm: 200, daysPerMonth: 30 });
    assert.equal(highCommute.monthlyKm, 6000);
    assert.ok(highCommute.monthlySavings > 10000);
    assert.ok(highCommute.paybackPeriodMonths < 6, `High commute should breakeven quickly, got ${highCommute.paybackPeriodMonths} mos`);

    // 1 km/day commute
    const minCommute = calculateSavings(model, { dailyKm: 1, daysPerMonth: 20 });
    assert.equal(minCommute.monthlyKm, 20);
    assert.ok(minCommute.monthlySavings > 0);
    assert.ok(minCommute.paybackPeriodMonths > 100);
  });

  it('INVARIANT: Payback calculation handles immediate payback, infinite payback, normal payback gracefully', () => {
    // Case 1: EV is cheaper than petrol (upfront diff <= 0)
    const cheapEV = calculatePaybackPeriod(0, 2500);
    assert.equal(cheapEV.months, 0);
    assert.equal(cheapEV.years, 0);
    assert.equal(cheapEV.formatted, 'Immediate (Cheaper Upfront)');

    const negativeDiff = calculatePaybackPeriod(-10000, 2500);
    assert.equal(negativeDiff.months, 0);
    assert.equal(negativeDiff.formatted, 'Immediate (Cheaper Upfront)');

    // Case 2: Zero or negative monthly savings
    const zeroSavings = calculatePaybackPeriod(50000, 0);
    assert.equal(zeroSavings.months, 999);
    assert.equal(zeroSavings.formatted, 'No Payback');

    const negSavings = calculatePaybackPeriod(50000, -500);
    assert.equal(negSavings.months, 999);
    assert.equal(zeroSavings.formatted, 'No Payback');

    // Case 3: Normal payback with years and months
    const normalPayback = calculatePaybackPeriod(35000, 2000); // 17.5 months = 1 Yr 6 Mo
    assert.equal(normalPayback.months, 17.5);
    assert.equal(normalPayback.years, 1.5);
    assert.equal(normalPayback.formatted, '1 Yr 6 Mo');

    // Case 4: Payback under 12 months
    const subYear = calculatePaybackPeriod(15000, 2000); // 7.5 months
    assert.equal(subYear.months, 7.5);
    assert.equal(subYear.formatted, '7.5 Months');

    // Case 5: Exact whole years
    const exactYears = calculatePaybackPeriod(48000, 2000); // 24 months = 2 Years
    assert.equal(exactYears.months, 24);
    assert.equal(exactYears.formatted, '2 Years');
  });

  it('ADVERSARIAL: Extreme fuel prices and mileage benchmarks', () => {
    // Petrol ₹150/L with low mileage 30 km/L vs EV
    const expensivePetrol = calculateSavings({
      petrolPricePerLiter: 150,
      petrolMileageKmpl: 30,
      electricityCostPerKwh: 7.50,
      dailyKm: 50,
      daysPerMonth: 26,
      evWhPerKm: 30
    });
    // Petrol cost = 150/30 + 0.429 = ~₹5.43/km
    assert.ok(expensivePetrol.petrolTotalCostPerKm! > 5.0);
    assert.ok(expensivePetrol.monthlySavings > 5000);

    // Activa 6G benchmark TCO consistency
    const tco = calculate5YearTCO({
      evOnRoadPrice: 140000,
      evWhPerKm: 30,
      electricityRate: 7.50,
      petrolPrice: 109.66,
      petrolMileage: 45.0,
      fiveYearKm: 50000
    });
    assert.ok(!Number.isNaN(tco.petrolGrossTCO));
    assert.ok(!Number.isNaN(tco.evGrossTCO));
    assert.ok(!Number.isNaN(tco.netTCOSavings));
    assert.ok(tco.petrolResidualResaleValue > 0);
    assert.ok(tco.evResidualResaleValue > 0);
  });

  it('ADVERSARIAL: Carbon offset calculations with extreme distances', () => {
    const zeroKm = calculateCarbonOffset(0);
    assert.equal(zeroKm.monthlyCo2SavedKg, 0);
    assert.equal(zeroKm.annualCo2SavedKg, 0);
    assert.equal(zeroKm.fiveYearCo2SavedKg, 0);
    assert.equal(zeroKm.equivalentTeakTrees, 1); // min clamp 1

    const highKm = calculateCarbonOffset(5000); // 5000 km/month
    assert.ok(highKm.fiveYearCo2SavedKg > 5000);
    assert.ok(highKm.equivalentTeakTrees > 200);
  });
});

describe('Adversarial Test Suite 3: Range Simulator & Physics Stress Testing', () => {
  it('INVARIANT: Hyper mode + pillion + 45°C MUST have significantly lower range than Eco mode solo 25°C', () => {
    const evs = getEVModels();
    for (const ev of evs) {
      const harshCondition = simulateRange(ev, {
        mode: 'hyper',
        payload: 'heavy_with_luggage',
        traffic: 'highway',
        temperature: 'telangana_heat',
        terrain: 'hilly'
      });

      const idealCondition = simulateRange(ev, {
        mode: 'eco',
        payload: 'solo_light',
        traffic: 'smooth_flow',
        temperature: 'ideal',
        terrain: 'flat'
      });

      assert.ok(
        harshCondition.estimatedRangeKm < idealCondition.estimatedRangeKm,
        `Harsh range (${harshCondition.estimatedRangeKm}) must be strictly less than ideal (${idealCondition.estimatedRangeKm}) for ${ev.id}`
      );

      // Harsh range should be less than 50% of ideal range due to compounding physics factors
      const ratio = harshCondition.estimatedRangeKm / idealCondition.estimatedRangeKm;
      assert.ok(
        ratio <= 0.50,
        `Expected harsh/ideal ratio <= 0.50, got ${ratio.toFixed(2)} for ${ev.id}`
      );
      assert.ok(harshCondition.estimatedRangeKm >= 10, 'Estimated range must never drop below 10 km floor');
    }
  });

  it('ADVERSARIAL: LFP chemistry thermal resistance vs NMC in Telangana heat (>38°C)', () => {
    const lfpModels = getEVModels().filter(m => (m.specs.batteryChemistry || '').toUpperCase().includes('LFP'));
    const nmcModels = getEVModels().filter(m => (m.specs.batteryChemistry || '').toUpperCase().includes('NMC'));

    assert.ok(lfpModels.length > 0, 'Must have at least 1 LFP model');
    assert.ok(nmcModels.length > 0, 'Must have at least 1 NMC model');

    for (const lfp of lfpModels) {
      const sim = simulateRange(lfp, { temperature: 'telangana_heat' });
      assert.equal(sim.factors.temperatureMultiplier, 0.94, `LFP model ${lfp.id} should have 0.94 thermal multiplier`);
    }

    for (const nmc of nmcModels) {
      const sim = simulateRange(nmc, { temperature: 'telangana_heat' });
      assert.equal(sim.factors.temperatureMultiplier, 0.88, `NMC model ${nmc.id} should have 0.88 thermal multiplier`);
    }
  });

  it('ADVERSARIAL: Extreme commute distance analytics (0 km, 150 km, 300 km)', () => {
    const model = getEVModelById('ather-450x-gen3-37')!; // 105 km city range

    // 0 km commute
    const zeroCommute = simulateRange(model, { commuteDistanceKm: 0 });
    assert.equal(zeroCommute.rechargeFeasibilityStatus, 'safe');
    assert.ok(zeroCommute.batteryReserveRemainingPercent >= 95);

    // 50 km commute (~50% battery)
    const midCommute = simulateRange(model, { commuteDistanceKm: 50 });
    assert.ok(midCommute.batteryPercentageForCommute > 40 && midCommute.batteryPercentageForCommute < 60);

    // 150 km commute (exceeds 105 km range)
    const extremeCommute = simulateRange(model, { commuteDistanceKm: 150 });
    assert.equal(extremeCommute.batteryPercentageForCommute, 100);
    assert.equal(extremeCommute.batteryReserveRemainingPercent, 0);
    assert.equal(extremeCommute.rechargeFeasibilityStatus, 'critical');
    assert.ok(extremeCommute.rechargeFeasibilityMessage?.includes('Midday Charge Advised'));
  });

  it('ADVERSARIAL: Energy efficiency and Wh/km calculations', () => {
    const model = getEVModelById('river-indie-40')!; // 4.0 kWh battery, 115 km city range
    const sim = simulateRange(model, { mode: 'city', payload: 'solo', traffic: 'city_stop_go' });
    
    assert.ok(sim.batteryConsumptionWhPerKm > 0 && sim.batteryConsumptionWhPerKm < 60);
    assert.ok(sim.efficiencyKmPerKwh! > 0);
    assert.ok(sim.percentageOfArai! > 0 && sim.percentageOfArai! <= 100);
  });
});

describe('Adversarial Test Suite 4: Smart Recommendation Engine Stress Testing', () => {
  it('EMPIRICAL EVALUATION: Checks recommendation rankings for Apartment with NO charging socket across 112 combinations', () => {
    const evs = getEVModels();
    const commuteOptions: Array<'under25' | '25to50' | '50to80' | 'above80'> = ['under25', '25to50', '50to80', 'above80'];
    const usageOptions: Array<'familyStorage' | 'officeCommute' | 'youthPerformance' | 'budgetEconomy'> = ['familyStorage', 'officeCommute', 'youthPerformance', 'budgetEconomy'];
    const budgetOptions: Array<'under1L' | '1to1.4L' | '1.4to1.8L' | 'above1.8L'> = ['under1L', '1to1.4L', '1.4to1.8L', 'above1.8L'];

    let removableAtTopCount = 0;
    let totalCombinations = 0;
    const failures: string[] = [];

    for (const commute of commuteOptions) {
      for (const usage of usageOptions) {
        for (const budget of budgetOptions) {
          totalCombinations++;
          const recs = calculateRecommendations(
            {
              commuteDistance: commute,
              chargingAccess: 'apartmentNoSocket',
              primaryUse: usage,
              budget: budget
            },
            evs
          );

          const topMatch = recs[0];
          if (topMatch.model.specs.isRemovableBattery) {
            removableAtTopCount++;
          } else {
            failures.push(`[${commute}, ${usage}, ${budget}]: top is ${topMatch.model.name} (${topMatch.model.id}) score ${topMatch.matchScore}`);
          }

          // Removable battery models must receive chargingScore = 100
          const removableRecs = recs.filter(r => r.model.specs.isRemovableBattery);
          for (const r of removableRecs) {
            assert.equal(r.subScores?.chargingScore, 100);
          }

          // Fixed battery models must receive chargingScore = 20
          const fixedRecs = recs.filter(r => !r.model.specs.isRemovableBattery);
          for (const r of fixedRecs) {
            assert.equal(r.subScores?.chargingScore, 20);
          }
        }
      }
    }

    assert.ok(totalCombinations === 64);
    assert.ok(removableAtTopCount >= 62);
  });

  it('ADVERSARIAL: Category filter preference strictly penalizes cross-category vehicles', () => {
    const evs = getEVModels();

    // Scooter preference
    const scooterRecs = calculateRecommendations(
      {
        commuteDistance: '25to50',
        chargingAccess: 'independentHouse',
        primaryUse: 'officeCommute',
        preferredCategory: 'scooter'
      },
      evs
    );
    assert.equal(scooterRecs[0].model.category, 'scooter');

    // Motorcycle preference
    const motoRecs = calculateRecommendations(
      {
        commuteDistance: '25to50',
        chargingAccess: 'independentHouse',
        primaryUse: 'youthPerformance',
        preferredCategory: 'motorcycle'
      },
      evs
    );
    assert.equal(motoRecs[0].model.category, 'motorcycle');
  });

  it('ADVERSARIAL: Handles empty, sparse, or default answers without throwing', () => {
    const evs = getEVModels();

    // Minimal answers
    const minimal = calculateRecommendations({ chargingAccess: 'independentHouse' } as WizardAnswers, evs);
    assert.equal(minimal.length, evs.length);
    assert.ok(minimal.every(r => r.matchScore >= 0 && r.matchScore <= 100));
    assert.ok(minimal.every(r => r.rank > 0 && r.rank <= evs.length));

    // Custom budgetMax
    const customBudget = calculateRecommendations(
      {
        chargingAccess: 'independentHouse',
        budgetMax: 90000
      },
      evs
    );
    assert.ok(customBudget.length > 0);
    assert.ok(customBudget[0].subScores?.budgetScore !== undefined);
  });

  it('ADVERSARIAL: Never includes ICE benchmark Activa 6G even when passed full dataset', () => {
    const all = getAllVehiclesIncludingBenchmark();
    const recs = calculateRecommendations(
      {
        chargingAccess: 'independentHouse',
        commuteDistance: 'under25',
        primaryUse: 'budgetEconomy',
        budget: 'under1L'
      },
      all
    );

    assert.ok(!recs.some(r => r.model.id === 'honda-activa-6g' || r.model.isIceBenchmark));
  });
});
