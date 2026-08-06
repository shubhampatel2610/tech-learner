'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const N = 10; // dp[0..9]

/**
 * Animated 1D tabulation fill (Fibonacci: dp[i] = dp[i-1] + dp[i-2]).
 * Each step highlights the two source cells being read and the cell being
 * written, so "build it up from the base cases" is watched, not just read.
 */
export function DPTableOps() {
  const [dp, setDp] = useState<(number | null)[]>([0, 1, ...Array(N - 2).fill(null)]);
  const [reading, setReading] = useState<number[]>([]);
  const [writing, setWriting] = useState<number | null>(null);
  const [note, setNote] = useState('Run tabulation to fill the table bottom-up, left to right.');
  const [busy, setBusy] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBusy(true);
    const table: (number | null)[] = [0, 1, ...Array(N - 2).fill(null)];
    setDp([...table]);
    setNote('Base cases: dp[0] = 0, dp[1] = 1 - these are given, not computed.');

    for (let i = 2; i < N; i++) {
      const delay = (i - 1) * 700;
      const capturedI = i;
      timers.current.push(
        setTimeout(() => {
          setReading([capturedI - 1, capturedI - 2]);
          setWriting(null);
          setNote(`dp[${capturedI}] = dp[${capturedI - 1}] + dp[${capturedI - 2}] - read the two previous subproblems.`);
        }, delay),
      );
      timers.current.push(
        setTimeout(() => {
          const value = table[capturedI - 1]! + table[capturedI - 2]!;
          table[capturedI] = value;
          setDp([...table]);
          setWriting(capturedI);
          setNote(`dp[${capturedI}] = ${table[capturedI - 1]} + ${table[capturedI - 2]} = ${value}. Written once, reused forever - that's the whole point of tabulation.`);
        }, delay + 350),
      );
    }
    timers.current.push(
      setTimeout(() => {
        setReading([]);
        setWriting(null);
        setBusy(false);
        setNote(`Table complete in O(n) time, O(n) space - versus naive recursion's O(2ⁿ) from recomputing the same subproblems repeatedly.`);
      }, (N - 1) * 700 + 400),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDp([0, 1, ...Array(N - 2).fill(null)]);
    setReading([]);
    setWriting(null);
    setBusy(false);
    setNote('Run tabulation to fill the table bottom-up, left to right.');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={run}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text disabled:opacity-40"
        >
          <i className="pi pi-play text-[10px]" aria-hidden /> Run tabulation
        </button>
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-faint transition-colors hover:text-text"
        >
          <i className="pi pi-refresh text-[10px]" aria-hidden /> Reset
        </button>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-[#0b0d11] p-4">
        <div className="flex w-max gap-1.5">
          {dp.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-md border font-mono text-sm transition-colors',
                  writing === i
                    ? 'border-accent bg-accent/15 text-accent'
                    : reading.includes(i)
                      ? 'border-accent-2/60 bg-accent-2/10 text-text'
                      : v !== null
                        ? 'border-border-strong bg-surface-2 text-text'
                        : 'border-dashed border-border text-faint',
                )}
              >
                {v ?? '·'}
              </div>
              <span className="font-mono text-[10px] text-faint">dp[{i}]</span>
            </div>
          ))}
        </div>
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
