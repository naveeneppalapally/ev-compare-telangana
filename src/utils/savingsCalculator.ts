import type { EVModel, SavingsComparison, SavingsParams, TCOBreakdown, CarbonOffsetResult } from '../types/ev';
import { calculateTelanganaOnRoadPrice } from './priceCalculator.ts';

/**
 * Standard Telangana Baseline Economic & Financial Benchmark Constants
 */
export const FINANCIAL_BENCHMARKS = {
  HYDERABAD_PETROL_PRICE_PER_LITER: 109.66,
  ACTIVA_6G_MILEAGE_KMPL: 45.0,
  ACTIVA_6G_EX_SHOWROOM: 82684,
  ACTIVA_6G_ON_ROAD_TELANGANA: 100616,
  TSSPDCL_DOMESTIC_TARIFF_PER_KWH: 7.50,
  CHARGER_EFFICIENCY_FACTOR: 0.88, // 88% AC-to-DC conversion efficiency
  DEFAULT_EV_WH_PER_KM: 30.0,
  PETROL_MAINTENANCE_PER_KM: 0.429, // Engine oil, spark plugs, clutch, CVT (~₹4,200/yr)
  EV_MAINTENANCE_PER_KM: 0.117,     // Brake pads, fluid, periodic check (~₹900/yr)
  PETROL_CO2_GRAMS_PER_KM: 51.3,
  EV_CO2_GRAMS_PER_KM: 24.54,
  TEAK_TREE_ANNUAL_CO2_KG: 22.0,
} as const;

/**
 * Computes carbon emission reductions and equivalent tree offsets.
 */
export function calculateCarbonOffset(distanceKm: number): CarbonOffsetResult {
  const petrolCo2GramsPerKm = FINANCIAL_BENCHMARKS.PETROL_CO2_GRAMS_PER_KM;
  const evCo2GramsPerKm = FINANCIAL_BENCHMARKS.EV_CO2_GRAMS_PER_KM;
  const netCo2ReductionGramsPerKm = petrolCo2GramsPerKm - evCo2GramsPerKm; // ~26.76 g/km

  const monthlyKm = distanceKm;
  const annualKm = distanceKm * 12;
  const fiveYearKm = distanceKm * 60;

  const monthlyCo2SavedKg = Math.round((monthlyKm * netCo2ReductionGramsPerKm) / 1000);
  const annualCo2SavedKg = Math.round((annualKm * netCo2ReductionGramsPerKm) / 1000);
  const fiveYearCo2SavedKg = Math.round((fiveYearKm * netCo2ReductionGramsPerKm) / 1000);
  const equivalentTeakTrees = Math.max(1, Math.round(fiveYearCo2SavedKg / FINANCIAL_BENCHMARKS.TEAK_TREE_ANNUAL_CO2_KG));

  return {
    petrolCo2GramsPerKm,
    evCo2GramsPerKm,
    netCo2ReductionGramsPerKm: Math.round(netCo2ReductionGramsPerKm * 100) / 100,
    monthlyCo2SavedKg,
    annualCo2SavedKg,
    fiveYearCo2SavedKg,
    equivalentTeakTrees,
  };
}

/**
 * Computes the 5-Year Total Cost of Ownership (TCO) comparing an EV to Honda Activa 6G.
 */
export function calculate5YearTCO({
  evOnRoadPrice,
  evWhPerKm,
  electricityRate,
  petrolPrice,
  petrolMileage,
  fiveYearKm = 50000,
}: {
  evOnRoadPrice: number;
  evWhPerKm: number;
  electricityRate: number;
  petrolPrice: number;
  petrolMileage: number;
  fiveYearKm?: number;
}): TCOBreakdown {
  const ownershipYears = 5;

  // 1. Petrol Activa 6G Benchmark
  const petrolInitialOnRoad = FINANCIAL_BENCHMARKS.ACTIVA_6G_ON_ROAD_TELANGANA;
  const petrolFuelCostPerKm = petrolPrice / Math.max(1, petrolMileage);
  const petrolFuelCostTotal = Math.round(fiveYearKm * petrolFuelCostPerKm);
  const petrolMaintenanceTotal = Math.round(fiveYearKm * FINANCIAL_BENCHMARKS.PETROL_MAINTENANCE_PER_KM);
  const petrolInsuranceRenewals = 4200; // Yrs 2-5 OD renewals
  const petrolGrossTCO = petrolInitialOnRoad + petrolFuelCostTotal + petrolMaintenanceTotal + petrolInsuranceRenewals;
  const petrolResidualResaleValue = Math.round(0.35 * FINANCIAL_BENCHMARKS.ACTIVA_6G_EX_SHOWROOM); // 35% residual
  const petrolNetTCO = petrolGrossTCO - petrolResidualResaleValue;

  // 2. Electric Two-Wheeler
  const evInitialOnRoad = evOnRoadPrice;
  const gridKwhPerKm = (evWhPerKm / 1000) / FINANCIAL_BENCHMARKS.CHARGER_EFFICIENCY_FACTOR;
  const evPowerCostPerKm = gridKwhPerKm * electricityRate;
  const evElectricityCostTotal = Math.round(fiveYearKm * evPowerCostPerKm);
  const evMaintenanceTotal = Math.round(fiveYearKm * FINANCIAL_BENCHMARKS.EV_MAINTENANCE_PER_KM);
  const evInsuranceRenewals = 4800; // Yrs 2-5 OD renewals
  const evGrossTCO = evInitialOnRoad + evElectricityCostTotal + evMaintenanceTotal + evInsuranceRenewals;
  const evResidualResaleValue = Math.round(0.28 * evOnRoadPrice); // 28% residual
  const evNetTCO = evGrossTCO - evResidualResaleValue;

  const netTCOSavings = petrolNetTCO - evNetTCO;

  return {
    ownershipYears,
    totalKm: fiveYearKm,
    petrolInitialOnRoad,
    petrolFuelCostTotal,
    petrolMaintenanceTotal,
    petrolInsuranceRenewals,
    petrolGrossTCO,
    petrolResidualResaleValue,
    petrolNetTCO,
    evInitialOnRoad,
    evElectricityCostTotal,
    evMaintenanceTotal,
    evInsuranceRenewals,
    evGrossTCO,
    evResidualResaleValue,
    evNetTCO,
    netTCOSavings,
  };
}

/**
 * Computes the exact breakeven payback period in months and formatted string.
 */
export function calculatePaybackPeriod(
  upfrontPriceDifference: number,
  monthlySavings: number
): { months: number; years: number; formatted: string } {
  if (upfrontPriceDifference <= 0) {
    return { months: 0, years: 0, formatted: 'Immediate (Cheaper Upfront)' };
  }
  if (monthlySavings <= 0) {
    return { months: 999, years: 99.9, formatted: 'No Payback' };
  }

  const rawMonths = upfrontPriceDifference / monthlySavings;
  const months = Math.round(rawMonths * 10) / 10;
  const years = Math.round((months / 12) * 10) / 10;

  let formatted = '';
  if (months < 12) {
    formatted = `${months} Months`;
  } else {
    const wholeYears = Math.floor(months / 12);
    const remMonths = Math.round(months % 12);
    formatted = remMonths > 0 ? `${wholeYears} Yr ${remMonths} Mo` : `${wholeYears} Years`;
  }

  return { months, years, formatted };
}

/**
 * Universal Petrol vs EV Savings Calculator
 * Supports passing either an EVModel + optional params, or direct parameter object.
 */
export function calculateSavings(
  modelOrParams?: EVModel | Partial<SavingsParams>,
  maybeParams?: Partial<SavingsParams>
): SavingsComparison {
  let model: EVModel | undefined;
  let params: Partial<SavingsParams> = {};

  if (modelOrParams && 'pricing' in modelOrParams && 'specs' in modelOrParams) {
    model = modelOrParams as EVModel;
    params = maybeParams || {};
  } else if (modelOrParams) {
    params = modelOrParams as Partial<SavingsParams>;
  }

  const dailyKm = Number(params.dailyKm) > 0 ? Number(params.dailyKm) : 35;
  const daysPerMonth = Number(params.daysPerMonth) > 0 ? Number(params.daysPerMonth) : 26;
  const petrolPrice = Number(params.petrolPricePerLiter) > 0 ? Number(params.petrolPricePerLiter) : FINANCIAL_BENCHMARKS.HYDERABAD_PETROL_PRICE_PER_LITER;
  const petrolMileage = Number(params.petrolMileageKmpl) > 0 ? Number(params.petrolMileageKmpl) : FINANCIAL_BENCHMARKS.ACTIVA_6G_MILEAGE_KMPL;
  const electricityRate = Number(params.electricityCostPerKwh) > 0 ? Number(params.electricityCostPerKwh) : FINANCIAL_BENCHMARKS.TSSPDCL_DOMESTIC_TARIFF_PER_KWH;

  // Determine EV Wh/km
  let evWhPerKm = Number(params.evWhPerKm) || 0;
  if (evWhPerKm <= 0 && model && model.specs) {
    const batteryKwh = Number(model.specs.batteryCapacityKwh) || 3.0;
    const cityRange = Number(model.specs.realWorldCityRangeKm) || 100;
    if (cityRange > 0 && batteryKwh > 0) {
      evWhPerKm = Math.round((batteryKwh * 1000) / cityRange);
    }
  }
  if (evWhPerKm <= 0) {
    evWhPerKm = FINANCIAL_BENCHMARKS.DEFAULT_EV_WH_PER_KM;
  }

  // Determine EV On-Road Price
  let evOnRoad = Number(params.evOnRoadPrice) || 0;
  if (evOnRoad <= 0 && model) {
    const breakdown = calculateTelanganaOnRoadPrice(model);
    evOnRoad = breakdown.totalTelanganaOnRoadPrice;
  }
  if (evOnRoad <= 0) {
    evOnRoad = 143260; // fallback standard
  }

  const petrolOnRoad = Number(params.petrolOnRoadPrice) || FINANCIAL_BENCHMARKS.ACTIVA_6G_ON_ROAD_TELANGANA;

  // 1. Distances
  const monthlyKm = dailyKm * daysPerMonth;
  const annualKm = monthlyKm * 12;

  // 2. Unit Operating Costs
  const petrolFuelCostPerKm = petrolPrice / Math.max(1, petrolMileage);
  const petrolMaintPerKm = FINANCIAL_BENCHMARKS.PETROL_MAINTENANCE_PER_KM;
  const petrolTotalCostPerKm = petrolFuelCostPerKm + petrolMaintPerKm;

  const gridKwhPerKm = (evWhPerKm / 1000) / FINANCIAL_BENCHMARKS.CHARGER_EFFICIENCY_FACTOR;
  const evPowerCostPerKm = gridKwhPerKm * electricityRate;
  const evMaintPerKm = FINANCIAL_BENCHMARKS.EV_MAINTENANCE_PER_KM;
  const evTotalCostPerKm = evPowerCostPerKm + evMaintPerKm;

  const netSavingsPerKm = petrolTotalCostPerKm - evTotalCostPerKm;
  const evEnergyEfficiencyKmPerKwh = Math.round((1 / Math.max(0.001, gridKwhPerKm)) * 10) / 10;

  // 3. Periodic Costs — keep signed so loss-making cases surface instead of hiding as ₹0
  const monthlyPetrolCost = Math.round(monthlyKm * petrolTotalCostPerKm);
  const monthlyEvCost = Math.round(monthlyKm * evTotalCostPerKm);
  const monthlySavings = monthlyPetrolCost - monthlyEvCost;
  const annualSavings = monthlySavings * 12;
  const fiveYearOperationalSavings = annualSavings * 5;

  // 4. Annual Maintenance
  const petrolVehicleMaintenancePerYear = Math.round(annualKm * petrolMaintPerKm);
  const evMaintenancePerYear = Math.round(annualKm * evMaintPerKm);
  const annualMaintenanceSavings = petrolVehicleMaintenancePerYear - evMaintenancePerYear;
  const totalAnnualNetSavings = annualSavings;

  // 5. Payback
  const upfrontPriceDifference = Math.max(0, evOnRoad - petrolOnRoad);
  const payback = calculatePaybackPeriod(upfrontPriceDifference, monthlySavings);

  // 6. 5-Year TCO
  const tco = calculate5YearTCO({
    evOnRoadPrice: evOnRoad,
    evWhPerKm,
    electricityRate,
    petrolPrice,
    petrolMileage,
    fiveYearKm: annualKm * 5,
  });

  // 7. Carbon Offset
  const carbonOffset = calculateCarbonOffset(monthlyKm);

  return {
    dailyKm,
    daysPerMonth,
    monthlyKm,
    annualKm,
    petrolPricePerLiter: petrolPrice,
    petrolMileageKmpl: petrolMileage,
    electricityCostPerKwh: electricityRate,
    evEnergyEfficiencyKmPerKwh,
    evWhPerKm,
    petrolFuelCostPerKm: Math.round(petrolFuelCostPerKm * 100) / 100,
    petrolMaintenancePerKm: Math.round(petrolMaintPerKm * 100) / 100,
    petrolTotalCostPerKm: Math.round(petrolTotalCostPerKm * 100) / 100,
    evPowerCostPerKm: Math.round(evPowerCostPerKm * 100) / 100,
    evMaintenancePerKm: Math.round(evMaintPerKm * 100) / 100,
    evTotalCostPerKm: Math.round(evTotalCostPerKm * 100) / 100,
    netSavingsPerKm: Math.round(netSavingsPerKm * 100) / 100,
    monthlyPetrolCost,
    monthlyEvCost,
    monthlySavings,
    annualSavings,
    fiveYearSavings: fiveYearOperationalSavings,
    fiveYearOperationalSavings,
    petrolVehicleMaintenancePerYear,
    evMaintenancePerYear,
    annualMaintenanceSavings,
    totalAnnualNetSavings,
    upfrontPriceDifference,
    paybackPeriodMonths: payback.months,
    paybackPeriodYears: payback.years,
    paybackFormatted: payback.formatted,
    tco,
    carbonOffset,
    fiveYearPetrolTCO: tco.petrolNetTCO,
    fiveYearEvTCO: tco.evNetTCO,
    fiveYearNetTcoSavings: tco.netTCOSavings,
    co2ReductionKg5Yr: carbonOffset.fiveYearCo2SavedKg,
  };
}
