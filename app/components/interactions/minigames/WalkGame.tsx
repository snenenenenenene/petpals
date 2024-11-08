// components/interactions/minigames/WalkGame.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Footprints, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface WalkItem {
	id: string;
	type: 'treat' | 'toy' | 'coin';
	position: { x: number; y: number };
	collected: boolean;
}

interface WalkPoint {
	x: number;
	y: number;
	hasItem?: boolean;
}

interface WalkGameProps {
	onComplete: (success: boolean) => void;
}

export const WalkGame = ({ onComplete }: WalkGameProps) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [path, setPath] = useState<WalkPoint[]>([]);
	const [items, setItems] = useState<WalkItem[]>([]);
	const [score, setScore] = useState(0);
	const [isWalking, setIsWalking] = useState(false);
	const targetSteps = 10;

	// Initialize walk path with random items
	useEffect(() => {
		const generatePath = () => {
			const newPath: WalkPoint[] = [];
			const newItems: WalkItem[] = [];

			for (let i = 0; i < targetSteps; i++) {
				// Create slightly curved path
				const x = (i / (targetSteps - 1)) * 100;
				const y = 50 + Math.sin((i / targetSteps) * Math.PI * 2) * 20;
				newPath.push({ x, y });

				// Add random items along the path
				if (Math.random() > 0.7) {
					const itemTypes = ['treat', 'toy', 'coin'] as const;
					const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
					newItems.push({
						id: `item-${i}`,
						type,
						position: { x: x + (Math.random() * 10 - 5), y: y + (Math.random() * 10 - 5) },
						collected: false
					});
				}
			}

			setPath(newPath);
			setItems(newItems);
		};

		generatePath();
	}, []);

	const handleStep = () => {
		if (currentStep < targetSteps - 1) {
			setIsWalking(true);

			// Check for items to collect
			items.forEach((item, index) => {
				if (!item.collected) {
					const currentPos = path[currentStep];
					const distance = Math.hypot(
						item.position.x - currentPos.x,
						item.position.y - currentPos.y
					);

					if (distance < 10) {
						setItems(prev => prev.map((i, idx) =>
							idx === index ? { ...i, collected: true } : i
						));
						setScore(prev => prev + 10);
					}
				}
			});

			setTimeout(() => {
				setCurrentStep(prev => prev + 1);
				setIsWalking(false);
			}, 1000);
		} else {
			onComplete(true);
		}
	};

	return (
		<div className="relative w-full h-full bg-green-50 rounded-lg overflow-hidden p-4">
			{/* Progress Bar */}
			<div className="absolute top-4 left-4 right-4">
				<div className="flex justify-between text-sm text-gray-600 mb-1">
					<span>Progress</span>
					<span>{currentStep}/{targetSteps} steps</span>
				</div>
				<div className="h-2 bg-white rounded-full overflow-hidden">
					<motion.div
						className="h-full bg-green-500"
						initial={{ width: 0 }}
						animate={{ width: `${(currentStep / (targetSteps - 1)) * 100}%` }}
					/>
				</div>
			</div>

			{/* Walk Path Visualization */}
			<div className="relative mt-12 h-48">
				<svg className="absolute inset-0" style={{ width: '100%', height: '100%' }}>
					{/* Draw path line */}
					<path
						d={`M ${path.map(p => `${p.x} ${p.y}`).join(' L ')}`}
						fill="none"
						stroke="#e2e8f0"
						strokeWidth="4"
						strokeLinecap="round"
					/>
				</svg>

				{/* Items */}
				<AnimatePresence>
					{items.map((item) => !item.collected && (
						<motion.div
							key={item.id}
							className="absolute"
							style={{
								left: `${item.position.x}%`,
								top: `${item.position.y}%`,
								transform: 'translate(-50%, -50%)'
							}}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
						>
							{item.type === 'treat' && <Gift className="w-6 h-6 text-amber-500" />}
							{item.type === 'toy' && <Star className="w-6 h-6 text-blue-500" />}
							{item.type === 'coin' && <div className="text-2xl">🪙</div>}
						</motion.div>
					))}
				</AnimatePresence>

				{/* Pet Position */}
				<motion.div
					className="absolute"
					animate={{
						left: `${path[currentStep]?.x}%`,
						top: `${path[currentStep]?.y}%`,
					}}
					transition={{ type: "spring", damping: 15 }}
					style={{ transform: 'translate(-50%, -50%)' }}
				>
					<div className="relative">
						<div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
							🐕
						</div>
						{isWalking && (
							<motion.div
								className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<Footprints className="w-4 h-4 text-gray-400" />
							</motion.div>
						)}
					</div>
				</motion.div>
			</div>

			{/* Controls */}
			<div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
				<div className="text-sm font-medium">
					Score: {score}
				</div>
				<Button
					onClick={handleStep}
					disabled={isWalking}
					className={cn(
						"transition-all",
						isWalking && "opacity-50 cursor-not-allowed"
					)}
				>
					{isWalking ? "Walking..." : "Take a Step"}
				</Button>
			</div>
		</div>
	);
};

export default WalkGame;