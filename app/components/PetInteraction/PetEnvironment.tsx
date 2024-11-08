// components/PetInteraction/PetEnvironment.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PetSprite } from './PetSprite';
import { cn } from '@/lib/utils';

interface PetEnvironmentProps {
	className?: string;
	environment?: 'room' | 'park' | 'garden';
}

export const PetEnvironment = ({
	className,
	environment = 'room'
}: PetEnvironmentProps) => {
	const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');

	// Update time of day based on real time
	useEffect(() => {
		const updateTimeOfDay = () => {
			const hour = new Date().getHours();
			if (hour >= 6 && hour < 17) setTimeOfDay('day');
			else if (hour >= 17 && hour < 20) setTimeOfDay('sunset');
			else setTimeOfDay('night');
		};

		updateTimeOfDay();
		const interval = setInterval(updateTimeOfDay, 60000);
		return () => clearInterval(interval);
	}, []);

	const getEnvironmentStyles = () => {
		const baseStyles = "w-full h-full relative overflow-hidden";
		switch (environment) {
			case 'park':
				return `${baseStyles} bg-gradient-to-b from-green-100 to-green-200`;
			case 'garden':
				return `${baseStyles} bg-gradient-to-b from-yellow-50 to-green-100`;
			default:
				return `${baseStyles} bg-gradient-to-b from-blue-50 to-neutral-100`;
		}
	};

	return (
		<div className={getEnvironmentStyles()}>
			{/* Environment Decorations */}
			{environment === 'room' && (
				<>
					<div className="absolute bottom-0 left-0 w-full h-1/4 bg-neutral-200/30" />
					<div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-yellow-100/50" />
				</>
			)}

			{/* Time of Day Overlay */}
			<div
				className={cn(
					"absolute inset-0 pointer-events-none transition-opacity duration-1000",
					timeOfDay === 'sunset' && 'bg-orange-100/20',
					timeOfDay === 'night' && 'bg-blue-900/20'
				)}
			/>

			{/* Pet Sprite */}
			<PetSprite className="w-full h-full" />

			{/* Interactive Elements */}
			<motion.div
				className="absolute bottom-4 left-4 w-12 h-12 bg-primary-100 rounded-full cursor-pointer"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
			// Add toy interaction logic here
			/>
		</div>
	);
};