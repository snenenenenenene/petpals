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
	Trophy
} from 'lucide-react';
import { useSounds } from '@/hooks/useSounds';
import { GLTF } from 'three-stdlib';
import { usePetStore } from '@/store/petStore';

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
	onClick: () => void;
}


function CircularMenu({ isOpen, onClose, position, radius = 120 }: {
	isOpen: boolean;
	onClose: () => void;
	position: { x: number; y: number };
	radius?: number;
}) {
	const { playSound } = useSounds();
	const { stats, updateStats } = usePetStore();

	const ACTIONS: MenuAction[] = [
		{
			id: 'feed',
			icon: Bone,
			label: 'Feed',
			color: 'bg-amber-500',
			onClick: () => {
				playSound('button');
				updateStats({
					hunger: Math.min(stats.hunger + 30, 100),
					happiness: Math.min(stats.happiness + 5, 100),
					energy: Math.min(stats.energy + 10, 100)
				});
			}
		},
		{
			id: 'pet',
			icon: Heart,
			label: 'Pet',
			color: 'bg-red-500',
			onClick: () => console.log('Pet')
		},
		{
			id: 'adventure',
			icon: MapPin,
			label: 'Adventure',
			color: 'bg-blue-500',
			onClick: () => console.log('Adventure')
		},
		{
			id: 'wash',
			icon: Bath,
			label: 'Wash',
			color: 'bg-cyan-500',
			onClick: () => console.log('Wash')
		},
		{
			id: 'play',
			icon: Gamepad2,
			label: 'Play',
			color: 'bg-green-500',
			onClick: () => console.log('Play')
		},
		{
			id: 'train',
			icon: Trophy,
			label: 'Train',
			color: 'bg-purple-500',
			onClick: () => console.log('Train')
		}
	];


	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (isOpen && !(e.target as Element).closest('.circular-menu')) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, onClose]);

	const calculatePosition = (index: number) => {
		const angle = (index * 2 * Math.PI) / ACTIONS.length - Math.PI / 2;
		return {
			x: Math.cos(angle) * radius,
			y: Math.sin(angle) * radius
		};
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed pointer-events-auto circular-menu z-50"
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

						return (
							<motion.button
								key={action.id}
								className={`absolute rounded-full p-3 ${action.color} text-white shadow-lg
                  hover:scale-110 transition-transform group`}
								style={{
									left: pos.x,
									top: pos.y,
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
								whileHover={{ scale: 1.1 }}
								onClick={() => {
									playSound('button');
									action.onClick();
									onClose();
								}}
							>
								<Icon className="w-6 h-6" />
								<span className="absolute whitespace-nowrap text-sm font-medium bg-white text-gray-800 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -bottom-8 left-1/2 transform -translate-x-1/2">
									{action.label}
								</span>
							</motion.button>
						);
					})}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

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

type ShibaProps = {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
	onClick: (event: THREE.Event) => void;
};

function Shiba({ position, rotation, scale, onClick }: ShibaProps) {
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

interface SceneProps {
	onPetClick: (event: THREE.Event) => void;
}

function Scene({ onPetClick }: SceneProps) {
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

interface ThreeCanvasProps {
	onPetClick?: () => void;
}

export function ThreeCanvas({ onPetClick }: ThreeCanvasProps) {
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