'use client';

import { useRef, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

// 扩展 Three.js 元素以支持 JSX
extend(THREE);

export default function HeroRobot() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  // 鼠标位置（视口坐标）
  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      // 归一化到 [-1, 1]
      const x = (event.clientX / innerWidth) * 2 - 1;
      const y = -((event.clientY / innerHeight) * 2 - 1);

      if (groupRef.current) {
        groupRef.current.userData.mouseX = x;
        groupRef.current.userData.mouseY = y;
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // 柔和上下浮动
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;

      // 使用全局鼠标坐标做旋转
      const mouseX = groupRef.current.userData.mouseX ?? 0;
      const mouseY = groupRef.current.userData.mouseY ?? 0;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.2,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.5,
        0.05
      );
    }

    // 面部问号的呼吸发光
    if (headRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      headRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Head - Black Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Left Ear/Headphone */}
      <mesh position={[-1.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Right Ear/Headphone */}
      <mesh position={[1.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Face Symbol - Glowing Question Mark */}
      <group ref={headRef} position={[0, 0, 1.5]}>
        <Text
          fontSize={1.2}
          color="#7c3aed"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#a855f7"
        >
          ?
        </Text>
        {/* Glow effect */}
        <pointLight color="#a855f7" intensity={2} distance={5} />
      </group>

      {/* Rim Lighting - Cyan */}
      <pointLight position={[-3, 2, 2]} color="#06b6d4" intensity={3} />
      
      {/* Rim Lighting - Purple */}
      <pointLight position={[3, -2, 2]} color="#a855f7" intensity={3} />

      {/* Environment for reflections */}
      <Environment preset="city" />
    </group>
  );
}

