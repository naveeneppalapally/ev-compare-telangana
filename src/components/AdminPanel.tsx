import React, { useState, useEffect, useMemo } from 'react';
import { EV_MODELS } from '../data/evModels';
import freshnessData from '../data/freshness.json';
import { EV_CATALOG_LAST_UPDATED } from '../data/catalogMeta';
import {
  TELANGANA_CURRENT_PETROL_PRICE,
  TELANGANA_AVG_ELECTRICITY_RATE,
  TELANGANA_RATES_LAST_VERIFIED,
} from '../data/telanganaRtoData';
import {
  ShieldCheck,
  Download,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Save,
  FileJson,
  Database,
  Fuel,
  Zap,
  Calendar,
  Search,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LS_FRESH = 'ev_admin_freshness_draft';
const LS_RATES = 'ev_admin_rates_draft';
const LS_CATALOG = 'ev_admin_catalog_draft';

function tryParse(json: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(json) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function downloadBlob(content: string, filename: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

// Initial contents — pretty printed for human editing
const INITIAL_FRESHNESS = JSON.stringify(freshnessData, null, 2);
const INITIAL_RATES = JSON.stringify(
  {
    petrolPrice: TELANGANA_CURRENT_PETROL_PRICE,
    electricityTariff: TELANGANA_AVG_ELECTRICITY_RATE,
    catalogLastUpdated: EV_CATALOG_LAST_UPDATED,
    ratesLastVerified: TELANGANA_RATES_LAST_VERIFIED,
    comment: 'Edit values then download — paste back into src/data/telanganaRtoData.ts & catalogMeta.ts',
  },
  null,
  2
);
const INITIAL_CATALOG_PATCH = JSON.stringify(
  EV_MODELS.filter((m) => !m.isIceBenchmark).map((m) => ({
    id: m.id,
    name: m.name,
    brand: m.brand,
    category: m.category,
    exShowroom: m.pricing.exShowroom,
    pmEdriveSubsidy: m.pricing.pmEdriveSubsidy,
    batteryCapacityKwh: m.specs.batteryCapacityKwh,
  })),
  null,
  2
);

type PatchRow = {
  id: string;
  name: string;
  brand: string;
  category: string;
  exShowroom: number;
  pmEdriveSubsidy: number;
  batteryCapacityKwh: number;
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const Card: React.FC<{ title: string; icon: React.ReactNode; desc?: string; children: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  icon,
  desc,
  children,
  action,
}) => (
  <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-stone-100 flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
        <div>
          <h2 className="text-[13px] font-bold tracking-tight text-ink">{title}</h2>
          {desc && <p className="text-[11px] leading-snug text-stone-500 mt-0.5 max-w-[52ch]">{desc}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const TextAreaBlock: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  placeholder?: string;
  rows?: number;
  mono?: boolean;
}> = ({ label, value, onChange, error, rows = 10 }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-bold tracking-widest uppercase text-stone-500">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      spellCheck={false}
      className={`w-full rounded-xl border px-3.5 py-3 text-[12px] leading-relaxed font-mono bg-stone-50/60 focus:bg-white outline-none transition resize-y ${
        error ? 'border-red-300 focus:border-red-400 bg-red-50/40' : 'border-stone-200 focus:border-stone-400'
      }`}
    />
    {error ? (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-600">
        <AlertTriangle className="w-3.5 h-3.5" /> {error}
      </span>
    ) : (
      <span className="text-[11px] text-emerald-700 inline-flex items-center gap-1">
        <Check className="w-3 h-3" /> Valid JSON
      </span>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export const AdminPanel: React.FC = () => {
  // Draft — localStorage hydration
  const [freshnessText, setFreshnessText] = useState<string>(() => {
    try {
      const v = localStorage.getItem(LS_FRESH);
      if (v) return v;
    } catch {}
    return INITIAL_FRESHNESS;
  });
  const [ratesText, setRatesText] = useState<string>(() => {
    try {
      const v = localStorage.getItem(LS_RATES);
      if (v) return v;
    } catch {}
    return INITIAL_RATES;
  });
  const [catalogText, setCatalogText] = useState<string>(() => {
    try {
      const v = localStorage.getItem(LS_CATALOG);
      if (v) return v;
    } catch {}
    return INITIAL_CATALOG_PATCH;
  });

  const [catalogMode, setCatalogMode] = useState<'table' | 'json'>('table');
  const [filterQuery, setFilterQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [showFullCatalogJson, setShowFullCatalogJson] = useState(false);
  const [fullCatalogText, setFullCatalogText] = useState<string>(() => {
    // lazy init full catalog string — only when expanded to avoid huge initial render
    try {
      return JSON.stringify(EV_MODELS, null, 2);
    } catch {
      return '[]';
    }
  });
  const [fullCatalogError, setFullCatalogError] = useState<string | null>(null);

  // Persist drafts
  useEffect(() => {
    try {
      localStorage.setItem(LS_FRESH, freshnessText);
    } catch {}
  }, [freshnessText]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_RATES, ratesText);
    } catch {}
  }, [ratesText]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_CATALOG, catalogText);
    } catch {}
  }, [catalogText]);

  // Validation
  const freshnessParsed = useMemo(() => tryParse(freshnessText), [freshnessText]);
  const ratesParsed = useMemo(() => tryParse(ratesText), [ratesText]);
  const catalogParsed = useMemo(() => tryParse(catalogText), [catalogText]);
  const fullParsed = useMemo(() => tryParse(fullCatalogText), [fullCatalogText]);

  const freshnessError = !freshnessParsed.ok ? freshnessParsed.error : null;
  const ratesError = !ratesParsed.ok ? ratesParsed.error : null;
  const catalogError = !catalogParsed.ok ? catalogParsed.error : null;

  useEffect(() => {
    if (!fullParsed.ok) setFullCatalogError(fullParsed.error);
    else setFullCatalogError(null);
  }, [fullParsed]);

  const catalogRows: PatchRow[] = useMemo(() => {
    if (!catalogParsed.ok) return [];
    const v = catalogParsed.value;
    if (!Array.isArray(v)) return [];
    return v as PatchRow[];
  }, [catalogParsed]);

  const filteredRows = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return catalogRows;
    return catalogRows.filter(
      (r) => r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.brand.toLowerCase().includes(q)
    );
  }, [catalogRows, filterQuery]);

  // Toast helper
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  // Handlers — freshness
  const handleCopyFreshness = async () => {
    if (freshnessError) return flash('Fix JSON error before copying');
    await copyToClipboard(freshnessText);
    flash('freshness.json copied');
  };
  const handleDownloadFreshness = () => {
    if (freshnessError) return flash('Fix JSON error before download');
    downloadBlob(freshnessText, 'freshness.json', 'application/json');
    flash('freshness.json downloaded');
  };

  // Handlers — rates
  const handleCopyRates = async () => {
    if (ratesError) return flash('Fix rates JSON error first');
    await copyToClipboard(ratesText);
    flash('Rates JSON copied');
  };

  // Handlers — catalog patch
  const handleCopyCatalog = async () => {
    if (catalogError) return flash('Fix catalog JSON error first');
    await copyToClipboard(catalogText);
    flash('Catalog patch copied');
  };
  const handleDownloadCatalogSnippet = () => {
    if (catalogError || ratesError || freshnessError) return flash('Fix all JSON errors before download');
    const snippet = `// EV Compare Telangana — Admin CMS Export
// Generated: ${new Date().toISOString()}
// Catalog: ${EV_MODELS.length} models | Freshness: ${(freshnessParsed.ok && (freshnessParsed.value as Record<string,string>).vehicleCatalog) || '—'}
// ---------------------------------------------------------------------------
// 1) src/data/freshness.json — replace file contents with:
// ---------------------------------------------------------------------------
${freshnessText}

// ---------------------------------------------------------------------------
// 2) src/data/telanganaRtoData.ts
//    Update: TELANGANA_CURRENT_PETROL_PRICE, TELANGANA_AVG_ELECTRICITY_RATE
//    Update: TELANGANA_RATES_LAST_VERIFIED
// ---------------------------------------------------------------------------
// Rates config:
${ratesText}

// Example application in telanganaRtoData.ts:
//   export const TELANGANA_CURRENT_PETROL_PRICE = ${(ratesParsed.ok && (ratesParsed.value as Record<string, unknown>).petrolPrice) ?? TELANGANA_CURRENT_PETROL_PRICE};
//   export const TELANGANA_AVG_ELECTRICITY_RATE = ${(ratesParsed.ok && (ratesParsed.value as Record<string, unknown>).electricityTariff) ?? TELANGANA_AVG_ELECTRICITY_RATE};

// ---------------------------------------------------------------------------
// 3) src/data/catalogMeta.ts
//    Update: EV_CATALOG_LAST_UPDATED
// ---------------------------------------------------------------------------
//   export const EV_CATALOG_LAST_UPDATED = "${(ratesParsed.ok && (ratesParsed.value as Record<string, unknown>).catalogLastUpdated) ?? EV_CATALOG_LAST_UPDATED}";

// ---------------------------------------------------------------------------
// 4) src/data/evModels.ts — per-model pricing overrides
//    Apply these fields onto matching EV_MODELS entries by id, or replace
//    catalog generation. Each entry has: exShowroom, pmEdriveSubsidy, batteryCapacityKwh
// ---------------------------------------------------------------------------
export const CATALOG_PRICING_PATCH = ${catalogText} as const;

// Helper to apply patch (paste into a migration script if needed):
// import { EV_MODELS } from './evModels';
// const patchMap = new Map(CATALOG_PRICING_PATCH.map(p => [p.id, p]));
// const patched = EV_MODELS.map(m => {
//   const p = patchMap.get(m.id);
//   if (!p) return m;
//   return { ...m, pricing: { ...m.pricing, exShowroom: p.exShowroom, pmEdriveSubsidy: p.pmEdriveSubsidy }, specs: { ...m.specs, batteryCapacityKwh: p.batteryCapacityKwh } };
// });

export const FRESHNESS_CONFIG = ${freshnessText} as const;
`;
    downloadBlob(snippet, 'evModels.patch.ts', 'text/plain');
    flash('evModels.patch.ts downloaded');
  };

  const handleDownloadFullCatalogTs = () => {
    if (fullCatalogError) return flash('Fix full catalog JSON error');
    // fullCatalogText is full EV_MODELS array
    const ts = `import type { EVModel } from '../types/ev';

export { EV_CATALOG_LAST_UPDATED } from './catalogMeta.ts';

export const EV_MODELS: EVModel[] = ${fullCatalogText} as unknown as EVModel[];

export function getEVModels(): EVModel[] {
  return EV_MODELS.filter(m => !m.isIceBenchmark);
}
`;
    downloadBlob(ts, 'evModels.ts', 'text/plain');
    flash('evModels.ts downloaded');
  };

  const handleUpdateCatalogRow = (id: string, field: keyof PatchRow, raw: string) => {
    // numeric fields
    const numericFields: (keyof PatchRow)[] = ['exShowroom', 'pmEdriveSubsidy', 'batteryCapacityKwh'];
    let nextRows = catalogRows.map((r) => {
      if (r.id !== id) return r;
      if ((numericFields as string[]).includes(field)) {
        const n = Number(raw.replace(/[^0-9.\-]/g, ''));
        return { ...r, [field]: Number.isFinite(n) ? n : 0 } as PatchRow;
      }
      return { ...r, [field]: raw } as PatchRow;
    });
    // stable sort by original order? keep as is
    setCatalogText(JSON.stringify(nextRows, null, 2));
  };

  const handleResetFreshness = () => {
    setFreshnessText(INITIAL_FRESHNESS);
    flash('Restored freshness.json');
  };
  const handleResetRates = () => {
    setRatesText(INITIAL_RATES);
    flash('Restored rates');
  };
  const handleResetCatalog = () => {
    setCatalogText(INITIAL_CATALOG_PATCH);
    flash('Restored catalog patch');
  };
  const handleClearDrafts = () => {
    try {
      localStorage.removeItem(LS_FRESH);
      localStorage.removeItem(LS_RATES);
      localStorage.removeItem(LS_CATALOG);
    } catch {}
    setFreshnessText(INITIAL_FRESHNESS);
    setRatesText(INITIAL_RATES);
    setCatalogText(INITIAL_CATALOG_PATCH);
    flash('Drafts cleared');
  };

  // Derived stats for header pill
  const catalogCount = catalogRows.length;
  const hasAnyError = !!freshnessError || !!ratesError || !!catalogError;

  return (
    <div className="min-h-screen bg-[#fafaf8] text-ink font-sans antialiased selection:bg-ink selection:text-white">
      {/* Top bar — hidden admin notice */}
      <div className="sticky top-0 z-20 backdrop-blur bg-white/85 border-b border-stone-200">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 h-[56px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[12px] font-extrabold tracking-tight leading-none">EV Compare Telangana — Admin CMS</div>
              <div className="text-[11px] text-stone-500 leading-none mt-1">Hidden route · #admin · No backend · Drafts in localStorage</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${hasAnyError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              <span className={`w-2 h-2 rounded-full ${hasAnyError ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
              {hasAnyError ? 'Fix JSON errors' : `${catalogCount} models · Ready`}
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
                window.location.reload();
              }}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to catalog
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Intro / Instructions */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-milestone bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Local-only CMS · No auth · Hidden route
              </div>
              <h1 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight leading-tight">
                Update prices, subsidies &amp; freshness <span className="font-serif font-normal italic text-stone-500">without a code push</span>
              </h1>
              <p className="text-[13px] leading-relaxed text-stone-600">
                Edit JSON below, validate instantly, then download files and commit. Drafts auto-save to <code className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded text-[11px] font-mono">localStorage</code>. Nothing is sent to a server.
                Share this URL only with trusted editors: <code className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded text-[11px] font-mono">{typeof window !== 'undefined' ? window.location.origin + '/#admin' : '/#admin'}</code>
              </p>
              <ol className="text-[12px] leading-relaxed text-stone-600 list-decimal list-inside space-y-1 marker:font-bold marker:text-stone-900">
                <li>Edit petrol / tariff / dates and per-model fields</li>
                <li>Fix any red JSON errors</li>
                <li>Click download — replace <code className="font-mono text-[11px] bg-stone-100 border border-stone-200 px-1 rounded">freshness.json</code> / <code className="font-mono text-[11px] bg-stone-100 border border-stone-200 px-1 rounded">evModels.ts</code> / <code className="font-mono text-[11px] bg-stone-100 border border-stone-200 px-1 rounded">catalogMeta.ts</code> in your repo</li>
                <li>Commit &amp; deploy — CI validates freshness dates</li>
              </ol>
            </div>
            <div className="shrink-0 flex flex-col gap-3 lg:w-[320px]">
              <div className="rounded-2xl bg-stone-900 text-white p-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-stone-300">
                  <Zap className="w-3.5 h-3.5" /> Quick actions
                </div>
                <button
                  onClick={handleDownloadCatalogSnippet}
                  disabled={!!hasAnyError}
                  className="w-full inline-flex items-center justify-center gap-2 bg-milestone text-white rounded-full px-5 py-2.5 text-[13px] font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Download className="w-4 h-4" /> Download updated evModels.ts snippet
                </button>
                <button
                  onClick={handleCopyFreshness}
                  disabled={!!freshnessError}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-stone-900 rounded-full px-5 py-2.5 text-[13px] font-bold hover:bg-stone-100 disabled:opacity-40 transition"
                >
                  <Copy className="w-4 h-4" /> Copy freshness.json
                </button>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button onClick={handleClearDrafts} className="inline-flex items-center justify-center gap-1.5 border border-white/20 text-white/90 rounded-full px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition">
                    <RotateCcw className="w-3.5 h-3.5" /> Clear drafts
                  </button>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-white/20 text-white/90 rounded-full px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Repo
                  </a>
                </div>
                {toast && <div className="text-[11px] font-semibold bg-white text-stone-900 rounded-xl px-3 py-2 text-center animate-fadeIn">{toast}</div>}
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-3 flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-amber-900">
                  <span className="font-bold">No auth.</span> Keep <code className="font-mono bg-white border border-amber-200 px-1 rounded">#admin</code> unlinked from public UI. Add password gate before exposing publicly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global rates & freshness — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Rates & Dates"
            icon={<Fuel className="w-4 h-4" />}
            desc="Petrol ₹/L, TSSPDCL tariff ₹/kWh, and last-verified dates. Edit JSON, then mirror into telanganaRtoData.ts / catalogMeta.ts."
            action={
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleResetRates} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  onClick={handleCopyRates}
                  disabled={!!ratesError}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-stone-900 text-white hover:bg-black disabled:opacity-40"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            }
          >
            <TextAreaBlock label="Rates JSON (petrol, tariff, catalog last-updated)" value={ratesText} onChange={setRatesText} error={ratesError} rows={13} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-stone-50 border border-stone-200 px-3 py-3">
                <div className="text-[10px] font-bold tracking-widest uppercase text-stone-500">Petrol</div>
                <div className="text-[13px] font-extrabold text-ink mt-1">{ratesParsed.ok ? `₹${(ratesParsed.value as Record<string, number>).petrolPrice ?? '—'}/L` : '—'}</div>
              </div>
              <div className="rounded-xl bg-stone-50 border border-stone-200 px-3 py-3">
                <div className="text-[10px] font-bold tracking-widest uppercase text-stone-500">Tariff</div>
                <div className="text-[13px] font-extrabold text-ink mt-1">{ratesParsed.ok ? `₹${(ratesParsed.value as Record<string, number>).electricityTariff ?? (ratesParsed.value as Record<string, number>).electricityRate ?? '—'}/kWh` : '—'}</div>
              </div>
              <div className="rounded-xl bg-stone-50 border border-stone-200 px-3 py-3">
                <div className="text-[10px] font-bold tracking-widest uppercase text-stone-500">Catalog</div>
                <div className="text-[12px] font-bold text-ink mt-1 truncate">{ratesParsed.ok ? String((ratesParsed.value as Record<string, string>).catalogLastUpdated ?? '—') : '—'}</div>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500 mt-3">
              Source files: <code className="font-mono bg-stone-100 border border-stone-200 px-1 rounded">src/data/telanganaRtoData.ts</code> and{' '}
              <code className="font-mono bg-stone-100 border border-stone-200 px-1 rounded">src/data/catalogMeta.ts</code>
            </p>
          </Card>

          <Card
            title="freshness.json"
            icon={<Calendar className="w-4 h-4" />}
            desc="CI fails if any date is older than 45 days. Update alongside the matching constant in src/data/."
            action={
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleResetFreshness} className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  onClick={handleCopyFreshness}
                  disabled={!!freshnessError}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 rounded-full bg-milestone text-white hover:opacity-90 disabled:opacity-40"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy freshness.json
                </button>
              </div>
            }
          >
            <TextAreaBlock label="src/data/freshness.json" value={freshnessText} onChange={setFreshnessText} error={freshnessError} rows={13} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleDownloadFreshness}
                disabled={!!freshnessError}
                className="inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-full bg-white border border-stone-200 hover:border-stone-400 disabled:opacity-40"
              >
                <Download className="w-4 h-4" /> Download freshness.json
              </button>
              <button
                onClick={() => {
                  const today = new Date().toISOString().slice(0, 10);
                  if (!freshnessParsed.ok) return;
                  const obj = freshnessParsed.value as Record<string, string>;
                  const bumped: Record<string, string> = { ...obj };
                  for (const k of ['petrolPrice', 'electricityTariff', 'vehicleCatalog', 'chargingStations', 'policyGO41']) {
                    if (k in bumped) bumped[k] = today;
                  }
                  setFreshnessText(JSON.stringify(bumped, null, 2));
                  flash(`Bumped all dates to ${today}`);
                }}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-full bg-stone-900 text-white hover:bg-black"
              >
                <Save className="w-4 h-4" /> Bump all to today
              </button>
            </div>
          </Card>
        </div>

        {/* Catalog patch editor */}
        <Card
          title={`Catalog pricing — ${catalogCount} models`}
          icon={<FileJson className="w-4 h-4" />}
          desc="Per-model exShowroom, subsidy, and battery fields. Table is the friendly editor; JSON is the source of truth. Both stay in sync and validate before download."
          action={
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex rounded-full bg-stone-100 border border-stone-200 p-1">
                <button
                  onClick={() => setCatalogMode('table')}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition ${catalogMode === 'table' ? 'bg-white shadow-sm border border-stone-200 text-ink' : 'text-stone-600'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setCatalogMode('json')}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition ${catalogMode === 'json' ? 'bg-white shadow-sm border border-stone-200 text-ink' : 'text-stone-600'}`}
                >
                  Raw JSON
                </button>
              </div>
              <button onClick={handleResetCatalog} className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={handleDownloadCatalogSnippet}
                disabled={!!hasAnyError}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-full bg-milestone text-white hover:opacity-90 disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" /> Download snippet
              </button>
            </div>
          }
        >
          {/* Mobile toggle */}
          <div className="flex sm:hidden rounded-full bg-stone-100 border border-stone-200 p-1 w-fit mb-4">
            <button
              onClick={() => setCatalogMode('table')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold ${catalogMode === 'table' ? 'bg-white shadow-sm border border-stone-200' : 'text-stone-600'}`}
            >
              Table
            </button>
            <button
              onClick={() => setCatalogMode('json')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold ${catalogMode === 'json' ? 'bg-white shadow-sm border border-stone-200' : 'text-stone-600'}`}
            >
              Raw JSON
            </button>
          </div>

          {catalogMode === 'json' ? (
            <>
              <TextAreaBlock label="Catalog patch JSON — Array< { id, exShowroom, pmEdriveSubsidy, batteryCapacityKwh } >" value={catalogText} onChange={setCatalogText} error={catalogError} rows={18} />
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleCopyCatalog}
                  disabled={!!catalogError}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-full border border-stone-200 bg-white hover:border-stone-400 disabled:opacity-40"
                >
                  <Copy className="w-4 h-4" /> Copy patch JSON
                </button>
                <button
                  onClick={handleDownloadCatalogSnippet}
                  disabled={!!hasAnyError}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-full bg-stone-900 text-white hover:bg-black disabled:opacity-40"
                >
                  <Download className="w-4 h-4" /> Download updated evModels.ts snippet
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Search + actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Filter by id, name, or brand (e.g. Ola, Revolt, Ather)…"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:border-stone-400 outline-none text-[13px] placeholder:text-stone-400"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-stone-500 font-medium">
                    Showing <strong className="text-ink">{filteredRows.length}</strong> / {catalogCount}
                  </span>
                  <button onClick={handleResetCatalog} className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-200">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              {catalogError ? (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-[12px] flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Catalog JSON is invalid — fix in Raw JSON tab: <code className="font-mono bg-white border px-1 rounded">{catalogError}</code>
                  </span>
                </div>
              ) : (
                <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <div className="max-h-[520px] overflow-auto overscroll-contain">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-stone-50 border-b border-stone-200 z-10">
                        <tr className="text-[10px] font-bold tracking-widest uppercase text-stone-500">
                          <th className="px-3 py-2.5 font-bold w-[28%]">Model</th>
                          <th className="px-2 py-2.5 font-bold hidden sm:table-cell">Brand</th>
                          <th className="px-2 py-2.5 font-bold">Ex-showroom ₹</th>
                          <th className="px-2 py-2.5 font-bold">Subsidy ₹</th>
                          <th className="px-2 py-2.5 font-bold">Battery kWh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredRows.map((row) => (
                          <tr key={row.id} className="hover:bg-stone-50/70 group">
                            <td className="px-3 py-2.5">
                              <div className="text-[12px] font-semibold leading-tight text-ink line-clamp-1" title={row.name}>
                                {row.name}
                              </div>
                              <div className="text-[11px] font-mono text-stone-500 truncate">{row.id}</div>
                            </td>
                            <td className="px-2 py-2.5 text-[12px] text-stone-700 hidden sm:table-cell">
                              <span className="inline-flex px-2 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-semibold">{row.brand}</span>
                            </td>
                            <td className="px-2 py-2.5">
                              <input
                                type="number"
                                inputMode="numeric"
                                value={row.exShowroom}
                                onChange={(e) => handleUpdateCatalogRow(row.id, 'exShowroom', e.target.value)}
                                className="w-[112px] rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[12px] font-mono focus:border-stone-400 outline-none"
                              />
                            </td>
                            <td className="px-2 py-2.5">
                              <input
                                type="number"
                                inputMode="numeric"
                                value={row.pmEdriveSubsidy}
                                onChange={(e) => handleUpdateCatalogRow(row.id, 'pmEdriveSubsidy', e.target.value)}
                                className="w-[96px] rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[12px] font-mono focus:border-stone-400 outline-none"
                              />
                            </td>
                            <td className="px-2 py-2.5">
                              <input
                                type="number"
                                inputMode="decimal"
                                step="0.1"
                                value={row.batteryCapacityKwh}
                                onChange={(e) => handleUpdateCatalogRow(row.id, 'batteryCapacityKwh', e.target.value)}
                                className="w-[84px] rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-[12px] font-mono focus:border-stone-400 outline-none"
                              />
                            </td>
                          </tr>
                        ))}
                        {filteredRows.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-[12px] text-stone-500">
                              No models match “{filterQuery}”.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleCopyCatalog}
                  disabled={!!catalogError}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-full border border-stone-200 bg-white hover:border-stone-400 disabled:opacity-40"
                >
                  <Copy className="w-4 h-4" /> Copy patch JSON
                </button>
                <button
                  onClick={handleDownloadCatalogSnippet}
                  disabled={!!hasAnyError}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-full bg-milestone text-white hover:opacity-90 disabled:opacity-40"
                >
                  <Download className="w-4 h-4" /> Download updated evModels.ts snippet
                </button>
                {catalogMode === 'table' && (
                  <button
                    onClick={() => setCatalogMode('json')}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-full bg-white border border-stone-200 hover:bg-stone-50"
                  >
                    <FileJson className="w-4 h-4" /> View raw JSON
                  </button>
                )}
              </div>
            </>
          )}
        </Card>

        {/* Full catalog advanced */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowFullCatalogJson((v) => !v)}
            className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-stone-50 transition text-left"
          >
            <span className="inline-flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <Database className="w-4 h-4" />
              </span>
              <span>
                <span className="text-[13px] font-bold tracking-tight text-ink block">Advanced — Full catalog JSON (all 54 fields per model)</span>
                <span className="text-[11px] text-stone-500">For power users: paste entire EV_MODELS array, add new models, or bulk-replace. Validates before download.</span>
              </span>
            </span>
            <span className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border ${showFullCatalogJson ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>
              {showFullCatalogJson ? 'Hide' : 'Show'}
            </span>
          </button>
          {showFullCatalogJson && (
            <div className="px-6 pb-6 border-t border-stone-100 pt-6 space-y-4">
              <TextAreaBlock
                label={`Full EV_MODELS JSON — ${EV_MODELS.length} entries (isIceBenchmark included) — edit carefully`}
                value={fullCatalogText}
                onChange={setFullCatalogText}
                error={fullCatalogError}
                rows={20}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={async () => {
                    if (fullCatalogError) return flash('Fix JSON error');
                    await copyToClipboard(fullCatalogText);
                    flash('Full catalog JSON copied');
                  }}
                  disabled={!!fullCatalogError}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-full border border-stone-200 bg-white hover:border-stone-400 disabled:opacity-40"
                >
                  <Copy className="w-4 h-4" /> Copy full JSON
                </button>
                <button
                  onClick={handleDownloadFullCatalogTs}
                  disabled={!!fullCatalogError}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-full bg-stone-900 text-white hover:bg-black disabled:opacity-40"
                >
                  <Download className="w-4 h-4" /> Download full evModels.ts
                </button>
                <span className="text-[11px] text-stone-500 self-center">Writes a ready-to-commit <code className="font-mono bg-stone-100 border px-1 rounded">src/data/evModels.ts</code> file.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 border-t border-stone-200 pt-6">
          <span>Drafts stored locally · Nothing leaves this browser · <strong className="text-stone-700">No backend</strong></span>
          <span className="inline-flex items-center gap-1.5">
            EV Compare Telangana · Hidden CMS · <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; window.location.reload(); }} className="underline hover:text-ink">Exit #admin</a>
          </span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-[12px] font-semibold px-4 py-2.5 rounded-full shadow-xl border border-white/10 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
