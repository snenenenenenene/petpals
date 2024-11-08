// hooks/useUserPreferences.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notifications: boolean;
  language: string;
  customThemeColor?: string;
}

interface PreferencesStore {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const useUserPreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: {
        soundEnabled: true,
        musicEnabled: true,
        notifications: true,
        language: 'en',
      },
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
    }),
    {
      name: 'user-preferences',
    }
  )
);