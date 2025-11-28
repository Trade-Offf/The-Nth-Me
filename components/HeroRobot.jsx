'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Trail, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// 核心配色
const ACID_GREEN = '#CCFF00';

// --- 1. 子组件：科技刻度环 (HUD Ticks) ---
// 使用 InstancedMesh 渲染大量刻度，性能极高
function TechTicks({ radius, count = 48 }) {
  const tickData = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
        rotation: [0, 0, angle],
      };
    });
  }, [count, radius]);

  return (
    <Instances range={count}>
      <boxGeometry args={[0.04, 0.1, 0.01]} />
      <meshBasicMaterial color={ACID_GREEN} transparent opacity={0.4} />
      {tickData.map((data, i) => (
        <Instance key={i} position={data.position} rotation={data.rotation} />
      ))}
    </Instances>
  );
}

// --- 2. 子组件：单个数据光梭 (Data Packet) ---
const DataPacket = ({ radius, speed, offset, zOffset }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const currentAngle = offset + t * speed;

    // 运动轨迹计算
    const x = Math.cos(currentAngle) * radius;
    const y = Math.sin(currentAngle) * radius;
    // Z轴微动，产生悬浮感
    const z = zOffset + Math.sin(t * 3 + offset) * 0.05;

    meshRef.current.position.set(x, y, z);
    // 旋转物体使其始终切向面对前方
    meshRef.current.rotation.z = currentAngle + Math.PI / 2;

    // 呼吸频闪
    const pulse = 1 + Math.sin(t * 12 + offset) * 0.2;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <Trail
      width={1.2} // 拖尾宽度
      length={4} // 拖尾长度
      color={ACID_GREEN}
      attenuation={(t) => t * t} // 尾部渐隐
    >
      <mesh ref={meshRef}>
        {/* 扁平晶体造型 */}
        <boxGeometry args={[0.05, 0.25, 0.02]} />
        {/* 核心纯白，外发光靠拖尾，对比度更高 */}
        <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
      </mesh>
    </Trail>
  );
};

// --- 3. 核心组件：重构后的数据流环 ---
function DataFlowRing() {
  const groupRef = useRef(null);
  const ticksRef = useRef(null);

  const radius = 2.1;
  const nodeCount = 8; // 减少数量，提升单个质感

  // 生成随机数据包配置
  const packets = useMemo(() => {
    return new Array(nodeCount).fill(0).map((_, i) => ({
      offset: (i / nodeCount) * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.3,
      zOffset: (Math.random() - 0.5) * 0.15,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 主环顺时针慢转
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.05;
      // 增加一点点原本不存在的X轴倾角摆动，增加体积感
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
    }

    // 刻度环逆时针旋转 (对冲运动增加机械感)
    if (ticksRef.current) {
      ticksRef.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* A. 物理导轨 (深色金属实体) - 解决"单薄"问题 */}
      <mesh>
        <torusGeometry args={[radius, 0.04, 16, 100]} />
        <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} clearcoat={1} />
      </mesh>

      {/* B. 能量内环 (发光细线) */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[radius - 0.1, 0.005, 16, 100]} />
        <meshBasicMaterial color={ACID_GREEN} transparent opacity={0.6} />
      </mesh>

      {/* C. 科技刻度环 (外部动态UI) */}
      <group ref={ticksRef}>
        <TechTicks radius={radius + 0.2} count={48} />
      </group>

      {/* D. 静态装饰外圈 (极细虚线) */}
      <mesh>
        <ringGeometry args={[radius + 0.35, radius + 0.355, 64]} />
        <meshBasicMaterial color={ACID_GREEN} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* E. 动态数据光梭 */}
      {packets.map((data, i) => (
        <DataPacket
          key={i}
          radius={radius}
          speed={data.speed}
          offset={data.offset}
          zOffset={data.zOffset}
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

      {/* 数据流环 - 倾斜放置 */}
      <group rotation={[Math.PI / 2, Math.PI / 6, 0]}>
        <DataFlowRing />
      </group>

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
