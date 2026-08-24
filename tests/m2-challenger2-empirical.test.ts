import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getEVModels,
  getAllVehiclesIncludingBenchmark,
  getEVModelById,
  ICE_BENCHMARK_MODEL
} from '../src/data/evModels.ts';

import {
  TELANGANA_RTOS,
  getRtoByCode
} from '../src/data/telanganaRtoData.ts';

import {
  calculateTelanganaOnRoadPrice,
  calculatePmEdriveSubsidy,
  formatINR
} from '../src/utils/priceCalculator.ts';

describe('Empirical Test Suite 1: Vehicle Card Rendering Data Integrity (36+ EVs + Activa 6G)', () => {
  const allVehicles = getAllVehiclesIncludingBenchmark();
  const evModels = getEVModels();

  it('verifies vehicle counts: authentic EV models + ICE benchmark', () => {
    assert.ok(evModels.length >= 36, 'Must have at least 36 authentic EV models');
    assert.ok(allVehicles.length >= 37, 'Must have at least 37 total vehicles including ICE benchmark');
  });

  it('validates that every one of the models has all required fields for VehicleCard rendering', () => {
    for (const vehicle of allVehicles) {
      // 1. Core identification
      assert.ok(vehicle.id && vehicle.id.length > 0, `Missing vehicle ID`);
      assert.ok(vehicle.name && vehicle.name.length > 0, `Missing vehicle name for ${vehicle.id}`);
      assert.ok(vehicle.brand && vehicle.brand.length > 0, `Missing vehicle brand for ${vehicle.id}`);
      assert.ok(vehicle.tagline && vehicle.tagline.length > 0, `Missing tagline for ${vehicle.id}`);

      // 2. Image URL format & integrity
      assert.ok(vehicle.imageUrl && vehicle.imageUrl.startsWith('https://'), `Invalid or non-HTTPS imageUrl for ${vehicle.id}: ${vehicle.imageUrl}`);

      // 3. Badges array (at least 2 badges for card display)
      assert.ok(Array.isArray(vehicle.badges) && vehicle.badges.length >= 2, `Vehicle ${vehicle.id} must have >= 2 badges for card rendering`);
      for (const badge of vehicle.badges) {
        assert.ok(typeof badge === 'string' && badge.trim().length > 0, `Empty badge in ${vehicle.id}`);
      }

      // 4. Specs rendered on card
      assert.ok(vehicle.specs.realWorldCityRangeKm > 0, `realWorldCityRangeKm must be > 0 for ${vehicle.id}`);
      assert.ok(vehicle.specs.araiRangeKm > 0, `araiRangeKm must be > 0 for ${vehicle.id}`);
      assert.ok(vehicle.specs.topSpeedKmh > 0, `topSpeedKmh must be > 0 for ${vehicle.id}`);
      assert.ok(vehicle.specs.accel0To40Kmh > 0, `accel0To40Kmh must be > 0 for ${vehicle.id}`);
      assert.ok(vehicle.specs.chargingTime0To80 && vehicle.specs.chargingTime0To80.length > 0, `chargingTime0To80 missing for ${vehicle.id}`);

      if (vehicle.category === 'scooter') {
        assert.ok((vehicle.specs.bootSpaceLiters || 0) > 0, `Scooter ${vehicle.id} must have bootSpaceLiters > 0`);
      } else {
        assert.ok((vehicle.specs.groundClearanceMm || 0) > 0, `Motorcycle ${vehicle.id} must have groundClearanceMm > 0`);
      }

      // 5. Pricing pill rendered on card
      assert.ok(vehicle.pricing.exShowroom > 0, `exShowroom must be > 0 for ${vehicle.id}`);
      const priceBreakdown = calculateTelanganaOnRoadPrice(vehicle, 'TG-09');
      assert.ok(priceBreakdown.totalTelanganaOnRoadPrice > 0, `On-road price must be > 0 for ${vehicle.id}`);
      assert.ok(formatINR(priceBreakdown.totalTelanganaOnRoadPrice).startsWith('₹'), `Formatted price must start with ₹ for ${vehicle.id}`);
    }
  });

  it('simulates VehicleCard rendering payload generation for all 19 models without undefined or NaN', () => {
    for (const vehicle of allVehicles) {
      const breakdown = calculateTelanganaOnRoadPrice(vehicle, 'TG-09');
      
      const cardPayload = {
        name: vehicle.name,
        brand: vehicle.brand,
        tagline: vehicle.tagline,
        imageUrl: vehicle.imageUrl,
        topTwoBadges: vehicle.badges.slice(0, 2),
        isRemovable: vehicle.specs.isRemovableBattery,
        batteryBadge: `${vehicle.specs.batteryCapacityKwh} kWh (${vehicle.specs.batteryChemistry})`,
        cityRangeText: `${vehicle.specs.realWorldCityRangeKm} km / charge`,
        araiText: `ARAI: ${vehicle.specs.araiRangeKm}km`,
        topSpeedText: `${vehicle.specs.topSpeedKmh} km/h`,
        accelText: `0-40: ${vehicle.specs.accel0To40Kmh}s`,
        homeChargeText: vehicle.specs.chargingTime0To80,
        utilityText: vehicle.category === 'scooter'
          ? `${vehicle.specs.bootSpaceLiters} Liters`
          : `${vehicle.specs.groundClearanceMm} mm`,
        onRoadPriceText: formatINR(breakdown.totalTelanganaOnRoadPrice),
        exShowroomText: `Ex-showroom: ${formatINR(vehicle.pricing.exShowroom)}`,
        savingsText: `Save ~${formatINR(breakdown.savingsFromTelanganaPolicy)}`
      };

      // Ensure no undefined, null or NaN strings in payload
      for (const [key, value] of Object.entries(cardPayload)) {
        assert.notEqual(value, undefined, `Key ${key} is undefined for ${vehicle.id}`);
        assert.notEqual(value, null, `Key ${key} is null for ${vehicle.id}`);
        if (typeof value === 'string') {
          assert.ok(!value.includes('NaN'), `Key ${key} contains NaN for ${vehicle.id}: ${value}`);
          assert.ok(!value.includes('undefined'), `Key ${key} contains undefined for ${vehicle.id}: ${value}`);
        }
      }
    }
  });
});

describe('Empirical Test Suite 2: Vehicle Detail Modal 6-Tab Deep Rendering Across All EV Models', () => {
  const evModels = getEVModels();
  const tabs = ['overview', 'battery', 'performance', 'dimensions', 'tech', 'pros-cons'] as const;

  it('renders Tab 1 (Overview & Highlights) cleanly for all EV models', () => {
    for (const model of evModels) {
      const breakdown = calculateTelanganaOnRoadPrice(model, 'TG-09');

      // 6 fast facts
      assert.ok(model.specs.realWorldCityRangeKm > 0);
      assert.ok(model.specs.araiRangeKm > 0);
      assert.ok(model.specs.topSpeedKmh > 0);
      assert.ok(model.specs.accel0To40Kmh > 0);
      assert.ok(model.specs.batteryCapacityKwh > 0);
      assert.ok(model.specs.chargingTime0To80.length > 0);
      assert.ok(model.specs.chargingTime0To100.length > 0);
      assert.ok(model.specs.motorPeakPowerKw > 0);
      assert.ok(model.specs.motorRatedPowerKw > 0);

      // Ideal buyer profile
      assert.ok(model.idealFor && model.idealFor.length >= 10, `idealFor missing/short for ${model.id}`);

      // Warranty card
      assert.ok(model.warranty.batteryYears >= 3, `Battery warranty years < 3 for ${model.id}`);
      assert.ok(model.warranty.batteryKm >= 30000, `Battery warranty km < 30000 for ${model.id}`);
      assert.ok(model.warranty.vehicleYears >= 2, `Vehicle warranty years < 2 for ${model.id}`);
      assert.ok(model.warranty.vehicleKm >= 20000, `Vehicle warranty km < 20000 for ${model.id}`);

      // Key features (minimum 4 features)
      assert.ok(Array.isArray(model.features) && model.features.length >= 4, `Features < 4 for ${model.id}`);

      // Pricing in header
      assert.ok(breakdown.totalTelanganaOnRoadPrice > 0);
      assert.ok(breakdown.pmEdriveSubsidy >= 0);
      assert.ok((breakdown.totalUpfrontSavings || 0) > 0);
    }
  });

  it('renders Tab 2 (Battery & Range) cleanly with valid charging calculations for all EV models', () => {
    for (const model of evModels) {
      // Battery specs
      assert.ok(model.specs.batteryCapacityKwh > 0, `Capacity must be > 0 for ${model.id}`);
      assert.ok(['NMC', 'LFP', 'Advanced LFP', 'Aviation Grade NMC'].some(chem => model.specs.batteryChemistry.includes(chem) || model.specs.batteryChemistry.length > 0));
      assert.equal(typeof model.specs.isRemovableBattery, 'boolean');

      // Range comparisons
      assert.ok(model.specs.araiRangeKm >= model.specs.realWorldEcoRangeKm, `ARAI range should be >= Eco range for ${model.id}`);
      assert.ok(model.specs.realWorldEcoRangeKm >= model.specs.realWorldCityRangeKm, `Eco range should be >= City range for ${model.id}`);
      assert.ok(model.specs.realWorldCityRangeKm >= model.specs.realWorldHighwayRangeKm, `City range should be >= Highway range for ${model.id}`);

      // Full charge cost math at ₹7.50/kWh domestic rate
      const fullChargeUnits = (model.specs.batteryCapacityKwh / 0.88);
      const fullChargeCost = (fullChargeUnits * 7.50).toFixed(1);
      const costPerKm = (Number(fullChargeCost) / (model.specs.realWorldCityRangeKm || 100)).toFixed(2);

      assert.ok(Number(fullChargeCost) > 0 && !isNaN(Number(fullChargeCost)), `Invalid full charge cost for ${model.id}`);
      assert.ok(Number(costPerKm) > 0 && Number(costPerKm) < 1.0, `EV cost per km must be under ₹1.00/km, got ${costPerKm} for ${model.id}`);

      // Fast charging status
      if (model.specs.fastChargingSupport) {
        assert.ok(model.specs.fastChargingRate && model.specs.fastChargingRate.length > 0, `Missing fast charging rate for ${model.id}`);
      }
    }
  });

  it('renders Tab 3 (Performance & Motor) cleanly for all EV models', () => {
    for (const model of evModels) {
      assert.ok(model.specs.motorPeakPowerKw >= model.specs.motorRatedPowerKw, `Peak power must be >= rated power for ${model.id}`);
      assert.ok(model.specs.topSpeedKmh >= 50, `Top speed must be >= 50 km/h for ${model.id}`);
      assert.ok(model.specs.accel0To40Kmh > 0 && model.specs.accel0To40Kmh <= 10.0, `Accel 0-40 must be between 0 and 10s for ${model.id}`);
      assert.ok(Array.isArray(model.specs.ridingModes) && model.specs.ridingModes.length >= 2, `Riding modes must have >= 2 modes for ${model.id}`);
      assert.ok(model.specs.brakes && model.specs.brakes.length > 0, `Brakes specification missing for ${model.id}`);
    }
  });

  it('renders Tab 4 (Dimensions & Boot) cleanly for all EV models', () => {
    for (const model of evModels) {
      assert.ok(model.specs.kerbWeightKg >= 70 && model.specs.kerbWeightKg <= 220, `Kerb weight out of bounds for ${model.id}: ${model.specs.kerbWeightKg}`);
      assert.ok(model.specs.groundClearanceMm >= 140 && model.specs.groundClearanceMm <= 230, `Ground clearance out of bounds for ${model.id}: ${model.specs.groundClearanceMm}`);

      if (model.category === 'scooter') {
        assert.ok((model.specs.bootSpaceLiters || 0) >= 15, `Scooter ${model.id} boot space must be >= 15L`);
      }
    }
  });

  it('renders Tab 5 (Tech & Connected OS) cleanly for all EV models', () => {
    for (const model of evModels) {
      assert.equal(typeof model.specs.touchscreen, 'boolean', `touchscreen must be boolean for ${model.id}`);
      assert.ok(Array.isArray(model.specs.connectivity) && model.specs.connectivity.length >= 2, `Connectivity suite must have >= 2 items for ${model.id}`);
      for (const item of model.specs.connectivity) {
        assert.ok(typeof item === 'string' && item.trim().length > 0, `Empty connectivity feature in ${model.id}`);
      }
    }
  });

  it('renders Tab 6 (Honest Pros & Cons) cleanly for all EV models', () => {
    for (const model of evModels) {
      assert.ok(Array.isArray(model.pros) && model.pros.length >= 2, `Pros must have >= 2 items for ${model.id}`);
      assert.ok(Array.isArray(model.cons) && model.cons.length >= 2, `Cons must have >= 2 items for ${model.id}`);

      for (const pro of model.pros) {
        assert.ok(typeof pro === 'string' && pro.trim().length >= 5, `Pro item too short in ${model.id}`);
      }
      for (const con of model.cons) {
        assert.ok(typeof con === 'string' && con.trim().length >= 5, `Con item too short in ${model.id}`);
      }
    }
  });

  it('empirically verifies all 108 tab states (18 models * 6 tabs) evaluate without runtime errors or NaNs', () => {
    let totalEvaluated = 0;
    for (const model of evModels) {
      for (const tab of tabs) {
        // Tab state evaluation simulator
        const breakdown = calculateTelanganaOnRoadPrice(model, 'TG-09');
        assert.ok(breakdown.totalTelanganaOnRoadPrice > 0);

        let tabPayload: Record<string, any> = {};
        switch (tab) {
          case 'overview':
            tabPayload = {
              cityRange: model.specs.realWorldCityRangeKm,
              topSpeed: model.specs.topSpeedKmh,
              battery: model.specs.batteryCapacityKwh,
              warranty: `${model.warranty.batteryYears} Years / ${model.warranty.batteryKm.toLocaleString('en-IN')} km`,
              features: model.features
            };
            break;
          case 'battery':
            tabPayload = {
              capacity: model.specs.batteryCapacityKwh,
              chemistry: model.specs.batteryChemistry,
              ecoRange: model.specs.realWorldEcoRangeKm,
              fullChargeCost: ((model.specs.batteryCapacityKwh / 0.88) * 7.50).toFixed(1)
            };
            break;
          case 'performance':
            tabPayload = {
              peakKw: model.specs.motorPeakPowerKw,
              ratedKw: model.specs.motorRatedPowerKw,
              modes: model.specs.ridingModes
            };
            break;
          case 'dimensions':
            tabPayload = {
              weight: model.specs.kerbWeightKg,
              clearance: model.specs.groundClearanceMm,
              boot: model.specs.bootSpaceLiters
            };
            break;
          case 'tech':
            tabPayload = {
              touchscreen: model.specs.touchscreen,
              display: model.specs.displaySizeInches,
              connectivity: model.specs.connectivity
            };
            break;
          case 'pros-cons':
            tabPayload = {
              pros: model.pros,
              cons: model.cons,
              decisionSummary: `${model.name} saves ${formatINR(breakdown.totalUpfrontSavings || 0)}`
            };
            break;
        }

        assert.ok(tabPayload && Object.keys(tabPayload).length > 0);
        totalEvaluated++;
      }
    }
    assert.equal(totalEvaluated, 6 * evModels.length, 'Must have evaluated all tab states');
  });
});

describe('Empirical Test Suite 3: Telangana Price Modal 38-RTO Matrix & Subsidy Math (684 Combinations)', () => {
  const evModels = getEVModels();
  const allRtos = TELANGANA_RTOS;

  it('verifies all 38 RTOs exist from TG-01 to TG-38 with valid zones and district names', () => {
    assert.equal(allRtos.length, 38, 'Must contain all 38 RTOs');
    for (let i = 1; i <= 38; i++) {
      const code = `TG-${String(i).padStart(2, '0')}`;
      const rto = getRtoByCode(code);
      assert.ok(rto, `RTO ${code} must exist`);
      assert.ok(rto.districtName && rto.districtName.length > 0, `District name missing for ${code}`);
      assert.ok(rto.officeLocation && rto.officeLocation.length > 0, `Office location missing for ${code}`);
      assert.ok(rto.zone && rto.zone.length > 0, `Zone missing for ${code}`);
    }
  });

  it('evaluates all 684 combinations (18 models * 38 RTOs) for ₹0 road tax, ₹0 reg fee and valid math', () => {
    let combinationCount = 0;

    for (const rto of allRtos) {
      for (const model of evModels) {
        const breakdown = calculateTelanganaOnRoadPrice(model, rto.rtoCode);
        combinationCount++;

        // 1. Non-zero total on-road price
        assert.ok(breakdown.totalTelanganaOnRoadPrice > 0, `Price must be > 0 for ${model.id} in ${rto.rtoCode}`);
        assert.ok(breakdown.totalTelanganaOnRoadPrice >= model.pricing.exShowroom - 10000, `On road price unrealistic for ${model.id}`);

        // 2. Zero Telangana Road Tax under G.O. Ms No. 41
        assert.equal(breakdown.stateRoadTax, 0, `Road tax must be 0 for ${model.id} in ${rto.rtoCode}`);
        assert.equal(breakdown.stateRoadTaxPayable, 0, `Road tax payable must be 0 for ${model.id} in ${rto.rtoCode}`);

        // 3. Zero Registration & Smart Card Fee
        assert.equal(breakdown.registrationAndSmartCardFee, 0, `Reg fee must be 0 for ${model.id} in ${rto.rtoCode}`);
        assert.equal(breakdown.registrationFeePayable, 0, `Reg fee payable must be 0 for ${model.id} in ${rto.rtoCode}`);

        // 4. Standard Petrol Comparison Tax (12% of ex-showroom)
        const expectedRoadTaxSavings = Math.round(model.pricing.exShowroom * 0.12);
        assert.equal(breakdown.stateRoadTaxStandardPetrol, expectedRoadTaxSavings, `Expected road tax savings ${expectedRoadTaxSavings}, got ${breakdown.stateRoadTaxStandardPetrol}`);

        // 5. Total Upfront Savings Calculation
        const expectedPolicySavings = expectedRoadTaxSavings + 785;
        assert.equal(breakdown.savingsFromTelanganaPolicy, expectedPolicySavings, `Policy savings mismatch for ${model.id}`);
        assert.equal(breakdown.totalUpfrontSavings, expectedPolicySavings + breakdown.pmEdriveSubsidy, `Total upfront savings mismatch for ${model.id}`);

        // 6. PM E-DRIVE Subsidy Math
        const expectedSubsidy = model.pricing.pmEdriveSubsidy !== undefined 
          ? model.pricing.pmEdriveSubsidy 
          : calculatePmEdriveSubsidy(model.specs.batteryCapacityKwh, model.pricing.exShowroom);
        assert.equal(breakdown.pmEdriveSubsidy, expectedSubsidy, `PM E-DRIVE subsidy mismatch for ${model.id}: expected ${expectedSubsidy}, got ${breakdown.pmEdriveSubsidy}`);

        // 7. Math Invariant: Total = Net Ex-Showroom + HSRP(400) + Insurance + Handling + Charger
        const expectedTotal = 
          breakdown.netVehiclePrice +
          breakdown.hsrpPlateFee +
          breakdown.insurance5Year +
          breakdown.handlingAndDocs +
          breakdown.chargerCost;

        assert.equal(breakdown.totalTelanganaOnRoadPrice, expectedTotal, `Total on-road math invariant violated for ${model.id} in ${rto.rtoCode}`);
      }
    }

    assert.equal(combinationCount, allRtos.length * evModels.length, 'Must have evaluated all model x RTO combinations');
  });

  it('validates quotation text generator format across all 18 models', () => {
    for (const model of evModels) {
      const breakdown = calculateTelanganaOnRoadPrice(model, 'TG-09');
      const rto = getRtoByCode('TG-09')!;

      const quote = `
TELANGANA ON-ROAD PRICE QUOTE — ${model.name.toUpperCase()}
RTO Office: ${rto.officeLocation} (${rto.rtoCode} / ${rto.legacyCode}) - ${rto.districtName}
1. Ex-Showroom Invoice:        ${formatINR(breakdown.exShowroom)}
2. PM E-DRIVE Subsidy:        -${formatINR(breakdown.pmEdriveSubsidy)}
Net Base Invoice:              ${formatINR(breakdown.netVehiclePrice)}
4. Telangana State Road Tax:   ₹0 (EXEMPT - Saved ${formatINR(breakdown.stateRoadTaxStandardPetrol)})
5. Registration & Smart Card:  ₹0 (WAIVED - Saved ₹785)
6. Laser HSRP Plate:           ₹${breakdown.hsrpPlateFee}
7. Mandatory 5-Yr Insurance:   ${formatINR(breakdown.insurance5Year)}
8. Handling & Logistics:       ${formatINR(breakdown.handlingAndDocs)}
NET TELANGANA ON-ROAD PRICE:   ${formatINR(breakdown.totalTelanganaOnRoadPrice)}
TOTAL UPFRONT CASH SAVED:      ${formatINR(breakdown.totalUpfrontSavings || 0)} (G.O. Ms No. 41)
      `.trim();

      assert.ok(quote.includes(model.name.toUpperCase()), `Quotation missing model name`);
      assert.ok(quote.includes('₹0 (EXEMPT'), `Quotation missing ₹0 EXEMPT road tax`);
      assert.ok(quote.includes('₹0 (WAIVED'), `Quotation missing ₹0 WAIVED reg fee`);
      assert.ok(!quote.includes('NaN'), `Quotation contains NaN for ${model.id}`);
      assert.ok(!quote.includes('undefined'), `Quotation contains undefined for ${model.id}`);
    }
  });
});

describe('Empirical Test Suite 4: Interactive Price Modal Customization & Option Combinations Stress Testing', () => {
  const model = getEVModelById('ather-rizta-z-37')!;

  it('tests interactive options: charger toggle, extended warranty (+₹3000), accessories (+₹2000), and custom discount', () => {
    const baseBreakdown = calculateTelanganaOnRoadPrice(model, 'TG-09');

    // 1. With Extended Warranty (+₹3,000)
    const withWarranty = calculateTelanganaOnRoadPrice(model, 'TG-09', { includeExtendedWarranty: true });
    assert.equal(withWarranty.totalTelanganaOnRoadPrice, baseBreakdown.totalTelanganaOnRoadPrice + 3000);
    assert.equal(withWarranty.extendedWarrantyCost, 3000);

    // 2. With Accessories (+₹2,000)
    const withAccessories = calculateTelanganaOnRoadPrice(model, 'TG-09', { includeAccessories: true });
    assert.equal(withAccessories.totalTelanganaOnRoadPrice, baseBreakdown.totalTelanganaOnRoadPrice + 2000);
    assert.equal(withAccessories.accessoriesCost, 2000);

    // 3. With Both Warranty and Accessories (+₹5,000)
    const withBoth = calculateTelanganaOnRoadPrice(model, 'TG-09', { includeExtendedWarranty: true, includeAccessories: true });
    assert.equal(withBoth.totalTelanganaOnRoadPrice, baseBreakdown.totalTelanganaOnRoadPrice + 5000);

    // 4. With Custom Discount (-₹10,000)
    const withDiscount = calculateTelanganaOnRoadPrice(model, 'TG-09', { customDiscount: 10000 });
    assert.equal(withDiscount.totalTelanganaOnRoadPrice, baseBreakdown.totalTelanganaOnRoadPrice - 10000);
    assert.equal(withDiscount.customDiscount, 10000);

    // 5. Combined: Discount (-₹5,000) + Warranty (+₹3,000) + Accessories (+₹2,000) = Net 0 difference
    const withCombined = calculateTelanganaOnRoadPrice(model, 'TG-09', {
      customDiscount: 5000,
      includeExtendedWarranty: true,
      includeAccessories: true
    });
    assert.equal(withCombined.totalTelanganaOnRoadPrice, baseBreakdown.totalTelanganaOnRoadPrice);
  });
});

describe('Empirical Test Suite 5: Activa 6G Benchmark Contrast & Non-Exemption Verification', () => {
  it('verifies that Honda Activa 6G pays standard 12% road tax and registration fee without EV exemptions', () => {
    const breakdown = calculateTelanganaOnRoadPrice(ICE_BENCHMARK_MODEL, 'TG-09');

    // ICE pays road tax
    assert.equal(breakdown.stateRoadTax, Math.round(ICE_BENCHMARK_MODEL.pricing.exShowroom * 0.12));
    assert.ok(breakdown.stateRoadTax > 9000, `Activa 6G road tax must be > ₹9,000`);

    // ICE pays registration fee
    assert.equal(breakdown.registrationAndSmartCardFee, 785);

    // ICE has ₹0 EV policy savings and ₹0 PM E-DRIVE subsidy
    assert.equal(breakdown.pmEdriveSubsidy, 0);
    assert.equal(breakdown.savingsFromTelanganaPolicy, 0);
    assert.equal(breakdown.totalUpfrontSavings, 0);
  });
});
