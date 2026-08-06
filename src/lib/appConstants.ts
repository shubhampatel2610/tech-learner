/**
 * All user-facing strings and app-wide config live here so copy is centralized
 * and easy to audit / localize. Components never hardcode display strings.
 */

export const APP = {
  name: 'DSA Learner',
  tagline: 'Learn Data Structures & Algorithms the way engineers actually think.',
  description:
    'An interactive, engineering-focused platform to learn, visualize, and revise Data Structures & Algorithms from first principles to interview-ready.',
  repoUrl: 'https://github.com/your-org/dsa-learner',
  version: '1.0.0',
} as const;

export const XP = {
  perSectionComplete: 10,
  perQuizQuestion: 5,
  perTopicComplete: 50,
  dailyGoalMinutes: 30,
} as const;

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  topic: (slug: string) => `/topics/${slug}`,
} as const;

export const STORAGE_KEY = 'dsa-learner:v1';

export const NAV_LINKS = [
  { label: 'Learn', href: ROUTES.home, icon: 'pi pi-book' },
  { label: 'Dashboard', href: ROUTES.dashboard, icon: 'pi pi-chart-bar' },
] as const;

export const DIFFICULTY_META = {
  Beginner: { color: 'success', label: 'Beginner' },
  Intermediate: { color: 'warning', label: 'Intermediate' },
  Advanced: { color: 'danger', label: 'Advanced' },
} as const;

export const PROBLEM_DIFFICULTY_META = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger',
} as const;

export const EMPTY = {
  noBookmarks: 'No bookmarks yet. Tap the bookmark icon on any topic to pin it here.',
  noRecent: 'Nothing visited yet. Open a topic to start your streak.',
  quizDone: 'Quiz complete. Review the explanations, then try again to beat your best.',
} as const;
