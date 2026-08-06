'use client';

import { useEffect, useState } from 'react';

/** True after first client mount - guards against SSR/client hydration flashes. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
