import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_KEY = 'motomoto_theme';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => Promise<void>;
  rehydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: 'system',

  setPreference: async (pref: ThemePreference) => {
    await SecureStore.setItemAsync(THEME_KEY, pref);
    set({ preference: pref });
  },

  rehydrate: async () => {
    const stored = await SecureStore.getItemAsync(THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      set({ preference: stored });
    }
  },
}));
