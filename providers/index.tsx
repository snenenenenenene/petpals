/* eslint-disable @typescript-eslint/no-explicit-any */
// providers/index.tsx
'use client';

import { AnimationProvider } from './animation-provider';
import { GameStateProvider } from './game-state-provider';
import { SoundProvider } from './sound-provider';
import { ToastProvider } from './toast-provider';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
	children: React.ReactNode;
	locale?: string;
	messages?: any;
}

export function Providers({
	children,
}: ProvidersProps) {
	return (

		<GameStateProvider>
			<SessionProvider>
				<AnimationProvider>
					<SoundProvider>
						<ToastProvider>
							{children}
						</ToastProvider>
					</SoundProvider>
				</AnimationProvider>
			</SessionProvider>
		</GameStateProvider>
	);
}