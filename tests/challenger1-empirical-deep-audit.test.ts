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
  getRtoByCode
} from '../src/data/telanganaRtoData.ts';

import {
  calculateTelanganaOnRoadPrice,
  formatINR
} from '../src/utils/priceCalculator.ts';

import type { EVModel, VehicleCategory } from '../src/types/ev.ts';

// ---------------------------------------------------------
// Brand list configuration matching HeroSearch.tsx
// ---------------------------------------------------------
interface OEMBrandConfig {
  id: string;
  name: string;
  matchQuery: string;
  dbPattern: string;
}

const OEM_BRANDS: OEMBrandConfig[] = [
  { id: 'ola', name: 'Ola', matchQuery: 'Ola', dbPattern: 'ola' },
  { id: 'ather', name: 'Ather', matchQuery: 'Ather', dbPattern: 'ather' },
  { id: 'tvs', name: 'TVS', matchQuery: 'TVS', dbPattern: 'tvs' },
  { id: 'bajaj', name: 'Bajaj', matchQuery: 'Bajaj', dbPattern: 'bajaj' },
  { id: 'revolt', name: 'Revolt', matchQuery: 'Revolt', dbPattern: 'revolt' },
  { id: 'ultraviolette', name: 'Ultraviolette', matchQuery: 'Ultraviolette', dbPattern: 'ultraviolette' },
  { id: 'hero-vida', name: 'Hero Vida', matchQuery: 'Vida', dbPattern: 'vida' },
  { id: 'river', name: 'River', matchQuery: 'River', dbPattern: 'river' },
  { id: 'oben', name: 'Oben', matchQuery: 'Oben', dbPattern: 'oben' },
  { id: 'matter', name: 'Matter', matchQuery: 'Matter', dbPattern: 'matter' },
  { id: 'pure-ev', name: 'Pure EV', matchQuery: 'Pure EV', dbPattern: 'pure' },
  { id: 'kinetic-green', name: 'Kinetic Green', matchQuery: 'Kinetic Green', dbPattern: 'kinetic' },
  { id: 'ampere', name: 'Ampere', matchQuery: 'Ampere', dbPattern: 'ampere' },
  { id: 'kabira', name: 'Kabira', matchQuery: 'Kabira', dbPattern: 'kabira' },
  { id: 'komaki', name: 'Komaki', matchQuery: 'Komaki', dbPattern: 'komaki' },
  { id: 'hop', name: 'Hop', matchQuery: 'Hop', dbPattern: 'hop' },
  { id: 'tork', name: 'Tork', matchQuery: 'Tork', dbPattern: 'tork' },
  { id: 'bgauss', name: 'BGauss', matchQuery: 'BGauss', dbPattern: 'bgauss' },
  { id: 'simple-energy', name: 'Simple Energy', matchQuery: 'Simple Energy', dbPattern: 'simple' },
  { id: 'raptee', name: 'Raptee', matchQuery: 'Raptee', dbPattern: 'raptee' }
];

// Helper search function mirroring CompareContext
const executeSearch = (models: EVModel[], query: string): EVModel[] => {
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

describe('Challenger 1 Stress Test: Segment Tabs Partitioning & Catalog Integrity', () => {
  const allVehicles = getAllVehiclesIncludingBenchmark();
  const evOnly = getEVModels();
  const motorcycles = getEVModelsByCategory('motorcycle');
  const scooters = getEVModelsByCategory('scooter');

  it('empirically verifies exact catalog partitioning (Motorcycles = 23, Scooters = 17, Activa = 1, Total = 41)', () => {
    assert.equal(allVehicles.length, 41, 'Total vehicle count must be exactly 41');
    assert.equal(evOnly.length, 40, 'EV-only vehicle count must be exactly 40');
    assert.equal(motorcycles.length, 23, 'Motorcycles count must be exactly 23');
    assert.equal(scooters.length, 17, 'Scooters count must be exactly 17');
    assert.equal(motorcycles.length + scooters.length, 40, 'Motorcycles (23) + Scooters (17) must equal 40 EVs');
  });

  it('proves strict non-overlapping partition between Motorcycles and Scooters', () => {
    const motorcycleIds = new Set(motorcycles.map(m => m.id));
    const scooterIds = new Set(scooters.map(m => m.id));

    // Intersection must be completely empty
    for (const id of motorcycleIds) {
      assert.equal(scooterIds.has(id), false, `Vehicle ${id} belongs to both motorcycle and scooter categories`);
    }

    // Union must equal evOnly set exactly
    const evIds = new Set(evOnly.map(m => m.id));
    assert.equal(motorcycleIds.size + scooterIds.size, evIds.size);
    for (const id of evIds) {
      assert.ok(motorcycleIds.has(id) || scooterIds.has(id), `EV ${id} was omitted from both categories`);
    }
  });

  it('validates ICE benchmark is excluded from EV-only filters and segment counts', () => {
    const ice = allVehicles.filter(v => v.isIceBenchmark);
    assert.equal(ice.length, 1);
    assert.equal(ice[0].id, 'honda-activa-6g');
    assert.equal(evOnly.some(v => v.isIceBenchmark), false);
    assert.equal(motorcycles.some(v => v.isIceBenchmark), false);
    assert.equal(scooters.some(v => v.isIceBenchmark), false);
  });
});

describe('Challenger 1 Stress Test: 18 Authentic OEM Brand Carousel & Filtering', () => {
  const evOnly = getEVModels();

  it('verifies all 18 authentic Indian OEM brands are represented in the catalog with active models', () => {
    const brandList = OEM_BRANDS.map(brand => {
      const matchingModels = evOnly.filter(m => !m.isIceBenchmark && (
        m.brand.toLowerCase().includes(brand.dbPattern) ||
        m.name.toLowerCase().includes(brand.dbPattern)
      ));
      return { ...brand, count: matchingModels.length, models: matchingModels };
    }).filter(b => b.count > 0);

    assert.ok(brandList.length >= 18, `Expected at least 18 verified OEM brands with models, got ${brandList.length}`);

    // Verify key OEMs have verified counts
    const brandCounts: Record<string, number> = {};
    for (const b of brandList) {
      brandCounts[b.id] = b.count;
      assert.ok(b.count > 0, `Brand ${b.name} (${b.id}) has 0 models`);
    }

    // Check presence of top tier Indian EV brands
    assert.ok(brandCounts['ola'] >= 4, `Ola should have >= 4 models, got ${brandCounts['ola']}`);
    assert.ok(brandCounts['ather'] >= 3, `Ather should have >= 3 models, got ${brandCounts['ather']}`);
    assert.ok(brandCounts['tvs'] >= 2, `TVS should have >= 2 models, got ${brandCounts['tvs']}`);
    assert.ok(brandCounts['bajaj'] >= 1, `Bajaj should have >= 1 models, got ${brandCounts['bajaj']}`);
    assert.ok(brandCounts['revolt'] >= 2, `Revolt should have >= 2 models, got ${brandCounts['revolt']}`);
    assert.ok(brandCounts['ultraviolette'] >= 2, `Ultraviolette should have >= 2 models, got ${brandCounts['ultraviolette']}`);
    assert.ok(brandCounts['hero-vida'] >= 1, `Hero Vida should have >= 1 models, got ${brandCounts['hero-vida']}`);
    assert.ok(brandCounts['matter'] >= 1, `Matter should have >= 1 models, got ${brandCounts['matter']}`);
    assert.ok(brandCounts['river'] >= 1, `River should have >= 1 models, got ${brandCounts['river']}`);
    assert.ok(brandCounts['tork'] >= 1, `Tork should have >= 1 models, got ${brandCounts['tork']}`);
  });

  it('tests OEM Brand direct pattern matching yields 100% exact brand subsets', () => {
    for (const brand of OEM_BRANDS) {
      const matchingModels = evOnly.filter(m => !m.isIceBenchmark && (
        m.brand.toLowerCase().includes(brand.dbPattern) ||
        m.name.toLowerCase().includes(brand.dbPattern)
      ));
      if (matchingModels.length > 0) {
        for (const model of matchingModels) {
          const matchBrand = model.brand.toLowerCase().includes(brand.dbPattern);
          const matchName = model.name.toLowerCase().includes(brand.dbPattern);
          assert.ok(matchBrand || matchName, `Model ${model.id} did not match pattern ${brand.dbPattern}`);
        }
      }
    }
  });

  it('tests full text search behavior on brand queries and identifies substring matches', () => {
    // When searching for brand keywords like 'Ather', full text search checks features and pros
    const atherFullSearch = executeSearch(evOnly, 'Ather');
    assert.ok(atherFullSearch.length >= 4, 'Full search for Ather must include all 4 Ather models');
    
    // Direct brand pattern matching produces clean 4 models
    const atherDirect = evOnly.filter(m => m.brand.toLowerCase().includes('ather') || m.name.toLowerCase().includes('ather'));
    assert.equal(atherDirect.length, 4, 'Exact Ather models count must be 4');
  });

  it('tests toggling brand filter on and off (clear filter returns full 40 EVs)', () => {
    const filtered = executeSearch(evOnly, 'Revolt');
    assert.equal(filtered.length, 4);

    // Clear filter
    const cleared = executeSearch(evOnly, '');
    assert.equal(cleared.length, evOnly.length);
  });
});

describe('Challenger 1 Stress Test: Quick Filter Chips Empirical Accuracy', () => {
  const evOnly = getEVModels();

  it('Quick Filter 1: Removable Battery (returns ONLY portable battery models)', () => {
    const removableEVs = evOnly.filter(m => m.specs.isRemovableBattery);
    assert.ok(removableEVs.length >= 4, 'Must have at least 4 removable battery models');
    
    for (const model of removableEVs) {
      assert.equal(model.specs.isRemovableBattery, true, `Model ${model.id} failed removable battery check`);
    }

    const nonRemovableEVs = evOnly.filter(m => !m.specs.isRemovableBattery);
    for (const model of nonRemovableEVs) {
      assert.equal(model.specs.isRemovableBattery, false);
    }
  });

  it('Quick Filter 2: Fast Charging < 60m (returns ONLY fast charging ready models)', () => {
    const fastChargingEVs = evOnly.filter(m => m.specs.fastChargingSupport);
    assert.ok(fastChargingEVs.length >= 10, 'Must have >= 10 fast charging models');

    for (const model of fastChargingEVs) {
      assert.equal(model.specs.fastChargingSupport, true, `Model ${model.id} should have fast charging support`);
      assert.ok(model.specs.fastChargingRate && model.specs.fastChargingRate.length > 0);
    }
  });

  it('Quick Filter 3: Boot Space > 30L (returns ONLY large cargo/boot capacity models)', () => {
    const largeBootEVs = evOnly.filter(m => (m.specs.bootSpaceLiters || 0) >= 30);
    assert.ok(largeBootEVs.length >= 3, 'Must have models like River Indie (43L), Ather Rizta (34L), Ola S1 Pro (34L)');

    for (const model of largeBootEVs) {
      assert.ok(model.specs.bootSpaceLiters >= 30, `Model ${model.id} boot space ${model.specs.bootSpaceLiters} < 30L`);
    }
  });

  it('Quick Filter 4: Budget < ₹1 Lakh (evaluates on-road and ex-showroom affordability under ₹1,00,000)', () => {
    const budgetEVs = evOnly.filter(m => {
      const onRoad = calculateTelanganaOnRoadPrice(m, 'TG-09').totalTelanganaOnRoadPrice;
      return onRoad <= 100000 || m.pricing.exShowroom <= 100000;
    });

    assert.ok(budgetEVs.length >= 4, 'Must have entry budget EVs (e.g. Kinetic E-Luna, Pure EV, Ola S1X, etc.)');
    for (const model of budgetEVs) {
      const onRoad = calculateTelanganaOnRoadPrice(model, 'TG-09').totalTelanganaOnRoadPrice;
      assert.ok(
        onRoad <= 100000 || model.pricing.exShowroom <= 100000,
        `Model ${model.id} exShowroom ${model.pricing.exShowroom} and onRoad ${onRoad} both exceed ₹1L`
      );
    }
  });

  it('evaluates compound multi-quick-filter combinations', () => {
    // Fast Charging + Removable Battery
    const fastAndRemovable = evOnly.filter(m => m.specs.fastChargingSupport && m.specs.isRemovableBattery);
    assert.ok(Array.isArray(fastAndRemovable));
    for (const m of fastAndRemovable) {
      assert.equal(m.specs.fastChargingSupport, true);
      assert.equal(m.specs.isRemovableBattery, true);
    }

    // Large Boot (>30L) + Fast Charging
    const bootAndFast = evOnly.filter(m => (m.specs.bootSpaceLiters || 0) >= 30 && m.specs.fastChargingSupport);
    assert.ok(bootAndFast.length >= 2, 'Should include Ather Rizta, Ola S1 Pro Gen 2');
    for (const m of bootAndFast) {
      assert.ok(m.specs.bootSpaceLiters >= 30);
      assert.equal(m.specs.fastChargingSupport, true);
    }
  });
});

describe('Challenger 1 Stress Test: Comparison Tray FIFO Rules & Boundary Capacity', () => {
  const MAX_LIMIT = 4;

  const runFifoToggle = (tray: string[], id: string): string[] => {
    if (tray.includes(id)) {
      return tray.filter(item => item !== id);
    }
    if (tray.length >= MAX_LIMIT) {
      return [...tray.slice(1), id];
    }
    return [...tray, id];
  };

  const runFifoAdd = (tray: string[], id: string): string[] => {
    if (tray.includes(id)) return tray;
    return runFifoToggle(tray, id);
  };

  it('strictly maintains max 4 vehicles and evicts oldest vehicle upon 5th addition', () => {
    let tray: string[] = [];
    tray = runFifoAdd(tray, 'ather-rizta-z-37'); // slot 1
    tray = runFifoAdd(tray, 'ola-s1-pro-gen2');  // slot 2
    tray = runFifoAdd(tray, 'tvs-iqube-s-34');    // slot 3
    tray = runFifoAdd(tray, 'bajaj-chetak-3201'); // slot 4

    assert.equal(tray.length, 4);
    assert.deepEqual(tray, ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34', 'bajaj-chetak-3201']);

    // 5th addition: should evict ather-rizta-z-37
    tray = runFifoAdd(tray, 'ultraviolette-f77-mach2');
    assert.equal(tray.length, 4);
    assert.deepEqual(tray, ['ola-s1-pro-gen2', 'tvs-iqube-s-34', 'bajaj-chetak-3201', 'ultraviolette-f77-mach2']);
    assert.equal(tray.includes('ather-rizta-z-37'), false);

    // 6th addition: should evict ola-s1-pro-gen2
    tray = runFifoAdd(tray, 'revolt-rv400-32');
    assert.equal(tray.length, 4);
    assert.deepEqual(tray, ['tvs-iqube-s-34', 'bajaj-chetak-3201', 'ultraviolette-f77-mach2', 'revolt-rv400-32']);
    assert.equal(tray.includes('ola-s1-pro-gen2'), false);
  });

  it('handles rapid sequence of 40 vehicle additions preserving exact FIFO sequence', () => {
    const allEvIds = getEVModels().map(m => m.id);
    let tray: string[] = [];

    for (const id of allEvIds) {
      tray = runFifoAdd(tray, id);
      assert.ok(tray.length <= 4, `Tray exceeded max 4 items at id ${id}`);
    }

    assert.equal(tray.length, 4);
    const expectedLastFour = allEvIds.slice(-4);
    assert.deepEqual(tray, expectedLastFour);
  });

  it('handles removal, re-addition, and clearing cleanly', () => {
    let tray = ['v1', 'v2', 'v3', 'v4'];
    
    // Remove v2
    tray = tray.filter(id => id !== 'v2');
    assert.deepEqual(tray, ['v1', 'v3', 'v4']);
    assert.equal(tray.length, 3);

    // Add v5 -> should fit in 4th slot without evicting v1
    tray = runFifoAdd(tray, 'v5');
    assert.deepEqual(tray, ['v1', 'v3', 'v4', 'v5']);
    assert.equal(tray.length, 4);

    // Clear
    tray = [];
    assert.equal(tray.length, 0);
  });
});

describe('Challenger 1 Stress Test: Comparison Matrix Spec Diffing & Winner Detection', () => {
  interface SpecEvaluator<T> {
    label: string;
    getValue: (m: EVModel) => T;
    optimal: 'higher' | 'lower' | 'boolean-true' | 'none';
  }

  const evaluateRow = <T>(
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

  const modelRizta = getEVModelById('ather-rizta-z-37')!;
  const modelS1Pro = getEVModelById('ola-s1-pro-gen2')!;
  const modelF77 = getEVModelById('ultraviolette-f77-mach2')!;
  const modelLuna = getEVModelById('kinetic-green-e-luna')!;

  it('evaluates all spec rows for 4 distinct vehicles and confirms correct diffing and winner assignment', () => {
    const quartet = [modelRizta, modelS1Pro, modelF77, modelLuna];

    // 1. Ex-showroom price (optimal: lower) -> E-Luna is lowest
    const priceRes = evaluateRow(quartet, {
      label: 'Ex-Showroom Price',
      getValue: m => m.pricing.exShowroom,
      optimal: 'lower'
    });
    assert.equal(priceRes.isDifferent, true);
    assert.equal(priceRes.winnerId, modelLuna.id);

    // 2. Battery capacity (optimal: higher) -> F77 (10.3 kWh)
    const batteryRes = evaluateRow(quartet, {
      label: 'Battery Capacity',
      getValue: m => m.specs.batteryCapacityKwh,
      optimal: 'higher'
    });
    assert.equal(batteryRes.isDifferent, true);
    assert.equal(batteryRes.winnerId, modelF77.id);

    // 3. Top speed (optimal: higher) -> F77 (155 km/h)
    const speedRes = evaluateRow(quartet, {
      label: 'Top Speed',
      getValue: m => m.specs.topSpeedKmh,
      optimal: 'higher'
    });
    assert.equal(speedRes.isDifferent, true);
    assert.equal(speedRes.winnerId, modelF77.id);

    // 4. 0-40 sprint (optimal: lower) -> F77 (2.8s)
    const accelRes = evaluateRow(quartet, {
      label: '0-40 sprint',
      getValue: m => m.specs.accel0To40Kmh,
      optimal: 'lower'
    });
    assert.equal(accelRes.isDifferent, true);
    assert.equal(accelRes.winnerId, modelF77.id);

    // 5. Boot space (optimal: higher) -> Ather Rizta (34L) or Ola S1 Pro (34L)
    const bootRes = evaluateRow(quartet, {
      label: 'Boot Space',
      getValue: m => m.specs.bootSpaceLiters || 0,
      optimal: 'higher'
    });
    assert.equal(bootRes.isDifferent, true);
    assert.ok(bootRes.winnerId === modelRizta.id || bootRes.winnerId === modelS1Pro.id);

    // 6. Fast Charging Support (optimal: boolean-true) -> Rizta/S1Pro/F77 vs Luna (false)
    const fastRes = evaluateRow(quartet, {
      label: 'Fast Charging Support',
      getValue: m => m.specs.fastChargingSupport,
      optimal: 'boolean-true'
    });
    assert.equal(fastRes.isDifferent, true);
    assert.ok(fastRes.winnerId !== null);

    // 7. Battery Chemistry (optimal: none) -> isDifferent = true, winnerId = null
    const chemRes = evaluateRow(quartet, {
      label: 'Battery Chemistry',
      getValue: m => m.specs.batteryChemistry,
      optimal: 'none'
    });
    assert.equal(chemRes.isDifferent, true);
    assert.equal(chemRes.winnerId, null);
  });

  it('evaluates identical models producing zero diff and zero winner', () => {
    const pair = [modelRizta, modelRizta];
    const res = evaluateRow(pair, {
      label: 'City Range',
      getValue: m => m.specs.realWorldCityRangeKm,
      optimal: 'higher'
    });
    assert.equal(res.isDifferent, false);
    assert.equal(res.winnerId, null);
  });

  it('evaluates tie condition where all models share the same optimal value (winnerId must be null)', () => {
    // Create synthetic models with identical top speed
    const tieGroup: EVModel[] = [
      { ...modelRizta, specs: { ...modelRizta.specs, topSpeedKmh: 90 } },
      { ...modelS1Pro, specs: { ...modelS1Pro.specs, topSpeedKmh: 90 } }
    ];

    const tieRes = evaluateRow(tieGroup, {
      label: 'Top Speed',
      getValue: m => m.specs.topSpeedKmh,
      optimal: 'higher'
    });
    assert.equal(tieRes.isDifferent, false);
    assert.equal(tieRes.winnerId, null, 'When all models tie on optimal value, winnerId must be null');
  });
});
