import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { graphicsProjects } from "../data/graphicsProjects";
import "../styles/showcase-sections.css";

export default function GraphicsShowcase() {
  const featured = graphicsProjects.slice(0, 3);

  return (
    <section className="showcase-section showcase-graphics">
      <div className="showcase-shell">
        <motion.div
          className="showcase-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="showcase-eyebrow">A'Dash Graphics</span>
          <h2>Graphic design systems built for products and brands</h2>
          <p>
            Identity work, logo systems, and digital brand assets designed to
            make A&apos;Dash platforms feel intentional, modern, and market-ready.
          </p>
        </motion.div>

        <div className="showcase-grid">
          {featured.map((item, index) => (
            <motion.article
              key={item.slug}
              className="showcase-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="showcase-media showcase-media-logo">
                <img src={item.image} alt={item.title} loading="lazy" />
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
          <Link to="/graphics" className="showcase-link-primary">
            View Graphics Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
