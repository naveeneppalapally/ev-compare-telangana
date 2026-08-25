import React, { useState, useMemo } from 'react';
import type { EVModel } from '../types/ev';
import { formatINR } from '../utils/priceCalculator';
import { getInsuranceQuotes } from '../data/insuranceQuotes';
import { Shield, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Star } from 'lucide-react';
import { LeadFormModal } from './LeadFormModal';

export interface InsuranceQuotesPanelProps {
  model: EVModel;
  onRoadPrice: number;
}

export const InsuranceQuotesPanel: React.FC<InsuranceQuotesPanelProps> = ({ model, onRoadPrice }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [leadInsurer, setLeadInsurer] = useState<string | null>(null);

  const quotes = useMemo(() => getInsuranceQuotes(model, onRoadPrice), [model, onRoadPrice]);

  const cheapestPremium = Math.min(...quotes.map((q) => q.premium));
  const maxPremium = Math.max(...quotes.map((q) => q.premium));

  return (
    <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-stone-50 hover:bg-stone-100 transition text-left cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-2">
              Compare Insurance Quotes — 5-Year Comprehensive
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                <Star className="w-3 h-3 text-amber-500" />
                3 Insurers
              </span>
            </h4>
            <p className="text-[11px] text-stone-500">
              IDV &amp; premium based on ex-showroom {formatINR(model.pricing.exShowroom)} • IRDAI 5-yr TP tiers • Indicative only
            </p>
          </div>
        </div>
        <span className="p-1 text-stone-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Header strip comparing cheapest */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
            <span className="font-medium">
              Cheapest: <strong className="font-mono text-stone-900">{formatINR(cheapestPremium)}</strong> ({quotes.find((q) => q.premium === cheapestPremium)?.insurerName}) • Save up to{' '}
              <strong className="font-mono text-stone-900">{formatINR(maxPremium - cheapestPremium)}</strong> vs highest
            </span>
            <span className="text-[10px] text-stone-500">Tap “Get Quote” for official insurer site or request a callback</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className={`relative p-4 rounded-2xl border bg-white flex flex-col gap-3 ${
                  quote.recommended ? 'border-stone-900 shadow-sm' : 'border-stone-200'
                }`}
              >
                {quote.recommended && (
                  <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-stone-900 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                    <CheckCircle2 className="w-3 h-3" />
                    Recommended
                  </span>
                )}
                {quote.isCheapest && !quote.recommended && (
                  <span className="absolute -top-2.5 left-3 inline-flex items-center rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold tracking-wide">
                    Lowest Premium
                  </span>
                )}

                <div className="flex items-start justify-between gap-2 mt-1">
                  <div>
                    <div className="text-sm font-extrabold text-stone-900 leading-tight">{quote.insurerName}</div>
                    <div className="text-[11px] text-stone-500 font-medium">{quote.tagline}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                    CSR {quote.claimSettlementRatio}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">IDV</div>
                    <div className="font-mono font-extrabold text-stone-900 text-sm">{formatINR(quote.idv)}</div>
                    <div className="text-[10px] text-stone-500">95% × Ex-showroom</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-900 text-white border border-stone-900">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">5-Yr Premium</div>
                    <div className="font-mono font-extrabold text-white text-sm">{formatINR(quote.premium)}</div>
                    <div className="text-[10px] text-stone-400">~{formatINR(quote.annualisedPremium)}/yr</div>
                  </div>
                </div>

                <ul className="space-y-1.5 text-[11px] text-stone-700 flex-1">
                  {quote.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                  <Shield className="w-3 h-3 text-stone-400" />
                  <span>{quote.cashlessGarages}+ cashless garages • 1-Yr OD + 5-Yr TP</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={quote.insurerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-white border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Get Quote
                  </a>
                  <button
                    onClick={() => setLeadInsurer(quote.insurerName)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition cursor-pointer"
                  >
                    Request Callback
                  </button>
                </div>

                {leadInsurer === quote.insurerName && (
                  <LeadFormModal
                    isOpen={true}
                    onClose={() => setLeadInsurer(null)}
                    modelId={model.id}
                    modelName={`${model.name} — ${quote.insurerName} Insurance`}
                    dealerName={quote.insurerName}
                  />
                )}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-stone-500 leading-relaxed text-center">
            Quotes are indicative mocks derived from ex-showroom {formatINR(model.pricing.exShowroom)} and motor power {model.specs.motorRatedPowerKw || model.specs.motorPeakPowerKw} kW (IRDAI tiers). Update on-road price
            <span className="font-mono font-semibold text-stone-700"> {formatINR(onRoadPrice)}</span> includes Telangana ₹0 road-tax benefit. Verify final premium on insurer’s official site.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsuranceQuotesPanel;
