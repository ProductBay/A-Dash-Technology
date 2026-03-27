import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { caseStudies } from "../data/caseStudies";
import { ownedPlatforms } from "../data/ownedPlatforms";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/work.css";

export default function Work() {
  usePageMeta({
    title: "Work",
    description:
      "Explore selected A'Dash Technology work across logistics, marketplaces, websites, portals, healthcare workflows, and operational software.",
    canonicalPath: "/work",
    image: "/vite.png",
  });

  const filters = useMemo(() => {
    const tagSet = new Set(["All"]);
    caseStudies.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, []);

  const [activeFilter, setActiveFilter] = useState("All");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") return caseStudies;
    return caseStudies.filter((item) => item.tags?.includes(activeFilter));
  }, [activeFilter]);

  const summary = useMemo(() => {
    const categoryCount = new Set(
      caseStudies.flatMap((item) => item.tags || [])
    ).size;

    return {
      totalProjects: caseStudies.length,
      totalCategories: categoryCount,
      primaryFocus: "Platforms, portals, websites, and internal systems",
    };
  }, []);

  const featuredProject = useMemo(() => {
    return (
      ownedPlatforms.find((item) => item.slug === "slyde-logistics") ||
      ownedPlatforms[0]
    );
  }, []);

  return (
    <main className="work-page">
      <section className="work-hero">
        <div className="work-shell">
          <div className="work-signal-bar" aria-hidden="true">
            <span>Live portfolio signal</span>
            <span>Systems, portals, commerce, logistics, operations</span>
            <span>Built by A&apos;Dash Technology</span>
          </div>

          <span className="work-eyebrow">SELECTED WORK</span>

          <div className="work-hero-grid">
            <div className="work-hero-copy">
              <h1>Platforms and digital systems built around real business use</h1>
              <p>
                This page gives a clearer view of the kinds of projects A&apos;Dash
                takes on, from logistics platforms and portals to healthcare
                workflows, 3D software, and commercial web experiences. It is
                designed to help visitors understand not just what we built, but
                where our strengths actually sit.
              </p>

              <div className="work-hero-actions">
                <a href="#work-filter-zone" className="work-hero-cta primary">
                  Explore project categories
                </a>
                <Link to="/request/discovery" className="work-hero-cta">
                  Start a discovery conversation
                </Link>
              </div>

              <div className="work-capability-strip" aria-label="Execution areas">
                {[
                  "Enterprise portals",
                  "Operational software",
                  "Commercial websites",
                  "Workflow systems",
                ].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="work-hero-panel">
              <div className="work-stat">
                <strong>{summary.totalProjects}</strong>
                <span>Projects currently highlighted</span>
              </div>
              <div className="work-stat">
                <strong>{summary.totalCategories}</strong>
                <span>Portfolio categories represented</span>
              </div>
              <div className="work-stat work-stat-wide">
                <strong>{summary.primaryFocus}</strong>
                <span>Core areas of execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-featured">
        <div className="work-shell">
          <div className="work-featured-panel">
            <div className="work-featured-copy">
              <span className="work-context-label">Featured system spotlight</span>
              <h2>{featuredProject.name}</h2>
              <p>{featuredProject.summary}</p>

              <div className="work-featured-pills">
                {(featuredProject.tags || []).slice(0, 4).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="work-featured-metrics">
                <div className="work-featured-metric">
                  <strong>{featuredProject.industry}</strong>
                  <span>Primary domain</span>
                </div>
                <div className="work-featured-metric">
                  <strong>{featuredProject.stage}</strong>
                  <span>Platform status</span>
                </div>
                {(featuredProject.capabilities || []).slice(0, 2).map((item) => (
                  <div key={item} className="work-featured-metric">
                    <strong>{item}</strong>
                    <span>Core capability</span>
                  </div>
                ))}
              </div>

              <Link to="/platform/slyde-logistics" className="work-hero-cta primary">
                View featured platform
              </Link>
            </div>

            <div className="work-featured-visual" aria-hidden="true">
              <div className="work-featured-orbit" />
              <div className="work-featured-screen">
                <div className="work-featured-screen-bar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="work-featured-screen-grid" />
                <div className="work-featured-screen-card">
                  <small>{featuredProject.type}</small>
                  <strong>{featuredProject.name}</strong>
                  <p>Production-minded system design with execution depth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-context">
        <div className="work-shell">
          <div className="work-context-grid">
            <div className="work-context-card">
              <span className="work-context-label">What you&apos;ll find here</span>
              <p>
                A mix of public websites, operational systems, internal tools,
                portals, product concepts, and platform-facing software.
              </p>
            </div>

            <div className="work-context-card">
              <span className="work-context-label">Best for</span>
              <p>
                Teams evaluating whether A&apos;Dash is the right fit for a portal,
                dashboard, platform, workflow system, or modern business website.
              </p>
            </div>

            <div className="work-context-card">
              <span className="work-context-label">How to use it</span>
              <p>
                Filter by category below, then open any case study to review the
                problem, project direction, and technical emphasis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="work-filters" id="work-filter-zone">
        <div className="work-shell">
          <div className="work-filter-head">
            <div>
              <span className="work-filter-label">Browse by category</span>
              <h2>Filter the portfolio</h2>
            </div>
            <p>
              Narrow the grid to the types of projects most relevant to your
              business or product direction.
            </p>
          </div>

          <div className="work-filter-status">
            <span className="work-filter-status-label">Current view</span>
            <strong>{activeFilter}</strong>
            <span>{visibleProjects.length} projects shown</span>
          </div>

          <div className="work-filter-row">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`work-filter ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="work-grid">
            {visibleProjects.map((project, index) => (
              <motion.article
                key={project.slug}
                className="work-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/case/${project.slug}`} className="work-card-link">
                  <div className="work-card-visual" aria-hidden="true">
                    <div className="work-card-orbit" />
                    <div className="work-card-screen">
                      <div className="work-card-screen-bar">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="work-card-screen-grid" />
                      <div className="work-card-screen-card">
                        <small>{project.type}</small>
                        <strong>{project.name}</strong>
                        <p>{project.tags?.slice(0, 3).join(" / ")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="work-card-body">
                    <span className="work-card-type">{project.type}</span>
                    <h2>{project.name}</h2>
                    <p className="work-card-tagline">{project.tagline}</p>
                    <p className="work-card-overview">{project.overview}</p>

                    {project.stack?.length ? (
                      <div className="work-card-stack">
                        {project.stack.slice(0, 4).map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    ) : null}

                    {project.highlights?.length ? (
                      <ul className="work-card-highlights">
                        {project.highlights.slice(0, 3).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="work-card-tags">
                      {project.tags?.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    <div className="work-card-footer">
                      <span>Open case study</span>
                      <span aria-hidden="true">+</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
