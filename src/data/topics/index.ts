import type { Topic, TopicMeta } from '@/types/content.types';
import { complexityTopic } from './complexityConst';
import { dataStructuresTopic } from './dataStructuresConst';
import { algorithmsTopic } from './algorithmsConst';
import { commonPatternsTopic } from './commonPatternsConst';
import { arraysStringsTopic } from './arraysStringsConst';
import { linkedListTopic } from './linkedListConst';
import { stackQueueTopic } from './stackQueueConst';
import { treesTopic } from './treesConst';
import { graphsTopic } from './graphsConst';
import { heapTopic } from './heapConst';
import { hashTableTopic } from './hashTableConst';
import { dynamicProgrammingTopic } from './dynamicProgrammingConst';
import { formulasTopic } from './formulasConst';
import { bitManipulationTopic } from './bitManipulationConst';
import { goldenRulesTopic } from './goldenRulesConst';

/**
 * TOPIC REGISTRY
 *
 * `FULL_TOPICS` are complete, fully-built learning modules. Adding another is a
 * pure data change: create `xyzConst.ts` exporting a `Topic`, import it, and add
 * it to this array - no UI/component code changes required (Open/Closed).
 *
 * All 15 cheatsheet sections are now built.
 */
export const FULL_TOPICS: Topic[] = [
  complexityTopic,
  dataStructuresTopic,
  algorithmsTopic,
  commonPatternsTopic,
  arraysStringsTopic,
  linkedListTopic,
  stackQueueTopic,
  treesTopic,
  graphsTopic,
  heapTopic,
  hashTableTopic,
  dynamicProgrammingTopic,
  formulasTopic,
  bitManipulationTopic,
  goldenRulesTopic,
];

/**
 * No roadmap placeholders left - every cheatsheet section (1-15) has a full
 * Topic. Kept as an empty, typed array so the "planned" roadmap UI degrades
 * gracefully if a future cheatsheet revision adds a 16th section here.
 */
export const ROADMAP_META: TopicMeta[] = [];

/** Derive lightweight meta from a full Topic. */
export function toMeta(t: Topic): TopicMeta {
  return {
    slug: t.slug,
    order: t.order,
    title: t.title,
    tagline: t.tagline,
    difficulty: t.difficulty,
    icon: t.icon,
    estMinutes: t.estMinutes,
    tags: t.tags,
  };
}

/** Full-topic metas + roadmap placeholders, ordered by cheatsheet number. */
export const ALL_TOPIC_META: TopicMeta[] = [
  ...FULL_TOPICS.map(toMeta),
  ...ROADMAP_META,
].sort((a, b) => a.order - b.order);

/** Slugs that have full content built. */
export const FULL_SLUGS = new Set(FULL_TOPICS.map((t) => t.slug));

/** Lookup a full topic by slug. */
export function getTopic(slug: string): Topic | undefined {
  return FULL_TOPICS.find((t) => t.slug === slug);
}

/** Total number of sections across full topics - powers the home page stat. */
export const TOTAL_SECTIONS = FULL_TOPICS.reduce((n, t) => n + t.sections.length, 0);
