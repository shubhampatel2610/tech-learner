'use client';

import Link from 'next/link';
import type { TopicMeta } from '@/types/content.types';
import { Badge } from '@/components/ui/Badge';
import { ROUTES, DIFFICULTY_META } from '@/lib/appConstants';
import { formatMinutes } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';

type Tone = 'success' | 'warning' | 'danger';

/**
 * A single topic entry on the roadmap. Full topics link through and show live
 * completion; roadmap placeholders render as non-clickable "planned" cards.
 */
export function TopicCard({ meta, available }: { meta: TopicMeta; available: boolean }) {
  const progress = useAppSelector((s) => s.progress.byTopic[meta.slug]);
  const completed = progress?.completedSections.length ?? 0;
  const bookmarked = progress?.bookmarked ?? false;
  const diffTone = DIFFICULTY_META[meta.difficulty].color as Tone;

  const inner = (
    <div
      className={cn(
        'card group relative flex h-full flex-col gap-3 p-4 transition-all',
        available ? 'hover:border-accent/40 hover:shadow-glow' : 'opacity-60',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-gradient text-[#04120d]">
          <i className={`${meta.icon} text-sm`} aria-hidden />
        </div>
        <div className="flex items-center gap-1.5">
          {bookmarked && <i className="pi pi-bookmark-fill text-xs text-accent" aria-hidden />}
          <span className="font-mono text-[11px] text-faint">#{meta.order}</span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-text">{meta.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{meta.tagline}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={diffTone}>{meta.difficulty}</Badge>
        <span className="chip">
          <i className="pi pi-clock text-[10px]" aria-hidden />
          {formatMinutes(meta.estMinutes)}
        </span>
        {available ? (
          completed > 0 && (
            <span className="chip border-accent/30 text-accent">
              <i className="pi pi-check text-[10px]" aria-hidden />
              {completed} done
            </span>
          )
        ) : (
          <span className="chip">Planned</span>
        )}
      </div>
    </div>
  );

  if (!available) return inner;

  return (
    <Link href={ROUTES.topic(meta.slug)} className="block h-full">
      {inner}
    </Link>
  );
}
