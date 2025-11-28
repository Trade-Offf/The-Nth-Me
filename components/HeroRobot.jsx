'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// 酸性绿色
const ACID_GREEN = '#CCFF00';
const ACID_GREEN_SECONDARY = '#00FF88';

// 相机镜头组件
function CameraLens({ lensRef }) {
  return (
    <group ref={lensRef} position={[0, 0, 1.45]}>
      {/* 外层镜头框 - 八边形效果 */}
      <mesh rotation={[0, 0, Math.PI / 8]}>
        <ringGeometry args={[0.55, 0.7, 8]} />
        <meshStandardMaterial
          color={ACID_GREEN}
          emissive={ACID_GREEN}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 中层镜片 - 玻璃效果 */}
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.5, 32]} />
        <meshPhysicalMaterial
          color="#050505"
          metalness={0.1}
          roughness={0}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {/* 内层光圈 */}
      <mesh position={[0, 0, 0.1]}>
        <ringGeometry args={[0.2, 0.35, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.8}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 核心发光点 */}
      <mesh position={[0, 0, 0.15]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial
          color={ACID_GREEN}
          emissive={ACID_GREEN}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* 镜头发光效果 */}
      <pointLight color={ACID_GREEN} intensity={3} distance={4} />
    </group>
  );
}

// 量子轨道环组件
function QuantumOrbit({ radius, tiltX, tiltZ, rotationSpeed, orbitRef, particleCount = 8 }) {
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        angle: (i / particleCount) * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
      });
    }
    return arr;
  }, [particleCount]);

  return (
    <group ref={orbitRef} rotation={[tiltX, 0, tiltZ]}>
      {/* 轨道环 */}
      <mesh>
        <torusGeometry args={[radius, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={ACID_GREEN}
          emissive={ACID_GREEN}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 轨道粒子 */}
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * radius,
            Math.sin(p.angle) * radius,
            0,
          ]}
        >
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color={ACID_GREEN}
            emissive={ACID_GREEN}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

// 扫描光效组件
function ScanEffect({ scanRef }) {
  return (
    <group ref={scanRef}>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 0.1]} />
        <meshStandardMaterial
          color={ACID_GREEN}
          emissive={ACID_GREEN}
          emissiveIntensity={1}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function HeroRobot() {
  const groupRef = useRef(null);
  const lensRef = useRef(null);
  const orbitRef1 = useRef(null);
  const orbitRef2 = useRef(null);
  const orbitRef3 = useRef(null);
  const scanRef = useRef(null);

  // 鼠标位置（视口坐标）
  useEffect(() => {
    const handleMove = (event) => {
      const { innerWidth, innerHeight } = window;
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

      // 鼠标跟随旋转
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

    // 镜头呼吸效果
    if (lensRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      lensRef.current.scale.set(scale, scale, scale);
    }

    // 轨道旋转
    if (orbitRef1.current) {
      orbitRef1.current.rotation.z = t * 0.3;
    }
    if (orbitRef2.current) {
      orbitRef2.current.rotation.z = -t * 0.4;
    }
    if (orbitRef3.current) {
      orbitRef3.current.rotation.z = t * 0.2;
    }

    // 扫描效果
    if (scanRef.current) {
      const scanY = ((t * 0.5) % 2 - 1) * 2;
      scanRef.current.position.y = scanY;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 主体球 - 深黑色 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#050505"
          roughness={0.15}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* 左耳机 */}
      <mesh position={[-1.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 右耳机 */}
      <mesh position={[1.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 相机镜头 */}
      <CameraLens lensRef={lensRef} />

      {/* 量子轨道环 */}
      <QuantumOrbit
        radius={2.2}
        tiltX={Math.PI / 2}
        tiltZ={0}
        rotationSpeed={0.3}
        orbitRef={orbitRef1}
        particleCount={6}
      />
      <QuantumOrbit
        radius={2.5}
        tiltX={Math.PI / 3}
        tiltZ={Math.PI / 4}
        rotationSpeed={-0.4}
        orbitRef={orbitRef2}
        particleCount={8}
      />
      <QuantumOrbit
        radius={2.8}
        tiltX={Math.PI / 2.5}
        tiltZ={-Math.PI / 6}
        rotationSpeed={0.2}
        orbitRef={orbitRef3}
        particleCount={5}
      />

      {/* 扫描效果 */}
      <ScanEffect scanRef={scanRef} />

      {/* 边缘光 - 酸性绿 */}
      <pointLight position={[-3, 2, 2]} color={ACID_GREEN} intensity={4} />
      <pointLight position={[3, -2, 2]} color={ACID_GREEN_SECONDARY} intensity={3} />
      <pointLight position={[0, 3, -2]} color={ACID_GREEN} intensity={2} />

      {/* 环境反射 */}
      <Environment files="/hdri/potsdamer_platz_1k.hdr" />
    </group>
  );
}

