'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/** Positions for a complete binary tree of up to 7 nodes, indexed by heap array index (level order). */
const POS: { x: number; y: number }[] = [
  { x: 50, y: 12 },
  { x: 26, y: 42 }, { x: 74, y: 42 },
  { x: 12, y: 76 }, { x: 38, y: 76 }, { x: 62, y: 76 }, { x: 88, y: 76 },
];
const MAX_SIZE = 7;
const INITIAL = [5, 12, 8, 27, 19];

const parentOf = (i: number) => Math.floor((i - 1) / 2);

type Snapshot = { heap: number[]; compare: number[]; note: string };

/**
 * Interactive min-heap visualizer over a fixed 7-slot complete binary tree.
 * Insert/Extract-Min precompute the full sequence of comparisons and swaps
 * up front, then play it back step by step - so sift-up/sift-down is
 * something you watch happen, not just a description of "O(log n)".
 */
export function HeapOps() {
  const [heap, setHeap] = useState<number[]>(INITIAL);
  const [compare, setCompare] = useState<number[]>([]);
  const [note, setNote] = useState('Insert or extract-min to watch the heap re-balance.');
  const [busy, setBusy] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = (snapshots: Snapshot[]) => {
    clearTimers();
    setBusy(true);
    snapshots.forEach((snap, i) => {
      const t = setTimeout(() => {
        setHeap(snap.heap);
        setCompare(snap.compare);
        setNote(snap.note);
        if (i === snapshots.length - 1) setBusy(false);
      }, (i + 1) * 550);
      timers.current.push(t);
    });
  };

  const insert = () => {
    if (busy) return;
    if (heap.length >= MAX_SIZE) {
      setNote(`Demo capped at ${MAX_SIZE} nodes to keep the tree drawable - a real heap keeps growing the backing array.`);
      return;
    }
    const value = Math.floor(Math.random() * 90) + 10;
    const arr = [...heap, value];
    let i = arr.length - 1;
    const snapshots: Snapshot[] = [
      { heap: [...arr], compare: [i], note: `Insert ${value} at the end (index ${i}) - the only O(1) part of insert.` },
    ];
    while (i > 0) {
      const p = parentOf(i);
      snapshots.push({ heap: [...arr], compare: [i, p], note: `Compare index ${i} (${arr[i]}) with parent index ${p} (${arr[p]}).` });
      if (arr[i]! < arr[p]!) {
        [arr[i], arr[p]] = [arr[p]!, arr[i]!];
        snapshots.push({ heap: [...arr], compare: [i, p], note: `${value} < parent - swap up.` });
        i = p;
      } else {
        break;
      }
    }
    snapshots.push({ heap: [...arr], compare: [], note: `${value} settled - parent is now ≤ it. Sift-up done in at most O(log n) swaps (tree height).` });
    play(snapshots);
  };

  const extractMin = () => {
    if (busy || heap.length === 0) return;
    const min = heap[0];
    const arr = [...heap];
    const last = arr.pop()!;
    if (arr.length === 0) {
      clearTimers();
      setHeap([]);
      setCompare([]);
      setNote(`extractMin() -> ${min}. Heap is now empty.`);
      return;
    }
    arr[0] = last;
    let i = 0;
    const snapshots: Snapshot[] = [
      { heap: [...arr], compare: [0], note: `extractMin() -> ${min}. Move the last node (${last}) to the root, then sift it down.` },
    ];
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < arr.length && arr[l]! < arr[smallest]!) smallest = l;
      if (r < arr.length && arr[r]! < arr[smallest]!) smallest = r;
      snapshots.push({
        heap: [...arr],
        compare: [i, l, r].filter((x) => x < arr.length),
        note: `Compare index ${i} (${arr[i]}) with its children.`,
      });
      if (smallest === i) break;
      [arr[i], arr[smallest]] = [arr[smallest]!, arr[i]!];
      snapshots.push({ heap: [...arr], compare: [i, smallest], note: `Smaller child wins - swap down.` });
      i = smallest;
    }
    snapshots.push({ heap: [...arr], compare: [], note: `${last} settled - both children are ≥ it. Sift-down done in O(log n).` });
    play(snapshots);
  };

  const reset = () => {
    clearTimers();
    setHeap(INITIAL);
    setCompare([]);
    setBusy(false);
    setNote('Reset to the starting min-heap.');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={insert}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text disabled:opacity-40"
        >
          <i className="pi pi-plus text-[10px]" aria-hidden /> Insert
        </button>
        <button
          onClick={extractMin}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text disabled:opacity-40"
        >
          <i className="pi pi-minus text-[10px]" aria-hidden /> Extract-Min
        </button>
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-faint transition-colors hover:text-text"
        >
          <i className="pi pi-refresh text-[10px]" aria-hidden /> Reset
        </button>
      </div>

      <div className="relative h-56 rounded-card border border-border bg-[#0b0d11]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {heap.map((_, i) => {
            if (i === 0) return null;
            const p = POS[parentOf(i)]!;
            const c = POS[i]!;
            return (
              <line key={i} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="rgb(48 54 64)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
            );
          })}
        </svg>
        {heap.map((value, i) => {
          const pos = POS[i]!;
          const isRoot = i === 0;
          const isCompared = compare.includes(i);
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs transition-colors',
                  isCompared
                    ? 'border-accent bg-accent/20 text-accent'
                    : isRoot
                      ? 'border-accent-2/60 bg-accent-2/10 text-text'
                      : 'border-border-strong bg-surface-2 text-text',
                )}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
