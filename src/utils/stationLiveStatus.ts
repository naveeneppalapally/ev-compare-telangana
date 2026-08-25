export type LiveStatus = 'working' | 'occupied' | 'broken';

export interface StationStatusEntry {
  status: LiveStatus;
  timestamp: string;
  count: number;
}

export type StationStatusMap = Record<string, StationStatusEntry>;

export const STATION_STATUS_KEY = 'ev_tg_station_status';

/**
 * Load status map from localStorage. Returns {} on missing/invalid data or SSR.
 */
export function loadStationStatusMap(): StationStatusMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STATION_STATUS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as StationStatusMap;
    }
    return {};
  } catch {
    return {};
  }
}

export function saveStationStatusMap(map: StationStatusMap): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATION_STATUS_KEY, JSON.stringify(map));
  } catch {
    // ignore quota / private mode errors
  }
}

/**
 * Format ISO timestamp to relative string like "just now", "5m ago", "2h ago", "3d ago".
 * Uses Date.now() diff.
 */
export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 'just now';
  const diff = now - t;
  if (diff < 0) return 'just now';
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

/**
 * Whether to show aggregate warning: station has >2 recent "broken" reports within 24h.
 * With single-entry-per-station storage, count tracks total check-ins for that station.
 * We treat count >2 + status broken + timestamp within 24h as the aggregate condition.
 */
export function isBrokenWarning(entry: StationStatusEntry | undefined): boolean {
  if (!entry) return false;
  if (entry.status !== 'broken') return false;
  if (entry.count <= 2) return false;
  const ts = new Date(entry.timestamp).getTime();
  if (Number.isNaN(ts)) return false;
  const age = Date.now() - ts;
  return age >= 0 && age < 24 * 60 * 60 * 1000;
}

export function getStatusDotClass(status: LiveStatus): string {
  switch (status) {
    case 'working':
      return 'bg-signal';
    case 'occupied':
      return 'bg-amber-500';
    case 'broken':
      return 'bg-red-500';
    default:
      return 'bg-stone-300';
  }
}

export function getStatusTextClass(status: LiveStatus): string {
  switch (status) {
    case 'working':
      return 'text-signal';
    case 'occupied':
      return 'text-amber-600';
    case 'broken':
      return 'text-red-600';
    default:
      return 'text-stone-600';
  }
}
