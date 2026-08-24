import React from 'react';
import { useCompare } from '../context/CompareContext';
import { VehicleGrid } from './VehicleGrid';
import { BrandShowcaseView } from './BrandShowcaseView';
import { BudgetTierView } from './BudgetTierView';

export const CatalogContainer: React.FC = () => {
  const { catalogViewMode } = useCompare();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {catalogViewMode === 'brands' && <BrandShowcaseView />}
      {catalogViewMode === 'budget' && <BudgetTierView />}
      {catalogViewMode === 'grid' && <VehicleGrid />}
    </div>
  );
};

export default CatalogContainer;
