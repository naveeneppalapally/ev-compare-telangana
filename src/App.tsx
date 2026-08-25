import React, { Suspense } from 'react';
import { CompareProvider, useCompare } from './context/CompareContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { VehicleGrid } from './components/VehicleGrid';
import { BrandShowcaseView } from './components/BrandShowcaseView';
import { BudgetTierView } from './components/BudgetTierView';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';

// Modals are code-split: each chunk loads on first open instead of bloating the initial bundle
const CompareMatrix = React.lazy(() => import('./components/CompareMatrix'));
const TelanganaPriceModal = React.lazy(() => import('./components/TelanganaPriceModal'));
const VehicleDetailModal = React.lazy(() => import('./components/VehicleDetailModal'));
const RangeSimulatorModal = React.lazy(() => import('./components/RangeSimulatorModal'));
const SavingsCalculatorModal = React.lazy(() => import('./components/SavingsCalculatorModal'));
const SmartWizardModal = React.lazy(() => import('./components/SmartWizardModal'));
const ChargingRoutePlannerModal = React.lazy(() => import('./components/ChargingRoutePlannerModal'));
const EVTechExplorerModal = React.lazy(() => import('./components/EVTechExplorerModal'));
const TSSPDCLTariffModal = React.lazy(() => import('./components/TSSPDCLTariffModal'));
const GreenLoanCalculatorModal = React.lazy(() => import('./components/GreenLoanCalculatorModal'));
const TelanganaTaxInspectorModal = React.lazy(() => import('./components/TelanganaTaxInspectorModal'));

const AppContent: React.FC = () => {
  const {
    catalogViewMode,
    isChargingModalOpen,
    closeChargingModal,
    routePlannerVehicleId,
    routePlannerCorridorId,
    isTechModalOpen,
    activeTechTopicId,
    closeTechModal,
    openDetail,
    isTariffModalOpen,
    closeTariffModal,
    isLoanModalOpen,
    closeLoanModal,
    isTaxInspectorModalOpen,
    closeTaxInspectorModal
  } = useCompare();

  return (
    <div className="min-h-screen bg-white text-ink flex flex-col font-sans antialiased selection:bg-ink selection:text-white">
      {/* Sticky Header & Policy Ticker */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Banner, Search, View Switcher & Quick Filters */}
        <HeroSearch />

        {/* Dynamic Catalog Views */}
        {catalogViewMode === 'brands' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BrandShowcaseView />
          </section>
        )}

        {catalogViewMode === 'budget' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BudgetTierView />
          </section>
        )}

        {catalogViewMode === 'grid' && <VehicleGrid />}
      </main>

      {/* Sticky Comparison Bottom Tray */}
      <CompareFloatingBar />

      {/* Modals & Dialogs (code-split via Suspense) */}
      <Suspense fallback={null}>
        <CompareMatrix />
        <TelanganaPriceModal />
        <VehicleDetailModal />
        <RangeSimulatorModal />
        <SavingsCalculatorModal />
        <SmartWizardModal />

        {/* Telangana Decision & Technology Tool Modals */}
        <ChargingRoutePlannerModal
          isOpen={isChargingModalOpen}
          onClose={closeChargingModal}
          initialVehicleId={routePlannerVehicleId}
          initialCorridorId={routePlannerCorridorId}
        />
        <EVTechExplorerModal
          isOpen={isTechModalOpen}
          onClose={closeTechModal}
          initialTopicId={activeTechTopicId}
          onSelectVehicle={openDetail}
        />
        <TSSPDCLTariffModal
          isOpen={isTariffModalOpen}
          onClose={closeTariffModal}
        />
        <GreenLoanCalculatorModal
          isOpen={isLoanModalOpen}
          onClose={closeLoanModal}
        />
        <TelanganaTaxInspectorModal
          isOpen={isTaxInspectorModalOpen}
          onClose={closeTaxInspectorModal}
        />
      </Suspense>

      {/* Comprehensive Telangana Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CompareProvider>
        <AppContent />
      </CompareProvider>
    </ErrorBoundary>
  );
};

export default App;
