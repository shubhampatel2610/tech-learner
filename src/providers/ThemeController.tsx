'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

/**
 * Syncs the persisted theme preference to the <html> class list so Tailwind's
 * `dark`/`light` variants and our CSS token blocks apply. Renders nothing.
 */
export function ThemeController(): null {
  const theme = useAppSelector((s) => s.preferences.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}
