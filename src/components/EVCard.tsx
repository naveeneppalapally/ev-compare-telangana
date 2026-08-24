import React from 'react';
import type { EVModel } from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { calculateTelanganaOnRoadPrice, formatINR } from '../utils/priceCalculator';
import { VehicleImage } from './VehicleImage';
import { 
  Battery, 
  Timer, 
  Briefcase, 
  Scale, 
  Check, 
  ShieldCheck, 
  Info,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface EVCardProps {
  model: EVModel;
}

export const EVCard: React.FC<EVCardProps> = ({ model }) => {
  const {
    addToCompare,
    removeFromCompare,
    isCompared,
    setActivePriceModalModel,
    setActiveDetailModalModel,
    setSimulatorModel,
    setIsRangeSimulatorModalOpen,
    selectedDistrict
  } = useCompare();

  const compared = isCompared(model.id);
  const pricingBreakdown = calculateTelanganaOnRoadPrice(model);

  return (
    <div className={`relative flex flex-col rounded-2xl transition-all duration-300 border ${
      compared
        ? 'border-emerald-500/80 bg-slate-900/90 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-500/10'
        : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-xl'
    }`}>
      {/* Top Badges & Compared Checkbox */}
      <div className="p-4 pb-0 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {model.badges.slice(0, 2).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            >
              {badge}
            </span>
          ))}
          {model.specs.isRemovableBattery && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              🔋 Removable
            </span>
          )}
        </div>

        {/* Compare Toggle Button */}
        <button
          onClick={() => (compared ? removeFromCompare(model.id) : addToCompare(model.id))}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
            compared
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
          title={compared ? 'Remove from compare' : 'Add to compare'}
        >
          {compared ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Compare</span>
            </>
          )}
        </button>
      </div>

      {/* Model Name & Tagline */}
      <div className="px-4 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400">
            {model.name}
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-medium truncate">{model.brand} • {model.tagline}</p>
      </div>

      {/* Vehicle Image / Thumbnail Banner */}
      <div className="relative my-3 mx-4 h-44 rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800/80 flex items-center justify-center group cursor-pointer"
        onClick={() => setActiveDetailModalModel(model)}
      >
        <VehicleImage
          model={model}
          className="w-full h-full"
          imageClassName="group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
        
        {/* Battery Capacity Badge overlay */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-950/85 backdrop-blur-sm border border-slate-700/80 text-xs font-mono font-semibold text-slate-200 z-10">
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {model.isIceBenchmark
              ? '109.5cc Petrol ICE'
              : `${model.specs.batteryCapacityKwh} kWh (${model.specs.batteryChemistry})`}
          </span>
        </div>

        {/* Quick View Button */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-xs font-bold shadow-md z-10">
          <span>Quick View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 4 Key Spec Pills */}
      <div className="px-4 grid grid-cols-2 gap-2 text-xs">
        {/* Real Range */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-0.5">
            <span>Real City Range</span>
            <span className="text-[10px] text-slate-500 font-mono">ARAI: {model.specs.araiRangeKm}km</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {model.specs.realWorldCityRangeKm}
            </span>
            <span className="text-[11px] text-slate-400">km / charge</span>
          </div>
        </div>

        {/* Top Speed & Acceleration */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-0.5">
            <span>Top Speed</span>
            <span className="text-[10px] text-slate-500 font-mono">0-40: {model.specs.accel0To40Kmh}s</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-cyan-400 font-mono">
              {model.specs.topSpeedKmh}
            </span>
            <span className="text-[11px] text-slate-400">km/h</span>
          </div>
        </div>

        {/* Charging Time */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-400 text-[11px] block mb-0.5">Home Charge (0-80%)</span>
          <div className="flex items-center gap-1 font-mono font-semibold text-slate-200 text-xs">
            <Timer className="w-3 h-3 text-amber-400" />
            <span>{model.specs.chargingTime0To80}</span>
          </div>
        </div>

        {/* Storage / Clearance */}
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-400 text-[11px] block mb-0.5">
            {model.category === 'scooter' ? 'Boot Storage' : 'Ground Clearance'}
          </span>
          <div className="flex items-center gap-1 font-mono font-semibold text-slate-200 text-xs">
            <Briefcase className="w-3 h-3 text-purple-400" />
            <span>
              {model.category === 'scooter'
                ? `${model.specs.bootSpaceLiters} Liters`
                : `${model.specs.groundClearanceMm} mm`}
            </span>
          </div>
        </div>
      </div>

      {/* Telangana On-Road Price Box */}
      <div className="mt-4 mx-4 p-3 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Telangana On-Road Est.</span>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            ₹0 Road Tax
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <span className="text-xl font-black text-white font-mono tracking-tight">
            {formatINR(pricingBreakdown.totalTelanganaOnRoadPrice)}
          </span>
          <span className="text-[11px] text-slate-400">
            in {selectedDistrict.name.split(' ')[0]}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/80">
          <span className="text-slate-400">Ex-showroom: {formatINR(model.pricing.exShowroom)}</span>
          <span className="text-emerald-400 font-medium">Save ~{formatINR(pricingBreakdown.savingsFromTelanganaPolicy)}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 pt-3 mt-auto grid grid-cols-2 gap-2">
        <button
          onClick={() => setActivePriceModalModel(model)}
          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition hover:border-emerald-500/40"
        >
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Price Breakdown</span>
        </button>

        <button
          onClick={() => {
            setSimulatorModel(model);
            setIsRangeSimulatorModalOpen(true);
          }}
          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition hover:border-cyan-500/40"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Range Sim</span>
        </button>
      </div>
    </div>
  );
};
