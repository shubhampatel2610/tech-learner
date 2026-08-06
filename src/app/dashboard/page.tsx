'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetProgress } from '@/store/slices/progressSlice';
import { selectBookmarkedSlugs, selectRecentSlugs, selectStartedCount } from '@/store/selectors';
import { FULL_TOPICS, getTopic, TOTAL_SECTIONS } from '@/data/topics';
import { SectionCard } from '@/components/ui/SectionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES, EMPTY, XP } from '@/lib/appConstants';
import { dayKey, pct, cn } from '@/lib/utils';
import { useMounted } from '@/hooks/useMounted';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const mounted = useMounted();

  const xp = useAppSelector((s) => s.progress.xp);
  const streak = useAppSelector((s) => s.progress.streak);
  const activity = useAppSelector((s) => s.progress.activity);
  const byTopic = useAppSelector((s) => s.progress.byTopic);
  const started = useAppSelector(selectStartedCount);
  const bookmarks = useAppSelector(selectBookmarkedSlugs);
  const recents = useAppSelector(selectRecentSlugs);

  const completedSections = useMemo(
    () => Object.values(byTopic).reduce((n, t) => n + t.completedSections.length, 0),
    [byTopic],
  );
  const overallPct = pct(completedSections, TOTAL_SECTIONS);

  // last 12 weeks heatmap
  const days = useMemo(() => {
    const out: { key: string; minutes: number }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayKey(d);
      out.push({ key, minutes: activity[key] ?? 0 });
    }
    return out;
  }, [activity]);

  if (!mounted) {
    return <div className="h-64 animate-pulse rounded-card border border-border bg-surface-2" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text sm:text-2xl">Your dashboard</h1>
          <p className="text-xs text-muted">Progress is saved locally in your browser.</p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) dispatch(resetProgress());
          }}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-danger/40 hover:text-danger"
        >
          <i className="pi pi-trash mr-1 text-[10px]" aria-hidden />Reset
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="pi pi-bolt" label="Total XP" value={xp.toLocaleString()} accent />
        <StatCard icon="pi pi-calendar" label="Day streak" value={`${streak}`} suffix={streak === 1 ? 'day' : 'days'} />
        <StatCard icon="pi pi-check-circle" label="Sections done" value={`${completedSections}`} suffix={`/ ${TOTAL_SECTIONS}`} />
        <StatCard icon="pi pi-book" label="Topics started" value={`${started}`} suffix={`/ ${FULL_TOPICS.length}`} />
      </div>

      {/* Overall progress */}
      <SectionCard>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Overall completion</h2>
          <span className="font-mono text-xs text-muted">{overallPct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent-gradient transition-all" style={{ width: `${overallPct}%` }} />
        </div>
        <div className="mt-4 space-y-2">
          {FULL_TOPICS.map((t) => {
            const done = byTopic[t.slug]?.completedSections.length ?? 0;
            const p = pct(done, t.sections.length);
            return (
              <Link key={t.slug} href={ROUTES.topic(t.slug)} className="flex items-center gap-3 text-xs hover:opacity-80">
                <i className={`${t.icon} w-4 text-accent`} aria-hidden />
                <span className="w-40 shrink-0 truncate text-muted">{t.title}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-accent-gradient" style={{ width: `${p}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-faint">{p}%</span>
              </Link>
            );
          })}
        </div>
      </SectionCard>

      {/* Activity heatmap */}
      <SectionCard>
        <h2 className="mb-3 text-sm font-semibold text-text">Study activity</h2>
        <div className="flex flex-wrap gap-1">
          {days.map((d) => (
            <div
              key={d.key}
              title={`${d.key}: ${d.minutes} min`}
              className={cn(
                'h-3 w-3 rounded-sm',
                d.minutes === 0 && 'bg-surface-2',
                d.minutes > 0 && d.minutes < XP.dailyGoalMinutes / 2 && 'bg-accent/30',
                d.minutes >= XP.dailyGoalMinutes / 2 && d.minutes < XP.dailyGoalMinutes && 'bg-accent/60',
                d.minutes >= XP.dailyGoalMinutes && 'bg-accent',
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-faint">Last 12 weeks · darker = more time studied</p>
      </SectionCard>

      {/* Bookmarks + recent */}
      <div className="grid gap-3 sm:grid-cols-2">
        <SectionCard>
          <h2 className="mb-3 text-sm font-semibold text-text">Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <EmptyState icon="pi pi-bookmark" message={EMPTY.noBookmarks} />
          ) : (
            <div className="space-y-1.5">
              {bookmarks.map((slug) => {
                const t = getTopic(slug);
                if (!t) return null;
                return (
                  <Link key={slug} href={ROUTES.topic(slug)} className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-muted hover:text-text">
                    <i className={`${t.icon} text-accent`} aria-hidden />
                    {t.title}
                  </Link>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <h2 className="mb-3 text-sm font-semibold text-text">Recently visited</h2>
          {recents.length === 0 ? (
            <EmptyState icon="pi pi-history" message={EMPTY.noRecent} />
          ) : (
            <div className="space-y-1.5">
              {recents.slice(0, 5).map((slug) => {
                const t = getTopic(slug);
                if (!t) return null;
                return (
                  <Link key={slug} href={ROUTES.topic(slug)} className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-muted hover:text-text">
                    <i className={`${t.icon} text-accent`} aria-hidden />
                    {t.title}
                  </Link>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn('card p-4', accent && 'shadow-glow')}>
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-surface-2">
        <i className={`${icon} text-sm text-accent`} aria-hidden />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-text">{value}</span>
        {suffix && <span className="text-xs text-faint">{suffix}</span>}
      </div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}
