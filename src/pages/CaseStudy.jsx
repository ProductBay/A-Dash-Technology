import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { caseStudies } from "../data/caseStudies";
import "../styles/case-study-media.css";

export default function CaseStudy() {
  const { slug } = useParams();
  const [lightbox, setLightbox] = useState(null);

  const index = caseStudies.findIndex((c) => c.slug === slug);
  const data = caseStudies[index];

  const prev = caseStudies[index - 1];
  const next = caseStudies[index + 1];

  /* ================= SEO (React 19 safe) ================= */
  useEffect(() => {
    if (!data) return;

    document.title = `${data.name} | A’Dash Technology`;

    const description =
      data.tagline ||
      "Production-grade software systems by A’Dash Technology";

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = `${data.name} | A’Dash Technology`;

    // Open Graph description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = description;

    // Open Graph image
    if (data.screens?.length) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement("meta");
        ogImg.setAttribute("property", "og:image");
        document.head.appendChild(ogImg);
      }
      ogImg.content = data.screens[0];
    }
  }, [data]);

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
      {/* ================= HERO ================= */}
      <section className="case-hero">
        <div className="case-hero-inner">
          <Link to="/" className="case-back">← Back</Link>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
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

      {/* ================= OVERVIEW ================= */}
      <section className="case-section">
        <h2>Overview</h2>
        <p>{data.overview}</p>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
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
      {data.timeline.map((step, index) => (
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



      {/* ================= STACK ================= */}
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

      {/* ================= SCREENS ================= */}
      {data.screens && (
        <section className="case-section case-screens">
          <h2>System Screens</h2>

          <div className="screen-grid">
            {data.screens.map((img, i) => (
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

      {/* ================= NAVIGATION ================= */}
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

      {/* ================= LIGHTBOX ================= */}
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
