'use client';

import { useMemo, useState } from 'react';
import { ALL_TOPIC_META, FULL_SLUGS, FULL_TOPICS, TOTAL_SECTIONS } from '@/data/topics';
import { TopicCard } from '@/components/common/TopicCard';
import { DifficultyFilter } from '@/components/common/DifficultyFilter';
import { StatItem } from '@/components/common/StatItem';
import { APP } from '@/lib/appConstants';
import type { Difficulty } from '@/types/content.types';

export default function HomePage() {
  const [filter, setFilter] = useState<'All' | Difficulty>('All');

  const dsaTopics = useMemo(
    () =>
      ALL_TOPIC_META.filter(
        (t) => t.category === 'DSA' && (filter === 'All' || t.difficulty === filter),
      ),
    [filter],
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-card border border-border bg-surface p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgb(16 185 129), transparent 70%)' }}
        />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            15 topics · {FULL_TOPICS.length} built in full depth
          </div>
          <h1 className="max-w-2xl text-2xl font-bold leading-tight text-text sm:text-3xl">
            Learn DSA the way engineers <span className="gradient-text">actually think.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{APP.description}</p>

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
            <StatItem value={`${FULL_TOPICS.length}`} label="deep-dive topics" />
            <StatItem value={`${TOTAL_SECTIONS}`} label="learning sections" />
            <StatItem value="Interactive" label="visualizers + quizzes" />
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text">Learning roadmap</h2>
            <p className="text-xs text-muted">Follow the cheatsheet order, or jump to what you need.</p>
          </div>
          <DifficultyFilter filter={filter} onChange={setFilter} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {dsaTopics.map((meta) => (
            <TopicCard key={meta.slug} meta={meta} available={FULL_SLUGS.has(meta.slug)} />
          ))}
        </div>
      </section>
    </div>
  );
}
