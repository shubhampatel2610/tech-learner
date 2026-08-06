import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProgressState, TopicProgress } from '@/types/progress.types';
import { XP } from '@/lib/appConstants';
import { dayKey } from '@/lib/utils';

const emptyTopic = (): TopicProgress => ({
  completedSections: [],
  quizBest: 0,
  bookmarked: false,
  lastVisitedAt: null,
});

const initialState: ProgressState = {
  byTopic: {},
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  activity: {},
};

/** Ensure a topic bucket exists (mutation-safe under Immer). */
function ensure(state: ProgressState, slug: string): TopicProgress {
  if (!state.byTopic[slug]) state.byTopic[slug] = emptyTopic();
  return state.byTopic[slug] as TopicProgress;
}

/** Advance streak based on the gap since last active day. */
function touchStreak(state: ProgressState): void {
  const today = dayKey();
  if (state.lastActiveDay === today) return;
  if (state.lastActiveDay) {
    const prev = new Date(state.lastActiveDay);
    const diffDays = Math.round((Date.now() - prev.getTime()) / 86_400_000);
    state.streak = diffDays === 1 ? state.streak + 1 : 1;
  } else {
    state.streak = 1;
  }
  state.lastActiveDay = today;
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    hydrate: (_state, action: PayloadAction<ProgressState>) => action.payload,

    visitTopic: (state, action: PayloadAction<string>) => {
      const t = ensure(state, action.payload);
      t.lastVisitedAt = Date.now();
      touchStreak(state);
    },

    toggleSection: (
      state,
      action: PayloadAction<{ slug: string; sectionId: string }>,
    ) => {
      const { slug, sectionId } = action.payload;
      const t = ensure(state, slug);
      const idx = t.completedSections.indexOf(sectionId);
      if (idx >= 0) {
        t.completedSections.splice(idx, 1);
        state.xp = Math.max(0, state.xp - XP.perSectionComplete);
      } else {
        t.completedSections.push(sectionId);
        state.xp += XP.perSectionComplete;
      }
    },

    toggleBookmark: (state, action: PayloadAction<string>) => {
      const t = ensure(state, action.payload);
      t.bookmarked = !t.bookmarked;
    },

    recordQuiz: (
      state,
      action: PayloadAction<{ slug: string; score: number; correct: number }>,
    ) => {
      const { slug, score, correct } = action.payload;
      const t = ensure(state, slug);
      if (score > t.quizBest) {
        t.quizBest = score;
      }
      state.xp += correct * XP.perQuizQuestion;
      touchStreak(state);
    },

    logStudyMinutes: (state, action: PayloadAction<number>) => {
      const key = dayKey();
      state.activity[key] = (state.activity[key] ?? 0) + action.payload;
    },

    resetProgress: () => initialState,
  },
});

export const {
  hydrate,
  visitTopic,
  toggleSection,
  toggleBookmark,
  recordQuiz,
  logStudyMinutes,
  resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
