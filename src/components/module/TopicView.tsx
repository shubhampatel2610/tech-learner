'use client';

import Link from 'next/link';
import type { Topic } from '@/types/content.types';
import { getTopic } from '@/data/topics';
import { ROUTES, DIFFICULTY_META } from '@/lib/appConstants';
import { formatMinutes, cn } from '@/lib/utils';

import { Badge } from '@/components/ui/Badge';
import { SectionCard } from '@/components/ui/SectionCard';
import { Markdown } from '@/components/ui/Markdown';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { VisualizerHost } from '@/components/visualizers/VisualizerHost';
import { ComplexityTable } from '@/components/module/ComplexityTable';
import { DryRunStepper } from '@/components/module/DryRunStepper';
import { Flashcards } from '@/components/module/Flashcards';
import { PracticeList } from '@/components/module/PracticeList';

type Tone = 'success' | 'warning' | 'danger';

export function TopicView({ topic }: { topic: Topic }) {
  const diffTone = DIFFICULTY_META[topic.difficulty].color as Tone;
  const backHref = topic.category === 'Git' ? ROUTES.git : ROUTES.home;
  const backLabel = topic.category === 'Git' ? 'All Git days' : 'All topics';

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Breadcrumb + header */}
      <div>
        <Link href={backHref} className="mb-4 inline-flex items-center gap-1 text-xs text-muted hover:text-text">
          <i className="pi pi-arrow-left text-[10px]" aria-hidden /> {backLabel}
        </Link>

        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-gradient text-[#04120d]">
            <i className={`${topic.icon} text-lg`} aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text sm:text-2xl">{topic.title}</h1>
            <p className="mt-1 text-sm text-muted">{topic.tagline}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <Badge tone={diffTone}>{topic.difficulty}</Badge>
          <span className="chip">
            <i className="pi pi-clock text-[10px]" aria-hidden /> {formatMinutes(topic.estMinutes)}
          </span>
          {topic.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>

      {/* Overview + why */}
      <div className="grid gap-3 sm:grid-cols-2">
        <SectionCard>
          <h2 className="mb-2 text-sm font-semibold text-text">Overview</h2>
          <p className="text-sm leading-relaxed text-muted">{topic.overview}</p>
        </SectionCard>
        <SectionCard>
          <h2 className="mb-2 text-sm font-semibold text-text">Why it exists</h2>
          <p className="text-sm leading-relaxed text-muted">{topic.whyItExists}</p>
        </SectionCard>
      </div>

      {/* Core learning sections */}
      <section className="space-y-3">
        <SectionHeading icon="pi pi-book" title="Concepts" />
        {topic.sections.map((section, i) => {
          return (
            <SectionCard key={section.id} as="article">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
                  <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </h3>
              </div>
              <Markdown>{section.body}</Markdown>
              {section.visualizer && section.visualizer !== 'none' && (
                <div className="mt-4">
                  <VisualizerHost kind={section.visualizer} />
                </div>
              )}
            </SectionCard>
          );
        })}
      </section>

      {/* Complexity */}
      {topic.complexity && topic.complexity.length > 0 && (
        <section className="space-y-3">
          <SectionHeading icon="pi pi-chart-bar" title="Complexity reference" />
          <ComplexityTable rows={topic.complexity} />
        </section>
      )}

      {/* Dry runs */}
      {topic.dryRuns && topic.dryRuns.length > 0 && (
        <section className="space-y-3">
          <SectionHeading icon="pi pi-play" title="Dry runs" subtitle="Step through the logic one move at a time." />
          <div className="grid gap-3 lg:grid-cols-2">
            {topic.dryRuns.map((run) => (
              <DryRunStepper key={run.title} run={run} />
            ))}
          </div>
        </section>
      )}

      {/* Worked examples */}
      {topic.examples && topic.examples.length > 0 && (
        <section className="space-y-3">
          <SectionHeading icon="pi pi-code" title="Worked examples" />
          {topic.examples.map((ex) => {
            const tone = DIFFICULTY_META[ex.level].color as Tone;
            return (
              <SectionCard key={ex.title}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-text">{ex.title}</h3>
                  <Badge tone={tone}>{ex.level}</Badge>
                </div>
                <p className="mb-2 text-sm text-muted"><span className="font-medium text-text">Problem: </span>{ex.problem}</p>
                <p className="mb-3 text-sm text-muted"><span className="font-medium text-text">Approach: </span>{ex.approach}</p>
                <CodeBlock samples={ex.code} />
                <p className="mt-2 font-mono text-xs text-faint">Complexity: {ex.complexity}</p>
              </SectionCard>
            );
          })}
        </section>
      )}

      {/* Insight grid: advantages / disadvantages / mistakes / edge cases */}
      <section className="space-y-3">
        <SectionHeading icon="pi pi-lightbulb" title="Engineering insight" />
        <div className="grid gap-3 sm:grid-cols-2">
          <InsightList title="Advantages" icon="pi pi-thumbs-up" tone="success" items={topic.advantages} />
          <InsightList title="Disadvantages" icon="pi pi-thumbs-down" tone="warning" items={topic.disadvantages} />
          <InsightList title="Common mistakes" icon="pi pi-exclamation-triangle" tone="danger" items={topic.commonMistakes} />
          <InsightList title="Edge cases" icon="pi pi-flag" tone="accent" items={topic.edgeCases} />
        </div>
      </section>

      {/* Interview + real world */}
      <div className="grid gap-3 sm:grid-cols-2">
        <SectionCard>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
            <i className="pi pi-briefcase text-accent" aria-hidden /> Interview tips
          </h3>
          <ul className="ml-4 list-disc space-y-1.5 text-xs text-muted">
            {topic.interviewTips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </SectionCard>
        <SectionCard>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
            <i className="pi pi-globe text-accent" aria-hidden /> Real-world uses
          </h3>
          <ul className="ml-4 list-disc space-y-1.5 text-xs text-muted">
            {topic.realWorldUseCases.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </SectionCard>
      </div>

      {/* Flashcards */}
      <section className="space-y-3">
        <SectionHeading icon="pi pi-clone" title="Flashcards" subtitle="Flip to test recall, mark cards as you learn them." />
        <Flashcards cards={topic.flashcards} />
      </section>

      {/* Practice */}
      <section className="space-y-3">
        <SectionHeading icon="pi pi-flag" title="Practice problems" />
        <PracticeList problems={topic.practice} />
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <SectionHeading icon="pi pi-comments" title="FAQ" />
        <div className="space-y-2">
          {topic.faqs.map((f) => (
            <SectionCard key={f.question}>
              <h3 className="mb-1 text-sm font-semibold text-text">{f.question}</h3>
              <p className="text-sm text-muted">{f.answer}</p>
            </SectionCard>
          ))}
        </div>
      </section>

      {/* Related + references */}
      <div className="grid gap-3 sm:grid-cols-2">
        {topic.relatedSlugs.length > 0 && (
          <SectionCard>
            <h3 className="mb-2 text-sm font-semibold text-text">Related topics</h3>
            <div className="flex flex-wrap gap-2">
              {topic.relatedSlugs.map((slug) => {
                const rel = getTopic(slug);
                if (!rel) return null;
                return (
                  <Link
                    key={slug}
                    href={ROUTES.topic(slug)}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-text"
                  >
                    <i className={`${rel.icon} text-[11px]`} aria-hidden />
                    {rel.title}
                  </Link>
                );
              })}
            </div>
          </SectionCard>
        )}
        <SectionCard>
          <h3 className="mb-2 text-sm font-semibold text-text">References</h3>
          <ul className="space-y-1.5">
            {topic.references.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs link-accent">
                  {r.label} <i className="pi pi-external-link text-[10px]" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2">
      <i className={`${icon} text-accent`} aria-hidden />
      <div>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}

function InsightList({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: string;
  tone: 'success' | 'warning' | 'danger' | 'accent';
  items: string[];
}) {
  const toneText = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    accent: 'text-accent',
  }[tone];
  return (
    <SectionCard>
      <h3 className={cn('mb-2 flex items-center gap-2 text-sm font-semibold', 'text-text')}>
        <i className={`${icon} ${toneText}`} aria-hidden /> {title}
      </h3>
      <ul className="ml-4 list-disc space-y-1.5 text-xs text-muted">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </SectionCard>
  );
}
