'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Growth functions plotted on the chart, ordered from best to worst. */
const CURVES = [
  { key: 'O(1)', color: '#22c55e', fn: (_n: number) => 1 },
  { key: 'O(log n)', color: '#10b981', fn: (n: number) => Math.log2(n + 1) },
  { key: 'O(n)', color: '#14b8a6', fn: (n: number) => n },
  { key: 'O(n log n)', color: '#3b82f6', fn: (n: number) => n * Math.log2(n + 1) },
  { key: 'O(n²)', color: '#eab308', fn: (n: number) => n * n },
  { key: 'O(2ⁿ)', color: '#ef4444', fn: (n: number) => Math.pow(2, n) },
] as const;

const W = 520;
const H = 300;
const PAD = 32;
const MAX_N = 20;

/**
 * Interactive Big-O growth comparison. Toggle curves; a vertical marker reads
 * out relative operation counts at a chosen n. Pure SVG for zero-dependency
 * rendering; Framer Motion animates the path draw.
 */
export function BigOChart() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CURVES.map((c) => [c.key, true])),
  );
  const [markerN, setMarkerN] = useState(10);

  const active = CURVES.filter((c) => enabled[c.key]);

  // Shared log-scaled y so wildly different growths fit one frame.
  const maxY = useMemo(() => {
    const peak = Math.max(...active.map((c) => c.fn(MAX_N)), 1);
    return Math.log10(peak + 1);
  }, [active]);

  const x = (n: number) => PAD + (n / MAX_N) * (W - 2 * PAD);
  const y = (v: number) => H - PAD - (Math.log10(v + 1) / maxY) * (H - 2 * PAD);

  const paths = active.map((c) => {
    const pts: string[] = [];
    for (let n = 0; n <= MAX_N; n += 0.5) {
      pts.push(`${n === 0 ? 'M' : 'L'} ${x(n).toFixed(1)} ${y(c.fn(n)).toFixed(1)}`);
    }
    return { ...c, d: pts.join(' ') };
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {CURVES.map((c) => (
          <button
            key={c.key}
            onClick={() => setEnabled((e) => ({ ...e, [c.key]: !e[c.key] }))}
            aria-pressed={enabled[c.key]}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition-opacity',
              enabled[c.key] ? 'border-border bg-surface-2' : 'border-border opacity-40',
            )}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.key}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-[#0b0d11] p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Big-O growth comparison">
          {/* axes */}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgb(48 54 64)" />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgb(48 54 64)" />
          <text x={W - PAD} y={H - PAD + 18} fill="rgb(96 102 114)" fontSize="10" textAnchor="end">
            input size n →
          </text>
          <text x={PAD - 6} y={PAD} fill="rgb(96 102 114)" fontSize="10" textAnchor="end">
            ops
          </text>

          {/* marker */}
          <line
            x1={x(markerN)}
            y1={PAD}
            x2={x(markerN)}
            y2={H - PAD}
            stroke="rgb(150 156 168)"
            strokeDasharray="3 3"
          />

          {paths.map((p) => (
            <g key={p.key}>
              <motion.path
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <circle cx={x(markerN)} cy={y(p.fn(markerN))} r={3} fill={p.color} />
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs text-muted" htmlFor="bigo-n">
          n = <span className="font-mono text-text">{markerN}</span>
        </label>
        <input
          id="bigo-n"
          type="range"
          min={1}
          max={MAX_N}
          value={markerN}
          onChange={(e) => setMarkerN(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {active.map((c) => (
          <div key={c.key} className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-2 py-1 text-[11px]">
            <span className="font-mono" style={{ color: c.color }}>
              {c.key}
            </span>
            <span className="font-mono text-muted">≈ {Math.round(c.fn(markerN)).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
