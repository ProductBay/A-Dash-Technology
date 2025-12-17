import { motion } from "framer-motion";
import "../styles/trust.css";

export default function Trust() {
  const items = [
    "Logistics & Shipping Platforms",
    "Automotive Marketplaces",
    "3D Visualization Software",
    "Healthcare Workflow Systems",
    "Delivery & Operations Platforms",
    "AI-Assisted Business Tools",
  ];

  return (
    <section className="trust">
      <div className="trust-container">
        {/* Eyebrow */}
        <motion.span
          className="trust-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          PRODUCTION-GRADE SYSTEMS
        </motion.span>

        {/* Title */}
        <motion.h2
          className="trust-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted to build <span>production systems</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="trust-description"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          A’Dash Technology engineers software used across logistics,
          marketplaces, healthcare workflows, visualization tools, and
          operational platforms — built for real-world scale and reliability.
        </motion.p>

        {/* Grid */}
        <div className="trust-grid">
          {items.map((item) => (
            <motion.div
              key={item}
              className="trust-card"
              whileHover={{ y: -6 }}
            >
              <span className="trust-dot" />
              <span>{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Origin */}
        <div className="trust-origin">
          <strong>Built in Jamaica.</strong>
          <span>Designed for the world.</span>
        </div>
      </div>
    </section>
  );
}
