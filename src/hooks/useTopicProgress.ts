'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSection, toggleBookmark } from '@/store/slices/progressSlice';
import { pct } from '@/lib/utils';

/**
 * Encapsulates all per-topic progress logic so components stay presentational.
 * Returns completion state + stable callbacks.
 */
export function useTopicProgress(slug: string, totalSections: number) {
  const dispatch = useAppDispatch();
  const topic = useAppSelector((s) => s.progress.byTopic[slug]);

  const completedSections = useMemo(() => topic?.completedSections ?? [], [topic]);
  const bookmarked = topic?.bookmarked ?? false;
  const quizBest = topic?.quizBest ?? 0;

  const isSectionDone = useCallback(
    (sectionId: string) => completedSections.includes(sectionId),
    [completedSections],
  );

  const onToggleSection = useCallback(
    (sectionId: string) => dispatch(toggleSection({ slug, sectionId })),
    [dispatch, slug],
  );

  const onToggleBookmark = useCallback(
    () => dispatch(toggleBookmark(slug)),
    [dispatch, slug],
  );

  const percent = pct(completedSections.length, totalSections);

  return {
    completedCount: completedSections.length,
    totalSections,
    percent,
    bookmarked,
    quizBest,
    isSectionDone,
    onToggleSection,
    onToggleBookmark,
  };
}
