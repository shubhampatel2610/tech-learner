import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_FULL_TOPICS, getTopic } from '@/data/topics';
import { TopicView } from '@/components/module/TopicView';

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * Only the fully-built topics are valid routes. Any other slug (e.g. a roadmap
 * placeholder) returns a real 404 instead of being rendered on demand.
 */
export const dynamicParams = false;

/** Pre-render all full topics (every track) at build time. */
export function generateStaticParams() {
  return ALL_FULL_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: 'Topic not found' };
  return {
    title: topic.title,
    description: topic.tagline,
  };
}

export default async function TopicPage({ params }: Params) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();
  return <TopicView topic={topic} />;
}
