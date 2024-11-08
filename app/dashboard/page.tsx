// app/dashboard/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
	Heart, Bone, Droplets, MapPin,
	Camera, Gamepad2, Settings, Menu,
} from 'lucide-react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDogStore } from "@/store/dogStore";
import { PetEnvironment } from '@/components/PetInteraction/PetEnvironment';

export default function Dashboard() {
	const [showMenu, setShowMenu] = useState(false);
	const { hunger, happiness, energy, feedDog, playWithDog } = useDogStore();

	return (
		<div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-primary-50 to-neutral-50">
			{/* Main Pet View Area */}
			<div className="relative h-2/3 w-full bg-neutral-100/50 shadow-inner">
				<PetEnvironment environment="room" />

				{/* Status Indicators */}
				<div className="absolute top-4 left-4 flex gap-2">
					<motion.div
						className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm"
						whileHover={{ scale: 1.1 }}
					>
						<Heart className={`h-6 w-6 ${happiness > 50 ? 'text-red-500' : 'text-red-300'}`} />
					</motion.div>
					<motion.div
						className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm"
						whileHover={{ scale: 1.1 }}
					>
						<Bone className={`h-6 w-6 ${hunger > 50 ? 'text-amber-500' : 'text-amber-300'}`} />
					</motion.div>
					<motion.div
						className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm"
						whileHover={{ scale: 1.1 }}
					>
						<Droplets className={`h-6 w-6 ${energy > 50 ? 'text-blue-500' : 'text-blue-300'}`} />
					</motion.div>
				</div>

				{/* Quick Actions */}
				<div className="absolute top-4 right-4">
					<motion.button
						className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm"
						whileHover={{ scale: 1.1 }}
						onClick={() => setShowMenu(!showMenu)}
					>
						<Menu className="h-6 w-6 text-primary-500" />
					</motion.button>
				</div>
			</div>

			{/* Interactive Area */}
			<motion.div
				className="absolute bottom-0 w-full"
				initial={false}
				animate={{
					height: showMenu ? '60%' : '100px'
				}}
			>
				<Card className="h-full rounded-t-3xl bg-white/80 backdrop-blur-sm border-t border-primary-100">
					{showMenu ? (
						<div className="p-6 h-full">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-bold text-primary-800">Activities</h2>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowMenu(false)}
								>
									<ChevronDown className="h-5 w-5" />
								</Button>
							</div>

							<div className="grid grid-cols-2 gap-4">
								{[
									{ icon: Bone, label: 'Feed', action: feedDog },
									{ icon: Gamepad2, label: 'Play', action: playWithDog },
									{ icon: Droplets, label: 'Wash', action: () => { } },
									{ icon: MapPin, label: 'Walk', action: () => { } },
									{ icon: Camera, label: 'Photo', action: () => { } },
									{ icon: Settings, label: 'Care', action: () => { } },
								].map((item, index) => (
									<motion.button
										key={index}
										className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={item.action}
									>
										<item.icon className="h-8 w-8 text-primary-500 mb-2" />
										<span className="text-sm font-medium text-primary-700">{item.label}</span>
									</motion.button>
								))}
							</div>
						</div>
					) : (
						<div className="h-full flex justify-around items-center px-6">
							{['Feed', 'Play', 'Wash', 'Walk'].map((action, index) => (
								<motion.button
									key={index}
									className="px-6 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-primary-700"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() => setShowMenu(true)}
								>
									{action}
								</motion.button>
							))}
						</div>
					)}
				</Card>
			</motion.div>
		</div>
	);
}

const ChevronDown = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<polyline points="6 9 12 15 18 9" />
	</svg>
);