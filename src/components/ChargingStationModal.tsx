import React, { useState, useMemo } from 'react';
import { TELANGANA_CHARGING_STATIONS } from '../data/telanganaChargingStations';
import { 
  X, 
  Zap, 
  MapPin, 
  Search, 
  Clock, 
  Navigation, 
  ExternalLink
} from 'lucide-react';

export interface ChargingStationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChargingStationModal: React.FC<ChargingStationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [search, setSearch] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('All');
  const [selectedConnector, setSelectedConnector] = useState<string>('All');

  const networks = ['All', 'Ather Grid', 'Ola Hypercharger', 'Tata Power EZ Charge', 'Statiq', 'Zeon Charging', 'Jio-bp pulse'];
  const connectors = ['All', 'CCS2', 'Type 6 (Ather)', 'Bharat AC-001', '15A Standard Socket'];

  const filteredStations = useMemo(() => {
    return TELANGANA_CHARGING_STATIONS.filter((station) => {
      const matchesSearch = 
        station.name.toLowerCase().includes(search.toLowerCase()) ||
        station.locality.toLowerCase().includes(search.toLowerCase()) ||
        station.district.toLowerCase().includes(search.toLowerCase()) ||
        (station.highway && station.highway.toLowerCase().includes(search.toLowerCase()));

      const matchesNetwork = selectedNetwork === 'All' || station.network === selectedNetwork;
      const matchesConnector = selectedConnector === 'All' || station.connectorTypes.includes(selectedConnector as any);

      return matchesSearch && matchesNetwork && matchesConnector;
    });
  }, [search, selectedNetwork, selectedConnector]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-neutral-900/60 backdrop-blur-md animate-fadeIn text-neutral-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="charging-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-50/90 border-b border-neutral-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="charging-modal-title" className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                  Telangana Fast-Charging Hub Directory
                </h2>
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800">
                  {filteredStations.length} Stations Found
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Verified high-speed EV charging hubs across Hyderabad ORR &amp; Telangana National Highways
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

        {/* Filter Toolbar */}
        <div className="p-4 sm:px-6 bg-neutral-50/50 border-b border-neutral-200 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by locality, district, or highway (e.g. Gachibowli, Warangal, NH-65)..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 text-[11px] font-bold uppercase mr-1">Network:</span>
            {networks.map((net) => (
              <button
                key={net}
                onClick={() => setSelectedNetwork(net)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedNetwork === net
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {net}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 text-[11px] font-bold uppercase mr-1">Plug Type:</span>
            {connectors.map((conn) => (
              <button
                key={conn}
                onClick={() => setSelectedConnector(conn)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  selectedConnector === conn
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {conn}
              </button>
            ))}
          </div>
        </div>

        {/* Stations Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200 uppercase mb-1">
                        {station.network}
                      </span>
                      <h3 className="text-sm font-extrabold text-neutral-900 leading-tight">
                        {station.name}
                      </h3>
                    </div>
                    <span className="font-mono font-bold text-xs bg-neutral-900 text-white px-2 py-1 rounded-lg shrink-0">
                      {station.powerOutputKw} kW Fast
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 mb-3 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{station.address}</span>
                  </p>

                  {station.highway && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-[11px] font-semibold mb-3">
                      <Navigation className="w-3 h-3 text-neutral-600" />
                      <span>{station.highway}</span>
                    </div>
                  )}

                  {/* Connectors & Pricing */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-3 rounded-xl border border-neutral-100 mb-3">
                    <div>
                      <span className="text-neutral-400 block font-bold">Compatible Plugs:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {station.connectorTypes.map((c, i) => (
                          <span key={i} className="font-bold text-neutral-800 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-neutral-400 block font-bold">Tariff / Rate:</span>
                      <span className="font-mono font-extrabold text-neutral-900 mt-1 block">
                        {station.pricingPerUnit === 0 ? 'Free / OEM App' : `₹${station.pricingPerUnit.toFixed(1)} / kWh`}
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5">
                    {station.amenities.map((a, i) => (
                      <span key={i} className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-neutral-600">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{station.openHours}</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-bold text-neutral-900 hover:text-neutral-600 transition"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-neutral-200 bg-neutral-50/90 flex items-center justify-between text-xs text-neutral-500">
          <span>Official Telangana Charging Directory verified across OEM &amp; CPO network hubs.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition cursor-pointer shadow-xs"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChargingStationModal;
