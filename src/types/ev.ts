/**
 * Master TypeScript Types & Interface Contracts
 * Electric Two-Wheeler Comparison & Decision Engine (Telangana Edition)
 */

export type VehicleCategory = 'all' | 'scooter' | 'motorcycle';

export type BatteryChemistry = 
  | 'NMC' 
  | 'LFP' 
  | 'Dual Removable NMC' 
  | 'Removable LFP' 
  | 'Fixed NMC' 
  | 'Fixed LFP'
  | 'NMC 21700'
  | 'NMC SRB7'
  | 'Li-ion'
  | string;

export type RidingModeType = 'eco' | 'city' | 'sport' | 'hyper';
export type RidingMode = RidingModeType;

export type RiderLoadType = 
  | 'solo'
  | 'solo_light' 
  | 'solo_average' 
  | 'solo_heavy' 
  | 'heavy'
  | 'with_pillion' 
  | 'pillion'
  | 'heavy_with_luggage'
  | 'heavy_luggage';
export type RiderPayload = RiderLoadType;
export type RiderLoad = RiderLoadType;

export type TrafficConditionType = 
  | 'smooth_flow' 
  | 'mixed_city' 
  | 'city_stop_go'
  | 'heavy_stop_go' 
  | 'fast_highway'
  | 'highway'
  | 'mixed';
export type TrafficCondition = TrafficConditionType;

export type WeatherConditionType = 
  | 'ideal'
  | 'pleasant' 
  | 'moderate' 
  | 'hot_summer' 
  | 'telangana_heat'
  | 'rainy'
  | 'winter';
export type WeatherCondition = WeatherConditionType;
export type AmbientTemperature = WeatherConditionType;

export type TerrainType = 'flat' | 'plains' | 'hilly' | 'flyovers';

export type RegionalZone = 
  | 'Hyderabad Metro' 
  | 'Hyderabad Peripheral' 
  | 'Urban' 
  | 'Rural / Semi-urban' 
  | 'North Telangana' 
  | 'North-Central' 
  | 'Eastern Telangana' 
  | 'South Telangana' 
  | 'South-East' 
  | 'North-West' 
  | 'West Telangana';

export type TrafficDensityProfile = 
  | 'Heavy Urban' 
  | 'Mixed Highway' 
  | 'Tier-2 City' 
  | 'Rural/Inter-district';

// --- Pricing Interface ---
export interface EVPrice {
  exShowroom: number;
  pmEdriveSubsidy: number; // Central Government PM E-DRIVE / EMPS subsidy
  chargerIncluded: boolean;
  chargerCost: number;     // Cost of charger if separate accessory
  insuranceEst: number;    // Mandatory 5-year insurance (1 yr OD + 5 yr TP)
  handlingAndDocsEst: number;
}

// --- Specs Interface ---
export interface EVSpecs {
  batteryCapacityKwh: number;
  usableBatteryCapacityKwh?: number;
  batteryChemistry: BatteryChemistry;
  isRemovableBattery: boolean;
  batteryCount?: number;
  araiRangeKm: number;
  realWorldEcoRangeKm: number;
  realWorldCityRangeKm: number;
  realWorldHighwayRangeKm: number;
  topSpeedKmh: number;
  accel0To40Kmh: number;
  accel0To60Kmh?: number;
  motorPeakPowerKw: number;
  motorRatedPowerKw: number;
  motorPeakTorqueNm?: number;
  wheelTorqueNm?: number;
  driveType?: 'Belt' | 'Hub' | 'Chain' | 'Geared' | string;
  transmission?: string;
  chargingTime0To80: string;
  chargingTime0To100: string;
  fastChargingSupport: boolean;
  fastChargingRate: string;
  bootSpaceLiters: number;
  frunkSpaceLiters?: number;
  ridingModes: string[];
  brakes: string;
  brakingSafety?: string;
  kerbWeightKg: number;
  groundClearanceMm: number;
  seatHeightMm?: number;
  wheelSizeInches?: number;
  wheelSizeFront?: string;
  wheelSizeRear?: string;
  touchscreen: boolean;
  displaySizeInches?: number;
  displayType?: string;
  connectivity: string[];
}

// --- Warranty Interface ---
export interface EVWarranty {
  batteryYears: number;
  batteryKm: number;
  vehicleYears: number;
  vehicleKm: number;
  extendedAvailable: boolean;
}

// --- Color Option ---
export interface EVColorOption {
  name: string;
  hex: string;
}

// --- Equivalent Petrol ICE Benchmark Entity ---
export interface EquivalentPetrolBenchmark {
  modelName: string;            // e.g. "Honda Activa 6G", "Hero Splendor Plus", "TVS Apache RTR 160 4V", "KTM Duke 390"
  engineCc: number;             // e.g. 110, 97.2, 160, 373
  petrolBhp: number;            // e.g. 7.8, 8.0, 17.5, 43.5
  petrolTorqueNm: number;       // e.g. 8.9, 8.05, 14.73, 37.0
  petrolMileageKmpl: number;    // e.g. 45, 65, 42, 28
  petrolExShowroom: number;     // e.g. 78000, 75000, 132000, 310000
  petrolOnRoadTG: number;       // e.g. 98000, 92000, 162000, 375000 (with 12% TG road tax)
  classComparison: string;      // e.g. "110cc Family Commuter Scooter", "390cc Performance Naked"
  powerComparisonSummary: string; // e.g. "EV delivers 70 bhp (52 kW) vs Duke 390's 43.5 bhp, with instant 105 Nm torque"
}

// --- Core EV Model Entity ---
export interface EVModel {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  category: 'scooter' | 'motorcycle';
  isIceBenchmark?: boolean;
  pricing: EVPrice;
  specs: EVSpecs;
  warranty: EVWarranty;
  features: string[];
  pros: string[];
  cons: string[];
  badges: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string;
  colorOptions: EVColorOption[];
  idealFor: string;
  launchYear: number;
  madeInIndia: boolean;
  equivalentPetrolBenchmark?: EquivalentPetrolBenchmark;
}

// --- Telangana RTO & District Entities ---
export interface RTOInfo {
  rtoCode: string;          // e.g. 'TG-09'
  legacyCode: string;       // e.g. 'TS-09'
  seriesNumber: number;     // 1 through 38
  districtId: string;       // e.g. 'hyderabad'
  districtName: string;     // e.g. 'Hyderabad Central'
  officeLocation: string;   // e.g. 'Khairatabad'
  zone: RegionalZone;
  majorLocalities: string[];
  trafficProfile: TrafficDensityProfile;
}

export interface TelanganaDistrict {
  id: string;
  name: string;
  rtoCode: string;
  legacyCode?: string;
  zone: RegionalZone | 'Hyderabad Metro' | 'Urban' | 'Rural / Semi-urban';
  headquarters?: string;
  rtoCodes?: string[];
}

// --- Pricing Breakdown Interface (supports dual property names for compatibility) ---
export interface EVPriceBreakdown {
  vehicleId?: string;
  modelName?: string;
  exShowroom: number;
  exShowroomPrice?: number;
  batteryCapacityKwh?: number;
  motorPowerKw?: number;
  pmEdriveSubsidy: number;
  customDiscount?: number;
  netVehiclePrice: number;
  netExShowroom?: number;
  idv?: number;
  insuranceOwnDamage1Yr?: number;
  insuranceThirdParty5Yr?: number;
  insurancePersonalAccident?: number;
  insuranceAddonBattery?: number;
  insuranceGst18?: number;
  totalInsurance5Yr?: number;
  stateRoadTax: number;                 // ₹0 under TG EV Policy G.O. Ms No. 41
  stateRoadTaxPayable?: number;
  stateRoadTaxRate?: number;
  stateRoadTaxStandardPetrol: number;   // 12% on ICE two-wheelers in Telangana
  stateRoadTaxStandardPetrolRate?: number;
  stateRoadTaxSavings?: number;         // 12% of exShowroom
  registrationAndSmartCardFee: number;  // ₹0 / waived under TG EV Policy
  registrationFeePayable?: number;
  registrationFeeSavings?: number;
  registrationFeeStandardPetrol?: number;
  hsrpPlateFee?: number;                // ₹400 standard laser-fitment fee
  insurance5Year: number;
  chargerCost: number;
  handlingCharges?: number;
  handlingAndDocs: number;
  extendedWarrantyCost?: number;
  accessoriesCost?: number;
  totalTelanganaOnRoadPrice: number;
  netTelanganaOnRoadPrice?: number;
  savingsFromTelanganaPolicy: number;   // Road Tax + Registration waived
  totalUpfrontSavings?: number;         // Tax saved + Reg saved + Central Subsidy
  rtoCode?: string;
  districtName?: string;
}

export type TelanganaPricingBreakdown = EVPriceBreakdown;

export interface PriceOptions {
  rtoCode?: string;
  customDiscount?: number;
  includeCharger?: boolean;         // defaults to true if vehicle requires separate charger
  includeExtendedWarranty?: boolean;// optional warranty add-on
  includeAccessories?: boolean;     // optional accessory kit
}

// --- Savings & Financial ROI Interfaces ---
export interface TCOBreakdown {
  ownershipYears: number;
  totalKm: number;
  
  // Petrol Benchmark (Honda Activa 6G)
  petrolInitialOnRoad: number;
  petrolFuelCostTotal: number;
  petrolMaintenanceTotal: number;
  petrolInsuranceRenewals: number;
  petrolGrossTCO: number;
  petrolResidualResaleValue: number;
  petrolNetTCO: number;
  
  // Electric Two-Wheeler
  evInitialOnRoad: number;
  evElectricityCostTotal: number;
  evMaintenanceTotal: number;
  evInsuranceRenewals: number;
  evGrossTCO: number;
  evResidualResaleValue: number;
  evNetTCO: number;
  
  // Net TCO Savings
  netTCOSavings: number;
}

export interface CarbonOffsetResult {
  petrolCo2GramsPerKm: number;      // 51.3 g/km
  evCo2GramsPerKm: number;          // 24.54 g/km (fossil grid)
  netCo2ReductionGramsPerKm: number;// 26.76 g/km
  monthlyCo2SavedKg: number;
  annualCo2SavedKg: number;
  fiveYearCo2SavedKg: number;
  equivalentTeakTrees: number;      // 1 mature teak tree ≈ 22 kg CO2 / year
}

export interface SavingsParams {
  dailyKm?: number;
  daysPerMonth?: number;
  petrolPricePerLiter?: number;
  petrolMileageKmpl?: number;
  electricityCostPerKwh?: number;
  evWhPerKm?: number;
  batteryCapacityKwh?: number;
  realWorldRangeKm?: number;
  chargerEfficiency?: number;
  evOnRoadPrice?: number;
  petrolOnRoadPrice?: number;
  ownershipYears?: number;
}

export interface SavingsComparison {
  dailyKm: number;
  daysPerMonth: number;
  monthlyKm: number;
  annualKm?: number;
  petrolPricePerLiter: number;
  petrolMileageKmpl: number;
  electricityCostPerKwh: number;
  evEnergyEfficiencyKmPerKwh: number;
  evWhPerKm?: number;
  petrolFuelCostPerKm?: number;
  petrolMaintenancePerKm?: number;
  petrolTotalCostPerKm?: number;
  evPowerCostPerKm?: number;
  evMaintenancePerKm?: number;
  evTotalCostPerKm?: number;
  netSavingsPerKm?: number;
  monthlyPetrolCost: number;
  monthlyEvCost: number;
  monthlySavings: number;
  annualSavings: number;
  fiveYearSavings: number;
  fiveYearOperationalSavings?: number;
  petrolVehicleMaintenancePerYear: number;
  evMaintenancePerYear: number;
  annualMaintenanceSavings?: number;
  totalAnnualNetSavings: number;
  upfrontPriceDifference?: number;
  paybackPeriodMonths: number;
  paybackPeriodYears?: number;
  paybackFormatted?: string;
  tco?: TCOBreakdown;
  carbonOffset?: CarbonOffsetResult;
  fiveYearPetrolTCO?: number;
  fiveYearEvTCO?: number;
  fiveYearNetTcoSavings?: number;
  co2ReductionKg5Yr?: number;
}

// --- Range Simulation Interfaces ---
export interface RangeSimulationParams {
  model?: EVModel;
  mode?: RidingModeType;
  payload?: RiderLoadType;
  load?: RiderLoadType;
  traffic?: TrafficConditionType;
  temperature?: WeatherConditionType;
  weather?: WeatherConditionType;
  terrain?: TerrainType;
  commuteDistanceKm?: number;
}

export interface RangeSimulationFactors {
  modeMultiplier: number;
  payloadMultiplier: number;
  weightMultiplier?: number;
  trafficMultiplier: number;
  temperatureMultiplier: number;
  terrainMultiplier?: number;
  combinedMultiplier?: number;
}

export interface RangeSimulationResult {
  estimatedRangeKm: number;
  baseRangeKm?: number;
  batteryConsumptionWhPerKm: number;
  batteryPercentageForCommute?: number;
  roundTripsPerCharge?: number;
  batteryReserveRemainingPercent?: number;
  rechargeFeasibilityStatus?: 'safe' | 'moderate' | 'critical';
  rechargeFeasibilityMessage?: string;
  factors: {
    modeMultiplier: number;
    weightMultiplier?: number;
    payloadMultiplier?: number;
    trafficMultiplier: number;
    temperatureMultiplier: number;
    terrainMultiplier?: number;
    combinedMultiplier?: number;
  };
  efficiencyKmPerKwh?: number;
  percentageOfArai?: number;
  warningMessage?: string;
}

export type RangeEstimate = RangeSimulationResult;

// --- Smart Recommendation Wizard Interfaces ---
export interface WizardAnswers {
  dailyCommute?: 'under25' | '25to50' | '50to80' | 'above80';
  commuteDistance?: 'under25' | '25to50' | '50to80' | 'above80';
  chargingAccess: 'independentHouse' | 'apartmentWithSocket' | 'apartmentNoSocket' | 'publicOnly';
  usageType?: 'familyStorage' | 'officeCommute' | 'youthPerformance' | 'budgetEconomy' | 'deliveryUtility' | 'youthStyle' | 'heavyDuty';
  primaryUse?: 'familyStorage' | 'officeCommute' | 'youthPerformance' | 'youthStyle' | 'heavyDuty' | 'budgetEconomy';
  budgetMax?: number;
  budget?: 'under1L' | '1to1.4L' | '1.4to1.8L' | 'above1.8L';
  preferredType?: 'all' | 'scooter' | 'motorcycle';
  preferredCategory?: 'all' | 'scooter' | 'motorcycle';
  pillionFrequency?: 'never' | 'occasional' | 'daily';
  priorityFactor?: 'range' | 'speed' | 'storage' | 'budget' | 'lowMaintenance';
}

export type QuizPreferences = WizardAnswers;

export interface RecommendationSubScores {
  commuteScore: number;
  chargingScore: number;
  usageScore: number;
  budgetScore: number;
}

export interface RecommendationResult {
  model: EVModel;
  matchScore: number; // 0 to 100
  matchGrade?: 'Excellent' | 'Great' | 'Good' | 'Fair';
  fitConfidence?: 'Perfect Match' | 'Great Match' | 'Good Match' | 'Alternative';
  categoryRank?: number;
  rank?: number;
  keyMatchReasons?: string[];
  matchingReasons?: string[];
  prosAlignment?: string[];
  cautionNotes?: string[];
  caveatsToConsider?: string[];
  subScores?: RecommendationSubScores;
}

// --- Filter State Interface ---
export interface FilterState {
  searchQuery: string;
  selectedCategory: VehicleCategory;
  activeFilterBadge: string | null;
  priceRangeMax: number;
  minRealRangeKm: number;
  requireRemovableBattery: boolean;
  requireFastCharging: boolean;
  minBootSpaceLiters?: number;
  selectedBrand?: string | null;
  sortBy?: 'popularity' | 'priceAsc' | 'priceDesc' | 'rangeDesc' | 'speedDesc' | 'ratingDesc' | string;
}
