import { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  max?: number;
};

/**
 * 3D tilt-on-hover card (21st.dev style).
 * Springs the card toward the pointer, adds a moving glare highlight.
 */
export default function TiltCard({ children, className = "", max = 9 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({
      transform: `perspective(900px) rotateX(${(0.5 - py) * max * 2}deg) rotateY(${
        (px - 0.5) * max * 2
      }deg) translateZ(14px) scale(1.02)`,
    });
    setGlare({ x: px * 100, y: py * 100, o: 0.16 });
  };

  const onLeave = () => {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)" });
    setGlare((g) => ({ ...g, o: 0 }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative ${className}`}
      style={{ perspective: "900px" }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-out will-change-transform"
        style={{ ...style, transformStyle: "preserve-3d" }}
      >
        {children}
        {/* glare */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgb(255 255 255 / 0.85), transparent 62%)`,
            opacity: glare.o,
          }}
        />
      </div>
    </div>
  );
}
