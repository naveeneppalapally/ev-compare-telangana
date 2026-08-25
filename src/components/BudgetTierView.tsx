import React, { useMemo } from 'react';
import { useCompare } from '../context/CompareContext';
import { VehicleCard } from './VehicleCard';
import { 
  Scale, 
  TrendingDown, 
  Package, 
  Palette, 
  Rocket,
  ChevronRight
} from 'lucide-react';
import type { EVModel } from '../types/ev';

export const BudgetTierView: React.FC = () => {
  const { models, compareBudgetTier, selectedCategory } = useCompare();

  const tiers = useMemo(() => {
    const tierDefs = [
      {
        key: 'under1L',
        title: 'Budget Commuters (< ₹1.00 Lakh)',
        subtitle: 'Entry-level electric two-wheelers for college students & local neighborhood utility',
        icon: TrendingDown,
        filterFn: (m: EVModel) => m.pricing.exShowroom < 100000
      },
      {
        key: '1to1.4L',
        title: 'Mid-Range Daily Drivers (₹1.00L – ₹1.40L)',
        subtitle: 'Most popular segment for daily office commute with 100+ km real city range',
        icon: Package,
        filterFn: (m: EVModel) => m.pricing.exShowroom >= 100000 && m.pricing.exShowroom < 140000
      },
      {
        key: '1.4to1.8L',
        title: 'Premium Flagships (₹1.40L – ₹1.80L)',
        subtitle: 'High-spec family scooters & sporty street bikes with touchscreen navigation & fast charging',
        icon: Palette,
        filterFn: (m: EVModel) => m.pricing.exShowroom >= 140000 && m.pricing.exShowroom < 180000
      },
      {
        key: 'above1.8L',
        title: 'High-Voltage Performance (> ₹1.80L)',
        subtitle: 'Hyper-performance electric motorcycles with 150+ km/h top speed and massive battery packs',
        icon: Rocket,
        filterFn: (m: EVModel) => m.pricing.exShowroom >= 180000
      }
    ];

    return tierDefs.map(tier => {
      const vehicles = models.filter(m => {
        if (m.isIceBenchmark) return false;
        if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
        return tier.filterFn(m);
      }).sort((a, b) => a.pricing.exShowroom - b.pricing.exShowroom);

      return { ...tier, vehicles };
    }).filter(t => t.vehicles.length > 0);
  }, [models, selectedCategory]);

  return (
    <div className="space-y-12">
      {tiers.map((tier) => {
        const IconComponent = tier.icon;
        return (
          <section 
            key={tier.key}
            className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200 shadow-xs space-y-6"
          >
            {/* Tier Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                      {tier.title}
                    </h2>
                    <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-800">
                      {tier.vehicles.length} Models
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {tier.subtitle}
                  </p>
                </div>
              </div>

              {/* 1-Click Compare Tier Button */}
              {tier.vehicles.length > 1 && (
                <button
                  onClick={() => compareBudgetTier(tier.key)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare Top {Math.min(4, tier.vehicles.length)} in this Tier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Vehicle Cards Grid for this Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {tier.vehicles.map((model) => (
                <VehicleCard key={model.id} model={model} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default BudgetTierView;
