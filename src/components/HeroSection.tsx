import React from 'react';
import { useCompare } from '../context/CompareContext';
import { 
  Search, 
  Sparkles, 
  Scale, 
  TrendingUp, 
  ShieldCheck, 
  BatteryCharging, 
  IndianRupee,
  ArrowRight
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setActiveFilterBadge,
    setPriceRangeMax,
    setIsCompareModalOpen,
    setIsQuizOpen,
    setIsSavingsModalOpen,
    selectedDistrict
  } = useCompare();

  const handleQuickTag = (tag: string) => {
    if (tag === 'under-1l') {
      setPriceRangeMax(100000);
      setActiveFilterBadge('Budget Under ₹1 Lakh');
    } else if (tag === 'family') {
      setActiveFilterBadge('Family & Storage');
      setSearchQuery('Rizta');
    } else if (tag === 'motorcycle') {
      setSelectedCategory('motorcycle');
    } else if (tag === 'removable') {
      setActiveFilterBadge('Removable Battery');
    } else if (tag === 'fast-charge') {
      setActiveFilterBadge('Fast Charging Support');
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* State Banner Pill */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telangana EV Policy Active: 100% Road Tax & Registration Exempt in {selectedDistrict.name}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
            Compare The Best <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Electric Two-Wheelers
            </span>{' '}
            in Telangana
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Honest real-world range simulations, exact Telangana on-road pricing with zero road tax, and verified petrol vs EV payback timelines.
          </p>
        </div>

        {/* Search Bar & Quick CTAs */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/90 border border-slate-700/80 p-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model (e.g. Ather Rizta, Ola S1 Pro, TVS iQube, Revolt, 43L Boot)..."
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsQuizOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-md shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Match</span>
            </button>
          </div>

          {/* Quick Filter Tag Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-3 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Quick Filters:</span>
            <button
              onClick={() => handleQuickTag('under-1l')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-500 transition"
            >
              💰 Under ₹1 Lakh
            </button>
            <button
              onClick={() => handleQuickTag('family')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-500 transition"
            >
              👨‍👩‍👧 Family & Large Boot
            </button>
            <button
              onClick={() => handleQuickTag('motorcycle')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-500 transition"
            >
              🏍️ Electric Motorcycles
            </button>
            <button
              onClick={() => handleQuickTag('removable')}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-500 transition"
            >
              🔋 Removable Battery
            </button>
          </div>
        </div>

        {/* Feature Benefit Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="glass-panel-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-wider">100% Tax Free</span>
            </div>
            <p className="text-sm font-semibold text-white">₹0 TG Road Tax</p>
            <p className="text-xs text-slate-400 mt-0.5">Save ₹12k–₹24k on registration</p>
          </div>

          <div className="glass-panel-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-wider">Fuel Savings</span>
            </div>
            <p className="text-sm font-semibold text-white">₹35,000+ / Year</p>
            <p className="text-xs text-slate-400 mt-0.5">vs ₹109.66/L petrol scooters</p>
          </div>

          <div className="glass-panel-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-amber-400">
              <BatteryCharging className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-wider">Real-World Range</span>
            </div>
            <p className="text-sm font-semibold text-white">Realistic Range Sim</p>
            <p className="text-xs text-slate-400 mt-0.5">Hyderabad summer & traffic mode</p>
          </div>

          <div className="glass-panel-card p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-purple-400">
              <Scale className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-wider">Side-By-Side</span>
            </div>
            <p className="text-sm font-semibold text-white">4-Bike Compare</p>
            <p className="text-xs text-slate-400 mt-0.5">Diff highlighter & spec breakdown</p>
          </div>
        </div>

        {/* Primary Action Row */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 flex-wrap">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25"
          >
            <Scale className="w-4 h-4" />
            <span>Launch 3-Way Comparison Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSavingsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
          >
            <IndianRupee className="w-4 h-4 text-amber-400" />
            <span>Calculate Petrol vs EV Savings</span>
          </button>
        </div>
      </div>
    </section>
  );
};
