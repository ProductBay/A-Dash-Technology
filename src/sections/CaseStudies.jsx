import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/case-studies.css";
import { caseStudies } from "../data/caseStudies";

export default function CaseStudies() {
  return (
    <section className="case-studies">
      <div className="case-studies-container">
        {/* Header */}
        <motion.div
          className="case-studies-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="case-eyebrow">SELECTED WORK</span>
          <h2 className="case-title">
            Platforms that <span>run businesses</span>
          </h2>
          <p className="case-description">
            A snapshot of real systems designed, engineered, and deployed by
            A’Dash Technology — across logistics, marketplaces, healthcare, and
            visualization.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="case-grid">
          {caseStudies.map((project, index) => (
            <motion.div
              key={project.slug}
              className="case-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link to={`/case/${project.slug}`} className="case-link">
                <div className="case-media">
                  {project.cover && (
                    <img
                      src={project.cover}
                      alt={project.name}
                      loading="lazy"
                    />
                  )}
                  <div className="case-overlay" />
                </div>

                <div className="case-content">
                  <span className="case-type">{project.type}</span>
                  <h3>{project.name}</h3>
                  <p>{project.tagline}</p>

                  <div className="case-tags">
                    {project.tags?.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
