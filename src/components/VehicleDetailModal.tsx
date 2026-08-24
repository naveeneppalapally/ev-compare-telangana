import React, { useState, useEffect, useCallback } from 'react';
import type { EVModel } from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { calculateTelanganaOnRoadPrice, formatINR } from '../utils/priceCalculator';
import { VehicleImage } from './VehicleImage';
import {
  X,
  Check,
  Zap,
  Share2,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown
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

  const handleShare = () => {
    const text = `${model.name} (${model.brand})\nTelangana On-Road Price: ${formatINR(priceBreakdown.totalTelanganaOnRoadPrice)} (₹0 Road Tax in TG)\nReal City Range: ${model.specs.realWorldCityRangeKm} km/charge\nTop Speed: ${model.specs.topSpeedKmh} km/h`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-md animate-fadeIn text-neutral-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-50/90 border-b border-neutral-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{model.brand}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                  {model.category === 'motorcycle' ? '🏍️ Motorcycle' : '🛵 Scooter'}
                </span>
              </div>
              <h2 id="detail-modal-title" className="text-base sm:text-lg font-extrabold text-neutral-900 leading-tight">
                {model.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-300 transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-neutral-900" /> : <Share2 className="w-3.5 h-3.5 text-neutral-600" />}
              <span>{isCopied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-neutral-200 bg-neutral-50/50 flex gap-2 overflow-x-auto scrollbar-none text-xs">
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
              className={`py-3 px-3.5 font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.key
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
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
                  <div className="h-64 rounded-2xl overflow-hidden bg-white border border-neutral-200 relative flex items-center justify-center p-2">
                    <VehicleImage 
                      model={model} 
                      className="w-full h-full"
                      objectFit="contain"
                    />
                    <div className="absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg z-10 border border-neutral-700">
                      {model.isIceBenchmark
                        ? '109.5cc Petrol ICE'
                        : `${model.specs.batteryCapacityKwh} kWh • ${model.specs.batteryChemistry}`}
                    </div>
                  </div>

                  {model.colorOptions && model.colorOptions.length > 0 && (
                    <div className="mt-3 flex items-center justify-between px-1">
                      <span className="text-xs text-neutral-500">
                        Color: <strong className="text-neutral-900">{selectedColor.name}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {model.colorOptions.map((c, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedColorIndex(idx)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-4 h-4 rounded-full border cursor-pointer ${
                              selectedColorIndex === idx ? 'border-neutral-900 ring-2 ring-neutral-400 scale-110' : 'border-neutral-300'
                            }`}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-6 space-y-4">
                  <p className="text-sm text-neutral-600 font-medium leading-relaxed">
                    {model.tagline}
                  </p>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                      <span>Telangana Net On-Road Price:</span>
                      <span className="font-bold text-neutral-800 bg-neutral-200 px-2 py-0.5 rounded">₹0 Road Tax</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-neutral-900">
                      {formatINR(priceBreakdown.totalTelanganaOnRoadPrice)}
                    </div>
                    <span className="text-xs text-neutral-500 block mt-1">
                      Save {formatINR(priceBreakdown.savingsFromTelanganaPolicy)} under G.O. Ms No. 41 in Telangana
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <span className="text-neutral-500 text-[10px] uppercase font-bold block">Real City Range</span>
                      <span className="text-base font-extrabold text-neutral-900 font-mono">{model.specs.realWorldCityRangeKm} km</span>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                      <span className="text-neutral-500 text-[10px] uppercase font-bold block">Top Speed</span>
                      <span className="text-base font-extrabold text-neutral-900 font-mono">{model.specs.topSpeedKmh} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED EV VS PETROL BENCHMARK */}
          {activeTab === 'benchmark' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Class Matchup</span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {model.brand} {model.name} vs {benchmark.modelName}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {benchmark.powerComparisonSummary}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-neutral-800 px-3 py-1.5 rounded-xl text-neutral-200 border border-neutral-700">
                  {benchmark.classComparison}
                </span>
              </div>

              <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-600 uppercase">
                      <th className="p-3.5">Metric</th>
                      <th className="p-3.5 bg-neutral-100 font-extrabold text-neutral-900">⚡ {model.name} (EV)</th>
                      <th className="p-3.5">⛽ {benchmark.modelName} (Petrol)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono text-xs">
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-neutral-700">Peak Power</td>
                      <td className="p-3.5 bg-neutral-50/50 font-bold text-neutral-900">{model.specs.motorPeakPowerKw} kW ({evBhp} bhp)</td>
                      <td className="p-3.5 text-neutral-700">{benchmark.petrolBhp} bhp ({benchmark.engineCc}cc)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-neutral-700">Peak Torque</td>
                      <td className="p-3.5 bg-neutral-50/50 font-bold text-neutral-900">{evTorque} Nm (Instant)</td>
                      <td className="p-3.5 text-neutral-700">{benchmark.petrolTorqueNm} Nm @ high RPM</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-neutral-700">0-40 km/h Sprint</td>
                      <td className="p-3.5 bg-neutral-50/50 font-bold text-neutral-900">{model.specs.accel0To40Kmh}s</td>
                      <td className="p-3.5 text-neutral-700">~3.5s–4.5s (Gear clutch lag)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-neutral-700">Running Cost / km</td>
                      <td className="p-3.5 bg-neutral-50/50 font-bold text-neutral-900">~₹0.25 / km (TSSPDCL)</td>
                      <td className="p-3.5 text-neutral-700">~₹2.40–₹3.90 / km (₹109.66/L)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-neutral-700">Telangana Road Tax</td>
                      <td className="p-3.5 bg-neutral-50/50 font-bold text-neutral-900">₹0 (100% Tax Free G.O. 41)</td>
                      <td className="p-3.5 text-neutral-700">12% Life Tax (~₹12k–₹35k)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-sans font-semibold text-neutral-700">5-Yr Total Ownership Cost</td>
                      <td className="p-3.5 bg-neutral-50/50 font-bold text-neutral-900">Significantly lower TCO</td>
                      <td className="p-3.5 text-neutral-700">Heavy recurring fuel bills</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BATTERY & CHARGING */}
          {activeTab === 'battery' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">Battery Capacity &amp; Chemistry</span>
                <span className="text-lg font-bold font-mono text-neutral-900 block">{model.specs.batteryCapacityKwh} kWh</span>
                <span className="text-neutral-600">{model.specs.batteryChemistry} ({model.specs.isRemovableBattery ? 'Removable Pack' : 'Fixed Floor Pack'})</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">0-80% Home Charging</span>
                <span className="text-lg font-bold font-mono text-neutral-900 block">{model.specs.chargingTime0To80}</span>
                <span className="text-neutral-600">Standard 15A domestic socket compatible</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">Fast Charging Network</span>
                <span className="text-lg font-bold font-mono text-neutral-900 block">{model.specs.fastChargingSupport ? 'Supported' : 'Standard Home Only'}</span>
                <span className="text-neutral-600">{model.specs.fastChargingRate}</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">Battery Warranty</span>
                <span className="text-lg font-bold font-mono text-neutral-900 block">{model.warranty.batteryYears} Years / {model.warranty.batteryKm.toLocaleString()} km</span>
                <span className="text-neutral-600">OEM manufacturer direct warranty coverage</span>
              </div>
            </div>
          )}

          {/* TAB 4: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">Peak &amp; Rated Motor Power</span>
                <span className="text-lg font-bold font-mono text-neutral-900 block">{model.specs.motorPeakPowerKw} kW ({evBhp} bhp)</span>
                <span className="text-neutral-600">Rated: {model.specs.motorRatedPowerKw} kW</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">Acceleration (0-40 km/h)</span>
                <span className="text-lg font-bold font-mono text-neutral-900 block">{model.specs.accel0To40Kmh} seconds</span>
                <span className="text-neutral-600">Top Speed: {model.specs.topSpeedKmh} km/h</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">Braking &amp; Safety</span>
                <span className="text-sm font-bold text-neutral-900 block">{model.specs.brakes}</span>
                <span className="text-neutral-600">{model.specs.brakingSafety || 'Combined Braking System'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-1">Riding Modes</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {model.specs.ridingModes.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 font-semibold text-[11px]">
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
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-2">Display &amp; Connected Telematics</span>
                <p className="font-bold text-neutral-900 text-sm mb-2">{model.specs.displayType || 'Digital Display'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {model.specs.connectivity.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-neutral-200 text-neutral-800 font-semibold text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-900 uppercase font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>🔬 Engineering Architecture Deep-Dive</span>
                  </span>
                  <button
                    onClick={() => {
                      openTechModal();
                      handleClose();
                    }}
                    className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                  >
                    Open EV Tech Guide ➔
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">Battery Chemistry</span>
                    <span className="font-bold text-neutral-900">{model.specs.batteryChemistry}</span>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {model.specs.batteryChemistry?.toUpperCase().includes('LFP')
                        ? 'Thermal runaway safe for 45°C Telangana summers with 2,000+ cycle life.'
                        : 'High volumetric energy density delivering longer range in a compact pack.'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">Drivetrain &amp; Motor</span>
                    <span className="font-bold text-neutral-900">
                      {model.specs.driveType ? `${model.specs.driveType} Drive` : 'Direct Drive'} • {model.specs.motorRatedPowerKw} kW Rated
                    </span>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {model.specs.driveType === 'Belt'
                        ? 'Carbon-reinforced synchronous belt requiring zero chain lube or messy oiling.'
                        : 'High-torque direct power delivery tuned for instant throttle response.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 uppercase font-bold block mb-2">Key Manufacturer Highlights</span>
                <ul className="space-y-1.5">
                  {model.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 6: PROS & CONS */}
          {activeTab === 'pros-cons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-3 text-sm">
                  <ThumbsUp className="w-4 h-4 text-neutral-900" />
                  <span>Key Advantages (Pros)</span>
                </div>
                <ul className="space-y-2">
                  {model.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 mt-1.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-3 text-sm">
                  <ThumbsDown className="w-4 h-4 text-neutral-600" />
                  <span>Points to Consider (Cons)</span>
                </div>
                <ul className="space-y-2">
                  {model.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:px-6 border-t border-neutral-200 bg-neutral-50/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActivePriceModalModel(model);
                handleClose();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-bold transition cursor-pointer"
            >
              On-Road Price Breakdown
            </button>
            <button
              onClick={() => {
                setSimulatorModel(model);
                setIsRangeSimulatorModalOpen(true);
                handleClose();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-bold transition cursor-pointer"
            >
              Range Simulator
            </button>
            {!model.isIceBenchmark && (
              <button
                onClick={() => {
                  openRoutePlanner(model.id);
                  handleClose();
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-bold transition cursor-pointer"
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
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {compared ? 'In Comparison Tray ✓' : '+ Add to Compare'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
