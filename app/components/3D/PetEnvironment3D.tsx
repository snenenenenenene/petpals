// components/3D/PetEnvironment3D.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { usePetStore } from '@/store/petStore';

// Import LoadingSpinner component
// import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamically import the Canvas component with no SSR
const Scene = dynamic(() => import('./Scene'), { ssr: false });

export function PetEnvironment3D() {
	const { stats } = usePetStore();

	return (
		<div className="relative w-full h-full">
			<Scene />

			{/* Stats Overlay */}
			<div className="absolute top-4 left-4 right-4 pointer-events-none">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg inline-block pointer-events-auto"
				>
					<div className="flex gap-4">
						<div className="text-center">
							<div className="text-sm text-gray-600">Happiness</div>
							<div className="font-bold text-primary-600">{stats.happiness}%</div>
						</div>
						<div className="text-center">
							<div className="text-sm text-gray-600">Energy</div>
							<div className="font-bold text-primary-600">{stats.energy}%</div>
						</div>
						<div className="text-center">
							<div className="text-sm text-gray-600">Hunger</div>
							<div className="font-bold text-primary-600">{stats.hunger}%</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}