'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const MAX_N = 8; // keeps Pascal's triangle drawable

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function pascalRows(upTo: number): number[][] {
  const rows: number[][] = [[1]];
  for (let i = 1; i <= upTo; i++) {
    const prev = rows[i - 1]!;
    const row = [1];
    for (let j = 1; j < i; j++) row.push(prev[j - 1]! + prev[j]!);
    row.push(1);
    rows.push(row);
  }
  return rows;
}

/**
 * Interactive playground for the cheatsheet's closed-form formulas: sum of
 * first n, sum of squares, and nCr - with a live Pascal's triangle so nCr's
 * "row n, position r" identity is visible, not just algebra.
 */
export function FormulaOps() {
  const [n, setN] = useState(5);
  const [r, setR] = useState(2);

  const clampedN = Math.min(Math.max(n, 0), MAX_N);
  const clampedR = Math.min(Math.max(r, 0), clampedN);

  const sumFirstN = (clampedN * (clampedN + 1)) / 2;
  const sumSquares = (clampedN * (clampedN + 1) * (2 * clampedN + 1)) / 6;
  const nCr = clampedR <= clampedN ? factorial(clampedN) / (factorial(clampedR) * factorial(clampedN - clampedR)) : 0;

  const rows = useMemo(() => pascalRows(MAX_N), []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs text-muted">
          n
          <input
            type="number"
            min={0}
            max={MAX_N}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-14 rounded-md border border-border bg-surface-2 px-2 py-1 text-center font-mono text-xs text-text"
          />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-muted">
          r
          <input
            type="number"
            min={0}
            max={MAX_N}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-14 rounded-md border border-border bg-surface-2 px-2 py-1 text-center font-mono text-xs text-text"
          />
        </label>
        <span className="text-[10px] text-faint">(capped at {MAX_N} to keep the triangle drawable)</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-surface-2 p-2.5">
          <div className="font-mono text-[10px] text-faint">n(n+1)/2</div>
          <div className="mt-0.5 font-mono text-sm text-accent">Σ 1..{clampedN} = {sumFirstN}</div>
        </div>
        <div className="rounded-md border border-border bg-surface-2 p-2.5">
          <div className="font-mono text-[10px] text-faint">n(n+1)(2n+1)/6</div>
          <div className="mt-0.5 font-mono text-sm text-accent">Σ i² = {sumSquares}</div>
        </div>
        <div className="rounded-md border border-border bg-surface-2 p-2.5">
          <div className="font-mono text-[10px] text-faint">n! / (r!(n-r)!)</div>
          <div className="mt-0.5 font-mono text-sm text-accent">C({clampedN},{clampedR}) = {nCr}</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-[#0b0d11] p-4">
        <div className="mb-2 text-[10px] text-faint">Pascal's triangle - C(n, r) is row n, position r</div>
        <div className="w-max min-w-full space-y-1">
          {rows.map((row, i) => (
            <div key={i} className="flex justify-center gap-1.5">
              {row.map((v, j) => (
                <div
                  key={j}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded border font-mono text-[10px] transition-colors',
                    i === clampedN && j === clampedR
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-border-strong bg-surface-2 text-muted',
                  )}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
