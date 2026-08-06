'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Mode = 'stack' | 'queue';

const INITIAL = [10, 20, 30];

/**
 * Interactive Stack (LIFO) vs Queue (FIFO) visualizer. Switching modes keeps
 * the same underlying list but changes which end push/pop or
 * enqueue/dequeue touch, making the "restricted access = O(1)" idea visible:
 * stack always edits the right/top end, queue always edits both ends.
 */
export function StackQueueOps() {
  const [mode, setMode] = useState<Mode>('stack');
  const [items, setItems] = useState<{ id: number; value: number }[]>(() =>
    INITIAL.map((value, i) => ({ id: i, value })),
  );
  const [nextId, setNextId] = useState(INITIAL.length);
  const [active, setActive] = useState<number | null>(null);
  const [note, setNote] = useState('Push/enqueue a value, or pop/dequeue one, to see which end moves.');

  const flash = (id: number, message: string) => {
    setActive(id);
    setNote(message);
    setTimeout(() => setActive(null), 700);
  };

  const push = () => {
    const value = Math.floor(Math.random() * 90) + 10;
    const id = nextId;
    setNextId((n) => n + 1);
    setItems((prev) => [...prev, { id, value }]);
    flash(id, `${mode === 'stack' ? 'push' : 'enqueue'}(${value}) - O(1), added at the ${mode === 'stack' ? 'top' : 'rear'}.`);
  };

  const pop = () => {
    if (items.length === 0) {
      setNote('Nothing to remove - empty check matters here.');
      return;
    }
    if (mode === 'stack') {
      const top = items[items.length - 1]!;
      flash(top.id, `pop() -> ${top.value}. Removed from the top - O(1), last in, first out.`);
      setTimeout(() => setItems((prev) => prev.slice(0, -1)), 350);
    } else {
      const front = items[0]!;
      flash(front.id, `dequeue() -> ${front.value}. Removed from the front - O(1), first in, first out.`);
      setTimeout(() => setItems((prev) => prev.slice(1)), 350);
    }
  };

  const reset = () => {
    setItems(INITIAL.map((value, i) => ({ id: i, value })));
    setNextId(INITIAL.length);
    setActive(null);
    setNote('Reset to the starting list.');
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setNote(
      m === 'stack'
        ? 'Stack: LIFO - push and pop both touch the top (right end) only.'
        : 'Queue: FIFO - enqueue touches the rear (right), dequeue touches the front (left).',
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            onClick={() => switchMode('stack')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'stack' ? 'bg-accent/15 text-accent' : 'bg-surface-2 text-muted hover:text-text',
            )}
          >
            Stack (LIFO)
          </button>
          <button
            onClick={() => switchMode('queue')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium transition-colors',
              mode === 'queue' ? 'bg-accent/15 text-accent' : 'bg-surface-2 text-muted hover:text-text',
            )}
          >
            Queue (FIFO)
          </button>
        </div>
        <button
          onClick={push}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
        >
          <i className="pi pi-plus text-[10px]" aria-hidden /> {mode === 'stack' ? 'Push' : 'Enqueue'}
        </button>
        <button
          onClick={pop}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
        >
          <i className="pi pi-minus text-[10px]" aria-hidden /> {mode === 'stack' ? 'Pop' : 'Dequeue'}
        </button>
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-faint transition-colors hover:text-text"
        >
          <i className="pi pi-refresh text-[10px]" aria-hidden /> Reset
        </button>
      </div>

      <div className="rounded-card border border-border bg-[#0b0d11] p-4">
        <div className="mb-2 flex justify-between font-mono text-[10px] text-faint">
          {mode === 'stack' ? (
            <>
              <span />
              <span className="text-accent">TOP →</span>
            </>
          ) : (
            <>
              <span className="text-accent">← FRONT</span>
              <span className="text-accent">REAR →</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {items.map((it) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-md border font-mono text-sm transition-colors',
                  active === it.id
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border-strong bg-surface-2 text-text',
                )}
              >
                {it.value}
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && <span className="font-mono text-xs text-faint">empty</span>}
        </div>
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
