import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";

type FloatProps = {
  speed?: number;
  rot?: number;
  amplitude?: number;
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
};

/** Gentle idle bob + sway wrapper used by every prop in the scene. */
function Drift({
  speed = 1,
  rot = 0.25,
  amplitude = 0.16,
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: FloatProps) {
  const ref = useRef<Group>(null);
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime * speed + seed;
    g.position.y = position[1] + Math.sin(t) * amplitude;
    g.rotation.z = rotation[2] + Math.sin(t * 0.7) * rot * 0.4;
    g.rotation.y = rotation[1] + Math.sin(t * 0.5) * rot * 0.5;
    g.rotation.x = rotation[0] + Math.cos(t * 0.6) * rot * 0.2;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {children}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Individual stationery props                                         */
/* ------------------------------------------------------------------ */

function Book({
  color,
  position,
  rotation,
  scale = 1,
  speed = 1,
}: {
  color: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={speed} amplitude={0.13}>
      <RoundedBox args={[1.5, 0.26, 1.08]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.02} />
      </RoundedBox>
      {/* pages */}
      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[1.44, 0.19, 1.02]} />
        <meshStandardMaterial color="#fdfaf1" roughness={0.9} />
      </mesh>
      {/* spine */}
      <mesh position={[-0.74, 0, 0]}>
        <boxGeometry args={[0.05, 0.27, 1.08]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </Drift>
  );
}

function Pencil({ position, rotation, scale = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const body = useMemo(() => new Array(6).fill(0), []);
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={1.15} amplitude={0.18} rot={0.35}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* hex body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.7, 6]} />
          <meshStandardMaterial color="#ffc93c" roughness={0.45} />
        </mesh>
        {body.map((_, i) => (
          <mesh key={i} position={[0, 0, 0]} rotation={[0, (i * Math.PI) / 3, 0]} visible={false}>
            <boxGeometry args={[0.001, 0.001, 0.001]} />
            <meshStandardMaterial />
          </mesh>
        ))}
        {/* wood tip */}
        <mesh position={[0, 0.99, 0]} castShadow>
          <coneGeometry args={[0.1, 0.28, 12]} />
          <meshStandardMaterial color="#e8c68a" roughness={0.7} />
        </mesh>
        {/* graphite */}
        <mesh position={[0, 1.13, 0]}>
          <coneGeometry args={[0.045, 0.1, 12]} />
          <meshStandardMaterial color="#2b2b2b" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* ferrule */}
        <mesh position={[0, -0.92, 0]}>
          <cylinderGeometry args={[0.105, 0.105, 0.16, 16]} />
          <meshStandardMaterial color="#cfd4da" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* eraser */}
        <mesh position={[0, -1.06, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.14, 16]} />
          <meshStandardMaterial color="#ff8fa3" roughness={0.85} />
        </mesh>
      </group>
    </Drift>
  );
}

function Pen({ position, rotation, scale = 1, color = "#2563eb" }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={0.9} amplitude={0.15} rot={0.3}>
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.085, 0.085, 1.5, 20]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.35} />
        </mesh>
        {/* grip */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.34, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* cone tip */}
        <mesh position={[0, 0.84, 0]}>
          <coneGeometry args={[0.08, 0.24, 18]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.25} metalness={0.8} />
        </mesh>
        {/* cap clip */}
        <mesh position={[0.1, 0.35, 0]}>
          <boxGeometry args={[0.04, 0.6, 0.06]} />
          <meshStandardMaterial color="#f2a200" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
    </Drift>
  );
}

function Ruler({ position, rotation, scale = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const ticks = useMemo(() => Array.from({ length: 14 }, (_, i) => -0.65 + i * 0.1), []);
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={0.8} amplitude={0.12} rot={0.2}>
      <RoundedBox args={[1.6, 0.05, 0.3]} radius={0.02} smoothness={3} castShadow>
        <meshStandardMaterial color="#ffd75e" roughness={0.35} transparent opacity={0.92} />
      </RoundedBox>
      {ticks.map((x, i) => (
        <mesh key={i} position={[x, 0.028, i % 2 === 0 ? -0.06 : -0.09]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, i % 2 === 0 ? 0.14 : 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={1} />
        </mesh>
      ))}
    </Drift>
  );
}

function Eraser({ position, rotation, scale = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={1.05} amplitude={0.14} rot={0.4}>
      <RoundedBox args={[0.62, 0.3, 0.38]} radius={0.07} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#7dd3fc" roughness={0.75} />
      </RoundedBox>
      <mesh position={[0, 0.151, 0]}>
        <boxGeometry args={[0.63, 0.012, 0.39]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </Drift>
  );
}

function Notebook({ position, rotation, scale = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const rings = useMemo(() => Array.from({ length: 9 }, (_, i) => -0.62 + i * 0.155), []);
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={0.95} amplitude={0.15} rot={0.22}>
      {/* cover */}
      <RoundedBox args={[1.2, 0.16, 1.55]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#ff6b57" roughness={0.6} />
      </RoundedBox>
      {/* pages block */}
      <mesh position={[0.035, 0, 0.01]}>
        <boxGeometry args={[1.15, 0.12, 1.48]} />
        <meshStandardMaterial color="#fffdf7" roughness={0.95} />
      </mesh>
      {/* spiral */}
      {rings.map((z, i) => (
        <mesh key={i} position={[0, 0.005, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.1, 0.018, 8, 18, Math.PI * 1.5]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </Drift>
  );
}

function Ball({ position, scale = 1 }: {
  position: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * 0.55;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9) * 0.15;
  });
  return (
    <group position={position} scale={scale}>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.5, 48, 48]} />
        <meshStandardMaterial color="#e11d48" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* seam */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 12, 64]} />
        <meshStandardMaterial color="#fffdf7" roughness={0.7} />
      </mesh>
    </group>
  );
}

function PaintSet({ position, rotation, scale = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const colors = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={1.1} amplitude={0.16} rot={0.3}>
      <RoundedBox args={[1.15, 0.14, 0.75]} radius={0.06} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </RoundedBox>
      {colors.map((c, i) => (
        <mesh key={c} position={[-0.36 + i * 0.18, 0.08, i % 2 === 0 ? -0.14 : 0.14]}>
          <cylinderGeometry args={[0.075, 0.075, 0.06, 20]} />
          <meshStandardMaterial color={c} roughness={0.3} />
        </mesh>
      ))}
    </Drift>
  );
}

function PaperPlane({ position, rotation, scale = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = position[1] + Math.sin(t * 0.7) * 0.35;
    g.rotation.y = rotation?.[1 ?? 0] + Math.sin(t * 0.4) * 0.4;
    g.rotation.z = (rotation?.[2] ?? 0) + Math.sin(t * 0.55) * 0.18;
  });
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <coneGeometry args={[0.3, 1, 4, 1, true]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.5}
          metalness={0.05}
          side={2}
        />
      </mesh>
    </group>
  );
}

function StickyNote({ position, rotation, color, scale = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <Drift position={position} rotation={rotation} scale={scale} speed={1.2} amplitude={0.13} rot={0.45}>
      <RoundedBox args={[0.72, 0.06, 0.72]} radius={0.02} smoothness={3} castShadow>
        <meshStandardMaterial color={color} roughness={0.85} />
      </RoundedBox>
    </Drift>
  );
}

/* ------------------------------------------------------------------ */

export default function StationeryScene() {
  const root = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const { x, y } = state.pointer;
    // eased parallax follow of pointer / device tilt
    g.rotation.y += (x * 0.28 - g.rotation.y) * Math.min(1, delta * 2.4);
    g.rotation.x += (-y * 0.16 - g.rotation.x) * Math.min(1, delta * 2.4);
  });

  return (
    <group ref={root}>
      {/* --- back layer --- */}
      <Book color="#2563eb" position={[-2.5, 1.1, -1.6]} rotation={[0.1, 0.5, -0.16]} scale={0.85} speed={0.8} />
      <Book color="#7c5cff" position={[2.6, -0.9, -1.8]} rotation={[-0.08, -0.4, 0.2]} scale={0.8} speed={1.1} />
      <Ruler position={[1.9, 1.5, -1.2]} rotation={[0.3, -0.5, 0.9]} scale={0.95} />
      <StickyNote position={[-1.6, -1.5, -1.1]} rotation={[0.4, 0.3, 0.2]} color="#ffe27a" />
      <PaperPlane position={[3.1, 1.9, -0.9]} rotation={[0.5, -0.8, 0.35]} scale={0.85} />

      {/* --- mid layer --- */}
      <Notebook position={[-1.85, -0.35, 0]} rotation={[0.12, 0.35, -0.12]} scale={0.95} />
      <Pencil position={[-0.2, 1.35, 0.2]} rotation={[0.1, 0.2, 0.5]} scale={0.95} />
      <Pencil position={[0.55, 1.05, -0.3]} rotation={[-0.15, -0.3, 0.85]} scale={0.82} />
      <Pen position={[1.5, 0.25, 0.3]} rotation={[0.2, 0.4, -0.55]} scale={0.95} />
      <Eraser position={[0.35, -1.25, 0.5]} rotation={[0.2, 0.6, 0.35]} scale={0.95} />

      {/* --- front layer --- */}
      <Ball position={[2.35, -1.35, 0.9]} scale={0.62} />
      <PaintSet position={[-2.9, -1.6, 0.7]} rotation={[0.15, -0.35, 0.12]} scale={0.85} />
      <Book color="#22c7a9" position={[0.05, -0.05, 1.3]} rotation={[0.05, -0.25, 0.12]} scale={0.72} speed={1.25} />
      <StickyNote position={[1.15, -1.85, 1.1]} rotation={[-0.3, -0.5, 0.5]} color="#a5f3fc" scale={0.9} />
      <Pen position={[-3.3, 1.4, 0.6]} rotation={[0.35, -0.2, 1.15]} scale={0.7} color="#ff6b57" />
    </group>
  );
}
