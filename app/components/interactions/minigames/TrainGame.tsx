// components/interactions/minigames/TrainGame.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, ChevronRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Trick {
	id: string;
	name: string;
	icon: string;
	difficulty: 'easy' | 'medium' | 'hard';
	sequence: string[];
	points: number;
}

const tricks: Trick[] = [
	{
		id: 'sit',
		name: 'Sit',
		icon: '🪑',
		difficulty: 'easy',
		sequence: ['⬆️', '⬇️'],
		points: 10,
	},
	{
		id: 'roll',
		name: 'Roll Over',
		icon: '🔄',
		difficulty: 'medium',
		sequence: ['⬅️', '⬆️', '➡️', '⬇️'],
		points: 20,
	},
	{
		id: 'jump',
		name: 'Jump',
		icon: '⭐',
		difficulty: 'easy',
		sequence: ['⬆️', '⬆️'],
		points: 15,
	},
	{
		id: 'spin',
		name: 'Spin',
		icon: '🌀',
		difficulty: 'medium',
		sequence: ['➡️', '➡️', '➡️', '➡️'],
		points: 25,
	},
	{
		id: 'shake',
		name: 'Shake Hands',
		icon: '🤝',
		difficulty: 'easy',
		sequence: ['➡️', '⬆️'],
		points: 15,
	},
	{
		id: 'dance',
		name: 'Dance',
		icon: '💃',
		difficulty: 'hard',
		sequence: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️'],
		points: 30,
	},
];

interface TrainGameProps {
	onComplete: (success: boolean) => void;
}

export const TrainGame = ({ onComplete }: TrainGameProps) => {
	const [currentTrick, setCurrentTrick] = useState<Trick | null>(null);
	const [playerSequence, setPlayerSequence] = useState<string[]>([]);
	const [showSequence, setShowSequence] = useState(false);
	const [score, setScore] = useState(0);
	const [tricksLearned, setTricksLearned] = useState<string[]>([]);
	const [gamePhase, setGamePhase] = useState<'select' | 'watch' | 'play' | 'result'>('select');

	const startTrick = (trick: Trick) => {
		setCurrentTrick(trick);
		setPlayerSequence([]);
		setShowSequence(true);
		setGamePhase('watch');

		// Show sequence then hide
		setTimeout(() => {
			setShowSequence(false);
			setGamePhase('play');
		}, trick.sequence.length * 1000 + 1000);
	};

	const handleInput = (direction: string) => {
		if (gamePhase !== 'play' || !currentTrick) return;

		const newSequence = [...playerSequence, direction];
		setPlayerSequence(newSequence);

		// Check if sequence is complete
		if (newSequence.length === currentTrick.sequence.length) {
			const success = newSequence.every(
				(input, index) => input === currentTrick.sequence[index]
			);

			if (success) {
				setScore(prev => prev + currentTrick.points);
				setTricksLearned(prev => [...prev, currentTrick.id]);
			}

			// Show result
			setGamePhase('result');
			setTimeout(() => {
				if (tricksLearned.length + (success ? 1 : 0) >= 3) {
					onComplete(true);
				} else {
					setGamePhase('select');
					setCurrentTrick(null);
					setPlayerSequence([]);
				}
			}, 2000);
		}
	};

	return (
		<div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden p-4">
			{/* Score Display */}
			<div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
				<Trophy className="w-4 h-4 text-yellow-500" />
				<span className="font-medium">{score}</span>
			</div>

			<div className="h-full flex flex-col">
				{gamePhase === 'select' && (
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-center">Choose a trick to learn</h3>
						<div className="grid grid-cols-2 gap-4">
							{tricks.map((trick) => (
								<motion.button
									key={trick.id}
									className={cn(
										"p-4 rounded-lg bg-white shadow-sm",
										"flex flex-col items-center gap-2",
										tricksLearned.includes(trick.id) && "opacity-50"
									)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									disabled={tricksLearned.includes(trick.id)}
									onClick={() => startTrick(trick)}
								>
									<span className="text-2xl">{trick.icon}</span>
									<span className="font-medium">{trick.name}</span>
									<div className="flex gap-1">
										{[...Array(
											trick.difficulty === 'easy' ? 1 :
												trick.difficulty === 'medium' ? 2 : 3
										)].map((_, i) => (
											<Star
												key={i}
												className="w-4 h-4 text-yellow-500"
												fill="currentColor"
											/>
										))}
									</div>
								</motion.button>
							))}
						</div>
					</div>
				)}

				{(gamePhase === 'watch' || gamePhase === 'play') && currentTrick && (
					<div className="flex-1 flex flex-col items-center justify-center">
						<div className="text-center mb-8">
							<span className="text-4xl mb-2">{currentTrick.icon}</span>
							<h3 className="text-xl font-bold">{currentTrick.name}</h3>
						</div>

						{/* Sequence Display */}
						<div className="relative h-16 mb-8">
							<AnimatePresence>
								{showSequence && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="flex items-center gap-2"
									>
										{currentTrick.sequence.map((direction, index) => (
											<motion.div
												key={index}
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: index * 0.5 }}
												className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl"
											>
												{direction}
											</motion.div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Input Display */}
						{gamePhase === 'play' && (
							<>
								<div className="flex gap-2 mb-4">
									{currentTrick.sequence.map((_, index) => (
										<div
											key={index}
											className={cn(
												"w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
												index < playerSequence.length
													? "bg-white shadow-sm"
													: "border-2 border-dashed border-gray-300"
											)}
										>
											{playerSequence[index] || ""}
										</div>
									))}
								</div>

								{/* Controls */}
								<div className="grid grid-cols-3 gap-2">
									{['⬆️', '⬅️', '➡️', '⬇️'].map((direction) => (
										<Button
											key={direction}
											onClick={() => handleInput(direction)}
											className={direction === '⬆️' ? 'col-span-3' : ''}
										>
											{direction}
										</Button>
									))}
								</div>
							</>
						)}
					</div>
				)}

				{gamePhase === 'result' && (
					<div className="flex-1 flex flex-col items-center justify-center">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className="text-center"
						>
							{playerSequence.every(
								(input, index) => input === currentTrick?.sequence[index]
							) ? (
								<>
									<div className="text-6xl mb-4">🎉</div>
									<h3 className="text-xl font-bold text-green-600">Perfect!</h3>
								</>
							) : (
								<>
									<div className="text-6xl mb-4">😅</div>
									<h3 className="text-xl font-bold text-red-600">Try Again!</h3>
								</>
							)}
						</motion.div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TrainGame;