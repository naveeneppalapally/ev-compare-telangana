import React, { useState } from 'react';
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
  ChevronRight,
  Zap,
  Gauge,
  CircleDollarSign
} from 'lucide-react';

interface VehicleCardProps {
  model: EVModel;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ model }) => {
  const {
    toggleCompare,
    isCompared,
    openDetail,
    openPriceModal,
    selectedRtoCode,
    selectedDistrict
  } = useCompare();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const compared = isCompared(model.id);
  const pricingBreakdown = calculateTelanganaOnRoadPrice(model, selectedRtoCode);

  // Approximate 36-month EMI with 15% down payment at 9.5% interest
  const loanPrincipal = pricingBreakdown.totalTelanganaOnRoadPrice * 0.85;
  const monthlyRate = 0.095 / 12;
  const tenureMonths = 36;
  const approxMonthlyEmi = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  // Range comparison calculation (Real city vs ARAI)
  const rangeRatioPercent = Math.min(
    100,
    Math.round((model.specs.realWorldCityRangeKm / model.specs.araiRangeKm) * 100)
  );

  return (
    <div 
      className={`group relative flex flex-col rounded-2xl transition-all duration-300 border bg-white ${
        compared
          ? 'border-neutral-900 ring-2 ring-neutral-900/10 shadow-md'
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {/* 1. Header: Brand, Badges & Compare Toggle */}
      <div className="p-4 pb-0 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
            {model.brand}
          </span>
          {model.badges.slice(0, 1).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200"
            >
              {badge}
            </span>
          ))}
          {model.specs.isRemovableBattery && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
              🔋 Removable
            </span>
          )}
        </div>

        {/* Compare Checkbox Button */}
        <button
          onClick={() => toggleCompare(model.id)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
            compared
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
          }`}
          title={compared ? 'Remove from comparison' : 'Add to comparison'}
        >
          {compared ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-neutral-500" />
              <span>+ Compare</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Model Name & Tagline */}
      <div className="px-4 pt-3">
        <h3 
          className="text-base font-bold text-neutral-900 tracking-tight group-hover:text-neutral-600 transition cursor-pointer"
          onClick={() => openDetail(model.id)}
        >
          {model.name}
        </h3>
        <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">
          {model.tagline}
        </p>
      </div>

      {/* 3. Image Container with Authentic Photo & Resilient Fallback */}
      <div 
        className="relative my-3 mx-4 h-44 rounded-xl overflow-hidden bg-white border border-neutral-200 flex items-center justify-center group/img cursor-pointer"
        onClick={() => openDetail(model.id)}
      >
        <VehicleImage
          model={model}
          className="w-full h-full"
          objectFit="contain"
          imageClassName="group-hover/img:scale-105 transition-transform duration-300"
        />

        {/* Battery Capacity Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm border border-neutral-200 text-[11px] font-mono font-bold text-neutral-900 shadow-xs z-10">
          <Battery className="w-3.5 h-3.5 text-neutral-700" />
          <span>
            {model.isIceBenchmark
              ? '109.5cc Petrol ICE'
              : `${model.specs.batteryCapacityKwh} kWh • ${model.specs.batteryChemistry}`}
          </span>
        </div>

        {/* Quick View Tag on Hover */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 text-white text-xs font-bold shadow-md z-10">
          <span>Specs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 4. Color Swatches */}
      {model.colorOptions && model.colorOptions.length > 0 && (
        <div className="px-4 pb-2 flex items-center justify-between">
          <span className="text-[10px] text-neutral-500 font-medium truncate max-w-[170px]">
            Color: <span className="text-neutral-800 font-semibold">{model.colorOptions[selectedColorIdx]?.name}</span>
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {model.colorOptions.slice(0, 5).map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIdx(idx)}
                style={{ backgroundColor: color.hex }}
                className={`w-3.5 h-3.5 rounded-full border cursor-pointer transition ${
                  selectedColorIdx === idx ? 'border-neutral-900 ring-2 ring-neutral-400 scale-110' : 'border-neutral-300'
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Range Comparison Meter */}
      <div className="px-3.5 py-2.5 mx-4 mb-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-neutral-600 text-[11px] font-semibold flex items-center gap-1">
            <Gauge className="w-3 h-3 text-neutral-700" />
            Real Hyderabad City Range:
          </span>
          <span className="font-mono font-bold text-neutral-900 text-xs">
            {model.specs.realWorldCityRangeKm} km
          </span>
        </div>

        {/* Progress meter comparing real city to ARAI */}
        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-neutral-900 rounded-full" 
            style={{ width: `${rangeRatioPercent}%` }} 
          />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
          <span>Highway: {model.specs.realWorldHighwayRangeKm} km</span>
          <span>ARAI Claimed: {model.specs.araiRangeKm} km</span>
        </div>
      </div>

      {/* 6. Key 4 Spec Grid */}
      <div className="px-4 grid grid-cols-2 gap-2 text-xs">
        {/* Top Speed */}
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
          <span className="text-neutral-500 text-[10px] font-bold block uppercase tracking-wider">Top Speed</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-neutral-900 font-mono">
              {model.specs.topSpeedKmh}
            </span>
            <span className="text-[10px] text-neutral-500">km/h</span>
            <span className="text-[10px] text-neutral-500 font-mono ml-auto">({model.specs.accel0To40Kmh}s)</span>
          </div>
        </div>

        {/* Home Charging */}
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
          <span className="text-neutral-500 text-[10px] font-bold block uppercase tracking-wider">0-80% Home Charge</span>
          <div className="flex items-center gap-1 font-mono font-semibold text-neutral-800 text-xs mt-0.5">
            <Timer className="w-3 h-3 text-neutral-600 shrink-0" />
            <span className="truncate">{model.specs.chargingTime0To80}</span>
          </div>
        </div>

        {/* Motor Power */}
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
          <span className="text-neutral-500 text-[10px] font-bold block uppercase tracking-wider">Peak Motor</span>
          <div className="font-mono font-semibold text-neutral-800 text-xs mt-0.5">
            {model.specs.motorPeakPowerKw} kW ({Math.round(model.specs.motorPeakPowerKw * 1.341)} bhp)
          </div>
        </div>

        {/* Utility Space */}
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
          <span className="text-neutral-500 text-[10px] font-bold block uppercase tracking-wider">
            {model.category === 'scooter' ? 'Boot Capacity' : 'Ground Clearance'}
          </span>
          <div className="flex items-center gap-1 font-mono font-semibold text-neutral-800 text-xs mt-0.5">
            <Briefcase className="w-3 h-3 text-neutral-600 shrink-0" />
            <span>
              {model.category === 'scooter'
                ? `${model.specs.bootSpaceLiters} Liters`
                : `${model.specs.groundClearanceMm} mm`}
            </span>
          </div>
        </div>
      </div>

      {/* 7. Telangana On-Road Price Box */}
      <div className="mt-3 mx-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-600 font-semibold">Telangana Net On-Road:</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-800 bg-neutral-200/80 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3" />
            ₹0 Road Tax
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <span className="text-xl font-extrabold text-neutral-900 font-mono tracking-tight">
            {formatINR(pricingBreakdown.totalTelanganaOnRoadPrice)}
          </span>
          <span className="text-[11px] text-neutral-500 font-medium">
            in {selectedDistrict.name.split(' ')[0]} ({selectedRtoCode})
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-600 mt-1.5 pt-1.5 border-t border-neutral-200">
          <span className="flex items-center gap-1 text-neutral-700 font-mono font-semibold">
            <CircleDollarSign className="w-3 h-3 text-neutral-600" />
            EMI ~{formatINR(approxMonthlyEmi)}/mo
          </span>
          <span className="text-neutral-900 font-semibold">
            Save ~{formatINR(pricingBreakdown.savingsFromTelanganaPolicy)}
          </span>
        </div>
      </div>

      {/* 8. Card Action CTAs */}
      <div className="p-4 pt-3 mt-auto grid grid-cols-2 gap-2">
        <button
          onClick={() => openDetail(model.id)}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-bold transition cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-neutral-600" />
          <span>Full Specs</span>
        </button>

        <button
          onClick={() => openPriceModal(model.id)}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-white" />
          <span>Price Details</span>
        </button>
      </div>
    </div>
  );
};
