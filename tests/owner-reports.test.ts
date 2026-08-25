import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

function createMockStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    get length() { return Object.keys(store).length; },
    clear() { store = {}; },
    getItem(key: string) { return store[key] ?? null; },
    key(index: number) { return Object.keys(store)[index] ?? null; },
    removeItem(key: string) { delete store[key]; },
    setItem(key: string, value: string) { store[key] = String(value); },
  } as unknown as Storage;
}

describe('Owner Reports — localStorage save/load & average', () => {
  beforeEach(() => {
    const mock = createMockStorage();
    (globalThis as unknown as Record<string, unknown>).localStorage = mock;
    (globalThis as unknown as Record<string, unknown>).window = { localStorage: mock } as unknown as Window;
    mock.clear();
  });

  it('saves and loads reports filtered by modelId', async () => {
    const { saveReport, loadReports, OWNER_REPORTS_KEY } = await import('../src/utils/ownerReports.ts');

    const report1 = {
      id: 'r1',
      modelId: 'ather-rizta-z-37',
      rangeKm: 95,
      conditions: 'City traffic' as const,
      tempC: 34,
      city: 'Hyderabad',
      timestamp: new Date().toISOString(),
    };
    const report2 = {
      id: 'r2',
      modelId: 'ather-rizta-z-37',
      rangeKm: 105,
      conditions: 'Highway' as const,
      tempC: 38,
      city: 'Warangal',
      timestamp: new Date().toISOString(),
    };
    const otherModel = {
      id: 'r3',
      modelId: 'ola-s1-pro-gen2',
      rangeKm: 120,
      conditions: 'Mixed' as const,
      tempC: 32,
      city: 'Karimnagar',
      timestamp: new Date().toISOString(),
    };

    saveReport(report1 as any);
    saveReport(report2 as any);
    saveReport(otherModel as any);

    const athReports = loadReports('ather-rizta-z-37');
    assert.equal(athReports.length, 2);
    assert.ok(athReports.some((r) => r.id === 'r1' && r.rangeKm === 95));
    assert.ok(athReports.some((r) => r.id === 'r2' && r.city === 'Warangal'));

    const olaReports = loadReports('ola-s1-pro-gen2');
    assert.equal(olaReports.length, 1);
    assert.equal(olaReports[0].id, 'r3');

    const empty = loadReports('nonexistent-model');
    assert.equal(empty.length, 0);

    // verify raw localStorage JSON array
    const raw = (globalThis as any).localStorage.getItem(OWNER_REPORTS_KEY);
    assert.ok(raw, 'raw localStorage should exist');
    const parsed = JSON.parse(raw as string);
    assert.equal(parsed.length, 3);
  });

  it('calculates average range correctly and returns null when no reports', async () => {
    const { saveReport, getAverageRange, loadReports } = await import('../src/utils/ownerReports.ts');

    assert.equal(getAverageRange('new-model'), null);

    saveReport({
      id: 'a1',
      modelId: 'new-model',
      rangeKm: 90,
      conditions: 'Mixed',
      tempC: 30,
      city: 'Hyderabad',
      timestamp: new Date().toISOString(),
    } as any);
    assert.equal(getAverageRange('new-model'), 90);
    assert.equal(loadReports('new-model').length, 1);

    saveReport({
      id: 'a2',
      modelId: 'new-model',
      rangeKm: 110,
      conditions: 'Mixed',
      tempC: 31,
      city: 'Hyderabad',
      timestamp: new Date().toISOString(),
    } as any);
    // avg = (90+110)/2 = 100
    assert.equal(getAverageRange('new-model'), 100);

    saveReport({
      id: 'a3',
      modelId: 'new-model',
      rangeKm: 95,
      conditions: 'City traffic',
      tempC: 35,
      city: 'Secunderabad',
      timestamp: new Date().toISOString(),
    } as any);
    // avg = (90+110+95)/3 = 98.333 -> 98.3
    const avg = getAverageRange('new-model');
    assert.ok(avg !== null);
    assert.equal(avg, 98.3);
  });

  it('handles corrupted JSON gracefully', async () => {
    const { loadReports, getAverageRange, OWNER_REPORTS_KEY } = await import('../src/utils/ownerReports.ts');
    const storage = (globalThis as any).localStorage as Storage;
    storage.setItem(OWNER_REPORTS_KEY, 'not-json[[[');
    assert.deepEqual(loadReports('any'), []);
    assert.equal(getAverageRange('any'), null);
  });
});
