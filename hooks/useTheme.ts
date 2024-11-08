// hooks/useTheme.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeType = 'light' | 'dark' | 'system' | string;

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (newTheme) => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (newTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? 'dark' 
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(newTheme);
        }
        
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-preference',
    }
  )
);

// Add theme change listener
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = useTheme.getState().theme;
    if (currentTheme === 'system') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(e.matches ? 'dark' : 'light');
    }
  });
}