// components/theme/ThemePicker.tsx
'use client';

import { motion } from 'framer-motion';
import { useThemeStore, defaultThemes, type Theme } from '@/lib/theme/theme-store';
import { Button } from '@/components/ui/Button';
import { Check, PaintBrush } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemePicker() {
	const { currentTheme, setTheme, customThemes } = useThemeStore();
	const allThemes = { ...defaultThemes, ...customThemes };

	return (
		<div className="grid grid-cols-2 gap-4">
			{Object.values(allThemes).map((theme) => (
				<ThemeOption
					key={theme.id}
					theme={theme}
					isSelected={currentTheme.id === theme.id}
					onSelect={() => setTheme(theme)}
				/>
			))}
		</div>
	);
}

function ThemeOption({
	theme,
	isSelected,
	onSelect
}: {
	theme: Theme;
	isSelected: boolean;
	onSelect: () => void;
}) {
	return (
		<motion.button
			className={cn(
				"relative p-4 rounded-lg border-2 transition-colors",
				isSelected ? "border-primary-500" : "border-transparent hover:border-primary-200"
			)}
			onClick={onSelect}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<div className="space-y-2">
				<div
					className="h-20 rounded-lg"
					style={{ background: theme.colors.primary[500] }}
				/>
				<div className="flex gap-2">
					{Object.values(theme.colors.accent).map((color, index) => (
						<div
							key={index}
							className="w-6 h-6 rounded-full"
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
			</div>

			<div className="mt-2 flex items-center justify-between">
				<span className="font-medium">{theme.name}</span>
				{isSelected && <Check className="w-4 h-4 text-primary-500" />}
			</div>
		</motion.button>
	);
}