import React, { useState, useEffect, useCallback } from 'react';
import type { EVModel } from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { calculateTelanganaOnRoadPrice, formatINR } from '../utils/priceCalculator';
import { explainFeature } from '../data/featureKnowledge';
import { shareComparison } from '../utils/shareCard';
import { getBrandSource } from '../data/brandSources';
import { EV_CATALOG_LAST_UPDATED } from '../data/catalogMeta';
import { LeadFormModal } from './LeadFormModal';
import { DealerStockPanel } from './DealerStockPanel';
import { trackEvent } from '../utils/analytics';
import { VehicleImage } from './VehicleImage';
import { ResaleForecastCard } from './ResaleForecastCard';
import { OwnerReportsPanel } from './OwnerReportsPanel';
import { ColourVisualizerModal } from './ColourVisualizerModal';
import {
  X,
  Check,
  Zap,
  Share2,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Expand,
  Palette
} from 'lucide-react';

export interface VehicleDetailModalProps {
  model?: EVModel | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  model: propModel,
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const {
    activeDetailModalModel,
    closeDetail,
    setActivePriceModalModel,
    setIsRangeSimulatorModalOpen,
    setSimulatorModel,
    addToCompare,
    removeFromCompare,
    isCompared,
    openTechModal,
    openRoutePlanner,
    selectedDistrict,
    selectedRtoCode
  } = useCompare();

  const model = propModel !== undefined ? propModel : activeDetailModalModel;
  const isOpen = propIsOpen !== undefined ? propIsOpen : Boolean(activeDetailModalModel);
  const handleClose = useCallback(() => {
    if (propOnClose) propOnClose();
    else closeDetail();
  }, [propOnClose, closeDetail]);

  const [activeTab, setActiveTab] = useState<'overview' | 'benchmark' | 'battery' | 'performance' | 'tech' | 'pros-cons'>('overview');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [isColourVisualizerOpen, setIsColourVisualizerOpen] = useState(false);
  const prevTitleRef = React.useRef<string | null>(null);
  const prevCanonicalRef = React.useRef<string | null>(null);

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

  // Keep share/crawl metadata in sync with the open vehicle (ref tracks original, not intermediate A→B)
  useEffect(() => {
    if (!isOpen || !model) return;
    trackEvent('view_model', { model: model.id });
    if (prevTitleRef.current === null) prevTitleRef.current = document.title;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (prevCanonicalRef.current === null) prevCanonicalRef.current = canonical?.href ?? null;
    document.title = `${model.brand} ${model.name} On-Road Price Hyderabad — EV Compare TG`;
    if (canonical) canonical.href = `${window.location.origin}/bikes/${model.id}/`;
    return () => {
      // Only restore when fully closing, not switching A→B
      // Defer check to next tick to see if another model opened
      setTimeout(() => {
        const stillOpen = document.querySelector('[role="dialog"]');
        if (!stillOpen && prevTitleRef.current !== null) {
          document.title = prevTitleRef.current;
          prevTitleRef.current = null;
        }
        if (!stillOpen && prevCanonicalRef.current !== null && canonical) {
          canonical.href = prevCanonicalRef.current;
          prevCanonicalRef.current = null;
        }
      }, 0);
    };
  }, [isOpen, model]);

  if (!isOpen || !model) return null;

  const compared = isCompared(model.id);
  const priceBreakdown = calculateTelanganaOnRoadPrice(model, selectedRtoCode || selectedDistrict.rtoCode);
  const selectedColor = model.colorOptions && model.colorOptions.length > 0
    ? (model.colorOptions[selectedColorIndex] || model.colorOptions[0])
    : { name: 'Standard', hex: '#111827' };

  const evBhp = Math.round(model.specs.motorPeakPowerKw * 1.341 * 10) / 10;
  const evTorque = model.specs.motorPeakTorqueNm || 25;

  const benchmark = model.equivalentPetrolBenchmark || {
    modelName: model.category === 'motorcycle' ? 'Hero Splendor Plus / Pulsar 125' : 'Honda Activa 6G (110cc)',
    engineCc: model.category === 'motorcycle' ? 125 : 110,
    petrolBhp: model.category === 'motorcycle' ? 10.8 : 7.8,
    petrolTorqueNm: model.category === 'motorcycle' ? 11.0 : 8.9,
    petrolMileageKmpl: model.category === 'motorcycle' ? 55 : 45,
    petrolExShowroom: model.category === 'motorcycle' ? 85000 : 78000,
    petrolOnRoadTG: model.category === 'motorcycle' ? 102000 : 94000,
    classComparison: model.category === 'motorcycle' ? 'Commuter Motorcycle' : '110cc Commuter Scooter',
    powerComparisonSummary: 'Standard ICE Benchmark'
  };

  const handleShare = async () => {
    setIsCopied(true);
    try {
      await shareComparison([model], selectedRtoCode);
    } finally {
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto bg-stone-900/60 backdrop-blur-md animate-fadeIn text-stone-900 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:pt-4 sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[100dvh] sm:max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-stone-50/90 border-b border-stone-200 backdrop-blur-md flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{model.brand}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                  {model.category === 'motorcycle' ? '🏍️ Motorcycle' : '🛵 Scooter'}
                </span>
              </div>
              <h2 id="detail-modal-title" className="text-base sm:text-lg font-extrabold text-stone-900 leading-tight truncate">
                {model.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {!model.isIceBenchmark && (
              <button
                type="button"
                onClick={() => setIsLeadOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-full bg-milestone hover:bg-[#0077ed] text-white text-xs font-semibold transition cursor-pointer"
              >
                <span>Book Test Ride</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
              <span>{isCopied ? 'Shared' : 'WhatsApp'}</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 border-b border-stone-200 bg-stone-50/50 flex gap-2 overflow-x-auto scrollbar-none text-xs">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'benchmark', label: '⚡ EV vs ⛽ Petrol Benchmark' },
            { key: 'battery', label: 'Battery & Charging' },
            { key: 'performance', label: 'Motor & Dynamics' },
            { key: 'tech', label: 'Features & Tech' },
            { key: 'pros-cons', label: 'Pros & Cons' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-3.5 min-h-[44px] font-bold border-b-2 whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeTab === tab.key
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6">
                  <button
                    type="button"
                    onClick={() => setIsColourVisualizerOpen(true)}
                    className="group relative h-64 w-full rounded-2xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center p-2 cursor-pointer hover:border-quartzite hover:shadow-md transition text-left"
                    aria-label={`Open colour visualizer — ${selectedColor.name} — ${model.colorOptions?.length ?? 0} colours`}
                  >
                    <VehicleImage
                      model={model}
                      colorName={selectedColorIndex > 0 ? selectedColor?.name : null}
                      className="w-full h-full pointer-events-none"
                      objectFit="contain"
                    />
                    {selectedColor && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ink text-[11px] font-semibold px-2.5 py-1 rounded-lg z-10 border border-stone-200">
                        {selectedColor.name}
                        <span className="text-[9px] text-stone-400 ml-1.5">indicative</span>
                      </span>
                    )}
                    <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/90 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition">
                      <Expand className="w-3 h-3" />
                      Expand
                    </span>
                    <div className="absolute bottom-3 left-3 bg-ink/90 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg z-10">
                      {model.isIceBenchmark
                        ? '109.5cc Petrol ICE'
                        : `${model.specs.batteryCapacityKwh} kWh • ${model.specs.batteryChemistry}`}
                    </div>
                  </button>

                  {model.colorOptions && model.colorOptions.length > 0 && (
                    <div className="mt-3 px-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-stone-500">
                          Colour ({selectedColorIndex + 1} of {model.colorOptions.length}):{' '}
                          <strong className="text-stone-900">{selectedColor.name}</strong>
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap">
                          Manufacturer option
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {model.colorOptions.map((c, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedColorIndex(idx)}
                            aria-label={`Colour ${idx + 1}: ${c.name}`}
                            aria-pressed={selectedColorIndex === idx}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                            className={`w-8 h-8 min-h-[44px] min-w-[44px] rounded-full border cursor-pointer transition shrink-0 flex items-center justify-center ${
                              selectedColorIndex === idx ? 'border-stone-900 ring-2 ring-milestone scale-110' : 'border-stone-300 hover:border-stone-400'
                            }`}
                          />
                        ))}
                        <button
                          type="button"
                          onClick={() => setIsColourVisualizerOpen(true)}
                          className="ml-1 inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-full bg-paper border border-quartzite text-ink text-xs font-semibold hover:bg-white hover:border-stone-300 transition cursor-pointer"
                        >
                          <Palette className="w-3.5 h-3.5 text-stone-500" />
                          View all colours
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-6 space-y-4">
                  <p className="text-sm text-stone-600 font-medium leading-relaxed">
                    {model.tagline}
                  </p>

                  {(() => {
                    const source = getBrandSource(model.brand);
                    return (
                      <p className="text-[11px] text-stone-400">
                        {source ? (
                          <a href={source} target="_blank" rel="noopener noreferrer" className="hover:text-milestone underline decoration-stone-300 underline-offset-2">
                            Source: {model.brand} official specifications ↗
                          </a>
                        ) : (
                          <span>Source: {model.brand} official specifications</span>
                        )}
                        {' '}· verified {EV_CATALOG_LAST_UPDATED}
                      </p>
                    );
                  })()}

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                      <span>Telangana Net On-Road Price:</span>
                      <span className="font-bold text-stone-800 bg-stone-200 px-2 py-0.5 rounded">₹0 Road Tax</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-stone-900">
                      {formatINR(priceBreakdown.totalTelanganaOnRoadPrice)}
                    </div>
                    <span className="text-xs text-stone-500 block mt-1">
                      Save {formatINR(priceBreakdown.savingsFromTelanganaPolicy)} under G.O. Ms No. 41 in Telangana
                    </span>
                  </div>

                  {/* Dealer Stock Near You */}
                  <DealerStockPanel
                    model={model}
                    rtoCode={selectedRtoCode || selectedDistrict.rtoCode}
                  />

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 text-[10px] uppercase font-bold block">Real City Range</span>
                      <span className="text-base font-extrabold text-stone-900 font-mono">{model.specs.realWorldCityRangeKm} km</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 text-[10px] uppercase font-bold block">Top Speed</span>
                      <span className="text-base font-extrabold text-stone-900 font-mono">{model.specs.topSpeedKmh} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED EV VS PETROL BENCHMARK */}
          {activeTab === 'benchmark' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Class Matchup</span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {model.brand} {model.name} vs {benchmark.modelName}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {benchmark.powerComparisonSummary}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-stone-800 px-3 py-1.5 rounded-xl text-stone-200 border border-stone-700">
                  {benchmark.classComparison}
                </span>
              </div>

              <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
                <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase">
                      <th className="p-3.5">Metric</th>
                      <th className="p-3.5 bg-stone-100 font-extrabold text-stone-900">⚡ {model.name} (EV)</th>
                      <th className="p-3.5">⛽ {benchmark.modelName} (Petrol)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-xs">
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-stone-700">Peak Power</td>
                      <td className="p-3.5 bg-stone-50/50 font-bold text-stone-900">{model.specs.motorPeakPowerKw} kW ({evBhp} bhp)</td>
                      <td className="p-3.5 text-stone-700">{benchmark.petrolBhp} bhp ({benchmark.engineCc}cc)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-stone-700">Peak Torque</td>
                      <td className="p-3.5 bg-stone-50/50 font-bold text-stone-900">{evTorque} Nm (Instant)</td>
                      <td className="p-3.5 text-stone-700">{benchmark.petrolTorqueNm} Nm @ high RPM</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-stone-700">0-40 km/h Sprint</td>
                      <td className="p-3.5 bg-stone-50/50 font-bold text-stone-900">{model.specs.accel0To40Kmh}s</td>
                      <td className="p-3.5 text-stone-700">~3.5s–4.5s (Gear clutch lag)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-stone-700">Running Cost / km</td>
                      <td className="p-3.5 bg-stone-50/50 font-bold text-stone-900">~₹0.25 / km (TSSPDCL)</td>
                      <td className="p-3.5 text-stone-700">~₹2.40–₹3.90 / km (₹109.66/L)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-stone-700">Telangana Road Tax</td>
                      <td className="p-3.5 bg-stone-50/50 font-bold text-stone-900">₹0 (100% Tax Free G.O. 41)</td>
                      <td className="p-3.5 text-stone-700">12% Life Tax (~₹12k–₹35k)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-stone-700">5-Yr Total Ownership Cost</td>
                      <td className="p-3.5 bg-stone-50/50 font-bold text-stone-900">Significantly lower TCO</td>
                      <td className="p-3.5 text-stone-700">Heavy recurring fuel bills</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BATTERY & CHARGING */}
          {activeTab === 'battery' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">Battery Capacity &amp; Chemistry</span>
                <span className="text-lg font-bold font-mono text-stone-900 block">{model.specs.batteryCapacityKwh} kWh</span>
                <span className="text-stone-600">{model.specs.batteryChemistry} ({model.specs.isRemovableBattery ? 'Removable Pack' : 'Fixed Floor Pack'})</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">0-80% Home Charging</span>
                <span className="text-lg font-bold font-mono text-stone-900 block">{model.specs.chargingTime0To80}</span>
                <span className="text-stone-600">Standard 15A domestic socket compatible</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">Fast Charging Network</span>
                <span className="text-lg font-bold font-mono text-stone-900 block">{model.specs.fastChargingSupport ? 'Supported' : 'Standard Home Only'}</span>
                <span className="text-stone-600">{model.specs.fastChargingRate}</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">Battery Warranty</span>
                <span className="text-lg font-bold font-mono text-stone-900 block">{model.warranty.batteryYears} Years / {model.warranty.batteryKm.toLocaleString()} km</span>
                <span className="text-stone-600">OEM manufacturer direct warranty coverage</span>
              </div>
            </div>
          )}

          {/* TAB 4: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">Peak &amp; Rated Motor Power</span>
                <span className="text-lg font-bold font-mono text-stone-900 block">{model.specs.motorPeakPowerKw} kW ({evBhp} bhp)</span>
                <span className="text-stone-600">Rated: {model.specs.motorRatedPowerKw} kW</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">Acceleration (0-40 km/h)</span>
                <span className="text-lg font-bold font-mono text-stone-900 block">{model.specs.accel0To40Kmh} seconds</span>
                <span className="text-stone-600">Top Speed: {model.specs.topSpeedKmh} km/h</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">Braking &amp; Safety</span>
                <span className="text-sm font-bold text-stone-900 block">{model.specs.brakes}</span>
                <span className="text-stone-600">{model.specs.brakingSafety || 'Combined Braking System'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-1">Riding Modes</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {model.specs.ridingModes.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 font-semibold text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TECH & FEATURES */}
          {activeTab === 'tech' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 uppercase font-bold block mb-2">Display &amp; Connected Telematics</span>
                <p className="font-bold text-stone-900 text-sm mb-2">{model.specs.displayType || 'Digital Display'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {model.specs.connectivity.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 font-semibold text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-900 uppercase font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>🔬 Engineering Architecture Deep-Dive</span>
                  </span>
                  <button
                    onClick={() => {
                      openTechModal();
                      handleClose();
                    }}
                    className="text-xs font-bold text-stone-900 hover:underline cursor-pointer"
                  >
                    Open EV Tech Guide ➔
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Battery Chemistry</span>
                    <span className="font-bold text-stone-900">{model.specs.batteryChemistry}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {model.specs.batteryChemistry?.toUpperCase().includes('LFP')
                        ? 'Thermal runaway safe for 45°C Telangana summers with 2,000+ cycle life.'
                        : 'High volumetric energy density delivering longer range in a compact pack.'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Drivetrain &amp; Motor</span>
                    <span className="font-bold text-stone-900">
                      {model.specs.driveType ? `${model.specs.driveType} Drive` : 'Direct Drive'} • {model.specs.motorRatedPowerKw} kW Rated
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {model.specs.driveType === 'Belt'
                        ? 'Carbon-reinforced synchronous belt requiring zero chain lube or messy oiling.'
                        : 'High-torque direct power delivery tuned for instant throttle response.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-quartzite">
                <span className="text-stone-500 uppercase font-semibold block mb-3">Key Manufacturer Highlights</span>
                <ul className="space-y-3">
                  {model.features.map((f, idx) => {
                    const why = explainFeature(f);
                    return (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-milestone shrink-0 mt-0.5" />
                        <div>
                          <span className="text-stone-800 font-medium text-xs">{f}</span>
                          {why && (
                            <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">{why}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <ResaleForecastCard model={model} />
            </div>
          )}

          {/* Collapsible Resale & Battery Forecast — visible across all tabs */}
          <details className="rounded-2xl bg-white border border-stone-200 overflow-hidden group">
            <summary className="flex items-center justify-between px-4 py-3 bg-stone-50/70 cursor-pointer list-none select-none">
              <span className="text-xs font-bold text-ink flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-signal" />
                3-Year Resale & Battery Forecast — Telangana Heat (32°C avg)
              </span>
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white border border-stone-200 text-stone-600 group-open:rotate-180 transition">
                ⌄
              </span>
            </summary>
            <div className="p-4 border-t border-stone-200">
              <ResaleForecastCard model={model} />
            </div>
          </details>

          {/* Owner Real-World Range Reports — collapsible, below resale card */}
          <details className="rounded-2xl bg-white border border-stone-200 overflow-hidden group">
            <summary className="flex items-center justify-between px-4 py-3 bg-stone-50/70 cursor-pointer list-none select-none">
              <span className="text-xs font-bold text-ink flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-milestone" />
                Owner Real-World Range Reports — {model.name}
              </span>
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white border border-stone-200 text-stone-600 group-open:rotate-180 transition">
                ⌄
              </span>
            </summary>
            <div className="p-4 border-t border-stone-200">
              <OwnerReportsPanel model={model} />
            </div>
          </details>

          {/* TAB 6: PROS & CONS */}
          {activeTab === 'pros-cons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-3 text-sm">
                  <ThumbsUp className="w-4 h-4 text-stone-900" />
                  <span>Key Advantages (Pros)</span>
                </div>
                <ul className="space-y-2">
                  {model.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0 mt-1.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-3 text-sm">
                  <ThumbsDown className="w-4 h-4 text-stone-600" />
                  <span>Points to Consider (Cons)</span>
                </div>
                <ul className="space-y-2">
                  {model.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0 mt-1.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:px-6 border-t border-stone-200 bg-stone-50/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActivePriceModalModel(model);
                handleClose();
              }}
              className="px-3.5 py-2.5 min-h-[44px] rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
            >
              On-Road Price Breakdown
            </button>
            <button
              onClick={() => {
                setSimulatorModel(model);
                setIsRangeSimulatorModalOpen(true);
                handleClose();
              }}
              className="px-3.5 py-2.5 min-h-[44px] rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
            >
              Range Simulator
            </button>
            {!model.isIceBenchmark && (
              <button
                onClick={() => {
                  openRoutePlanner(model.id);
                  handleClose();
                }}
                className="px-3.5 py-2.5 min-h-[44px] rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
              >
                ⚡ Highway Route Simulation
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (compared) removeFromCompare(model.id);
              else addToCompare(model.id);
            }}
            className="px-5 py-2.5 min-h-[44px] rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {compared ? 'In Comparison Tray ✓' : '+ Add to Compare'}
          </button>
        </div>
      </div>

      <LeadFormModal
        isOpen={isLeadOpen}
        onClose={() => setIsLeadOpen(false)}
        modelId={model.id}
        modelName={`${model.brand} ${model.name}`}
        rtoCode={selectedRtoCode || selectedDistrict.rtoCode}
      />

      <ColourVisualizerModal
        isOpen={isColourVisualizerOpen}
        onClose={() => setIsColourVisualizerOpen(false)}
        model={model}
        initialColourIndex={selectedColorIndex}
      />
    </div>
  );
};

export default VehicleDetailModal;
