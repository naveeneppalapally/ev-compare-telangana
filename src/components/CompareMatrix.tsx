import React, { useState, useEffect } from 'react';
import { useCompare } from '../context/CompareContext';
import { calculateTelanganaOnRoadPrice, formatINR } from '../utils/priceCalculator';
import { shareComparison } from '../utils/shareCard';
import { VehicleImage } from './VehicleImage';
import { 
  Scale, 
  X, 
  Check, 
  Share2
} from 'lucide-react';
import type { EVModel } from '../types/ev';

export const CompareMatrix: React.FC = () => {
  const {
    models,
    selectedCompareIds,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    closeCompare,
    selectedRtoCode,
    addToCompare
  } = useCompare();

  const [highlightDiffs, setHighlightDiffs] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCompareOpen) {
        closeCompare();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareOpen, closeCompare]);

  if (!isCompareOpen) return null;

  const comparedVehicles = selectedCompareIds
    .map((id) => models.find((m) => m.id === id))
    .filter(Boolean) as EVModel[];

  const handleShare = async () => {
    setCopiedUrl(true);
    try {
      await shareComparison(comparedVehicles, selectedRtoCode);
    } finally {
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  // Quick Preset Handlers
  const applyPreset = (ids: string[]) => {
    clearCompare();
    ids.forEach(id => addToCompare(id));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-900/60 backdrop-blur-md overflow-hidden text-stone-900 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-matrix-title"
    >
      <div className="relative w-full max-w-7xl h-[94vh] bg-white border border-stone-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="compare-matrix-title" className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  Electric Two-Wheeler Comparison Matrix
                </h2>
                <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-[10px] font-bold text-stone-800">
                  {comparedVehicles.length} of 4 Selected
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Verified specifications with Telangana ₹0 road tax calculation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightDiffs(!highlightDiffs)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                highlightDiffs
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <span>Diff Highlight</span>
              {highlightDiffs && <Check className="w-3 h-3 text-white" />}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedUrl ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={closeCompare}
              className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Intra-Brand & Segment Presets Bar */}
        <div className="px-6 py-2.5 bg-stone-100/70 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-stone-500 font-bold uppercase text-[10px] shrink-0">
            Intra-Brand &amp; Segment Presets:
          </span>

          <button
            onClick={() => applyPreset(['ather-rizta-z-37', 'ather-450x-gen3-37', 'ather-apex-450'])}
            className="px-3 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-200/60 font-semibold text-stone-800 text-[11px] whitespace-nowrap transition cursor-pointer"
          >
            ⚡ Ather Family (Rizta vs 450X vs Apex)
          </button>

          <button
            onClick={() => applyPreset(['ola-s1-x-plus-30', 'ola-s1-air', 'ola-s1-pro-gen2', 'ola-roadster-pro-16'])}
            className="px-3 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-200/60 font-semibold text-stone-800 text-[11px] whitespace-nowrap transition cursor-pointer"
          >
            ⚡ Ola Lineup (S1X vs Air vs Pro vs Roadster)
          </button>

          <button
            onClick={() => applyPreset(['tvs-iqube-s-34', 'tvs-iqube-st-51', 'bajaj-chetak-premium-32', 'ather-rizta-z-37'])}
            className="px-3 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-200/60 font-semibold text-stone-800 text-[11px] whitespace-nowrap transition cursor-pointer"
          >
            🛵 Family Scooters (iQube vs Chetak vs Rizta)
          </button>

          <button
            onClick={() => applyPreset(['revolt-rv1-plus-32', 'revolt-rv400-32', 'pure-ev-ecodryft-350', 'hop-oxo-37'])}
            className="px-3 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-200/60 font-semibold text-stone-800 text-[11px] whitespace-nowrap transition cursor-pointer"
          >
            🏍️ Commuter Motorcycles (Revolt vs Pure vs Hop)
          </button>

          <button
            onClick={() => applyPreset(['ultraviolette-f77-mach2', 'matter-aera-5000-plus', 'raptee-hv-t30', 'ola-roadster-pro-16'])}
            className="px-3 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-200/60 font-semibold text-stone-800 text-[11px] whitespace-nowrap transition cursor-pointer"
          >
            🚀 Hyper-Performance Bikes (&gt;120 km/h)
          </button>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto">
          {comparedVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Scale className="w-12 h-12 text-stone-300 mb-3" />
              <h3 className="text-base font-bold text-stone-800">No Vehicles in Comparison Tray</h3>
              <p className="text-xs text-stone-500 max-w-sm mt-1 mb-4">
                Add 2 to 4 electric motorcycles or scooters to compare their real range, power, and Telangana on-road pricing.
              </p>
              <button
                onClick={closeCompare}
                className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold transition hover:bg-stone-800 cursor-pointer"
              >
                Browse EV Catalog
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-white shadow-xs border-b border-stone-200">
                <tr className="divide-x divide-stone-200">
                  <th className="p-4 bg-stone-50 w-[240px] text-xs font-bold text-stone-700 uppercase">
                    Vehicle Model
                  </th>
                  {comparedVehicles.map((model) => (
                    <th key={model.id} className="p-4 bg-white min-w-[220px]">
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-white shadow-2xs p-0.5">
                          <VehicleImage
                            model={model}
                            className="w-full h-full"
                            aspectRatio="1/1"
                            objectFit="contain"
                          />
                        </div>
                        <button
                          onClick={() => removeFromCompare(model.id)}
                          className="p-1 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                          title="Remove vehicle"
                          aria-label={`Remove ${model.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{model.brand}</span>
                        <h3 className="text-sm font-black text-stone-900 leading-snug">{model.name}</h3>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-xs font-mono font-extrabold text-stone-900">
                            {formatINR(calculateTelanganaOnRoadPrice(model, selectedRtoCode).totalTelanganaOnRoadPrice)}
                          </span>
                          <span className="text-[10px] font-medium text-stone-500">On-Road TG</span>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Empty Slot Columns */}
                  {Array.from({ length: Math.max(0, 4 - comparedVehicles.length) }).map((_, idx) => (
                    <th key={`empty-${idx}`} className="p-4 bg-stone-50/50 min-w-[200px] border-dashed border-l border-stone-200 text-center">
                      <div className="h-full flex flex-col items-center justify-center p-4">
                        <span className="text-xs text-stone-400 font-semibold">+ Add Slot {comparedVehicles.length + idx + 1}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-200 text-xs">
                {/* 1. SECTION: PRICING & TELANGANA SAVINGS */}
                <tr className="bg-stone-100/70 font-bold text-stone-800">
                  <td colSpan={5} className="p-3 text-[11px] uppercase tracking-wider">
                    💰 Pricing &amp; Telangana G.O. Ms No. 41 Tax Exemption
                  </td>
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Ex-Showroom Price</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono font-bold text-stone-900">
                      {formatINR(v.pricing.exShowroom)}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Telangana Life Tax (Road Tax)</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono font-bold text-stone-900">
                      <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-900 px-2 py-0.5 rounded font-mono font-bold">
                        ₹0 (100% Exempt)
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Total Upfront Tax Savings</td>
                  {comparedVehicles.map(v => {
                    const priceRes = calculateTelanganaOnRoadPrice(v, selectedRtoCode);
                    return (
                      <td key={v.id} className="p-3.5 font-mono font-bold text-stone-900">
                        {formatINR(priceRes.savingsFromTelanganaPolicy)}
                      </td>
                    );
                  })}
                </tr>

                {/* 2. SECTION: BATTERY & RANGE */}
                <tr className="bg-stone-100/70 font-bold text-stone-800">
                  <td colSpan={5} className="p-3 text-[11px] uppercase tracking-wider">
                    🔋 Battery, Range &amp; Charging
                  </td>
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Battery Pack</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-bold text-stone-900">
                      {v.isIceBenchmark ? 'N/A' : `${v.specs.batteryCapacityKwh} kWh (${v.specs.batteryChemistry})`}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Removable Battery?</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-bold text-stone-900">
                      {v.specs.isRemovableBattery ? '✅ Yes (Removable)' : '❌ Fixed Pack'}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Real City Range (Hyderabad)</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono font-black text-stone-900 text-sm">
                      {v.specs.realWorldCityRangeKm} km
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">ARAI IDC Certified Range</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono text-stone-600">
                      {v.specs.araiRangeKm} km
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Home 0-80% Charging</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 text-stone-800">
                      {v.specs.chargingTime0To80}
                    </td>
                  ))}
                </tr>

                {/* 3. SECTION: MOTOR & PERFORMANCE */}
                <tr className="bg-stone-100/70 font-bold text-stone-800">
                  <td colSpan={5} className="p-3 text-[11px] uppercase tracking-wider">
                    ⚡ Motor Dynamics &amp; Performance
                  </td>
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Top Speed</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono font-bold text-stone-900">
                      {v.specs.topSpeedKmh} km/h
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">0 to 40 km/h Acceleration</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono text-stone-800">
                      {v.specs.accel0To40Kmh}s
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Peak Motor Power</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono text-stone-800">
                      {v.specs.motorPeakPowerKw} kW ({(v.specs.motorPeakPowerKw * 1.341).toFixed(1)} bhp)
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Instant Wheel Torque</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono text-stone-800">
                      {v.specs.motorPeakTorqueNm} Nm
                    </td>
                  ))}
                </tr>

                {/* 4. SECTION: PETROL BENCHMARK COUNTERPART */}
                <tr className="bg-stone-100/70 font-bold text-stone-800">
                  <td colSpan={5} className="p-3 text-[11px] uppercase tracking-wider">
                    ⛽ Equivalent Petrol ICE Benchmark Counterpart
                  </td>
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Petrol Counterpart Model</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-bold text-stone-900">
                      {v.equivalentPetrolBenchmark?.modelName || 'Honda Activa 6G (109.5cc)'}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Power &amp; Torque Matchup</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 text-xs text-stone-700">
                      {v.equivalentPetrolBenchmark?.powerComparisonSummary || 'EV provides superior instant acceleration'}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Petrol On-Road Price in TG</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-mono text-stone-800">
                      {v.equivalentPetrolBenchmark ? formatINR(v.equivalentPetrolBenchmark.petrolOnRoadTG) : '₹98,500'}
                    </td>
                  ))}
                </tr>

                {/* 5. SECTION: UTILITY & WARRANTY */}
                <tr className="bg-stone-100/70 font-bold text-stone-800">
                  <td colSpan={5} className="p-3 text-[11px] uppercase tracking-wider">
                    🎒 Practicality, Boot Space &amp; Warranty
                  </td>
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Underseat Boot Space</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 font-bold text-stone-900">
                      {v.specs.bootSpaceLiters ? `${v.specs.bootSpaceLiters} Liters` : 'No Underseat Boot (Motorcycle)'}
                    </td>
                  ))}
                </tr>

                <tr className="divide-x divide-stone-200 hover:bg-stone-50/50">
                  <td className="p-3.5 font-semibold text-stone-600">Battery Warranty</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3.5 text-stone-800">
                      {v.warranty.batteryYears} Years / {v.warranty.batteryKm.toLocaleString()} km
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-stone-200 bg-stone-50/90 flex items-center justify-between text-xs text-stone-500">
          <span>All technical specifications and Telangana on-road prices are verified against OEM manufacturer data sheets.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-4 py-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={closeCompare}
              className="px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold transition cursor-pointer shadow-xs"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareMatrix;
