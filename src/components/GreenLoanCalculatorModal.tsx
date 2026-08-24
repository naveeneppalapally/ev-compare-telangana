import React, { useState, useMemo } from 'react';
import { formatINR } from '../utils/priceCalculator';
import { 
  X, 
  IndianRupee, 
  Sliders
} from 'lucide-react';

export interface GreenLoanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrice?: number;
}

export const GreenLoanCalculatorModal: React.FC<GreenLoanCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultPrice = 135000
}) => {
  const [vehiclePrice, setVehiclePrice] = useState<number>(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(15);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(36);

  // Bank Loan Schemes in Telangana:
  // 1. SBI Green Two-Wheeler Loan: ~8.50% p.a. (Special concession for EVs)
  // 2. Canara Green Two-Wheeler: ~8.75% p.a.
  // 3. Union Bank Green Mobility: ~8.60% p.a.
  // 4. Private NBFCs / Dealer Finance: ~13.50% p.a.

  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPercent) / 100);
  const loanPrincipal = vehiclePrice - downPaymentAmount;

  const calculateEmi = (principal: number, annualRatePercent: number, tenureMonths: number): number => {
    const monthlyRate = annualRatePercent / 12 / 100;
    return Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
  };

  const sbiEmi = useMemo(() => calculateEmi(loanPrincipal, 8.50, loanTenureMonths), [loanPrincipal, loanTenureMonths]);
  const nbfcEmi = useMemo(() => calculateEmi(loanPrincipal, 13.50, loanTenureMonths), [loanPrincipal, loanTenureMonths]);

  const sbiTotalRepayment = sbiEmi * loanTenureMonths;
  const nbfcTotalRepayment = nbfcEmi * loanTenureMonths;
  const greenLoanInterestSaved = nbfcTotalRepayment - sbiTotalRepayment;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-md animate-fadeIn text-neutral-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loan-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-50/90 border-b border-neutral-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="loan-modal-title" className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                  Telangana Green EV Bank Loan &amp; EMI Simulator
                </h2>
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800">
                  SBI Green Concession
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Compare Nationalized Bank Green EV Loans (8.5%) vs Standard Private Dealer Finance (13.5%)
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
          {/* Top 3 Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Loan Principal
              </span>
              <div className="text-2xl font-black font-mono text-neutral-900">
                {formatINR(loanPrincipal)}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Down payment ({downPaymentPercent}%): {formatINR(downPaymentAmount)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 text-white">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                SBI Green Loan EMI
              </span>
              <div className="text-2xl font-black font-mono text-white">
                {formatINR(sbiEmi)} <span className="text-xs font-normal text-neutral-400">/ month</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                At 8.50% p.a. for {loanTenureMonths} months
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Interest Saved vs NBFC
              </span>
              <div className="text-2xl font-black font-mono text-neutral-900">
                {formatINR(greenLoanInterestSaved)}
              </div>
              <p className="text-[11px] text-neutral-600 mt-1">
                Total repayment: {formatINR(sbiTotalRepayment)} (SBI) vs {formatINR(nbfcTotalRepayment)} (NBFC)
              </p>
            </div>
          </div>

          {/* Sliders */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-neutral-600" />
              Adjust Vehicle Price, Down Payment &amp; Tenure
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-600">On-Road Vehicle Price:</span>
                  <span className="font-mono font-bold text-neutral-900">{formatINR(vehiclePrice)}</span>
                </div>
                <input
                  type="range"
                  min="70000"
                  max="350000"
                  step="5000"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-600">Down Payment ({downPaymentPercent}%):</span>
                  <span className="font-mono font-bold text-neutral-900">{formatINR(downPaymentAmount)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-600">Loan Tenure:</span>
                  <span className="font-mono font-bold text-neutral-900">{loanTenureMonths} Months ({loanTenureMonths / 12} Yrs)</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="60"
                  step="12"
                  value={loanTenureMonths}
                  onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Bank Rate Comparison Table */}
          <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white">
            <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Bank &amp; NBFC EV Financing Schemes in Telangana (2026)
              </span>
              <span className="text-xs font-mono font-bold text-neutral-500">Live Rates</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-[11px] font-bold text-neutral-500 uppercase border-b border-neutral-200">
                  <th className="p-3">Financial Institution</th>
                  <th className="p-3">Loan Scheme</th>
                  <th className="p-3 font-mono">Interest Rate (p.a.)</th>
                  <th className="p-3 font-mono">Monthly EMI</th>
                  <th className="p-3 font-mono">Total Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-700">
                <tr className="bg-neutral-50/60 font-semibold">
                  <td className="p-3 font-bold text-neutral-900">State Bank of India (SBI)</td>
                  <td className="p-3">SBI Green Two-Wheeler Loan</td>
                  <td className="p-3 font-mono font-bold text-neutral-900">8.50%</td>
                  <td className="p-3 font-mono font-bold text-neutral-900">{formatINR(sbiEmi)}</td>
                  <td className="p-3 font-mono text-neutral-900">{formatINR(sbiTotalRepayment - loanPrincipal)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900">Union Bank of India</td>
                  <td className="p-3">Union Green Ride Scheme</td>
                  <td className="p-3 font-mono font-bold text-neutral-900">8.60%</td>
                  <td className="p-3 font-mono">{formatINR(calculateEmi(loanPrincipal, 8.60, loanTenureMonths))}</td>
                  <td className="p-3 font-mono">{formatINR(calculateEmi(loanPrincipal, 8.60, loanTenureMonths) * loanTenureMonths - loanPrincipal)}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900">Canara Bank</td>
                  <td className="p-3">Canara EV Special Loan</td>
                  <td className="p-3 font-mono font-bold text-neutral-900">8.75%</td>
                  <td className="p-3 font-mono">{formatINR(calculateEmi(loanPrincipal, 8.75, loanTenureMonths))}</td>
                  <td className="p-3 font-mono">{formatINR(calculateEmi(loanPrincipal, 8.75, loanTenureMonths) * loanTenureMonths - loanPrincipal)}</td>
                </tr>
                <tr className="text-neutral-500">
                  <td className="p-3 font-bold text-neutral-700">Private NBFCs / Dealer Desk</td>
                  <td className="p-3">Standard Two-Wheeler Finance</td>
                  <td className="p-3 font-mono font-bold text-neutral-700">13.50%</td>
                  <td className="p-3 font-mono">{formatINR(nbfcEmi)}</td>
                  <td className="p-3 font-mono">{formatINR(nbfcTotalRepayment - loanPrincipal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-neutral-200 bg-neutral-50/90 flex items-center justify-between text-xs text-neutral-500">
          <span>Public sector banks offer 450 to 500 bps lower interest rates for electric two-wheelers in Telangana.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition cursor-pointer shadow-xs"
          >
            Close Loan Simulator
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreenLoanCalculatorModal;
