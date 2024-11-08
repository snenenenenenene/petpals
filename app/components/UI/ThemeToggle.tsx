// components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center gap-2">
			<Button
				variant={theme === 'light' ? 'default' : 'ghost'}
				size="icon"
				onClick={() => setTheme('light')}
			>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Light</span>
			</Button>
			<Button
				variant={theme === 'dark' ? 'default' : 'ghost'}
				size="icon"
				onClick={() => setTheme('dark')}
			>
				<Moon className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Dark</span>
			</Button>
			<Button
				variant={theme === 'system' ? 'default' : 'ghost'}
				size="icon"
				onClick={() => setTheme('system')}
			>
				<Monitor className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">System</span>
			</Button>
		</div>
	);
}

// Example of using preferences
function SoundSettings() {
	const { preferences, updatePreferences } = useUserPreferences();

	return (
		<div>
			<Switch
				checked={preferences.soundEnabled}
				onCheckedChange={(checked) =>
					updatePreferences({ soundEnabled: checked })
				}
			/>
			<Switch
				checked={preferences.musicEnabled}
				onCheckedChange={(checked) =>
					updatePreferences({ musicEnabled: checked })
				}
			/>
		</div>
	);
}