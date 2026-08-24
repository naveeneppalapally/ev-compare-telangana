import React, { useState, useMemo } from 'react';
import {
  X,
  Zap,
  MapPin,
  Navigation,
  Clock,
  BatteryCharging,
  Search,
  ExternalLink,
  Compass,
  Layers,
  CheckCircle2
} from 'lucide-react';
import {
  TELANGANA_CHARGING_STATIONS
} from '../data/telanganaChargingData';
import {
  getAllHighwayCorridors,
  getHighwayCorridorById
} from '../data/highwayCorridorsData';
import { calculateHighwayRoutePlan } from '../utils/routePlannerEngine';
import { getEVModels, getEVModelById } from '../data/evModels';
import type { EVModel } from '../types/ev';
import type { HighwayCorridor } from '../types/charging';

interface ChargingRoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicleId?: string | null;
  initialCorridorId?: string | null;
}

export const ChargingRoutePlannerModal: React.FC<ChargingRoutePlannerModalProps> = ({
  isOpen,
  onClose,
  initialVehicleId,
  initialCorridorId
}) => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'route_planner'>('route_planner');

  // Explorer State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [selectedConnector, setSelectedConnector] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Route Planner State
  const allEvs = useMemo(() => getEVModels(), []);
  const allCorridors = useMemo(() => getAllHighwayCorridors(), []);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialVehicleId || allEvs[0]?.id || 'ather-450x-gen3-37'
  );
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(
    initialCorridorId || allCorridors[0]?.id || 'corridor-hyderabad-warangal-nh163'
  );
  const [riderStyle, setRiderStyle] = useState<'eco_cruising' | 'balanced' | 'fast_expressway'>('balanced');
  const [startingBatterySoC] = useState<number>(100);

  React.useEffect(() => {
    if (initialVehicleId) {
      setSelectedVehicleId(initialVehicleId);
      setActiveTab('route_planner');
    }
  }, [initialVehicleId]);

  React.useEffect(() => {
    if (initialCorridorId) {
      setSelectedCorridorId(initialCorridorId);
      setActiveTab('route_planner');
    }
  }, [initialCorridorId]);

  if (!isOpen) return null;

  const currentVehicle: EVModel =
    getEVModelById(selectedVehicleId) || allEvs[0];
  const currentCorridor: HighwayCorridor =
    getHighwayCorridorById(selectedCorridorId) || allCorridors[0];

  // Calculate route plan
  const routePlan = calculateHighwayRoutePlan(currentVehicle, currentCorridor, {
    startingBatteryPercent: startingBatterySoC,
    riderStyle
  });

  // Filter stations for Explorer
  const filteredStations = TELANGANA_CHARGING_STATIONS.filter(station => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        station.name.toLowerCase().includes(q) ||
        station.address.toLowerCase().includes(q) ||
        station.district.toLowerCase().includes(q) ||
        station.cityOrHighway.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (selectedNetwork !== 'all' && station.network !== selectedNetwork) {
      return false;
    }
    if (selectedDistrict !== 'all' && !station.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
      return false;
    }
    if (selectedConnector !== 'all') {
      const hasConnector = station.connectors.some(c => c.type === selectedConnector);
      if (!hasConnector) return false;
    }
    return true;
  });

  const uniqueNetworks: string[] = Array.from(new Set(TELANGANA_CHARGING_STATIONS.map(s => s.network)));
  const uniqueDistricts: string[] = Array.from(new Set(TELANGANA_CHARGING_STATIONS.map(s => s.district)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Telangana EV Charging Hub & Highway Route Planner
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Live Network
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                50+ verified stations across Hyderabad, ORR, and 5 inter-district Telangana highway corridors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('route_planner')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'route_planner'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🛣️ Highway Corridor Route Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>📍 Telangana Charging Station Explorer ({TELANGANA_CHARGING_STATIONS.length} Stations)</span>
          </button>
        </div>

        {/* TAB 1: HIGHWAY ROUTE PLANNER */}
        {activeTab === 'route_planner' && (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {/* Control Panel: Vehicle & Corridor Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              {/* Vehicle Select */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Select EV Motorcycle / Scooter</span>
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {allEvs.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.brand} - {v.name} ({v.specs.batteryCapacityKwh} kWh)
                    </option>
                  ))}
                </select>
              </div>

              {/* Corridor Select */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Select Telangana Highway Corridor</span>
                </label>
                <select
                  value={selectedCorridorId}
                  onChange={(e) => setSelectedCorridorId(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {allCorridors.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalDistanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              {/* Cruising Style */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Riding Style</span>
                </label>
                <select
                  value={riderStyle}
                  onChange={(e) => setRiderStyle(e.target.value as any)}
                  className="w-full text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="eco_cruising">🌿 Eco (55 km/h) - High Range</option>
                  <option value="balanced">⚡ Balanced (65 km/h) - Recommended</option>
                  <option value="fast_expressway">🏎️ Fast Expressway (75+ km/h)</option>
                </select>
              </div>
            </div>

            {/* Route Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
                <div className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-400">
                  Total Corridor Distance
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-200">
                  {routePlan.totalDistanceKm} <span className="text-sm font-normal">km</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {currentCorridor.highwayCode} Highway
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60">
                <div className="text-[11px] font-bold uppercase text-cyan-800 dark:text-cyan-400">
                  Highway Range / Charge
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-950 dark:text-cyan-200">
                  {routePlan.highwayRangeKm} <span className="text-sm font-normal">km</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Aerodynamic cruising range
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                <div className="text-[11px] font-bold uppercase text-amber-800 dark:text-amber-400">
                  Required Charging Stops
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-200">
                  {routePlan.requiredStopsCount} <span className="text-sm font-normal">stop{routePlan.requiredStopsCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {routePlan.estimatedTotalChargingTimeMinutes} min charge time
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60">
                <div className="text-[11px] font-bold uppercase text-purple-800 dark:text-purple-400">
                  Total Travel Time
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-950 dark:text-purple-200">
                  {Math.floor(routePlan.estimatedTotalTravelTimeMinutes / 60)}h {routePlan.estimatedTotalTravelTimeMinutes % 60}m
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Est. Fuel Cost: ₹{routePlan.totalEstimatedChargingCostInr}
                </div>
              </div>
            </div>

            {/* Feasibility Alert Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                routePlan.isFeasibleNonStop
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
              }`}
            >
              {routePlan.isFeasibleNonStop ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                {routePlan.routeSummaryText}
              </div>
            </div>

            {/* Step-by-Step Waypoint & Charging Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Corridor Waypoint & Charging Station Timeline</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {currentCorridor.waypoints.map((wp, idx) => {
                  const matchingStop = routePlan.stops.find(s => s.distanceFromStartKm === wp.distanceFromStartKm);
                  const isStart = idx === 0;
                  const isEnd = idx === currentCorridor.waypoints.length - 1;

                  return (
                    <div key={wp.id} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-transform group-hover:scale-110 ${
                          matchingStop
                            ? 'bg-amber-500 border-amber-200 text-white animate-pulse'
                            : isStart || isEnd
                            ? 'bg-emerald-600 border-emerald-200 text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {matchingStop ? '⚡' : idx + 1}
                      </div>

                      {/* Waypoint Card */}
                      <div
                        className={`p-4 rounded-xl border transition-all ${
                          matchingStop
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-sm'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {wp.name}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                              KM {wp.distanceFromStartKm}
                            </span>
                          </div>
                          {matchingStop && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                              <BatteryCharging className="w-3.5 h-3.5" />
                              Required Charging Stop ({matchingStop.chargingDurationMinutes} mins)
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {wp.description}
                        </p>

                        {/* Stop Details Box if charging */}
                        {matchingStop && (
                          <div className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400">Station</span>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {matchingStop.station.name}
                              </div>
                              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                {matchingStop.station.network} ({matchingStop.station.maxPowerKw} kW)
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400">Charge Plan</span>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {matchingStop.batteryArrivalPercent}% ➔ {matchingStop.batteryDeparturePercent}% (+{matchingStop.chargeGainedKwh} kWh)
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Stop Duration: ~{matchingStop.chargingDurationMinutes} mins
                              </div>
                            </div>

                            <div className="flex sm:justify-end items-center">
                              {matchingStop.station.googleMapsUrl && (
                                <a
                                  href={matchingStop.station.googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                                >
                                  <span>Navigate</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Scenic Highlights */}
            {currentCorridor.popularScenicSpots && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Scenic Attractions Along {currentCorridor.highwayCode}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentCorridor.popularScenicSpots.map((spot, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs font-medium"
                    >
                      📍 {spot}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHARGING STATION EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
            {/* Search & Filter Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by area, highway, landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="all">⚡ All Networks ({uniqueNetworks.length})</option>
                  {uniqueNetworks.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="all">📍 All Telangana Districts</option>
                  {uniqueDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={selectedConnector}
                  onChange={(e) => setSelectedConnector(e.target.value)}
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="all">🔌 All Connectors</option>
                  <option value="CCS2_DC">CCS2 Car Fast DC</option>
                  <option value="ATHER_GRID">Ather Grid</option>
                  <option value="OLA_HYPERCHARGER">Ola Hypercharger</option>
                  <option value="STANDARD_15A">Standard 15A Socket</option>
                  <option value="TYPE_2_AC">Type 2 AC</option>
                </select>
              </div>
            </div>

            {/* Station List Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Showing <strong className="text-slate-900 dark:text-white">{filteredStations.length}</strong> verified stations</span>
                {selectedNetwork !== 'all' || selectedDistrict !== 'all' || selectedConnector !== 'all' || searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedNetwork('all');
                      setSelectedDistrict('all');
                      setSelectedConnector('all');
                    }}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStations.map(station => (
                  <div
                    key={station.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            {station.network}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                            {station.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {station.cityOrHighway} • {station.district}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-2 py-1 rounded-lg border border-cyan-200 dark:border-cyan-800">
                          {station.maxPowerKw} kW
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {station.address}
                      </p>

                      {/* Connectors & Pricing */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {station.connectors.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[11px] rounded bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            🔌 {c.type.replace('_', ' ')} ({c.powerKw} kW) - {c.pricePerUnit}
                          </span>
                        ))}
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {station.amenities.map((a, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50"
                          >
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="text-[11px] text-slate-400">
                        {station.is24x7 ? '🟢 24x7 Open' : '🟡 Daytime Hours'}
                      </span>
                      {station.googleMapsUrl && (
                        <a
                          href={station.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
