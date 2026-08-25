import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { predictBatteryHealth, predictResaleValue } from '../src/utils/resalePredictor.ts';

describe('Resale & Battery Life Forecast (resalePredictor.ts)', () => {
  it('LFP retains more than NMC at same heat/km (Telangana 32°C, 12k km, 3y)', () => {
    const lfp = predictBatteryHealth({
      chemistry: 'LFP',
      initialCapacityKwh: 3.5,
      annualKm: 12000,
      years: 3,
      avgTempC: 32,
    });
    const nmc = predictBatteryHealth({
      chemistry: 'NMC',
      initialCapacityKwh: 3.5,
      annualKm: 12000,
      years: 3,
      avgTempC: 32,
    });

    assert.ok(lfp.healthPercent > nmc.healthPercent, `LFP ${lfp.healthPercent}% should be > NMC ${nmc.healthPercent}%`);
    assert.ok(lfp.capacityRemainingKwh > nmc.capacityRemainingKwh, 'LFP capacity remaining should be higher');
    // sanity: LFP ~73-74% at those defaults, NMC ~61-62%
    assert.ok(lfp.healthPercent >= 70 && lfp.healthPercent <= 80, `LFP health ${lfp.healthPercent} out of expected 70-80`);
    assert.ok(nmc.healthPercent >= 60 && nmc.healthPercent <= 70, `NMC health ${nmc.healthPercent} out of expected 60-70`);
  });

  it('clamps health 60-100%', () => {
    const extremeHeatNmc = predictBatteryHealth({
      chemistry: 'NMC',
      initialCapacityKwh: 3.0,
      annualKm: 20000,
      years: 5,
      avgTempC: 42,
    });
    assert.ok(extremeHeatNmc.healthPercent >= 60, 'Health should not go below 60');
    assert.ok(extremeHeatNmc.healthPercent <= 100, 'Health should not exceed 100');

    const mildLfp = predictBatteryHealth({
      chemistry: 'LFP',
      initialCapacityKwh: 3.0,
      annualKm: 5000,
      years: 1,
      avgTempC: 25,
    });
    assert.ok(mildLfp.healthPercent <= 100 && mildLfp.healthPercent > 90, 'Mild conditions should keep health high');
  });

  it('predictResaleValue applies EV depreciation curve and health factor', () => {
    const resaleHighHealth = predictResaleValue({
      exShowroom: 150000,
      batteryHealthPercent: 100,
      years: 3,
      annualKm: 12000,
    });
    const resaleLowHealth = predictResaleValue({
      exShowroom: 150000,
      batteryHealthPercent: 60,
      years: 3,
      annualKm: 12000,
    });

    assert.ok(resaleHighHealth.resaleValue > resaleLowHealth.resaleValue, 'Higher health should give higher resale');
    // Expected base without health: 150000 * 0.85 * 0.90 * 0.92 = ~105570, with health 100% factor 1.0 => 105570, with 60% factor 0.8 => ~84456
    assert.ok(resaleHighHealth.resaleValue >= 100000 && resaleHighHealth.resaleValue <= 110000, `High health resale ${resaleHighHealth.resaleValue} out of expected range`);
    assert.ok(resaleLowHealth.resaleValue >= 80000 && resaleLowHealth.resaleValue <= 90000, `Low health resale ${resaleLowHealth.resaleValue} out of expected range`);

    // Depreciation percent sanity
    assert.ok(resaleHighHealth.depreciationPercent < resaleLowHealth.depreciationPercent);
    assert.ok(resaleHighHealth.depreciationPercent > 25 && resaleHighHealth.depreciationPercent < 35);
  });

  it('battery capacity remaining scales with health', () => {
    const result = predictBatteryHealth({
      chemistry: 'LFP',
      initialCapacityKwh: 4.0,
      annualKm: 12000,
      years: 3,
      avgTempC: 32,
    });
    const expected = Math.round(4.0 * (result.healthPercent / 100) * 100) / 100;
    assert.equal(result.capacityRemainingKwh, expected);
  });
});
