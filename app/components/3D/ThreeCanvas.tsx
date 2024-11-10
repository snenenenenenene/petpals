// components/3D/ThreeCanvas.tsx
'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
	OrbitControls,
	Environment,
	PerspectiveCamera,
	useProgress,
	Html,
	useGLTF,
	useAnimations
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Heart,
	Bone,
	Bath,
	MapPin,
	Gamepad2,
	Trophy,
	X,
	ChevronRight,
	Users2,
} from 'lucide-react';
import { useSounds } from '@/hooks/useSounds';
import { GLTF } from 'three-stdlib';
import { usePetStore } from "@/store/petStore";
import { useInteractionStore } from "@/store/interactionStore";
import { useEnergySystem } from "@/hooks/useEnergySystem";
import { useToast } from "@/hooks/useToast";
import { WalkGame } from '../interactions/minigames/WalkGame';

// Types
type GLTFResult = GLTF & {
	nodes: {
		Object_130: THREE.SkinnedMesh;
		GLTF_created_0_rootJoint: THREE.Bone;
	};
	materials: {
		material_0: THREE.MeshStandardMaterial;
	};
};

interface MenuAction {
	id: string;
	icon: React.ElementType;
	label: string;
	color: string;
	energyCost: number;
	cooldown: number;
	onClick: () => void;
}

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
	isCurrentPet: boolean;
}

interface AdventureStats {
	distance: number;
	duration: number;
	experienceGained: number;
	itemsFound: string[];
}

// Loader Component
function Loader() {
	const { progress } = useProgress();
	return (
		<Html center>
			<div className="flex flex-col items-center">
				<div className="w-24 h-24 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
				<p className="mt-4 text-primary-800 font-medium">{progress.toFixed(0)}% loaded</p>
			</div>
		</Html>
	);
}

// Ground Component
function Ground() {
	return (
		<mesh
			rotation={[-Math.PI / 2, 0, 0]}
			position={[0, -0.1, 0]}
			receiveShadow
		>
			<planeGeometry args={[100, 100]} />
			<meshStandardMaterial
				color="#a3d977"
				roughness={1}
				metalness={0}
			/>
		</mesh>
	);
}

// Adventure Interface Component
function AdventureInterface({
	isOpen,
	onClose,
	currentPetId,
	onStartAdventure
}: {
	isOpen: boolean;
	onClose: () => void;
	currentPetId: string;
	onStartAdventure: (selectedPets: string[]) => void;
}) {
	const { playSound } = useSounds();
	const [selectedPets, setSelectedPets] = useState<Set<string>>(new Set([currentPetId]));
	const [isStarting, setIsStarting] = useState(false);
	const { stats: currentPetStats } = usePetStore();

	// Mock available pets - replace with your actual pet data source
	const availablePets: Pet[] = [
		{
			id: currentPetId,
			name: 'Current Pet',
			level: 5,
			energy: currentPetStats.energy,
			happiness: currentPetStats.happiness,
			stats: { strength: 7, agility: 8, stamina: 6 },
			isCurrentPet: true
		},
		{
			id: '2',
			name: 'Luna',
			level: 3,
			energy: 90,
			happiness: 85,
			stats: { strength: 5, agility: 9, stamina: 7 },
			isCurrentPet: false
		},
		{
			id: '3',
			name: 'Max',
			level: 4,
			energy: 70,
			happiness: 95,
			stats: { strength: 8, agility: 6, stamina: 8 },
			isCurrentPet: false
		}
	];

	const handlePetSelect = (petId: string) => {
		const newSelection = new Set(selectedPets);
		if (selectedPets.has(petId)) {
			if (petId !== currentPetId) {
				newSelection.delete(petId);
			}
		} else {
			newSelection.add(petId);
		}
		setSelectedPets(newSelection);
		playSound('button');
	};

	const handleAdventureStart = () => {
		setIsStarting(true);
		playSound('button');
		onStartAdventure(Array.from(selectedPets));
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-lg w-full max-w-2xl overflow-hidden shadow-xl"
					>
						{!isStarting ? (
							<>
								<div className="relative p-6 border-b border-gray-200">
									<h2 className="text-2xl font-bold text-center">Adventure Time!</h2>
									<button
										onClick={onClose}
										className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
									>
										<X className="w-6 h-6" />
									</button>
								</div>

								<div className="p-6">
									<div className="mb-4 flex items-center gap-2">
										<Users2 className="w-5 h-5 text-primary-500" />
										<h3 className="text-lg font-semibold">Select Companions</h3>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
										{availablePets.map((pet) => (
											<motion.button
												key={pet.id}
												onClick={() => handlePetSelect(pet.id)}
												className={`relative p-4 rounded-lg border-2 transition-all ${selectedPets.has(pet.id)
													? 'border-primary-500 bg-primary-50'
													: 'border-gray-200 hover:border-primary-200'
													}`}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												disabled={pet.isCurrentPet}
											>
												<div className="aspect-square rounded-lg bg-gray-100 mb-2">
													<div className="w-full h-full flex items-center justify-center text-4xl">
														🐕
													</div>
												</div>
												<div className="text-sm font-medium">
													{pet.name}
													{pet.isCurrentPet && (
														<span className="ml-1 text-xs text-primary-500">(Current)</span>
													)}
												</div>
												<div className="text-xs text-gray-500">Level {pet.level}</div>
												<div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
													<div
														className="h-full bg-green-500"
														style={{ width: `${pet.energy}%` }}
													/>
												</div>
											</motion.button>
										))}
									</div>

									<div className="flex justify-end">
										<motion.button
											onClick={handleAdventureStart}
											className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium
                        flex items-center gap-2 hover:bg-primary-600 transition-colors"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											Start Adventure
											<ChevronRight className="w-4 h-4" />
										</motion.button>
									</div>
								</div>
							</>
						) : (
							<div className="p-6">
								<WalkGame
									onComplete={(success) => {
										if (success) {
											onClose();
										}
										setIsStarting(false);
									}}
									selectedPets={Array.from(selectedPets)}
								/>
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Circular Menu Component
function CircularMenu({ isOpen, onClose, position, radius = 120 }: {
	isOpen: boolean;
	onClose: () => void;
	position: { x: number; y: number };
	radius?: number;
}) {
	const { playSound } = useSounds();
	const { stats, updateStats } = usePetStore();
	const { checkCooldown, startCooldown } = useInteractionStore();
	const { hasEnoughEnergy, consumeEnergy } = useEnergySystem();
	const toast = useToast();
	const [showAdventure, setShowAdventure] = useState(false);

	const ACTIONS: MenuAction[] = [
		{
			id: 'feed',
			icon: Bone,
			label: 'Feed',
			color: 'bg-amber-500',
			energyCost: 0,
			cooldown: 5000,
			onClick: () => {
				if (checkCooldown('feed')) {
					updateStats({
						hunger: Math.min(stats.hunger + 30, 100),
						energy: Math.min(stats.energy + 20, 100),
						happiness: Math.min(stats.happiness + 5, 100)
					});
					startCooldown('feed');
					playSound('button');
				}
			}
		},
		{
			id: 'pet',
			icon: Heart,
			label: 'Pet',
			color: 'bg-red-500',
			energyCost: 0,
			cooldown: 2000,
			onClick: () => {
				if (checkCooldown('pet')) {
					updateStats({
						happiness: Math.min(stats.happiness + 15, 100),
					});
					startCooldown('pet');
					playSound('button');
				}
			}
		},
		{
			id: 'walk',
			icon: MapPin,
			label: 'Adventure',
			color: 'bg-blue-500',
			energyCost: 30,
			cooldown: 300000,
			onClick: () => {
				if (!hasEnoughEnergy(30)) {
					toast.addToast({
						message: 'Not enough energy for adventure!',
						type: 'warning'
					});
					return;
				}
				if (checkCooldown('walk')) {
					setShowAdventure(true);
					playSound('button');
				} else {
					toast.addToast({
						message: 'Adventure is on cooldown!',
						type: 'info'
					});
				}
			}
		},
		{
			id: 'wash',
			icon: Bath,
			label: 'Wash',
			color: 'bg-cyan-500',
			energyCost: 15,
			cooldown: 180000,
			onClick: () => {
				if (hasEnoughEnergy(15) && checkCooldown('wash')) {
					consumeEnergy(15);
					updateStats({
						hygiene: 100,
						happiness: Math.min(stats.happiness + 10, 100),
					});
					startCooldown('wash');
					playSound('button');
				}
			}
		},
		{
			id: 'play',
			icon: Gamepad2,
			label: 'Play',
			color: 'bg-green-500',
			energyCost: 20,
			cooldown: 120000,
			onClick: () => {
				if (hasEnoughEnergy(20) && checkCooldown('play')) {
					consumeEnergy(20);
					updateStats({
						happiness: Math.min(stats.happiness + 20, 100),
						hunger: Math.max(stats.hunger - 10, 0)
					});
					startCooldown('play');
					playSound('button');
				}
			}
		},
		{
			id: 'train',
			icon: Trophy,
			label: 'Train',
			color: 'bg-purple-500',
			energyCost: 25,
			cooldown: 240000,
			onClick: () => {
				if (hasEnoughEnergy(25) && checkCooldown('train')) {
					consumeEnergy(25);
					updateStats({
						happiness: Math.min(stats.happiness + 15, 100),
					});
					startCooldown('train');
					playSound('button');
				}
			}
		}
	];

	const calculatePosition = (index: number) => {
		const angle = (index * 2 * Math.PI) / ACTIONS.length - Math.PI / 2;
		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius
		};
	};

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="fixed pointer-events-auto circular-menu z-40"
						style={{
							left: position.x,
							top: position.y,
							transform: 'translate(-50%, -50%)'
						}}
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
					>
						{ACTIONS.map((action, index) => {
							const pos = calculatePosition(index);
							const Icon = action.icon;
							const canUse = hasEnoughEnergy(action.energyCost) && checkCooldown(action.id);

							return (
								<motion.button
									key={action.id}
									className={`absolute rounded-full p-3 ${action.color} text-white shadow-lg
                    transition-transform group ${!canUse ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
									style={{
										left: pos.x, top: pos.y,
										transform: 'translate(-50%, -50%)'
									}}
									initial={{ scale: 0, opacity: 0 }}
									animate={{
										scale: 1,
										opacity: 1,
										transition: { delay: index * 0.05 }
									}}
									exit={{
										scale: 0,
										opacity: 0,
										transition: { delay: index * 0.05 }
									}}
									whileHover={canUse ? { scale: 1.1 } : undefined}
									onClick={() => {
										if (canUse) {
											action.onClick();
											if (action.id !== 'walk') {
												onClose();
											}
										} else if (!hasEnoughEnergy(action.energyCost)) {
											toast.addToast({
												message: `Not enough energy for ${action.label.toLowerCase()}!`,
												type: 'warning'
											});
										} else if (!checkCooldown(action.id)) {
											toast.addToast({
												message: `${action.label} is on cooldown!`,
												type: 'info'
											});
										}
									}}
								>
									<Icon className="w-6 h-6" />
									<span className="absolute whitespace-nowrap text-sm font-medium bg-white text-gray-800 
										px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity 
										-bottom-8 left-1/2 transform -translate-x-1/2 shadow-sm">
										{action.label}
										{action.energyCost > 0 && (
											<span className="ml-1 text-xs text-gray-500">
												({action.energyCost} energy)
											</span>
										)}
									</span>
								</motion.button>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>

			<AdventureInterface
				isOpen={showAdventure}
				onClose={() => {
					setShowAdventure(false);
					onClose();
				}}
				currentPetId="1"
				onStartAdventure={(selectedPets) => {
					if (consumeEnergy(30)) {
						startCooldown('walk');
						playSound('button');
						// Handle adventure start with selected pets
					}
				}}
			/>
		</>
	);
}

// Shiba Model Component
function Shiba({ position, rotation, scale, onClick }: {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
	onClick: (event: THREE.Event) => void;
}) {
	const group = useRef<THREE.Group>(null);
	const { nodes, materials, animations } = useGLTF('/models/shiba/scene.gltf') as GLTFResult;
	const { actions } = useAnimations(animations, group);

	useEffect(() => {
		// Always play standing animation
		const action = actions['standing'];
		if (action) {
			action.reset().play();
			action.setLoop(THREE.LoopRepeat, Infinity);
		}
	}, [actions]);

	return (
		<group
			ref={group}
			position={position}
			rotation={rotation}
			scale={scale}
			onClick={onClick}
			onPointerOver={() => {
				document.body.style.cursor = 'pointer';
			}}
			onPointerOut={() => {
				document.body.style.cursor = 'auto';
			}}
		>
			<group name="Sketchfab_Scene">
				<group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
					<group name="root">
						<group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
							<group name="RootNode0_0" scale={0.01}>
								<group name="skeletal3_3">
									<group name="GLTF_created_0">
										<primitive object={nodes.GLTF_created_0_rootJoint} />
										<skinnedMesh
											name="Object_130"
											geometry={nodes.Object_130.geometry}
											material={materials.material_0}
											skeleton={nodes.Object_130.skeleton}
											castShadow
											receiveShadow
										/>
									</group>
								</group>
							</group>
						</group>
					</group>
				</group>
			</group>
		</group>
	);
}

// Scene Component
function Scene({ onPetClick }: { onPetClick: (event: THREE.Event) => void }) {
	const { camera } = useThree();

	const handlePetClick = (event: THREE.Event) => {
		const targetPosition = new THREE.Vector3(0, 0.5, 0);
		camera.position.lerp(new THREE.Vector3(5, 3, 5), 0.5);
		camera.lookAt(targetPosition);
		onPetClick(event);
	};

	return (
		<>
			<OrbitControls
				target={[0, 0.5, 0]}
				maxPolarAngle={Math.PI * 0.5}
				minDistance={3}
				maxDistance={10}
				enableDamping
				dampingFactor={0.05}
			/>

			<ambientLight intensity={0.5} />
			<directionalLight
				castShadow
				position={[2.5, 8, 5]}
				intensity={1.5}
				shadow-mapSize={[1024, 1024]}
			>
				<orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
			</directionalLight>

			<Environment preset="park" />

			<Suspense fallback={<Loader />}>
				<Shiba
					position={[0, 0, 0]}
					rotation={[0, Math.PI * 0.25, 0]}
					scale={1}
					onClick={handlePetClick}
				/>
			</Suspense>

			<Ground />
		</>
	);
}

// Main ThreeCanvas Component
export function ThreeCanvas({ onPetClick }: { onPetClick?: () => void }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [petScreenPosition, setPetScreenPosition] = useState({ x: 0, y: 0 });
	const { playSound } = useSounds();
	const canvasRef = useRef<HTMLDivElement>(null);

	const updatePetScreenPosition = () => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		setPetScreenPosition({
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2
		});
	};

	useEffect(() => {
		updatePetScreenPosition();
		window.addEventListener('resize', updatePetScreenPosition);
		return () => window.removeEventListener('resize', updatePetScreenPosition);
	}, []);

	const handlePetClick = (event: THREE.Event) => {
		updatePetScreenPosition();
		setMenuOpen(true);
		playSound('button');
		onPetClick?.();
	};

	return (
		<div ref={canvasRef} className="w-full h-full relative">
			<Canvas
				shadows
				camera={{ position: [5, 3, 5], fov: 50 }}
				dpr={[1, 2]}
			>
				<color attach="background" args={['#f0f0f0']} />
				<fog attach="fog" args={['#f0f0f0', 0, 100]} />

				<PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
				<Suspense fallback={<Loader />}>
					<Scene onPetClick={handlePetClick} />
				</Suspense>
			</Canvas>

			<CircularMenu
				isOpen={menuOpen}
				onClose={() => setMenuOpen(false)}
				position={petScreenPosition}
				radius={120}
			/>
		</div>
	);
}

// Preload the model
useGLTF.preload('/models/shiba/scene.gltf');