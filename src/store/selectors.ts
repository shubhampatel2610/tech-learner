import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { pct } from '@/lib/utils';

const selectByTopic = (s: RootState) => s.progress.byTopic;

/** Bookmarked slugs, memoized. */
export const selectBookmarkedSlugs = createSelector([selectByTopic], (byTopic) =>
  Object.entries(byTopic)
    .filter(([, t]) => t.bookmarked)
    .map(([slug]) => slug),
);

/** Recently visited slugs, newest first. */
export const selectRecentSlugs = createSelector([selectByTopic], (byTopic) =>
  Object.entries(byTopic)
    .filter(([, t]) => t.lastVisitedAt !== null)
    .sort((a, b) => (b[1].lastVisitedAt ?? 0) - (a[1].lastVisitedAt ?? 0))
    .map(([slug]) => slug),
);

/** Completion % for a topic given its total section count. */
export const makeSelectTopicCompletion = (slug: string, totalSections: number) =>
  createSelector([selectByTopic], (byTopic) => {
    const done = byTopic[slug]?.completedSections.length ?? 0;
    return { done, total: totalSections, percent: pct(done, totalSections) };
  });

/** Count of topics with at least one completed section. */
export const selectStartedCount = createSelector([selectByTopic], (byTopic) =>
  Object.values(byTopic).filter((t) => t.completedSections.length > 0).length,
);
