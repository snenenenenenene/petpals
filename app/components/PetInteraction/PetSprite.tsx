// components/PetInteraction/PetSprite.tsx
'use client';

import { motion, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useDogStore } from '@/store/dogStore';
import { cn } from '@/lib/utils';

type PetState = 'idle' | 'happy' | 'sleeping' | 'walking' | 'playing' | 'eating';
type PetMood = 'happy' | 'neutral' | 'tired';

interface PetSpriteProps {
	className?: string;
	onInteraction?: (type: string) => void;
}

export const PetSprite = ({ className, onInteraction }: PetSpriteProps) => {
	const controls = useAnimation();
	const [petState, setPetState] = useState<PetState>('idle');
	const [petMood, setPetMood] = useState<PetMood>('neutral');
	const [lastPetTime, setLastPetTime] = useState(Date.now());
	const [petCounter, setPetCounter] = useState(0);
	const boundsRef = useRef<HTMLDivElement>(null);
	const { happiness, energy, updateHappiness, updateEnergy } = useDogStore();

	// Initialize random idle movements
	useEffect(() => {
		const interval = setInterval(() => {
			if (petState === 'idle') {
				const randomMove = Math.random();
				if (randomMove > 0.7) {
					const x = (Math.random() - 0.5) * 100;
					const y = (Math.random() - 0.5) * 100;
					controls.start({
						x: x,
						y: y,
						transition: {
							duration: 2,
							ease: "easeInOut"
						}
					});
				}
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [controls, petState]);

	// Update mood based on happiness and energy
	useEffect(() => {
		if (happiness > 70 && energy > 50) {
			setPetMood('happy');
		} else if (energy < 30) {
			setPetMood('tired');
		} else {
			setPetMood('neutral');
		}
	}, [happiness, energy]);

	const handlePet = () => {
		const now = Date.now();
		if (now - lastPetTime < 1000) { // Within 1 second
			setPetCounter(prev => prev + 1);
			if (petCounter > 5) {
				triggerPlayfulJump();
			}
		} else {
			setPetCounter(1);
		}
		setLastPetTime(now);

		updateHappiness(2);
		setPetState('happy');
		wiggleAnimation();
	};

	const handleDragStart = () => {
		setPetState('playing');
		controls.start({
			scale: 0.9,
			transition: { duration: 0.2 }
		});
	};

	const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		setPetState('idle');
		controls.start({
			scale: 1,
			transition: { type: "spring", stiffness: 300, damping: 20 }
		});

		// If thrown with enough velocity, trigger jump
		if (Math.abs(info.velocity.x) > 500 || Math.abs(info.velocity.y) > 500) {
			triggerPlayfulJump();
		}
	};

	const wiggleAnimation = async () => {
		await controls.start({
			rotate: [0, -10, 10, -10, 10, 0],
			transition: { duration: 0.5 }
		});
		setPetState('idle');
	};

	const triggerPlayfulJump = async () => {
		setPetState('playing');
		await controls.start({
			y: [-50, 0],
			scale: [1, 1.2, 1],
			transition: { duration: 0.5, type: "spring" }
		});
		setPetState('idle');
	};

	const getPetStyles = () => {
		const baseStyles = "w-32 h-32 rounded-full";
		switch (petMood) {
			case 'happy':
				return cn(baseStyles, 'bg-primary-300');
			case 'tired':
				return cn(baseStyles, 'bg-neutral-300');
			default:
				return cn(baseStyles, 'bg-primary-200');
		}
	};

	const getPetEmoji = () => {
		switch (petState) {
			case 'happy':
				return '😊';
			case 'sleeping':
				return '😴';
			case 'playing':
				return '🤪';
			case 'eating':
				return '😋';
			case 'walking':
				return '🚶';
			default:
				return petMood === 'happy' ? '🐕' : petMood === 'tired' ? '😩' : '🐕';
		}
	};

	return (
		<div
			ref={boundsRef}
			className={cn("relative w-full h-full overflow-hidden", className)}
		>
			<motion.div
				drag
				dragConstraints={boundsRef}
				dragElastic={0.2}
				dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				animate={controls}
				whileHover={{ scale: 1.05 }}
				onTap={handlePet}
				className={cn(
					getPetStyles(),
					"cursor-grab active:cursor-grabbing",
					"flex items-center justify-center",
					"select-none",
					"shadow-lg"
				)}
			>
				<span className="text-4xl">{getPetEmoji()}</span>

				{/* Interaction Indicators */}
				<AnimatePresence>
					{petState === 'happy' && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: -20 }}
							exit={{ opacity: 0 }}
							className="absolute -top-8 left-1/2 transform -translate-x-1/2"
						>
							❤️
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
};