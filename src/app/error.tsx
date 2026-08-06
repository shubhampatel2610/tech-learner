'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/appConstants';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In a real deployment this would report to an error service.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <i className="pi pi-exclamation-triangle text-4xl text-warning" aria-hidden />
      <h1 className="text-lg font-semibold text-text">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted">An unexpected error occurred while rendering this page.</p>
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/20"
        >
          Try again
        </button>
        <Link href={ROUTES.home} className="rounded-md border border-border px-4 py-2 text-xs text-muted hover:text-text">
          Go home
        </Link>
      </div>
    </div>
  );
}
