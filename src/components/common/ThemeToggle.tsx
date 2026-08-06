'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/preferencesSlice';
import { useMounted } from '@/hooks/useMounted';

/** Dark/light toggle. Renders a stable placeholder until mounted to avoid hydration flashes. */
export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.preferences.theme);
  const mounted = useMounted();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-2 text-muted transition-colors hover:text-text"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <i className={mounted && theme === 'dark' ? 'pi pi-sun text-sm' : 'pi pi-moon text-sm'} aria-hidden />
    </button>
  );
}
