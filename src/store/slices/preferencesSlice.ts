import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PreferencesState, ThemeMode } from '@/types/progress.types';

const initialState: PreferencesState = {
  theme: 'dark',
  reducedMotion: false,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    hydratePrefs: (_state, action: PayloadAction<PreferencesState>) => action.payload,
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
    },
  },
});

export const {
  hydratePrefs,
  setTheme,
  toggleTheme,
  setReducedMotion,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
