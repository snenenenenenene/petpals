// components/interactions/ActivityManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Heart,
	Bone,
	Bath,
	Navigation2 as WalkIcon,
	BookOpen,
	Gamepad
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Activity } from '@/types/common';
import { usePetStore } from '@/store/petStore';
import { useInteractionStore } from '@/store/interactionStore';
import { activities } from '@/data/activities';
import React from 'react';

interface ActivityButtonProps {
	activity: Activity;
	onSelect: (activity: Activity) => void;
	disabled?: boolean;
}

const ActivityButton = ({ activity, onSelect, disabled }: ActivityButtonProps) => {
	const { Icon } = activity;

	return (
		<motion.button
			className={cn(
				"relative p-4 rounded-lg bg-white shadow-sm",
				"hover:shadow-md transition-shadow",
				"flex flex-col items-center gap-2",
				disabled && "opacity-50"
			)}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			onClick={() => onSelect(activity)}
			disabled={disabled}
		>
			<Icon className={cn("w-8 h-8", activity.color)} />
			<div className="text-center">
				<h3 className="font-medium">{activity.name}</h3>
				<p className="text-xs text-gray-500">{activity.description}</p>
			</div>
			{disabled && (
				<div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
					<CooldownTimer activityId={activity.id} />
				</div>
			)}
		</motion.button>
	);
};

const CooldownTimer = ({ activityId }: { activityId: string }) => {
	const { getCooldownRemaining } = useInteractionStore();
	const [timeLeft, setTimeLeft] = useState(() => getCooldownRemaining(activityId));

	useEffect(() => {
		const interval = setInterval(() => {
			const remaining = getCooldownRemaining(activityId);
			setTimeLeft(remaining);
			if (remaining <= 0) {
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [activityId]);

	if (timeLeft <= 0) return null;

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	return (
		<div className="text-sm font-medium text-gray-500">
			{minutes}:{seconds.toString().padStart(2, '0')}
		</div>
	);
};

export const ActivityManager = () => {
	const [activeActivity, setActiveActivity] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const { stats, updateStats } = usePetStore();
	const { checkCooldown, startCooldown } = useInteractionStore();

	const handleActivityStart = (activity: Activity) => {
		try {
			if (stats.energy < activity.energyCost) {
				throw new Error("Not enough energy!");
			}

			if (!checkCooldown(activity.id)) {
				throw new Error("Activity is on cooldown!");
			}

			setActiveActivity(activity.id);
			updateStats({ energy: stats.energy - activity.energyCost });
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
			} else {
				setError(new Error('An unexpected error occurred'));
			}
		}
	};

	const handleActivityComplete = (success: boolean) => {
		try {
			const activity = activities.find(a => a.id === activeActivity);
			if (!activity) throw new Error('Activity not found');

			if (success) {
				startCooldown(activity.id);
				updateStats({
					happiness: Math.min(stats.happiness + activity.rewards.happiness, 100),
					experience: stats.experience + activity.rewards.experience,
				});
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err);
			} else {
				setError(new Error('An unexpected error occurred'));
			}
		} finally {
			setActiveActivity(null);
		}
	};

	if (error) {
		return (
			<div className="p-4 bg-red-50 rounded-lg text-red-600 mb-4">
				<p className="font-medium">{error.message}</p>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setError(null)}
					className="mt-2"
				>
					Dismiss
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<AnimatePresence>
				{activeActivity ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
					>
						<Card className="w-full max-w-lg">
							<div className="p-6">
								{activities.find(a => a.id === activeActivity)?.minigameComponent ? (
									<div>
										<h3 className="text-lg font-bold mb-4">
											{activities.find(a => a.id === activeActivity)?.name}
										</h3>
										<div className="relative w-full aspect-video bg-neutral-100 rounded-lg overflow-hidden">
											{React.createElement(
												activities.find(a => a.id === activeActivity)?.minigameComponent!,
												{
													onComplete: handleActivityComplete,
													onError: (err: Error) => setError(err)
												}
											)}
										</div>
									</div>
								) : (
									<div className="text-center">
										<h3 className="text-lg font-bold mb-4">
											{activities.find(a => a.id === activeActivity)?.name}
										</h3>
										<Button onClick={() => handleActivityComplete(true)}>
											Complete Activity
										</Button>
									</div>
								)}
							</div>
						</Card>
					</motion.div>
				) : (
					<div className="grid grid-cols-2 gap-4">
						{activities.map((activity) => (
							<ActivityButton
								key={activity.id}
								activity={activity}
								onSelect={handleActivityStart}
								disabled={!checkCooldown(activity.id)}
							/>
						))}
					</div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ActivityManager;