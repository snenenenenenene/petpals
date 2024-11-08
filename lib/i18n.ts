// lib/i18n.ts
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';
 
export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`@/messages/${locale}.json`)).default
}));

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });