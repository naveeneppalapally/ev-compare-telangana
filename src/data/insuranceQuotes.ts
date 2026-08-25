import type { EVModel } from '../types/ev';
import { calculate5YearInsurance } from '../utils/priceCalculator.ts';

export interface InsuranceQuote {
  id: string;
  insurerId: string;
  insurerName: string;
  insurerShort: string;
  insurerUrl: string;
  logoText: string;
  idv: number;
  premium: number; // 5-year total (1Yr OD + 5Yr TP + CPA + addons + GST)
  annualisedPremium: number;
  features: string[];
  addOns: string[];
  claimSettlementRatio: string;
  cashlessGarages: number;
  tagline: string;
  recommended?: boolean;
  isCheapest?: boolean;
}

export interface InsuranceProviderMeta {
  id: string;
  insurerName: string;
  insurerShort: string;
  insurerUrl: string;
  logoText: string;
  claimSettlementRatio: string;
  cashlessGarages: number;
  tagline: string;
  features: string[];
  addOns: string[];
  premiumMultiplier: number; // vs base IRDAI price
  idvMultiplier: number;
}

export const INSURANCE_PROVIDERS: InsuranceProviderMeta[] = [
  {
    id: 'icici-lombard',
    insurerName: 'ICICI Lombard',
    insurerShort: 'ICICI',
    insurerUrl: 'https://www.icicilombard.com/motor-insurance/two-wheeler-insurance',
    logoText: 'ICICI Lombard',
    claimSettlementRatio: '98.5%',
    cashlessGarages: 5200,
    tagline: 'Most Trusted — Fastest Claim',
    features: [
      'Zero Depreciation Cover Included',
      'Battery Protect & Charger Theft Cover',
      '24x7 Roadside Assistance',
      'Cashless at 5200+ garages',
    ],
    addOns: ['Zero Dep', 'Battery Protect', 'RSA'],
    premiumMultiplier: 0.98,
    idvMultiplier: 0.95,
  },
  {
    id: 'bajaj-allianz',
    insurerName: 'Bajaj Allianz',
    insurerShort: 'Bajaj',
    insurerUrl: 'https://www.bajajallianz.co.in/my-policy/two-wheeler-insurance.html',
    logoText: 'Bajaj Allianz',
    claimSettlementRatio: '97.2%',
    cashlessGarages: 4800,
    tagline: 'Best Value — Lowest Premium',
    features: [
      'Return to Invoice (RTI) Cover',
      'Personal Accident ₹15L Cover',
      'Consumables & Key Replacement',
      'No Claim Bonus Protection',
    ],
    addOns: ['RTI', 'Consumables', 'Key Replace'],
    premiumMultiplier: 0.92,
    idvMultiplier: 0.94,
  },
  {
    id: 'hdfc-ergo',
    insurerName: 'HDFC ERGO',
    insurerShort: 'HDFC',
    insurerUrl: 'https://www.hdfcergo.com/two-wheeler-insurance',
    logoText: 'HDFC ERGO',
    claimSettlementRatio: '96.8%',
    cashlessGarages: 5000,
    tagline: 'Complete Protection — Max Coverage',
    features: [
      'Unlimited Battery Replacement Cover',
      'Charger & Accessory Theft Cover',
      'Emergency Medical Cover',
      'Engine & Electrical Secure',
    ],
    addOns: ['Battery Unlimited', 'Accessory Cover', 'EMedical'],
    premiumMultiplier: 1.05,
    idvMultiplier: 0.96,
  },
];

/**
 * Generate mock 5-year comprehensive insurance quotes for a given EV model.
 * IDV and base premium are derived from ex-showroom and motor power (IRDAI tiers);
 * each insurer applies a small multiplier to emulate market variation.
 */
export function getInsuranceQuotes(model: EVModel, _onRoadPrice?: number): InsuranceQuote[] {
  const exShowroom = Number(model.pricing.exShowroom) || 0;
  const motorPower = Number(model.specs.motorRatedPowerKw || model.specs.motorPeakPowerKw) || 4.0;
  return getInsuranceQuotesByExShowroom(exShowroom, motorPower);
}

export function getInsuranceQuotesByExShowroom(exShowroom: number, motorPowerKw: number = 4.0): InsuranceQuote[] {
  const safeEx = Math.max(0, exShowroom);
  const base = calculate5YearInsurance(safeEx, motorPowerKw);
  // base.idv is 95% of exShowroom — we vary per insurer via idvMultiplier
  // base.totalInsurance is the IRDAI baseline total
  const quotes: InsuranceQuote[] = INSURANCE_PROVIDERS.map((p) => {
    const idv = Math.round(safeEx * p.idvMultiplier);
    // Recompute OD proportionally to IDV, keep TP/CPA same, adjust addon proportionally
    const odAdjusted = Math.round(idv * 0.0135);
    const cpa = 375;
    const batteryAddon = Math.round(idv * 0.0040);
    // Determine TP tier (already in base.tp5Year)
    const preTax = odAdjusted + base.tp5Year + cpa + batteryAddon;
    const gst = Math.round(preTax * 0.18);
    const total = Math.round((preTax + gst) * p.premiumMultiplier);
    const annualised = Math.round(total / 5);
    return {
      id: p.id,
      insurerId: p.id,
      insurerName: p.insurerName,
      insurerShort: p.insurerShort,
      insurerUrl: p.insurerUrl,
      logoText: p.logoText,
      idv,
      premium: total,
      annualisedPremium: annualised,
      features: p.features,
      addOns: p.addOns,
      claimSettlementRatio: p.claimSettlementRatio,
      cashlessGarages: p.cashlessGarages,
      tagline: p.tagline,
    };
  });

  // Mark cheapest and recommended (cheapest = Bajaj typically)
  let cheapestIdx = 0;
  let minPremium = quotes[0].premium;
  quotes.forEach((q, i) => {
    if (q.premium < minPremium) {
      minPremium = q.premium;
      cheapestIdx = i;
    }
  });
  quotes[cheapestIdx].isCheapest = true;
  // Recommended = ICICI (balanced) unless Bajaj is cheapest and also balanced — pick cheapest as recommended for value
  // Make Bajaj recommended for under 1.5L, ICICI otherwise
  const recommendedIdx = safeEx < 150000 ? cheapestIdx : quotes.findIndex((q) => q.id === 'icici-lombard');
  if (recommendedIdx >= 0) quotes[recommendedIdx].recommended = true;

  // Sort by premium ascending for display (Bajaj, ICICI, HDFC typical)
  return quotes.sort((a, b) => a.premium - b.premium);
}

// Convenience alias
export const getQuotesForModel = getInsuranceQuotes;

export function formatInsuranceQuoteSummary(quotes: InsuranceQuote[]): string {
  return quotes.map((q) => `${q.insurerName}: IDV ${q.idv} — Premium ${q.premium}`).join(' | ');
}
