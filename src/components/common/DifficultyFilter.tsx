'use client';

import type { Difficulty } from '@/types/content.types';
import { cn } from '@/lib/utils';

const FILTERS: Array<'All' | Difficulty> = ['All', 'Beginner', 'Intermediate', 'Advanced'];

/** Shared difficulty filter row - reused by every topic-track roadmap (DSA, Git). */
export function DifficultyFilter({
  filter,
  onChange,
}: {
  filter: 'All' | Difficulty;
  onChange: (f: 'All' | Difficulty) => void;
}) {
  return (
    <div className="flex gap-1 rounded-md border border-border bg-surface p-0.5">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={cn(
            'rounded px-2.5 py-1 text-xs font-medium transition-colors',
            filter === f ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
