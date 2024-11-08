// app/achievements/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Award, Medal } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { AchievementCard } from '@/components/ui/AchievementCard';

const categories = [
	{ id: 'care', label: 'Pet Care', icon: Trophy },
	{ id: 'training', label: 'Training', icon: Medal },
	{ id: 'social', label: 'Social', icon: Star },
	{ id: 'exploration', label: 'Exploration', icon: Award },
] as const;

export default function AchievementsPage() {
	const { achievements, points, getCategoryProgress } = useAchievements();

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<div className="min-h-screen bg-neutral-50 p-6">
			{/* Header Section */}
			<motion.div
				className="mb-8 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<h1 className="text-4xl font-bold text-primary-800 mb-2">Achievements</h1>
				<div className="flex items-center justify-center gap-2">
					<Trophy className="h-6 w-6 text-yellow-500" />
					<span className="text-xl font-semibold">{points} Points</span>
				</div>
			</motion.div>

			{/* Progress Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{categories.map(({ id, label, icon: Icon }) => {
					const progress = getCategoryProgress(id);
					return (
						<motion.div
							key={id}
							variants={item}
							className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex items-center gap-2 mb-2">
								<Icon className="h-5 w-5 text-primary-500" />
								<h3 className="font-semibold">{label}</h3>
							</div>
							<div className="flex justify-between text-sm text-gray-600 mb-2">
								<span>{progress.completed} / {progress.total}</span>
								<span>{Math.round(progress.percentage)}%</span>
							</div>
							<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
								<motion.div
									className="h-full bg-primary-500"
									initial={{ width: 0 }}
									animate={{ width: `${progress.percentage}%` }}
									transition={{ duration: 0.5 }}
								/>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Achievement Categories */}
			{categories.map(({ id, label }) => {
				const categoryAchievements = achievements.filter(a => a.category === id);
				return (
					<motion.section
						key={id}
						className="mb-8"
						variants={container}
						initial="hidden"
						animate="show"
					>
						<h2 className="text-2xl font-bold mb-4">{label}</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{categoryAchievements.map((achievement) => (
								<motion.div key={achievement.id} variants={item}>
									<AchievementCard achievement={achievement} />
								</motion.div>
							))}
						</div>
					</motion.section>
				);
			})}
		</div>
	);
}