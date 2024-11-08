// hooks/useLocale.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Locale, locales } from '@/lib/i18n';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocale = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (newLocale) => set({ locale: newLocale }),
    }),
    {
      name: 'locale-storage',
    }
  )
);

