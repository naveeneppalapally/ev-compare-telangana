export interface OwnerReport {
  id: string;
  modelId: string;
  rangeKm: number;
  conditions: string;
  tempC: number;
  city: string;
  timestamp: string;
}

export const OWNER_REPORTS_KEY = 'ev_tg_owner_reports';

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    // ignore
  }
  try {
    const g = globalThis as unknown as { localStorage?: Storage; window?: { localStorage?: Storage } };
    if (g.localStorage) return g.localStorage;
    if (g.window?.localStorage) return g.window.localStorage;
  } catch {
    // ignore
  }
  return null;
}

function loadAllReports(): OwnerReport[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(OWNER_REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r): r is OwnerReport => {
      if (!r || typeof r !== 'object') return false;
      const o = r as Record<string, unknown>;
      return (
        typeof o.id === 'string' &&
        typeof o.modelId === 'string' &&
        typeof o.rangeKm === 'number' &&
        typeof o.conditions === 'string' &&
        typeof o.tempC === 'number' &&
        typeof o.city === 'string' &&
        typeof o.timestamp === 'string'
      );
    });
  } catch {
    return [];
  }
}

export function loadReports(modelId: string): OwnerReport[] {
  return loadAllReports().filter((r) => r.modelId === modelId);
}

export function saveReport(report: OwnerReport): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    const all = loadAllReports();
    all.push(report);
    storage.setItem(OWNER_REPORTS_KEY, JSON.stringify(all));
  } catch {
    // ignore quota / JSON errors
  }
}

export function getAverageRange(modelId: string): number | null {
  const reports = loadReports(modelId);
  if (reports.length === 0) return null;
  const sum = reports.reduce((acc, r) => acc + r.rangeKm, 0);
  const avg = sum / reports.length;
  return Math.round(avg * 10) / 10;
}
