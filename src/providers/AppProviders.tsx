'use client';

import { useRef, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PrimeReactProvider } from 'primereact/api';
import { makeStore, loadPersisted, type AppStore } from '@/store';
import { hydratePrefs } from '@/store/slices/preferencesSlice';
import { ThemeController } from './ThemeController';

/**
 * Root client providers. Creates one store per browser session and hydrates it
 * from localStorage before first paint of children.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    const store = makeStore();
    const persisted = loadPersisted();
    if (persisted?.preferences) store.dispatch(hydratePrefs(persisted.preferences));
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <PrimeReactProvider value={{ ripple: true }}>
        <ThemeController />
        {children}
      </PrimeReactProvider>
    </Provider>
  );
}
