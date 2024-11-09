// components/PetStats.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PetStatsProps {
	x: number;
	y: number;
	stats: {
		happiness: number;
		energy: number;
		hygiene: number;
	};
}

export function PetStats({ x, y, stats }: PetStatsProps) {
	const statsConfig = [
		{ emoji: '❤️', value: stats.happiness, color: 'from-red-500' },
		{ emoji: '⚡', value: stats.energy, color: 'from-yellow-500' },
		{ emoji: '💧', value: stats.hygiene, color: 'from-blue-500' },
	];

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0 }}
			className="absolute flex gap-2 pointer-events-none"
			style={{
				left: x,
				top: y - 60, // Position above the pet
				transform: 'translate(-50%, -50%)'
			}}
		>
			{statsConfig.map((stat, index) => (
				<div
					key={stat.emoji}
					className="relative"
					style={{
						transform: `translateX(${(index - 1) * 40}px)` // Spread stats horizontally
					}}
				>
					{/* Background circle */}
					<div className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
						<span className="text-lg">{stat.emoji}</span>
					</div>
					{/* Progress ring */}
					<svg
						className="absolute inset-0 -rotate-90"
						width="40"
						height="40"
					>
						<circle
							cx="20"
							cy="20"
							r="18"
							strokeWidth="3"
							fill="none"
							stroke={`url(#gradient-${index})`}
							strokeDasharray={`${(stat.value / 100) * 113} 113`}
							className="transition-all duration-300"
						/>
						<defs>
							<linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" className={cn("stop-opacity-1", stat.color)} />
								<stop offset="100%" className="stop-color-white stop-opacity-0" />
							</linearGradient>
						</defs>
					</svg>
				</div>
			))}
		</motion.div>
	);
}