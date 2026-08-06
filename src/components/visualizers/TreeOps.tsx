'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/** Fixed 7-node complete binary tree, matching the cheatsheet's diagram. */
const NODES: { id: number; x: number; y: number }[] = [
  { id: 1, x: 50, y: 12 },
  { id: 2, x: 26, y: 42 },
  { id: 3, x: 74, y: 42 },
  { id: 4, x: 12, y: 76 },
  { id: 5, x: 38, y: 76 },
  { id: 6, x: 62, y: 76 },
  { id: 7, x: 88, y: 76 },
];
const EDGES: [number, number][] = [
  [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7],
];

type TraversalKind = 'preorder' | 'inorder' | 'postorder' | 'level';

const TRAVERSALS: Record<TraversalKind, { label: string; order: number[]; hint: string }> = {
  preorder: { label: 'Preorder (NLR)', order: [1, 2, 4, 5, 3, 6, 7], hint: 'Visit node, then left subtree, then right subtree.' },
  inorder: { label: 'Inorder (LNR)', order: [4, 2, 5, 1, 6, 3, 7], hint: 'Visit left subtree, then node, then right subtree - sorted order for a BST.' },
  postorder: { label: 'Postorder (LRN)', order: [4, 5, 2, 6, 7, 3, 1], hint: 'Visit left subtree, then right subtree, then node - used to delete/free a tree bottom-up.' },
  level: { label: 'Level Order (BFS)', order: [1, 2, 3, 4, 5, 6, 7], hint: 'Visit level by level, using a queue - shortest-path-style traversal.' },
};

/**
 * Interactive traversal visualizer over a fixed binary tree. Buttons animate
 * the visit order for each of the four classic traversals so "LNR" etc. is
 * something you watch happen, not just a mnemonic.
 */
export function TreeOps() {
  const [active, setActive] = useState<TraversalKind | null>(null);
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [note, setNote] = useState('Pick a traversal to watch the visit order unfold.');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = (kind: TraversalKind) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setActive(kind);
    setVisited([]);
    setCurrent(null);
    const { order, hint } = TRAVERSALS[kind];
    setNote(hint);
    order.forEach((id, i) => {
      const t = setTimeout(() => {
        setCurrent(id);
        setVisited((prev) => [...prev, id]);
      }, (i + 1) * 550);
      timers.current.push(t);
    });
    const doneT = setTimeout(() => setCurrent(null), (order.length + 1) * 550);
    timers.current.push(doneT);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setActive(null);
    setVisited([]);
    setCurrent(null);
    setNote('Pick a traversal to watch the visit order unfold.');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(TRAVERSALS) as TraversalKind[]).map((kind) => (
          <button
            key={kind}
            onClick={() => run(kind)}
            className={cn(
              'rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-text',
              active === kind && 'border-accent/40 text-text',
            )}
          >
            {TRAVERSALS[kind].label}
          </button>
        ))}
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-faint transition-colors hover:text-text"
        >
          <i className="pi pi-refresh text-[10px]" aria-hidden /> Reset
        </button>
      </div>

      <div className="relative h-56 rounded-card border border-border bg-[#0b0d11]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {EDGES.map(([a, b]) => {
            const from = NODES.find((n) => n.id === a)!;
            const to = NODES.find((n) => n.id === b)!;
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgb(48 54 64)"
                strokeWidth={0.6}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {NODES.map((n) => {
          const isCurrent = current === n.id;
          const wasVisited = visited.includes(n.id);
          const order = wasVisited ? visited.indexOf(n.id) + 1 : null;
          return (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs transition-colors',
                  isCurrent
                    ? 'border-accent bg-accent/20 text-accent'
                    : wasVisited
                      ? 'border-accent-2/50 bg-accent-2/10 text-text'
                      : 'border-border-strong bg-surface-2 text-text',
                )}
              >
                {n.id}
              </div>
              {order && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-[#04120d]">
                  {order}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="min-h-[1.25rem] text-xs text-muted" aria-live="polite">
        {note}
        {visited.length > 0 && (
          <span className="ml-1 font-mono text-faint">- visited: {visited.join(' → ')}</span>
        )}
      </p>
    </div>
  );
}
