/** User progress + UI preference domain types. */

export type ThemeMode = 'dark' | 'light';

export interface TopicProgress {
  /** Section ids the user has marked complete. */
  completedSections: string[];
  /** Best quiz score (0..1). */
  quizBest: number;
  bookmarked: boolean;
  lastVisitedAt: number | null;
}

export interface ProgressState {
  /** slug -> progress. Normalized by slug. */
  byTopic: Record<string, TopicProgress>;
  xp: number;
  streak: number;
  lastActiveDay: string | null;
  /** ISO date -> minutes studied, powers the heatmap. */
  activity: Record<string, number>;
}

export interface PreferencesState {
  theme: ThemeMode;
  reducedMotion: boolean;
}
