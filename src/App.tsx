import React from 'react';
import { CompareProvider, useCompare } from './context/CompareContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { VehicleGrid } from './components/VehicleGrid';
import { BrandShowcaseView } from './components/BrandShowcaseView';
import { BudgetTierView } from './components/BudgetTierView';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { CompareMatrix } from './components/CompareMatrix';
import { TelanganaPriceModal } from './components/TelanganaPriceModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { RangeSimulatorModal } from './components/RangeSimulatorModal';
import { SavingsCalculatorModal } from './components/SavingsCalculatorModal';
import { SmartWizardModal } from './components/SmartWizardModal';
import { ChargingStationModal } from './components/ChargingStationModal';
import { TSSPDCLTariffModal } from './components/TSSPDCLTariffModal';
import { GreenLoanCalculatorModal } from './components/GreenLoanCalculatorModal';
import { TelanganaTaxInspectorModal } from './components/TelanganaTaxInspectorModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const {
    catalogViewMode,
    isChargingModalOpen,
    closeChargingModal,
    isTariffModalOpen,
    closeTariffModal,
    isLoanModalOpen,
    closeLoanModal,
    isTaxInspectorModalOpen,
    closeTaxInspectorModal
  } = useCompare();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-neutral-900 selection:text-white">
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

      {/* Modals & Dialogs */}
      <CompareMatrix />
      <TelanganaPriceModal />
      <VehicleDetailModal />
      <RangeSimulatorModal />
      <SavingsCalculatorModal />
      <SmartWizardModal />

      {/* New Telangana Decision Tool Modals */}
      <ChargingStationModal
        isOpen={isChargingModalOpen}
        onClose={closeChargingModal}
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

      {/* Comprehensive Telangana Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CompareProvider>
      <AppContent />
    </CompareProvider>
  );
};

export default App;
