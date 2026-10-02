import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  AdaptiveDpr,
} from "@react-three/drei";
import StationeryScene from "./stationery/StationeryScene";

function canRunWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Hero 3D island — floating stationery (books, pencils, pen, ruler, eraser,
 * notebook, cricket ball, paint set, sticky notes, paper plane).
 *
 * Lazy: only mounts when the container scrolls near the viewport, on devices
 * without reduced-motion preference, and only when WebGL is available.
 */
export default function HeroCanvas() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = document.getElementById("hero-canvas");
    if (reduced || !el || !canRunWebGL()) return;

    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!show) return null;

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      shadows={false}
      frameloop="always"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.15} />
        <directionalLight position={[5, 7, 5]} intensity={1.5} />
        <directionalLight position={[-6, 3, -4]} intensity={0.55} color="#cfe0ff" />

        <StationeryScene />

        <ContactShadows
          position={[0, -2.7, 0]}
          opacity={0.28}
          scale={16}
          blur={2.6}
          far={5}
          color="#1e293b"
        />

        <Environment resolution={128}>
          <Lightformer intensity={1.2} position={[0, 5, -6]} scale={[12, 6, 1]} />
          <Lightformer intensity={0.9} position={[-6, 2, 2]} scale={[6, 6, 1]} color="#fff7e0" />
          <Lightformer intensity={0.8} position={[6, -1, 3]} scale={[6, 6, 1]} color="#e0ecff" />
        </Environment>

        <AdaptiveDpr pixelated />
      </Suspense>
    </Canvas>
  );
}
