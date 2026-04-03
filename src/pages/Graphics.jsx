import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { graphicsProjects } from "../data/graphicsProjects";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/portfolio-page.css";

const brandThemes = {
  adash: {
    primary: "rgba(120, 182, 255, 0.92)",
    secondary: "rgba(218, 231, 247, 0.9)",
    tertiary: "rgba(0, 220, 255, 0.82)",
    glowA: "rgba(102, 144, 255, 0.38)",
    glowB: "rgba(212, 225, 240, 0.22)",
    glowC: "rgba(0, 221, 255, 0.18)",
    particle: "rgba(178, 222, 255, 0.95)",
    shape: "diamond",
  },
  grabquik: {
    primary: "rgba(104, 228, 72, 0.9)",
    secondary: "rgba(73, 166, 255, 0.88)",
    tertiary: "rgba(204, 255, 118, 0.82)",
    glowA: "rgba(74, 202, 120, 0.34)",
    glowB: "rgba(54, 148, 255, 0.26)",
    glowC: "rgba(196, 255, 96, 0.16)",
    particle: "rgba(190, 255, 154, 0.95)",
    shape: "hex",
  },
  slyde: {
    primary: "rgba(255, 146, 50, 0.94)",
    secondary: "rgba(255, 208, 84, 0.9)",
    tertiary: "rgba(255, 99, 43, 0.82)",
    glowA: "rgba(255, 140, 58, 0.36)",
    glowB: "rgba(255, 208, 92, 0.26)",
    glowC: "rgba(255, 89, 34, 0.18)",
    particle: "rgba(255, 220, 136, 0.95)",
    shape: "slash",
  },
  inventra: {
    primary: "rgba(145, 226, 98, 0.9)",
    secondary: "rgba(102, 176, 255, 0.88)",
    tertiary: "rgba(255, 216, 90, 0.78)",
    glowA: "rgba(112, 204, 130, 0.3)",
    glowB: "rgba(88, 158, 255, 0.26)",
    glowC: "rgba(255, 214, 94, 0.14)",
    particle: "rgba(214, 245, 145, 0.95)",
    shape: "hex",
  },
  tileit3d: {
    primary: "rgba(255, 172, 28, 0.9)",
    secondary: "rgba(87, 187, 255, 0.88)",
    tertiary: "rgba(144, 112, 255, 0.72)",
    glowA: "rgba(255, 170, 46, 0.34)",
    glowB: "rgba(79, 176, 255, 0.28)",
    glowC: "rgba(142, 108, 255, 0.14)",
    particle: "rgba(255, 214, 124, 0.95)",
    shape: "diamond",
  },
  eduflo: {
    primary: "rgba(108, 230, 126, 0.88)",
    secondary: "rgba(83, 192, 255, 0.9)",
    tertiary: "rgba(255, 219, 102, 0.76)",
    glowA: "rgba(112, 224, 130, 0.32)",
    glowB: "rgba(72, 168, 255, 0.24)",
    glowC: "rgba(255, 212, 90, 0.14)",
    particle: "rgba(188, 255, 170, 0.95)",
    shape: "hex",
  },
};

function getBrandTheme(project) {
  const source = `${project.slug} ${project.title} ${project.tags.join(" ")}`.toLowerCase();

  if (source.includes("grabquik")) return brandThemes.grabquik;
  if (source.includes("slyde")) return brandThemes.slyde;
  if (source.includes("inventra")) return brandThemes.inventra;
  if (source.includes("tile-it-3d") || source.includes("tileit3d")) return brandThemes.tileit3d;
  if (source.includes("eduflo")) return brandThemes.eduflo;
  return brandThemes.adash;
}

function getBrandKey(project) {
  const source = `${project.slug} ${project.title} ${project.tags.join(" ")}`.toLowerCase();

  if (source.includes("grabquik")) return "grabquik";
  if (source.includes("slyde")) return "slyde";
  if (source.includes("inventra")) return "inventra";
  if (source.includes("tile-it-3d") || source.includes("tileit3d")) return "tileit3d";
  if (source.includes("eduflo")) return "eduflo";
  return "adash";
}

function buildConstellationLayout(brandKey) {
  const layouts = {
    adash: [
      { id: "a1", x: 14, y: 24, size: "10px" },
      { id: "a2", x: 31, y: 16, size: "7px" },
      { id: "a3", x: 52, y: 13, size: "8px" },
      { id: "a4", x: 76, y: 24, size: "11px" },
      { id: "a5", x: 62, y: 72, size: "9px" },
      { id: "a6", x: 26, y: 68, size: "8px" },
    ],
    grabquik: [
      { id: "g1", x: 18, y: 20, size: "8px" },
      { id: "g2", x: 42, y: 16, size: "10px" },
      { id: "g3", x: 66, y: 19, size: "8px" },
      { id: "g4", x: 82, y: 38, size: "9px" },
      { id: "g5", x: 61, y: 78, size: "12px" },
      { id: "g6", x: 24, y: 70, size: "9px" },
    ],
    slyde: [
      { id: "s1", x: 16, y: 18, size: "8px" },
      { id: "s2", x: 48, y: 12, size: "10px" },
      { id: "s3", x: 80, y: 22, size: "8px" },
      { id: "s4", x: 72, y: 66, size: "11px" },
      { id: "s5", x: 44, y: 82, size: "9px" },
      { id: "s6", x: 18, y: 60, size: "8px" },
    ],
  };

  return layouts[brandKey] || layouts.adash;
}

export default function Graphics() {
  const [activeProject, setActiveProject] = useState(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [launchOrigin, setLaunchOrigin] = useState(null);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [feedbackPulse, setFeedbackPulse] = useState(0);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef(null);
  const pulseTimeoutRef = useRef(null);

  usePageMeta({
    title: "Graphics",
    description:
      "Explore A'Dash Graphics work across brand systems, product branding, launch visuals, and digital design assets.",
    canonicalPath: "/graphics",
    image: "/vite.png",
  });

  const particleNodes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        angle: `${(360 / 28) * index}deg`,
        delay: `${index * -0.22}s`,
        duration: `${10 + (index % 6)}s`,
      })),
    []
  );

  const brandKey = activeProject ? getBrandKey(activeProject) : "adash";
  const constellationNodes = useMemo(() => buildConstellationLayout(brandKey), [brandKey]);
  const trailNodes = useMemo(
    () =>
      Array.from({ length: 3 }, (_, index) => ({
        id: index,
        delay: `${index * -2.4}s`,
        duration: `${12 + index * 3}s`,
        width: `${58 + index * 12}%`,
        height: `${58 + index * 10}%`,
        rotation: `${index % 2 === 0 ? 12 : -14}deg`,
      })),
    []
  );

  useEffect(() => {
    if (!activeProject) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveProject(null);
      }
    };

    document.body.style.overflow = "hidden";
    setParallax({ x: 0, y: 0 });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProject]);

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }

      if (audioNodesRef.current) {
        audioNodesRef.current.gain.disconnect();
        audioNodesRef.current.filter.disconnect();
        audioNodesRef.current.oscillator.stop();
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!activeProject) return undefined;

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return undefined;

    if (!audioContextRef.current) {
      const context = new AudioCtor();
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();

      oscillator.type = brandKey === "slyde" ? "sawtooth" : "sine";
      oscillator.frequency.value = brandKey === "grabquik" ? 132 : brandKey === "slyde" ? 96 : 118;
      filter.type = "lowpass";
      filter.frequency.value = brandKey === "adash" ? 540 : 460;
      gain.gain.value = 0;

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start();

      audioContextRef.current = context;
      audioNodesRef.current = { oscillator, filter, gain };
    }

    const context = audioContextRef.current;
    const nodes = audioNodesRef.current;
    const now = context.currentTime;

    nodes.oscillator.frequency.setTargetAtTime(
      brandKey === "grabquik" ? 132 : brandKey === "slyde" ? 96 : 118,
      now,
      0.18
    );
    nodes.filter.frequency.setTargetAtTime(brandKey === "adash" ? 540 : 460, now, 0.2);

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    nodes.gain.gain.cancelScheduledValues(now);
    nodes.gain.gain.setTargetAtTime(ambientEnabled ? 0.015 : 0, now, 0.35);

    return undefined;
  }, [activeProject, ambientEnabled, brandKey]);

  const activeTheme = activeProject ? getBrandTheme(activeProject) : brandThemes.adash;

  const handleParallaxMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    setParallax({
      x: Number((x * 16).toFixed(2)),
      y: Number((y * 12).toFixed(2)),
    });
  };

  const resetParallax = () => setParallax({ x: 0, y: 0 });

  const triggerFeedback = () => {
    setFeedbackPulse((value) => value + 1);

    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
    }

    pulseTimeoutRef.current = window.setTimeout(() => {
      pulseTimeoutRef.current = null;
    }, 460);
  };

  const handleProjectOpen = (project, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pointerX = event.clientX || centerX;
    const pointerY = event.clientY || centerY;

    setLaunchOrigin({
      offsetX: Number((centerX - window.innerWidth / 2).toFixed(2)),
      offsetY: Number((centerY - window.innerHeight / 2).toFixed(2)),
      originX: `${((pointerX - rect.left) / rect.width) * 100}%`,
      originY: `${((pointerY - rect.top) / rect.height) * 100}%`,
      pullX: Number((((pointerX - centerX) / rect.width) * 42).toFixed(2)),
      pullY: Number((((pointerY - centerY) / rect.height) * 36).toFixed(2)),
    });
    setAmbientEnabled(true);
    triggerFeedback();
    setActiveProject(project);
  };

  const handleProjectClose = () => {
    triggerFeedback();
    setActiveProject(null);
  };

  const handleAmbientToggle = () => {
    triggerFeedback();
    setAmbientEnabled((value) => !value);
  };

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <div className="portfolio-shell">
          <span className="portfolio-eyebrow">A'Dash Graphics</span>
          <h1>Graphic design work built for modern brands and products</h1>
          <p>
            A&apos;Dash Graphics supports product identity, launch visuals, brand
            systems, and digital-facing design assets for software-first
            businesses.
          </p>
        </div>
      </section>

      <section className="portfolio-grid-wrap">
        <div className="portfolio-shell">
          <div className="portfolio-grid">
            {graphicsProjects.map((item, index) => (
              <motion.article
                key={item.slug}
                className="portfolio-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  type="button"
                  className="portfolio-card-button"
                  onClick={(event) => handleProjectOpen(item, event)}
                >
                  <div className="portfolio-media portfolio-media-logo">
                    <motion.img
                      layoutId={`graphic-image-${item.slug}`}
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="portfolio-body">
                    <span className="portfolio-type">{item.type}</span>
                    <h2>{item.title}</h2>
                    <p>{item.summary}</p>
                    <div className="portfolio-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <span className="portfolio-view-link">Open immersive view</span>
                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject ? (
          <motion.div
            className="portfolio-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleProjectClose}
          >
            <motion.div
              className="portfolio-lightbox-shell"
              style={{
                "--brand-primary": activeTheme.primary,
                "--brand-secondary": activeTheme.secondary,
                "--brand-tertiary": activeTheme.tertiary,
                "--brand-glow-a": activeTheme.glowA,
                "--brand-glow-b": activeTheme.glowB,
                "--brand-glow-c": activeTheme.glowC,
                "--brand-particle": activeTheme.particle,
                "--brand-tilt-x": `${parallax.y * -1}deg`,
                "--brand-tilt-y": `${parallax.x}deg`,
                "--brand-shift-x": `${parallax.x}px`,
                "--brand-shift-y": `${parallax.y}px`,
                "--launch-origin-x": launchOrigin?.originX || "50%",
                "--launch-origin-y": launchOrigin?.originY || "50%",
              }}
              initial={{
                opacity: 0,
                scale: 0.88,
                x: launchOrigin?.offsetX || 0,
                y: launchOrigin?.offsetY || 28,
                rotateX: launchOrigin?.pullY ? launchOrigin.pullY * -0.2 : 6,
                rotateY: launchOrigin?.pullX ? launchOrigin.pullX * 0.28 : 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                x: (launchOrigin?.offsetX || 0) * 0.28,
                y: (launchOrigin?.offsetY || 0) * 0.28,
              }}
              transition={{ type: "spring", stiffness: 165, damping: 22, mass: 0.9 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="portfolio-lightbox-ambience">
                <span className="portfolio-aurora portfolio-aurora-a" />
                <span className="portfolio-aurora portfolio-aurora-b" />
                <span className="portfolio-aurora portfolio-aurora-c" />
                <span
                  key={feedbackPulse}
                  className="portfolio-lightbox-shockwave"
                  aria-hidden="true"
                />
              </div>

              <button
                type="button"
                className="portfolio-lightbox-close"
                onClick={handleProjectClose}
                aria-label="Close enlarged graphics view"
              >
                Close
              </button>

              <div className="portfolio-lightbox-grid">
                <div
                  className="portfolio-lightbox-stage"
                  onMouseMove={handleParallaxMove}
                  onMouseLeave={resetParallax}
                >
                  <div className="portfolio-lightbox-constellation" aria-hidden="true">
                    {constellationNodes.map((node) => (
                      <span
                        key={node.id}
                        className={`portfolio-constellation-node particle-${activeTheme.shape}`}
                        style={{
                          "--node-x": `${node.x}%`,
                          "--node-y": `${node.y}%`,
                          "--node-size": node.size,
                        }}
                      />
                    ))}
                    {constellationNodes.map((node, index) => {
                      const nextNode = constellationNodes[(index + 1) % constellationNodes.length];

                      return (
                        <span
                          key={`${node.id}-${nextNode.id}`}
                          className="portfolio-constellation-line"
                          style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            width: `${Math.hypot(nextNode.x - node.x, nextNode.y - node.y) * 1.7}%`,
                            transform: `translate(-50%, -50%) rotate(${Math.atan2(
                              nextNode.y - node.y,
                              nextNode.x - node.x
                            )}rad)`,
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="portfolio-lightbox-orbit portfolio-lightbox-orbit-a" />
                  <div className="portfolio-lightbox-orbit portfolio-lightbox-orbit-b" />

                  <div className="portfolio-lightbox-frame">
                    <div className="portfolio-particle-trails" aria-hidden="true">
                      {trailNodes.map((trail) => (
                        <span
                          key={trail.id}
                          className={`portfolio-particle-trail trail-${brandKey}`}
                          style={{
                            "--trail-delay": trail.delay,
                            "--trail-duration": trail.duration,
                            "--trail-width": trail.width,
                            "--trail-height": trail.height,
                            "--trail-rotation": trail.rotation,
                          }}
                        />
                      ))}
                    </div>

                    <div className="portfolio-particle-ring" aria-hidden="true">
                      {particleNodes.map((particle) => (
                        <span
                          key={particle.id}
                          className={`portfolio-particle particle-${activeTheme.shape}`}
                          style={{
                            "--angle": particle.angle,
                            "--delay": particle.delay,
                            "--duration": particle.duration,
                          }}
                        />
                      ))}
                    </div>

                    <div className="portfolio-lightbox-gradient-border" />

                    <motion.img
                      layoutId={`graphic-image-${activeProject.slug}`}
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="portfolio-lightbox-image"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="portfolio-lightbox-panel">
                  <span className="portfolio-lightbox-kicker">{activeProject.type}</span>
                  <h2>{activeProject.title}</h2>
                  <p>{activeProject.summary}</p>

                  <div className="portfolio-lightbox-controls">
                    <button
                      type="button"
                      className={`portfolio-ambient-toggle${ambientEnabled ? " is-active" : ""}`}
                      onClick={handleAmbientToggle}
                      aria-pressed={ambientEnabled}
                    >
                      <span className="portfolio-ambient-toggle-text">
                        Ambient motion + soundscape
                      </span>
                      <span className="portfolio-ambient-toggle-state">
                        {ambientEnabled ? "On" : "Off"}
                      </span>
                      <span className="portfolio-ambient-toggle-bars" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                      </span>
                    </button>
                  </div>

                  <div className="portfolio-lightbox-tags">
                    {activeProject.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="portfolio-lightbox-note">
                    <strong>Presentation mode</strong>
                    <p>
                      Designed to make each piece feel like a premium reveal, with motion atmosphere,
                      rotating spectral gradients, and a controlled viewing stage around the artwork.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
