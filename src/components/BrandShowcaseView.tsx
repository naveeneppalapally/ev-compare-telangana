import React, { useMemo } from 'react';
import { useCompare } from '../context/CompareContext';
import { VehicleCard } from './VehicleCard';
import { Scale, ChevronRight } from 'lucide-react';
import type { EVModel } from '../types/ev';

export const BrandShowcaseView: React.FC = () => {
  const { models, compareBrandLineup, selectedCategory } = useCompare();

  // Group models by brand
  const brandGroups = useMemo(() => {
    const map = new Map<string, EVModel[]>();
    for (const m of models) {
      if (m.isIceBenchmark) continue;
      if (selectedCategory !== 'all' && m.category !== selectedCategory) continue;

      const brand = m.brand;
      if (!map.has(brand)) map.set(brand, []);
      map.get(brand)!.push(m);
    }

    // Sort brands by number of models descending
    return Array.from(map.entries())
      .map(([brand, list]) => ({
        brand,
        vehicles: list.sort((a, b) => a.pricing.exShowroom - b.pricing.exShowroom)
      }))
      .sort((a, b) => b.vehicles.length - a.vehicles.length);
  }, [models, selectedCategory]);

  return (
    <div className="space-y-12">
      {brandGroups.map(({ brand, vehicles }) => {
        const minPrice = Math.min(...vehicles.map(v => v.pricing.exShowroom));
        const maxPrice = Math.max(...vehicles.map(v => v.pricing.exShowroom));
        const priceRangeText = minPrice === maxPrice 
          ? `₹${(minPrice / 100000).toFixed(2)} L` 
          : `₹${(minPrice / 100000).toFixed(2)}L – ₹${(maxPrice / 100000).toFixed(2)}L`;

        const maxBattery = Math.max(...vehicles.map(v => v.specs.batteryCapacityKwh));
        const maxRange = Math.max(...vehicles.map(v => v.specs.realWorldCityRangeKm));

        return (
          <section 
            key={brand}
            className="p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-6"
          >
            {/* Brand Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {brand.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                      {brand}
                    </h2>
                    <span className="rounded-full bg-neutral-200 px-2.5 py-0.5 text-xs font-bold text-neutral-800">
                      {vehicles.length} {vehicles.length === 1 ? 'Model' : 'Models in Lineup'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Price Range: <strong className="text-neutral-900 font-bold">{priceRangeText}</strong> • Up to {maxRange} km City Range • Up to {maxBattery} kWh Battery
                  </p>
                </div>
              </div>

              {/* 1-Click Compare Lineup Button */}
              {vehicles.length > 1 && (
                <button
                  onClick={() => compareBrandLineup(brand)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare {brand} Lineup ({Math.min(4, vehicles.length)} Variants)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Vehicle Cards Grid for this Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {vehicles.map((model) => (
                <VehicleCard key={model.id} model={model} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default BrandShowcaseView;
