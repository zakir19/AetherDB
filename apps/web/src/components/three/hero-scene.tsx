"use client";

import React, { useRef, useMemo, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";
import {
  cosmicVertexShader,
  cosmicFragmentShader,
  particleVertexShader,
  particleFragmentShader,
} from "./shaders";

// ─── Cosmic Nebula Mesh ────────────────────────────────────
function CosmicNebula() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: 0 },
      uScroll: { value: 0 },
      uColor1: { value: new THREE.Color("#0a0020") },
      uColor2: { value: new THREE.Color("#1a0050") },
      uColor3: { value: new THREE.Color("#6366f1") },
      uOpacity: { value: 0.85 },
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();

    // Smooth mouse tracking
    mouseRef.current += (Math.abs(pointer.x) + Math.abs(pointer.y) - mouseRef.current) * 0.05;
    materialRef.current.uniforms.uMouse.value = mouseRef.current;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.3, 0, 0]} position={[0, -2, -5]}>
      <planeGeometry args={[30, 30, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cosmicVertexShader}
        fragmentShader={cosmicFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Floating Particles ────────────────────────────────────
function FloatingParticles({ count = 2000 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, scales, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      scales[i] = Math.random() * 2 + 0.5;
      speeds[i] = Math.random() * 0.5 + 0.1;
    }

    return { positions, scales, speeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
      uSize: { value: 3.0 },
      uColor: { value: new THREE.Color("#6366f1") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* Use args to construct the underlying BufferAttribute instances so that
            @react-three/fiber's types are satisfied. */}
        <bufferAttribute
          attach="attributes-position"
          // positions, itemSize
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          // scales, itemSize
          args={[scales, 1]}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          // speeds, itemSize
          args={[speeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Floating Orbs ─────────────────────────────────────────
function GlowOrb({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.scale.setScalar(
      scale * (1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.1)
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

// ─── Scene ─────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#a855f7" />

      <CosmicNebula />
      <FloatingParticles count={1500} />

      <GlowOrb position={[-6, 3, -8]} color="#6366f1" scale={1.5} />
      <GlowOrb position={[5, -2, -6]} color="#a855f7" scale={1} />
      <GlowOrb position={[8, 4, -10]} color="#3b82f6" scale={2} />
      <GlowOrb position={[-4, -4, -7]} color="#8b5cf6" scale={0.8} />
      <GlowOrb position={[0, 6, -12]} color="#6366f1" scale={1.2} />

      <Stars
        radius={50}
        depth={80}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  );
}

// ─── Camera Controller ─────────────────────────────────────
function CameraController() {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }) => {
    targetRotation.current.x = pointer.y * 0.1;
    targetRotation.current.y = pointer.x * 0.1;

    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.02;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.02;
  });

  return null;
}

// ─── Loading Fallback ──────────────────────────────────────
function CanvasFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0020] via-[#0d0030] to-[#060018]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.15)_0%,_transparent_70%)]" />
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────
export default function HeroScene() {
  const [isReducedMotion, setIsReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isReducedMotion) {
    return <CanvasFallback />;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <Scene />
          <CameraController />
        </Canvas>
      </Suspense>
      {/* Gradient overlay for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[hsl(var(--aether-bg))]" />
    </div>
  );
}
