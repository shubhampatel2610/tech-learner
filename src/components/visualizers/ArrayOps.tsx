'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Op = 'traverse' | 'insert' | 'delete' | 'reverse';

const INITIAL = [10, 20, 30, 40, 50];

/**
 * Interactive array visualizer demonstrating the O(1) vs O(n) cost difference
 * between operations. Highlights the cells that move so the "shift" cost of
 * middle insert/delete is visible, not just stated.
 */
export function ArrayOps() {
  const [items, setItems] = useState<{ id: number; value: number }[]>(() =>
    INITIAL.map((value, i) => ({ id: i, value })),
  );
  const [nextId, setNextId] = useState(INITIAL.length);
  const [active, setActive] = useState<number[]>([]);
  const [note, setNote] = useState('Pick an operation to see how the array changes.');

  const flash = (indices: number[], message: string) => {
    setActive(indices);
    setNote(message);
    setTimeout(() => setActive([]), 900);
  };

  const run = (op: Op) => {
    switch (op) {
      case 'traverse':
        flash(items.map((_, i) => i), 'Traversal visits every element once → O(n).');
        break;
      case 'insert': {
        const mid = Math.floor(items.length / 2);
        const value = Math.floor(Math.random() * 90) + 10;
        const copy = [...items];
        copy.splice(mid, 0, { id: nextId, value });
        setNextId((n) => n + 1);
        setItems(copy);
        flash(
          Array.from({ length: copy.length - mid }, (_, k) => mid + k),
          `Insert at index ${mid}: every element after it shifts right → O(n).`,
        );
        break;
      }
      case 'delete': {
        if (items.length <= 1) return;
        const mid = Math.floor(items.length / 2);
        const copy = [...items];
        copy.splice(mid, 1);
        setItems(copy);
        flash(
          Array.from({ length: copy.length - mid }, (_, k) => mid + k),
          `Delete at index ${mid}: elements after it shift left → O(n).`,
        );
        break;
      }
      case 'reverse':
        setItems((prev) => [...prev].reverse());
        flash(
          items.map((_, i) => i),
          'Reverse swaps ends inward → O(n) time, O(1) space.',
        );
        break;
    }
  };

  const reset = () => {
    setItems(INITIAL.map((value, i) => ({ id: i, value })));
    setNextId(INITIAL.length);
    setActive([]);
    setNote('Reset to the starting array.');
  };

  const OPS: { op: Op; label: string; icon: string }[] = [
    { op: 'traverse', label: 'Traverse', icon: 'pi pi-arrow-right' },
    { op: 'insert', label: 'Insert (mid)', icon: 'pi pi-plus' },
    { op: 'delete', label: 'Delete (mid)', icon: 'pi pi-minus' },
    { op: 'reverse', label: 'Reverse', icon: 'pi pi-sync' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {OPS.map(({ op, label, icon }) => (
          <button
            key={op}
            onClick={() => run(op)}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
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

      <div className="flex flex-wrap items-end gap-1.5 rounded-card border border-border bg-[#0b0d11] p-4">
        <AnimatePresence mode="popLayout">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-md border font-mono text-sm transition-colors',
                  active.includes(i)
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border-strong bg-surface-2 text-text',
                )}
              >
                {it.value}
              </div>
              <span className="font-mono text-[10px] text-faint">{i}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
