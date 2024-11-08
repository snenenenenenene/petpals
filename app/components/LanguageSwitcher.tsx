// components/LanguageSwitcher.tsx
'use client';

import { useRouter, usePathname } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';
import { locales } from '@/lib/i18n';
import { useLocale } from '@/hooks/useLocale';

export function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const { locale, setLocale } = useLocale();

	const handleLocaleChange = (newLocale: string) => {
		setLocale(newLocale as 'en' | 'nl');
		router.replace(pathname, { locale: newLocale });
	};

	return (
		<div className="flex items-center gap-2">
			<Globe className="h-4 w-4" />
			<select
				value={locale}
				onChange={(e) => handleLocaleChange(e.target.value)}
				className="bg-transparent border-none focus:outline-none text-sm"
			>
				<option value="en">English</option>
				<option value="nl">Nederlands</option>
			</select>
		</div>
	);
}