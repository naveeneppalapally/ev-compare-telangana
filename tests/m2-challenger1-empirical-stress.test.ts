import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getEVModels, getEVModelById } from '../src/data/evModels.ts';
import { calculateTelanganaOnRoadPrice } from '../src/utils/priceCalculator.ts';
import type { EVModel, VehicleCategory } from '../src/types/ev.ts';

// -----------------------------------------------------------------------------
// Pure Functional Simulators of CompareContext & CompareMatrix Logic
// -----------------------------------------------------------------------------

const MAX_COMPARE_LIMIT = 4;
const DEFAULT_COMPARE_IDS = ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34'];

/** Simulates CompareContext.toggleCompare */
function simulateToggleCompare(current: string[], id: string, maxLimit = MAX_COMPARE_LIMIT): string[] {
  if (current.includes(id)) {
    return current.filter(item => item !== id);
  }
  if (current.length >= maxLimit) {
    return [...current.slice(1), id];
  }
  return [...current, id];
}

/** Simulates CompareContext.addToCompare */
function simulateAddToCompare(current: string[], id: string, maxLimit = MAX_COMPARE_LIMIT): string[] {
  if (current.includes(id)) {
    return current;
  }
  if (current.length >= maxLimit) {
    return [...current.slice(1), id];
  }
  return [...current, id];
}

/** Simulates CompareContext.removeFromCompare */
function simulateRemoveFromCompare(current: string[], id: string): string[] {
  return current.filter(item => item !== id);
}

/** Simulates CompareMatrix difference highlighting detection */
function isRowDifferent<T>(models: EVModel[], getValue: (m: EVModel) => T): boolean {
  if (models.length <= 1) return false;
  const values = models.map(m => JSON.stringify(getValue(m)));
  return !values.every(v => v === values[0]);
}

/** Simulates CompareMatrix winning model detection */
function getWinningModelId(
  models: EVModel[],
  getValue: (m: EVModel) => number | boolean | null | undefined,
  optimal: 'higher' | 'lower' | 'boolean-true' | 'none'
): string | null {
  if (models.length <= 1 || optimal === 'none') return null;

  const valid = models
    .map(m => ({ id: m.id, val: getValue(m) }))
    .filter(e => e.val !== null && e.val !== undefined);

  if (valid.length <= 1) return null;

  if (optimal === 'higher') {
    const numVals = valid.map(e => Number(e.val));
    const max = Math.max(...numVals);
    const winners = valid.filter(e => Number(e.val) === max);
    return winners.length < valid.length ? winners[0].id : null;
  }

  if (optimal === 'lower') {
    const numVals = valid.map(e => Number(e.val));
    const min = Math.min(...numVals);
    const winners = valid.filter(e => Number(e.val) === min);
    return winners.length < valid.length ? winners[0].id : null;
  }

  if (optimal === 'boolean-true') {
    const winners = valid.filter(e => e.val === true);
    return (winners.length > 0 && winners.length < valid.length) ? winners[0].id : null;
  }

  return null;
}

/** Simulates URL search param parser for comparison IDs */
function parseUrlCompareIds(searchString: string, catalog: EVModel[], fallback = DEFAULT_COMPARE_IDS): string[] {
  try {
    const params = new URLSearchParams(searchString);
    const compareParam = params.get('compare');
    if (compareParam) {
      const ids = compareParam.split(',').map(s => s.trim()).filter(id => catalog.some(m => m.id === id));
      if (ids.length > 0) return ids.slice(0, MAX_COMPARE_LIMIT);
    }
  } catch {
    // fallback on malformed URI
  }
  return fallback;
}

/** Simulates URL search param serializer */
function serializeUrlParams(state: {
  selectedCompareIds: string[];
  selectedCategory: VehicleCategory;
  selectedRtoCode: string;
}): string {
  const params = new URLSearchParams();
  if (state.selectedCompareIds.length > 0) {
    params.set('compare', state.selectedCompareIds.join(','));
  }
  if (state.selectedCategory !== 'all') {
    params.set('category', state.selectedCategory);
  }
  if (state.selectedRtoCode !== 'TG-09') {
    params.set('rto', state.selectedRtoCode);
  }
  const str = params.toString();
  return str ? `?${str}` : '';
}

/** Simulates Vehicle Catalog Filter Engine */
interface FilterOptions {
  category?: VehicleCategory;
  priceRangeMax?: number;
  minRealRangeKm?: number;
  requireRemovableBattery?: boolean;
  requireFastCharging?: boolean;
  minBootSpaceLiters?: number;
  budgetUnder1L?: boolean;
  searchQuery?: string;
  sortBy?: string;
  rtoCode?: string;
}

function filterCatalog(models: EVModel[], options: FilterOptions = {}): EVModel[] {
  const {
    category = 'all',
    priceRangeMax = 1000000,
    minRealRangeKm = 0,
    requireRemovableBattery = false,
    requireFastCharging = false,
    minBootSpaceLiters = 0,
    budgetUnder1L = false,
    searchQuery = '',
    sortBy = 'recommended',
    rtoCode = 'TG-09'
  } = options;

  return models.filter(model => {
    if (model.isIceBenchmark) return false;

    // Category
    if (category !== 'all' && model.category !== category) return false;

    // Budget
    const onRoadEst = calculateTelanganaOnRoadPrice(model, rtoCode).totalTelanganaOnRoadPrice;
    if (budgetUnder1L && onRoadEst > 100000 && model.pricing.exShowroom > 100000) return false;
    if (model.pricing.exShowroom > priceRangeMax && onRoadEst > priceRangeMax) return false;

    // Real City Range
    if (minRealRangeKm > 0 && model.specs.realWorldCityRangeKm < minRealRangeKm) return false;

    // Removable Battery
    if (requireRemovableBattery && !model.specs.isRemovableBattery) return false;

    // Fast Charging
    if (requireFastCharging && !model.specs.fastChargingSupport) return false;

    // Boot Space
    if (minBootSpaceLiters > 0 && (model.specs.bootSpaceLiters || 0) < minBootSpaceLiters) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesName = model.name.toLowerCase().includes(q);
      const matchesBrand = model.brand.toLowerCase().includes(q);
      const matchesTagline = model.tagline.toLowerCase().includes(q);
      const matchesIdeal = model.idealFor.toLowerCase().includes(q);
      const matchesFeatures = model.features.some(f => f.toLowerCase().includes(q));
      const matchesPros = model.pros.some(p => p.toLowerCase().includes(q));
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
}

// -----------------------------------------------------------------------------
// Test Suites
// -----------------------------------------------------------------------------

describe('Challenger M2 Stress Suite 1: Comparison Tray Limits & FIFO Dropping Behavior', () => {
  const models = getEVModels().filter(m => !m.isIceBenchmark);
  const ids = models.map(m => m.id);

  it('handles empty tray (0 vehicles) and single vehicle additions (1 to 4)', () => {
    let tray: string[] = [];
    assert.equal(tray.length, 0);

    tray = simulateToggleCompare(tray, ids[0]);
    assert.deepEqual(tray, [ids[0]]);

    tray = simulateToggleCompare(tray, ids[1]);
    assert.deepEqual(tray, [ids[0], ids[1]]);

    tray = simulateToggleCompare(tray, ids[2]);
    assert.deepEqual(tray, [ids[0], ids[1], ids[2]]);

    tray = simulateToggleCompare(tray, ids[3]);
    assert.deepEqual(tray, [ids[0], ids[1], ids[2], ids[3]]);
    assert.equal(tray.length, 4);
  });

  it('strictly enforces max 4 limit with FIFO drop when adding 5th, 6th, and subsequent vehicles', () => {
    let tray: string[] = [ids[0], ids[1], ids[2], ids[3]]; // [Ather Rizta, 450X 3.7, 450X 2.9, Ola S1 Pro]

    // 5th addition drops ids[0]
    tray = simulateToggleCompare(tray, ids[4]);
    assert.deepEqual(tray, [ids[1], ids[2], ids[3], ids[4]]);
    assert.equal(tray.length, 4);

    // 6th addition drops ids[1]
    tray = simulateToggleCompare(tray, ids[5]);
    assert.deepEqual(tray, [ids[2], ids[3], ids[4], ids[5]]);
    assert.equal(tray.length, 4);

    // 7th addition drops ids[2]
    tray = simulateToggleCompare(tray, ids[6]);
    assert.deepEqual(tray, [ids[3], ids[4], ids[5], ids[6]]);
    assert.equal(tray.length, 4);
  });

  it('handles continuous FIFO queue streaming across all catalog EV models', () => {
    let tray: string[] = [];
    for (let i = 0; i < ids.length; i++) {
      tray = simulateToggleCompare(tray, ids[i]);
      assert.ok(tray.length <= 4, `Tray length must never exceed 4 at step ${i}`);
      assert.equal(tray[tray.length - 1], ids[i], `Last element must be newly added id ${ids[i]}`);
      if (i >= 3) {
        assert.equal(tray.length, 4, 'Once 4 items reached, length must stay at 4');
        assert.deepEqual(tray, [ids[i - 3], ids[i - 2], ids[i - 1], ids[i]]);
      }
    }
  });

  it('correctly removes an existing model on toggle without affecting remaining order', () => {
    let tray = [ids[0], ids[1], ids[2], ids[3]];
    
    // Remove middle element (ids[1])
    tray = simulateToggleCompare(tray, ids[1]);
    assert.deepEqual(tray, [ids[0], ids[2], ids[3]]);
    assert.equal(tray.length, 3);

    // Now add ids[4] -> should NOT drop ids[0] because length was 3
    tray = simulateToggleCompare(tray, ids[4]);
    assert.deepEqual(tray, [ids[0], ids[2], ids[3], ids[4]]);
    assert.equal(tray.length, 4);

    // Remove first element (ids[0])
    tray = simulateToggleCompare(tray, ids[0]);
    assert.deepEqual(tray, [ids[2], ids[3], ids[4]]);

    // Remove last element (ids[4])
    tray = simulateToggleCompare(tray, ids[4]);
    assert.deepEqual(tray, [ids[2], ids[3]]);
  });

  it('addToCompare idempotent behavior: does not duplicate existing model IDs', () => {
    let tray = [ids[0], ids[1]];
    tray = simulateAddToCompare(tray, ids[0]); // Add already existing id[0]
    assert.deepEqual(tray, [ids[0], ids[1]], 'Adding existing model must not duplicate or alter list');

    tray = simulateAddToCompare(tray, ids[2]);
    tray = simulateAddToCompare(tray, ids[3]);
    assert.deepEqual(tray, [ids[0], ids[1], ids[2], ids[3]]);

    // Add existing when at max capacity (4)
    tray = simulateAddToCompare(tray, ids[2]);
    assert.deepEqual(tray, [ids[0], ids[1], ids[2], ids[3]], 'Must not FIFO drop when adding already-present ID');

    // Add new 5th model via addToCompare
    tray = simulateAddToCompare(tray, ids[4]);
    assert.deepEqual(tray, [ids[1], ids[2], ids[3], ids[4]], 'Must FIFO drop oldest when adding new 5th ID');
  });

  it('stress test: 200 randomized toggle/add/remove operations maintain strict invariants', () => {
    let tray: string[] = [];
    const actions = ['toggle', 'add', 'remove'] as const;

    for (let step = 0; step < 200; step++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const randomId = ids[Math.floor(Math.random() * ids.length)];

      if (action === 'toggle') {
        tray = simulateToggleCompare(tray, randomId);
      } else if (action === 'add') {
        tray = simulateAddToCompare(tray, randomId);
      } else if (action === 'remove') {
        tray = simulateRemoveFromCompare(tray, randomId);
      }

      // Invariants
      assert.ok(tray.length >= 0 && tray.length <= 4, `Invariant violated: tray length ${tray.length}`);
      const uniqueCount = new Set(tray).size;
      assert.equal(uniqueCount, tray.length, 'Invariant violated: tray contains duplicate IDs');
      for (const id of tray) {
        assert.ok(ids.includes(id), `Invariant violated: unknown ID in tray: ${id}`);
      }
    }
  });
});

describe('Challenger M2 Stress Suite 2: Difference Highlighting & Best-in-Category Spec Logic', () => {
  const modelAtherRizta = getEVModelById('ather-rizta-z-37')!;
  const modelOlaS1Pro = getEVModelById('ola-s1-pro-gen2')!;
  const modelVida = getEVModelById('hero-vida-v1-pro')!;
  const modelUltraviolette = getEVModelById('ultraviolette-f77-mach2')!;

  it('diffing 2 identical vehicles yields exactly ZERO differences across all spec rows', () => {
    // Clone Ather Rizta into identical twin
    const twinModel: EVModel = JSON.parse(JSON.stringify(modelAtherRizta));
    const identicalPair = [modelAtherRizta, twinModel];

    assert.equal(isRowDifferent(identicalPair, m => m.pricing.exShowroom), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.topSpeedKmh), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.realWorldCityRangeKm), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.batteryCapacityKwh), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.batteryChemistry), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.isRemovableBattery), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.bootSpaceLiters), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.accel0To40Kmh), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.motorPeakPowerKw), false);
    assert.equal(isRowDifferent(identicalPair, m => m.specs.fastChargingSupport), false);
    assert.equal(isRowDifferent(identicalPair, m => m.warranty.batteryYears), false);

    // Winning model ID must be null for identical vehicles
    assert.equal(getWinningModelId(identicalPair, m => m.specs.topSpeedKmh, 'higher'), null);
    assert.equal(getWinningModelId(identicalPair, m => m.pricing.exShowroom, 'lower'), null);
    assert.equal(getWinningModelId(identicalPair, m => m.specs.isRemovableBattery, 'boolean-true'), null);
  });

  it('diffing 2 distinct vehicles (Ather Rizta Z vs Ola S1 Pro Gen 2) flags differences correctly', () => {
    const pair = [modelAtherRizta, modelOlaS1Pro];

    // Diffs flagged for differing specs
    assert.equal(isRowDifferent(pair, m => m.specs.topSpeedKmh), true, '80 km/h vs 120 km/h');
    assert.equal(isRowDifferent(pair, m => m.specs.realWorldCityRangeKm), true, '110 km vs 130 km');
    assert.equal(isRowDifferent(pair, m => m.specs.accel0To40Kmh), true, '4.7s vs 2.6s');
    assert.equal(isRowDifferent(pair, m => m.specs.motorPeakPowerKw), true, '4.3 kW vs 11.0 kW');
    assert.equal(isRowDifferent(pair, m => m.pricing.exShowroom), true, '₹1,44,999 vs ₹1,34,999');

    // Identical specs between the two must NOT be flagged as diffs
    assert.equal(isRowDifferent(pair, m => m.specs.bootSpaceLiters), false, 'Both have 34L boot');
    assert.equal(isRowDifferent(pair, m => m.specs.batteryChemistry), false, 'Both are NMC chemistry');
    assert.equal(isRowDifferent(pair, m => m.specs.isRemovableBattery), false, 'Both are fixed batteries');
    assert.equal(isRowDifferent(pair, m => m.specs.fastChargingSupport), false, 'Both support fast charging');

    // Winning models
    assert.equal(getWinningModelId(pair, m => m.specs.topSpeedKmh, 'higher'), 'ola-s1-pro-gen2');
    assert.equal(getWinningModelId(pair, m => m.specs.realWorldCityRangeKm, 'higher'), 'ola-s1-pro-gen2');
    assert.equal(getWinningModelId(pair, m => m.specs.accel0To40Kmh, 'lower'), 'ola-s1-pro-gen2');
    assert.equal(getWinningModelId(pair, m => m.pricing.exShowroom, 'lower'), 'ola-s1-pro-gen2');
  });

  it('diffing 4 diverse vehicles (Rizta, S1 Pro, Vida V1 Pro, Ultraviolette F77) across 15+ spec metrics', () => {
    const diverse4 = [modelAtherRizta, modelOlaS1Pro, modelVida, modelUltraviolette];

    // 1. Top Speed (Rizta: 80, Ola: 120, Vida: 80, F77: 155) -> F77 wins
    assert.equal(isRowDifferent(diverse4, m => m.specs.topSpeedKmh), true);
    assert.equal(getWinningModelId(diverse4, m => m.specs.topSpeedKmh, 'higher'), 'ultraviolette-f77-mach2');

    // 2. 0-40 Acceleration (Rizta: 4.7s, Ola: 2.6s, Vida: 3.2s, F77: 2.1s) -> F77 2.1s wins
    assert.equal(isRowDifferent(diverse4, m => m.specs.accel0To40Kmh), true);
    assert.equal(getWinningModelId(diverse4, m => m.specs.accel0To40Kmh, 'lower'), 'ultraviolette-f77-mach2');

    // 3. Battery Capacity (Rizta: 3.7, Ola: 4.0, Vida: 3.94, F77: 10.3) -> F77 wins
    assert.equal(isRowDifferent(diverse4, m => m.specs.batteryCapacityKwh), true);
    assert.equal(getWinningModelId(diverse4, m => m.specs.batteryCapacityKwh, 'higher'), 'ultraviolette-f77-mach2');

    // 4. Removable Battery (Vida is only one with true) -> Vida wins
    assert.equal(isRowDifferent(diverse4, m => m.specs.isRemovableBattery), true);
    assert.equal(getWinningModelId(diverse4, m => m.specs.isRemovableBattery, 'boolean-true'), 'hero-vida-v1-pro');

    // 5. Ex-Showroom Price (Lowest wins -> Vida ₹1,30,200 < Ola ₹1,34,999 < Rizta ₹1,44,999 < F77 ₹3,99,000)
    assert.equal(isRowDifferent(diverse4, m => m.pricing.exShowroom), true);
    assert.equal(getWinningModelId(diverse4, m => m.pricing.exShowroom, 'lower'), 'hero-vida-v1-pro');

    // 6. Kerb Weight (Lowest wins -> Vida 125kg vs Rizta 119kg vs Ola 116kg vs F77 207kg -> Ola 116kg wins)
    assert.equal(isRowDifferent(diverse4, m => m.specs.kerbWeightKg), true);
    assert.equal(getWinningModelId(diverse4, m => m.specs.kerbWeightKg, 'lower'), 'ola-s1-pro-gen2');

    // 7. Statutory ₹0 Road Tax for all 4 models -> NO diffs, NO winner
    assert.equal(isRowDifferent(diverse4, () => 0), false);
    assert.equal(getWinningModelId(diverse4, () => 0, 'higher'), null);
  });

  it('edge cases: handles 0 models and 1 model gracefully', () => {
    assert.equal(isRowDifferent([], m => m.pricing.exShowroom), false);
    assert.equal(isRowDifferent([modelAtherRizta], m => m.pricing.exShowroom), false);
    assert.equal(getWinningModelId([], m => m.pricing.exShowroom, 'lower'), null);
    assert.equal(getWinningModelId([modelAtherRizta], m => m.pricing.exShowroom, 'lower'), null);
    assert.equal(getWinningModelId([modelAtherRizta], m => m.specs.isRemovableBattery, 'boolean-true'), null);
  });
});

describe('Challenger M2 Stress Suite 3: URL Parameter Synchronization & Serialization', () => {
  const catalog = getEVModels().filter(m => !m.isIceBenchmark);

  it('parses valid comma-separated compare query parameters into model IDs', () => {
    const url = '?compare=ather-rizta-z-37,ola-s1-pro-gen2,tvs-iqube-s-34';
    const parsed = parseUrlCompareIds(url, catalog);
    assert.deepEqual(parsed, ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34']);
  });

  it('filters out non-existent/invalid IDs and keeps valid models only', () => {
    const url = '?compare=ather-rizta-z-37,non-existent-fake-id,ola-s1-pro-gen2,invalid_model_999';
    const parsed = parseUrlCompareIds(url, catalog);
    assert.deepEqual(parsed, ['ather-rizta-z-37', 'ola-s1-pro-gen2']);
  });

  it('truncates compare parameter to max 4 models if more than 4 valid IDs provided', () => {
    const url = '?compare=ather-rizta-z-37,ola-s1-pro-gen2,tvs-iqube-s-34,hero-vida-v1-pro,river-indie-40,revolt-rv400-32';
    const parsed = parseUrlCompareIds(url, catalog);
    assert.deepEqual(parsed, [
      'ather-rizta-z-37',
      'ola-s1-pro-gen2',
      'tvs-iqube-s-34',
      'hero-vida-v1-pro'
    ]);
    assert.equal(parsed.length, 4);
  });

  it('handles spaces and whitespace gracefully in comma-separated list', () => {
    const url = '?compare=  ather-rizta-z-37  ,   ola-s1-pro-gen2  ';
    const parsed = parseUrlCompareIds(url, catalog);
    assert.deepEqual(parsed, ['ather-rizta-z-37', 'ola-s1-pro-gen2']);
  });

  it('falls back to default compare IDs on empty, missing, or malformed compare params', () => {
    assert.deepEqual(parseUrlCompareIds('', catalog), DEFAULT_COMPARE_IDS);
    assert.deepEqual(parseUrlCompareIds('?', catalog), DEFAULT_COMPARE_IDS);
    assert.deepEqual(parseUrlCompareIds('?compare=', catalog), DEFAULT_COMPARE_IDS);
    assert.deepEqual(parseUrlCompareIds('?compare=,,,', catalog), DEFAULT_COMPARE_IDS);
    assert.deepEqual(parseUrlCompareIds('?other=value', catalog), DEFAULT_COMPARE_IDS);
    assert.deepEqual(parseUrlCompareIds('?compare=invalid1,invalid2', catalog), DEFAULT_COMPARE_IDS);
  });

  it('serializes state accurately and performs round-trip serialization/deserialization', () => {
    // 1. Standard multi-param state
    const state1 = {
      selectedCompareIds: ['ather-rizta-z-37', 'ola-s1-pro-gen2'],
      selectedCategory: 'scooter' as VehicleCategory,
      selectedRtoCode: 'TG-02'
    };
    const serialized1 = serializeUrlParams(state1);
    assert.ok(serialized1.includes('compare=ather-rizta-z-37%2Cola-s1-pro-gen2') || serialized1.includes('compare=ather-rizta-z-37,ola-s1-pro-gen2'));
    assert.ok(serialized1.includes('category=scooter'));
    assert.ok(serialized1.includes('rto=TG-02'));

    // Roundtrip verification of compare IDs
    const parsed1 = parseUrlCompareIds(serialized1, catalog);
    assert.deepEqual(parsed1, state1.selectedCompareIds);

    // 2. Default state serialization removes unnecessary params
    const defaultState = {
      selectedCompareIds: [],
      selectedCategory: 'all' as VehicleCategory,
      selectedRtoCode: 'TG-09'
    };
    const serializedDefault = serializeUrlParams(defaultState);
    assert.equal(serializedDefault, '');
  });
});

describe('Challenger M2 Stress Suite 4: Filtering Permutations & Stress Combinations', () => {
  const models = getEVModels();

  it('verifies category tab separation: scooters + motorcycles == all EVs', () => {
    const all = filterCatalog(models, { category: 'all' });
    const scooters = filterCatalog(models, { category: 'scooter' });
    const motorcycles = filterCatalog(models, { category: 'motorcycle' });

    assert.equal(all.length, models.length);
    assert.ok(scooters.length >= 17, `Expected >= 17 scooters, got ${scooters.length}`);
    assert.ok(motorcycles.length >= 18, `Expected >= 18 motorcycles, got ${motorcycles.length}`);
    assert.equal(scooters.length + motorcycles.length, all.length);

    // Verify all scooters have category === 'scooter' and never ICE benchmark
    for (const s of scooters) {
      assert.equal(s.category, 'scooter');
      assert.ok(!s.isIceBenchmark);
    }

    // Verify all motorcycles have category === 'motorcycle' and never ICE benchmark
    for (const m of motorcycles) {
      assert.equal(m.category, 'motorcycle');
      assert.ok(!m.isIceBenchmark);
    }
  });

  it('exhaustive search query testing across brands, models, and features', () => {
    // Brand search (Ather matches Ather models + Ather Grid compatible models)
    const atherResults = filterCatalog(models, { searchQuery: 'Ather' });
    assert.ok(atherResults.length >= 3, 'At least 3 Ather models');
    const atherOwn = atherResults.filter(m => m.brand === 'Ather Energy');
    assert.ok(atherOwn.length >= 2, 'Ather Energy OEM models exist');

    const olaResults = filterCatalog(models, { searchQuery: 'Ola' });
    assert.ok(olaResults.length >= 3, 'Ola models exist');

    const tvsResults = filterCatalog(models, { searchQuery: 'TVS' });
    assert.ok(tvsResults.length >= 2, 'TVS models exist');

    const revoltResults = filterCatalog(models, { searchQuery: 'Revolt' });
    assert.ok(revoltResults.length >= 1, 'Revolt models exist');

    const ultraResults = filterCatalog(models, { searchQuery: 'Ultraviolette' });
    assert.ok(ultraResults.length >= 1, 'Ultraviolette models exist');

    // Case-insensitivity & whitespace trimming
    const untrimmed = filterCatalog(models, { searchQuery: '  rIvEr  ' });
    assert.equal(untrimmed.length, 1);
    assert.equal(untrimmed[0].id, 'river-indie-40');

    // Non-existent search returns 0
    const emptyResults = filterCatalog(models, { searchQuery: 'SuperElectric9999XYZ' });
    assert.equal(emptyResults.length, 0);
  });

  it('tests budget slider thresholds (₹1.0L, ₹1.5L, ₹2.0L, ₹4.5L)', () => {
    const under150k = filterCatalog(models, { priceRangeMax: 150000 });
    assert.ok(under150k.length >= 8, 'At least 8 models priced under ₹1.50 Lakh');
    for (const m of under150k) {
      const onRoad = calculateTelanganaOnRoadPrice(m, 'TG-09').totalTelanganaOnRoadPrice;
      assert.ok(
        m.pricing.exShowroom <= 150000 || onRoad <= 150000,
        `${m.name} exceeds ₹1.5L max budget`
      );
    }

    const under100k = filterCatalog(models, { priceRangeMax: 100000 });
    assert.ok(under100k.length >= 1, 'Entry level models under ₹1.00 Lakh exist');
  });

  it('tests 4 quick filter toggles singularly and in combination', () => {
    // 1. Removable Battery
    const removable = filterCatalog(models, { requireRemovableBattery: true });
    assert.ok(removable.length >= 2, 'Removable battery models exist');
    for (const m of removable) {
      assert.equal(m.specs.isRemovableBattery, true);
    }

    // 2. Fast Charging Support
    const fastCharging = filterCatalog(models, { requireFastCharging: true });
    assert.ok(fastCharging.length >= 10, 'Many models support fast charging');
    for (const m of fastCharging) {
      assert.equal(m.specs.fastChargingSupport, true);
    }

    // 3. Boot Space > 30L
    const largeBoot = filterCatalog(models, { minBootSpaceLiters: 30 });
    assert.ok(largeBoot.length >= 5, 'Rizta, S1 Pro, S1 Air, S1 X+, River Indie have >= 30L');
    for (const m of largeBoot) {
      assert.ok((m.specs.bootSpaceLiters || 0) >= 30);
    }

    // 4. Budget < ₹1 Lakh
    const budgetUnder1L = filterCatalog(models, { budgetUnder1L: true });
    assert.ok(budgetUnder1L.length >= 1);
    for (const m of budgetUnder1L) {
      const onRoad = calculateTelanganaOnRoadPrice(m, 'TG-09').totalTelanganaOnRoadPrice;
      assert.ok(m.pricing.exShowroom <= 100000 || onRoad <= 100000);
    }

    // Combination: Removable Battery + Motorcycle -> Revolt models
    const removableMoto = filterCatalog(models, { category: 'motorcycle', requireRemovableBattery: true });
    assert.ok(removableMoto.length >= 1);
    assert.ok(removableMoto.some(m => m.id.startsWith('revolt')));

    // Combination: Motorcycle + Boot > 30L -> 0 models (motorcycles have 0L boot space)
    const motoBigBoot = filterCatalog(models, { category: 'motorcycle', minBootSpaceLiters: 30 });
    assert.equal(motoBigBoot.length, 0, 'Zero-state valid when criteria are mutually exclusive');
  });

  it('stress-tests all 2^4 = 16 quick filter permutations across categories and budget limits (240 runs)', () => {
    const categories: VehicleCategory[] = ['all', 'scooter', 'motorcycle'];
    const budgets = [100000, 150000, 200000, 300000, 450000];

    for (const category of categories) {
      for (const priceRangeMax of budgets) {
        for (let mask = 0; mask < 16; mask++) {
          const requireRemovableBattery = Boolean(mask & 1);
          const requireFastCharging = Boolean(mask & 2);
          const minBootSpaceLiters = (mask & 4) ? 30 : 0;
          const budgetUnder1L = Boolean(mask & 8);

          const results = filterCatalog(models, {
            category,
            priceRangeMax,
            requireRemovableBattery,
            requireFastCharging,
            minBootSpaceLiters,
            budgetUnder1L
          });

          // Verify every result satisfies all active constraints
          for (const m of results) {
            assert.ok(!m.isIceBenchmark, 'ICE benchmark must never be in EV catalog');
            if (category !== 'all') assert.equal(m.category, category);
            if (requireRemovableBattery) assert.equal(m.specs.isRemovableBattery, true);
            if (requireFastCharging) assert.equal(m.specs.fastChargingSupport, true);
            if (minBootSpaceLiters > 0) assert.ok((m.specs.bootSpaceLiters || 0) >= minBootSpaceLiters);
            if (budgetUnder1L) {
              const onRoad = calculateTelanganaOnRoadPrice(m, 'TG-09').totalTelanganaOnRoadPrice;
              assert.ok(m.pricing.exShowroom <= 100000 || onRoad <= 100000);
            }
          }
        }
      }
    }
  });

  it('verifies sorting orders: priceAsc, priceDesc, rangeDesc, speedDesc, ratingDesc, recommended', () => {
    // 1. priceAsc
    const priceAsc = filterCatalog(models, { sortBy: 'priceAsc' });
    for (let i = 0; i < priceAsc.length - 1; i++) {
      assert.ok(priceAsc[i].pricing.exShowroom <= priceAsc[i + 1].pricing.exShowroom, 'priceAsc must be non-decreasing');
    }

    // 2. priceDesc
    const priceDesc = filterCatalog(models, { sortBy: 'priceDesc' });
    for (let i = 0; i < priceDesc.length - 1; i++) {
      assert.ok(priceDesc[i].pricing.exShowroom >= priceDesc[i + 1].pricing.exShowroom, 'priceDesc must be non-increasing');
    }

    // 3. rangeDesc
    const rangeDesc = filterCatalog(models, { sortBy: 'rangeDesc' });
    for (let i = 0; i < rangeDesc.length - 1; i++) {
      assert.ok(rangeDesc[i].specs.realWorldCityRangeKm >= rangeDesc[i + 1].specs.realWorldCityRangeKm, 'rangeDesc must be non-increasing');
    }

    // 4. speedDesc
    const speedDesc = filterCatalog(models, { sortBy: 'speedDesc' });
    for (let i = 0; i < speedDesc.length - 1; i++) {
      assert.ok(speedDesc[i].specs.topSpeedKmh >= speedDesc[i + 1].specs.topSpeedKmh, 'speedDesc must be non-increasing');
    }

    // 5. ratingDesc
    const ratingDesc = filterCatalog(models, { sortBy: 'ratingDesc' });
    for (let i = 0; i < ratingDesc.length - 1; i++) {
      assert.ok(ratingDesc[i].rating >= ratingDesc[i + 1].rating, 'ratingDesc must be non-increasing');
    }

    // 6. recommended (rating * reviewCount)
    const recommended = filterCatalog(models, { sortBy: 'recommended' });
    for (let i = 0; i < recommended.length - 1; i++) {
      const scoreCurrent = recommended[i].rating * recommended[i].reviewCount;
      const scoreNext = recommended[i + 1].rating * recommended[i + 1].reviewCount;
      assert.ok(scoreCurrent >= scoreNext, 'recommended score must be non-increasing');
    }
  });
});
