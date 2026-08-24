import React, { useState } from 'react';
import { formatINR } from '../utils/priceCalculator';
import { TELANGANA_RTOS, getRtoByCode } from '../data/telanganaRtoData';
import { 
  X, 
  ShieldCheck, 
  MapPin
} from 'lucide-react';

export interface TelanganaTaxInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRto?: string;
}

export const TelanganaTaxInspectorModal: React.FC<TelanganaTaxInspectorModalProps> = ({
  isOpen,
  onClose,
  defaultRto = 'TG-09'
}) => {
  const [selectedRtoCode, setSelectedRtoCode] = useState<string>(defaultRto);
  const [vehicleCost, setVehicleCost] = useState<number>(125000);

  const currentRto = getRtoByCode(selectedRtoCode) || TELANGANA_RTOS[8];

  // Telangana Motor Vehicles Taxation Act (Life Tax Schedule on Petrol Two-Wheelers):
  // Cost < ₹50,000: 9% Life Tax
  // Cost ₹50,000 to ₹1,50,000: 12% Life Tax
  // Cost > ₹1,50,000: 14% Life Tax
  // Registration Fee: ₹300 + Postal ₹200 + Smart Card ₹285 = ₹785
  // Total Petrol Statutory RTO cost = Life Tax + ₹785 + HSRP ₹400
  //
  // Electric Vehicle (Under G.O. Ms No. 41):
  // Life Tax = ₹0 (100% Exempt)
  // Registration Fee = ₹0 (Waived)
  // Smart Card = ₹0 (Waived)
  // HSRP Laser Plate = ₹400 (Fixed statutory)
  // Total EV Statutory RTO cost = ₹400

  let petrolTaxPercent = 12;
  if (vehicleCost < 50000) petrolTaxPercent = 9;
  else if (vehicleCost > 150000) petrolTaxPercent = 14;

  const petrolLifeTax = Math.round((vehicleCost * petrolTaxPercent) / 100);
  const petrolRegistrationFees = 785;
  const hsrpFee = 400;
  const petrolTotalRtoCharge = petrolLifeTax + petrolRegistrationFees + hsrpFee;

  const evTotalRtoCharge = hsrpFee;
  const totalTaxSaved = petrolLifeTax + petrolRegistrationFees;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-md animate-fadeIn text-neutral-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tax-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-50/90 border-b border-neutral-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="tax-modal-title" className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                  Telangana State Motor Vehicles Tax Schedule Inspector
                </h2>
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800">
                  G.O. Ms No. 41
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Official statutory schedule comparison: Petrol ICE Life Tax vs EV 100% Exemption across all 38 RTOs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* RTO Selector + Vehicle Price Slider */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                Select Telangana RTO Office:
              </label>
              <select
                value={selectedRtoCode}
                onChange={(e) => setSelectedRtoCode(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer"
              >
                {TELANGANA_RTOS.map((rto) => (
                  <option key={rto.rtoCode} value={rto.rtoCode}>
                    {rto.rtoCode} — {rto.districtName} ({rto.officeLocation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-neutral-600 font-semibold">Ex-Showroom Invoice Price:</span>
                <span className="font-mono font-bold text-neutral-900">{formatINR(vehicleCost)}</span>
              </div>
              <input
                type="range"
                min="40000"
                max="350000"
                step="5000"
                value={vehicleCost}
                onChange={(e) => setVehicleCost(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>
          </div>

          {/* Statutory Savings Comparison Banner */}
          <div className="p-5 rounded-2xl bg-neutral-900 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Upfront Statutory RTO Tax Savings Under G.O. Ms No. 41
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
                {formatINR(totalTaxSaved)}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Saved upfront on registration in {currentRto.officeLocation} ({currentRto.rtoCode})
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs max-w-xs">
              <span className="font-bold text-white block mb-1">Policy Validity:</span>
              <span className="text-[11px] text-neutral-300 block">
                Valid for 2 years (2024 to 2026) for all electric two-wheelers registered in Telangana.
              </span>
            </div>
          </div>

          {/* Side-by-Side Statutory Table */}
          <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white">
            <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Telangana Motor Vehicles Taxation Schedule Breakdown
              </span>
              <span className="text-xs font-mono font-bold text-neutral-500">TG Transport Department</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-[11px] font-bold text-neutral-500 uppercase border-b border-neutral-200">
                  <th className="p-3.5">Statutory Fee / Tax Component</th>
                  <th className="p-3.5">⛽ Petrol Two-Wheeler</th>
                  <th className="p-3.5 bg-neutral-100 font-extrabold text-neutral-900">⚡ Electric Two-Wheeler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-700">
                <tr>
                  <td className="p-3.5 font-semibold text-neutral-900">
                    <div>State Life Tax (Road Tax)</div>
                    <span className="text-[10px] text-neutral-500 font-normal">Applicable on invoice value</span>
                  </td>
                  <td className="p-3.5 font-mono text-neutral-800">
                    {formatINR(petrolLifeTax)} ({petrolTaxPercent}%)
                  </td>
                  <td className="p-3.5 bg-neutral-50/50 font-mono font-bold text-neutral-900">
                    ₹0 <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded ml-1 font-sans">100% EXEMPT</span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-neutral-900">
                    <div>RTO Registration &amp; Smart Card Fee</div>
                    <span className="text-[10px] text-neutral-500 font-normal">Registration ₹300 + Card ₹285 + Postal ₹200</span>
                  </td>
                  <td className="p-3.5 font-mono text-neutral-800">
                    {formatINR(petrolRegistrationFees)}
                  </td>
                  <td className="p-3.5 bg-neutral-50/50 font-mono font-bold text-neutral-900">
                    ₹0 <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded ml-1 font-sans">WAIVED</span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-neutral-900">
                    <div>Laser-Etched HSRP Number Plate</div>
                    <span className="text-[10px] text-neutral-500 font-normal">Statutory physical plate fitment</span>
                  </td>
                  <td className="p-3.5 font-mono text-neutral-800">
                    ₹{hsrpFee}
                  </td>
                  <td className="p-3.5 bg-neutral-50/50 font-mono font-bold text-neutral-900">
                    ₹{hsrpFee}
                  </td>
                </tr>

                <tr className="bg-neutral-50 font-bold">
                  <td className="p-3.5 text-neutral-900 uppercase">
                    Total Government RTO Fees
                  </td>
                  <td className="p-3.5 font-mono text-neutral-900 text-sm">
                    {formatINR(petrolTotalRtoCharge)}
                  </td>
                  <td className="p-3.5 font-mono text-neutral-900 text-sm bg-neutral-100">
                    ₹{evTotalRtoCharge}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-neutral-200 bg-neutral-50/90 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span>Reference: Transport Department, Government of Telangana, G.O. Ms No. 41.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition cursor-pointer shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelanganaTaxInspectorModal;
