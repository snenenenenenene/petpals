// components/interactions/minigames/GroomGame.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface GroomGameProps {
	onComplete: (success: boolean) => void;
}

interface DirtySpot {
	id: string;
	x: number;
	y: number;
	size: number;
	cleaned: boolean;
}

export const GroomGame = ({ onComplete }: GroomGameProps) => {
	const [dirtySpots, setDirtySpots] = useState<DirtySpot[]>([]);
	const [isGrooming, setIsGrooming] = useState(false);
	const [score, setScore] = useState(0);
	const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to complete
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [combo, setCombo] = useState(0);
	const targetScore = 500;

	// Initialize dirty spots
	useEffect(() => {
		const spots: DirtySpot[] = Array.from({ length: 10 }, (_, i) => ({
			id: `spot-${i}`,
			x: Math.random() * 80 + 10, // Keep spots away from edges
			y: Math.random() * 80 + 10,
			size: Math.random() * 20 + 20,
			cleaned: false,
		}));
		setDirtySpots(spots);
	}, []);

	// Timer
	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft(prev => prev - 1);
			}, 1000);
			return () => clearInterval(timer);
		} else {
			onComplete(score >= targetScore);
		}
	}, [timeLeft, score, onComplete]);

	// Mouse position tracking
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setMousePos({ x, y });

		if (isGrooming) {
			checkSpotsCleaning(x, y);
		}
	};

	const checkSpotsCleaning = (x: number, y: number) => {
		let cleaned = false;
		setDirtySpots(prev => prev.map(spot => {
			if (!spot.cleaned) {
				const distance = Math.hypot(spot.x - x, spot.y - y);
				if (distance < spot.size / 2) {
					cleaned = true;
					return { ...spot, cleaned: true };
				}
			}
			return spot;
		}));

		if (cleaned) {
			setCombo(prev => prev + 1);
			setScore(prev => prev + (10 * combo));
		} else {
			setCombo(0);
		}
	};

	return (
		<div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden p-4">
			{/* Score and Timer */}
			<div className="absolute top-4 right-4 left-4 flex justify-between items-center">
				<div className="bg-white rounded-full px-4 py-2 shadow-sm">
					<span className="font-medium">{score} / {targetScore}</span>
				</div>
				<div className="bg-white rounded-full px-4 py-2 shadow-sm">
					<span className="font-medium">{timeLeft}s</span>
				</div>
			</div>

			{/* Combo Display */}
			<AnimatePresence>
				{combo > 1 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="absolute top-16 right-4 bg-yellow-400 text-white rounded-full px-3 py-1"
					>
						{combo}x Combo!
					</motion.div>
				)}
			</AnimatePresence>

			{/* Game Area */}
			<div
				className={cn(
					"relative w-full h-64 bg-white rounded-lg mt-16 cursor-none",
					isGrooming && "active:cursor-none"
				)}
				onMouseMove={handleMouseMove}
				onMouseDown={() => setIsGrooming(true)}
				onMouseUp={() => setIsGrooming(false)}
				onMouseLeave={() => setIsGrooming(false)}
			>
				{/* Pet Silhouette */}
				<div className="absolute inset-0 flex items-center justify-center opacity-10">
					<div className="w-48 h-48 rounded-full bg-gray-400" />
				</div>

				{/* Dirty Spots */}
				{dirtySpots.map(spot => !spot.cleaned && (
					<motion.div
						key={spot.id}
						className="absolute rounded-full bg-brown-300"
						style={{
							left: `${spot.x}%`,
							top: `${spot.y}%`,
							width: `${spot.size}px`,
							height: `${spot.size}px`,
							transform: 'translate(-50%, -50%)'
						}}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0 }}
					/>
				))}

				{/* Cleaning Cursor */}
				<motion.div
					className={cn(
						"absolute w-8 h-8 pointer-events-none",
						isGrooming ? "scale-75" : "scale-100"
					)}
					style={{
						left: `${mousePos.x}%`,
						top: `${mousePos.y}%`,
						transform: 'translate(-50%, -50%)'
					}}
				>
					<div className="relative">
						<Droplets
							className={cn(
								"w-full h-full",
								isGrooming ? "text-blue-400" : "text-blue-300"
							)}
						/>
						{isGrooming && (
							<motion.div
								className="absolute inset-0"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1.2, opacity: 0 }}
								transition={{ repeat: Infinity, duration: 1 }}
							>
								<Droplets className="w-full h-full text-blue-300" />
							</motion.div>
						)}
					</div>
				</motion.div>
			</div>

			{/* Instructions */}
			<div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-600">
				Click and hold to groom your pet!
			</div>

			{/* Success/Failure Overlay */}
			<AnimatePresence>
				{timeLeft === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="absolute inset-0 bg-black/50 flex items-center justify-center"
					>
						<div className="bg-white rounded-lg p-6 text-center">
							{score >= targetScore ? (
								<>
									<Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
									<h3 className="text-xl font-bold mb-2">Great job!</h3>
									<p className="text-gray-600 mb-4">Your pet is squeaky clean!</p>
								</>
							) : (
								<>
									<Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
									<h3 className="text-xl font-bold mb-2">Time's up!</h3>
									<p className="text-gray-600 mb-4">Try to be more thorough next time!</p>
								</>
							)}
							<Button onClick={() => onComplete(score >= targetScore)}>
								Continue
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default GroomGame;