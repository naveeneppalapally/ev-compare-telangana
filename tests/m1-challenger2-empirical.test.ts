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
  TSSPDCL_DOMESTIC_TARIFF_SLABS,
  getRtoByCode,
  getDistrictById,
  getRtosByDistrict,
  getRtosByZone,
  getTelanganaDistricts,
  getAllRtos
} from '../src/data/telanganaRtoData.ts';

describe('Challenger 2 Empirical Verification: EV Models Integrity (src/data/evModels.ts)', () => {
  const evModels = getEVModels();
  const allModels = getAllVehiclesIncludingBenchmark();

  it('verifies catalog size: authentic EV models + ICE benchmark', () => {
    assert.ok(evModels.length >= 36, `Expected >= 36 EV models, got ${evModels.length}`);
    assert.equal(allModels.length, evModels.length + 1, 'allModels should contain evModels + ICE benchmark');
    assert.equal(EV_MODELS.length, allModels.length, 'EV_MODELS array must contain all vehicles');
    assert.ok(ICE_BENCHMARK_MODEL && ICE_BENCHMARK_MODEL.id === 'honda-activa-6g');
    assert.ok(TELANGANA_DISTRICTS.length >= 33, 'TELANGANA_DISTRICTS must have at least 33 districts');
  });

  it('verifies all 40 EV models have non-empty, non-dummy values across 25+ parameters', () => {
    const dummyWords = ['dummy', 'placeholder', 'lorem', 'ipsum', 'sample model', 'fake', 'test model', 'tbd', 'unknown'];

    for (const model of evModels) {
      // 1. Root fields
      assert.ok(model.id && model.id.trim().length > 0, `Model missing ID: ${JSON.stringify(model)}`);
      assert.ok(model.name && model.name.trim().length > 0, `Model ${model.id} missing name`);
      assert.ok(model.brand && model.brand.trim().length > 0, `Model ${model.id} missing brand`);
      assert.ok(model.tagline && model.tagline.trim().length > 0, `Model ${model.id} missing tagline`);
      assert.ok(['scooter', 'motorcycle'].includes(model.category), `Model ${model.id} invalid category ${model.category}`);
      assert.equal(model.isIceBenchmark, undefined, `EV Model ${model.id} must not be marked as ICE benchmark`);
      assert.ok(model.launchYear >= 2020 && model.launchYear <= 2026, `Model ${model.id} unrealistic launch year ${model.launchYear}`);
      assert.equal(model.madeInIndia, true, `Model ${model.id} madeInIndia must be true`);
      assert.ok(model.rating >= 3.5 && model.rating <= 5.0, `Model ${model.id} rating ${model.rating} out of bounds [3.5, 5.0]`);
      assert.ok(model.reviewCount > 0, `Model ${model.id} reviewCount ${model.reviewCount} must be > 0`);
      assert.ok(model.idealFor && model.idealFor.trim().length > 10, `Model ${model.id} idealFor is too short or missing`);

      // Check for dummy text in strings
      for (const str of [model.id, model.name, model.brand, model.tagline, model.idealFor]) {
        for (const dummy of dummyWords) {
          assert.ok(!str.toLowerCase().includes(dummy), `Model ${model.id} contains dummy substring "${dummy}" in "${str}"`);
        }
      }

      // 2. Pricing fields (6 fields)
      assert.ok(model.pricing, `Model ${model.id} missing pricing object`);
      assert.ok(model.pricing.exShowroom > 0, `Model ${model.id} exShowroom must be > 0`);
      assert.ok(model.pricing.pmEdriveSubsidy >= 0, `Model ${model.id} pmEdriveSubsidy must be >= 0`);
      assert.equal(typeof model.pricing.chargerIncluded, 'boolean', `Model ${model.id} chargerIncluded must be boolean`);
      assert.ok(model.pricing.chargerCost >= 0, `Model ${model.id} chargerCost must be >= 0`);
      assert.ok(model.pricing.insuranceEst > 0, `Model ${model.id} insuranceEst must be > 0`);
      assert.ok(model.pricing.handlingAndDocsEst > 0, `Model ${model.id} handlingAndDocsEst must be > 0`);

      // 3. Specs fields (20+ fields)
      assert.ok(model.specs, `Model ${model.id} missing specs object`);
      assert.ok(model.specs.batteryCapacityKwh > 0, `Model ${model.id} batteryCapacityKwh must be > 0`);
      assert.ok(model.specs.batteryChemistry && model.specs.batteryChemistry.length > 0, `Model ${model.id} missing batteryChemistry`);
      assert.equal(typeof model.specs.isRemovableBattery, 'boolean', `Model ${model.id} isRemovableBattery must be boolean`);
      assert.ok(model.specs.araiRangeKm > 0, `Model ${model.id} araiRangeKm must be > 0`);
      assert.ok(model.specs.realWorldEcoRangeKm > 0, `Model ${model.id} realWorldEcoRangeKm must be > 0`);
      assert.ok(model.specs.realWorldCityRangeKm > 0, `Model ${model.id} realWorldCityRangeKm must be > 0`);
      assert.ok(model.specs.realWorldHighwayRangeKm > 0, `Model ${model.id} realWorldHighwayRangeKm must be > 0`);
      assert.ok(model.specs.topSpeedKmh > 0, `Model ${model.id} topSpeedKmh must be > 0`);
      assert.ok(model.specs.accel0To40Kmh > 0, `Model ${model.id} accel0To40Kmh must be > 0`);
      assert.ok(model.specs.motorPeakPowerKw > 0, `Model ${model.id} motorPeakPowerKw must be > 0`);
      assert.ok(model.specs.motorRatedPowerKw > 0, `Model ${model.id} motorRatedPowerKw must be > 0`);
      assert.ok(model.specs.chargingTime0To80 && model.specs.chargingTime0To80.length > 0, `Model ${model.id} missing chargingTime0To80`);
      assert.ok(model.specs.chargingTime0To100 && model.specs.chargingTime0To100.length > 0, `Model ${model.id} missing chargingTime0To100`);
      assert.equal(typeof model.specs.fastChargingSupport, 'boolean', `Model ${model.id} fastChargingSupport must be boolean`);
      assert.ok(model.specs.fastChargingRate && model.specs.fastChargingRate.length > 0, `Model ${model.id} missing fastChargingRate`);
      assert.ok(model.specs.bootSpaceLiters >= 0, `Model ${model.id} bootSpaceLiters must be >= 0`);
      assert.ok(Array.isArray(model.specs.ridingModes) && model.specs.ridingModes.length > 0, `Model ${model.id} ridingModes must be non-empty array`);
      assert.ok(model.specs.brakes && model.specs.brakes.length > 0, `Model ${model.id} missing brakes`);
      assert.ok(model.specs.kerbWeightKg > 0, `Model ${model.id} kerbWeightKg must be > 0`);
      assert.ok(model.specs.groundClearanceMm > 0, `Model ${model.id} groundClearanceMm must be > 0`);
      assert.equal(typeof model.specs.touchscreen, 'boolean', `Model ${model.id} touchscreen must be boolean`);
      assert.ok(Array.isArray(model.specs.connectivity) && model.specs.connectivity.length > 0, `Model ${model.id} connectivity must be non-empty array`);

      // 4. Warranty fields (5 fields)
      assert.ok(model.warranty, `Model ${model.id} missing warranty`);
      assert.ok(model.warranty.batteryYears >= 3, `Model ${model.id} batteryYears must be >= 3`);
      assert.ok(model.warranty.batteryKm >= 30000, `Model ${model.id} batteryKm must be >= 30000`);
      assert.ok(model.warranty.vehicleYears >= 3, `Model ${model.id} vehicleYears must be >= 3`);
      assert.ok(model.warranty.vehicleKm >= 30000, `Model ${model.id} vehicleKm must be >= 30000`);
      assert.equal(typeof model.warranty.extendedAvailable, 'boolean');

      // 5. Arrays: features, pros, cons, badges, colorOptions
      assert.ok(Array.isArray(model.features) && model.features.length >= 4, `Model ${model.id} features must have >= 4 items`);
      assert.ok(Array.isArray(model.pros) && model.pros.length >= 2, `Model ${model.id} pros must have >= 2 items`);
      assert.ok(Array.isArray(model.cons) && model.cons.length >= 2, `Model ${model.id} cons must have >= 2 items`);
      assert.ok(Array.isArray(model.badges) && model.badges.length >= 2, `Model ${model.id} badges must have >= 2 items`);
      assert.ok(Array.isArray(model.colorOptions) && model.colorOptions.length >= 2, `Model ${model.id} colorOptions must have >= 2 items`);
      for (const color of model.colorOptions) {
        assert.ok(color.name && color.name.length > 0, `Model ${model.id} color missing name`);
        assert.ok(/^#[0-9a-fA-F]{6}$/.test(color.hex), `Model ${model.id} color ${color.name} invalid hex ${color.hex}`);
      }
    }
  });

  it('validates physical and financial constraints on every EV model', () => {
    for (const model of evModels) {
      // Battery Capacity realistic bounds: 1.5 kWh to 20.0 kWh
      assert.ok(
        model.specs.batteryCapacityKwh >= 1.5 && model.specs.batteryCapacityKwh <= 20.0,
        `Model ${model.id} battery capacity ${model.specs.batteryCapacityKwh} kWh out of realistic bounds [1.5, 20.0]`
      );

      // Top speed realistic bounds: 45 km/h to 200 km/h
      assert.ok(
        model.specs.topSpeedKmh >= 45 && model.specs.topSpeedKmh <= 200,
        `Model ${model.id} top speed ${model.specs.topSpeedKmh} km/h out of realistic bounds [45, 200]`
      );

      // 0-40 km/h acceleration bounds: 1.0s to 7.0s
      assert.ok(
        model.specs.accel0To40Kmh >= 1.0 && model.specs.accel0To40Kmh <= 7.0,
        `Model ${model.id} accel0To40 ${model.specs.accel0To40Kmh}s out of bounds [1.0, 7.0]`
      );

      // Kerb weight bounds: 90 kg to 220 kg
      assert.ok(
        model.specs.kerbWeightKg >= 90 && model.specs.kerbWeightKg <= 220,
        `Model ${model.id} kerb weight ${model.specs.kerbWeightKg} kg out of bounds [90, 220]`
      );

      // Ground clearance bounds: 140 mm to 230 mm
      assert.ok(
        model.specs.groundClearanceMm >= 140 && model.specs.groundClearanceMm <= 230,
        `Model ${model.id} ground clearance ${model.specs.groundClearanceMm} mm out of bounds [140, 230]`
      );

      // Range hierarchy: ARAI Claimed / IDC Range > Real World Eco >= Real World City >= Real World Highway
      assert.ok(
        model.specs.araiRangeKm > model.specs.realWorldCityRangeKm,
        `Model ${model.id}: ARAI range (${model.specs.araiRangeKm}) must be strictly > Real World City Range (${model.specs.realWorldCityRangeKm})`
      );
      assert.ok(
        model.specs.realWorldEcoRangeKm >= model.specs.realWorldCityRangeKm,
        `Model ${model.id}: Eco range (${model.specs.realWorldEcoRangeKm}) must be >= City Range (${model.specs.realWorldCityRangeKm})`
      );
      assert.ok(
        model.specs.realWorldCityRangeKm >= model.specs.realWorldHighwayRangeKm,
        `Model ${model.id}: City range (${model.specs.realWorldCityRangeKm}) must be >= Highway Range (${model.specs.realWorldHighwayRangeKm})`
      );

      // Ex-showroom prices: ₹65,000 to ₹4,50,000
      assert.ok(
        model.pricing.exShowroom >= 65000 && model.pricing.exShowroom <= 450000,
        `Model ${model.id} exShowroom ₹${model.pricing.exShowroom} out of Indian EV market bounds [65000, 450000]`
      );

      // Verify subsidy value is non-negative and realistic
      assert.ok(
        model.pricing.pmEdriveSubsidy >= 0 && model.pricing.pmEdriveSubsidy <= 10000,
        `Model ${model.id} pmEdriveSubsidy ${model.pricing.pmEdriveSubsidy} out of bounds [0, 10000]`
      );
    }
  });

  it('validates image URLs are valid non-empty URLs with valid protocols', () => {
    for (const model of allModels) {
      assert.ok(model.imageUrl && typeof model.imageUrl === 'string', `Model ${model.id} missing imageUrl`);
      assert.ok(
        model.imageUrl.startsWith('https://') || model.imageUrl.startsWith('http://'),
        `Model ${model.id} imageUrl "${model.imageUrl}" must start with http:// or https://`
      );
      // Ensure URL is parseable
      assert.doesNotThrow(() => new URL(model.imageUrl), `Model ${model.id} imageUrl is not a valid URL`);
    }
  });

  it('tests query helper functions with various inputs and edge cases', () => {
    // 1. getEVModels()
    const evList = getEVModels();
    assert.ok(evList.length >= 36);
    assert.ok(evList.every(m => !m.isIceBenchmark));

    // 2. getAllVehiclesIncludingBenchmark()
    const allList = getAllVehiclesIncludingBenchmark();
    assert.equal(allList.length, evList.length + 1);
    assert.ok(allList.some(m => m.isIceBenchmark === true && m.id === 'honda-activa-6g'));

    // 3. getEVModelById()
    assert.equal(getEVModelById('ather-rizta-z-37')?.name, 'Ather Rizta Z (3.7 kWh)');
    assert.equal(getEVModelById('ola-s1-pro-gen2')?.brand, 'Ola Electric');
    assert.equal(getEVModelById('ultraviolette-f77-mach2')?.category, 'motorcycle');
    assert.equal(getEVModelById('non-existent-id'), undefined);
    assert.equal(getEVModelById(''), undefined);

    // 4. getEVModelsByCategory()
    const scooters = getEVModelsByCategory('scooter');
    const motorcycles = getEVModelsByCategory('motorcycle');
    assert.equal(scooters.length + motorcycles.length, evList.length);
    assert.ok(scooters.every(m => m.category === 'scooter' && !m.isIceBenchmark));
    assert.ok(motorcycles.every(m => m.category === 'motorcycle' && !m.isIceBenchmark));
    assert.ok(scooters.length >= 17, 'Expected at least 17 electric scooter models');
    assert.ok(motorcycles.length >= 18, 'Expected at least 18 electric motorcycle models');

    // 5. getEVModelsByBrand()
    const atherModels = getEVModelsByBrand('Ather Energy');
    assert.ok(atherModels.length >= 2);
    const atherCaseInsensitive = getEVModelsByBrand('ather energy');
    assert.ok(atherCaseInsensitive.length >= 2);
    const olaModels = getEVModelsByBrand('Ola Electric');
    assert.ok(olaModels.length >= 3);
    const tvsModels = getEVModelsByBrand('TVS Motor');
    assert.ok(tvsModels.length >= 2);
    const unknownBrand = getEVModelsByBrand('NonExistentBrand');
    assert.equal(unknownBrand.length, 0);
  });
});

describe('Challenger 2 Empirical Verification: Telangana RTO & Districts Data (src/data/telanganaRtoData.ts)', () => {
  it('verifies all 38 RTO codes (TG-01 to TG-38) are uniquely present in order', () => {
    assert.equal(TELANGANA_RTOS.length, 38, 'TELANGANA_RTOS must have exactly 38 entries');
    const rtoCodes = new Set<string>();
    const seriesNumbers = new Set<number>();

    for (let i = 1; i <= 38; i++) {
      const expectedCode = `TG-${String(i).padStart(2, '0')}`;
      const rto = TELANGANA_RTOS.find(r => r.rtoCode === expectedCode);
      assert.ok(rto, `Missing RTO entry for ${expectedCode}`);
      assert.equal(rto.seriesNumber, i, `RTO ${expectedCode} has incorrect seriesNumber ${rto.seriesNumber}`);
      assert.equal(rto.legacyCode, `TS-${String(i).padStart(2, '0')}`);
      assert.ok(rto.districtId && rto.districtId.length > 0, `RTO ${expectedCode} missing districtId`);
      assert.ok(rto.districtName && rto.districtName.length > 0, `RTO ${expectedCode} missing districtName`);
      assert.ok(rto.officeLocation && rto.officeLocation.length > 0, `RTO ${expectedCode} missing officeLocation`);
      assert.ok(rto.zone && rto.zone.length > 0, `RTO ${expectedCode} missing zone`);
      assert.ok(Array.isArray(rto.majorLocalities) && rto.majorLocalities.length > 0, `RTO ${expectedCode} missing majorLocalities`);
      assert.ok(rto.trafficProfile && rto.trafficProfile.length > 0, `RTO ${expectedCode} missing trafficProfile`);

      rtoCodes.add(rto.rtoCode);
      seriesNumbers.add(rto.seriesNumber);
    }

    assert.equal(rtoCodes.size, 38, 'All 38 RTO codes must be unique');
    assert.equal(seriesNumbers.size, 38, 'All 38 series numbers must be unique');
  });

  it('verifies all 33 administrative districts of Telangana are represented', () => {
    const districts = getTelanganaDistricts();
    assert.ok(districts.length >= 33, `Expected at least 33 districts, got ${districts.length}`);
    
    // Check all district IDs are unique
    const districtIds = new Set(districts.map(d => d.id));
    assert.equal(districtIds.size, districts.length, 'District IDs must be unique');

    // Verify key Telangana districts
    const expectedDistricts = [
      'hyderabad-central', 'hyderabad-north', 'hyderabad-east', 'hyderabad-south', 'hyderabad-west',
      'rangareddy', 'medchal-malkajgiri', 'sangareddy', 'hanamkonda', 'warangal-rural',
      'karimnagar', 'khammam', 'nizamabad', 'kamareddy', 'nalgonda', 'suryapet',
      'yadadri-bhuvanagiri', 'mahabubnagar', 'nagarkurnool', 'wanaparthy', 'jogulamba-gadwal',
      'narayanpet', 'siddipet', 'rajanna-sircilla', 'jagtial', 'peddapalli', 'mancherial',
      'nirmal', 'adilabad', 'kumuram-bheem-asifabad', 'bhadradri-kothagudem', 'mahabubabad',
      'jangaon', 'jayashankar-bhupalpally', 'mulugu', 'medak', 'vikarabad'
    ];

    for (const id of expectedDistricts) {
      const found = getDistrictById(id);
      assert.ok(found, `Expected district ID ${id} not found in getDistrictById`);
      assert.ok(found.name && found.name.length > 0);
      assert.ok(found.rtoCode && found.rtoCode.startsWith('TG-'));
      assert.ok(found.zone && found.zone.length > 0);
    }
  });

  it('verifies getRtoByCode handles TG-, TS-, lowercase, whitespace, and invalid codes', () => {
    // Normal TG-09
    const rto9 = getRtoByCode('TG-09');
    assert.ok(rto9);
    assert.equal(rto9.districtId, 'hyderabad-central');

    // Legacy TS-09
    const rto9Legacy = getRtoByCode('TS-09');
    assert.ok(rto9Legacy);
    assert.equal(rto9Legacy.rtoCode, 'TG-09');

    // Case insensitive & whitespace
    const rto9Lower = getRtoByCode('  tg-09  ');
    assert.ok(rto9Lower);
    assert.equal(rto9Lower.rtoCode, 'TG-09');

    const rto9LegacyLower = getRtoByCode('  ts-09 ');
    assert.ok(rto9LegacyLower);
    assert.equal(rto9LegacyLower.rtoCode, 'TG-09');

    // Invalid codes
    assert.equal(getRtoByCode('TG-99'), undefined);
    assert.equal(getRtoByCode('AP-09'), undefined);
    assert.equal(getRtoByCode(''), undefined);
  });

  it('verifies getDistrictById handles valid, invalid, and empty strings', () => {
    const hyd = getDistrictById('hyderabad-central');
    assert.ok(hyd);
    assert.equal(hyd.rtoCode, 'TG-09');

    assert.equal(getDistrictById('non-existent-district'), undefined);
    assert.equal(getDistrictById(''), undefined);
  });

  it('verifies getRtosByDistrict and getRtosByZone queries', () => {
    const hydRtos = getRtosByDistrict('hyderabad-central');
    assert.ok(hydRtos.length >= 1);
    assert.equal(hydRtos[0].rtoCode, 'TG-09');

    const metroRtos = getRtosByZone('Hyderabad Metro');
    assert.equal(metroRtos.length, 6, 'Hyderabad Metro should contain TG-09 through TG-14');
    const metroCodes = metroRtos.map(r => r.rtoCode);
    assert.deepEqual(metroCodes, ['TG-09', 'TG-10', 'TG-11', 'TG-12', 'TG-13', 'TG-14']);

    const allRtos = getAllRtos();
    assert.equal(allRtos.length, 38);
  });

  it('verifies statutory economic constants and TSSPDCL tariff structure', () => {
    assert.equal(TELANGANA_CURRENT_PETROL_PRICE, 109.66);
    assert.equal(TELANGANA_AVG_ELECTRICITY_RATE, 7.50);
    assert.ok(Array.isArray(TSSPDCL_DOMESTIC_TARIFF_SLABS));
    assert.ok(TSSPDCL_DOMESTIC_TARIFF_SLABS.length >= 4);

    assert.ok(TELANGANA_EV_POLICY_HIGHLIGHTS.governmentOrder.includes('G.O. Ms No. 41'));
    assert.ok(TELANGANA_EV_POLICY_HIGHLIGHTS.validityPeriod.includes('2026'));
    assert.ok(TELANGANA_EV_POLICY_HIGHLIGHTS.roadTaxExemption.includes('100%'));
  });
});
