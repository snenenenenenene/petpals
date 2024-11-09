// components/3D/Ground.tsx
'use client';

import { memo } from 'react';
import * as THREE from 'three';

export const Ground = memo(() => {
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
});

Ground.displayName = 'Ground';