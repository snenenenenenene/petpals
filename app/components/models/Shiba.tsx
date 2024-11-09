// 

// components/3D/Model.tsx
import { useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
	nodes: {
		Object_130: THREE.SkinnedMesh;
		GLTF_created_0_rootJoint: THREE.Bone;
	};
	materials: {
		material_0: THREE.MeshStandardMaterial;
	};
};

type ActionName = 'standing' | 'sitting' | 'shake' | 'rollover' | 'play_dead';
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

type ModelProps = {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
};

export function Shiba({ position, rotation, scale }: ModelProps) {
	const group = useRef<THREE.Group>();
	const { nodes, materials, animations } = useGLTF('/models/shiba/scene.gltf') as GLTFResult;
	const { actions } = useAnimations<GLTFActions>(animations, group);

	return (
		<group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
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
										/>
										<group name="shiba_inu2_2_correction">
											<group name="shiba_inu2_2" />
										</group>
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

useGLTF.preload('/models/shiba/scene.gltf');