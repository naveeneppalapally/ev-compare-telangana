import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  EVModel, 
  RidingModeType, 
  RiderLoadType, 
  TrafficConditionType, 
  WeatherConditionType, 
  TerrainType 
} from '../types/ev';
import { useCompare } from '../context/CompareContext';
import { simulateRange } from '../utils/rangeSimulator';
import { VehicleImage } from './VehicleImage';
import { 
  X, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle
} from 'lucide-react';

export interface RangeSimulatorModalProps {
  model?: EVModel | null;
  isOpen?: boolean;
  onClose?: () => void;
  initialCommuteKm?: number;
}

export const RangeSimulatorModal: React.FC<RangeSimulatorModalProps> = ({
  model: propModel,
  isOpen: propIsOpen,
  onClose: propOnClose,
  initialCommuteKm = 35
}) => {
  const {
    simulatorModel,
    isRangeModalOpen,
    closeRangeModal,
    models,
    setSimulatorModel,
    openPriceModal,
    openSavingsModal,
    toggleCompare,
    isCompared
  } = useCompare();

  const activeModel = propModel !== undefined ? propModel : (simulatorModel || models.find(m => !m.isIceBenchmark) || models[0]);
  const isOpen = propIsOpen !== undefined ? propIsOpen : isRangeModalOpen;
  const handleClose = useCallback(() => {
    if (propOnClose) propOnClose();
    else closeRangeModal();
  }, [propOnClose, closeRangeModal]);

  const [selectedId, setSelectedId] = useState<string>(activeModel?.id || models[0]?.id || 'ather-rizta-z-37');

  const [mode, setMode] = useState<RidingModeType>('city');
  const [payload, setPayload] = useState<RiderLoadType>('solo');
  const [traffic, setTraffic] = useState<TrafficConditionType>('city_stop_go');
  const [temperature, setTemperature] = useState<WeatherConditionType>('ideal');
  const [terrain, setTerrain] = useState<TerrainType>('flat');
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(initialCommuteKm);

  useEffect(() => {
    if (activeModel?.id) {
      setSelectedId(activeModel.id);
    }
  }, [activeModel?.id]);

  const currentEV = useMemo(() => {
    return models.find(m => m.id === selectedId) || activeModel || models[0];
  }, [models, selectedId, activeModel]);

  const supportsHyper = useMemo(() => {
    if (!currentEV) return false;
    const modes = (currentEV.specs.ridingModes || []).map(m => m.toLowerCase());
    return modes.some(m => 
      m.includes('hyper') || 
      m.includes('warp') || 
      m.includes('ballistic') || 
      m.includes('havoc') || 
      m.includes('rush') ||
      m.includes('track')
    );
  }, [currentEV]);

  useEffect(() => {
    if (mode === 'hyper' && !supportsHyper) {
      setMode('city');
    }
  }, [supportsHyper, mode]);

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

  const simResult = useMemo(() => {
    if (!currentEV) return null;
    return simulateRange(currentEV, {
      mode,
      payload,
      traffic,
      temperature,
      terrain,
      commuteDistanceKm
    });
  }, [currentEV, mode, payload, traffic, temperature, terrain, commuteDistanceKm]);

  if (!isOpen || !currentEV || !simResult) return null;

  const compared = isCompared(currentEV.id);
  const percentageRetention = Math.round((simResult.estimatedRangeKm / currentEV.specs.araiRangeKm) * 100);
  const isCommutePossible = simResult.estimatedRangeKm >= commuteDistanceKm;
  const reserveRemaining = Math.max(0, Math.round(((simResult.estimatedRangeKm - commuteDistanceKm) / simResult.estimatedRangeKm) * 100));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-md animate-fadeIn text-neutral-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="range-modal-title"
    >
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-50/90 border-b border-neutral-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 id="range-modal-title" className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                Real-World Range &amp; Weather Simulator
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                Physics-based battery range estimation for Telangana conditions
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Top Vehicle Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 flex items-center gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900">
                <VehicleImage
                  model={currentEV}
                  className="w-full h-full"
                  aspectRatio="1/1"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{currentEV.brand}</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900">{currentEV.name}</h3>
                <p className="text-xs text-neutral-500">
                  {currentEV.isIceBenchmark
                    ? '109.5cc Petrol Engine'
                    : `${currentEV.specs.batteryCapacityKwh} kWh • ${currentEV.specs.batteryChemistry}`}
                </p>
              </div>
            </div>

            <div className="md:col-span-6 flex items-center justify-end">
              <div className="w-full sm:w-72">
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                  Change EV Model:
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => {
                    setSelectedId(e.target.value);
                    const selected = models.find(m => m.id === e.target.value);
                    if (selected) setSimulatorModel(selected);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer"
                >
                  {models.filter(m => !m.isIceBenchmark).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.name} ({m.specs.batteryCapacityKwh} kWh)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Primary Result Gauge Banner */}
          <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Estimated Real-World Range Under Selected Conditions
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white">
                  {simResult.estimatedRangeKm}
                </span>
                <span className="text-lg font-bold text-neutral-400">km / full charge</span>
              </div>
              <span className="text-xs text-neutral-400 block mt-1">
                ARAI Certified: {currentEV.specs.araiRangeKm} km ({percentageRetention}% retention)
              </span>
            </div>

            {/* Commute Feasibility Status */}
            <div className="p-3.5 rounded-xl bg-neutral-800 border border-neutral-700 max-w-xs text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-neutral-200">
                {isCommutePossible ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {isCommutePossible ? 'Daily Commute Feasible' : 'Requires Mid-Day Top-Up'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {isCommutePossible
                  ? `Leaves ~${reserveRemaining}% reserve after your ${commuteDistanceKm} km round-trip`
                  : `Deficit of ${Math.round(commuteDistanceKm - simResult.estimatedRangeKm)} km for ${commuteDistanceKm} km commute`}
              </p>
            </div>
          </div>

          {/* 5 Physics Simulation Condition Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <label className="font-bold text-neutral-700 block mb-2">1. Riding Mode</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['eco', 'city', 'sport', ...(supportsHyper ? ['hyper' as RidingModeType] : [])] as RidingModeType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-1.5 px-2 rounded-lg font-bold text-xs capitalize transition cursor-pointer ${
                      mode === m
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <label className="font-bold text-neutral-700 block mb-2">2. Passenger Payload</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'solo' as RiderLoadType, label: 'Solo (70 kg)' },
                  { key: 'with_pillion' as RiderLoadType, label: 'Dual (+65 kg)' },
                  { key: 'heavy_luggage' as RiderLoadType, label: 'Heavy + Cargo' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPayload(key)}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-xs transition cursor-pointer ${
                      payload === key
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <label className="font-bold text-neutral-700 block mb-2">3. Climate / Temperature</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'ideal' as WeatherConditionType, label: 'Ideal (25°C)' },
                  { key: 'telangana_heat' as WeatherConditionType, label: 'Summer (42°C)' },
                  { key: 'rainy' as WeatherConditionType, label: 'Monsoon Rain' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTemperature(key)}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-xs transition cursor-pointer ${
                      temperature === key
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <label className="font-bold text-neutral-700 block mb-2">4. Traffic Condition</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'city_stop_go' as TrafficConditionType, label: 'City Stop & Go' },
                  { key: 'fast_highway' as TrafficConditionType, label: 'Open Highway' },
                  { key: 'mixed' as TrafficConditionType, label: 'Mixed Urban' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTraffic(key)}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-xs transition cursor-pointer ${
                      traffic === key
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <label className="font-bold text-neutral-700 block mb-2">5. Route Terrain</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'flat' as TerrainType, label: 'Flat Plains' },
                  { key: 'flyovers' as TerrainType, label: 'Flyovers & Hills' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTerrain(key)}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-xs transition cursor-pointer ${
                      terrain === key
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex justify-between mb-2">
                <label className="font-bold text-neutral-700">6. Daily Commute Target</label>
                <span className="font-mono font-bold text-neutral-900">{commuteDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={commuteDistanceKm}
                onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-neutral-200 bg-neutral-50/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openPriceModal(currentEV.id)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-bold transition cursor-pointer"
            >
              On-Road Price Breakdown
            </button>
            <button
              onClick={() => openSavingsModal(currentEV.id)}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-bold transition cursor-pointer"
            >
              Petrol vs EV Savings
            </button>
          </div>

          <button
            onClick={() => toggleCompare(currentEV.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
              compared
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white'
            }`}
          >
            {compared ? 'In Comparison Tray ✓' : '+ Add to Compare'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RangeSimulatorModal;
