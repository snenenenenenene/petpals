// components/PetStatus.tsx
'use client';

import { motion } from 'framer-motion';
import { Heart, Battery, Droplets, Sparkles } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import { usePetMood } from '@/hooks/usePetMood';

export const PetStatus = () => {
	const { stats, info } = usePetStore();
	const mood = usePetMood();

	const StatBar = ({
		value,
		icon: Icon,
		color
	}: {
		value: number;
		icon: any;
		color: string;
	}) => (
		<div className="flex items-center gap-2">
			<Icon className={`h-5 w-5 ${color}`} />
			<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
				<motion.div
					className={`h-full ${color}`}
					initial={{ width: 0 }}
					animate={{ width: `${value}%` }}
					transition={{ duration: 0.5 }}
				/>
			</div>
		</div>
	);

	const MoodIndicator = () => {
		const moodEmojis = {
			happy: '😊',
			neutral: '😐',
			sad: '😢',
			tired: '😴',
			hungry: '😋',
			sick: '🤒',
		};

		return (
			<div className="text-4xl mb-4">
				{moodEmojis[mood]}
			</div>
		);
	};

	const LevelProgress = () => {
		const progress = (info.experience / (info.level * 100)) * 100;

		return (
			<div className="mt-4">
				<div className="flex justify-between text-sm text-gray-600 mb-1">
					<span>Level {info.level}</span>
					<span>{info.experience}/{info.level * 100} XP</span>
				</div>
				<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
					<motion.div
						className="h-full bg-purple-500"
						initial={{ width: 0 }}
						animate={{ width: `${progress}%` }}
						transition={{ duration: 0.5 }}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
			<div className="text-center mb-4">
				<MoodIndicator />
				<h2 className="text-xl font-bold">{info.name}</h2>
				<p className="text-sm text-gray-600">Level {info.level}</p>
			</div>

			<div className="space-y-3">
				<StatBar
					value={stats.hunger}
					icon={Sparkles}
					color="text-amber-500"
				/>
				<StatBar
					value={stats.happiness}
					icon={Heart}
					color="text-red-500"
				/>
				<StatBar
					value={stats.energy}
					icon={Battery}
					color="text-green-500"
				/>
				<StatBar
					value={stats.hygiene}
					icon={Droplets}
					color="text-blue-500"
				/>
			</div>

			<LevelProgress />
		</div>
	);
};