import React, { useMemo, useState } from 'react';
import type { EVModel } from '../types/ev';
import { DEALERS } from '../data/dealers';
import type { Dealer, DealerStockEntry } from '../data/dealers';
import { LeadFormModal } from './LeadFormModal';
import { MapPin, Phone, CheckCircle2, Clock3 } from 'lucide-react';

export interface DealerStockPanelProps {
  model: EVModel;
  rtoCode: string;
}

function getHexForColour(model: EVModel, colourName: string): string | null {
  const match = model.colorOptions?.find(
    (c) => c.name.toLowerCase() === colourName.toLowerCase()
  );
  if (match) return match.hex;
  // fuzzy: try contains
  const fuzzy = model.colorOptions?.find(
    (c) => colourName.toLowerCase().includes(c.name.toLowerCase().split(' ')[0]) || c.name.toLowerCase().includes(colourName.toLowerCase().split(' ')[0])
  );
  return fuzzy?.hex ?? null;
}

export const DealerStockPanel: React.FC<DealerStockPanelProps> = ({ model, rtoCode }) => {
  const [activeDealer, setActiveDealer] = useState<Dealer | null>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const normalizedRto = useMemo(
    () => (rtoCode || '').trim().toUpperCase().replace('TS-', 'TG-'),
    [rtoCode]
  );

  const dealersForModel = useMemo(() => {
    if (!normalizedRto) return [];
    return DEALERS.filter(
      (d) => d.rtoCode === normalizedRto && d.stock.some((s) => s.modelId === model.id)
    );
  }, [model.id, normalizedRto]);

  const handleBook = (dealer: Dealer, slot: string) => {
    setActiveDealer(dealer);
    setActiveSlot(slot);
  };

  if (!normalizedRto) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-stone-500" />
          Dealer Stock Near You
        </h3>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-paper border border-quartzite text-stone-600">
          {normalizedRto} · {dealersForModel.length} {dealersForModel.length === 1 ? 'dealer' : 'dealers'} for this model
        </span>
      </div>

      {dealersForModel.length === 0 ? (
        <div className="rounded-2xl bg-white border border-stone-200 p-4">
          <p className="text-xs font-semibold text-ink">No live stock for {model.name} in {normalizedRto} yet</p>
          <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
            Request a callback — the nearest authorised dealer will confirm availability and test-ride slots.
          </p>
          <button
            type="button"
            onClick={() => handleBook({ id: 'generic', brand: model.brand, name: `Nearest ${model.brand} dealer`, rtoCode: normalizedRto, district: '', address: '', phone: '', stock: [], slots: ['Tomorrow 10:00 AM'] } as Dealer, 'Tomorrow 10:00 AM')}
            className="mt-3 px-4 py-1.5 rounded-full bg-milestone hover:bg-[#0077ed] text-white text-xs font-semibold transition cursor-pointer"
          >
            Request test ride in {normalizedRto}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {dealersForModel.map((dealer) => {
            const stock: DealerStockEntry | undefined = dealer.stock.find((s) => s.modelId === model.id);
            if (!stock) return null;
            return (
              <div
                key={dealer.id}
                className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-ink leading-tight">{dealer.name}</h4>
                      <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
                        {dealer.rtoCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-stone-400" />
                      <span>{dealer.district} · {dealer.address}</span>
                    </p>
                    {dealer.phone && (
                      <a
                        href={`tel:${dealer.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-milestone mt-1.5 transition"
                      >
                        <Phone className="w-3 h-3" />
                        {dealer.phone}
                      </a>
                    )}
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      stock.available
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {stock.available ? 'In stock' : 'Pre-book'}
                  </span>
                </div>

                {/* Colours */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-stone-600">Colours:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {stock.colours.map((c) => {
                      const hex = getHexForColour(model, c);
                      return (
                        <span key={c} className="inline-flex items-center gap-1.5">
                          <span
                            title={c}
                            aria-label={c}
                            className="w-4 h-4 rounded-full border border-stone-300 shadow-sm inline-block"
                            style={{ backgroundColor: hex || '#e7e5e4' }}
                          />
                          <span className="text-[11px] text-stone-600 hidden sm:inline">{c}</span>
                        </span>
                      );
                    })}
                    {!stock.available && (
                      <span className="text-[11px] text-stone-400 italic">— call to confirm</span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  {stock.colours.join(' · ')} {stock.available ? '· ready for display' : '· booking open'}
                </div>

                {/* Slots */}
                <div className="mt-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600">
                    <Clock3 className="w-3.5 h-3.5 text-stone-400" />
                    Next test-ride slots
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dealer.slots.slice(0, 3).map((slot) => (
                      <span
                        key={slot}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-paper border border-quartzite text-[11px] font-medium text-ink"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {dealer.slots.slice(0, 3).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleBook(dealer, slot)}
                        className="px-3.5 py-1.5 rounded-full bg-milestone hover:bg-[#0077ed] text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                      >
                        Book {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prefilled lead form */}
      <LeadFormModal
        isOpen={Boolean(activeDealer && activeSlot)}
        onClose={() => {
          setActiveDealer(null);
          setActiveSlot(null);
        }}
        modelId={model.id}
        modelName={`${model.brand} ${model.name}`}
        rtoCode={normalizedRto}
        dealerName={activeDealer?.name}
        slot={activeSlot ?? undefined}
      />
    </div>
  );
};

export default DealerStockPanel;
