'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Trail } from '@react-three/drei';
import * as THREE from 'three';

// 核心配色
const ACID_GREEN = '#CCFF00';

// --- 1. 创建 0/1 文字纹理 ---
function createBitTexture(bit, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, 64, 64);

  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(bit, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// --- 2. 数据流字符 (0/1 带拖尾) ---
const DataBit = ({ index, total, radius, speed, direction, color, bit }) => {
  const spriteRef = useRef();
  const initialAngle = (index / total) * Math.PI * 2;

  // 根据传入的 bit 创建纹理
  const texture = useMemo(() => {
    return createBitTexture(bit, '#FFFFFF');
  }, [bit]);

  useFrame((state) => {
    if (!spriteRef.current) return;
    const t = state.clock.getElapsedTime();

    // 垂直圆周运动 (XY 平面)
    const angle = initialAngle + t * speed * direction;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Z 轴微小波动
    const z = Math.sin(t * 2 + index) * 0.1;

    spriteRef.current.position.set(x, y, z);

    // 呼吸脉动效果
    const pulse = 0.3 + Math.sin(t * 4 + index * 0.6) * 0.1;
    spriteRef.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <Trail
      width={0.6}
      length={8}
      color={color}
      attenuation={(t) => t * t}
    >
      <sprite ref={spriteRef} scale={[0.3, 0.3, 0.3]}>
        <spriteMaterial map={texture} transparent opacity={1} />
      </sprite>
    </Trail>
  );
};

// --- 3. 双轨道数据流系统 ---
function DualOrbit() {
  const groupRef = useRef(null);

  const config = {
    innerRadius: 2.0,   // 内圈 0
    outerRadius: 2.5,   // 外圈 1
    speed: 0.5,
    bitsPerOrbit: 8,
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // 整体轻微摆动
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 内圈 - 0 - 顺时针 */}
      {Array.from({ length: config.bitsPerOrbit }).map((_, i) => (
        <DataBit
          key={`inner-${i}`}
          index={i}
          total={config.bitsPerOrbit}
          radius={config.innerRadius}
          speed={config.speed}
          direction={1}
          color={ACID_GREEN}
          bit="0"
        />
      ))}

      {/* 外圈 - 1 - 逆时针 */}
      {Array.from({ length: config.bitsPerOrbit }).map((_, i) => (
        <DataBit
          key={`outer-${i}`}
          index={i}
          total={config.bitsPerOrbit}
          radius={config.outerRadius}
          speed={config.speed}
          direction={-1}
          color="#00FFAA"
          bit="1"
        />
      ))}
    </group>
  );
}

// --- 4. 镜头组件 (保持不变) ---
function CameraLens({ lensRef }) {
  return (
    <group ref={lensRef} position={[0, 0, 1.4]}>
      <mesh position={[0, 0, 0.08]}>
        <circleGeometry args={[0.7, 64]} />
        <meshPhysicalMaterial
          color="#0a1a0a"
          metalness={0.2}
          roughness={0}
          transmission={0.3}
          thickness={0.3}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={2}
          reflectivity={1}
        />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <ringGeometry args={[0.35, 0.55, 64]} />
        <meshPhysicalMaterial
          color={ACID_GREEN}
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[0.32, 64]} />
        <meshPhysicalMaterial
          color="#050808"
          metalness={0.1}
          roughness={0}
          transmission={0.5}
          thickness={0.2}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[0, 0, 0.15]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color={ACID_GREEN} emissive={ACID_GREEN} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <circleGeometry args={[0.06, 32]} />
        <meshStandardMaterial color="#000000" emissive={ACID_GREEN} emissiveIntensity={0.5} />
      </mesh>
      <pointLight color={ACID_GREEN} intensity={2} distance={3} decay={2} />
      <spotLight
        position={[0, 0, 0.5]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        color={ACID_GREEN}
        distance={5}
      />
    </group>
  );
}

// --- 5. 主场景组件 ---
export default function HeroRobot() {
  const groupRef = useRef(null);
  const lensRef = useRef(null);

  // 鼠标交互逻辑
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
      // 悬浮动画
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.25;

      // 鼠标跟随阻尼动画
      const mouseX = groupRef.current.userData.mouseX ?? 0;
      const mouseY = groupRef.current.userData.mouseY ?? 0;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.15,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.1,
        0.05
      );
    }

    // 镜头缩放呼吸
    if (lensRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.03;
      lensRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 机器人主体球 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#080808"
          roughness={0.12}
          metalness={0.95}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 双轨道粒子 - 一顺一逆 */}
      <DualOrbit />

      {/* 左耳部件 */}
      <group position={[-1.75, 0.3, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.12, 16, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.08} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.02, 16, 32]} />
          <meshStandardMaterial
            color={ACID_GREEN}
            emissive={ACID_GREEN}
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* 右耳部件 */}
      <group position={[1.75, 0.3, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.12, 16, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.08} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.02, 16, 32]} />
          <meshStandardMaterial
            color={ACID_GREEN}
            emissive={ACID_GREEN}
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* 相机镜头 */}
      <CameraLens lensRef={lensRef} />

      {/* 场景灯光 */}
      <pointLight position={[-3, 2, 3]} color={ACID_GREEN} intensity={3} decay={2} />
      <pointLight position={[3, -1, 3]} color={ACID_GREEN} intensity={2} decay={2} />
      <pointLight position={[0, 3, -2]} color={ACID_GREEN} intensity={1.5} decay={2} />
      <pointLight position={[0, 0, -3]} color="#00ff66" intensity={1} decay={2} />

      {/* 环境贴图 */}
      <Environment files="/hdri/potsdamer_platz_1k.hdr" />
    </group>
  );
}
