// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '@/providers';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { locales } from '@/i18n/config';

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
		<html lang={locale} suppressHydrationWarning>
			<body>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Providers>
						{children}
						<ToastContainer />
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}