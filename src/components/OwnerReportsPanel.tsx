import React, { useEffect, useState } from 'react';
import type { EVModel } from '../types/ev';
import { loadReports, saveReport, getAverageRange } from '../utils/ownerReports';
import type { OwnerReport } from '../utils/ownerReports';

export interface OwnerReportsPanelProps {
  model: EVModel;
}

type ConditionsOption = 'City traffic' | 'Highway' | 'Mixed';

function formatRelativeTime(iso: string): string {
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
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export const OwnerReportsPanel: React.FC<OwnerReportsPanelProps> = ({ model }) => {
  const [reports, setReports] = useState<OwnerReport[]>(() => loadReports(model.id));
  const [rangeKm, setRangeKm] = useState<string>('');
  const [conditions, setConditions] = useState<ConditionsOption>('Mixed');
  const [tempC, setTempC] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setReports(loadReports(model.id));
  }, [model.id]);

  const avg = getAverageRange(model.id);
  // getAverageRange uses same storage; ensure it reflects current reports if reports state is up to date
  // But compute from reports state for immediate UI after submit
  const avgFromState = reports.length > 0 ? Math.round((reports.reduce((a, r) => a + r.rangeKm, 0) / reports.length) * 10) / 10 : null;
  const displayAvg = avgFromState ?? avg;

  const sorted = [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const rangeNum = Number(rangeKm);
    const tempNum = Number(tempC);
    const cityTrim = city.trim();

    if (!rangeKm || Number.isNaN(rangeNum) || rangeNum <= 0) {
      setError('Enter a valid range in km (greater than 0).');
      return;
    }
    if (rangeNum < 10 || rangeNum > 500) {
      setError('Range should be between 10 and 500 km.');
      return;
    }
    if (tempC === '' || Number.isNaN(tempNum)) {
      setError('Enter ambient temperature in °C.');
      return;
    }
    if (tempNum < -10 || tempNum > 60) {
      setError('Temperature should be between -10°C and 60°C.');
      return;
    }
    if (!cityTrim || cityTrim.length < 2) {
      setError('Enter a valid city name (at least 2 characters).');
      return;
    }
    if (!conditions) {
      setError('Select riding conditions.');
      return;
    }

    const newReport: OwnerReport = {
      id: `${model.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      modelId: model.id,
      rangeKm: Math.round(rangeNum * 10) / 10,
      conditions,
      tempC: Math.round(tempNum * 10) / 10,
      city: cityTrim,
      timestamp: new Date().toISOString(),
    };

    saveReport(newReport);
    const updated = loadReports(model.id);
    // In case storage is mocked and returns stale due to timing, fallback to optimistic update
    if (updated.length === reports.length) {
      setReports([...reports, newReport]);
    } else {
      setReports(updated);
    }
    setRangeKm('');
    setTempC('');
    setCity('');
    setConditions('Mixed');
    setSuccess('Report saved — thanks for sharing your real-world range!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <span className="w-1.5 h-8 rounded-full bg-milestone inline-block" />
            Owner Real-World Reports
          </h3>
          <p className="text-[11px] text-stone-500 mt-1">
            Community range for <span className="font-semibold text-stone-700">{model.brand} {model.name}</span> · localStorage only
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-paper border border-quartzite text-stone-600 shrink-0">
          {reports.length} report{reports.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white border border-stone-200 text-center">
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Avg Reported</span>
          <span className="text-lg font-extrabold font-mono text-ink block mt-1">
            {displayAvg !== null ? `${displayAvg} km` : '—'}
          </span>
          <span className="text-[11px] text-stone-500">
            {displayAvg !== null ? `${reports.length} owner avg` : 'No data yet'}
          </span>
          {displayAvg !== null && (
            <div className="mt-2 h-1.5 rounded-full bg-paper border border-quartzite overflow-hidden">
              <div
                className="h-full bg-milestone rounded-full"
                style={{ width: `${Math.min(100, Math.round((displayAvg / model.specs.araiRangeKm) * 100))}%` }}
              />
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
          <span className="text-[10px] uppercase font-bold text-stone-500 block">ARAI Certified</span>
          <span className="text-lg font-extrabold font-mono text-stone-700 block mt-1">
            {model.specs.araiRangeKm} km
          </span>
          <span className="text-[11px] text-stone-500">Lab conditions</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Real City (Claimed)</span>
          <span className="text-lg font-extrabold font-mono text-stone-700 block mt-1">
            {model.specs.realWorldCityRangeKm} km
          </span>
          <span className="text-[11px] text-stone-500">OEM estimate</span>
        </div>
      </div>

      {displayAvg !== null && (
        <p className="text-[11px] leading-relaxed text-stone-600 bg-paper border border-quartzite rounded-xl px-3 py-2">
          {displayAvg < model.specs.realWorldCityRangeKm
            ? `Owners average ${displayAvg} km — ${Math.round(model.specs.realWorldCityRangeKm - displayAvg)} km under the claimed city range (${model.specs.realWorldCityRangeKm} km).`
            : displayAvg > model.specs.realWorldCityRangeKm
              ? `Owners average ${displayAvg} km — ${Math.round(displayAvg - model.specs.realWorldCityRangeKm)} km above claimed city range. Great efficiency!`
              : `Owners average matches the claimed city range exactly.`}{' '}
          ARAI is {model.specs.araiRangeKm} km.
        </p>
      )}

      {/* Report list */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-ink">Recent reports</h4>
        {sorted.length === 0 ? (
          <div className="p-4 rounded-xl bg-paper border border-quartzite text-center">
            <p className="text-xs text-stone-500">No owner reports yet for {model.name}.</p>
            <p className="text-[11px] text-stone-400 mt-1">Be the first to share your real ride range below.</p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {sorted.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-stone-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold font-mono text-ink">{r.rangeKm} km</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
                      {r.conditions}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {r.tempC}°C
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                    {r.city} · <span className="font-mono">{formatRelativeTime(r.timestamp)}</span>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-stone-400 shrink-0 hidden sm:block">
                  {new Date(r.timestamp).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-paper border border-quartzite space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-ink">Share your range</h4>
          <span className="text-[10px] text-stone-500">Stored locally on this device</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1 block">
            <span className="text-[11px] font-semibold text-stone-700">Range (km) *</span>
            <input
              type="number"
              inputMode="decimal"
              min={10}
              max={500}
              step="0.1"
              value={rangeKm}
              onChange={(e) => setRangeKm(e.target.value)}
              placeholder="e.g. 95"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-milestone/30 focus:border-milestone"
              aria-label="Reported range in km"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-[11px] font-semibold text-stone-700">Conditions *</span>
            <select
              value={conditions}
              onChange={(e) => setConditions(e.target.value as ConditionsOption)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-milestone/30 focus:border-milestone cursor-pointer"
              aria-label="Riding conditions"
            >
              <option value="City traffic">City traffic</option>
              <option value="Highway">Highway</option>
              <option value="Mixed">Mixed</option>
            </select>
          </label>

          <label className="space-y-1 block">
            <span className="text-[11px] font-semibold text-stone-700">Temp (°C) *</span>
            <input
              type="number"
              inputMode="decimal"
              min={-10}
              max={60}
              step="0.1"
              value={tempC}
              onChange={(e) => setTempC(e.target.value)}
              placeholder="e.g. 34"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-milestone/30 focus:border-milestone"
              aria-label="Ambient temperature in Celsius"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-[11px] font-semibold text-stone-700">City *</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Hyderabad"
              maxLength={48}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-milestone/30 focus:border-milestone"
              aria-label="City"
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-xs font-medium text-signal bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-milestone hover:bg-[#0077ed] text-white text-sm font-bold transition cursor-pointer shadow-sm"
        >
          Submit report
        </button>
        <p className="text-[10px] text-stone-400 text-center leading-relaxed">
          Your report is saved in <span className="font-mono">ev_tg_owner_reports</span> on this browser only. No server upload.
        </p>
      </form>
    </div>
  );
};

export default OwnerReportsPanel;
