'use client';

import { useState } from 'react';
import type { PracticeProblem } from '@/types/content.types';
import { Badge } from '@/components/ui/Badge';
import { PROBLEM_DIFFICULTY_META } from '@/lib/appConstants';
import { cn } from '@/lib/utils';

type Tone = 'success' | 'warning' | 'danger';

/** Expandable practice-problem cards with progressive hints. */
export function PracticeList({ problems }: { problems: PracticeProblem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {problems.map((p) => {
        const isOpen = open === p.id;
        const tone = PROBLEM_DIFFICULTY_META[p.difficulty] as Tone;
        return (
          <div key={p.id} className="card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : p.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <i
                className={cn(
                  'pi text-xs text-faint transition-transform',
                  isOpen ? 'pi-chevron-down' : 'pi-chevron-right',
                )}
                aria-hidden
              />
              <span className="flex-1 text-sm font-medium text-text">{p.title}</span>
              <Badge tone="default">{p.pattern}</Badge>
              <Badge tone={tone}>{p.difficulty}</Badge>
            </button>

            {isOpen && (
              <div className="space-y-3 border-t border-border px-4 py-3 text-sm">
                <p className="text-muted">{p.description}</p>

                <div>
                  <div className="mb-1 text-xs font-semibold text-text">Constraints</div>
                  <ul className="ml-4 list-disc space-y-0.5 text-xs text-muted">
                    {p.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-1 text-xs font-semibold text-text">Hints</div>
                  <ul className="ml-4 list-disc space-y-0.5 text-xs text-muted">
                    {p.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs link-accent"
                  >
                    Open problem <i className="pi pi-external-link text-[10px]" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
