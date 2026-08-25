import type { EVModel, EVPriceBreakdown, PriceOptions } from '../types/ev';
import { getRtoByCode } from '../data/telanganaRtoData.ts';

/**
 * Standard IRDAI 5-Year Long-Term Third-Party (TP) Tariffs for Electric Two-Wheelers
 * (Reflecting statutory 15% EV discount over ICE rates)
 */
export const IRDAI_EV_TP_5YR_RATES = {
  TIER_1_LE_3KW: 2466,    // <= 3.0 kW
  TIER_2_3_TO_7KW: 3285,   // > 3.0 kW to <= 7.0 kW
  TIER_3_7_TO_16KW: 6280,  // > 7.0 kW to <= 16.0 kW
  TIER_4_GT_16KW: 13034,   // > 16.0 kW (Super EV)
} as const;

/**
 * Calculates IRDAI 5-year comprehensive insurance (1-Yr OD + 5-Yr TP + CPA + Addons + 18% GST).
 */
export function calculate5YearInsurance(
  exShowroomPrice: number,
  motorPowerKw: number = 4.0
): {
  idv: number;
  od1Year: number;
  tp5Year: number;
  cpaCover: number;
  batteryAddon: number;
  gst18: number;
  totalInsurance: number;
} {
  const idv = Math.round(0.95 * exShowroomPrice);
  const od1Year = Math.round(idv * 0.0135);
  
  let tp5Year: number = IRDAI_EV_TP_5YR_RATES.TIER_2_3_TO_7KW;
  if (motorPowerKw <= 3.0) {
    tp5Year = IRDAI_EV_TP_5YR_RATES.TIER_1_LE_3KW;
  } else if (motorPowerKw <= 7.0) {
    tp5Year = IRDAI_EV_TP_5YR_RATES.TIER_2_3_TO_7KW;
  } else if (motorPowerKw <= 16.0) {
    tp5Year = IRDAI_EV_TP_5YR_RATES.TIER_3_7_TO_16KW;
  } else {
    tp5Year = IRDAI_EV_TP_5YR_RATES.TIER_4_GT_16KW;
  }

  const cpaCover = 375; // 1-year owner-driver ₹15L CPA
  const batteryAddon = Math.round(idv * 0.0040); // Battery shield
  const preTaxSubtotal = od1Year + tp5Year + cpaCover + batteryAddon;
  const gst18 = Math.round(preTaxSubtotal * 0.18);
  const totalInsurance = preTaxSubtotal + gst18;

  return {
    idv,
    od1Year,
    tp5Year,
    cpaCover,
    batteryAddon,
    gst18,
    totalInsurance,
  };
}

/**
 * Calculates Central Government PM E-DRIVE Subsidy
 * Rate: ₹5,000/kWh capped at ₹10,000 for vehicles with exShowroom <= ₹1,50,000.
 */
export function calculatePmEdriveSubsidy(
  batteryCapacityKwh: number,
  exShowroomPrice: number
): number {
  if (exShowroomPrice > 150000 || batteryCapacityKwh <= 0) {
    return 0;
  }
  return Math.min(Math.round(batteryCapacityKwh * 5000), 10000);
}

/**
 * Computes Telangana road tax savings vs standard 12% ICE road tax.
 */
export function calculateRoadTaxSavings(exShowroomPrice: number): number {
  return Math.round(exShowroomPrice * 0.12);
}

/**
 * Calculates the exact Telangana On-Road Price breakdown for any EV model
 * under Telangana EV Policy (G.O. Ms No. 41).
 *
 * Supports flexible parameters:
 * - calculateTelanganaOnRoadPrice(model)
 * - calculateTelanganaOnRoadPrice(model, customDiscountNumber)
 * - calculateTelanganaOnRoadPrice(model, 'TG-09', options)
 * - calculateTelanganaOnRoadPrice(model, options)
 */
export function calculateTelanganaOnRoadPrice(
  model: EVModel,
  rtoCodeOrDiscountOrOptions?: string | number | PriceOptions,
  optionsInput?: PriceOptions
): EVPriceBreakdown {
  let options: PriceOptions = {};
  
  if (typeof rtoCodeOrDiscountOrOptions === 'number') {
    options = { customDiscount: rtoCodeOrDiscountOrOptions, ...optionsInput };
  } else if (typeof rtoCodeOrDiscountOrOptions === 'string') {
    options = { rtoCode: rtoCodeOrDiscountOrOptions, ...optionsInput };
  } else if (rtoCodeOrDiscountOrOptions && typeof rtoCodeOrDiscountOrOptions === 'object') {
    options = { ...rtoCodeOrDiscountOrOptions, ...optionsInput };
  }

  const exShowroom = Number(model.pricing.exShowroom) || 0;
  const batteryKwh = Number(model.specs.batteryCapacityKwh) || 0;
  const motorPower = Number(model.specs.motorRatedPowerKw || model.specs.motorPeakPowerKw) || 4.0;
  const customDiscount = Math.max(0, Number(options.customDiscount) || 0);

  // 1. Central Subsidy
  let pmEdriveSubsidy = 0;
  if (model.isIceBenchmark) {
    pmEdriveSubsidy = 0;
  } else if (model.pricing.pmEdriveSubsidy !== undefined && model.pricing.pmEdriveSubsidy >= 0) {
    pmEdriveSubsidy = model.pricing.pmEdriveSubsidy;
  } else {
    pmEdriveSubsidy = calculatePmEdriveSubsidy(batteryKwh, exShowroom);
  }

  const netExShowroom = Math.max(0, exShowroom - pmEdriveSubsidy - customDiscount);

  // 2. 5-Year Bundled Insurance
  const insuranceCalculated = calculate5YearInsurance(exShowroom, motorPower);
  let insurance5Year = insuranceCalculated.totalInsurance;
  if (model.pricing.insuranceEst && model.pricing.insuranceEst > 0) {
    insurance5Year = model.pricing.insuranceEst;
  }

  // 3. Telangana Statutory Fees (G.O. Ms No. 41)
  const stateRoadTaxPayable = model.isIceBenchmark ? Math.round(exShowroom * 0.12) : 0;
  const stateRoadTaxStandardPetrol = calculateRoadTaxSavings(exShowroom);
  const registrationFeePayable = model.isIceBenchmark ? 785 : 0;
  const registrationFeeSavings = 785; // CMVR Form 20 (₹300) + Smart Card (₹200) + Cess (₹250) + Post (₹35)
  const hsrpPlateFee = 400; // Laser HSRP fitment fee

  // 4. Charger & Handling
  const handlingCharges = Number(model.pricing.handlingAndDocsEst ?? 1500);
  let chargerCost = 0;
  if (!model.pricing.chargerIncluded && options.includeCharger !== false) {
    chargerCost = Number(model.pricing.chargerCost ?? 0);
  }

  const extendedWarrantyCost = options.includeExtendedWarranty ? 3000 : 0;
  const accessoriesCost = options.includeAccessories ? 2000 : 0;

  // 5. Total Net Telangana On-Road Price
  const totalTelanganaOnRoadPrice = 
    netExShowroom +
    stateRoadTaxPayable +
    registrationFeePayable +
    hsrpPlateFee +
    insurance5Year +
    handlingCharges +
    chargerCost +
    extendedWarrantyCost +
    accessoriesCost;

  // 6. Total Upfront Savings
  const savingsFromTelanganaPolicy = model.isIceBenchmark ? 0 : (stateRoadTaxStandardPetrol + registrationFeeSavings);
  const totalUpfrontSavings = model.isIceBenchmark ? 0 : (savingsFromTelanganaPolicy + pmEdriveSubsidy);

  const rto = options.rtoCode || 'TG-09';
  const rtoInfo = getRtoByCode(rto);
  const districtName = rtoInfo ? `${rtoInfo.districtName} (${rtoInfo.rtoCode})` : 'Hyderabad Central (TG-09)';

  return {
    vehicleId: model.id,
    modelName: model.name,
    exShowroom,
    exShowroomPrice: exShowroom,
    batteryCapacityKwh: batteryKwh,
    motorPowerKw: motorPower,
    pmEdriveSubsidy,
    customDiscount,
    netVehiclePrice: netExShowroom,
    netExShowroom,
    idv: insuranceCalculated.idv,
    insuranceOwnDamage1Yr: insuranceCalculated.od1Year,
    insuranceThirdParty5Yr: insuranceCalculated.tp5Year,
    insurancePersonalAccident: insuranceCalculated.cpaCover,
    insuranceAddonBattery: insuranceCalculated.batteryAddon,
    insuranceGst18: insuranceCalculated.gst18,
    totalInsurance5Yr: insurance5Year,
    insurance5Year,
    stateRoadTax: stateRoadTaxPayable,
    stateRoadTaxPayable,
    stateRoadTaxRate: model.isIceBenchmark ? 12 : 0,
    stateRoadTaxStandardPetrol,
    stateRoadTaxStandardPetrolRate: 12,
    stateRoadTaxSavings: stateRoadTaxStandardPetrol,
    registrationAndSmartCardFee: registrationFeePayable,
    registrationFeePayable,
    registrationFeeSavings,
    registrationFeeStandardPetrol: registrationFeeSavings,
    hsrpPlateFee,
    handlingCharges,
    handlingAndDocs: handlingCharges,
    chargerCost,
    extendedWarrantyCost,
    accessoriesCost,
    totalTelanganaOnRoadPrice,
    netTelanganaOnRoadPrice: totalTelanganaOnRoadPrice,
    savingsFromTelanganaPolicy,
    totalUpfrontSavings,
    rtoCode: rto,
    districtName,
  };
}

/**
 * Formats a numeric currency value into Indian Rupee locale string (e.g. ₹1,43,260).
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Formats a currency amount into Lakhs string (e.g. "₹1.43 Lakh").
 */
export function formatLakhs(amount: number): string {
  if (amount >= 100000) {
    const inLakhs = (amount / 100000).toFixed(2);
    return `₹${inLakhs} Lakh`;
  }
  return formatINR(amount);
}
