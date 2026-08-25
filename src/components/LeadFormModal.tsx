import React, { useState } from 'react';
import { X, CheckCircle2, MapPin } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { trackEvent } from '../utils/analytics';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
  modelName: string;
  rtoCode?: string;
  dealerName?: string;
  dealerId?: string;
  slot?: string;
}

type SubmitState = 'idle' | 'sending' | 'done' | 'failed';

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  modelId,
  modelName,
  rtoCode,
  dealerName,
  dealerId,
  slot
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [state, setState] = useState<SubmitState>('idle');

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const validPhone = /^[6-9]\d{9}$/.test(phone);
  const canSubmit = name.trim().length >= 2 && validPhone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || state === 'sending') return;
    setState('sending');
    const lead = {
      modelId,
      modelName,
      rtoCode,
      dealerName: dealerName || undefined,
      dealerId: dealerId || undefined,
      slot: slot || undefined,
      name: name.trim(),
      phone,
      area: area.trim(),
      submittedAt: new Date().toISOString()
    };
    try {
      const endpoint = import.meta.env.VITE_LEADS_ENDPOINT;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // No backend wired yet — queue locally so leads are never lost
        const queue = JSON.parse(localStorage.getItem('ev_tg_leads') ?? '[]');
        queue.push(lead);
        localStorage.setItem('ev_tg_leads', JSON.stringify(queue));
      }
      setState('done');
      {
        const props: Record<string, string | number | boolean> = { model: modelId };
        if (dealerName) props.dealer = dealerName;
        else if (dealerId) props.dealer = dealerId;
        if (slot) props.slot = slot;
        trackEvent('lead_submit', props);
      }
    } catch {
      setState('failed');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-title"
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-quartzite shadow-2xl p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-ink hover:bg-paper transition cursor-pointer"
          aria-label="Close test ride form"
        >
          <X className="w-4 h-4" />
        </button>

        {state === 'done' ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-10 h-10 text-signal mx-auto mb-3" />
            <h2 className="text-lg font-bold text-ink">Test ride requested</h2>
            <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
              {dealerName ? `${dealerName} will call` : 'A dealer near you will call'} {phone} about the {modelName}{slot ? ` for ${slot}` : ''} within 1–2 working days.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-5 py-2 rounded-full bg-ink text-white text-sm font-semibold hover:bg-stone-700 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="lead-form-title" className="text-lg font-bold text-ink">
              Book a free test ride
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {modelName} · No purchase obligation
            </p>
            {(dealerName || slot) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {dealerName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-paper border border-quartzite text-[11px] font-semibold text-ink">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    {dealerName}
                  </span>
                )}
                {slot && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-milestone/10 border border-milestone/20 text-[11px] font-semibold text-milestone">
                    {slot}
                  </span>
                )}
                {rtoCode && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-bold tracking-wide uppercase text-stone-600">
                    {rtoCode}
                  </span>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-5">
              <div>
                <label htmlFor="lead-name" className="block text-xs font-semibold text-stone-600 mb-1">Full name</label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-quartzite bg-paper focus:bg-white focus:border-milestone outline-none text-sm text-ink"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="lead-phone" className="block text-xs font-semibold text-stone-600 mb-1">Mobile number</label>
                <input
                  id="lead-phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-quartzite bg-paper focus:bg-white focus:border-milestone outline-none text-sm text-ink font-mono"
                  placeholder="10-digit mobile"
                  autoComplete="tel"
                />
                {phone.length > 0 && !validPhone && (
                  <p className="text-[11px] text-red-600 mt-1">Enter a valid 10-digit Indian mobile number</p>
                )}
              </div>
              <div>
                <label htmlFor="lead-area" className="block text-xs font-semibold text-stone-600 mb-1">
                  Area / locality <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <input
                  id="lead-area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-quartzite bg-paper focus:bg-white focus:border-milestone outline-none text-sm text-ink"
                  placeholder={`e.g. Kukatpally${rtoCode ? ` · ${rtoCode}` : ''}`}
                />
              </div>

              {state === 'failed' && (
                <p className="text-xs text-red-600">Could not submit — check your connection and retry.</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || state === 'sending'}
                className="w-full py-2.5 rounded-full bg-milestone hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                {state === 'sending' ? 'Sending…' : 'Request test ride'}
              </button>
              <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                By submitting you agree to be contacted by an authorised dealer about this model.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadFormModal;
