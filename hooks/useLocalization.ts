// hooks/useLocalization.ts
import { useTranslations as useNextIntlTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export function useTranslations() {
  const t = useNextIntlTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Function to change the current locale
  const changeLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Function to format dates according to the current locale
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}) => {
    return new Intl.DateTimeFormat(locale, options).format(date);
  };

  // Function to format numbers according to the current locale
  const formatNumber = (number: number, options: Intl.NumberFormatOptions = {}) => {
    return new Intl.NumberFormat(locale, options).format(number);
  };

  return {
    t,                // The translation function
    locale,          // Current locale
    changeLocale,    // Function to change locale
    formatDate,      // Date formatter
    formatNumber,    // Number formatter
    pathname,        // Current path
  };
}