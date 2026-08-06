'use client';

import { useState } from 'react';
import type { CodeSample } from '@/types/content.types';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';

/**
 * Multi-language code display with tabs + copy. Presentational; takes samples
 * as props so it is reused across worked examples and dry runs.
 */
export function CodeBlock({ samples }: { samples: CodeSample[] }) {
  const [active, setActive] = useState(0);
  const { copied, copy } = useCopyToClipboard();
  const current = samples[active] ?? samples[0];

  if (!current) return null;

  return (
    <div className="overflow-hidden rounded-card border border-border bg-[#0b0d11]">
      <div className="flex items-center justify-between border-b border-border bg-surface-2/40 px-2">
        <div className="flex" role="tablist" aria-label="Language">
          {samples.map((s, i) => (
            <button
              key={s.language}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                'px-3 py-2 text-xs font-medium transition-colors',
                i === active ? 'text-accent' : 'text-faint hover:text-muted',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => copy(current.code)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-faint transition-colors hover:text-text"
          aria-label="Copy code"
        >
          <i className={copied ? 'pi pi-check text-success' : 'pi pi-copy'} aria-hidden />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed">
        <code className="font-mono text-[#c9d1d9]">{current.code}</code>
      </pre>
    </div>
  );
}
