export const STORAGE_KEY = 'FROGGY_STATE_V8';
const OLD_KEYS = ['froggyhub_state_v7', 'froggyhub_event_v01'];

const defaultState = {
  id: Math.random().toString(36).slice(2, 8),
  title: '',
  date: '',
  time: '',
  address: '',
  dress: '',
  bring: '',
  notes: '',
  wishlist: Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: '',
    url: '',
    claimedBy: '',
  })),
  guests: [],
  code: null,
};

export function migrateIfNeeded() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  for (const key of OLD_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      localStorage.setItem(STORAGE_KEY, raw);
      break;
    }
  }
}

export function loadState() {
  migrateIfNeeded();
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { ...defaultState };
}

export let state = loadState();

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
