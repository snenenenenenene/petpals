// providers/index.tsx
'use client';

import { ThemeProvider } from './theme-provider';
import { AnimationProvider } from './animation-provider';
import { GameStateProvider } from './game-state-provider';
import { SoundProvider } from './sound-provider';
import { ToastProvider } from './toast-provider';

interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<ThemeProvider>
			<GameStateProvider>
				<AnimationProvider>
					<SoundProvider>
						<ToastProvider>
							{children}
						</ToastProvider>
					</SoundProvider>
				</AnimationProvider>
			</GameStateProvider>
		</ThemeProvider>
	);
}
