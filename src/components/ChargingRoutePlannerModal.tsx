import React, { useState, useMemo } from 'react';
import {
  X,
  Zap,
  MapPin,
  Navigation,
  BatteryCharging,
  Search,
  ExternalLink,
  Compass,
  Layers,
  CheckCircle2,
  Sliders
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-md animate-fadeIn text-neutral-900"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-50/90 border-b border-neutral-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                  Telangana EV Charging Hub &amp; Highway Route Planner
                </h2>
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800">
                  5 Corridors • 50+ Stations
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Fast charging network across Hyderabad, Nehru ORR, and 5 inter-district highway corridors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/70 p-2 gap-2">
          <button
            onClick={() => setActiveTab('route_planner')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'route_planner'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🛣️ Highway Corridor Route Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-white/80'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>📍 Telangana Charging Stations ({TELANGANA_CHARGING_STATIONS.length})</span>
          </button>
        </div>

        {/* TAB 1: HIGHWAY ROUTE PLANNER */}
        {activeTab === 'route_planner' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {/* Control Panel: Vehicle & Corridor Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              {/* Vehicle Select */}
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Select EV Two-Wheeler</span>
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl bg-white border border-neutral-300 p-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer"
                >
                  {allEvs.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.name} ({v.specs.batteryCapacityKwh} kWh)
                    </option>
                  ))}
                </select>
              </div>

              {/* Corridor Select */}
              <div className="sm:col-span-5 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Select Telangana Highway Corridor</span>
                </label>
                <select
                  value={selectedCorridorId}
                  onChange={(e) => setSelectedCorridorId(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl bg-white border border-neutral-300 p-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer"
                >
                  {allCorridors.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalDistanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              {/* Cruising Style */}
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Riding Speed Profile</span>
                </label>
                <select
                  value={riderStyle}
                  onChange={(e) => setRiderStyle(e.target.value as any)}
                  className="w-full text-xs font-semibold rounded-xl bg-white border border-neutral-300 p-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer"
                >
                  <option value="eco_cruising">Eco (55 km/h) - High Range</option>
                  <option value="balanced">Balanced (65 km/h) - Recommended</option>
                  <option value="fast_expressway">Expressway (75+ km/h)</option>
                </select>
              </div>
            </div>

            {/* Route Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Corridor Distance
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-neutral-900 mt-0.5">
                  {routePlan.totalDistanceKm} <span className="text-xs font-sans text-neutral-500 font-semibold">km</span>
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  {currentCorridor.highwayCode} Highway
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Hwy Range / Charge
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-neutral-900 mt-0.5">
                  {routePlan.highwayRangeKm} <span className="text-xs font-sans text-neutral-500 font-semibold">km</span>
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  Cruising efficiency
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Required Stops
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-neutral-900 mt-0.5">
                  {routePlan.requiredStopsCount} <span className="text-xs font-sans text-neutral-500 font-semibold">stop{routePlan.requiredStopsCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  {routePlan.estimatedTotalChargingTimeMinutes} min charging
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Total Travel Time
                </div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-neutral-900 mt-0.5">
                  {Math.floor(routePlan.estimatedTotalTravelTimeMinutes / 60)}h {routePlan.estimatedTotalTravelTimeMinutes % 60}m
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  Est. Fuel: ₹{routePlan.totalEstimatedChargingCostInr}
                </div>
              </div>
            </div>

            {/* Feasibility Summary Banner */}
            <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {routePlan.isFeasibleNonStop ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
              </div>
              <div className="text-xs sm:text-sm font-medium text-neutral-800 leading-relaxed">
                {routePlan.routeSummaryText}
              </div>
            </div>

            {/* Step-by-Step Waypoint & Charging Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-700" />
                <span>Corridor Waypoints &amp; Charging Station Timeline</span>
              </h3>

              <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
                {currentCorridor.waypoints.map((wp, idx) => {
                  const matchingStop = routePlan.stops.find(s => s.distanceFromStartKm === wp.distanceFromStartKm);
                  const isStart = idx === 0;
                  const isEnd = idx === currentCorridor.waypoints.length - 1;

                  return (
                    <div key={wp.id} className="relative group">
                      {/* Timeline Node */}
                      <div
                        className={`absolute -left-7 top-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-transform ${
                          matchingStop
                            ? 'bg-neutral-900 border-neutral-300 text-white shadow-xs'
                            : isStart || isEnd
                            ? 'bg-neutral-900 border-neutral-300 text-white'
                            : 'bg-white border-neutral-300 text-neutral-700'
                        }`}
                      >
                        {matchingStop ? '⚡' : idx + 1}
                      </div>

                      {/* Waypoint Card */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          matchingStop
                            ? 'bg-neutral-50 border-neutral-300 shadow-sm'
                            : 'bg-white border-neutral-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-900">
                              {wp.name}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 rounded-md border border-neutral-200">
                              KM {wp.distanceFromStartKm}
                            </span>
                          </div>
                          {matchingStop && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-900 bg-neutral-200 px-2.5 py-0.5 rounded-full">
                              <BatteryCharging className="w-3.5 h-3.5" />
                              Required Charging Stop (~{matchingStop.chargingDurationMinutes} mins)
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-neutral-500 mt-1">
                          {wp.description}
                        </p>

                        {/* Stop Details Box if charging */}
                        {matchingStop && (
                          <div className="mt-3 p-3.5 rounded-xl bg-white border border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Charging Hub</span>
                              <div className="font-bold text-neutral-900 mt-0.5">
                                {matchingStop.station.name}
                              </div>
                              <div className="text-[11px] text-neutral-600 font-medium">
                                {matchingStop.station.network} ({matchingStop.station.maxPowerKw} kW)
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Battery Top-Up</span>
                              <div className="font-bold font-mono text-neutral-900 mt-0.5">
                                {matchingStop.batteryArrivalPercent}% ➔ {matchingStop.batteryDeparturePercent}% (+{matchingStop.chargeGainedKwh} kWh)
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                Stop Duration: ~{matchingStop.chargingDurationMinutes} mins (₹{matchingStop.estimatedCostInr})
                              </div>
                            </div>

                            <div className="flex sm:justify-end items-center">
                              {matchingStop.station.googleMapsUrl && (
                                <a
                                  href={matchingStop.station.googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs"
                                >
                                  <span>Directions</span>
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
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Key Landmarks Along {currentCorridor.highwayCode}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentCorridor.popularScenicSpots.map((spot, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white text-neutral-800 border border-neutral-200 font-medium"
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
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {/* Search & Filter Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by area, highway, landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none"
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
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none"
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
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:outline-none"
                >
                  <option value="all">🔌 All Connectors</option>
                  <option value="CCS2_DC">CCS2 Fast DC</option>
                  <option value="ATHER_GRID">Ather Grid</option>
                  <option value="OLA_HYPERCHARGER">Ola Hypercharger</option>
                  <option value="STANDARD_15A">15A Socket</option>
                  <option value="TYPE_2_AC">Type 2 AC</option>
                </select>
              </div>
            </div>

            {/* Station List Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Showing <strong className="text-neutral-900 font-bold">{filteredStations.length}</strong> verified stations</span>
                {selectedNetwork !== 'all' || selectedDistrict !== 'all' || selectedConnector !== 'all' || searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedNetwork('all');
                      setSelectedDistrict('all');
                      setSelectedConnector('all');
                    }}
                    className="text-neutral-900 underline font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredStations.map(station => (
                  <div
                    key={station.id}
                    className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800 border border-neutral-200">
                            {station.network}
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 mt-1">
                            {station.name}
                          </h4>
                          <p className="text-xs text-neutral-500">
                            {station.cityOrHighway} • {station.district}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 shrink-0">
                          {station.maxPowerKw} kW
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2">
                        {station.address}
                      </p>

                      {/* Connectors & Pricing */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {station.connectors.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[11px] rounded-md bg-neutral-50 text-neutral-700 font-medium border border-neutral-200"
                          >
                            🔌 {c.type.replace('_', ' ')} ({c.powerKw} kW) - {c.pricePerUnit}
                          </span>
                        ))}
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {station.amenities.map((a, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded"
                          >
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-[11px] text-neutral-500 font-medium">
                        {station.is24x7 ? '🟢 24x7 Open' : '🟡 Daytime Hours'}
                      </span>
                      {station.googleMapsUrl && (
                        <a
                          href={station.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs"
                        >
                          <span>Directions</span>
                          <ExternalLink className="w-3.5 h-3.5" />
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
