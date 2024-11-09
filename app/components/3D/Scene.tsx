// // components/3D/Scene.tsx
// 'use client';

// import { Canvas } from '@react-three/fiber';
// import {
// 	OrbitControls,
// 	Environment,
// 	PerspectiveCamera
// } from '@react-three/drei';
// import { Suspense } from 'react';
// import { Shiba } from '../models/Shiba';
// import { Ground } from './Ground';

// export default function Scene() {
// 	return (
// 		<Canvas shadows>
// 			<color attach="background" args={['#f0f0f0']} />
// 			<PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
// 			<OrbitControls
// 				target={[0, 0.5, 0]}
// 				maxPolarAngle={Math.PI * 0.5}
// 				minDistance={3}
// 				maxDistance={10}
// 			/>

// 			<ambientLight intensity={0.5} />
// 			<directionalLight
// 				castShadow
// 				position={[2.5, 8, 5]}
// 				intensity={1.5}
// 				shadow-mapSize={[1024, 1024]}
// 			>
// 				<orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
// 			</directionalLight>

// 			<Environment preset="park" />
// 			<Ground />

// 			<Shiba
// 				position={[0, 0, 0]}
// 				rotation={[0, Math.PI * 0.25, 0]}
// 				scale={1}
// 			/>
// 		</Canvas>
// 	);
// }


// components/3D/Scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

function Box() {
	return (
		<mesh>
			<boxGeometry />
			<meshStandardMaterial color="orange" />
		</mesh>
	);
}

export default function Scene() {
	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas>
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} />
				<OrbitControls />
				{/* <Box /> */}

			</Canvas>
		</div>
	);
}