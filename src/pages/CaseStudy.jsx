import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { caseStudies } from "../data/caseStudies";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/case-study-media.css";

export default function CaseStudy() {
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState(null);

  const index = caseStudies.findIndex((c) => c.slug === slug);
  const data = caseStudies[index];

  const prev = caseStudies[index - 1];
  const next = caseStudies[index + 1];
  const screens = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.screens) && data.screens.length) return data.screens;
    if (Array.isArray(data.media) && data.media.length) {
      return data.media.map((item) => item.src).filter(Boolean);
    }
    return [];
  }, [data]);

  usePageMeta({
    title: data ? data.name : "Case Study",
    description:
      data?.tagline ||
      "Production-grade software systems, portals, and websites by A'Dash Technology.",
    canonicalPath: data ? `/case/${data.slug}` : "/work",
    image: screens[0] || "/vite.png",
  });

  if (!data) {
    return (
      <div className="case-not-found">
        <h1>Case study not found</h1>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <article className="case-page">
      <section className="case-hero">
        <div className="case-hero-inner">
          <Link to="/" className="case-back">
            ← Back
          </Link>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            {data.name}
          </motion.h1>

          <p className="case-type">{data.type}</p>
          <p className="case-tagline">{data.tagline}</p>

          {data.tags && (
            <div className="case-tags">
              {data.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="case-section">
        <h2>Overview</h2>
        <p>{data.overview}</p>
      </section>

      <section className="case-section">
        <h2>Key Highlights</h2>
        <ul className="case-list">
          {data.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {data.metrics && (
        <section className="case-section">
          <h2>Impact & Outcomes</h2>

          <div className="case-metrics">
            {data.metrics.map((metric) => (
              <div className="case-metric" key={metric.label}>
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.timeline && (
        <section className="case-section">
          <h2>Project Evolution</h2>

          <div className="case-timeline">
            {data.timeline.map((step) => (
              <div className="timeline-item" key={step.phase}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <h4>{step.phase}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.links && (
        <section className="case-section">
          <h2>Live Preview</h2>

          <div className="case-links">
            {data.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="case-link"
              >
                <span>{link.label}</span>
                {link.note && <em>{link.note}</em>}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="case-section">
        <h2>Technology Stack</h2>
        <div className="case-stack">
          {data.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </section>

      {data.founderNote && (
        <section className="case-section">
          <div className="founder-note">
            <span className="founder-eyebrow">{data.founderNote.title}</span>
            <p>{data.founderNote.text}</p>
            <strong>— Ashandie Powell</strong>
          </div>
        </section>
      )}

      {screens.length > 0 && (
        <section className="case-section case-screens">
          <h2>System Screens</h2>

          <div className="screen-grid">
            {screens.map((img, i) => (
              <motion.img
                key={img}
                src={img}
                alt={`${data.name} screen ${i + 1}`}
                whileHover={{ scale: 1.03 }}
                onClick={() => setLightbox(img)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="case-nav">
        {prev && (
          <Link to={`/case/${prev.slug}`} className="case-nav-link">
            ← {prev.name}
          </Link>
        )}

        {next && (
          <Link to={`/case/${next.slug}`} className="case-nav-link next">
            {next.name} →
          </Link>
        )}
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
