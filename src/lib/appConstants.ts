/**
 * All user-facing strings and app-wide config live here so copy is centralized
 * and easy to audit / localize. Components never hardcode display strings.
 */

export const APP = {
  name: 'TechPath',
  tagline: 'Learn Data Structures & Algorithms the way engineers actually think.',
  description:
    'An interactive, engineering-focused platform to learn, visualize, and revise Data Structures & Algorithms from first principles to interview-ready.',
  repoUrl: 'https://github.com/your-org/techpath',
  version: '1.0.0',
} as const;

export const ROUTES = {
  home: '/',
  topic: (slug: string) => `/topics/${slug}`,
} as const;

export const STORAGE_KEY = 'techpath:v1';

export const NAV_LINKS = [
  { label: 'DSA', href: ROUTES.home, icon: 'pi pi-book' },
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
