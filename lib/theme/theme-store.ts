// lib/theme/theme-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    sage: string;
    rose: string;
    lavender: string;
    moss: string;
  };
  background: string;
  foreground: string;
  muted: string;
  card: string;
  border: string;
}

export interface Theme {
  name: string;
  id: string;
  colors: ThemeColors;
}

interface ThemeState {
  currentTheme: Theme;
  mode: ThemeMode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: ThemeMode) => void;
  customThemes: Record<string, Theme>;
  addCustomTheme: (theme: Theme) => void;
  removeCustomTheme: (themeId: string) => void;
}

export const defaultThemes: Record<string, Theme> = {
  cottage: {
    name: "Cottage Core",
    id: "cottage",
    colors: {
      primary: {
        50: '#f5f3e8',
        100: '#e6dcc6',
        200: '#d4bc94',
        300: '#c19b6c',
        400: '#a67c4e',
        500: '#8b5e2f',
        600: '#704d26',
        700: '#553c1d',
        800: '#3a2b14',
        900: '#1f1a0b',
      },
      accent: {
        sage: '#94a984',
        rose: '#d4a5a5',
        lavender: '#9890b8',
        moss: '#657153',
      },
      background: '#faf9f7',
      foreground: '#1f1a0b',
      muted: '#e8e4dc',
      card: '#ffffff',
      border: '#d1c9be',
    },
  },
  midnight: {
    name: "Midnight",
    id: "midnight",
    colors: {
      primary: {
        50: '#eceeff',
        100: '#d8ddff',
        200: '#b1baff',
        300: '#8a97ff',
        400: '#6374ff',
        500: '#3c51ff',
        600: '#3041cc',
        700: '#243199',
        800: '#182166',
        900: '#0c1033',
      },
      accent: {
        sage: '#7c9ce8',
        rose: '#ff9ecd',
        lavender: '#b69eff',
        moss: '#84ffdb',
      },
      background: '#0f172a',
      foreground: '#e2e8f0',
      muted: '#1e293b',
      card: '#1e293b',
      border: '#334155',
    }
  },
  forest: {
    name: "Forest",
    id: "forest",
    colors: {
      primary: {
        50: '#f2f7f4',
        100: '#ddeae1',
        200: '#bcd4c5',
        300: '#94b6a1',
        400: '#729880',
        500: '#557b63',
        600: '#44624f',
        700: '#354c3d',
        800: '#25352b',
        900: '#141d17',
      },
      accent: {
        sage: '#8fab7f',
        rose: '#c1796d',
        lavender: '#8c7f9c',
        moss: '#4b5d3e',
      },
      background: '#f8faf9',
      foreground: '#141d17',
      muted: '#e6ede8',
      card: '#ffffff',
      border: '#ccd9d0',
    },
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: defaultThemes.cottage,
      mode: 'system',
      customThemes: {},

      setTheme: (theme) => {
        set({ currentTheme: theme });
        updateDocumentTheme(theme);
      },

      setMode: (mode) => {
        set({ mode });
        updateDocumentMode(mode);
      },

      addCustomTheme: (theme) => {
        set((state) => ({
          customThemes: {
            ...state.customThemes,
            [theme.id]: theme,
          },
        }));
      },

      removeCustomTheme: (themeId) => {
        set((state) => {
          const { [themeId]: removed, ...rest } = state.customThemes;
          return { customThemes: rest };
        });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

function updateDocumentTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, value);
  });
  Object.entries(theme.colors.accent).forEach(([key, value]) => {
    root.style.setProperty(`--accent-${key}`, value);
  });
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--border', theme.colors.border);
}

function updateDocumentMode(mode: ThemeMode) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  root.classList.remove('light', 'dark');
  if (mode === 'system') {
    root.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    root.classList.add(mode);
  }
}

// Add system theme change listener
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (useThemeStore.getState().mode === 'system') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(e.matches ? 'dark' : 'light');
    }
  });
}