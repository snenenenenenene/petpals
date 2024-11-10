// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '@/providers';
import { locales } from '@/i18n/config';
import { ToastContainer } from '../components/ui';

async function getMessages(locale: string) {
	try {
		return (await import(`@/messages/${locale}.json`)).default;
	} catch (error) {
		return {};
	}
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const locale = locales.includes(params.locale as any) ? params.locale : 'en';
	const messages = await getMessages(locale);

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<Providers>
				{/* <ToastContainer> */}
					{children}
				{/* </ToastContainer> */}
			</Providers>
		</NextIntlClientProvider>
	);
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}