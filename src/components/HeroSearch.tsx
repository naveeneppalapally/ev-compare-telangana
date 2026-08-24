import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCompare } from '../context/CompareContext';
import { formatINR } from '../utils/priceCalculator';
import { VehicleImage } from './VehicleImage';
import { 
  Search, 
  Sparkles, 
  Scale, 
  Battery, 
  Zap, 
  Briefcase, 
  IndianRupee,
  X,
  Check,
  Building2,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const {
    models,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRangeMax,
    setPriceRangeMax,
    requireRemovableBattery,
    setRequireRemovableBattery,
    requireFastCharging,
    setRequireFastCharging,
    minBootSpaceLiters,
    setMinBootSpaceLiters,
    budgetUnder1L,
    setBudgetUnder1L,
    openWizard,
    selectedDistrict,
    selectedRtoCode,
    toggleCompare,
    openCompare,
    openDetail,
    catalogViewMode,
    setCatalogViewMode
  } = useCompare();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  // Sync external search reset during render
  if (prevSearchQuery !== searchQuery) {
    setPrevSearchQuery(searchQuery);
    setLocalSearch(searchQuery);
  }

  // 250ms Debounce on Search Query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Category counts
  const totalCount = models.filter(m => !m.isIceBenchmark).length;
  const scooterCount = models.filter(m => !m.isIceBenchmark && m.category === 'scooter').length;
  const motorcycleCount = models.filter(m => !m.isIceBenchmark && m.category === 'motorcycle').length;

  // Extract unique authentic Indian brands from catalog
  const popularBrands = useMemo(() => {
    const brandsMap = new Map<string, number>();
    for (const m of models) {
      if (!m.isIceBenchmark && m.brand) {
        brandsMap.set(m.brand, (brandsMap.get(m.brand) || 0) + 1);
      }
    }
    return Array.from(brandsMap.entries()).map(([brand, count]) => ({ brand, count }));
  }, [models]);

  const handleClear = useCallback(() => {
    setLocalSearch('');
    setSearchQuery('');
  }, [setSearchQuery]);

  const handleBrandClick = (brandName: string) => {
    if (searchQuery.toLowerCase() === brandName.toLowerCase()) {
      setSearchQuery('');
      setLocalSearch('');
    } else {
      setSearchQuery(brandName);
      setLocalSearch(brandName);
    }
  };

  // Featured Spotlight Matchup for Telangana Buyers
  const spotlightModels = useMemo(() => {
    const rizta = models.find(m => m.id === 'ather-rizta-z-37');
    const ola = models.find(m => m.id === 'ola-s1-pro-gen2');
    const iqube = models.find(m => m.id === 'tvs-iqube-s-34');
    return [rizta, ola, iqube].filter(Boolean);
  }, [models]);

  const handleQuickCompareSpotlight = () => {
    const ids = ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34'];
    ids.forEach(id => toggleCompare(id));
    openCompare();
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Left Column: Heading, Search & Telangana District Context */}
          <div className="lg:col-span-7 space-y-4">
            {/* RTO Context Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
              <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
              <span>Location: {selectedDistrict.name} ({selectedRtoCode})</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-900 font-bold">100% Tax Free</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Compare Electric Bikes <br className="hidden sm:block" />
              <span className="text-neutral-500">in Telangana</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 font-normal max-w-xl">
              Authentic manufacturer specs, Hyderabad summer range simulations, exact on-road pricing with ₹0 road tax, and verified petrol payback calculations.
            </p>

            {/* Integrated Search Bar */}
            <div className="relative flex items-center shadow-xs rounded-full bg-neutral-50 border border-neutral-300 p-1.5 focus-within:border-neutral-900 focus-within:bg-white transition max-w-xl">
              <Search className="w-4 h-4 text-neutral-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by model or brand (e.g. Ather Rizta, Ola Roadster, Ultraviolette, TVS)..."
                className="w-full bg-transparent px-3 py-1.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-medium"
              />
              {localSearch && (
                <button
                  onClick={handleClear}
                  className="text-neutral-400 hover:text-neutral-700 p-1 mr-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={openWizard}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Match</span>
              </button>
            </div>

            {/* Quick Feature Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-xl text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Catalog</span>
                <span className="text-sm font-bold text-neutral-900">41 Verified EVs</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Tax Waiver</span>
                <span className="text-sm font-bold text-neutral-900">₹0 Road Tax</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Fuel Savings</span>
                <span className="text-sm font-bold text-neutral-900">₹35,000+ / yr</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Summer Physics</span>
                <span className="text-sm font-bold text-neutral-900">42°C Range Sim</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Spotlight Matchup Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-neutral-900 p-5 text-white shadow-xl border border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Trending Matchup in Telangana
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Top 3
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-3">
                Ather Rizta Z vs Ola S1 Pro vs TVS iQube S
              </h3>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {spotlightModels.map((m) => (
                  m && (
                    <div 
                      key={m.id}
                      onClick={() => openDetail(m.id)}
                      className="group/mini p-2 rounded-xl bg-neutral-800/90 border border-neutral-700 hover:border-neutral-500 transition cursor-pointer flex flex-col"
                    >
                      <div className="h-16 rounded-lg overflow-hidden bg-white mb-1.5 flex items-center justify-center p-1 border border-neutral-700">
                        <VehicleImage 
                          model={m} 
                          className="w-full h-full"
                          objectFit="contain"
                          imageClassName="group-hover/mini:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-white truncate">{m.brand}</span>
                      <span className="text-[10px] text-neutral-400 truncate">{m.name.split('(')[0]}</span>
                      <span className="text-[10px] font-mono font-bold text-neutral-200 mt-auto pt-1">
                        {formatINR(m.pricing.exShowroom)}
                      </span>
                    </div>
                  )
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400">
                  Compare side-by-side specs &amp; on-road pricing
                </span>
                <button
                  onClick={handleQuickCompareSpotlight}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs transition cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: 3 Top Layouts */}
        <div className="mb-6 p-2 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider ml-2 hidden sm:inline">
              Catalog View:
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-neutral-200 shadow-2xs">
              <button
                onClick={() => setCatalogViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  catalogViewMode === 'grid'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All Vehicles Grid</span>
              </button>

              <button
                onClick={() => setCatalogViewMode('brands')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  catalogViewMode === 'brands'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>By Brand Showcase</span>
              </button>

              <button
                onClick={() => setCatalogViewMode('budget')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  catalogViewMode === 'budget'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                <span>By Budget Tier</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-neutral-500 font-medium mr-2">
            {catalogViewMode === 'brands' && 'Grouped by manufacturer with 1-click brand lineup compare'}
            {catalogViewMode === 'budget' && 'Grouped by realistic price bands to avoid mismatched comparisons'}
            {catalogViewMode === 'grid' && 'Interactive catalog with detailed spec filtering'}
          </div>
        </div>

        {/* OEM Manufacturer Filter Bar */}
        <div className="mb-5 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-neutral-700" />
              Filter By Manufacturer ({popularBrands.length} Brands):
            </span>
            {searchQuery && (
              <button
                onClick={handleClear}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 cursor-pointer font-semibold"
              >
                Clear Brand Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {popularBrands.map(({ brand, count }) => {
              const isSelected = searchQuery.toLowerCase() === brand.toLowerCase();
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandClick(brand)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
                >
                  <span>{brand}</span>
                  <span className={`ml-1 text-[10px] px-1 py-0.2 rounded-full ${
                    isSelected ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Tabs & Budget Slider & 4 Quick Filters */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-200/70 border border-neutral-200 w-full sm:w-auto justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Models ({totalCount})
              </button>
              <button
                onClick={() => setSelectedCategory('motorcycle')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'motorcycle'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                🏍️ Motorcycles ({motorcycleCount})
              </button>
              <button
                onClick={() => setSelectedCategory('scooter')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'scooter'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                🛵 Scooters ({scooterCount})
              </button>
            </div>

            {/* Budget Slider */}
            <div className="w-full sm:w-72 bg-white p-2.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-neutral-500 font-medium">Max On-Road Budget:</span>
                <span className="font-mono font-bold text-neutral-900">{formatINR(priceRangeMax)}</span>
              </div>
              <input
                type="range"
                min="80000"
                max="450000"
                step="10000"
                value={priceRangeMax}
                onChange={(e) => setPriceRangeMax(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>
          </div>

          {/* 4 Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-200/60">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
              Quick Filters:
            </span>

            {/* 1. Removable Battery */}
            <button
              onClick={() => setRequireRemovableBattery(!requireRemovableBattery)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                requireRemovableBattery
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Battery className="w-3.5 h-3.5" />
              <span>🔋 Removable Battery</span>
              {requireRemovableBattery && <Check className="w-3 h-3" />}
            </button>

            {/* 2. Fast Charging */}
            <button
              onClick={() => setRequireFastCharging(!requireFastCharging)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                requireFastCharging
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Fast Charging &lt;60m</span>
              {requireFastCharging && <Check className="w-3 h-3" />}
            </button>

            {/* 3. Boot Space >30L */}
            <button
              onClick={() => setMinBootSpaceLiters(minBootSpaceLiters > 0 ? 0 : 30)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                minBootSpaceLiters > 0
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>🎒 Boot &gt;30L</span>
              {minBootSpaceLiters > 0 && <Check className="w-3 h-3" />}
            </button>

            {/* 4. Budget <1L */}
            <button
              onClick={() => setBudgetUnder1L(!budgetUnder1L)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                budgetUnder1L
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>💰 Budget &lt;₹1 Lakh</span>
              {budgetUnder1L && <Check className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
