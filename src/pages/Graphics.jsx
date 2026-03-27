import { motion } from "framer-motion";
import { graphicsProjects } from "../data/graphicsProjects";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/portfolio-page.css";

export default function Graphics() {
  usePageMeta({
    title: "Graphics",
    description:
      "Explore A'Dash Graphics work across brand systems, product branding, launch visuals, and digital design assets.",
    canonicalPath: "/graphics",
    image: "/vite.png",
  });

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
                <div className="portfolio-media portfolio-media-logo">
                  <img src={item.image} alt={item.title} loading="lazy" />
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
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
