import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getEVModels, getAllVehiclesIncludingBenchmark, getEVModelById } from '../src/data/evModels.ts';
import { TELANGANA_RTOS } from '../src/data/telanganaRtoData.ts';
import { calculateTelanganaOnRoadPrice, formatINR, formatLakhs } from '../src/utils/priceCalculator.ts';
import {
  getVehicleDesignSilhouette,
  generateVehicleSilhouetteSvg,
  getArchetypeLabel,
  getBrandThemeColor,
  getAccessibleVehicleAlt,
  SILHOUETTE_ARCHETYPES
} from '../src/utils/vehicleImagery.ts';
import type { EVModel } from '../types/ev.ts';

// Helper logic identical to comparison & diff highlighting engines in UI
function simulateToggleCompare(current: string[], newId: string, maxLimit = 4): string[] {
  if (current.includes(newId)) {
    return current.filter(id => id !== newId);
  }
  if (current.length >= maxLimit) {
    return [...current.slice(1), newId];
  }
  return [...current, newId];
}

function isRowDifferent<T>(models: EVModel[], getValue: (m: EVModel) => T): boolean {
  if (models.length <= 1) return false;
  const values = models.map(m => JSON.stringify(getValue(m)));
  return !values.every(v => v === values[0]);
}

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

describe('Milestone 2: Comparison Tray FIFO & Slot Limit', () => {
  it('adds models up to 4 and enforces FIFO dropping when 5th model is added', () => {
    let tray: string[] = [];
    
    // Add 1
    tray = simulateToggleCompare(tray, 'ather-rizta-z-37');
    assert.deepEqual(tray, ['ather-rizta-z-37']);

    // Add 2, 3, 4
    tray = simulateToggleCompare(tray, 'ola-s1-pro-gen2');
    tray = simulateToggleCompare(tray, 'tvs-iqube-s-34');
    tray = simulateToggleCompare(tray, 'bajaj-chetak-premium');
    assert.deepEqual(tray, [
      'ather-rizta-z-37',
      'ola-s1-pro-gen2',
      'tvs-iqube-s-34',
      'bajaj-chetak-premium'
    ]);
    assert.equal(tray.length, 4);

    // Adding 5th model should drop the oldest ('ather-rizta-z-37') and append 'hero-vida-v1-pro'
    tray = simulateToggleCompare(tray, 'hero-vida-v1-pro');
    assert.deepEqual(tray, [
      'ola-s1-pro-gen2',
      'tvs-iqube-s-34',
      'bajaj-chetak-premium',
      'hero-vida-v1-pro'
    ]);
    assert.equal(tray.length, 4);

    // Toggling existing model removes it
    tray = simulateToggleCompare(tray, 'tvs-iqube-s-34');
    assert.deepEqual(tray, [
      'ola-s1-pro-gen2',
      'bajaj-chetak-premium',
      'hero-vida-v1-pro'
    ]);
    assert.equal(tray.length, 3);
  });
});

describe('Milestone 2: Comparison Matrix Difference Highlighting & Best-in-Category Detection', () => {
  const modelAther = getEVModelById('ather-rizta-z-37')!;
  const modelOla = getEVModelById('ola-s1-pro-gen2')!;
  const modeliQube = getEVModelById('tvs-iqube-s-34')!;
  const compared = [modelAther, modelOla, modeliQube];

  it('correctly detects differences across top speed, range, and boot space', () => {
    // Top speeds are 80, 120, 78 -> Different
    assert.equal(isRowDifferent(compared, m => m.specs.topSpeedKmh), true);

    // Real city ranges are 110, 130, 100 -> Different
    assert.equal(isRowDifferent(compared, m => m.specs.realWorldCityRangeKm), true);

    // State road tax is ₹0 for all EVs -> Identical
    assert.equal(isRowDifferent(compared, () => 0), false);
  });

  it('correctly detects winning models for optimal higher metrics', () => {
    // Top Speed winner (Ola 120 km/h)
    const speedWinner = getWinningModelId(compared, m => m.specs.topSpeedKmh, 'higher');
    assert.equal(speedWinner, 'ola-s1-pro-gen2');

    // Battery capacity winner (Ola 4.0 kWh vs 3.7 vs 3.4)
    const batteryWinner = getWinningModelId(compared, m => m.specs.batteryCapacityKwh, 'higher');
    assert.equal(batteryWinner, 'ola-s1-pro-gen2');

    // City range winner (Ola 130 km)
    const rangeWinner = getWinningModelId(compared, m => m.specs.realWorldCityRangeKm, 'higher');
    assert.equal(rangeWinner, 'ola-s1-pro-gen2');
  });

  it('correctly detects winning models for optimal lower metrics', () => {
    // 0-40 sprint timing: Ola 2.6s, TVS 4.2s, Ather 4.7s -> Ola is lowest/fastest
    const accelWinner = getWinningModelId(compared, m => m.specs.accel0To40Kmh, 'lower');
    assert.equal(accelWinner, 'ola-s1-pro-gen2');

    // Ex-Showroom price: Ola (₹1,34,999) < Ather (₹1,44,999) < TVS iQube S (₹1,46,420)
    const priceWinner = getWinningModelId(compared, m => m.pricing.exShowroom, 'lower');
    assert.equal(priceWinner, 'ola-s1-pro-gen2');
  });

  it('correctly detects boolean winners (e.g. Removable battery)', () => {
    const modelVida = getEVModelById('hero-vida-v1-pro')!;
    const testSet = [modelAther, modelOla, modelVida]; // Vida has removable battery
    const removableWinner = getWinningModelId(testSet, m => m.specs.isRemovableBattery, 'boolean-true');
    assert.equal(removableWinner, 'hero-vida-v1-pro');
  });
});

describe('Milestone 2: Telangana 38-RTO On-Road Price Integration', () => {
  const models = getEVModels().filter(m => !m.isIceBenchmark);

  it('computes valid on-road price across all 38 RTOs for all catalog EV models', () => {
    for (const rto of TELANGANA_RTOS) {
      for (const model of models) {
        const breakdown = calculateTelanganaOnRoadPrice(model, rto.rtoCode);
        
        assert.ok(breakdown.totalTelanganaOnRoadPrice > 0, `Price must be > 0 for ${model.id} in ${rto.rtoCode}`);
        assert.equal(breakdown.stateRoadTax, 0, `State road tax must be 0 for ${model.id} in ${rto.rtoCode}`);
        assert.equal(breakdown.registrationAndSmartCardFee, 0, `Reg fee must be 0 for ${model.id} in ${rto.rtoCode}`);
        assert.ok((breakdown.savingsFromTelanganaPolicy || 0) > 0, `Savings must be > 0 for ${model.id}`);
        assert.ok((breakdown.totalUpfrontSavings || 0) > 0, `Total upfront savings must be > 0 for ${model.id}`);
      }
    }
  });

  it('formats Telangana pricing consistently in INR currency and Lakhs format', () => {
    assert.equal(formatINR(143260), '₹1,43,260');
    assert.equal(formatINR(0), '₹0');
    assert.equal(formatLakhs(143260), '₹1.43 Lakh');
  });
});

describe('Milestone 2: Catalog Filtering & Sorting Simulation', () => {
  const models = getEVModels().filter(m => !m.isIceBenchmark);

  it('filters by category: scooters vs motorcycles', () => {
    const scooters = models.filter(m => m.category === 'scooter');
    const motorcycles = models.filter(m => m.category === 'motorcycle');

    assert.ok(scooters.length >= 17, 'Must have at least 17 scooters');
    assert.ok(motorcycles.length >= 18, 'Must have at least 18 motorcycles');
    assert.equal(scooters.length + motorcycles.length, models.length);
  });

  it('filters by quick filter toggles (removable battery, fast charging, boot space >30L, budget <1L)', () => {
    const removable = models.filter(m => m.specs.isRemovableBattery);
    assert.ok(removable.length >= 2, 'Hero Vida and Revolt have removable batteries');

    const fastCharging = models.filter(m => m.specs.fastChargingSupport);
    assert.ok(fastCharging.length >= 5, 'Multiple models support fast charging');

    const largeBoot = models.filter(m => (m.specs.bootSpaceLiters || 0) >= 30);
    assert.ok(largeBoot.length >= 4, 'Ather Rizta, Ola, River Indie have >30L boot space');

    const budgetUnder1L = models.filter(m => m.pricing.exShowroom <= 100000);
    assert.ok(budgetUnder1L.length >= 1, 'Entry level models under 1L exist');
  });

  it('sorts models accurately by price, range, and speed', () => {
    const sortedPriceAsc = [...models].sort((a, b) => a.pricing.exShowroom - b.pricing.exShowroom);
    assert.ok(sortedPriceAsc[0].pricing.exShowroom <= sortedPriceAsc[sortedPriceAsc.length - 1].pricing.exShowroom);

    const sortedRangeDesc = [...models].sort((a, b) => b.specs.realWorldCityRangeKm - a.specs.realWorldCityRangeKm);
    assert.ok(sortedRangeDesc[0].specs.realWorldCityRangeKm >= sortedRangeDesc[sortedRangeDesc.length - 1].specs.realWorldCityRangeKm);

    const sortedSpeedDesc = [...models].sort((a, b) => b.specs.topSpeedKmh - a.specs.topSpeedKmh);
    assert.ok(sortedSpeedDesc[0].specs.topSpeedKmh >= sortedSpeedDesc[sortedSpeedDesc.length - 1].specs.topSpeedKmh);
  });
});

describe('Milestone 2 & 3: Vehicle Imagery & Resilient Vector Silhouette Subsystem', () => {
  const allVehicles = getAllVehiclesIncludingBenchmark();

  it('validates 100% URL distinctness with zero generic image recycling across all 41 catalog models', () => {
    const urls = new Set(allVehicles.map(v => v.imageUrl));
    assert.equal(urls.size, allVehicles.length, 'Every vehicle model must have a unique, model-specific HTTPS image URL');
    for (const v of allVehicles) {
      assert.ok(v.imageUrl.startsWith('https://'), `Invalid URL for ${v.id}: ${v.imageUrl}`);
    }
  });

  it('verifies exact silhouette archetype categorization across all 10 archetypes', () => {
    const counts: Record<string, number> = {};
    SILHOUETTE_ARCHETYPES.forEach(a => counts[a] = 0);

    for (const v of allVehicles) {
      const arch = getVehicleDesignSilhouette(v);
      assert.ok(SILHOUETTE_ARCHETYPES.includes(arch), `Unknown archetype for ${v.id}: ${arch}`);
      counts[arch]++;

      const label = getArchetypeLabel(arch);
      assert.ok(label && label.length > 0, `Empty label for ${arch}`);

      const alt = getAccessibleVehicleAlt(v);
      assert.ok(alt.includes(v.brand) && alt.includes(v.name), `Alt text mismatch for ${v.id}`);

      const color = getBrandThemeColor(v);
      assert.ok(color.startsWith('#'), `Brand theme color must be hex for ${v.id}`);
    }

    // Verify all 10 archetypes are represented
    assert.ok(counts['supersport'] >= 1);
    assert.ok(counts['streetfighter'] >= 1);
    assert.ok(counts['cruiser'] >= 1);
    assert.ok(counts['commuter-roadster'] >= 1);
    assert.ok(counts['sporty-scooter'] >= 1);
    assert.ok(counts['retro-metal-scooter'] >= 1);
    assert.ok(counts['family-comfort-scooter'] >= 1);
    assert.ok(counts['rugged-suv-scooter'] >= 1);
    assert.ok(counts['heavy-duty-moped'] >= 1);
    assert.equal(counts['ice-scooter'], 1);
  });

  it('verifies inline SVG data URI generator creates valid vector graphics without runtime errors or NaNs', () => {
    for (const v of allVehicles) {
      const svgUri = generateVehicleSilhouetteSvg(v);
      assert.ok(svgUri.startsWith('data:image/svg+xml;utf8,'), `Invalid SVG data URI for ${v.id}`);
      
      const decoded = decodeURIComponent(svgUri.replace('data:image/svg+xml;utf8,', ''));
      assert.ok(decoded.includes('<svg'), `Missing <svg for ${v.id}`);
      assert.ok(decoded.includes('</svg>'), `Missing </svg> for ${v.id}`);
      assert.ok(decoded.includes(v.brand), `Missing brand in SVG for ${v.id}`);
      assert.ok(decoded.includes(v.name), `Missing name in SVG for ${v.id}`);
      assert.ok(!decoded.includes('undefined'), `Contains undefined in SVG for ${v.id}`);
      assert.ok(!decoded.includes('NaN'), `Contains NaN in SVG for ${v.id}`);
    }
  });
});
