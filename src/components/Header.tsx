import React, { useState } from 'react';
import { useCompare } from '../context/CompareContext';
import { TELANGANA_RTOS } from '../data/telanganaRtoData';
import { 
  Zap, 
  Scale, 
  Calculator, 
  Sparkles, 
  MapPin, 
  Sliders, 
  Menu, 
  X,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedCompareIds,
    openCompare,
    openSavingsModal,
    openRangeModal,
    openWizard,
    openChargingModal,
    openTariffModal,
    openLoanModal,
    openTaxInspectorModal,
    openTechModal,
    selectedRtoCode,
    setRtoCode,
    petrolPrice
  } = useCompare();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      {/* 1. Official Telangana EV Policy Top Banner */}
      <div className="bg-neutral-100/90 border-b border-neutral-200 px-4 py-1.5 text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={openTaxInspectorModal}
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 px-2.5 py-0.5 text-[11px] font-semibold text-white transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>G.O. Ms No. 41: 100% Road Tax Exemption</span>
            </button>
            <span className="hidden md:inline text-neutral-600 text-[11px] font-medium">
              Save ₹12,000 to ₹35,000 upfront across all 38 Telangana RTOs
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-700">
            <button
              onClick={openTariffModal}
              className="hover:text-neutral-950 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>TSSPDCL Domestic:</span>
              <strong className="text-neutral-900 font-mono">₹7.50/kWh</strong>
            </button>
            <span className="text-neutral-300">•</span>
            <span>Petrol: <strong className="text-neutral-900 font-mono">₹{petrolPrice.toFixed(2)}/L</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-neutral-900">
                EV Compare <span className="font-semibold text-neutral-500">TG</span>
              </span>
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700 uppercase tracking-wider border border-neutral-200">
                Telangana
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">
              Authentic Electric Two-Wheeler Decision Platform
            </p>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* RTO District Selector */}
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-neutral-500 absolute left-3 pointer-events-none" />
            <select
              value={selectedRtoCode}
              onChange={(e) => setRtoCode(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200 rounded-full text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer transition max-w-[200px] truncate"
              title="Select your Telangana RTO / District"
            >
              {TELANGANA_RTOS.map((rto) => (
                <option key={rto.rtoCode} value={rto.rtoCode} className="bg-white text-neutral-800">
                  {rto.rtoCode} — {rto.districtName}
                </option>
              ))}
            </select>
          </div>

          {/* Charging Hubs & Highway Route Planner */}
          <button
            onClick={openChargingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 transition cursor-pointer"
            title="50+ Fast Charging Stations & 5 Highway Corridors in Telangana"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>⚡ Charging & Routes</span>
          </button>

          {/* EV Tech Guide & Glossary */}
          <button
            onClick={() => openTechModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 transition cursor-pointer"
            title="EV Technology Guide: On-board chargers, LFP vs NMC, liquid cooling & gearboxes"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>🔬 EV Tech Guide</span>
          </button>

          {/* Green Loan Simulator */}
          <button
            onClick={openLoanModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 transition cursor-pointer"
            title="SBI Green Loan & Bank EMI Simulator"
          >
            <IndianRupee className="w-3.5 h-3.5 text-neutral-900" />
            <span>Bank EMI (8.5%)</span>
          </button>

          {/* Range Simulator Trigger */}
          <button
            onClick={() => openRangeModal()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 transition cursor-pointer"
            title="Physics-based range calculator"
          >
            <Sliders className="w-3.5 h-3.5 text-neutral-500" />
            <span>Range Simulator</span>
          </button>

          {/* Savings Calculator Trigger */}
          <button
            onClick={() => openSavingsModal()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 transition cursor-pointer"
            title="Petrol vs EV savings and ROI payback calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-neutral-500" />
            <span>Savings ROI</span>
          </button>

          {/* Smart Wizard Trigger */}
          <button
            onClick={openWizard}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-neutral-200 transition cursor-pointer"
            title="Smart Buyer Recommendation Quiz"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>Buyer Quiz</span>
          </button>

          {/* Compare Matrix Trigger */}
          <button
            onClick={openCompare}
            className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition cursor-pointer shadow-xs"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
            {selectedCompareIds.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-neutral-900 text-[10px] font-extrabold flex items-center justify-center font-mono">
                {selectedCompareIds.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={openCompare}
            className="relative p-2 rounded-xl bg-neutral-900 text-white"
            aria-label="Compare vehicles"
          >
            <Scale className="w-4 h-4" />
            {selectedCompareIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-neutral-900 text-[9px] font-extrabold flex items-center justify-center font-mono border border-neutral-900">
                {selectedCompareIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition cursor-pointer"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Select Telangana District / RTO
            </label>
            <select
              value={selectedRtoCode}
              onChange={(e) => {
                setRtoCode(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900"
            >
              {TELANGANA_RTOS.map((rto) => (
                <option key={rto.rtoCode} value={rto.rtoCode}>
                  {rto.rtoCode} — {rto.districtName} ({rto.officeLocation})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                openChargingModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-bold text-neutral-800"
            >
              ⚡ Charging & Routes
            </button>

            <button
              onClick={() => {
                openTechModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-bold text-neutral-800"
            >
              🔬 EV Tech Guide
            </button>

            <button
              onClick={() => {
                openLoanModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-bold text-neutral-800"
            >
              🏦 Bank EMI (8.5%)
            </button>

            <button
              onClick={() => {
                openTariffModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-bold text-neutral-800"
            >
              💡 TSSPDCL Power Slabs
            </button>

            <button
              onClick={() => {
                openTaxInspectorModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-bold text-neutral-800"
            >
              📜 Tax Schedule Slabs
            </button>

            <button
              onClick={() => {
                openSavingsModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-bold text-neutral-800"
            >
              💰 Petrol vs EV ROI
            </button>

            <button
              onClick={() => {
                openRangeModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-bold text-neutral-800"
            >
              🌡️ Range Simulator
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
