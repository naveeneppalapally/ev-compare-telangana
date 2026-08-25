import React from 'react';
import type { EVModel } from '../types/ev';
import { predictBatteryHealth, predictResaleValue } from '../utils/resalePredictor';
import { formatINR } from '../utils/priceCalculator';

export interface ResaleForecastCardProps {
  model: EVModel;
}

function inferChemistry(batteryChemistry: string): 'LFP' | 'NMC' {
  const upper = (batteryChemistry || '').toUpperCase();
  return upper.includes('LFP') ? 'LFP' : 'NMC';
}

export const ResaleForecastCard: React.FC<ResaleForecastCardProps> = ({ model }) => {
  const chemistry = inferChemistry(model.specs.batteryChemistry);
  const initialCapacityKwh = model.specs.batteryCapacityKwh;
  const avgTempC = 32;
  const annualKm = 12000;
  const years = 3;

  const { healthPercent, capacityRemainingKwh } = predictBatteryHealth({
    chemistry,
    initialCapacityKwh,
    annualKm,
    years,
    avgTempC,
  });

  const { resaleValue, depreciationPercent } = predictResaleValue({
    exShowroom: model.pricing.exShowroom,
    batteryHealthPercent: healthPercent,
    years,
    annualKm,
  });

  const explainer =
    chemistry === 'LFP'
      ? `LFP chemistry holds ~${healthPercent}% health after 3 yrs at 32°C avg (42°C peaks) — built for Telangana heat, protecting resale.`
      : `NMC degrades faster in Telangana's 42°C heat (≈${healthPercent}% after 3 yrs) — park in shade & avoid daily 100% charge to protect resale.`;

  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink">3-Year Resale & Battery Forecast</h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Telangana avg {avgTempC}°C • {annualKm.toLocaleString()} km/yr • {chemistry} • {years} yrs
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-paper border border-quartzite text-stone-600 shrink-0">
          42°C heat factored
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-600">Battery Health after {years} yrs</span>
          <span className="font-mono font-extrabold text-ink">{healthPercent}%</span>
        </div>
        <div className="h-3 rounded-full bg-paper border border-quartzite overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-signal transition-all"
            style={{ width: `${healthPercent}%` }}
            role="progressbar"
            aria-valuenow={healthPercent}
            aria-valuemin={60}
            aria-valuemax={100}
            aria-label="Battery health"
          />
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-stone-500 font-mono">{capacityRemainingKwh.toFixed(2)} kWh remaining</span>
          <span className="text-stone-500">of {initialCapacityKwh} kWh</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Est. Resale (3 yrs)</span>
          <span className="text-base font-extrabold text-milestone font-mono">{formatINR(resaleValue)}</span>
        </div>
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Depreciation</span>
          <span className="text-base font-extrabold text-ink font-mono">{depreciationPercent}%</span>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-stone-600 bg-paper border border-quartzite rounded-xl px-3 py-2">
        {explainer}
      </p>
    </div>
  );
};

export default ResaleForecastCard;
