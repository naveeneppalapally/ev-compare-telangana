import type {
  EVModel,
  RangeSimulationParams,
  RangeSimulationResult,
  RidingModeType,
  RiderLoadType,
  TrafficConditionType,
  WeatherConditionType
} from '../types/ev';

export type RidingMode = RidingModeType;
export type RiderPayload = RiderLoadType;
export type RiderLoad = RiderLoadType;
export type TrafficCondition = TrafficConditionType;
export type WeatherCondition = WeatherConditionType;
export type AmbientTemperature = WeatherConditionType;

/**
 * Multi-Factor Range Physics Engine for Indian & Telangana Conditions.
 *
 * Multiplicative physics model:
 * Range = max(10, round(Base Real City Range * Mode * Payload * Traffic * Temperature * Terrain))
 */
export function simulateRange(
  model: EVModel,
  params: RangeSimulationParams = {}
): RangeSimulationResult {
  const mode = params.mode || 'city';
  const payload = params.payload || params.load || 'solo';
  const traffic = params.traffic || 'city_stop_go';
  const temperature = params.temperature || params.weather || 'ideal';
  const terrain = params.terrain || 'flat';
  const commuteDistanceKm = params.commuteDistanceKm !== undefined ? params.commuteDistanceKm : 35;

  const baseRangeKm = model.specs.realWorldCityRangeKm || Math.round(model.specs.araiRangeKm * 0.70) || 100;
  const batteryKwh = model.specs.batteryCapacityKwh || 3.0;

  // 1. Riding Mode Multiplier
  let modeMultiplier = 1.0;
  switch (mode) {
    case 'eco':
      modeMultiplier = 1.10;
      break;
    case 'city':
      modeMultiplier = 1.00;
      break;
    case 'sport':
      modeMultiplier = 0.82;
      break;
    case 'hyper':
      modeMultiplier = 0.68;
      break;
  }

  // 2. Rider & Passenger Payload Multiplier
  let payloadMultiplier = 1.0;
  switch (payload) {
    case 'solo_light':
      payloadMultiplier = 1.05;
      break;
    case 'solo':
    case 'solo_average':
      payloadMultiplier = 1.00;
      break;
    case 'heavy':
    case 'solo_heavy':
      payloadMultiplier = 0.94;
      break;
    case 'pillion':
    case 'with_pillion':
      payloadMultiplier = 0.84;
      break;
    case 'heavy_luggage':
    case 'heavy_with_luggage':
      payloadMultiplier = 0.76;
      break;
  }

  // 3. Traffic & Aerodynamic Drag Multiplier
  let trafficMultiplier = 1.0;
  switch (traffic) {
    case 'smooth_flow':
      trafficMultiplier = 1.08;
      break;
    case 'city_stop_go':
    case 'mixed_city':
      trafficMultiplier = 1.00;
      break;
    case 'heavy_stop_go':
      trafficMultiplier = 0.88;
      break;
    case 'mixed':
      trafficMultiplier = 0.92;
      break;
    case 'highway':
    case 'fast_highway':
      trafficMultiplier = 0.80;
      break;
  }

  // 4. Ambient Temperature & Battery Thermal Management Multiplier
  let temperatureMultiplier = 1.0;
  const chemistry = (model.specs.batteryChemistry || '').toUpperCase();
  const isLfp = chemistry.includes('LFP');

  switch (temperature) {
    case 'ideal':
    case 'pleasant':
    case 'moderate':
      temperatureMultiplier = 1.00;
      break;
    case 'telangana_heat':
    case 'hot_summer':
      // NMC throttles discharge in >38°C; LFP has superior thermal stability
      temperatureMultiplier = isLfp ? 0.94 : 0.88;
      break;
    case 'winter':
    case 'rainy':
      temperatureMultiplier = 0.95;
      break;
  }

  // 5. Terrain Multiplier
  let terrainMultiplier = 1.0;
  switch (terrain) {
    case 'flat':
    case 'plains':
      terrainMultiplier = 1.00;
      break;
    case 'hilly':
    case 'flyovers':
      terrainMultiplier = 0.90;
      break;
  }

  // Combined Multiplier
  const combinedMultiplier =
    modeMultiplier * payloadMultiplier * trafficMultiplier * temperatureMultiplier * terrainMultiplier;

  const estimatedRangeKm = Math.max(10, Math.round(baseRangeKm * combinedMultiplier));

  // Wh/km Specific Energy Consumption
  const batteryConsumptionWhPerKm = Math.round(
    (batteryKwh * 1000) / Math.max(1, estimatedRangeKm)
  );

  // Commute Feasibility Analytics
  const validCommuteKm = Math.max(1, commuteDistanceKm);
  const batteryPercentageForCommute = Math.min(
    100,
    Math.round((validCommuteKm / Math.max(1, estimatedRangeKm)) * 100)
  );

  const roundTripsPerCharge = Math.round((estimatedRangeKm / validCommuteKm) * 10) / 10;
  const batteryReserveRemainingPercent = Math.max(0, 100 - batteryPercentageForCommute);

  let rechargeFeasibilityStatus: 'safe' | 'moderate' | 'critical' = 'safe';
  let rechargeFeasibilityMessage = 'Safe Single Charge: Effortlessly covers your daily commute with ample reserve cushion.';

  if (batteryReserveRemainingPercent < 15) {
    rechargeFeasibilityStatus = 'critical';
    rechargeFeasibilityMessage = 'Midday Charge Advised: Commute consumes near 100% capacity; plan midday top-up.';
  } else if (batteryReserveRemainingPercent < 35) {
    rechargeFeasibilityStatus = 'moderate';
    rechargeFeasibilityMessage = 'Comfortable Daily Range: Sufficient for full day, recommend overnight plug-in.';
  }

  const percentageOfArai = model.specs.araiRangeKm > 0
    ? Math.round((estimatedRangeKm / model.specs.araiRangeKm) * 100)
    : 100;

  const efficiencyKmPerKwh = batteryKwh > 0
    ? Math.round((estimatedRangeKm / batteryKwh) * 10) / 10
    : 0;

  return {
    estimatedRangeKm,
    baseRangeKm,
    batteryConsumptionWhPerKm,
    batteryPercentageForCommute,
    roundTripsPerCharge,
    batteryReserveRemainingPercent,
    rechargeFeasibilityStatus,
    rechargeFeasibilityMessage,
    efficiencyKmPerKwh,
    percentageOfArai,
    factors: {
      modeMultiplier: Math.round(modeMultiplier * 100) / 100,
      payloadMultiplier: Math.round(payloadMultiplier * 100) / 100,
      weightMultiplier: Math.round(payloadMultiplier * 100) / 100,
      trafficMultiplier: Math.round(trafficMultiplier * 100) / 100,
      temperatureMultiplier: Math.round(temperatureMultiplier * 100) / 100,
      terrainMultiplier: Math.round(terrainMultiplier * 100) / 100,
      combinedMultiplier: Math.round(combinedMultiplier * 1000) / 1000
    }
  };
}

/**
 * Backward compatibility helper for modal callers.
 */
export function simulateRealWorldRange({
  model,
  mode,
  load,
  traffic,
  weather
}: {
  model: EVModel;
  mode?: RidingMode;
  load?: RiderPayload;
  traffic?: TrafficCondition;
  weather?: AmbientTemperature;
}): RangeSimulationResult {
  return simulateRange(model, {
    mode,
    payload: load,
    traffic,
    temperature: weather
  });
}
