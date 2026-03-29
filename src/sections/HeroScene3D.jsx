import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ mode }) {
  const pointsRef = useRef(null);
  const particleCount = mode === "mobile" ? 1200 : 2400;

  const positions = useMemo(() => {
    const array = new Float32Array(particleCount * 3);

    for (let i = 0; i < array.length; i += 3) {
      array[i] = (Math.random() - 0.5) * 26;
      array[i + 1] = (Math.random() - 0.5) * 14;
      array[i + 2] = (Math.random() - 0.5) * 18;
    }

    return array;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * (mode === "mobile" ? 0.02 : 0.035);
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.12;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.24) * 0.18;
  });

  return (
    <>
      <fog attach="fog" args={["#05070d", 10, 30]} />

      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#9ddcff"
          size={mode === "mobile" ? 0.065 : 0.075}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <mesh position={[-3.8, 1.6, -5.5]}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial
          color="#1b9fff"
          transparent
          opacity={mode === "mobile" ? 0.06 : 0.08}
        />
      </mesh>

      <mesh position={[4.2, -1.1, -5.8]}>
        <sphereGeometry args={[2.1, 48, 48]} />
        <meshBasicMaterial
          color="#5b7dff"
          transparent
          opacity={mode === "mobile" ? 0.05 : 0.07}
        />
      </mesh>
    </>
  );
}

export default function HeroScene3D({ mode = "desktop" }) {
  return (
    <div className="hero-canvas-wrap" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 52 }}
        dpr={mode === "mobile" ? [1, 1.2] : [1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ParticleField mode={mode} />
        </Suspense>
      </Canvas>
    </div>
  );
}
