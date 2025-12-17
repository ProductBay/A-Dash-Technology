import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useRef } from "react";

/* =========================
   3D BACKGROUND COMPONENT
========================= */

function DataField() {
  const group = useRef();

  const points = useMemo(() => {
    const arr = new Float32Array(3600);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.rotation.y = t * 0.05;
      group.current.rotation.x = t * 0.02;
      group.current.position.y = Math.sin(t * 0.4) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <Points positions={points} stride={3}>
        <PointMaterial
          transparent
          color="#9ddcff"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          opacity={0.65}
        />
      </Points>
    </group>
  );
}

/* =========================
   HERO
========================= */

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "6rem 1.5rem",
      }}
    >
      {/* ===== 3D BACKGROUND ===== */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Canvas
          frameloop="always"
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <DataField />
        </Canvas>
      </div>

      {/* ===== GRADIENT OVERLAY ===== */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: `
            radial-gradient(900px at 30% 30%, rgba(108,242,255,0.2), transparent 60%),
            radial-gradient(800px at 80% 70%, rgba(140,120,255,0.18), transparent 60%)
          `,
        }}
      />

      {/* ===== FOREGROUND CONTENT ===== */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          style={{
            fontSize: "clamp(2.8rem, 5vw, 4.4rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: "900px",
          }}
        >
          We engineer software
          <br />
          that runs real businesses.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            opacity: 0.85,
            maxWidth: "720px",
          }}
        >
          A’Dash Technology designs and builds production-grade platforms,
          internal systems, and AI-powered tools — built in Jamaica and
          deployed globally.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            opacity: 0.65,
          }}
        >
          Founder-led • Engineering-first • Systems over websites
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/#work"
            style={{
              padding: "0.9rem 1.6rem",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#000000",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View our systems
          </Link>

          <Link
            to="/contact"
            style={{
              padding: "0.9rem 1.6rem",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Start a conversation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
