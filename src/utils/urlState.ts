export type DeepLinkModal =
  | 'detail'
  | 'price'
  | 'range'
  | 'savings'
  | 'wizard'
  | 'charging'
  | 'tech'
  | 'tariff'
  | 'loan'
  | 'tax'
  | 'compare';

export interface HashState {
  modal: DeepLinkModal | null;
  modelId: string | null;
  topicId: string | null;
  corridorId: string | null;
  compareIds: string[];
  rtoCode: string | null;
}

const MODAL_KEYS: ReadonlySet<string> = new Set([
  'detail', 'price', 'range', 'savings', 'wizard',
  'charging', 'tech', 'tariff', 'loan', 'tax', 'compare'
]);

export function parseHash(hash: string, validIds?: ReadonlySet<string>): HashState {
  const state: HashState = {
    modal: null,
    modelId: null,
    topicId: null,
    corridorId: null,
    compareIds: [],
    rtoCode: null
  };
  if (!hash || hash.length < 2) return state;

  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);

  const modal = params.get('m');
  if (modal && MODAL_KEYS.has(modal)) {
    state.modal = modal as DeepLinkModal;
  }

  const v = params.get('v');
  if (v && (!validIds || validIds.has(v))) state.modelId = v;

  const t = params.get('t');
  if (t) state.topicId = t;

  const c = params.get('c');
  if (c) state.corridorId = c;

  const cmp = params.get('compare');
  if (cmp) {
    const ids = cmp.split(',').map(s => s.trim()).filter(id => !validIds || validIds.has(id));
    state.compareIds = ids.slice(0, 4);
  }

  const rto = params.get('rto');
  if (rto && /^TG-\d{2}$/i.test(rto)) state.rtoCode = rto.toUpperCase();

  return state;
}

export function buildHash(state: HashState): string {
  const params = new URLSearchParams();
  if (state.modal) params.set('m', state.modal);
  if (state.modelId) params.set('v', state.modelId);
  if (state.topicId) params.set('t', state.topicId);
  if (state.corridorId) params.set('c', state.corridorId);
  if (state.compareIds.length > 0) params.set('compare', state.compareIds.join(','));
  if (state.rtoCode) params.set('rto', state.rtoCode);
  const qs = params.toString();
  return qs ? `#${qs}` : '';
}
