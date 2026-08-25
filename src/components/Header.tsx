import React, { useState } from 'react';
import { useCompare } from '../context/CompareContext';
import { TELANGANA_RTOS } from '../data/telanganaRtoData';
import {
  Zap,
  Scale,
  MapPin,
  Menu,
  X,
  ShieldCheck
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
    <header className="sticky top-0 z-40 w-full">
      {/* 1. Announcement band — single centered line, never wraps into the nav */}
      <div className="bg-paper text-ink px-4 py-2 text-xs overflow-hidden">
        <p className="max-w-7xl mx-auto flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden">
          <button
            type="button"
            onClick={openTaxInspectorModal}
            className="inline-flex items-center gap-1 rounded-full bg-milestone hover:bg-[#0077ed] px-2.5 py-0.5 text-[11px] font-semibold text-white transition cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>G.O. Ms No. 41: ₹0 Road Tax</span>
          </button>
          <span className="text-stone-600 truncate hidden sm:inline">
            Save ₹12,000–₹35,000 across all 38 Telangana RTOs
          </span>
          <span className="hidden lg:inline text-quartzite" aria-hidden="true">|</span>
          <span className="hidden lg:inline text-stone-600 whitespace-nowrap">
            TSSPDCL <strong className="font-mono font-semibold text-ink">₹7.50/kWh</strong> · Petrol{' '}
            <strong className="font-mono font-semibold text-ink">₹{petrolPrice.toFixed(2)}/L</strong>
          </span>
        </p>
      </div>

      {/* 2. Main navigation bar */}
      <div className="border-b border-quartzite bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 min-w-0">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-ink">
                  EV Compare <span className="font-medium text-stone-500">TG</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden xl:block">
                Authentic Electric Two-Wheeler Decision Platform
              </p>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-2 min-w-0">
            {/* RTO District Selector */}
            <div className="relative flex items-center min-w-0">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedRtoCode}
                onChange={(e) => setRtoCode(e.target.value)}
                aria-label="Select your Telangana RTO / district"
                className="appearance-none pl-8 pr-7 py-1.5 bg-paper hover:bg-quartzite/50 border border-transparent rounded-full text-xs font-medium text-ink focus:outline-none focus-visible:border-milestone cursor-pointer transition w-[220px] truncate"
              >
                {TELANGANA_RTOS.map((rto) => (
                  <option key={rto.rtoCode} value={rto.rtoCode} className="bg-white text-ink">
                    {rto.rtoCode} — {rto.districtName}
                  </option>
                ))}
              </select>
            </div>

            {/* Charging Hubs & Highway Route Planner */}
            <button
              type="button"
              onClick={openChargingModal}
              title="50+ fast charging stations & 5 highway corridors in Telangana"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-ink hover:bg-paper transition cursor-pointer whitespace-nowrap"
            >
              Charging & Routes
            </button>

            {/* EV Tech Guide */}
            <button
              type="button"
              onClick={() => openTechModal()}
              title="On-board chargers, LFP vs NMC, liquid cooling & gearboxes"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-ink hover:bg-paper transition cursor-pointer whitespace-nowrap"
            >
              EV Tech Guide
            </button>

            {/* Green Loan Simulator */}
            <button
              type="button"
              onClick={openLoanModal}
              title="SBI green loan & bank EMI simulator"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-ink hover:bg-paper transition cursor-pointer whitespace-nowrap"
            >
              Bank EMI
            </button>

            {/* Range Simulator Trigger */}
            <button
              type="button"
              onClick={() => openRangeModal()}
              title="Physics-based range calculator"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-ink hover:bg-paper transition cursor-pointer whitespace-nowrap"
            >
              Range Simulator
            </button>

            {/* Savings Calculator Trigger */}
            <button
              type="button"
              onClick={() => openSavingsModal()}
              title="Petrol vs EV savings and ROI payback calculator"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-ink hover:bg-paper transition cursor-pointer whitespace-nowrap"
            >
              Savings ROI
            </button>

            {/* Smart Wizard Trigger */}
            <button
              type="button"
              onClick={openWizard}
              title="Smart buyer recommendation quiz"
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-ink hover:bg-paper transition cursor-pointer whitespace-nowrap"
            >
              Buyer Quiz
            </button>

            {/* Compare Matrix Trigger */}
            <button
              type="button"
              onClick={openCompare}
              className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-milestone text-white hover:bg-[#0077ed] transition cursor-pointer shrink-0"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
              {selectedCompareIds.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#0071e3] text-[10px] font-bold flex items-center justify-center font-mono">
                  {selectedCompareIds.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openCompare}
              className="relative p-2 rounded-full bg-milestone text-white"
              aria-label={`Compare vehicles (${selectedCompareIds.length} selected)`}
            >
              <Scale className="w-4 h-4" />
              {selectedCompareIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[#0071e3] text-[9px] font-bold flex items-center justify-center font-mono border border-milestone">
                  {selectedCompareIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-paper text-ink hover:bg-quartzite/60 transition cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-quartzite bg-white px-4 py-4 space-y-3 animate-fadeIn">
          <div>
            <label htmlFor="mobile-rto-select" className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Select Telangana District / RTO
            </label>
            <select
              id="mobile-rto-select"
              value={selectedRtoCode}
              onChange={(e) => {
                setRtoCode(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 bg-paper border border-quartzite rounded-xl text-sm font-medium text-ink"
            >
              {TELANGANA_RTOS.map((rto) => (
                <option key={rto.rtoCode} value={rto.rtoCode}>
                  {rto.rtoCode} — {rto.districtName} ({rto.officeLocation})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              { label: 'Charging & Routes', action: openChargingModal },
              { label: 'EV Tech Guide', action: () => openTechModal() },
              { label: 'Bank EMI', action: openLoanModal },
              { label: 'TSSPDCL Power Slabs', action: openTariffModal },
              { label: 'Tax Schedule Slabs', action: openTaxInspectorModal },
              { label: 'Petrol vs EV ROI', action: () => openSavingsModal() },
              { label: 'Range Simulator', action: () => openRangeModal() },
              { label: 'Buyer Quiz', action: openWizard }
            ].map(({ label, action }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  action();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl bg-paper border border-quartzite text-left text-xs font-semibold text-ink hover:bg-quartzite/40 transition cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
