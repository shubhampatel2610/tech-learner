'use client';

import { useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

export interface ConceptNode {
  id: string;
  label: string;
  /** 0 = root, 1 = category, 2 = leaf. Drives styling + column. */
  level: 0 | 1 | 2;
  parent?: string;
  note?: string;
}

const LEVEL_STYLE: Record<number, React.CSSProperties> = {
  0: {
    background: 'linear-gradient(120deg, rgb(16 185 129), rgb(20 184 166))',
    color: '#04120d',
    border: 'none',
    fontWeight: 600,
  },
  1: {
    background: 'rgb(22 25 31)',
    color: 'rgb(232 234 238)',
    border: '1px solid rgb(48 54 64)',
  },
  2: {
    background: 'rgb(15 17 21)',
    color: 'rgb(150 156 168)',
    border: '1px solid rgb(32 36 44)',
  },
};

/**
 * Generic taxonomy renderer. Feed it a flat list of ConceptNodes and it lays
 * them out in columns by level and draws parent→child edges. Reused for both
 * the data-structures and algorithms maps (DRY).
 */
export function ConceptMap({ nodes: concept, height = 380 }: { nodes: ConceptNode[]; height?: number }) {
  const { nodes, edges } = useMemo(() => {
    const byLevel: Record<number, ConceptNode[]> = { 0: [], 1: [], 2: [] };
    concept.forEach((n) => byLevel[n.level]?.push(n));

    const colX: Record<number, number> = { 0: 0, 1: 260, 2: 560 };
    const flowNodes: Node[] = [];

    (Object.keys(byLevel) as unknown as Array<0 | 1 | 2>).forEach((lvl) => {
      const list = byLevel[lvl] ?? [];
      const gap = (height - 40) / Math.max(list.length, 1);
      list.forEach((n, i) => {
        flowNodes.push({
          id: n.id,
          data: { label: n.label },
          position: { x: colX[lvl] ?? 0, y: 20 + i * gap },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          style: {
            ...LEVEL_STYLE[lvl],
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 12,
            width: lvl === 2 ? 180 : 150,
            fontFamily: 'var(--font-mono), monospace',
          },
        });
      });
    });

    const flowEdges: Edge[] = concept
      .filter((n) => n.parent)
      .map((n) => ({
        id: `${n.parent}-${n.id}`,
        source: n.parent as string,
        target: n.id,
        animated: false,
        style: { stroke: 'rgb(48 54 64)' },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgb(48 54 64)' },
      }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [concept, height]);

  return (
    <div className="overflow-hidden rounded-card border border-border bg-[#0b0d11]" style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={false}
        zoomOnScroll={false}
        preventScrolling={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="rgb(32 36 44)" />
        <Controls showInteractive={false} className="!border-border !bg-surface-2" />
      </ReactFlow>
    </div>
  );
}
