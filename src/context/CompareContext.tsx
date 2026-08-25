import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { EVModel, TelanganaDistrict, VehicleCategory } from '../types/ev';
import { TELANGANA_DISTRICTS,
  TELANGANA_CURRENT_PETROL_PRICE,
  TELANGANA_AVG_ELECTRICITY_RATE,
  getRtoByCode,
  getDistrictById
} from '../data/telanganaRtoData';
import { calculateTelanganaOnRoadPrice } from '../utils/priceCalculator';
import { MAX_CATALOG_PRICE } from '../data/catalogMeta';
import { parseHash, buildHash } from '../utils/urlState';
import type { DeepLinkModal } from '../utils/urlState';

const MAX_COMPARE_LIMIT = 4;
const DEFAULT_COMPARE_IDS = ['ather-rizta-z-37', 'ola-s1-pro-gen2', 'tvs-iqube-s-34'];

// Covers the entire catalog so no bike is hidden by default; recomputed exactly
// once the lazy-loaded catalog arrives.
const INITIAL_MAX_ON_ROAD_PRICE = MAX_CATALOG_PRICE;

const PREFS_KEY = 'ev_tg_prefs_v1';
const FILTERS_KEY = 'ev_tg_filters_v1';
const VIEW_MODES: ReadonlySet<string> = new Set(['grid', 'brands', 'budget']);

interface StoredPrefs {
  rtoCode?: string;
  petrolPrice?: number;
  electricityRate?: number;
}

function loadStoredPrefs(): StoredPrefs {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed as StoredPrefs;
      }
    }
  } catch (e) {
    console.warn('Error reading local preferences:', e);
  }
  return {};
}

interface StoredFilters {
  view?: string;
  category?: string;
  priceMax?: number;
  minRange?: number;
  removableBattery?: boolean;
  fastCharging?: boolean;
  bootMin?: number;
  budgetUnder1L?: boolean;
  sort?: string;
}

function loadStoredFilters(): StoredFilters {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(FILTERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed as StoredFilters;
      }
    }
  } catch (e) {
    console.warn('Error reading saved filters:', e);
  }
  return {};
}

export type CatalogViewMode = 'grid' | 'brands' | 'budget';

export interface CompareContextType {
  // Vehicle Catalog
  models: EVModel[];
  isCatalogLoading: boolean;
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
  setCompareIds: (ids: string[]) => void;
  isCompared: (id: string) => boolean;
  compareLimitToast: string | null;
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
  // Catalog is the heaviest asset in the app — loaded async so first paint
  // ships only UI. Deep-link ids are validated once it arrives.
  const [models, setModels] = useState<EVModel[]>([]);

  useEffect(() => {
    let cancelled = false;
    import('../data/evModels').then((mod) => {
      if (cancelled) return;
      setModels(mod.getEVModels());
    });
    return () => { cancelled = true; };
  }, []);

  const initialHash = useMemo(
    () => (typeof window !== 'undefined' ? parseHash(window.location.hash) : parseHash('')),
    []
  );
  const storedPrefs = useMemo(() => loadStoredPrefs(), []);
  const storedFilters = useMemo(() => loadStoredFilters(), []);

  // Raw compare ids (URL ?compare= → hash → saved → demo default); pruned to
  // real catalog ids by a post-load effect.
  const getInitialCompareIds = (): string[] => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const compareParam = urlParams.get('compare');
        if (compareParam) return compareParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, MAX_COMPARE_LIMIT);
        if (initialHash.compareIds.length > 0) return initialHash.compareIds.slice(0, MAX_COMPARE_LIMIT);
        const saved = localStorage.getItem('ev_compare_ids');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, MAX_COMPARE_LIMIT);
        }
      }
    } catch (e) {}
    return DEFAULT_COMPARE_IDS;
  };

  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(getInitialCompareIds);
  const [diffOnly, setDiffOnly] = useState<boolean>(false);
  const [compareLimitToast, setCompareLimitToast] = useState<string | null>(null);
  const [catalogViewMode, setCatalogViewMode] = useState<CatalogViewMode>(() =>
    storedFilters.view && VIEW_MODES.has(storedFilters.view)
      ? (storedFilters.view as CatalogViewMode)
      : 'grid'
  );

  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>(() =>
    storedFilters.category === 'scooter' || storedFilters.category === 'motorcycle'
      ? storedFilters.category
      : 'all'
  );
  const [priceRangeMax, setPriceRangeMax] = useState<number>(
    typeof storedFilters.priceMax === 'number' && storedFilters.priceMax >= 25000 ? storedFilters.priceMax : INITIAL_MAX_ON_ROAD_PRICE
  );
  const [minRealRangeKm, setMinRealRangeKm] = useState<number>(
    typeof storedFilters.minRange === 'number' && storedFilters.minRange > 0 ? storedFilters.minRange : 0
  );
  const [requireRemovableBattery, setRequireRemovableBattery] = useState<boolean>(storedFilters.removableBattery === true);
  const [requireFastCharging, setRequireFastCharging] = useState<boolean>(storedFilters.fastCharging === true);
  const [minBootSpaceLiters, setMinBootSpaceLiters] = useState<number>(
    typeof storedFilters.bootMin === 'number' && storedFilters.bootMin > 0 ? storedFilters.bootMin : 0
  );
  const [budgetUnder1L, setBudgetUnder1L] = useState<boolean>(storedFilters.budgetUnder1L === true);
  const [activeFilterBadge, setActiveFilterBadge] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>(typeof storedFilters.sort === 'string' ? storedFilters.sort : 'recommended');

  // Telangana RTO State (deep link → saved preference → default)
  const initialRtoCode =
    (initialHash.rtoCode && getRtoByCode(initialHash.rtoCode)?.rtoCode) ||
    (storedPrefs.rtoCode && getRtoByCode(storedPrefs.rtoCode)?.rtoCode) ||
    'TG-09';
  const [selectedRtoCode, setSelectedRtoCodeState] = useState<string>(initialRtoCode);
  const [selectedDistrict, setSelectedDistrictState] = useState<TelanganaDistrict>(
    () => TELANGANA_DISTRICTS[0]
  );
  const [petrolPrice, setPetrolPrice] = useState<number>(
    typeof storedPrefs.petrolPrice === 'number' && storedPrefs.petrolPrice > 50 && storedPrefs.petrolPrice < 200
      ? storedPrefs.petrolPrice
      : TELANGANA_CURRENT_PETROL_PRICE
  );
  const [electricityRate, setElectricityRate] = useState<number>(
    typeof storedPrefs.electricityRate === 'number' && storedPrefs.electricityRate > 1 && storedPrefs.electricityRate < 30
      ? storedPrefs.electricityRate
      : TELANGANA_AVG_ELECTRICITY_RATE
  );

  // Active Modals & Dialogs (initialized from deep-link hash so shared links restore state on refresh)
  const [activeDetailModelId, setActiveDetailModelId] = useState<string | null>(
    () => (initialHash.modal === 'detail' ? initialHash.modelId : null)
  );
  const [activePriceModalModelId, setActivePriceModalModelId] = useState<string | null>(
    () => (initialHash.modal === 'price' ? initialHash.modelId : null)
  );
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(() => initialHash.modal === 'compare');
  const [isRangeModalOpen, setIsRangeModalOpen] = useState<boolean>(() => initialHash.modal === 'range');
  const [activeSimulatorModelId, setActiveSimulatorModelId] = useState<string | null>(
    () => (initialHash.modal === 'range' || initialHash.modal === 'savings' ? initialHash.modelId : null)
  );
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState<boolean>(() => initialHash.modal === 'savings');
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(() => initialHash.modal === 'wizard');

  const [isChargingModalOpen, setIsChargingModalOpen] = useState<boolean>(() => initialHash.modal === 'charging');
  const [routePlannerVehicleId, setRoutePlannerVehicleId] = useState<string | null>(
    () => (initialHash.modal === 'charging' ? initialHash.modelId : null)
  );
  const [routePlannerCorridorId, setRoutePlannerCorridorId] = useState<string | null>(
    () => (initialHash.modal === 'charging' ? initialHash.corridorId : null)
  );

  const [isTariffModalOpen, setIsTariffModalOpen] = useState<boolean>(() => initialHash.modal === 'tariff');
  const [isLoanModalOpen, setIsLoanModalOpen] = useState<boolean>(() => initialHash.modal === 'loan');
  const [isTaxInspectorModalOpen, setIsTaxInspectorModalOpen] = useState<boolean>(() => initialHash.modal === 'tax');

  // EV Tech Guide & Highway Route Planner
  const [isTechModalOpen, setIsTechModalOpen] = useState<boolean>(() => initialHash.modal === 'tech');
  const [activeTechTopicId, setActiveTechTopicId] = useState<string | null>(
    () => (initialHash.modal === 'tech' ? initialHash.topicId : null)
  );

  const findModel = React.useCallback(
    (id: string | null): EVModel | null => (id ? models.find(m => m.id === id) || null : null),
    [models]
  );

  const activeDetailModalModel = useMemo(
    () => findModel(activeDetailModelId),
    [findModel, activeDetailModelId]
  );
  const activePriceModalModel = useMemo(
    () => findModel(activePriceModalModelId),
    [findModel, activePriceModalModelId]
  );
  const simulatorModel = useMemo(
    () => findModel(activeSimulatorModelId),
    [findModel, activeSimulatorModelId]
  );

  // Once the async catalog lands: prune deep-link/saved compare ids to real
  // models, and tighten the price ceiling from the fallback to the exact max.
  useEffect(() => {
    if (models.length === 0) return;
    setSelectedCompareIds(prev => {
      const valid = prev.filter(id => models.some(m => m.id === id)).slice(0, MAX_COMPARE_LIMIT);
      return valid.length > 0 ? valid : [];
    });
    // Self-heal invalid deep-link modal ids (e.g. /#m=detail&v=evil)
    const validIds = new Set(models.map(m => m.id));
    if (activeDetailModelId && !validIds.has(activeDetailModelId)) setActiveDetailModelId(null);
    if (activePriceModalModelId && !validIds.has(activePriceModalModelId)) setActivePriceModalModelId(null);
    if (activeSimulatorModelId && !validIds.has(activeSimulatorModelId)) setActiveSimulatorModelId(null);
    if (routePlannerVehicleId && !validIds.has(routePlannerVehicleId)) setRoutePlannerVehicleId(null);
  }, [models, activeDetailModelId, activePriceModalModelId, activeSimulatorModelId, routePlannerVehicleId]);

  useEffect(() => {
    if (models.length === 0) return;
    const exactMax = Math.ceil(
      Math.max(...models.filter(m => !m.isIceBenchmark).map(m =>
        calculateTelanganaOnRoadPrice(m, selectedRtoCode).totalTelanganaOnRoadPrice
      )) / 50000
    ) * 50000;
    setPriceRangeMax(prev => {
      if (prev !== INITIAL_MAX_ON_ROAD_PRICE) return prev;
      try {
        const saved = loadStoredFilters();
        if (typeof saved.priceMax === 'number' && saved.priceMax >= 25000) return saved.priceMax;
      } catch (e) {}
      return exactMax;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models]);

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
          setCompareLimitToast('Compare tray is full (max 4) — remove one first');
          setTimeout(() => setCompareLimitToast(null), 3000);
          return prev;
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
        setCompareLimitToast('Compare tray is full (max 4) — remove one first');
        setTimeout(() => setCompareLimitToast(null), 3000);
        return prev;
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

  const setCompareIds = (ids: string[]) => {
    const valid = ids.filter(id => models.some(m => m.id === id)).slice(0, MAX_COMPARE_LIMIT);
    setSelectedCompareIds(valid);
    try { localStorage.setItem('ev_compare_ids', JSON.stringify(valid)); } catch (e) {}
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
    setPriceRangeMax(INITIAL_MAX_ON_ROAD_PRICE);
    setMinRealRangeKm(0);
    setRequireRemovableBattery(false);
    setRequireFastCharging(false);
    setMinBootSpaceLiters(0);
    setBudgetUnder1L(false);
    setActiveFilterBadge(null);
    setSortBy('recommended');
  };

  // Persist Telangana localization preferences across sessions
  useEffect(() => {
    try {
      localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({ rtoCode: selectedRtoCode, petrolPrice, electricityRate })
      );
    } catch (e) {}
  }, [selectedRtoCode, petrolPrice, electricityRate]);

  // Persist catalog filters & view mode across sessions
  useEffect(() => {
    try {
      const payload: StoredFilters = {
        view: catalogViewMode,
        category: selectedCategory,
        priceMax: priceRangeMax,
        minRange: minRealRangeKm,
        removableBattery: requireRemovableBattery,
        fastCharging: requireFastCharging,
        bootMin: minBootSpaceLiters,
        budgetUnder1L,
        sort: sortBy
      };
      localStorage.setItem(FILTERS_KEY, JSON.stringify(payload));
    } catch (e) {}
  }, [
    catalogViewMode,
    selectedCategory,
    priceRangeMax,
    minRealRangeKm,
    requireRemovableBattery,
    requireFastCharging,
    minBootSpaceLiters,
    budgetUnder1L,
    sortBy
  ]);

  // Mirror active modal / compare / RTO state into the URL hash for shareable deep links
  const lastHashRef = React.useRef('');

  useEffect(() => {
    let modalKey: DeepLinkModal | null = null;
    let modelId: string | null = null;
    if (activeDetailModelId) { modalKey = 'detail'; modelId = activeDetailModelId; }
    else if (activePriceModalModelId) { modalKey = 'price'; modelId = activePriceModalModelId; }
    else if (isRangeModalOpen) { modalKey = 'range'; modelId = activeSimulatorModelId; }
    else if (isSavingsModalOpen) { modalKey = 'savings'; modelId = activeSimulatorModelId; }
    else if (isWizardOpen) modalKey = 'wizard';
    else if (isChargingModalOpen) { modalKey = 'charging'; modelId = routePlannerVehicleId; }
    else if (isTechModalOpen) modalKey = 'tech';
    else if (isTariffModalOpen) modalKey = 'tariff';
    else if (isLoanModalOpen) modalKey = 'loan';
    else if (isTaxInspectorModalOpen) modalKey = 'tax';
    else if (isCompareOpen) modalKey = 'compare';

    const hash = buildHash({
      modal: modalKey,
      modelId,
      topicId: isTechModalOpen ? activeTechTopicId : null,
      corridorId: isChargingModalOpen ? routePlannerCorridorId : null,
      compareIds: selectedCompareIds,
      rtoCode: selectedRtoCode
    });

    try {
      // Never clobber an external hash change we haven't reconciled yet —
      // otherwise a pending deep link gets overwritten mid-navigation.
      if (window.location.hash !== hash && window.location.hash !== lastHashRef.current) return;
      if (window.location.hash !== hash) {
        lastHashRef.current = hash;
        window.history.replaceState(null, '', window.location.pathname + window.location.search + hash);
      }
    } catch (e) {}
  }, [
    activeDetailModelId,
    activePriceModalModelId,
    isRangeModalOpen,
    isSavingsModalOpen,
    isWizardOpen,
    isChargingModalOpen,
    isTechModalOpen,
    isTariffModalOpen,
    isLoanModalOpen,
    isTaxInspectorModalOpen,
    isCompareOpen,
    activeSimulatorModelId,
    routePlannerVehicleId,
    routePlannerCorridorId,
    activeTechTopicId,
    selectedCompareIds,
    selectedRtoCode
  ]);

  // Restore state when the user navigates back/forward or pastes a shared link
  useEffect(() => {
    const onHashChange = (e: HashChangeEvent) => {
      // Read from the event, not location — a mirror write may have raced us
      const rawHash = e.newURL ? `#${new URL(e.newURL).hash.replace(/^#/, '')}` : window.location.hash;
      const s = parseHash(rawHash);
      setActiveDetailModelId(s.modal === 'detail' ? s.modelId : null);
      setActivePriceModalModelId(s.modal === 'price' ? s.modelId : null);
      setIsRangeModalOpen(s.modal === 'range');
      if (s.modal === 'range' && s.modelId) setActiveSimulatorModelId(s.modelId);
      setIsSavingsModalOpen(s.modal === 'savings');
      if (s.modal === 'savings' && s.modelId) setActiveSimulatorModelId(s.modelId);
      setIsWizardOpen(s.modal === 'wizard');
      setIsChargingModalOpen(s.modal === 'charging');
      if (s.modal === 'charging') {
        setRoutePlannerVehicleId(s.modelId);
        setRoutePlannerCorridorId(s.corridorId);
      }
      setIsTechModalOpen(s.modal === 'tech');
      if (s.modal === 'tech') setActiveTechTopicId(s.topicId);
      setIsTariffModalOpen(s.modal === 'tariff');
      setIsLoanModalOpen(s.modal === 'loan');
      setIsTaxInspectorModalOpen(s.modal === 'tax');
      setIsCompareOpen(s.modal === 'compare');
      if (s.compareIds.length > 0) {
        setSelectedCompareIds(s.compareIds.slice(0, MAX_COMPARE_LIMIT));
      }
      if (s.rtoCode && getRtoByCode(s.rtoCode)) {
        setRtoCode(s.rtoCode);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const priceById = useMemo(() => new Map(models.map(m => [m.id, calculateTelanganaOnRoadPrice(m, selectedRtoCode).totalTelanganaOnRoadPrice] as const)), [models, selectedRtoCode]);

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

      const cachedPrice = priceById.get(model.id) ?? calculateTelanganaOnRoadPrice(model, selectedRtoCode).totalTelanganaOnRoadPrice;
      if (cachedPrice > priceRangeMax) {
        return false;
      }

      if (budgetUnder1L && cachedPrice > 100000) {
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
    priceById
  ]);

  const value: CompareContextType = {
    models,
    isCatalogLoading: models.length === 0,
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
    setCompareIds,
    compareLimitToast,
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
