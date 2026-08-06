'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { FlashCard } from '@/types/content.types';
import { shuffle } from '@/lib/utils';

/**
 * Flashcard deck: flip to reveal, mark learned (removes from the active queue),
 * shuffle, and reset. Learned state is component-local (a revision session).
 */
export function Flashcards({ cards }: { cards: FlashCard[] }) {
  const [order, setOrder] = useState<FlashCard[]>(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learned, setLearned] = useState<Set<string>>(new Set());

  const queue = useMemo(() => order.filter((c) => !learned.has(c.id)), [order, learned]);
  const card = queue[index % Math.max(queue.length, 1)];

  const next = (delta: number) => {
    setFlipped(false);
    setIndex((i) => (queue.length ? (i + delta + queue.length) % queue.length : 0));
  };

  const markLearned = () => {
    if (!card) return;
    setLearned((prev) => new Set(prev).add(card.id));
    setFlipped(false);
    setIndex(0);
  };

  const reshuffle = () => {
    setOrder(shuffle(order));
    setIndex(0);
    setFlipped(false);
  };

  const resetDeck = () => {
    setLearned(new Set());
    setOrder(cards);
    setIndex(0);
    setFlipped(false);
  };

  if (!card) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <i className="pi pi-check-circle text-2xl text-success" aria-hidden />
        <p className="text-sm text-text">All {cards.length} cards marked learned.</p>
        <button onClick={resetDeck} className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-text">
          Reset deck
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-faint">
        <span className="font-mono">
          {queue.length} left · {learned.size} learned
        </span>
        <div className="flex gap-2">
          <button onClick={reshuffle} className="hover:text-text">
            <i className="pi pi-sync mr-1" aria-hidden />Shuffle
          </button>
          <button onClick={resetDeck} className="hover:text-text">
            <i className="pi pi-refresh mr-1" aria-hidden />Reset
          </button>
        </div>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full"
        style={{ perspective: 1000 }}
        aria-label="Flip card"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative h-40"
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-card border border-border bg-surface-2 p-5 text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] uppercase tracking-wide text-faint">Question</span>
            <p className="text-sm font-medium text-text">{card.front}</p>
            <span className="mt-1 text-[10px] text-faint">tap to flip</span>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-card border border-accent/30 bg-accent/5 p-5 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-[10px] uppercase tracking-wide text-accent">Answer</span>
            <p className="text-sm text-text">{card.back}</p>
          </div>
        </motion.div>
      </button>

      <div className="flex items-center gap-2">
        <button onClick={() => next(-1)} className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-text">
          <i className="pi pi-chevron-left text-[10px]" aria-hidden /> Prev
        </button>
        <button
          onClick={markLearned}
          className="rounded-md border border-success/40 bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20"
        >
          <i className="pi pi-check text-[10px]" aria-hidden /> Mark learned
        </button>
        <button onClick={() => next(1)} className="ml-auto rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-text">
          Next <i className="pi pi-chevron-right text-[10px]" aria-hidden />
        </button>
      </div>
    </div>
  );
}
