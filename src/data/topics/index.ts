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
import { gitDay1Topic } from './gitDay1Const';
import { gitDay2Topic } from './gitDay2Const';
import { gitDay3Topic } from './gitDay3Const';
import { gitDay4Topic } from './gitDay4Const';
import { gitDay5Topic } from './gitDay5Const';
import { gitDay6Topic } from './gitDay6Const';
import { gitDay7Topic } from './gitDay7Const';

/**
 * TOPIC REGISTRY
 *
 * `FULL_TOPICS` are complete, fully-built DSA learning modules. Adding another
 * is a pure data change: create `xyzConst.ts` exporting a `Topic`, import it,
 * and add it to this array - no UI/component code changes required
 * (Open/Closed).
 *
 * All 15 DSA cheatsheet sections are now built.
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
 * `GIT_TOPICS` are the "Git in 7 Days" track - same `Topic` contract as
 * `FULL_TOPICS`, just tagged `category: 'Git'` so the home page can render
 * them as their own section after the DSA roadmap. Adding a Day 8+ module is
 * the same pure data change as adding a DSA topic.
 */
export const GIT_TOPICS: Topic[] = [
  gitDay1Topic,
  gitDay2Topic,
  gitDay3Topic,
  gitDay4Topic,
  gitDay5Topic,
  gitDay6Topic,
  gitDay7Topic,
];

/** Every fully-built topic across all tracks - used for routing and lookups. */
export const ALL_FULL_TOPICS: Topic[] = [...FULL_TOPICS, ...GIT_TOPICS];

/**
 * No roadmap placeholders left - every cheatsheet section (1-15) has a full
 * Topic. Kept as an empty, typed array so the "planned" roadmap UI degrades
 * gracefully if a future cheatsheet revision adds a 16th section here.
 */
export const ROADMAP_META: TopicMeta[] = [];

/** Derive lightweight meta from a full Topic. `category` defaults to 'DSA'. */
export function toMeta(t: Topic): TopicMeta {
  return {
    slug: t.slug,
    order: t.order,
    category: t.category ?? 'DSA',
    title: t.title,
    tagline: t.tagline,
    difficulty: t.difficulty,
    icon: t.icon,
    estMinutes: t.estMinutes,
    tags: t.tags,
  };
}

/** All topic metas (every track) + roadmap placeholders, ordered by number. */
export const ALL_TOPIC_META: TopicMeta[] = [
  ...ALL_FULL_TOPICS.map(toMeta),
  ...ROADMAP_META,
].sort((a, b) => a.order - b.order);

/** Slugs that have full content built. */
export const FULL_SLUGS = new Set(ALL_FULL_TOPICS.map((t) => t.slug));

/** Lookup a full topic by slug, across all tracks. */
export function getTopic(slug: string): Topic | undefined {
  return ALL_FULL_TOPICS.find((t) => t.slug === slug);
}

/** Total number of sections across DSA topics - powers the home page hero stat. */
export const TOTAL_SECTIONS = FULL_TOPICS.reduce((n, t) => n + t.sections.length, 0);

/** Total number of sections across the Git track - powers its own section stat. */
export const TOTAL_GIT_SECTIONS = GIT_TOPICS.reduce((n, t) => n + t.sections.length, 0);
