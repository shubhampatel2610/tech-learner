'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DryRun } from '@/types/content.types';
import { cn } from '@/lib/utils';

/**
 * Steps through an algorithm trace one move at a time, rendering the data
 * structure snapshot with highlighted cells at each step.
 */
export function DryRunStepper({ run }: { run: DryRun }) {
  const [step, setStep] = useState(0);
  const total = run.steps.length;
  const current = run.steps[step];
  const atEnd = step === total - 1;

  return (
    <div className="space-y-3 rounded-card border border-border bg-surface-2/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-text">{run.title}</h4>
        <span className="font-mono text-[11px] text-faint">
          step {step + 1}/{total}
        </span>
      </div>

      <p className="font-mono text-xs text-muted">
        <span className="text-faint">input: </span>
        {run.input}
      </p>

      {current?.state && (
        <div className="flex flex-wrap gap-1.5 py-1">
          {current.state.map((v, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={cn(
                'flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-xs',
                current.highlight?.includes(i)
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border bg-surface text-muted',
              )}
            >
              {v}
            </motion.div>
          ))}
        </div>
      )}

      {current && (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-md border border-border bg-surface p-3"
        >
          <div className="text-xs font-semibold text-text">{current.label}</div>
          <div className="mt-0.5 text-xs text-muted">{current.detail}</div>
        </motion.div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-md border border-border px-3 py-1 text-xs text-muted transition-colors hover:text-text disabled:opacity-40"
        >
          <i className="pi pi-chevron-left text-[10px]" aria-hidden /> Prev
        </button>
        <button
          onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
          disabled={atEnd}
          className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/20 disabled:opacity-40"
        >
          Next <i className="pi pi-chevron-right text-[10px]" aria-hidden />
        </button>
        <button
          onClick={() => setStep(0)}
          className="ml-auto text-xs text-faint transition-colors hover:text-text"
        >
          Restart
        </button>
      </div>

      {atEnd && (
        <div className="rounded-md border border-success/30 bg-success/10 p-2.5 text-xs text-success">
          <i className="pi pi-check-circle mr-1" aria-hidden /> {run.result}
        </div>
      )}
    </div>
  );
}
