// providers/sound-provider.tsx
'use client';

import { createContext, useContext, useRef, useState } from 'react';

type Sound = {
	name: string;
	url: string;
};

type SoundContextType = {
	isMuted: boolean;
	setMuted: (muted: boolean) => void;
	playSound: (name: string) => void;
	stopSound: (name: string) => void;
	volume: number;
	setVolume: (volume: number) => void;
};

const sounds: Sound[] = [
	{ name: 'click', url: '/sounds/click.mp3' },
	{ name: 'success', url: '/sounds/success.mp3' },
	{ name: 'error', url: '/sounds/error.mp3' },
	// Add more sounds as needed
];

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
	const [isMuted, setMuted] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

	const playSound = (name: string) => {
		if (isMuted) return;

		const sound = sounds.find(s => s.name === name);
		if (!sound) return;

		if (!audioRefs.current[name]) {
			audioRefs.current[name] = new Audio(sound.url);
		}

		const audio = audioRefs.current[name];
		audio.volume = volume;
		audio.currentTime = 0;
		audio.play();
	};

	const stopSound = (name: string) => {
		const audio = audioRefs.current[name];
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
	};

	return (
		<SoundContext.Provider
			value={{ isMuted, setMuted, playSound, stopSound, volume, setVolume }}
		>
			{children}
		</SoundContext.Provider>
	);
}

export const useSound = () => {
	const context = useContext(SoundContext);
	if (context === undefined)
		throw new Error('useSound must be used within a SoundProvider');
	return context;
};
