// providers/animation-provider.tsx
'use client';

import { createContext, useContext, useState } from 'react';
import { AnimationControls, useAnimation as useFramerAnimation } from 'framer-motion';

type AnimationContextType = {
	controls: AnimationControls;
	isAnimating: boolean;
	startAnimation: (name: string) => Promise<void>;
	stopAnimation: () => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
	const controls = useFramerAnimation();
	const [isAnimating, setIsAnimating] = useState(false);

	const startAnimation = async (name: string) => {
		setIsAnimating(true);
		switch (name) {
			case 'bounce':
				await controls.start({
					y: [-20, 0],
					transition: { duration: 0.5, repeat: 3 }
				});
				break;
			case 'spin':
				await controls.start({
					rotate: 360,
					transition: { duration: 1 }
				});
				break;
			case 'float':
				await controls.start({
					y: [0, -10, 0],
					transition: {
						duration: 2,
						repeat: Infinity,
						repeatType: "reverse",
						ease: "easeInOut"
					}
				});
				break;
			case 'shake':
				await controls.start({
					x: [0, -10, 10, -10, 10, 0],
					transition: { duration: 0.5 }
				});
				break;
			case 'pulse':
				await controls.start({
					scale: [1, 1.1, 1],
					transition: { duration: 0.3 }
				});
				break;
			default:
				console.warn(`Animation "${name}" not found`);
		}
		setIsAnimating(false);
	};

	const stopAnimation = () => {
		controls.stop();
		setIsAnimating(false);
	};

	return (
		<AnimationContext.Provider
			value={{
				controls,
				isAnimating,
				startAnimation,
				stopAnimation
			}}
		>
			{children}
		</AnimationContext.Provider>
	);
}

// Rename the hook to avoid conflicts with framer-motion
export const usePetAnimation = () => {
	const context = useContext(AnimationContext);
	if (context === undefined)
		throw new Error('usePetAnimation must be used within an AnimationProvider');
	return context;
};