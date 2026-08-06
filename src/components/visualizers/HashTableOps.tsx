'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BUCKET_COUNT = 7;
const WORDS = ['cat', 'dog', 'sun', 'sky', 'red', 'run', 'map', 'key', 'fox', 'owl', 'ice', 'gem'];

const hash = (s: string) => {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % BUCKET_COUNT;
  return h;
};

type Entry = { id: number; key: string };

/**
 * Interactive hash table visualizer: inserting a key computes its hash
 * (a simple polynomial rolling hash mod bucket count) and drops it into that
 * bucket's chain, making collisions visible as multiple chips stacked in one
 * column instead of an abstract "O(1) average, O(n) worst case" claim.
 */
export function HashTableOps() {
  const [buckets, setBuckets] = useState<Entry[][]>(() => Array.from({ length: BUCKET_COUNT }, () => []));
  const [nextId, setNextId] = useState(0);
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const [note, setNote] = useState('Insert a key to see it hash into a bucket. Insert enough and watch collisions chain.');
  const [used, setUsed] = useState<Set<string>>(new Set());

  const insert = () => {
    const pool = WORDS.filter((w) => !used.has(w));
    const key = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)]! : `k${nextId}`;
    const idx = hash(key);
    const id = nextId;
    setNextId((n) => n + 1);
    setUsed((prev) => new Set(prev).add(key));
    setBuckets((prev) => {
      const next = prev.map((b) => [...b]);
      next[idx]!.push({ id, key });
      return next;
    });
    setActiveBucket(idx);
    const collided = buckets[idx]!.length > 0;
    setNote(
      collided
        ? `hash("${key}") = ${idx} - bucket ${idx} already has an entry, so "${key}" chains onto it. Lookup here now costs O(chain length).`
        : `hash("${key}") = ${idx} - empty bucket, O(1) insert.`,
    );
    setTimeout(() => setActiveBucket(null), 900);
  };

  const lookup = () => {
    const keys = buckets.flat();
    if (keys.length === 0) {
      setNote('Nothing inserted yet.');
      return;
    }
    const target = keys[Math.floor(Math.random() * keys.length)]!;
    const idx = hash(target.key);
    setActiveBucket(idx);
    const chainPos = buckets[idx]!.findIndex((e) => e.id === target.id);
    setNote(`lookup("${target.key}") -> hash to bucket ${idx}, then scan ${chainPos + 1} entr${chainPos === 0 ? 'y' : 'ies'} in the chain to find it.`);
    setTimeout(() => setActiveBucket(null), 900);
  };

  const reset = () => {
    setBuckets(Array.from({ length: BUCKET_COUNT }, () => []));
    setUsed(new Set());
    setActiveBucket(null);
    setNote('Reset - all buckets empty.');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={insert}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
        >
          <i className="pi pi-plus text-[10px]" aria-hidden /> Insert random key
        </button>
        <button
          onClick={lookup}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text"
        >
          <i className="pi pi-search text-[10px]" aria-hidden /> Lookup random key
        </button>
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-faint transition-colors hover:text-text"
        >
          <i className="pi pi-refresh text-[10px]" aria-hidden /> Reset
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-card border border-border bg-[#0b0d11] p-3">
        {buckets.map((chain, idx) => (
          <div key={idx} className="flex min-w-[3.25rem] flex-1 flex-col items-center gap-1">
            <span
              className={cn(
                'font-mono text-[10px]',
                activeBucket === idx ? 'text-accent' : 'text-faint',
              )}
            >
              [{idx}]
            </span>
            <div
              className={cn(
                'flex min-h-[2.75rem] w-full flex-col items-center gap-1 rounded-md border p-1',
                activeBucket === idx ? 'border-accent bg-accent/10' : 'border-border-strong bg-surface-2',
              )}
            >
              <AnimatePresence>
                {chain.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full truncate rounded border border-border-strong bg-surface px-1.5 py-0.5 text-center font-mono text-[10px] text-text"
                  >
                    {entry.key}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
