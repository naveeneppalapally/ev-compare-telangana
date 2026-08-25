import React from 'react';
import { useCompare } from '../context/CompareContext';
import { VehicleCard } from './VehicleCard';
import { formatINR } from '../utils/priceCalculator';
import { 
  RotateCcw, 
  SearchX, 
  X, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

import { MAX_CATALOG_PRICE } from '../data/catalogMeta';

export const VehicleGrid: React.FC = () => {
  const {
    models,
    filteredModels,
    isCatalogLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRangeMax,
    setPriceRangeMax,
    minRealRangeKm,
    requireRemovableBattery,
    setRequireRemovableBattery,
    requireFastCharging,
    setRequireFastCharging,
    minBootSpaceLiters,
    setMinBootSpaceLiters,
    budgetUnder1L,
    setBudgetUnder1L,
    activeFilterBadge,
    setActiveFilterBadge,
    sortBy,
    setSortBy,
    resetFilters,
    openWizard
  } = useCompare();

  const totalCatalogCount = models.filter(m => !m.isIceBenchmark).length;
  const isFiltered = 
    Boolean(searchQuery) ||
    selectedCategory !== 'all' ||
    priceRangeMax < MAX_CATALOG_PRICE ||
    minRealRangeKm > 0 ||
    requireRemovableBattery ||
    requireFastCharging ||
    minBootSpaceLiters > 0 ||
    budgetUnder1L ||
    activeFilterBadge !== null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header Bar: Active Tags & Sort & Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        {/* Results Counter & Active Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-700 mr-2">
            Showing <span className="text-emerald-700 font-extrabold font-mono">{filteredModels.length}</span> of {totalCatalogCount} EVs
          </span>

          {/* Active Filter Chips with Dismiss */}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-white text-stone-800 border border-stone-300 shadow-2xs max-w-full">
              <span className="truncate max-w-[160px]">Search: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} aria-label="Remove search filter" className="hover:text-rose-600 hover:bg-stone-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs max-w-full">
              <span className="capitalize truncate max-w-[120px]">{selectedCategory}s</span>
              <button onClick={() => setSelectedCategory('all')} aria-label="Remove category filter" className="hover:text-rose-600 hover:bg-emerald-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRangeMax < MAX_CATALOG_PRICE && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-white text-stone-800 border border-stone-300 shadow-2xs max-w-full">
              <span className="truncate">Budget &le; {formatINR(priceRangeMax)}</span>
              <button onClick={() => setPriceRangeMax(MAX_CATALOG_PRICE)} aria-label="Remove budget filter" className="hover:text-rose-600 hover:bg-stone-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {requireRemovableBattery && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-2xs max-w-full">
              <span className="truncate">🔋 Removable Battery</span>
              <button onClick={() => setRequireRemovableBattery(false)} aria-label="Remove removable battery filter" className="hover:text-rose-600 hover:bg-cyan-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {requireFastCharging && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs max-w-full">
              <span className="truncate">⚡ Fast Charging</span>
              <button onClick={() => setRequireFastCharging(false)} aria-label="Remove fast charging filter" className="hover:text-rose-600 hover:bg-amber-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minBootSpaceLiters > 0 && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs max-w-full">
              <span className="truncate">🎒 Boot &gt;30L</span>
              <button onClick={() => setMinBootSpaceLiters(0)} aria-label="Remove boot space filter" className="hover:text-rose-600 hover:bg-emerald-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {budgetUnder1L && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-300 shadow-2xs max-w-full">
              <span className="truncate">💰 Budget &lt;₹1L</span>
              <button onClick={() => setBudgetUnder1L(false)} aria-label="Remove budget under 1L filter" className="hover:text-rose-600 hover:bg-purple-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeFilterBadge && (
            <span className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs max-w-full">
              <span className="truncate max-w-[140px]">Badge: {activeFilterBadge}</span>
              <button onClick={() => setActiveFilterBadge(null)} aria-label="Remove badge filter" className="hover:text-rose-600 hover:bg-amber-100 cursor-pointer min-h-[28px] min-w-[28px] p-1.5 flex items-center justify-center rounded-full -mr-1 shrink-0 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-full text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer shadow-2xs"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3 shrink-0" />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            <span>Sort:</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-stone-300 text-xs font-semibold text-stone-800 rounded-lg px-3 py-2.5 min-h-[44px] h-11 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
          >
            <option value="recommended">⭐ Recommended / Popular</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rangeDesc">Real Range: High to Low</option>
            <option value="speedDesc">Top Speed: High to Low</option>
            <option value="ratingDesc">Customer Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* 2. Responsive Card Grid */}
      {isCatalogLoading ? (
        <div className="py-16 text-center text-sm text-stone-400 font-medium">Loading catalog…</div>
      ) : filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <VehicleCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        /* 3. Zero-State Handler */
        <div className="py-16 px-4 text-center rounded-2xl bg-white border border-stone-200 max-w-xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">
            No Electric Two-Wheelers Found
          </h3>
          <p className="text-xs text-stone-500 mb-6 max-w-md mx-auto">
            No models in our catalog match your current search and filter combination. Try adjusting your budget slider or clearing specific filters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
            <button
              onClick={openWizard}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Take Smart Match Quiz</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default VehicleGrid;