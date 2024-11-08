// app/achievements/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAchievements } from '@/hooks/useAchievements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function AchievementDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const { achievements } = useAchievements();

	const achievement = achievements.find(a => a.id === id);

	useEffect(() => {
		if (!achievement) {
			router.push('/achievements');
		}
	}, [achievement, router]);

	if (!achievement) return null;

	return (
		<div className="min-h-screen bg-neutral-50 p-6">
			<Button
				variant="ghost"
				className="mb-4"
				onClick={() => router.back()}
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back to Achievements
			</Button>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-2xl mx-auto"
			>
				<Card>
					<CardHeader>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className="mx-auto mb-4"
						>
							<Trophy className="h-16 w-16 text-yellow-500" />
						</motion.div>
						<CardTitle className="text-center text-2xl">
							{achievement.title}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="text-center text-gray-600">
								{achievement.description}
							</div>

							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="flex items-center gap-2">
									<Trophy className="h-4 w-4 text-primary-500" />
									<span>{achievement.points} Points</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-primary-500" />
									<span>
										{achievement.dateCompleted
											? new Date(achievement.dateCompleted).toLocaleDateString()
											: 'Not completed'}
									</span>
								</div>
							</div>

							{!achievement.isComplete && (
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Progress</span>
										<span>
											{achievement.requirement.current} / {achievement.requirement.value}
										</span>
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
								<div className="space-y-2">
									<h3 className="font-semibold">Rewards</h3>
									<div className="flex flex-wrap gap-2">
										{achievement.rewards.map((reward, index) => (
											<span
												key={index}
												className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-800"
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

							{achievement.isComplete && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center justify-center text-green-500 gap-2"
								>
									<Trophy className="h-5 w-5" />
									<span>Achievement Completed!</span>
								</motion.div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}