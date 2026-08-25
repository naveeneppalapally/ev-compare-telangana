import React, { useState, useMemo } from 'react';
import { formatINR } from '../utils/priceCalculator';
import { 
  X, 
  Zap, 
  Sliders
} from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

export interface TSSPDCLTariffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TSSPDCLTariffModal: React.FC<TSSPDCLTariffModalProps> = ({
  isOpen,
  onClose
}) => {
  const [householdUnits, setHouseholdUnits] = useState<number>(200);
  const [monthlyKm, setMonthlyKm] = useState<number>(900);
  const [chargerEfficiency] = useState<number>(0.88);

  // TSSPDCL LT-I Domestic Telescopic Tariff Slabs (2024-2026)
  // Category A (<=100 units): 0-50 @ ₹1.95, 51-100 @ ₹3.10
  // Category B (101-200 units): 0-100 @ ₹3.40, 101-200 @ ₹4.80
  // Category C (>200 units): 0-200 @ ₹5.10, 201-300 @ ₹7.70, 301-400 @ ₹9.00, 401-800 @ ₹9.50, >800 @ ₹10.00
  const calculateBill = (units: number): number => {
    let bill = 0;
    if (units <= 100) {
      if (units <= 50) bill = units * 1.95;
      else bill = 50 * 1.95 + (units - 50) * 3.10;
    } else if (units <= 200) {
      if (units <= 100) bill = units * 3.40;
      else bill = 100 * 3.40 + (units - 100) * 4.80;
    } else {
      if (units <= 200) bill = units * 5.10;
      else if (units <= 300) bill = 200 * 5.10 + (units - 200) * 7.70;
      else if (units <= 400) bill = 200 * 5.10 + 100 * 7.70 + (units - 300) * 9.00;
      else bill = 200 * 5.10 + 100 * 7.70 + 100 * 9.00 + (units - 400) * 9.50;
    }
    const customerCharge = units <= 100 ? 25 : units <= 200 ? 50 : 70;
    const electricityDuty = units * 0.06;
    return bill + customerCharge + electricityDuty;
  };

  // EV charging electricity consumption per month
  const evWhPerKm = 32;
  const evUnitsConsumed = Math.round((monthlyKm * evWhPerKm) / (1000 * chargerEfficiency));

  const baseHouseholdBill = useMemo(() => calculateBill(householdUnits), [householdUnits]);
  const totalCombinedUnits = householdUnits + evUnitsConsumed;
  const combinedHouseholdAndEvBill = useMemo(() => calculateBill(totalCombinedUnits), [totalCombinedUnits]);
  const incrementalEvChargingCost = combinedHouseholdAndEvBill - baseHouseholdBill;

  // Comparison with Petrol
  const petrolCost = (monthlyKm / 45) * 109.66;
  const netMonthlyFuelSavings = petrolCost - incrementalEvChargingCost;

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-stone-900/60 backdrop-blur-md animate-fadeIn text-stone-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tariff-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-stone-50/90 border-b border-stone-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="tariff-modal-title" className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  TSSPDCL Domestic EV Charging Bill Calculator
                </h2>
                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-800">
                  LT-I Domestic Tariff
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Official Telangana slab billing impact when charging your electric two-wheeler at home
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Main Hero Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                EV Energy Added
              </span>
              <div className="text-2xl font-black font-mono text-stone-900">
                {evUnitsConsumed} <span className="text-xs font-normal text-stone-500">Units (kWh) / mo</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                For {monthlyKm} km monthly commute
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Monthly EV Power Cost
              </span>
              <div className="text-2xl font-black font-mono text-stone-900">
                {formatINR(incrementalEvChargingCost)}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                ~{(incrementalEvChargingCost / monthlyKm).toFixed(2)} / km charging cost
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900 text-white">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Monthly Fuel Savings
              </span>
              <div className="text-2xl font-black font-mono text-white">
                {formatINR(netMonthlyFuelSavings)}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Vs {formatINR(petrolCost)} on petrol (~₹109.66/L)
              </p>
            </div>
          </div>

          {/* Interactive Input Sliders */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-stone-600" />
              Adjust Household Units &amp; Commute Distance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-600">Current Monthly Household Units:</span>
                  <span className="font-mono font-bold text-stone-900">{householdUnits} Units</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="25"
                  value={householdUnits}
                  onChange={(e) => setHouseholdUnits(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Current Electricity Bill: <strong className="text-stone-900 font-mono">{formatINR(baseHouseholdBill)}</strong>
                </span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-600">Monthly EV Riding Distance:</span>
                  <span className="font-mono font-bold text-stone-900">{monthlyKm} km / month</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Daily average: <strong className="text-stone-900 font-mono">{Math.round(monthlyKm / 30)} km / day</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Official TSSPDCL Slabs Table */}
          <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
            <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Official TSSPDCL LT-I Domestic Telescopic Tariff Schedule
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">Telangana Electricity Regulatory Commission</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[11px] font-bold text-stone-500 uppercase border-b border-stone-200">
                  <th className="p-3">Consumption Slab</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 font-mono">Energy Charge / Unit</th>
                  <th className="p-3">Impact of EV Charging</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                <tr>
                  <td className="p-3 font-bold text-stone-900">0 – 100 Units</td>
                  <td className="p-3">LT-I (A) Lifeline</td>
                  <td className="p-3 font-mono font-bold text-stone-900">₹1.95 – ₹3.10</td>
                  <td className="p-3 text-stone-600">Lowest rate per km (~₹0.10/km)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-stone-900">101 – 200 Units</td>
                  <td className="p-3">LT-I (B) Middle Class</td>
                  <td className="p-3 font-mono font-bold text-stone-900">₹3.40 – ₹4.80</td>
                  <td className="p-3 text-stone-600">Standard domestic rate (~₹0.18/km)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-stone-900">201 – 300 Units</td>
                  <td className="p-3">LT-I (C) High Usage</td>
                  <td className="p-3 font-mono font-bold text-stone-900">₹7.70</td>
                  <td className="p-3 text-stone-600">Standard urban slab (~₹0.26/km)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-stone-900">301 – 400 Units</td>
                  <td className="p-3">LT-I (C) Peak Domestic</td>
                  <td className="p-3 font-mono font-bold text-stone-900">₹9.00</td>
                  <td className="p-3 text-stone-600">Higher slab rate (~₹0.31/km)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-stone-200 bg-stone-50/90 flex items-center justify-between text-xs text-stone-500">
          <span>Even at the highest ₹9.00/unit slab, an EV costs under ₹0.32/km compared to ₹2.44/km for petrol.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold transition cursor-pointer shadow-xs"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

export default TSSPDCLTariffModal;
