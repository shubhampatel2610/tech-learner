/** UI preference domain types. */

export type ThemeMode = 'dark' | 'light';

export interface PreferencesState {
  theme: ThemeMode;
  reducedMotion: boolean;
}
