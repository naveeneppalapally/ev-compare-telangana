import React from 'react';
import { useCompare } from '../context/CompareContext';
import { TELANGANA_DISTRICTS } from '../data/telanganaRtoData';
import { 
  Zap, 
  Scale, 
  Calculator, 
  Sparkles, 
  MapPin, 
  Fuel, 
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    selectedModelIds,
    setIsCompareModalOpen,
    setIsSavingsModalOpen,
    setIsQuizOpen,
    selectedDistrict,
    setSelectedDistrict,
    petrolPrice
  } = useCompare();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Telangana State Benefit Ticker */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Telangana EV Policy 2024–2026
            </span>
            <span className="hidden sm:inline text-slate-300">
              100% Exemption on Road Tax & Registration in TS RTOs (Save ₹12,000–₹24,000 upfront)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-amber-400">
              <Fuel className="w-3 h-3" />
              TG Petrol: ₹{petrolPrice.toFixed(2)}/L
            </span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <Zap className="w-3 h-3" />
              EV Running: ~₹0.25/km
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                EV Compare <span className="text-emerald-400">TG</span>
              </span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                Telangana
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              India Electric 2-Wheeler Decision Portal
            </p>
          </div>
        </div>

        {/* District Selector & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* District Picker */}
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedDistrict.id}
              onChange={(e) => {
                const found = TELANGANA_DISTRICTS.find((d) => d.id === e.target.value);
                if (found) setSelectedDistrict(found);
              }}
              className="appearance-none pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition max-w-[150px] sm:max-w-[210px] truncate"
              title="Select your Telangana District / RTO"
            >
              {TELANGANA_DISTRICTS.map((dist) => (
                <option key={dist.id} value={dist.id} className="bg-slate-900 text-slate-200">
                  {dist.rtoCode} - {dist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Savings Calculator Trigger */}
          <button
            onClick={() => setIsSavingsModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition hover:border-emerald-500/40"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Savings ROI</span>
          </button>

          {/* AI Match Wizard Trigger */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Find My Perfect EV</span>
            <span className="sm:hidden">Quiz</span>
          </button>

          {/* Sticky Comparison Badge & Modal Trigger */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-md ${
              selectedModelIds.length > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-950/20 text-xs font-bold">
              {selectedModelIds.length}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
