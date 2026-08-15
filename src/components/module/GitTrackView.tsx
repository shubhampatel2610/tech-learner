'use client';

import { useMemo, useState } from 'react';
import { ALL_TOPIC_META, FULL_SLUGS, GIT_TOPICS, TOTAL_GIT_SECTIONS } from '@/data/topics';
import { TopicCard } from '@/components/common/TopicCard';
import { DifficultyFilter } from '@/components/common/DifficultyFilter';
import { StatItem } from '@/components/common/StatItem';
import type { Difficulty } from '@/types/content.types';

/**
 * The Git track's own page content: a themed banner (mirrors the DSA hero's
 * shape/gradient technique so the two tracks feel like the same product) plus
 * its 7-day roadmap grid. Lives on its own route (`/git`) rather than being
 * embedded in the DSA home page, so it gets its own banner and URL.
 */
export function GitTrackView() {
  const [filter, setFilter] = useState<'All' | Difficulty>('All');

  const gitTopics = useMemo(
    () =>
      ALL_TOPIC_META.filter(
        (t) => t.category === 'Git' && (filter === 'All' || t.difficulty === filter),
      ),
    [filter],
  );

  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-card border border-border bg-surface p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(16 185 129), transparent 70%)' }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {GIT_TOPICS.length} days · {TOTAL_GIT_SECTIONS} sections built in full depth
            </div>
            <h1 className="max-w-2xl text-2xl font-bold leading-tight text-text sm:text-3xl">
              Learn everything you need in <span className="gradient-text">Git</span> in 7 days.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Seven days, one hour each. The goal is not to memorise commands - it&apos;s to understand what Git is
              actually doing under the hood, so the commands stop feeling random.
            </p>

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
              <StatItem value={`${GIT_TOPICS.length}`} label="daily modules" />
              <StatItem value={`${TOTAL_GIT_SECTIONS}`} label="learning sections" />
              <StatItem value="Local -> Remote" label="to collaboration etiquette" />
            </div>
          </div>
        </div>
      </section>

      {/* 7-day roadmap */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text">7-day roadmap</h2>
            <p className="text-xs text-muted">Follow the days in order - each one builds on the last.</p>
          </div>
          <DifficultyFilter filter={filter} onChange={setFilter} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {gitTopics.map((meta) => (
            <TopicCard key={meta.slug} meta={meta} available={FULL_SLUGS.has(meta.slug)} />
          ))}
        </div>
      </section>
    </div>
  );
}
