import React, { useState } from 'react';
import type { EVModel } from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { calculateTelanganaOnRoadPrice, formatINR } from '../utils/priceCalculator';
import { VehicleImage } from './VehicleImage';
import { TechTooltip } from './TechTooltip';
import { explainFeature } from '../data/featureKnowledge';
import { EMI_ANNUAL_RATE, EMI_DOWN_PAYMENT_RATIO, EMI_TENURE_MONTHS } from '../data/catalogMeta';
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
  Navigation
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
    openTechModal,
    openRoutePlanner,
    selectedRtoCode
  } = useCompare();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const compared = isCompared(model.id);
  const pricingBreakdown = calculateTelanganaOnRoadPrice(model, selectedRtoCode);

  // Approximate 36-month EMI with 15% down payment at 9.5% interest
  const loanPrincipal = pricingBreakdown.totalTelanganaOnRoadPrice * (1 - EMI_DOWN_PAYMENT_RATIO);
  const monthlyRate = EMI_ANNUAL_RATE / 12;
  const tenureMonths = EMI_TENURE_MONTHS;
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
          ? 'border-ink ring-2 ring-ink/10 shadow-md'
          : 'border-quartzite hover:border-stone-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-xl'
      }`}
    >
      {/* 1. Header: Brand, Badges & Compare Toggle */}
      <div className="p-4 pb-0 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ink text-white shrink-0 max-w-[110px] truncate">
            {model.brand}
          </span>
          {model.badges.slice(0, 1).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-white text-stone-700 border border-quartzite shadow-sm truncate max-w-[130px]"
              title={explainFeature(badge) ?? badge}
            >
              <span className="truncate">{badge}</span>
            </span>
          ))}
          {model.specs.isRemovableBattery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-milestone/10 text-milestone border border-milestone/20 shrink-0 truncate max-w-[110px]">
              Removable
            </span>
          )}
        </div>

        {/* Compare Checkbox Button */}
        <button
          type="button"
          onClick={() => toggleCompare(model.id)}
          className={`flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
            compared
              ? 'bg-stone-900 text-white hover:bg-stone-800'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
          }`}
          title={compared ? 'Remove from comparison' : 'Add to comparison'}
          aria-pressed={compared}
        >
          {compared ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-stone-500" />
              <span>+ Compare</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Model Name & Tagline */}
      <div className="px-4 pt-3">
        <h3 className="text-base font-bold tracking-tight">
          <button
            type="button"
            onClick={() => openDetail(model.id)}
            className="text-stone-900 group-hover:text-stone-600 transition cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          >
            {model.name}
          </button>
        </h3>
        <p className="text-xs text-stone-500 font-medium truncate mt-0.5">
          {model.tagline}
        </p>
      </div>

      {/* 3. Image Container with Authentic Photo & Resilient Fallback */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${model.brand} ${model.name} full specifications`}
        className="relative my-3 mx-4 h-44 rounded-xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center group/img cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        onClick={() => openDetail(model.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetail(model.id);
          }
        }}
      >
        <VehicleImage
          model={model}
          colorName={selectedColorIdx > 0 ? model.colorOptions?.[selectedColorIdx]?.name : null}
          className="w-full h-full"
          objectFit="contain"
          imageClassName="group-hover/img:scale-105 transition-transform duration-300"
        />

        {/* Battery Capacity Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm border border-stone-200 text-[11px] font-mono font-bold text-stone-900 shadow-xs z-10">
          <Battery className="w-3.5 h-3.5 text-stone-700" />
          <span>
            {model.isIceBenchmark
              ? '109.5cc Petrol ICE'
              : `${model.specs.batteryCapacityKwh} kWh • ${model.specs.batteryChemistry}`}
          </span>
        </div>

        {/* Quick View Tag on Hover */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-900 text-white text-xs font-bold shadow-md z-10">
          <span>Specs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 4. Color Swatches — every manufacturer colour, labelled */}
      {model.colorOptions && model.colorOptions.length > 0 && (
        <div className="px-4 pb-2 flex items-center justify-between gap-2">
          <span className="text-[10px] text-stone-500 font-medium truncate max-w-[140px]">
            <span className="font-semibold text-stone-800">{model.colorOptions[selectedColorIdx]?.name}</span>
            <span className="text-stone-400"> · {model.colorOptions.length} colours</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
            {model.colorOptions.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                style={{ backgroundColor: color.hex }}
                aria-label={`Colour ${idx + 1}: ${color.name}`}
                aria-pressed={selectedColorIdx === idx}
                title={color.name}
                className={`w-7 h-7 min-h-[28px] min-w-[28px] rounded-full border cursor-pointer transition shrink-0 ${
                  selectedColorIdx === idx ? 'border-ink ring-2 ring-milestone scale-110' : 'border-stone-300 hover:border-stone-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Range Comparison Meter */}
      <div className="px-3.5 py-2.5 mx-4 mb-2.5 rounded-xl bg-stone-50 border border-stone-200">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-stone-600 text-[11px] font-semibold flex items-center gap-1">
            <Gauge className="w-3 h-3 text-stone-700" />
            Real Hyderabad City Range:
          </span>
          <span className="font-mono font-bold text-stone-900 text-xs">
            {model.specs.realWorldCityRangeKm} km
          </span>
        </div>

        {/* Progress meter comparing real city to ARAI — milestone tip marks the honest figure */}
        <div
          role="progressbar"
          aria-label="Real range as a percentage of ARAI claimed range"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rangeRatioPercent}
          className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden flex"
        >
          <div
            className="h-full bg-ink rounded-full relative min-w-[6px]"
            style={{ width: `${rangeRatioPercent}%` }}
          >
            <span aria-hidden="true" className="absolute right-0 top-0 h-full w-1 bg-milestone" />
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
          <span>Highway: {model.specs.realWorldHighwayRangeKm} km</span>
          <span>ARAI Claimed: {model.specs.araiRangeKm} km</span>
        </div>
      </div>

      {/* 6. Key 4 Spec Grid */}
      <div className="px-4 grid grid-cols-2 gap-2 text-xs">
        {/* Top Speed */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 text-[10px] font-bold block uppercase tracking-wider">Top Speed</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-stone-900 font-mono">
              {model.specs.topSpeedKmh}
            </span>
            <span className="text-[10px] text-stone-500">km/h</span>
            <span className="text-[10px] text-stone-500 font-mono ml-auto">({model.specs.accel0To40Kmh}s)</span>
          </div>
        </div>

        {/* Home Charging */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 text-[10px] font-bold block uppercase tracking-wider">0-80% Home Charge</span>
          <div className="flex items-center gap-1 font-mono font-semibold text-stone-800 text-xs mt-0.5">
            <Timer className="w-3 h-3 text-stone-600 shrink-0" />
            <span className="truncate">{model.specs.chargingTime0To80}</span>
          </div>
        </div>

        {/* Motor Power */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 text-[10px] font-bold block uppercase tracking-wider">Peak Motor</span>
          <div className="font-mono font-semibold text-stone-800 text-xs mt-0.5">
            {model.specs.motorPeakPowerKw} kW ({Math.round(model.specs.motorPeakPowerKw * 1.341)} bhp)
          </div>
        </div>

        {/* Utility Space */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-stone-500 text-[10px] font-bold block uppercase tracking-wider">
            {model.category === 'scooter' ? 'Boot Capacity' : 'Ground Clearance'}
          </span>
          <div className="flex items-center gap-1 font-mono font-semibold text-stone-800 text-xs mt-0.5">
            <Briefcase className="w-3 h-3 text-stone-600 shrink-0" />
            <span>
              {model.category === 'scooter'
                ? `${model.specs.bootSpaceLiters} Liters`
                : `${model.specs.groundClearanceMm} mm`}
            </span>
          </div>
        </div>
      </div>

      {/* 5.5. Contextual Technology Highlights */}
      {!model.isIceBenchmark && (
        <div className="px-4 mb-2 flex flex-wrap gap-1.5 items-center">
          {/* Battery Chemistry */}
          {model.specs.batteryChemistry?.toUpperCase().includes('LFP') && (
            <TechTooltip
              topicId="tech-lfp-vs-nmc"
              label="🛡️ LFP Summer Safe"
              onOpenTopicModal={openTechModal}
            />
          )}
          {model.specs.batteryChemistry?.toUpperCase().includes('NMC') && (
            <TechTooltip
              topicId="tech-lfp-vs-nmc"
              label="⚡ NMC High-Density"
              onOpenTopicModal={openTechModal}
            />
          )}

          {/* Onboard vs Fast Charging */}
          {['matter-aera-5000-plus'].includes(model.id) && (
            <TechTooltip
              topicId="tech-onboard-charger"
              label="🔌 Built-in Onboard 5A"
              onOpenTopicModal={openTechModal}
            />
          )}
          {model.specs.fastChargingSupport && (
            <TechTooltip
              topicId="tech-ccs2-fast-charging"
              label="⚡ Fast-Charge"
              onOpenTopicModal={openTechModal}
            />
          )}

          {/* Liquid Cooling */}
          {['matter-aera-5000-plus'].includes(model.id) && (
            <TechTooltip
              topicId="tech-liquid-cooling"
              label="❄️ Liquid Cooled"
              onOpenTopicModal={openTechModal}
            />
          )}

          {/* Motor / Drivetrain */}
          {model.specs.driveType === 'Belt' && (
            <TechTooltip
              topicId="tech-mid-drive-vs-hub"
              label="⚙️ Carbon Belt Drive"
              onOpenTopicModal={openTechModal}
            />
          )}
          {['matter-aera-5000-plus'].includes(model.id) && (
            <TechTooltip
              topicId="tech-manual-gearbox-ev"
              label="🕹️ 4-Speed Gearbox"
              onOpenTopicModal={openTechModal}
            />
          )}

          {/* ABS */}
          {model.specs.brakingSafety?.toLowerCase().includes('abs') && (
            <TechTooltip
              topicId="tech-dual-channel-abs"
              label="🛑 ABS Braking"
              onOpenTopicModal={openTechModal}
            />
          )}
        </div>
      )}

      {/* 7. Telangana On-Road Price */}
      <div className="mt-1 mx-4 p-3 rounded-xl bg-paper border border-quartzite">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-stone-500 font-medium">On-road in Telangana</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-signal bg-signal/10 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            ₹0 Road Tax
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold text-ink tracking-tight">
            {formatINR(pricingBreakdown.totalTelanganaOnRoadPrice)}
          </span>
          <span className="text-[11px] text-stone-500 font-medium">{selectedRtoCode}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-600 mt-2 pt-2 border-t border-quartzite/80">
          <span className="text-stone-600">
            EMI ~<span className="font-mono font-medium">{formatINR(approxMonthlyEmi)}</span>/mo
          </span>
          <span className="text-signal font-semibold">
            Save ~{formatINR(pricingBreakdown.savingsFromTelanganaPolicy)}
          </span>
        </div>
      </div>

      {/* 8. Card Action CTAs */}
      <div className="p-4 pt-3 mt-auto space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => openDetail(model.id)}
            className="flex items-center justify-center gap-1 min-h-[44px] py-3 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span>Full Specs</span>
          </button>

          <button
            onClick={() => openPriceModal(model.id)}
            className="flex items-center justify-center gap-1 min-h-[44px] py-3 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Price Details</span>
          </button>
        </div>

        {!model.isIceBenchmark && (
          <button
            onClick={() => openRoutePlanner(model.id)}
            className="w-full flex items-center justify-center gap-1.5 min-h-[44px] py-3 px-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200 text-xs font-semibold transition cursor-pointer"
            title="Plan highway route across Telangana with this vehicle"
          >
            <Navigation className="w-3.5 h-3.5 text-stone-700 shrink-0" />
            <span className="truncate">Plan Highway Route ({model.specs.realWorldHighwayRangeKm} km Hwy)</span>
          </button>
        )}
      </div>
    </div>
  );
};
