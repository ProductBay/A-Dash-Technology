import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/hero.css";

const HeroScene3D = lazy(() => import("./HeroScene3D"));

function shouldEnableHero3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 900) return false;
  return true;
}

export default function Hero() {
  const [loadScene, setLoadScene] = useState(false);

  useEffect(() => {
    if (!shouldEnableHero3D()) return;

    const start = () => setLoadScene(true);

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(start, 700);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="hero-shell">
      {loadScene ? (
        <Suspense fallback={null}>
          <HeroScene3D />
        </Suspense>
      ) : null}

      <div className="hero-aurora hero-aurora-left" aria-hidden="true" />
      <div className="hero-aurora hero-aurora-right" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-scanline" aria-hidden="true" />

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-kicker"
        >
          Founder-led • Engineering-first • Systems over websites
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          className="hero-title-modern"
        >
          We engineer software
          <br />
          that runs real businesses.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="hero-copy"
        >
          A&apos;Dash Technology designs and builds production-grade platforms,
          internal systems, and AI-powered tools built in Jamaica and deployed
          globally.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="hero-actions-modern"
        >
          <Link to="/work" className="hero-button hero-button-primary">
            View our systems
          </Link>

          <Link to="/contact" className="hero-button hero-button-secondary">
            Start a conversation
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35 }}
          className="hero-metrics"
        >
          <div className="hero-metric">
            <strong>Platforms</strong>
            <span>Internal systems, portals, and public products</span>
          </div>
          <div className="hero-metric">
            <strong>Deployment-ready</strong>
            <span>Built for real operations, not prototype theater</span>
          </div>
          <div className="hero-metric">
            <strong>Cross-industry</strong>
            <span>Logistics, healthcare, commerce, mobility, and more</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
