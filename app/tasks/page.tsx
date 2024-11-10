// app/[locale]/tasks/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
	Calendar,
	Star,
	Gift,
	Clock,
	ArrowRight,
	CheckCircle,
	TrendingUp,
	Zap,
	Trophy,
	Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Task {
	id: string;
	title: string;
	description: string;
	type: 'daily' | 'weekly' | 'special';
	progress: number;
	total: number;
	rewards: {
		type: 'coins' | 'exp' | 'item';
		amount: number;
		icon: typeof Star;
	}[];
	expiresIn?: number; // in seconds
	completed?: boolean;
}

const tasks: Task[] = [
	{
		id: 'daily-1',
		title: 'Morning Walk',
		description: 'Take your pet for a morning walk',
		type: 'daily',
		progress: 0,
		total: 1,
		rewards: [
			{ type: 'coins', amount: 50, icon: Star },
			{ type: 'exp', amount: 100, icon: TrendingUp }
		],
		expiresIn: 36000, // 10 hours
	},
	{
		id: 'daily-2',
		title: 'Grooming Session',
		description: 'Keep your pet clean and happy',
		type: 'daily',
		progress: 1,
		total: 2,
		rewards: [
			{ type: 'coins', amount: 30, icon: Star },
			{ type: 'exp', amount: 75, icon: TrendingUp }
		],
		completed: true
	},
	{
		id: 'weekly-1',
		title: 'Training Master',
		description: 'Complete 5 training sessions',
		type: 'weekly',
		progress: 3,
		total: 5,
		rewards: [
			{ type: 'coins', amount: 200, icon: Star },
			{ type: 'exp', amount: 500, icon: TrendingUp },
			{ type: 'item', amount: 1, icon: Gift }
		]
	},
	{
		id: 'special-1',
		title: 'Spring Festival',
		description: 'Participate in the spring celebration',
		type: 'special',
		progress: 2,
		total: 4,
		rewards: [
			{ type: 'coins', amount: 500, icon: Star },
			{ type: 'exp', amount: 1000, icon: TrendingUp },
			{ type: 'item', amount: 1, icon: Trophy }
		],
		expiresIn: 172800 // 48 hours
	},
];

export default function TasksPage() {
	const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'special'>('daily');

	const taskTypes = [
		{ id: 'daily', label: 'Daily', icon: Calendar },
		{ id: 'weekly', label: 'Weekly', icon: Star },
		{ id: 'special', label: 'Special', icon: Gift }
	] as const;

	const formatTimeLeft = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-100 p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
				>
					<h1 className="text-2xl font-bold mb-2">Daily Quests & Tasks</h1>
					<div className="flex flex-wrap gap-4">
						{taskTypes.map(({ id, label, icon: Icon }) => (
							<Button
								key={id}
								variant={selectedType === id ? 'default' : 'ghost'}
								onClick={() => setSelectedType(id)}
								className="flex items-center gap-2"
							>
								<Icon className="w-4 h-4" />
								{label}
								{tasks.filter(t => t.type === id && !t.completed).length > 0 && (
									<span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
										{tasks.filter(t => t.type === id && !t.completed).length}
									</span>
								)}
							</Button>
						))}
					</div>
				</motion.div>

				{/* Task List */}
				<div className="space-y-4">
					<AnimatePresence mode="popLayout">
						{tasks
							.filter(task => task.type === selectedType)
							.map((task) => (
								<motion.div
									key={task.id}
									layout
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
								>
									<Card className="relative overflow-hidden">
										{task.completed && (
											<div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center">
												<div className="bg-white/90 rounded-full p-4">
													<CheckCircle className="w-8 h-8 text-green-500" />
												</div>
											</div>
										)}

										<div className="p-6">
											{/* Task Header */}
											<div className="flex items-start justify-between mb-4">
												<div>
													<h3 className="text-lg font-bold">{task.title}</h3>
													<p className="text-gray-600">{task.description}</p>
												</div>
												{task.expiresIn && (
													<div className="flex items-center gap-1 text-sm text-gray-500">
														<Clock className="w-4 h-4" />
														{formatTimeLeft(task.expiresIn)}
													</div>
												)}
											</div>

											{/* Progress Bar */}
											<div className="space-y-2 mb-4">
												<div className="flex justify-between text-sm">
													<span>Progress</span>
													<span>{task.progress} / {task.total}</span>
												</div>
												<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
													<motion.div
														className="h-full bg-primary-500"
														initial={{ width: 0 }}
														animate={{ width: `${(task.progress / task.total) * 100}%` }}
													/>
												</div>
											</div>

											{/* Rewards */}
											<div className="flex items-center gap-4">
												<span className="text-sm font-medium text-gray-500">Rewards:</span>
												<div className="flex gap-3">
													{task.rewards.map((reward, index) => {
														const Icon = reward.icon;
														return (
															<div
																key={index}
																className="flex items-center gap-1 bg-primary-50 rounded-full px-3 py-1"
															>
																<Icon className="w-4 h-4 text-primary-500" />
																<span className="text-sm font-medium">
																	{reward.amount}
																</span>
															</div>
														);
													})}
												</div>
											</div>

											{/* Action Button */}
											{!task.completed && (
												<Button
													className="mt-4 w-full"
													onClick={() => {/* Handle task action */ }}
												>
													Start Task
													<ArrowRight className="w-4 h-4 ml-2" />
												</Button>
											)}
										</div>
									</Card>
								</motion.div>
							))}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}