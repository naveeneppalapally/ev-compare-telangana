export type BatteryChemistryInput = 'LFP' | 'NMC';

export interface PredictBatteryHealthParams {
  chemistry: BatteryChemistryInput;
  initialCapacityKwh: number;
  annualKm: number;
  years: number;
  avgTempC: number;
}

export interface BatteryHealthResult {
  healthPercent: number;
  capacityRemainingKwh: number;
}

export interface PredictResaleValueParams {
  exShowroom: number;
  batteryHealthPercent: number;
  years: number;
  annualKm: number;
}

export interface ResaleValueResult {
  resaleValue: number;
  depreciationPercent: number;
}

/**
 * Predict battery health after N years considering Telangana heat and mileage.
 *
 * LFP degrades ~2.5% per year at 25°C, +0.8% per extra °C above 25, +0.5% per 10k km/year
 * NMC degrades ~3.5% per year at 25°C, +1.2% per extra °C, +0.7% per 10k km
 * Clamp health 60-100%
 */
export function predictBatteryHealth({
  chemistry,
  initialCapacityKwh,
  annualKm,
  years,
  avgTempC,
}: PredictBatteryHealthParams): BatteryHealthResult {
  const isLfp = chemistry === 'LFP';
  const basePerYear = isLfp ? 2.5 : 3.5;
  const tempExtra = Math.max(0, avgTempC - 25);
  const tempPenaltyPerYear = tempExtra * (isLfp ? 0.8 : 1.2);
  const kmPenaltyPerYear = (annualKm / 10000) * (isLfp ? 0.5 : 0.7);

  const degradationPerYear = basePerYear + tempPenaltyPerYear + kmPenaltyPerYear;
  const totalDegradation = degradationPerYear * years;

  let healthPercent = 100 - totalDegradation;
  // clamp 60-100
  healthPercent = Math.max(60, Math.min(100, healthPercent));
  // round to 1 decimal
  healthPercent = Math.round(healthPercent * 10) / 10;

  const capacityRemainingKwh = Math.round(initialCapacityKwh * (healthPercent / 100) * 100) / 100;

  return {
    healthPercent,
    capacityRemainingKwh,
  };
}

/**
 * Predict resale value after N years.
 * Base depreciation: 15% yr1, 10% yr2, 8% yr3 (EV curve) adjusted by battery health: resale *= (0.5 + health*0.5)
 * health is expected as percent 60-100 -> normalized to 0-1
 */
export function predictResaleValue({
  exShowroom,
  batteryHealthPercent,
  years,
  annualKm: _annualKm,
}: PredictResaleValueParams): ResaleValueResult {
  // _annualKm is included for API symmetry; health already captures mileage effect
  void _annualKm;

  const schedule = [0.15, 0.1, 0.08];
  let retained = 1;

  for (let i = 0; i < years; i++) {
    const dep = schedule[i] ?? 0.08;
    retained *= 1 - dep;
  }

  const clampedHealth = Math.max(60, Math.min(100, batteryHealthPercent));
  const healthFactor = 0.5 + (clampedHealth / 100) * 0.5;
  const resaleBeforeHealth = exShowroom * retained;
  const resaleValue = Math.round(resaleBeforeHealth * healthFactor);
  const depreciationPercent = Math.round(((exShowroom - resaleValue) / Math.max(1, exShowroom)) * 1000) / 10;

  return {
    resaleValue,
    depreciationPercent,
  };
}
