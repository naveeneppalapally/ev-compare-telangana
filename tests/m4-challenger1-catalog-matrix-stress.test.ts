import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getAllVehiclesIncludingBenchmark,
  getEVModels,
  getEVModelById,
  getEVModelsByCategory,
  EV_MODELS
} from '../src/data/evModels.ts';

import {
  TELANGANA_RTOS,
  TELANGANA_DISTRICTS,
  getRtoByCode,
  getDistrictById
} from '../src/data/telanganaRtoData.ts';

import {
  calculateTelanganaOnRoadPrice,
  formatINR
} from '../src/utils/priceCalculator.ts';

import type { EVModel, VehicleCategory } from '../src/types/ev.ts';

describe('Challenger 1: Empirical EV Catalog & Authentic Specifications Audit', () => {
  const allVehicles = getAllVehiclesIncludingBenchmark();
  const evOnly = getEVModels();
  const motorcycles = getEVModelsByCategory('motorcycle');
  const scooters = getEVModelsByCategory('scooter');

  it('verifies catalog size meets and exceeds 36+ EV models (18+ motorcycles, 17+ scooters)', () => {
    assert.ok(allVehicles.length >= 41, `Total vehicle catalog must be >= 41, got ${allVehicles.length}`);
    assert.ok(evOnly.length >= 40, `EV-only models must be >= 40, got ${evOnly.length}`);
    assert.ok(motorcycles.length >= 23, `Real electric motorcycles must be >= 23, got ${motorcycles.length}`);
    assert.ok(scooters.length >= 17, `Real electric scooters must be >= 17, got ${scooters.length}`);
  });

  it('verifies exact benchmark ICE vehicle presence (Honda Activa 6G)', () => {
    const activa = allVehicles.find(v => v.isIceBenchmark);
    assert.ok(activa, 'ICE Benchmark vehicle must exist');
    assert.equal(activa?.id, 'honda-activa-6g');
    assert.ok(activa?.brand.includes('Honda'), 'Brand must include Honda');
    assert.equal(activa?.isIceBenchmark, true);
  });

  it('validates 100% data completeness with zero null, undefined, or NaN specs across all 41 vehicles', () => {
    for (const vehicle of allVehicles) {
      assert.ok(vehicle.id && vehicle.id.length > 0, `Vehicle missing valid id: ${JSON.stringify(vehicle)}`);
      assert.ok(vehicle.name && vehicle.name.length > 0, `Vehicle ${vehicle.id} missing name`);
      assert.ok(vehicle.brand && vehicle.brand.length > 0, `Vehicle ${vehicle.id} missing brand`);
      assert.ok(vehicle.tagline && vehicle.tagline.length > 0, `Vehicle ${vehicle.id} missing tagline`);
      assert.ok(vehicle.idealFor && vehicle.idealFor.length > 0, `Vehicle ${vehicle.id} missing idealFor`);
      assert.ok(vehicle.imageUrl && vehicle.imageUrl.startsWith('https://'), `Vehicle ${vehicle.id} missing valid HTTPS imageUrl`);

      // Pricing integrity
      assert.ok(typeof vehicle.pricing.exShowroom === 'number' && vehicle.pricing.exShowroom > 0, `${vehicle.id} invalid exShowroom`);
      assert.ok(typeof vehicle.pricing.insuranceEst === 'number' && vehicle.pricing.insuranceEst > 0, `${vehicle.id} invalid insuranceEst`);
      assert.ok(typeof vehicle.pricing.handlingAndDocsEst === 'number' && vehicle.pricing.handlingAndDocsEst >= 0, `${vehicle.id} invalid handlingAndDocsEst`);
      assert.ok(typeof vehicle.pricing.pmEdriveSubsidy === 'number' && vehicle.pricing.pmEdriveSubsidy >= 0, `${vehicle.id} invalid pmEdriveSubsidy`);

      // Specifications integrity
      if (vehicle.isIceBenchmark) {
        assert.equal(vehicle.specs.batteryCapacityKwh, 0);
      } else {
        assert.ok(vehicle.specs.batteryCapacityKwh > 0, `${vehicle.id} invalid batteryCapacityKwh`);
        assert.ok(vehicle.specs.batteryChemistry && vehicle.specs.batteryChemistry.length > 0, `${vehicle.id} missing batteryChemistry`);
      }
      assert.ok(vehicle.specs.araiRangeKm > 0, `${vehicle.id} invalid araiRangeKm`);
      assert.ok(vehicle.specs.realWorldCityRangeKm > 0, `${vehicle.id} invalid realWorldCityRangeKm`);
      assert.ok(vehicle.specs.realWorldHighwayRangeKm > 0, `${vehicle.id} invalid realWorldHighwayRangeKm`);
      assert.ok(vehicle.specs.motorPeakPowerKw > 0, `${vehicle.id} invalid motorPeakPowerKw`);
      assert.ok(vehicle.specs.topSpeedKmh > 0, `${vehicle.id} invalid topSpeedKmh`);
      assert.ok(vehicle.specs.accel0To40Kmh > 0, `${vehicle.id} invalid accel0To40Kmh`);
      assert.ok(vehicle.specs.kerbWeightKg > 0, `${vehicle.id} invalid kerbWeightKg`);
      assert.ok(vehicle.specs.groundClearanceMm > 0, `${vehicle.id} invalid groundClearanceMm`);
      assert.ok(vehicle.specs.ridingModes.length > 0, `${vehicle.id} empty ridingModes`);
      assert.ok(vehicle.specs.brakes.length > 0, `${vehicle.id} missing brakes`);
      assert.ok(vehicle.specs.chargingTime0To80.length > 0, `${vehicle.id} missing chargingTime0To80`);
      assert.ok(vehicle.specs.chargingTime0To100.length > 0, `${vehicle.id} missing chargingTime0To100`);

      // Warranty & Ratings
      assert.ok(vehicle.warranty.batteryYears >= 0, `${vehicle.id} invalid batteryYears`);
      assert.ok(vehicle.warranty.batteryKm >= 0, `${vehicle.id} invalid batteryKm`);
      assert.ok(vehicle.warranty.vehicleYears > 0, `${vehicle.id} invalid vehicleYears`);
      assert.ok(vehicle.warranty.vehicleKm > 0, `${vehicle.id} invalid vehicleKm`);
      assert.ok(vehicle.rating >= 3.0 && vehicle.rating <= 5.0, `${vehicle.id} rating out of bounds (3.0-5.0)`);
      assert.ok(vehicle.reviewCount > 0, `${vehicle.id} invalid reviewCount`);

      // Pros, Cons, Features, Colors
      assert.ok(vehicle.pros.length >= 2, `${vehicle.id} must have >= 2 pros`);
      assert.ok(vehicle.cons.length >= 2, `${vehicle.id} must have >= 2 cons`);
      assert.ok(vehicle.features.length >= 3, `${vehicle.id} must have >= 3 features`);
      assert.ok(vehicle.badges.length >= 1, `${vehicle.id} must have >= 1 badge`);
      assert.ok(vehicle.colorOptions.length >= 1, `${vehicle.id} must have >= 1 color option`);
    }
  });

  it('scans all text strings for banned synthetic placeholder artifacts', () => {
    const bannedPatterns = [/lorem/i, /ipsum/i, /placeholder/i, /dummy/i, /synthetic/i, /foo\s*bar/i, /tbd/i, /fake/i];

    for (const vehicle of allVehicles) {
      const textsToAudit = [
        vehicle.name,
        vehicle.brand,
        vehicle.tagline,
        vehicle.idealFor,
        ...vehicle.pros,
        ...vehicle.cons,
        ...vehicle.features,
        ...vehicle.badges,
        vehicle.specs.chargingTime0To80,
        vehicle.specs.chargingTime0To100,
        vehicle.specs.brakes,
        vehicle.specs.suspensionFront,
        vehicle.specs.suspensionRear
      ];

      for (const text of textsToAudit) {
        if (!text) continue;
        for (const pattern of bannedPatterns) {
          assert.ok(!pattern.test(text), `Synthetic filler detected in ${vehicle.id}: "${text}" matched ${pattern}`);
        }
      }
    }
  });

  it('audits physical range logic (Real City Range must not exceed ARAI claimed by impossible margins)', () => {
    for (const ev of evOnly) {
      assert.ok(
        ev.specs.realWorldCityRangeKm <= ev.specs.araiRangeKm * 1.1,
        `EV ${ev.id} real city range (${ev.specs.realWorldCityRangeKm} km) cannot unrealistically exceed ARAI (${ev.specs.araiRangeKm} km)`
      );
      assert.ok(
        ev.specs.realWorldHighwayRangeKm <= ev.specs.realWorldCityRangeKm * 1.25,
        `EV ${ev.id} highway range (${ev.specs.realWorldHighwayRangeKm} km) vs city range (${ev.specs.realWorldCityRangeKm} km)`
      );
    }
  });
});

describe('Challenger 1: Search Indexing & Adversarial Query Stress Testing', () => {
  const evModels = getEVModels();

  // Helper matching function mirroring CompareContext filter logic
  const searchFilter = (models: EVModel[], query: string): EVModel[] => {
    if (!query.trim()) return models;
    const q = query.toLowerCase().trim();
    return models.filter((model) => {
      const matchesName = model.name.toLowerCase().includes(q);
      const matchesBrand = model.brand.toLowerCase().includes(q);
      const matchesTagline = model.tagline.toLowerCase().includes(q);
      const matchesIdeal = model.idealFor.toLowerCase().includes(q);
      const matchesFeatures = model.features.some((f) => f.toLowerCase().includes(q));
      const matchesPros = model.pros.some((p) => p.toLowerCase().includes(q));
      const matchesChemistry = model.specs.batteryChemistry.toLowerCase().includes(q);
      return matchesName || matchesBrand || matchesTagline || matchesIdeal || matchesFeatures || matchesPros || matchesChemistry;
    });
  };

  it('handles regex metacharacters and escapes without throwing exceptions', () => {
    const maliciousRegexQueries = [
      '.*', '+', '?', '(', ')', '[', ']', '{', '}', '^', '$', '\\', '|',
      'Ather.*', 'Ola+', '(Revolt)', '[0-9]+', '\\d+', '(?=.*)', '.*.*.*'
    ];

    for (const query of maliciousRegexQueries) {
      assert.doesNotThrow(() => {
        const results = searchFilter(evModels, query);
        assert.ok(Array.isArray(results), `Query "${query}" must return array`);
      }, `Search crashed on regex query: "${query}"`);
    }
  });

  it('handles SQL and XSS injection attempts as harmless literal strings', () => {
    const injectionQueries = [
      "' OR '1'='1",
      "'; DROP TABLE vehicles; --",
      "<script>alert('xss')</script>",
      "<img src=x onerror=alert(1)>",
      "\" onclick=\"alert('pwned')",
      "{{constructor.constructor('alert(1)')()}}"
    ];

    for (const query of injectionQueries) {
      assert.doesNotThrow(() => {
        const results = searchFilter(evModels, query);
        assert.equal(results.length, 0, `Injection string "${query}" should safely match 0 models`);
      });
    }
  });

  it('evaluates case-insensitive multi-field search robustness', () => {
    // Brand search
    const atherLower = searchFilter(evModels, 'ather');
    const atherUpper = searchFilter(evModels, 'ATHER');
    const atherMixed = searchFilter(evModels, 'AtHeR');
    assert.equal(atherLower.length, atherUpper.length);
    assert.equal(atherLower.length, atherMixed.length);
    assert.ok(atherLower.length >= 3, 'Must match Ather 450X, 450 Apex, Rizta');

    // Battery chemistry search
    const lfpResults = searchFilter(evModels, 'lfp');
    assert.ok(lfpResults.length > 0, 'Must match LFP battery vehicles');
    for (const model of lfpResults) {
      const matchInChem = model.specs.batteryChemistry.toLowerCase().includes('lfp');
      const matchInText = model.features.some(f => f.toLowerCase().includes('lfp')) || model.pros.some(p => p.toLowerCase().includes('lfp'));
      assert.ok(matchInChem || matchInText, `${model.id} should contain LFP in specs or features/pros`);
    }

    // Feature search (e.g. "Google Maps" / "Hill Hold")
    const hillHoldResults = searchFilter(evModels, 'hill hold');
    assert.ok(hillHoldResults.length > 0, 'Should find vehicles with hill hold feature');
  });

  it('evaluates whitespace and boundary padding tolerances', () => {
    const normalOla = searchFilter(evModels, 'ola');
    const paddedOla = searchFilter(evModels, '   ola   \t\n');
    assert.equal(paddedOla.length, normalOla.length);
    assert.ok(normalOla.length >= 4, 'Should find all Ola models');

    // Empty and whitespace-only queries must return all 40 models
    assert.equal(searchFilter(evModels, '').length, evModels.length);
    assert.equal(searchFilter(evModels, '   ').length, evModels.length);
    assert.equal(searchFilter(evModels, '\t\n\r').length, evModels.length);
  });
});

describe('Challenger 1: Multi-Filter Combinations & Boundary Corner Stress Testing', () => {
  const evModels = getEVModels();

  interface FilterParams {
    category?: VehicleCategory;
    priceRangeMax?: number;
    budgetUnder1L?: boolean;
    minRealRangeKm?: number;
    requireRemovableBattery?: boolean;
    requireFastCharging?: boolean;
    minBootSpaceLiters?: number;
    activeFilterBadge?: string | null;
    searchQuery?: string;
    sortBy?: string;
    rtoCode?: string;
  }

  const applyMultiFilter = (models: EVModel[], params: FilterParams): EVModel[] => {
    const {
      category = 'all',
      priceRangeMax = 1000000,
      budgetUnder1L = false,
      minRealRangeKm = 0,
      requireRemovableBattery = false,
      requireFastCharging = false,
      minBootSpaceLiters = 0,
      activeFilterBadge = null,
      searchQuery = '',
      sortBy = 'recommended',
      rtoCode = 'TG-09'
    } = params;

    return models.filter((model) => {
      if (model.isIceBenchmark) return false;
      if (category !== 'all' && model.category !== category) return false;

      const onRoadEst = calculateTelanganaOnRoadPrice(model, rtoCode).totalTelanganaOnRoadPrice;
      if (budgetUnder1L && onRoadEst > 100000 && model.pricing.exShowroom > 100000) return false;
      if (model.pricing.exShowroom > priceRangeMax && onRoadEst > priceRangeMax) return false;
      if (minRealRangeKm > 0 && model.specs.realWorldCityRangeKm < minRealRangeKm) return false;
      if (requireRemovableBattery && !model.specs.isRemovableBattery) return false;
      if (requireFastCharging && !model.specs.fastChargingSupport) return false;
      if (minBootSpaceLiters > 0 && (model.specs.bootSpaceLiters || 0) < minBootSpaceLiters) return false;

      if (activeFilterBadge) {
        const matchesBadge = model.badges.some((b) => b.toLowerCase().includes(activeFilterBadge.toLowerCase()));
        const matchesFeature = model.features.some((f) => f.toLowerCase().includes(activeFilterBadge.toLowerCase()));
        if (!matchesBadge && !matchesFeature) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = model.name.toLowerCase().includes(q);
        const matchesBrand = model.brand.toLowerCase().includes(q);
        const matchesTagline = model.tagline.toLowerCase().includes(q);
        const matchesIdeal = model.idealFor.toLowerCase().includes(q);
        const matchesFeatures = model.features.some((f) => f.toLowerCase().includes(q));
        const matchesPros = model.pros.some((p) => p.toLowerCase().includes(q));
        const matchesChemistry = model.specs.batteryChemistry.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesTagline && !matchesIdeal && !matchesFeatures && !matchesPros && !matchesChemistry) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.pricing.exShowroom - b.pricing.exShowroom;
        case 'priceDesc':
          return b.pricing.exShowroom - a.pricing.exShowroom;
        case 'rangeDesc':
          return b.specs.realWorldCityRangeKm - a.specs.realWorldCityRangeKm;
        case 'speedDesc':
          return b.specs.topSpeedKmh - a.specs.topSpeedKmh;
        case 'ratingDesc':
          return b.rating - a.rating;
        case 'recommended':
        default:
          return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
      }
    });
  };

  it('evaluates orthogonal filters (Motorcycles with Fast Charging under ₹2,00,000)', () => {
    const results = applyMultiFilter(evModels, {
      category: 'motorcycle',
      requireFastCharging: true,
      priceRangeMax: 200000
    });

    assert.ok(results.length > 0, 'Must find fast charging motorcycles under ₹2L');
    for (const m of results) {
      assert.equal(m.category, 'motorcycle');
      assert.equal(m.specs.fastChargingSupport, true);
      assert.ok(m.pricing.exShowroom <= 200000 || calculateTelanganaOnRoadPrice(m).totalTelanganaOnRoadPrice <= 200000);
    }
  });

  it('evaluates high boot space scooters (> 30 Liters) for family utility', () => {
    const results = applyMultiFilter(evModels, {
      category: 'scooter',
      minBootSpaceLiters: 30
    });

    assert.ok(results.length >= 3, 'Must match River Indie, Ather Rizta, Ola S1 Pro Gen 2, etc.');
    for (const m of results) {
      assert.equal(m.category, 'scooter');
      assert.ok((m.specs.bootSpaceLiters || 0) >= 30);
    }
  });

  it('evaluates apartment dwellers constraint: strictly removable batteries', () => {
    const results = applyMultiFilter(evModels, {
      requireRemovableBattery: true
    });

    assert.ok(results.length >= 4, 'Must find Hero Vida, Revolt RV1/RV400, etc.');
    for (const m of results) {
      assert.equal(m.specs.isRemovableBattery, true, `${m.id} must have removable battery`);
    }
  });

  it('handles mutually contradictory filter sets returning 0 results gracefully', () => {
    // Motorcycle + Removable Battery + Boot Space > 30L (impossible combination in 2-wheelers)
    const impossibleResults = applyMultiFilter(evModels, {
      category: 'motorcycle',
      requireRemovableBattery: true,
      minBootSpaceLiters: 30
    });

    assert.equal(impossibleResults.length, 0, 'Contradictory filter must return 0 results without errors');
  });

  it('verifies sorting orders across all 6 sorting modes', () => {
    const sortModes = ['priceAsc', 'priceDesc', 'rangeDesc', 'speedDesc', 'ratingDesc', 'recommended'];

    for (const mode of sortModes) {
      const sorted = applyMultiFilter(evModels, { sortBy: mode });
      assert.equal(sorted.length, evModels.length);

      if (mode === 'priceAsc') {
        for (let i = 0; i < sorted.length - 1; i++) {
          assert.ok(sorted[i].pricing.exShowroom <= sorted[i + 1].pricing.exShowroom, `priceAsc violated at index ${i}`);
        }
      } else if (mode === 'priceDesc') {
        for (let i = 0; i < sorted.length - 1; i++) {
          assert.ok(sorted[i].pricing.exShowroom >= sorted[i + 1].pricing.exShowroom, `priceDesc violated at index ${i}`);
        }
      } else if (mode === 'rangeDesc') {
        for (let i = 0; i < sorted.length - 1; i++) {
          assert.ok(sorted[i].specs.realWorldCityRangeKm >= sorted[i + 1].specs.realWorldCityRangeKm, `rangeDesc violated at index ${i}`);
        }
      } else if (mode === 'speedDesc') {
        for (let i = 0; i < sorted.length - 1; i++) {
          assert.ok(sorted[i].specs.topSpeedKmh >= sorted[i + 1].specs.topSpeedKmh, `speedDesc violated at index ${i}`);
        }
      } else if (mode === 'ratingDesc') {
        for (let i = 0; i < sorted.length - 1; i++) {
          assert.ok(sorted[i].rating >= sorted[i + 1].rating, `ratingDesc violated at index ${i}`);
        }
      }
    }
  });
});

describe('Challenger 1: Comparison Tray 2-4 Slots & FIFO Eviction Empirical Harness', () => {
  const MAX_COMPARE_LIMIT = 4;

  const simulateToggle = (currentList: string[], id: string): string[] => {
    if (currentList.includes(id)) {
      return currentList.filter((item) => item !== id);
    }
    if (currentList.length >= MAX_COMPARE_LIMIT) {
      return [...currentList.slice(1), id]; // FIFO: evict oldest
    }
    return [...currentList, id];
  };

  const simulateAdd = (currentList: string[], id: string): string[] => {
    if (currentList.includes(id)) return currentList;
    return simulateToggle(currentList, id);
  };

  it('manages 1 to 4 slots correctly without overflowing MAX_COMPARE_LIMIT', () => {
    let tray: string[] = [];
    tray = simulateAdd(tray, 'ather-rizta-z-37');
    assert.deepEqual(tray, ['ather-rizta-z-37']);

    tray = simulateAdd(tray, 'ola-s1-pro-gen2');
    assert.deepEqual(tray, ['ather-rizta-z-37', 'ola-s1-pro-gen2']);

    tray = simulateAdd(tray, 'tvs-iqube-s-34');
    assert.deepEqual(tray, ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34']);

    tray = simulateAdd(tray, 'ultraviolette-f77-mach2');
    assert.deepEqual(tray, ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34', 'ultraviolette-f77-mach2']);
    assert.equal(tray.length, 4);
  });

  it('strictly enforces FIFO eviction when adding 5th, 6th, and 7th vehicles', () => {
    let tray = ['v1', 'v2', 'v3', 'v4'];
    
    // Add 5th (v5) -> drops v1
    tray = simulateAdd(tray, 'v5');
    assert.deepEqual(tray, ['v2', 'v3', 'v4', 'v5']);

    // Add 6th (v6) -> drops v2
    tray = simulateAdd(tray, 'v6');
    assert.deepEqual(tray, ['v3', 'v4', 'v5', 'v6']);

    // Add 7th (v7) -> drops v3
    tray = simulateAdd(tray, 'v7');
    assert.deepEqual(tray, ['v4', 'v5', 'v6', 'v7']);
  });

  it('prevents duplicates when adding already present items via simulateAdd', () => {
    let tray = ['v1', 'v2', 'v3'];
    tray = simulateAdd(tray, 'v2');
    assert.deepEqual(tray, ['v1', 'v2', 'v3'], 'Duplicate add must not change state or order');
  });

  it('toggles off items when using simulateToggle on existing items', () => {
    let tray = ['v1', 'v2', 'v3'];
    tray = simulateToggle(tray, 'v2');
    assert.deepEqual(tray, ['v1', 'v3'], 'Toggle on existing item must remove it');
  });
});

describe('Challenger 1: Comparison Matrix Difference Highlighting & Winner Determination Logic', () => {
  interface SpecEvaluator<T> {
    getValue: (m: EVModel) => T;
    optimal: 'higher' | 'lower' | 'boolean-true' | 'none';
  }

  const evaluateWinnerAndDiff = <T>(
    models: EVModel[],
    evaluator: SpecEvaluator<T>
  ): { isDifferent: boolean; winnerId: string | null } => {
    const isDifferent =
      models.length > 1 &&
      !models.map((m) => JSON.stringify(evaluator.getValue(m))).every((v, _, arr) => v === arr[0]);

    let winnerId: string | null = null;
    if (models.length > 1 && evaluator.optimal !== 'none') {
      const valid = models
        .map((m) => ({ id: m.id, val: evaluator.getValue(m) }))
        .filter((e) => e.val !== null && e.val !== undefined);

      if (valid.length > 1) {
        if (evaluator.optimal === 'higher') {
          const max = Math.max(...valid.map((e) => Number(e.val)));
          const winners = valid.filter((e) => Number(e.val) === max);
          if (winners.length < valid.length) winnerId = winners[0].id;
        } else if (evaluator.optimal === 'lower') {
          const min = Math.min(...valid.map((e) => Number(e.val)));
          const winners = valid.filter((e) => Number(e.val) === min);
          if (winners.length < valid.length) winnerId = winners[0].id;
        } else if (evaluator.optimal === 'boolean-true') {
          const winners = valid.filter((e) => e.val === true);
          if (winners.length > 0 && winners.length < valid.length) winnerId = winners[0].id;
        }
      }
    }

    return { isDifferent, winnerId };
  };

  it('correctly calculates zero diffs and null winner when comparing identical models', () => {
    const rizta = getEVModelById('ather-rizta-z-37')!;
    const identicalPair = [rizta, rizta];

    const rangeEval = evaluateWinnerAndDiff(identicalPair, {
      getValue: (m) => m.specs.realWorldCityRangeKm,
      optimal: 'higher'
    });
    assert.equal(rangeEval.isDifferent, false, 'Identical models must have isDifferent = false');
    assert.equal(rangeEval.winnerId, null, 'Identical models must have winnerId = null');

    const priceEval = evaluateWinnerAndDiff(identicalPair, {
      getValue: (m) => m.pricing.exShowroom,
      optimal: 'lower'
    });
    assert.equal(priceEval.isDifferent, false);
    assert.equal(priceEval.winnerId, null);
  });

  it('accurately identifies winners across diverse vehicle comparisons (Scooter vs Super-Motorcycle vs Budget EV)', () => {
    const rizta = getEVModelById('ather-rizta-z-37')!; // 34L boot, 125 km range
    const f77 = getEVModelById('ultraviolette-f77-mach2')!; // 155 km/h top speed, 2.8s 0-40, 10.3 kWh
    const luna = getEVModelById('kinetic-green-e-luna')!; // ₹69,990 lowest price, light weight
    const vida = getEVModelById('hero-vida-v1-pro')!; // Removable battery: true

    const quartet = [rizta, f77, luna, vida];

    // 1. Top speed (optimal: higher) -> F77 winner
    const speedEval = evaluateWinnerAndDiff(quartet, {
      getValue: (m) => m.specs.topSpeedKmh,
      optimal: 'higher'
    });
    assert.equal(speedEval.isDifferent, true);
    assert.equal(speedEval.winnerId, f77.id);

    // 2. Ex-showroom Price (optimal: lower) -> E-Luna winner
    const priceEval = evaluateWinnerAndDiff(quartet, {
      getValue: (m) => m.pricing.exShowroom,
      optimal: 'lower'
    });
    assert.equal(priceEval.isDifferent, true);
    assert.equal(priceEval.winnerId, luna.id);

    // 3. 0-40 km/h acceleration (optimal: lower) -> F77 winner
    const accelEval = evaluateWinnerAndDiff(quartet, {
      getValue: (m) => m.specs.accel0To40Kmh,
      optimal: 'lower'
    });
    assert.equal(accelEval.isDifferent, true);
    assert.equal(accelEval.winnerId, f77.id);

    // 4. Removable battery (optimal: boolean-true) -> Vida winner
    const removableEval = evaluateWinnerAndDiff(quartet, {
      getValue: (m) => m.specs.isRemovableBattery,
      optimal: 'boolean-true'
    });
    assert.equal(removableEval.isDifferent, true);
    assert.equal(removableEval.winnerId, vida.id);

    // 5. Non-comparable category (optimal: none) -> isDifferent = true, winnerId = null
    const chemistryEval = evaluateWinnerAndDiff(quartet, {
      getValue: (m) => m.specs.batteryChemistry,
      optimal: 'none'
    });
    assert.equal(chemistryEval.isDifferent, true);
    assert.equal(chemistryEval.winnerId, null);
  });
});

describe('Challenger 1: Telangana Regional District & RTO Data Synchronization', () => {
  it('validates 38 Telangana RTO entries covering all districts with valid codes TG-01 to TG-38', () => {
    assert.equal(TELANGANA_RTOS.length, 38, 'Must have exactly 38 Telangana RTO zones');
    for (let i = 1; i <= 38; i++) {
      const expectedCode = `TG-${String(i).padStart(2, '0')}`;
      const rto = getRtoByCode(expectedCode);
      assert.ok(rto, `RTO ${expectedCode} must be present`);
      assert.equal(rto?.rtoCode, expectedCode);
      assert.ok(rto?.districtName.length > 0);
      assert.ok(rto?.majorLocalities.length > 0);
    }
  });

  it('evaluates on-road price stability across all 38 RTOs for top 5 EVs', () => {
    const topEVs = [
      getEVModelById('ather-rizta-z-37')!,
      getEVModelById('ola-s1-pro-gen2')!,
      getEVModelById('tvs-iqube-s-34')!,
      getEVModelById('revolt-rv400-32')!,
      getEVModelById('ultraviolette-f77-mach2')!
    ];

    for (const ev of topEVs) {
      for (const rto of TELANGANA_RTOS) {
        const breakdown = calculateTelanganaOnRoadPrice(ev, rto.rtoCode);
        assert.equal(breakdown.stateRoadTax, 0, `100% Tax waiver must hold in ${rto.rtoCode}`);
        assert.equal(breakdown.registrationAndSmartCardFee, 0, `Registration fee must be ₹0 in ${rto.rtoCode}`);
        assert.ok(breakdown.totalTelanganaOnRoadPrice > ev.pricing.exShowroom * 0.8, `Net price reasonable in ${rto.rtoCode}`);
      }
    }
  });
});
