// components/Adventure/AdventureInterface.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
	X,
	ChevronRight,
	Users2,
	Star,
	Heart,
	Shield
} from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import { useSounds } from '@/hooks/useSounds';

interface Pet {
	id: string;
	name: string;
	level: number;
	energy: number;
	happiness: number;
	stats: {
		strength: number;
		agility: number;
		stamina: number;
	};
	image?: string;
}

interface AdventureInterfaceProps {
	isOpen: boolean;
	onClose: () => void;
	currentPetId: string;
	onStartAdventure: (selectedPets: string[]) => void;
}

export function AdventureInterface({
	isOpen,
	onClose,
	currentPetId,
	onStartAdventure
}: AdventureInterfaceProps) {
	const { playSound } = useSounds();
	const [selectedPets, setSelectedPets] = useState<Set<string>>(new Set([currentPetId]));
	const { stats: currentPetStats } = usePetStore();

	// Mock data - replace with your actual pet data
	const availablePets: Pet[] = [
		{
			id: currentPetId,
			name: 'Current Pet',
			level: 5,
			energy: currentPetStats.energy,
			happiness: currentPetStats.happiness,
			stats: {
				strength: 7,
				agility: 8,
				stamina: 6
			}
		},
		{
			id: '2',
			name: 'Luna',
			level: 3,
			energy: 90,
			happiness: 85,
			stats: {
				strength: 5,
				agility: 9,
				stamina: 7
			}
		},
		{
			id: '3',
			name: 'Max',
			level: 4,
			energy: 70,
			happiness: 95,
			stats: {
				strength: 8,
				agility: 6,
				stamina: 8
			}
		}
	];

	const handlePetSelect = (petId: string) => {
		const newSelection = new Set(selectedPets);
		if (selectedPets.has(petId)) {
			if (petId !== currentPetId) { // Can't deselect current pet
				newSelection.delete(petId);
			}
		} else {
			newSelection.add(petId);
		}
		setSelectedPets(newSelection);
		playSound('button');
	};

	const renderPetCard = (pet: Pet) => (
		<motion.div
			key={pet.id}
			className={`relative rounded-lg overflow-hidden transition-all duration-200 
        ${selectedPets.has(pet.id)
					? 'ring-4 ring-primary-500 bg-primary-50'
					: 'bg-white hover:bg-gray-50'}`}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			<div className="p-4">
				{/* Pet Image/Avatar */}
				<div className="aspect-square mb-4 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 
          flex items-center justify-center text-6xl overflow-hidden relative">
					{pet.image ? (
						<img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
					) : (
						<span>🐕</span>
					)}
					{selectedPets.has(pet.id) && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="absolute inset-0 bg-primary-500/10 flex items-center justify-center"
						>
							<Star className="w-12 h-12 text-primary-500" />
						</motion.div>
					)}
				</div>

				{/* Pet Info */}
				<div className="text-center mb-4">
					<h3 className="font-bold text-lg mb-1">
						{pet.name}
						{pet.id === currentPetId && (
							<span className="ml-2 text-xs text-primary-500">(Current)</span>
						)}
					</h3>
					<div className="text-sm text-gray-600">Level {pet.level}</div>
				</div>

				{/* Pet Stats */}
				<div className="space-y-2">
					<div className="flex justify-between items-center text-sm">
						<span className="flex items-center gap-1">
							<Heart className="w-4 h-4 text-red-500" /> Energy
						</span>
						<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-red-500 transition-all"
								style={{ width: `${pet.energy}%` }}
							/>
						</div>
					</div>

					<div className="flex justify-between items-center text-sm">
						<span className="flex items-center gap-1">
							<Shield className="w-4 h-4 text-blue-500" /> Stamina
						</span>
						<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-blue-500 transition-all"
								style={{ width: `${(pet.stats.stamina / 10) * 100}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Selection Button */}
				<motion.button
					className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors
            ${selectedPets.has(pet.id)
							? 'bg-primary-500 text-white'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
					onClick={() => handlePetSelect(pet.id)}
					disabled={pet.id === currentPetId}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					{selectedPets.has(pet.id) ? 'Selected' : 'Select'}
				</motion.button>
			</div>
		</motion.div>
	);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50"
				>
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

					{/* Content */}
					<div className="relative h-full flex items-center justify-center p-4">
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl"
						>
							{/* Header */}
							<div className="relative p-6 border-b border-gray-200">
								<button
									onClick={onClose}
									className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
								>
									<X className="w-6 h-6 text-gray-400" />
								</button>
								<h2 className="text-3xl font-bold text-center text-primary-800">Adventure Time!</h2>
								<p className="text-center text-gray-600 mt-2">Choose your adventure companions</p>
							</div>

							{/* Pet Selection */}
							<div className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{availablePets.map(renderPetCard)}
								</div>

								{/* Start Adventure Button */}
								<div className="mt-8 flex justify-center">
									<motion.button
										onClick={() => onStartAdventure(Array.from(selectedPets))}
										className="bg-primary-500 text-white px-8 py-3 rounded-full font-medium
                      flex items-center gap-2 hover:bg-primary-600 transition-colors"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Start Adventure
										<ChevronRight className="w-5 h-5" />
									</motion.button>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}