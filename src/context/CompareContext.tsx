import React, { createContext, useContext, useState, useMemo } from 'react';
import type { EVModel, TelanganaDistrict, VehicleCategory } from '../types/ev';
import { EV_MODELS, getEVModels, getEVModelById } from '../data/evModels';
import { 
  TELANGANA_DISTRICTS, 
  TELANGANA_CURRENT_PETROL_PRICE, 
  TELANGANA_AVG_ELECTRICITY_RATE,
  getRtoByCode,
  getDistrictById
} from '../data/telanganaRtoData';
import { calculateTelanganaOnRoadPrice } from '../utils/priceCalculator';

const MAX_COMPARE_LIMIT = 4;
const DEFAULT_COMPARE_IDS = ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34'];

export type CatalogViewMode = 'grid' | 'brands' | 'budget';

export interface CompareContextType {
  // Vehicle Catalog
  models: EVModel[];
  filteredModels: EVModel[];
  catalogViewMode: CatalogViewMode;
  setCatalogViewMode: (mode: CatalogViewMode) => void;

  // Comparison State (Max 4 Models)
  selectedCompareIds: string[];
  selectedModelIds: string[]; // Alias for backward compatibility
  diffOnly: boolean;
  setDiffOnly: (diffOnly: boolean) => void;
  toggleCompare: (id: string) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  isCompared: (id: string) => boolean;
  compareBrandLineup: (brandName: string) => void;
  compareBudgetTier: (tierKey: string) => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: VehicleCategory;
  setSelectedCategory: (cat: VehicleCategory) => void;
  priceRangeMax: number;
  setPriceRangeMax: (price: number) => void;
  minRealRangeKm: number;
  setMinRealRangeKm: (range: number) => void;
  requireRemovableBattery: boolean;
  setRequireRemovableBattery: (val: boolean) => void;
  requireFastCharging: boolean;
  setRequireFastCharging: (val: boolean) => void;
  minBootSpaceLiters: number;
  setMinBootSpaceLiters: (liters: number) => void;
  budgetUnder1L: boolean;
  setBudgetUnder1L: (val: boolean) => void;
  activeFilterBadge: string | null;
  setActiveFilterBadge: (badge: string | null) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;

  // Telangana Localized Policy State
  selectedRtoCode: string;
  setRtoCode: (rtoCode: string) => void;
  selectedDistrict: TelanganaDistrict;
  setSelectedDistrict: (district: TelanganaDistrict) => void;
  petrolPrice: number;
  setPetrolPrice: (price: number) => void;
  electricityRate: number;
  setElectricityRate: (rate: number) => void;

  // Active Modals & Dialog State
  activeDetailModelId: string | null;
  activeDetailModalModel: EVModel | null;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  setActiveDetailModalModel: (model: EVModel | null) => void;

  activePriceModalModelId: string | null;
  activePriceModalModel: EVModel | null;
  openPriceModal: (id: string) => void;
  closePriceModal: () => void;
  setActivePriceModalModel: (model: EVModel | null) => void;

  isCompareOpen: boolean;
  isCompareModalOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;
  setIsCompareModalOpen: (open: boolean) => void;

  isRangeModalOpen: boolean;
  isRangeSimulatorModalOpen: boolean;
  activeSimulatorModelId: string | null;
  simulatorModel: EVModel | null;
  openRangeModal: (id?: string) => void;
  closeRangeModal: () => void;
  setIsRangeSimulatorModalOpen: (open: boolean) => void;
  setSimulatorModel: (model: EVModel | null) => void;

  isSavingsModalOpen: boolean;
  openSavingsModal: (id?: string) => void;
  closeSavingsModal: () => void;
  setIsSavingsModalOpen: (open: boolean) => void;

  isWizardOpen: boolean;
  isQuizOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
  setIsQuizOpen: (open: boolean) => void;

  // New Telangana Decision Tool Modals
  isChargingModalOpen: boolean;
  openChargingModal: () => void;
  closeChargingModal: () => void;

  isTariffModalOpen: boolean;
  openTariffModal: () => void;
  closeTariffModal: () => void;

  isLoanModalOpen: boolean;
  openLoanModal: () => void;
  closeLoanModal: () => void;

  isTaxInspectorModalOpen: boolean;
  openTaxInspectorModal: () => void;
  closeTaxInspectorModal: () => void;

  // EV Tech Guide & Highway Route Planner
  isTechModalOpen: boolean;
  activeTechTopicId: string | null;
  openTechModal: (topicId?: string) => void;
  closeTechModal: () => void;

  routePlannerVehicleId: string | null;
  routePlannerCorridorId: string | null;
  openRoutePlanner: (vehicleId?: string, corridorId?: string) => void;
  closeRoutePlanner: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const models = useMemo(() => getEVModels(), []);

  const getInitialCompareIds = (): string[] => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const compareParam = urlParams.get('compare');
        if (compareParam) {
          const ids = compareParam.split(',').map(s => s.trim()).filter(id => EV_MODELS.some(m => m.id === id));
          if (ids.length > 0) return ids.slice(0, MAX_COMPARE_LIMIT);
        }
        const saved = localStorage.getItem('ev_compare_ids');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.filter(id => EV_MODELS.some(m => m.id === id));
            if (valid.length > 0) return valid.slice(0, MAX_COMPARE_LIMIT);
          }
        }
      }
    } catch (e) {
      console.warn('Error reading compare IDs from storage/URL:', e);
    }
    return DEFAULT_COMPARE_IDS;
  };

  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(getInitialCompareIds);
  const [diffOnly, setDiffOnly] = useState<boolean>(false);
  const [catalogViewMode, setCatalogViewMode] = useState<CatalogViewMode>('grid');

  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');
  const [priceRangeMax, setPriceRangeMax] = useState<number>(450000);
  const [minRealRangeKm, setMinRealRangeKm] = useState<number>(0);
  const [requireRemovableBattery, setRequireRemovableBattery] = useState<boolean>(false);
  const [requireFastCharging, setRequireFastCharging] = useState<boolean>(false);
  const [minBootSpaceLiters, setMinBootSpaceLiters] = useState<number>(0);
  const [budgetUnder1L, setBudgetUnder1L] = useState<boolean>(false);
  const [activeFilterBadge, setActiveFilterBadge] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Telangana RTO State
  const [selectedRtoCode, setSelectedRtoCodeState] = useState<string>('TG-09');
  const [selectedDistrict, setSelectedDistrictState] = useState<TelanganaDistrict>(
    () => TELANGANA_DISTRICTS[0]
  );
  const [petrolPrice, setPetrolPrice] = useState<number>(TELANGANA_CURRENT_PETROL_PRICE);
  const [electricityRate, setElectricityRate] = useState<number>(TELANGANA_AVG_ELECTRICITY_RATE);

  // Active Modals & Dialogs
  const [activeDetailModelId, setActiveDetailModelId] = useState<string | null>(null);
  const [activePriceModalModelId, setActivePriceModalModelId] = useState<string | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState<boolean>(false);
  const [activeSimulatorModelId, setActiveSimulatorModelId] = useState<string | null>(null);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  const [isChargingModalOpen, setIsChargingModalOpen] = useState<boolean>(false);
  const [isTariffModalOpen, setIsTariffModalOpen] = useState<boolean>(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState<boolean>(false);
  const [isTaxInspectorModalOpen, setIsTaxInspectorModalOpen] = useState<boolean>(false);

  // EV Tech Guide & Highway Route Planner
  const [isTechModalOpen, setIsTechModalOpen] = useState<boolean>(false);
  const [activeTechTopicId, setActiveTechTopicId] = useState<string | null>(null);

  const [routePlannerVehicleId, setRoutePlannerVehicleId] = useState<string | null>(null);
  const [routePlannerCorridorId, setRoutePlannerCorridorId] = useState<string | null>(null);

  const activeDetailModalModel = useMemo(
    () => (activeDetailModelId ? getEVModelById(activeDetailModelId) || null : null),
    [activeDetailModelId]
  );
  const activePriceModalModel = useMemo(
    () => (activePriceModalModelId ? getEVModelById(activePriceModalModelId) || null : null),
    [activePriceModalModelId]
  );
  const simulatorModel = useMemo(
    () => (activeSimulatorModelId ? getEVModelById(activeSimulatorModelId) || null : null),
    [activeSimulatorModelId]
  );

  const setRtoCode = (code: string) => {
    const rtoInfo = getRtoByCode(code);
    if (rtoInfo) {
      setSelectedRtoCodeState(rtoInfo.rtoCode);
      const dist = getDistrictById(rtoInfo.districtId) || TELANGANA_DISTRICTS.find(d => d.rtoCode === rtoInfo.rtoCode);
      if (dist) setSelectedDistrictState(dist);
    }
  };

  const setSelectedDistrict = (dist: TelanganaDistrict) => {
    setSelectedDistrictState(dist);
    if (dist.rtoCode) {
      setSelectedRtoCodeState(dist.rtoCode);
    }
  };

  const toggleCompare = (id: string) => {
    setSelectedCompareIds(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(item => item !== id);
      } else {
        if (prev.length >= MAX_COMPARE_LIMIT) {
          next = [...prev.slice(1), id];
        } else {
          next = [...prev, id];
        }
      }
      try {
        localStorage.setItem('ev_compare_ids', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const addToCompare = (id: string) => {
    setSelectedCompareIds(prev => {
      if (prev.includes(id)) return prev;
      let next: string[];
      if (prev.length >= MAX_COMPARE_LIMIT) {
        next = [...prev.slice(1), id];
      } else {
        next = [...prev, id];
      }
      try {
        localStorage.setItem('ev_compare_ids', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const removeFromCompare = (id: string) => {
    setSelectedCompareIds(prev => {
      const next = prev.filter(item => item !== id);
      try {
        localStorage.setItem('ev_compare_ids', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const clearCompare = () => {
    setSelectedCompareIds([]);
    try {
      localStorage.setItem('ev_compare_ids', JSON.stringify([]));
    } catch (e) {}
  };

  const isCompared = (id: string) => selectedCompareIds.includes(id);

  // 1-Click Compare Brand Lineup
  const compareBrandLineup = (brandName: string) => {
    const brandVehicles = models.filter(m => !m.isIceBenchmark && m.brand.toLowerCase() === brandName.toLowerCase());
    if (brandVehicles.length > 0) {
      const targetIds = brandVehicles.slice(0, MAX_COMPARE_LIMIT).map(m => m.id);
      setSelectedCompareIds(targetIds);
      try {
        localStorage.setItem('ev_compare_ids', JSON.stringify(targetIds));
      } catch (e) {}
      setIsCompareOpen(true);
    }
  };

  // 1-Click Compare Budget Tier
  const compareBudgetTier = (tierKey: string) => {
    let tierVehicles: EVModel[] = [];
    if (tierKey === 'under1L') {
      tierVehicles = models.filter(m => !m.isIceBenchmark && m.pricing.exShowroom < 100000);
    } else if (tierKey === '1to1.4L') {
      tierVehicles = models.filter(m => !m.isIceBenchmark && m.pricing.exShowroom >= 100000 && m.pricing.exShowroom < 140000);
    } else if (tierKey === '1.4to1.8L') {
      tierVehicles = models.filter(m => !m.isIceBenchmark && m.pricing.exShowroom >= 140000 && m.pricing.exShowroom < 180000);
    } else {
      tierVehicles = models.filter(m => !m.isIceBenchmark && m.pricing.exShowroom >= 180000);
    }

    if (tierVehicles.length > 0) {
      const targetIds = tierVehicles.slice(0, MAX_COMPARE_LIMIT).map(m => m.id);
      setSelectedCompareIds(targetIds);
      try {
        localStorage.setItem('ev_compare_ids', JSON.stringify(targetIds));
      } catch (e) {}
      setIsCompareOpen(true);
    }
  };

  const openDetail = (id: string) => setActiveDetailModelId(id);
  const closeDetail = () => setActiveDetailModelId(null);

  const openPriceModal = (id: string) => setActivePriceModalModelId(id);
  const closePriceModal = () => setActivePriceModalModelId(null);

  const openCompare = () => setIsCompareOpen(true);
  const closeCompare = () => setIsCompareOpen(false);

  const openRangeModal = (id?: string) => {
    if (id) setActiveSimulatorModelId(id);
    else if (!activeSimulatorModelId && models[0]) setActiveSimulatorModelId(models[0].id);
    setIsRangeModalOpen(true);
  };
  const closeRangeModal = () => setIsRangeModalOpen(false);

  const openSavingsModal = (id?: string) => {
    if (id) setActiveSimulatorModelId(id);
    setIsSavingsModalOpen(true);
  };
  const closeSavingsModal = () => setIsSavingsModalOpen(false);

  const openWizard = () => setIsWizardOpen(true);
  const closeWizard = () => setIsWizardOpen(false);

  const openChargingModal = () => setIsChargingModalOpen(true);
  const closeChargingModal = () => setIsChargingModalOpen(false);

  const openTariffModal = () => setIsTariffModalOpen(true);
  const closeTariffModal = () => setIsTariffModalOpen(false);

  const openLoanModal = () => setIsLoanModalOpen(true);
  const closeLoanModal = () => setIsLoanModalOpen(false);

  const openTaxInspectorModal = () => setIsTaxInspectorModalOpen(true);
  const closeTaxInspectorModal = () => setIsTaxInspectorModalOpen(false);

  const openTechModal = (topicId?: string) => {
    if (topicId) setActiveTechTopicId(topicId);
    setIsTechModalOpen(true);
  };
  const closeTechModal = () => setIsTechModalOpen(false);

  const openRoutePlanner = (vehicleId?: string, corridorId?: string) => {
    if (vehicleId) setRoutePlannerVehicleId(vehicleId);
    if (corridorId) setRoutePlannerCorridorId(corridorId);
    setIsChargingModalOpen(true);
  };
  const closeRoutePlanner = () => setIsChargingModalOpen(false);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRangeMax(450000);
    setMinRealRangeKm(0);
    setRequireRemovableBattery(false);
    setRequireFastCharging(false);
    setMinBootSpaceLiters(0);
    setBudgetUnder1L(false);
    setActiveFilterBadge(null);
    setSortBy('recommended');
  };

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      if (model.isIceBenchmark) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = model.name.toLowerCase().includes(q);
        const matchesBrand = model.brand.toLowerCase().includes(q);
        const matchesTagline = model.tagline.toLowerCase().includes(q);
        const matchesFeatures = model.features.some(f => f.toLowerCase().includes(q));
        const matchesBadges = model.badges.some(b => b.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesTagline && !matchesFeatures && !matchesBadges) {
          return false;
        }
      }

      if (selectedCategory !== 'all' && model.category !== selectedCategory) {
        return false;
      }

      const priceResult = calculateTelanganaOnRoadPrice(model, selectedRtoCode);
      if (priceResult.totalTelanganaOnRoadPrice > priceRangeMax) {
        return false;
      }

      if (budgetUnder1L && priceResult.totalTelanganaOnRoadPrice > 100000) {
        return false;
      }

      if (minRealRangeKm > 0 && model.specs.realWorldCityRangeKm < minRealRangeKm) {
        return false;
      }

      if (requireRemovableBattery && !model.specs.isRemovableBattery) {
        return false;
      }

      if (requireFastCharging && !model.specs.fastChargingSupport) {
        return false;
      }

      if (minBootSpaceLiters > 0 && (model.specs.bootSpaceLiters || 0) < minBootSpaceLiters) {
        return false;
      }

      if (activeFilterBadge && !model.badges.includes(activeFilterBadge)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricing.exShowroom - b.pricing.exShowroom;
      if (sortBy === 'price-desc') return b.pricing.exShowroom - a.pricing.exShowroom;
      if (sortBy === 'range-desc') return b.specs.realWorldCityRangeKm - a.specs.realWorldCityRangeKm;
      if (sortBy === 'speed-desc') return b.specs.topSpeedKmh - a.specs.topSpeedKmh;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return b.rating - a.rating;
    });
  }, [
    models,
    searchQuery,
    selectedCategory,
    priceRangeMax,
    budgetUnder1L,
    minRealRangeKm,
    requireRemovableBattery,
    requireFastCharging,
    minBootSpaceLiters,
    activeFilterBadge,
    sortBy,
    selectedRtoCode
  ]);

  const value: CompareContextType = {
    models,
    filteredModels,
    catalogViewMode,
    setCatalogViewMode,
    selectedCompareIds,
    selectedModelIds: selectedCompareIds,
    diffOnly,
    setDiffOnly,
    toggleCompare,
    addToCompare,
    removeFromCompare,
    removeCompare: removeFromCompare,
    clearCompare,
    isCompared,
    compareBrandLineup,
    compareBudgetTier,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRangeMax,
    setPriceRangeMax,
    minRealRangeKm,
    setMinRealRangeKm,
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
    selectedRtoCode,
    setRtoCode,
    selectedDistrict,
    setSelectedDistrict,
    petrolPrice,
    setPetrolPrice,
    electricityRate,
    setElectricityRate,
    activeDetailModelId,
    activeDetailModalModel,
    openDetail,
    closeDetail,
    setActiveDetailModalModel: (m) => setActiveDetailModelId(m ? m.id : null),
    activePriceModalModelId,
    activePriceModalModel,
    openPriceModal,
    closePriceModal,
    setActivePriceModalModel: (m) => setActivePriceModalModelId(m ? m.id : null),
    isCompareOpen,
    isCompareModalOpen: isCompareOpen,
    openCompare,
    closeCompare,
    setIsCompareModalOpen: setIsCompareOpen,
    isRangeModalOpen,
    isRangeSimulatorModalOpen: isRangeModalOpen,
    activeSimulatorModelId,
    simulatorModel,
    openRangeModal,
    closeRangeModal,
    setIsRangeSimulatorModalOpen: setIsRangeModalOpen,
    setSimulatorModel: (m) => setActiveSimulatorModelId(m ? m.id : null),
    isSavingsModalOpen,
    openSavingsModal,
    closeSavingsModal,
    setIsSavingsModalOpen,
    isWizardOpen,
    isQuizOpen: isWizardOpen,
    openWizard,
    closeWizard,
    setIsQuizOpen: setIsWizardOpen,
    isChargingModalOpen,
    openChargingModal,
    closeChargingModal,
    isTariffModalOpen,
    openTariffModal,
    closeTariffModal,
    isLoanModalOpen,
    openLoanModal,
    closeLoanModal,
    isTaxInspectorModalOpen,
    openTaxInspectorModal,
    closeTaxInspectorModal,
    isTechModalOpen,
    activeTechTopicId,
    openTechModal,
    closeTechModal,
    routePlannerVehicleId,
    routePlannerCorridorId,
    openRoutePlanner,
    closeRoutePlanner
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
};
