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
  LayoutGrid,
  MapPin
} from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const {
    models,
    isCatalogLoading,
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
    <section className="relative overflow-hidden bg-white border-b border-quartzite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-10">
          {/* Left Column: Heading, Search & Telangana District Context */}
          <div className="lg:col-span-7 space-y-5">
            {/* RTO Context Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-quartzite text-xs font-medium text-stone-600 shadow-sm">
              <MapPin className="w-3 h-3.5 text-milestone" />
              <span className="font-mono text-[11px] tracking-wide">
                {selectedDistrict.name} · {selectedRtoCode}
              </span>
              <span className="h-3 w-px bg-quartzite" aria-hidden />
              <span className="font-semibold text-signal text-[11px] tracking-wide uppercase">100% Tax Free</span>
            </div>

            {/* Main Headline — editorial pairing: sans + serif italic */}
            <h1 className="display-headline text-4xl sm:text-5xl lg:text-[3.4rem] text-ink">
              Compare electric bikes <br className="hidden sm:block" />
              <em className="text-stone-500">in Telangana.</em>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Authentic specs, Hyderabad summer range simulations, exact on-road pricing with ₹0 road tax, and verified petrol payback.
            </p>

            {/* Integrated Search Bar */}
            <div className="relative flex items-center rounded-full bg-white border border-quartzite p-1 shadow-sm focus-within:border-milestone focus-within:ring-2 focus-within:ring-milestone/15 transition max-w-xl">
              <Search className="w-4 h-4 text-stone-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search models or brands…"
                className="w-full bg-transparent px-3 py-2 text-[14px] text-ink placeholder-stone-400 focus:outline-none"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="text-stone-400 hover:text-ink p-1 mr-1 cursor-pointer rounded-full hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={openWizard}
                className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full bg-ink hover:bg-stone-900 text-white font-semibold text-xs shadow-md hover:shadow-lg transition shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Smart Match</span>
              </button>
            </div>

            {/* Quick Feature Stats */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-3 max-w-xl text-xs">
              <div>
                <dt className="text-[11px] font-medium text-stone-500 block">Catalog</dt>
                <dd className="text-base font-bold text-ink mt-0.5">{isCatalogLoading ? '…' : `${totalCount} EVs`}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-stone-500 block">Road Tax</dt>
                <dd className="text-base font-bold text-signal mt-0.5">₹0 for EVs</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-stone-500 block">Fuel Savings</dt>
                <dd className="text-base font-bold text-ink mt-0.5">₹35,000+/yr</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-stone-500 block">Range Physics</dt>
                <dd className="text-base font-bold text-ink mt-0.5">42°C simulated</dd>
              </div>
            </dl>
          </div>

          {/* Right Column: Featured Spotlight Matchup Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white border border-quartzite shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Trending matchup
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-paper text-stone-600 border border-quartzite">
                  Top 3
                </span>
              </div>

              <p className="text-sm font-semibold text-ink mb-3">
                Ather Rizta Z vs Ola S1 Pro vs TVS iQube S
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {spotlightModels.map((m) => (
                  m && (
                    <div
                      key={m.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${m.brand} ${m.name}`}
                      onClick={() => openDetail(m.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openDetail(m.id);
                        }
                      }}
                      className="group/mini p-2 rounded-xl bg-paper border border-quartzite hover:border-stone-400 transition cursor-pointer flex flex-col"
                    >
                      <div className="h-16 rounded-lg overflow-hidden bg-white mb-1.5 flex items-center justify-center p-1 border border-quartzite">
                        <VehicleImage
                          model={m}
                          className="w-full h-full"
                          objectFit="contain"
                          imageClassName="group-hover/mini:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-ink truncate">{m.brand}</span>
                      <span className="text-[10px] text-stone-500 truncate">{m.name.split('(')[0]}</span>
                      <span className="text-[11px] font-mono font-semibold text-ink mt-auto pt-1">
                        {formatINR(m.pricing.exShowroom)}
                      </span>
                    </div>
                  )
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-quartzite">
                <span className="text-[11px] text-stone-500">
                  Specs &amp; pricing, side by side
                </span>
                <button
                  type="button"
                  onClick={handleQuickCompareSpotlight}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-milestone hover:bg-[#0077ed] text-white font-semibold text-xs transition cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: 3 Top Layouts */}
        <div className="mb-6 p-2 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider ml-2 hidden sm:inline">
              Catalog View:
            </span>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <button
                onClick={() => setCatalogViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  catalogViewMode === 'grid'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All Vehicles Grid</span>
              </button>

              <button
                onClick={() => setCatalogViewMode('brands')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  catalogViewMode === 'brands'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>By Brand Showcase</span>
              </button>

              <button
                onClick={() => setCatalogViewMode('budget')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  catalogViewMode === 'budget'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                <span>By Budget Tier</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-stone-500 font-medium mr-2">
            {catalogViewMode === 'brands' && 'Grouped by manufacturer with 1-click brand lineup compare'}
            {catalogViewMode === 'budget' && 'Grouped by realistic price bands to avoid mismatched comparisons'}
            {catalogViewMode === 'grid' && 'Interactive catalog with detailed spec filtering'}
          </div>
        </div>

        {/* OEM Manufacturer Filter Bar */}
        <div className="mb-5 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-stone-700" />
              Filter By Manufacturer ({popularBrands.length} Brands):
            </span>
            {searchQuery && (
              <button
                onClick={handleClear}
                className="text-[11px] text-stone-500 hover:text-stone-900 cursor-pointer font-semibold"
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
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  <span>{brand}</span>
                  <span className={`ml-1 text-[10px] px-1 py-0.2 rounded-full ${
                    isSelected ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Tabs & Budget Slider & 4 Quick Filters */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-stone-200/70 border border-stone-200 w-full sm:w-auto justify-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isCatalogLoading ? 'All Models' : `All Models (${totalCount})`}
              </button>
              <button
                onClick={() => setSelectedCategory('motorcycle')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'motorcycle'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Motorcycles ({motorcycleCount})
              </button>
              <button
                onClick={() => setSelectedCategory('scooter')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'scooter'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Scooters ({scooterCount})
              </button>
            </div>

            {/* Budget Slider */}
            <div className="w-full sm:w-72 bg-white p-2.5 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-stone-500 font-medium">Max On-Road Budget:</span>
                <span className="font-mono font-bold text-stone-900">{formatINR(priceRangeMax)}</span>
              </div>
              <input
                type="range"
                min="80000"
                max={Math.ceil(Math.max(...models.filter(m => !m.isIceBenchmark).map(m => m.pricing.exShowroom)) * 1.15 / 10000) * 10000}
                step="10000"
                value={priceRangeMax}
                onChange={(e) => setPriceRangeMax(Number(e.target.value))}
                aria-label="Maximum on-road budget"
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-milestone"
              />
            </div>
          </div>

          {/* 4 Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200/60">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
              Quick Filters:
            </span>

            {/* 1. Removable Battery */}
            <button
              onClick={() => setRequireRemovableBattery(!requireRemovableBattery)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                requireRemovableBattery
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Battery className="w-3.5 h-3.5" />
              <span>Removable Battery</span>
              {requireRemovableBattery && <Check className="w-3 h-3" />}
            </button>

            {/* 2. Fast Charging */}
            <button
              onClick={() => setRequireFastCharging(!requireFastCharging)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                requireFastCharging
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast Charging &lt;60m</span>
              {requireFastCharging && <Check className="w-3 h-3" />}
            </button>

            {/* 3. Boot Space >30L */}
            <button
              onClick={() => setMinBootSpaceLiters(minBootSpaceLiters > 0 ? 0 : 30)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                minBootSpaceLiters > 0
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Boot &gt;30L</span>
              {minBootSpaceLiters > 0 && <Check className="w-3 h-3" />}
            </button>

            {/* 4. Budget <1L */}
            <button
              onClick={() => setBudgetUnder1L(!budgetUnder1L)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                budgetUnder1L
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Budget &lt;₹1 Lakh</span>
              {budgetUnder1L && <Check className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
