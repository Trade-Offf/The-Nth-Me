'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import HeroRobot from './HeroRobot';
import { Suspense } from 'react';

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

        {/* Ambient light for overall illumination */}
        <ambientLight intensity={0.3} />

        {/* Main directional light */}
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Suspense fallback={null}>
          <HeroRobot />
        </Suspense>

        {/* Optional: Allow user to rotate the scene */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

