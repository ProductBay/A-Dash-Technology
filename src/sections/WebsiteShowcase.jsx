import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/showcase-sections.css";

export default function WebsiteShowcase() {
  return (
    <section className="showcase-section showcase-websites">
      <div className="showcase-shell">
        <motion.div
          className="showcase-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="showcase-eyebrow">Website Showcase</span>
          <h2>Website portfolio is being curated for public release</h2>
          <p>
            A&apos;Dash website work is real, but the public showcase is still being
            tightened before release. If you want to review relevant examples,
            start a conversation and we&apos;ll route you to the right material.
          </p>
        </motion.div>

        <div className="showcase-grid">
          {[
            {
              title: "Commercial websites",
              type: "Public-facing systems",
              summary:
                "Structured websites built to support sales, positioning, and product understanding.",
            },
            {
              title: "Portal entry surfaces",
              type: "Operational frontend",
              summary:
                "Website layers that connect customers and teams into broader platform workflows.",
            },
            {
              title: "Private review flow",
              type: "Curated access",
              summary:
                "Relevant website examples can be shared directly during discovery based on your industry and use case.",
            },
          ].map((item, index) => (
            <motion.article
              key={item.title}
              className="showcase-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="showcase-media showcase-media-placeholder">
                <div className="showcase-placeholder-shell">
                  <span className="showcase-placeholder-kicker">A'Dash Web</span>
                  <strong>PRIVATE SHOWCASE</strong>
                  <span className="showcase-placeholder-line" />
                </div>
              </div>
              <div className="showcase-body">
                <span className="showcase-type">{item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="showcase-actions">
          <Link to="/contact" className="showcase-link-primary">
            Request Website Examples
          </Link>
        </div>
      </div>
    </section>
  );
}
