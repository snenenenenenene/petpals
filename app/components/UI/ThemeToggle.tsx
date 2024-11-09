// components/theme/ThemeToggle.tsx
'use client';

import { useThemeStore } from '@/lib/theme/theme-store';
import { Button } from '@/components/ui/Button';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
	const { mode, setMode } = useThemeStore();

	return (
		<div className="flex items-center gap-2">
			<Button
				variant={mode === 'light' ? 'default' : 'ghost'}
				size="icon"
				onClick={() => setMode('light')}
			>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Light</span>
			</Button>
			<Button
				variant={mode === 'dark' ? 'default' : 'ghost'}
				size="icon"
				onClick={() => setMode('dark')}
			>
				<Moon className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Dark</span>
			</Button>
			<Button
				variant={mode === 'system' ? 'default' : 'ghost'}
				size="icon"
				onClick={() => setMode('system')}
			>
				<Monitor className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">System</span>
			</Button>
		</div>
	);
}