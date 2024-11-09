// components/AchievementBadge.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAchievementStore } from '@/store/achievementStore';

interface NotificationBadge {
	type: 'achievement' | 'task';
	count: number;
}

export function NotificationBadges() {
	const [badges, setBadges] = useState<NotificationBadge[]>([]);
	const { recentAchievements } = useAchievementStore();

	// You'd implement similar for tasks
	const uncompletedTasks = []; // This would come from your task store

	useEffect(() => {
		const newBadges: NotificationBadge[] = [];

		if (recentAchievements.length > 0) {
			newBadges.push({
				type: 'achievement',
				count: recentAchievements.length
			});
		}

		if (uncompletedTasks.length > 0) {
			newBadges.push({
				type: 'task',
				count: uncompletedTasks.length
			});
		}

		setBadges(newBadges);
	}, [recentAchievements, uncompletedTasks]);

	return (
		<div className="relative">
			<AnimatePresence>
				{badges.map((badge, index) => (
					<motion.div
						key={badge.type}
						initial={{ scale: 0, y: 0 }}
						animate={{ scale: 1, y: index * -16 }}
						exit={{ scale: 0 }}
						className={cn(
							"absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center",
							"rounded-full text-xs font-bold text-white px-1",
							"border-2 border-white",
							badge.type === 'achievement' ? 'bg-yellow-500' : 'bg-blue-500'
						)}
					>
						{badge.count}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}