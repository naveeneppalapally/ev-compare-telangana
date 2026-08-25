import React, { useState, useEffect } from 'react';
import type { EVModel } from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { 
  calculateTelanganaOnRoadPrice, 
  calculate5YearInsurance, 
  formatINR 
} from '../utils/priceCalculator';
import { 
  TELANGANA_RTOS, 
  getRtoByCode 
} from '../data/telanganaRtoData';
import { VehicleImage } from './VehicleImage';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  Share2
} from 'lucide-react';

export interface TelanganaPriceModalProps {
  model?: EVModel | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const TelanganaPriceModal: React.FC<TelanganaPriceModalProps> = ({
  model: propModel,
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    activePriceModalModel,
    closePriceModal,
    openDetail,
    openSavingsModal,
    selectedDistrict,
    selectedRtoCode: contextRtoCode
  } = useCompare();

  const model = propModel !== undefined ? propModel : activePriceModalModel;
  const isOpen = propIsOpen !== undefined ? propIsOpen : Boolean(activePriceModalModel);
  const handleClose = propOnClose || closePriceModal;

  const [selectedRtoCode, setSelectedRtoCode] = useState(contextRtoCode || selectedDistrict.rtoCode || 'TG-09');
  const [isInsuranceExpanded, setIsInsuranceExpanded] = useState(false);
  const [isPolicyInfoOpen, setIsPolicyInfoOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = React.useRef<number | null>(null);

  useEffect(() => {
    if (contextRtoCode) setSelectedRtoCode(contextRtoCode);
  }, [contextRtoCode]);

  useEffect(() => () => { if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current); }, []);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !model) return null;

  const currentRto = getRtoByCode(selectedRtoCode) || TELANGANA_RTOS[8]; // default TG-09
  const breakdown = calculateTelanganaOnRoadPrice(model, selectedRtoCode);

  const insuranceDetails = calculate5YearInsurance(
    model.pricing.exShowroom,
    model.specs.motorRatedPowerKw || model.specs.motorPeakPowerKw || 4.0
  );

  const handleCopyQuote = () => {
    const quote = `TELANGANA ON-ROAD PRICE QUOTE — ${model.name.toUpperCase()}
RTO Office: ${currentRto.officeLocation} (${currentRto.rtoCode} / ${currentRto.legacyCode}) - ${currentRto.districtName}
--------------------------------------------------
1. Ex-Showroom Invoice:        ${formatINR(breakdown.exShowroom)}
2. PM E-DRIVE Subsidy:        -${formatINR(breakdown.pmEdriveSubsidy)}
3. Dealer Discount:           -${formatINR(breakdown.customDiscount || 0)}
--------------------------------------------------
Net Base Invoice:              ${formatINR(breakdown.netVehiclePrice)}
4. Telangana State Road Tax:   ₹0 (EXEMPT - Saved ${formatINR(breakdown.stateRoadTaxStandardPetrol || breakdown.stateRoadTaxSavings || 0)})
5. Registration & Smart Card:  ₹0 (WAIVED - Saved ₹785)
6. Laser HSRP Plate:           ₹${breakdown.hsrpPlateFee || 400}
7. Mandatory 5-Yr Insurance:   ${formatINR(breakdown.insurance5Year)}
8. Handling & Logistics:       ${formatINR(breakdown.handlingAndDocs)}
9. Home Charger:               ${formatINR(breakdown.chargerCost)}
--------------------------------------------------
NET TELANGANA ON-ROAD PRICE:   ${formatINR(breakdown.totalTelanganaOnRoadPrice)}
TOTAL UPFRONT CASH SAVED:      ${formatINR(breakdown.totalUpfrontSavings || 0)} (G.O. Ms No. 41)
--------------------------------------------------
Generated via EV Compare Telangana Portal (2026)`;
    navigator.clipboard?.writeText(quote.trim()).then(() => {
      setIsCopied(true);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-stone-900/60 backdrop-blur-md animate-fadeIn text-stone-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-modal-title"
    >
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-stone-50/90 border-b border-stone-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="price-modal-title" className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                Telangana On-Road Price Calculator
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Official statutory calculations under G.O. Ms No. 41 (2024–2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuote}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
              <span>{isCopied ? 'Quote Copied!' : 'Copy Quote'}</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Top Vehicle Summary Card + RTO Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 flex items-center gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-stone-200 shrink-0 bg-stone-900">
                <VehicleImage
                  model={model}
                  className="w-full h-full"
                  aspectRatio="1/1"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{model.brand}</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">{model.name}</h3>
                <p className="text-xs text-stone-500">
                  {model.isIceBenchmark
                    ? '109.5cc Petrol Engine'
                    : `${model.specs.batteryCapacityKwh} kWh • ${model.specs.realWorldCityRangeKm} km real range`}
                </p>
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <div className="w-full sm:w-64">
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-600" />
                  Select RTO (38 Districts):
                </label>
                <select
                  value={selectedRtoCode}
                  onChange={(e) => setSelectedRtoCode(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 cursor-pointer"
                >
                  {TELANGANA_RTOS.map((rto) => (
                    <option key={rto.rtoCode} value={rto.rtoCode}>
                      {rto.rtoCode} — {rto.districtName} ({rto.officeLocation})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Official Policy Ribbon */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  Telangana EV Policy 2024–2026 Active in {currentRto.districtName}
                </h4>
                <p className="text-[11px] text-stone-600">
                  100% Exemption on Road Tax &amp; Registration Fees. Upfront savings: <strong className="text-stone-900 font-mono">{formatINR(breakdown.totalUpfrontSavings || 0)}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPolicyInfoOpen(!isPolicyInfoOpen)}
              className="text-xs font-bold text-stone-800 hover:text-stone-950 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>{isPolicyInfoOpen ? 'Hide Policy Details' : 'View Policy Rules'}</span>
              {isPolicyInfoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isPolicyInfoOpen && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2 text-stone-600">
              <p className="font-semibold text-stone-900">Official Government Order Summary (G.O. Ms No. 41):</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong>Road Tax:</strong> 100% waiver of standard 9% to 12% Life Tax applicable to petrol two-wheelers.</li>
                <li><strong>Registration Fee:</strong> ₹300 registration fee + ₹200 postal delivery + ₹285 smart card fee completely waived (₹0).</li>
                <li><strong>HSRP Number Plate:</strong> Mandatory ₹400 standard government-authorized laser-etched high-security plate fee.</li>
                <li><strong>Insurance:</strong> Mandatory IRDAI 5-year policy (1-Year Own Damage + 5-Year Third Party).</li>
              </ul>
            </div>
          )}

          {/* Itemized Price Calculation Table */}
          <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
            <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Itemized Breakdown</span>
              <span className="text-xs font-bold text-stone-500 font-mono">{currentRto.rtoCode}</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {/* Ex-Showroom */}
              <div className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900">1. Ex-Showroom Price (MSRP)</span>
                  <span className="text-[11px] text-stone-500 block">Manufacturer invoice including GST</span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">{formatINR(breakdown.exShowroom)}</span>
              </div>

              {/* PM E-DRIVE Subsidy */}
              {breakdown.pmEdriveSubsidy > 0 && (
                <div className="px-5 py-3 flex items-center justify-between bg-stone-50/50">
                  <div>
                    <span className="font-bold text-stone-900">2. Central PM E-DRIVE Subsidy</span>
                    <span className="text-[11px] text-stone-500 block">Central Government direct manufacturer incentive</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 text-sm">-{formatINR(breakdown.pmEdriveSubsidy)}</span>
                </div>
              )}

              {/* Road Tax Line */}
              <div className="px-5 py-3 flex items-center justify-between bg-stone-50">
                <div>
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                    3. Telangana State Road Tax (G.O. Ms No. 41)
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Petrol ICE Standard (12%): <del>{formatINR(breakdown.stateRoadTaxStandardPetrol || breakdown.stateRoadTaxSavings || 0)}</del>
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-stone-900 text-sm block">₹0</span>
                  <span className="text-[10px] text-stone-600 font-bold bg-stone-200 px-1.5 py-0.2 rounded">100% EXEMPT</span>
                </div>
              </div>

              {/* Registration & Smart Card */}
              <div className="px-5 py-3 flex items-center justify-between bg-stone-50">
                <div>
                  <span className="font-bold text-stone-900">4. RTO Registration &amp; Smart Card Fee</span>
                  <span className="text-[11px] text-stone-500 block">Standard Petrol Fee: <del>₹785</del></span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-stone-900 text-sm block">₹0</span>
                  <span className="text-[10px] text-stone-600 font-bold bg-stone-200 px-1.5 py-0.2 rounded">WAIVED</span>
                </div>
              </div>

              {/* HSRP Number Plate */}
              <div className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900">5. Laser-Etched HSRP Number Plate</span>
                  <span className="text-[11px] text-stone-500 block">Statutory fitment at RTO authorized center</span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">₹{breakdown.hsrpPlateFee || 400}</span>
              </div>

              {/* 5-Year Insurance */}
              <div className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900">6. Mandatory 5-Year Insurance</span>
                    <span className="text-[11px] text-stone-500 block">1-Year Own Damage (OD) + 5-Year Third Party (TP)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-sm">{formatINR(breakdown.insurance5Year)}</span>
                    <button
                      onClick={() => setIsInsuranceExpanded(!isInsuranceExpanded)}
                      className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
                    >
                      {isInsuranceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isInsuranceExpanded && (
                  <div className="mt-2 pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                    <div>1-Yr Own Damage: <strong className="font-mono text-stone-900">{formatINR(insuranceDetails.od1Year)}</strong></div>
                    <div>5-Yr Third Party: <strong className="font-mono text-stone-900">{formatINR(insuranceDetails.tp5Year)}</strong></div>
                    <div>Personal Accident Cover: <strong className="font-mono text-stone-900">{formatINR(insuranceDetails.cpaCover)}</strong></div>
                    <div>GST on Insurance (18%): <strong className="font-mono text-stone-900">{formatINR(insuranceDetails.gst18)}</strong></div>
                  </div>
                )}
              </div>

              {/* Home Charger */}
              <div className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900">7. Home Charging Unit &amp; Cable</span>
                  <span className="text-[11px] text-stone-500 block">
                    {model.pricing.chargerIncluded ? 'Standard home fast charger included by OEM' : 'Home portable charger accessory'}
                  </span>
                </div>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {breakdown.chargerCost === 0 ? 'Included' : formatINR(breakdown.chargerCost)}
                </span>
              </div>

              {/* Total On-Road Price */}
              <div className="px-5 py-4 flex items-center justify-between bg-stone-900 text-white rounded-b-2xl">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                    Net Telangana On-Road Price ({currentRto.rtoCode}):
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Includes ₹0 Road Tax, ₹0 Registration &amp; 5-Year Insurance
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                  {formatINR(breakdown.totalTelanganaOnRoadPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:px-6 border-t border-stone-200 bg-stone-50/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openDetail(model.id)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
            >
              Full Specifications
            </button>
            <button
              onClick={() => openSavingsModal(model.id)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
            >
              Petrol vs EV ROI
            </button>
          </div>

          <button
            onClick={handleCopyQuote}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied Quote' : 'Copy Official Quote'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelanganaPriceModal;
