'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const INITIAL = [10, 20, 30, 40, 50];
/** Index the last node's `next` points back to, when demonstrating a cycle. */
const CYCLE_START = 2;

type Mode = 'idle' | 'traverse' | 'reverse' | 'cycle';

/**
 * Interactive singly-linked-list visualizer. Traverse/Reverse show why access
 * is O(n) but splicing is O(1); Detect Cycle runs an animated Floyd's
 * tortoise-and-hare over a synthetic cycle (last node's next -> CYCLE_START)
 * so the "meet inside the loop" moment is visible, not just described.
 */
export function LinkedListOps() {
  const [items, setItems] = useState(INITIAL);
  const [mode, setMode] = useState<Mode>('idle');
  const [highlight, setHighlight] = useState<number[]>([]);
  const [slow, setSlow] = useState<number | null>(null);
  const [fast, setFast] = useState<number | null>(null);
  const [note, setNote] = useState("Pick an operation to see the pointers move.");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timers.current.push(t);
  };

  const reset = () => {
    clearTimers();
    setItems(INITIAL);
    setMode('idle');
    setHighlight([]);
    setSlow(null);
    setFast(null);
    setNote('Reset to the starting list.');
  };

  const traverse = () => {
    clearTimers();
    setMode('traverse');
    setSlow(null);
    setFast(null);
    items.forEach((_, i) => {
      schedule(() => {
        setHighlight([i]);
        setNote(`curr = node ${i} (value ${items[i]}) -> curr = curr.next. Each hop is O(1); n hops total is O(n).`);
      }, i * 500);
    });
    schedule(() => {
      setHighlight([]);
      setNote('curr = null. Reached the end - traversal is always O(n) time, O(1) space.');
    }, items.length * 500);
  };

  const reverse = () => {
    clearTimers();
    setMode('reverse');
    setSlow(null);
    setFast(null);
    setHighlight(items.map((_, i) => i));
    setNote('Relink every node.next to point at prev instead of forward - no copying, no shifting.');
    schedule(() => {
      setItems((prev) => [...prev].reverse());
      setHighlight([]);
      setNote('Done. Reverse is O(n) time (visit each node once), O(1) extra space (three pointers: prev, curr, next).');
    }, 500);
  };

  const detectCycle = () => {
    clearTimers();
    if (items.length !== INITIAL.length) setItems(INITIAL);
    setMode('cycle');
    setHighlight([]);

    const next = (i: number) => (i + 1 < INITIAL.length ? i + 1 : CYCLE_START);
    let s = 0;
    let f = 0;
    let step = 0;
    const tick = () => {
      s = next(s);
      f = next(next(f));
      step += 1;
      setSlow(s);
      setFast(f);
      if (s === f) {
        setNote(`Step ${step}: slow (+1) and fast (+2) meet at node ${s} -> a cycle exists. O(n) time, O(1) space - no visited-set needed.`);
        return;
      }
      setNote(`Step ${step}: slow -> node ${s}, fast -> node ${f}. They haven't met yet, keep hopping.`);
      schedule(tick, 700);
    };
    schedule(tick, 700);
    setNote("Starting Floyd's tortoise & hare: slow moves 1 step, fast moves 2 steps per tick.");
  };

  const OPS: { op: Mode; label: string; icon: string; run: () => void }[] = [
    { op: 'traverse', label: 'Traverse', icon: 'pi pi-arrow-right', run: traverse },
    { op: 'reverse', label: 'Reverse', icon: 'pi pi-sync', run: reverse },
    { op: 'cycle', label: "Detect Cycle (Floyd's)", icon: 'pi pi-refresh', run: detectCycle },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {OPS.map(({ op, label, icon, run }) => (
          <button
            key={op}
            onClick={run}
            className={cn(
              'flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text',
              mode === op && 'border-accent/40 text-text',
            )}
          >
            <i className={`${icon} text-[10px]`} aria-hidden />
            {label}
          </button>
        ))}
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-faint transition-colors hover:text-text"
        >
          <i className="pi pi-refresh text-[10px]" aria-hidden /> Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1 overflow-x-auto rounded-card border border-border bg-[#0b0d11] p-4">
        <AnimatePresence mode="popLayout">
          {items.map((value, i) => (
            <motion.div
              key={`${value}-${i}-${items.join(',')}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex items-center gap-1"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-1 gap-3 font-mono text-[9px] leading-none text-faint">
                  {slow === i && <span className="text-accent-2">S</span>}
                  {fast === i && <span className="text-accent">F</span>}
                </div>
                <div
                  className={cn(
                    'flex h-11 min-w-11 items-center justify-center rounded-md border px-2 font-mono text-sm transition-colors',
                    highlight.includes(i)
                      ? 'border-accent bg-accent/15 text-accent'
                      : slow === i || fast === i
                        ? 'border-accent-2/50 bg-accent-2/10 text-text'
                        : 'border-border-strong bg-surface-2 text-text',
                  )}
                >
                  {value}
                </div>
                <span className="font-mono text-[10px] text-faint">{i}</span>
              </div>
              {i < items.length - 1 && (
                <i className="pi pi-arrow-right text-[10px] text-faint" aria-hidden />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {mode !== 'cycle' && (
          <span className="ml-1 font-mono text-[10px] text-faint">next -&gt; null</span>
        )}
        {mode === 'cycle' && (
          <span className="ml-1 whitespace-nowrap font-mono text-[10px] text-faint">
            next(last) -&gt; node {CYCLE_START}
          </span>
        )}
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
