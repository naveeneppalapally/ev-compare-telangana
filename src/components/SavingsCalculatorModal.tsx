import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { EVModel } from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { 
  calculateSavings, 
  FINANCIAL_BENCHMARKS 
} from '../utils/savingsCalculator';
import { 
  calculateTelanganaOnRoadPrice, 
  formatINR 
} from '../utils/priceCalculator';
import {
  X,
  Calculator,
  ShieldCheck,
  Check,
  Share2,
  Sliders,
  Gauge
} from 'lucide-react';

export interface SavingsCalculatorModalProps {
  model?: EVModel | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const SavingsCalculatorModal: React.FC<SavingsCalculatorModalProps> = ({
  model: propModel,
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const {
    isSavingsModalOpen,
    closeSavingsModal,
    models,
    activeSimulatorModelId,
    selectedDistrict,
    selectedRtoCode: contextRtoCode,
    petrolPrice: contextPetrolPrice,
    electricityRate: contextElectricityRate,
    openPriceModal,
    openRangeModal
  } = useCompare();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isSavingsModalOpen;
  const handleClose = useCallback(() => {
    if (propOnClose) propOnClose();
    else closeSavingsModal();
  }, [propOnClose, closeSavingsModal]);

  const evModels = useMemo(() => models.filter(m => !m.isIceBenchmark), [models]);

  const initialModelId = propModel?.id || activeSimulatorModelId || evModels[0]?.id || 'ather-rizta-z-37';
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);

  useEffect(() => {
    if (propModel?.id) {
      setSelectedModelId(propModel.id);
    } else if (activeSimulatorModelId && evModels.some(m => m.id === activeSimulatorModelId)) {
      setSelectedModelId(activeSimulatorModelId);
    }
  }, [propModel, activeSimulatorModelId, evModels]);

  const activeModel = useMemo(() => {
    return evModels.find(m => m.id === selectedModelId) || evModels[0];
  }, [evModels, selectedModelId]);

  const benchmark = activeModel?.equivalentPetrolBenchmark || {
    modelName: activeModel?.category === 'motorcycle' ? 'Hero Splendor Plus / Pulsar 125' : 'Honda Activa 6G (110cc)',
    engineCc: activeModel?.category === 'motorcycle' ? 125 : 110,
    petrolBhp: activeModel?.category === 'motorcycle' ? 10.8 : 7.8,
    petrolTorqueNm: activeModel?.category === 'motorcycle' ? 11.0 : 8.9,
    petrolMileageKmpl: activeModel?.category === 'motorcycle' ? 55 : 45,
    petrolExShowroom: activeModel?.category === 'motorcycle' ? 85000 : 78000,
    petrolOnRoadTG: activeModel?.category === 'motorcycle' ? 102000 : 94000,
    classComparison: activeModel?.category === 'motorcycle' ? 'Commuter Motorcycle' : '110cc Commuter Scooter',
    powerComparisonSummary: 'Standard ICE Benchmark'
  };

  const [dailyKm, setDailyKm] = useState<number>(35);
  const [daysPerMonth] = useState<number>(26);
  const [petrolPrice] = useState<number>(contextPetrolPrice || FINANCIAL_BENCHMARKS.HYDERABAD_PETROL_PRICE_PER_LITER);
  const [petrolMileage, setPetrolMileage] = useState<number>(benchmark.petrolMileageKmpl);
  const [electricityRate, setElectricityRate] = useState<number>(contextElectricityRate || FINANCIAL_BENCHMARKS.TSSPDCL_DOMESTIC_TARIFF_PER_KWH);
  const [rtoCode] = useState<string>(contextRtoCode || selectedDistrict?.rtoCode || 'TG-09');

  useEffect(() => {
    if (benchmark?.petrolMileageKmpl) {
      setPetrolMileage(benchmark.petrolMileageKmpl);
    }
  }, [activeModel?.id, benchmark?.petrolMileageKmpl]);

  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
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

  const savingsResult = useMemo(() => {
    if (!activeModel) return null;
    return calculateSavings(activeModel, {
      dailyKm,
      daysPerMonth,
      petrolPricePerLiter: petrolPrice,
      petrolMileageKmpl: petrolMileage,
      electricityCostPerKwh: electricityRate
    });
  }, [activeModel, dailyKm, daysPerMonth, petrolPrice, petrolMileage, electricityRate]);

  const evPricing = useMemo(() => {
    if (!activeModel) return null;
    return calculateTelanganaOnRoadPrice(activeModel, rtoCode);
  }, [activeModel, rtoCode]);

  const evBhp = Math.round(activeModel.specs.motorPeakPowerKw * 1.341 * 10) / 10;
  const evTorque = activeModel.specs.motorPeakTorqueNm || 25;

  const petrolTCO = savingsResult?.fiveYearPetrolTCO || savingsResult?.tco?.petrolNetTCO || (benchmark.petrolOnRoadTG + (savingsResult?.fiveYearOperationalSavings || 100000));
  const evTCO = savingsResult?.fiveYearEvTCO || savingsResult?.tco?.evNetTCO || (evPricing?.totalTelanganaOnRoadPrice || 120000);

  const handleCopySummary = useCallback(() => {
    if (!savingsResult || !activeModel || !evPricing) return;
    const text = `EV ROI Summary (Telangana Edition):
Vehicle: ${activeModel.brand} ${activeModel.name}
Telangana Net On-Road (${rtoCode}): ${formatINR(evPricing.totalTelanganaOnRoadPrice)} (₹0 Road Tax Applied)
Equivalent Petrol Benchmark: ${benchmark.modelName} (Mileage: ${petrolMileage} km/L)
Daily Commute: ${dailyKm} km/day (${dailyKm * daysPerMonth} km/mo)

Monthly Cash Saved: ${formatINR(savingsResult.monthlySavings)}
Annual Net Savings: ${formatINR(savingsResult.totalAnnualNetSavings)}
5-Year Operational Savings: ${formatINR(savingsResult.fiveYearSavings)}
Breakeven Payback: ${savingsResult.paybackFormatted || `${savingsResult.paybackPeriodMonths} Months`}
Generated by EV Compare Telangana (2026)`;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  }, [savingsResult, activeModel, evPricing, rtoCode, benchmark, petrolMileage, dailyKm, daysPerMonth]);

  if (!isOpen || !activeModel || !savingsResult || !evPricing) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="savings-modal-title"
    >
      <div 
        className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="savings-modal-title" className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Petrol vs EV Financial &amp; ROI Engine
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 px-2.5 py-0.5 text-[10px] font-bold text-stone-800">
                  <ShieldCheck className="w-3 h-3 text-stone-700" />
                  G.O. Ms No. 41
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Telangana 100% Road Tax Exemption &amp; Dynamic ICE Benchmark Comparison
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-semibold transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
              <span>{isCopied ? 'Copied' : 'Share'}</span>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                Select Electric Two-Wheeler ({evModels.length} Models)
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full py-2 px-3 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 cursor-pointer"
              >
                {evModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.brand} {m.name} — {m.specs.batteryCapacityKwh} kWh | {m.specs.realWorldCityRangeKm} km city
                  </option>
                ))}
              </select>

              <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                <span className="text-stone-500">Telangana Net On-Road ({rtoCode}):</span>
                <span className="font-mono font-extrabold text-stone-900">
                  {formatINR(evPricing.totalTelanganaOnRoadPrice)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Equivalent Petrol Benchmark
                </label>
                <span className="text-[10px] font-semibold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-md">
                  12% TG Road Tax
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-stone-900 block">
                    {benchmark.modelName}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {benchmark.classComparison} • {petrolMileage} km/L
                  </span>
                </div>
                <span className="text-sm font-extrabold font-mono text-stone-900">
                  ~{formatINR(benchmark.petrolOnRoadTG)}
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                <span className="text-stone-500">Petrol Price in Hyderabad:</span>
                <span className="font-mono font-bold text-stone-900">
                  ₹{petrolPrice.toFixed(2)}/L
                </span>
              </div>
            </div>
          </div>

          {/* Power & Torque Matchup */}
          <div className="p-3.5 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center text-white shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Power &amp; Torque Matchup:
                </span>
                <span className="text-[11px] text-stone-400 block">
                  {benchmark.powerComparisonSummary}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-400 uppercase block">EV Output</span>
                <span className="font-bold text-white">{evBhp} bhp • {evTorque} Nm</span>
              </div>
              <div className="text-left sm:text-right border-l border-stone-700 pl-3">
                <span className="text-[10px] text-stone-400 uppercase block">Petrol Output</span>
                <span className="font-bold text-stone-300">{benchmark.petrolBhp} bhp • {benchmark.petrolTorqueNm} Nm</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Running Cost / km
              </span>
              <div className="space-y-1 my-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Petrol ({benchmark.modelName.split(' ')[0]}):</span>
                  <span className="font-mono font-bold text-stone-800">
                    ₹{(savingsResult.petrolFuelCostPerKm || (petrolPrice / petrolMileage)).toFixed(2)}/km
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">EV ({activeModel.brand}):</span>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{(savingsResult.evPowerCostPerKm || 0.25).toFixed(2)}/km
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                <span className="text-stone-600 font-semibold">Monthly Saving:</span>
                <span className="font-mono font-bold text-stone-900">
                  {formatINR(savingsResult.monthlySavings)}/mo
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Monthly Cash Saved
              </span>
              <div className="text-2xl font-black text-stone-900 font-mono tracking-tight my-1">
                {formatINR(savingsResult.monthlySavings)}<span className="text-xs font-normal text-stone-500"> / mo</span>
              </div>
              <p className="text-[11px] text-stone-600">
                {formatINR(savingsResult.annualSavings)} saved every year on fuel
              </p>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                <span className="text-stone-600 font-semibold">5-Yr Operational:</span>
                <span className="font-mono font-bold text-stone-900">
                  {formatINR(savingsResult.fiveYearSavings)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Breakeven Payback
              </span>
              <div className="text-2xl font-black text-stone-900 font-mono tracking-tight my-1">
                {savingsResult.paybackFormatted || `${savingsResult.paybackPeriodMonths} Months`}
              </div>
              <p className="text-[11px] text-stone-600">
                Recovers {formatINR(Math.max(0, evPricing.totalTelanganaOnRoadPrice - benchmark.petrolOnRoadTG))} upfront difference
              </p>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                <span className="text-stone-600 font-semibold">Annual Net Benefit:</span>
                <span className="font-mono font-bold text-stone-900">
                  {formatINR(savingsResult.totalAnnualNetSavings)}/yr
                </span>
              </div>
            </div>
          </div>

          {/* Commute Sliders */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-600" />
                Adjust Your Commute &amp; Power Tariff Parameters:
              </span>
              <span className="text-xs font-mono font-bold text-stone-900">
                {dailyKm * daysPerMonth} km / month
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-600">Daily Commute:</span>
                  <span className="font-mono font-bold text-stone-900">{dailyKm} km / day</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={dailyKm}
                  onChange={(e) => setDailyKm(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-600">Petrol Mileage:</span>
                  <span className="font-mono font-bold text-stone-900">{petrolMileage} km / L</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="70"
                  step="1"
                  value={petrolMileage}
                  onChange={(e) => setPetrolMileage(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-600">TSSPDCL Rate:</span>
                  <span className="font-mono font-bold text-stone-900">₹{electricityRate.toFixed(2)} / kWh</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="11.0"
                  step="0.25"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>
            </div>
          </div>

          {/* 5-Year TCO Bar Chart */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              5-Year Total Cost of Ownership (50,000 km Commute)
            </h4>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-semibold">{benchmark.modelName} (Petrol):</span>
                <span className="font-mono font-bold text-stone-900">
                  {formatINR(petrolTCO)}
                </span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-stone-700 rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                Upfront: {formatINR(benchmark.petrolOnRoadTG)} + Recurring Fuel &amp; Maintenance
              </span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-600 font-semibold">{activeModel.brand} {activeModel.name} (EV):</span>
                <span className="font-mono font-bold text-stone-900">
                  {formatINR(evTCO)}
                </span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-stone-900 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, Math.round((evTCO / petrolTCO) * 100))}%` 
                  }} 
                />
              </div>
              <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                Upfront: {formatINR(evPricing.totalTelanganaOnRoadPrice)} (₹0 Road Tax) + Low Power Costs
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-stone-200 bg-stone-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openPriceModal(activeModel.id)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
            >
              Telangana Tax Breakdown
            </button>
            <button
              onClick={() => openRangeModal(activeModel.id)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
            >
              Summer Range Sim
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied Summary' : 'Copy Full ROI Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculatorModal;
