import React from 'react';
import { useCompare } from '../context/CompareContext';
import { EV_CATALOG_LAST_UPDATED } from '../data/catalogMeta';
import { TELANGANA_RATES_LAST_VERIFIED } from '../data/telanganaRtoData';
import { 
  Zap, 
  ShieldCheck, 
  ExternalLink, 
  Calculator, 
  Sliders, 
  Scale, 
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    openWizard,
    openSavingsModal,
    openRangeModal,
    openCompare,
    petrolPrice,
    models
  } = useCompare();

  return (
    <footer className="mt-20 border-t border-stone-200 bg-white text-stone-600 text-xs">
      {/* 1. Decision Tool Shortcuts Banner */}
      <div className="border-b border-stone-200 bg-stone-50/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              Interactive Decision Tools for Telangana EV Buyers
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Data-backed calculations calibrated for Hyderabad city traffic, summer temperatures &amp; state policy incentives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={openWizard}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 text-left transition flex items-start gap-3.5 group cursor-pointer shadow-xs"
            >
              <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs group-hover:text-stone-600 transition">
                  Smart Buyer Quiz
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Find best-fit EV in 4 steps based on commute &amp; home socket
                </span>
              </div>
            </button>

            <button
              onClick={() => openSavingsModal()}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 text-left transition flex items-start gap-3.5 group cursor-pointer shadow-xs"
            >
              <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs group-hover:text-stone-600 transition">
                  Savings &amp; ROI Payback
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Compare against equivalent petrol benchmarks &amp; 5-yr TCO
                </span>
              </div>
            </button>

            <button
              onClick={() => openRangeModal()}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 text-left transition flex items-start gap-3.5 group cursor-pointer shadow-xs"
            >
              <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs group-hover:text-stone-600 transition">
                  Real Range Simulator
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Multi-factor physics with 42°C Telangana summer heat
                </span>
              </div>
            </button>

            <button
              onClick={openCompare}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 text-left transition flex items-start gap-3.5 group cursor-pointer shadow-xs"
            >
              <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs group-hover:text-stone-600 transition">
                  Comparison Matrix
                </span>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Side-by-side spec diffing across 41 verified models
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Official Policy & Reference Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-stone-900">
                EV Compare Telangana
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-md">
              India's authoritative electric two-wheeler decision platform for Telangana buyers. 
              Authentic manufacturer specifications, verified Deccan summer range simulations, 
              statutory G.O. Ms No. 41 tax calculations, and real petrol payback models.
            </p>
            <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-stone-100 text-stone-800 text-[11px] font-semibold border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-stone-800" />
              <span>G.O. Ms No. 41: 100% Exemption on Road Tax &amp; Registration Fee</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-wider block mb-2">
              Official Portals
            </span>
            <ul className="space-y-1.5 text-stone-500">
              <li>
                <a 
                  href="https://transport.telangana.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 transition flex items-center gap-1"
                >
                  <span>Telangana RTA Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://tssouthernpower.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 transition flex items-center gap-1"
                >
                  <span>TSSPDCL Electricity Tariff</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://heavyindustries.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-stone-900 transition flex items-center gap-1"
                >
                  <span>PM E-DRIVE Scheme Guidelines</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-wider block mb-2">
              Live Telangana Parameters
            </span>
            <ul className="space-y-1.5 text-stone-500 font-mono text-[11px]">
              <li>Hyderabad Petrol: <strong className="text-stone-900 font-bold">₹{petrolPrice.toFixed(2)}/L</strong></li>
              <li>TSSPDCL Domestic: <strong className="text-stone-900 font-bold">₹7.50/kWh</strong></li>
              <li>Road Tax on EVs: <strong className="text-stone-900 font-bold">₹0 (100% Exempt)</strong></li>
              <li>Catalog Scope: <strong className="text-stone-900 font-bold">{models.length} Authentic Models</strong></li>
              <li className="pt-1 text-[10px] text-stone-400 font-sans">
                Fuel &amp; tariff rates verified {TELANGANA_RATES_LAST_VERIFIED} · Catalog updated {EV_CATALOG_LAST_UPDATED}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-quartzite flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
          <span>© 2026 EV Compare Telangana. All specifications verified against manufacturer press kits &amp; ARAI filings.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
