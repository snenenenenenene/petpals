// components/ui/AchievementCard.tsx
import { motion } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';
import { Achievement } from '@/types/achievements';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface AchievementCardProps {
	achievement: Achievement;
	showProgress?: boolean;
}

export const AchievementCard = ({ achievement, showProgress = true }: AchievementCardProps) => {
	const rarityColors = {
		common: 'text-gray-500',
		rare: 'text-blue-500',
		epic: 'text-purple-500',
		legendary: 'text-yellow-500'
	};

	const getRarityIcon = () => {
		switch (achievement.rarity) {
			case 'legendary':
				return <Trophy className="h-5 w-5" />;
			case 'epic':
				return <Award className="h-5 w-5" />;
			case 'rare':
				return <Star className="h-5 w-5" />;
			default:
				return null;
		}
	};

	return (
		<Card className={cn(
			'relative overflow-hidden',
			achievement.isComplete ? 'bg-gradient-to-r from-primary-50 to-primary-100' : ''
		)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						{getRarityIcon()}
						<span className={rarityColors[achievement.rarity]}>{achievement.title}</span>
					</CardTitle>
					<span className="text-sm font-medium">{achievement.points} pts</span>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>

				{showProgress && !achievement.isComplete && (
					<div className="mt-4">
						<div className="flex justify-between text-sm mb-1">
							<span>Progress</span>
							<span>{achievement.requirement.current}/{achievement.requirement.value}</span>
						</div>
						<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-primary-500"
								initial={{ width: 0 }}
								animate={{
									width: `${(achievement.requirement.current / achievement.requirement.value) * 100}%`
								}}
								transition={{ duration: 0.5 }}
							/>
						</div>
					</div>
				)}

				{achievement.rewards && achievement.rewards.length > 0 && (
					<div className="mt-4">
						<p className="text-sm font-medium mb-2">Rewards:</p>
						<div className="flex gap-2">
							{achievement.rewards.map((reward, index) => (
								<span
									key={index}
									className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 text-primary-800 text-xs"
								>
									{reward.type === 'coins' && '🪙'}
									{reward.type === 'items' && '🎁'}
									{reward.type === 'experience' && '⭐'}
									{reward.amount}
								</span>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};