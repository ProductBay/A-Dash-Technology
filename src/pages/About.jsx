import { motion } from "framer-motion";
import founderImage from "../assets/founder.jpg";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/about.css";

export default function About() {
  usePageMeta({
    title: "About",
    description:
      "Learn how A'Dash Technology approaches software engineering, platform strategy, and founder-led product execution from Jamaica to global markets.",
    canonicalPath: "/about",
    image: "/vite.png",
  });

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-inner">
          <motion.span
            className="about-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ABOUT A&apos;DASH TECHNOLOGY
          </motion.span>

          <motion.h1
            className="about-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            Built in Jamaica.
            <br />
            <span>Designed for the world.</span>
          </motion.h1>

          <motion.p
            className="about-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            A&apos;Dash Technology is a modern software engineering company focused
            on building production-grade platforms, portals, and intelligent
            systems that operate in real-world conditions, not demos.
          </motion.p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <motion.div
            className="about-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>What we do</h2>
            <p>
              We engineer full-stack software: public websites that convert,
              internal dashboards that run operations, custom portals that
              coordinate workflows, and AI-assisted tools that accelerate teams.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <h2>How we build</h2>
            <p>
              We design systems around real processes, deploy with modern
              tooling, and ship with maintainability in mind. Clear architecture
              first, performance and polish as the standard, not the upgrade.
            </p>
          </motion.div>

          <motion.div
            className="about-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2>Why A&apos;Dash</h2>
            <p>
              We&apos;re building the kind of software company Jamaica deserves:
              capable of delivering world-class platforms locally, without
              exporting innovation overseas.
            </p>
          </motion.div>
        </div>

        <div className="about-founder">
          <div className="founder-badge">
            <img
              src={founderImage}
              alt="Ashandie Powell - Founder of A'Dash Technology"
            />
            <span>Founder</span>
          </div>

          <div className="founder-body">
            <h3>Ashandie Powell</h3>
            <p className="founder-role">Lead Developer & CEO</p>

            <p className="founder-text">
              A&apos;Dash is founder-led and engineering-first. We don&apos;t chase
              trends, we architect what comes next, then build it cleanly.
            </p>

            <div className="founder-pill">
              First locally to offer modern full-stack platforms and AI-assisted
              system builds at this level.
            </div>
          </div>
        </div>

        <div className="about-statement">
          <p>We don&apos;t sell websites.</p>
          <h4>We engineer systems.</h4>
        </div>
      </section>
    </main>
  );
}
