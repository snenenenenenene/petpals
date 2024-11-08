// components/ThemePicker.tsx
'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { defaultThemes } from '@/lib/themes';
import { Button } from './ui/Button';
import { PaintBrush, Check } from 'lucide-react';

export function ThemePicker() {
	const { currentTheme, setTheme, customThemes } = useTheme();

	return (
		<div className="grid grid-cols-2 gap-4">
			{Object.values({ ...defaultThemes, ...customThemes }).map((theme) => (
				<motion.button
					key={theme.id}
					className={cn(
						"relative p-4 rounded-lg border-2 transition-colors",
						currentTheme === theme.id
							? "border-primary-500"
							: "border-transparent hover:border-primary-200"
					)}
					onClick={() => setTheme(theme.id)}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					{/* Theme Preview */}
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

					{/* Theme Name */}
					<div className="mt-2 flex items-center justify-between">
						<span className="font-medium">{theme.name}</span>
						{currentTheme === theme.id && (
							<Check className="w-4 h-4 text-primary-500" />
						)}
					</div>
				</motion.button>
			))}

			{/* Create Custom Theme Button */}
			<Button
				variant="outline"
				className="flex items-center gap-2"
				onClick={() => {/* Open theme creator */ }}
			>
				<PaintBrush className="w-4 h-4" />
				Create Custom Theme
			</Button>
		</div>
	);
}