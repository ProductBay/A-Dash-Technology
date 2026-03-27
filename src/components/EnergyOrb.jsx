import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

function Core() {
  const mesh = useRef();

  useFrame(({ clock }) => {
    mesh.current.rotation.y = clock.elapsedTime * 0.25;
    mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={1.4} floatIntensity={2}>
      <mesh ref={mesh} scale={1.8}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#6cf2ff"
          emissive="#6cf2ff"
          emissiveIntensity={1}
          distort={0.45}
          speed={2.4}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function EnergyOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ filter: "drop-shadow(0 0 40px rgba(108,242,255,0.35))" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[-5, -2, -2]} intensity={1.5} color="#6cf2ff" />
      <Core />
    </Canvas>
  );
}
