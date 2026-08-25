import React from 'react';
import { useCompare } from '../context/CompareContext';
import { Scale, ArrowRight, X, RotateCcw, Plus } from 'lucide-react';
import { formatINR } from '../utils/priceCalculator';
import { VehicleImage } from './VehicleImage';
import type { EVModel } from '../types/ev';

export const CompareFloatingBar: React.FC = () => {
  const {
    models,
    selectedCompareIds,
    removeFromCompare,
    clearCompare,
    openCompare,
    compareLimitToast,
  } = useCompare();

  if (selectedCompareIds.length === 0) return null;

  const comparedVehicles = selectedCompareIds
    .map((id) => models.find((m) => m.id === id))
    .filter(Boolean) as EVModel[];

  const totalSlots = 4;
  const emptySlotsCount = Math.max(0, totalSlots - comparedVehicles.length);

  return (
    <div
      role="region"
      aria-label="Comparison dock"
      className="fixed bottom-4 left-0 right-0 z-30 px-4 pointer-events-none"
    >
      {compareLimitToast && (
        <div className="max-w-4xl mx-auto mb-2 pointer-events-auto">
          <div className="bg-amber-500 text-stone-900 text-xs font-semibold px-4 py-2 rounded-xl shadow-lg text-center animate-fadeIn">
            {compareLimitToast}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-stone-900 text-white border border-stone-800 rounded-2xl shadow-2xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Tray Label & Clear All */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-white">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Compare
                  </span>
                  <span className="text-[11px] font-mono font-bold text-stone-300 bg-stone-800 px-1.5 py-0.2 rounded">
                    {comparedVehicles.length}/4
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 hidden sm:block">
                  Side-by-side spec comparison
                </p>
              </div>
            </div>

            <button
              onClick={clearCompare}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-stone-400 hover:text-white transition cursor-pointer"
              title="Clear all selected vehicles"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Center: Vehicle Avatar Chips */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
            {comparedVehicles.map((model) => (
              <div
                key={model.id}
                className="group relative flex items-center gap-2 pl-1.5 pr-2 py-1 bg-stone-800 border border-stone-700 rounded-xl transition shrink-0"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-stone-700 bg-stone-900">
                  <VehicleImage
                    model={model}
                    className="w-full h-full"
                    aspectRatio="1/1"
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white truncate max-w-[100px]">
                    {model.name}
                  </p>
                  <p className="text-[10px] font-mono text-stone-300">
                    {formatINR(model.pricing.exShowroom)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCompare(model.id)}
                  className="w-5 h-5 rounded-full bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-white flex items-center justify-center transition ml-1 cursor-pointer"
                  title={`Remove ${model.name}`}
                  aria-label={`Remove ${model.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {Array.from({ length: emptySlotsCount }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="hidden md:flex items-center justify-center gap-1 px-3 py-2 border border-dashed border-stone-700 rounded-xl text-stone-500 text-[11px] font-medium shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>Slot {comparedVehicles.length + idx + 1}</span>
              </div>
            ))}
          </div>

          {/* Right: Primary Comparison Action Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={openCompare}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition bg-white hover:bg-stone-100 text-stone-900 cursor-pointer shadow-sm"
            >
              <Scale className="w-4 h-4" />
              <span>
                Compare {comparedVehicles.length}{' '}
                {comparedVehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareFloatingBar;
