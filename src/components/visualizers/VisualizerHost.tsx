'use client';

import dynamic from 'next/dynamic';
import type { VisualizerKind } from '@/types/content.types';
import { DS_MAP, ALGO_MAP, PATTERN_MAP, GRAPH_MAP } from '@/data/conceptMaps';

/** Lazy-load heavy visualizers so they never bloat the initial page bundle. */
const BigOChart = dynamic(() => import('./BigOChart').then((m) => m.BigOChart), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const ArrayOps = dynamic(() => import('./ArrayOps').then((m) => m.ArrayOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const ConceptMap = dynamic(() => import('./ConceptMap').then((m) => m.ConceptMap), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const LinkedListOps = dynamic(() => import('./LinkedListOps').then((m) => m.LinkedListOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const StackQueueOps = dynamic(() => import('./StackQueueOps').then((m) => m.StackQueueOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const TreeOps = dynamic(() => import('./TreeOps').then((m) => m.TreeOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const HeapOps = dynamic(() => import('./HeapOps').then((m) => m.HeapOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const HashTableOps = dynamic(() => import('./HashTableOps').then((m) => m.HashTableOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const DPTableOps = dynamic(() => import('./DPTableOps').then((m) => m.DPTableOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const FormulaOps = dynamic(() => import('./FormulaOps').then((m) => m.FormulaOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});
const BitOps = dynamic(() => import('./BitOps').then((m) => m.BitOps), {
  ssr: false,
  loading: () => <VizSkeleton />,
});

function VizSkeleton() {
  return (
    <div className="flex h-48 animate-pulse items-center justify-center rounded-card border border-border bg-surface-2 text-xs text-faint">
      Loading visualization…
    </div>
  );
}

/**
 * Single entry point that renders the correct interactive visualizer for a
 * section. Adding a new visualizer = add a case here + a VisualizerKind.
 */
export function VisualizerHost({ kind }: { kind: VisualizerKind }) {
  switch (kind) {
    case 'bigO-chart':
      return <BigOChart />;
    case 'array-ops':
      return <ArrayOps />;
    case 'ds-map':
      return <ConceptMap nodes={DS_MAP} />;
    case 'algo-map':
      return <ConceptMap nodes={ALGO_MAP} height={320} />;
    case 'pattern-map':
      return <ConceptMap nodes={PATTERN_MAP} height={420} />;
    case 'linked-list-ops':
      return <LinkedListOps />;
    case 'stack-queue-ops':
      return <StackQueueOps />;
    case 'tree-ops':
      return <TreeOps />;
    case 'graph-map':
      return <ConceptMap nodes={GRAPH_MAP} height={420} />;
    case 'heap-ops':
      return <HeapOps />;
    case 'hash-table-ops':
      return <HashTableOps />;
    case 'dp-table-ops':
      return <DPTableOps />;
    case 'formula-ops':
      return <FormulaOps />;
    case 'bit-ops':
      return <BitOps />;
    case 'none':
    default:
      return null;
  }
}
