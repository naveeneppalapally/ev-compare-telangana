import React from 'react';
import { useCompare } from '../context/CompareContext';
import { 
  RotateCcw, 
  Battery, 
  Zap, 
  Briefcase, 
  Check
} from 'lucide-react';
import { formatINR } from '../utils/priceCalculator';

interface FilterBarProps {
  sortBy: string;
  setSortBy: (val: string) => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ sortBy, setSortBy, resultCount }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    activeFilterBadge,
    setActiveFilterBadge,
    priceRangeMax,
    setPriceRangeMax,
    minRealRangeKm,
    setMinRealRangeKm,
    requireRemovableBattery,
    setRequireRemovableBattery,
    requireFastCharging,
    setRequireFastCharging,
    resetFilters
  } = useCompare();

  const isFiltered =
    selectedCategory !== 'all' ||
    activeFilterBadge !== null ||
    priceRangeMax < 400000 ||
    minRealRangeKm > 0 ||
    requireRemovableBattery ||
    requireFastCharging;

  return (
    <div className="bg-slate-900/80 border-y border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Row: Category Tabs & Result Count & Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Two-Wheelers
            </button>
            <button
              onClick={() => setSelectedCategory('scooter')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === 'scooter'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛵 Scooters
            </button>
            <button
              onClick={() => setSelectedCategory('motorcycle')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === 'motorcycle'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏍️ Motorcycles
            </button>
          </div>

          {/* Sort Selector & Results Count */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-medium text-slate-400">
              Showing <span className="text-emerald-400 font-bold">{resultCount}</span> bikes
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="recommended">⭐ Recommended / Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="range-desc">Real Range: High to Low</option>
                <option value="speed-desc">Top Speed: High to Low</option>
                <option value="battery-desc">Battery Capacity: High to Low</option>
              </select>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Feature Toggles & Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 items-center">
          {/* Quick Feature Toggle Buttons */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setRequireRemovableBattery(!requireRemovableBattery)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                requireRemovableBattery
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Battery className="w-3.5 h-3.5 text-cyan-400" />
              <span>Removable Battery (Apartment)</span>
              {requireRemovableBattery && <Check className="w-3 h-3 text-cyan-400" />}
            </button>

            <button
              onClick={() => setRequireFastCharging(!requireFastCharging)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                requireFastCharging
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fast Charging Support</span>
              {requireFastCharging && <Check className="w-3 h-3 text-amber-400" />}
            </button>

            <button
              onClick={() => {
                if (activeFilterBadge === '30L+ Boot') {
                  setActiveFilterBadge(null);
                } else {
                  setActiveFilterBadge('30L+ Boot');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                activeFilterBadge === '30L+ Boot'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Big Boot (30L+)</span>
              {activeFilterBadge === '30L+ Boot' && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>

          {/* Sliders */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Max Budget Slider */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Max Budget:</span>
                <span className="text-emerald-400 font-bold font-mono">{formatINR(priceRangeMax)}</span>
              </div>
              <input
                type="range"
                min="80000"
                max="400000"
                step="5000"
                value={priceRangeMax}
                onChange={(e) => setPriceRangeMax(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Min Real Range Slider */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Min Real Range:</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {minRealRangeKm > 0 ? `${minRealRangeKm} km` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={minRealRangeKm}
                onChange={(e) => setMinRealRangeKm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
