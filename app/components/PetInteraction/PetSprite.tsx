// components/PetInteraction/PetSprite.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { usePetStore } from '@/store/petStore';
import { PetStats } from '../PetStats';
import { cn } from '@/lib/utils';
import {
	Heart,
	MapPin,
	Bath,
	Bone,
	Gamepad2,
	Clock,
	Star
} from 'lucide-react';
import { useSounds } from '@/hooks/useSounds';

interface Action {
	id: string;
	icon: typeof Heart;
	label: string;
	description: string;
	color: string;
	energyCost: number;
	cooldown?: number; // in seconds
	handler: () => void;
}

export const PetSprite = ({ className }: { className?: string }) => {
	const params = useParams();
	const router = useRouter();
	const [showStats, setShowStats] = useState(false);
	const [showActions, setShowActions] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const boundsRef = useRef<HTMLDivElement>(null);
	const { stats, updateStats } = usePetStore();
	const { playSound } = useSounds();

	const actions: Action[] = [
		{
			id: 'pet',
			icon: Heart,
			label: 'Pet',
			description: 'Show some love',
			color: 'bg-red-500',
			energyCost: 0,
			handler: () => {
				playSound('button');
				updateStats({
					happiness: Math.min(stats.happiness + 5, 100),
					energy: Math.min(stats.energy + 2, 100) // Dev mode energy boost
				});
				showHeartEmoji(position.x, position.y);
			}
		},
		{
			id: 'adventure',
			icon: MapPin,
			label: 'Adventure',
			description: 'Take your pet for a walk',
			color: 'bg-blue-500',
			energyCost: 20,
			cooldown: 1800,
			handler: () => {
				playSound('button');
				if (stats.energy >= 20) {
					router.push('/adventure');
				} else {
					// Show energy warning toast
					console.log('Not enough energy!');
				}
			}
		},
		{
			id: 'wash',
			icon: Bath,
			label: 'Wash',
			description: 'Keep your pet clean',
			color: 'bg-cyan-500',
			energyCost: 15,
			cooldown: 3600,
			handler: () => {
				playSound('button');
				if (stats.energy >= 15) {
					updateStats({
						hygiene: 100,
						happiness: Math.min(stats.happiness + 10, 100),
						energy: stats.energy - 15
					});
				}
			}
		},
		{
			id: 'feed',
			icon: Bone,
			label: 'Feed',
			description: 'Time for a snack',
			color: 'bg-amber-500',
			energyCost: 0,
			cooldown: 1800,
			handler: () => {
				playSound('button');
				updateStats({
					hunger: Math.min(stats.hunger + 30, 100),
					happiness: Math.min(stats.happiness + 5, 100),
					energy: Math.min(stats.energy + 10, 100)
				});
			}
		},
		{
			id: 'play',
			icon: Gamepad2,
			label: 'Play',
			description: 'Play a mini-game',
			color: 'bg-purple-500',
			energyCost: 10,
			cooldown: 900,
			handler: () => {
				playSound('button');
				if (stats.energy >= 10) {
					// Navigate to mini-game selection
					console.log('Opening mini-game selection...');
				}
			}
		}
	];

	const handlePet = (e: React.MouseEvent) => {
		const bounds = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;
		setPosition({ x, y });
		setShowStats(true);
		setShowActions(!showActions); // Toggle actions panel
		playSound('button');
	};

	const showHeartEmoji = (x: number, y: number) => {
		const heart = document.createElement('div');
		heart.innerHTML = '❤️';
		heart.className = 'absolute text-2xl pointer-events-none';
		heart.style.left = `${x}px`;
		heart.style.top = `${y}px`;
		boundsRef.current?.appendChild(heart);

		const animation = heart.animate([
			{ transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
			{ transform: 'translate(-50%, -150%) scale(1.5)', opacity: 0 }
		], {
			duration: 1000,
			easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
		});

		animation.onfinish = () => heart.remove();
	};

	return (
		<div
			ref={boundsRef}
			className={cn("relative w-full h-full overflow-hidden", className)}
			onMouseLeave={() => setShowStats(false)}
		>
			{/* Pet Sprite */}
			<motion.div
				className="absolute cursor-pointer"
				style={{
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
				onClick={handlePet}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
			>
				<div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
					<span className="text-4xl select-none">🐕</span>
				</div>
			</motion.div>

			{/* Action Panel */}
			<AnimatePresence>
				{showActions && (
					<motion.div
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '100%', opacity: 0 }}
						transition={{ type: "spring", damping: 20 }}
						className="absolute top-0 right-0 bottom-0 w-80 bg-white/90 backdrop-blur-sm shadow-lg"
					>
						<div className="p-6 h-full">
							<div className="mb-6">
								<h3 className="text-lg font-bold">Actions</h3>
								<p className="text-sm text-gray-500">Choose an activity</p>
							</div>

							{/* Energy Display */}
							<div className="mb-6 bg-amber-50 rounded-lg p-4">
								<div className="flex items-center gap-2 text-amber-500 mb-2">
									<Star className="w-5 h-5" />
									<span className="font-medium">Energy</span>
								</div>
								<div className="text-2xl font-bold text-amber-700">
									{stats.energy}/100
								</div>
							</div>

							<div className="space-y-3">
								{actions.map((action) => (
									<ActionButton
										key={action.id}
										action={action}
										stats={stats}
									/>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Stats Display */}
			<AnimatePresence>
				{showStats && !showActions && (
					<PetStats
						x={position.x}
						y={position.y}
						stats={stats}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

interface ActionButtonProps {
	action: Action;
	stats: {
		energy: number;
		[key: string]: number;
	};
}

function ActionButton({ action, stats }: ActionButtonProps) {
	const isDisabled = stats.energy < action.energyCost;
	const [timeLeft, setTimeLeft] = useState(0);

	return (
		<motion.button
			whileHover={{ scale: isDisabled ? 1 : 1.02 }}
			whileTap={{ scale: isDisabled ? 1 : 0.98 }}
			className={cn(
				"w-full p-4 rounded-xl",
				"bg-white shadow-sm",
				isDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md",
				"transition-all duration-200"
			)}
			disabled={isDisabled}
			onClick={action.handler}
		>
			<div className="flex items-start gap-3">
				<div className={cn(
					"p-2 rounded-lg",
					action.color
				)}>
					<action.icon className="w-5 h-5 text-white" />
				</div>
				<div className="flex-1 text-left">
					<div className="font-medium">{action.label}</div>
					<div className="text-sm text-gray-500">{action.description}</div>
					{action.energyCost > 0 && (
						<div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
							<Star className="w-4 h-4" />
							{action.energyCost} energy
						</div>
					)}
				</div>
				{timeLeft > 0 && (
					<div className="text-sm text-gray-500">
						<Clock className="w-4 h-4 mb-1" />
						{Math.ceil(timeLeft / 60)}m
					</div>
				)}
			</div>
		</motion.button>
	);
}