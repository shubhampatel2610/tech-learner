import { configureStore, type Middleware } from '@reduxjs/toolkit';
import preferencesReducer from './slices/preferencesSlice';
import { STORAGE_KEY } from '@/lib/appConstants';
import type { PreferencesState } from '@/types/preferences.types';

interface PersistShape {
  preferences: PreferencesState;
}

/** Read persisted state (SSR-safe). */
export function loadPersisted(): Partial<PersistShape> | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistShape) : undefined;
  } catch {
    return undefined;
  }
}

/** Debounced write-through persistence to localStorage. */
const persistMiddleware: Middleware = (store) => {
  let handle: ReturnType<typeof setTimeout> | null = null;
  return (next) => (action) => {
    const result = next(action);
    if (typeof window === 'undefined') return result;
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => {
      const state = store.getState() as RootState;
      const snapshot: PersistShape = {
        preferences: state.preferences,
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        /* storage full or unavailable - non-fatal */
      }
    }, 250);
    return result;
  };
};

export const makeStore = () =>
  configureStore({
    reducer: {
      preferences: preferencesReducer,
    },
    middleware: (getDefault) => getDefault().concat(persistMiddleware),
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
