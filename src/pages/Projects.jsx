import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { caseStudies } from "../data/caseStudies";
import { ownedPlatforms } from "../data/ownedPlatforms";
import { websiteProjects } from "../data/websiteProjects";
import { graphicsProjects } from "../data/graphicsProjects";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/projects.css";

function ProjectCard({ item }) {
  return (
    <article className="projects-card">
      <span className="projects-card-kind">{item.kind}</span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>

      <div className="projects-tags">
        {(item.tags || []).slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <Link to={item.to} className="projects-link">
        View Summary
      </Link>
    </article>
  );
}

export default function Projects() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  usePageMeta({
    title: "Projects",
    description:
      "Explore all A'Dash projects across platforms, software systems, websites, and graphics work, with dedicated summary pages.",
    canonicalPath: "/projects",
    image: "/vite.png",
  });

  const projectGroups = useMemo(() => [
    {
      title: "Case Studies",
      subtitle: "Production delivery projects with full implementation summaries",
      items: caseStudies.map((item) => ({
        kind: "Case Study",
        title: item.name,
        summary: item.overview || item.tagline || "Project summary available.",
        tags: item.tags,
        to: `/case/${item.slug}`,
      })),
    },
    {
      title: "Owned Platforms",
      subtitle: "Products and platform initiatives inside the A'Dash ecosystem",
      items: ownedPlatforms.map((item) => ({
        kind: "Platform",
        title: item.name,
        summary: item.summary,
        tags: item.tags,
        to: `/platform/${item.slug}`,
      })),
    },
    {
      title: "Website Projects",
      subtitle: "Website-focused builds and presentation experiences",
      items: websiteProjects.map((item) => ({
        kind: "Website",
        title: item.title,
        summary: item.summary,
        tags: item.tags,
        to: `/projects/website/${item.slug}`,
      })),
    },
    {
      title: "Graphics Projects",
      subtitle: "Brand and visual execution projects",
      items: graphicsProjects.map((item) => ({
        kind: "Graphics",
        title: item.title,
        summary: item.summary,
        tags: item.tags,
        to: `/projects/graphics/${item.slug}`,
      })),
    },
  ], []);

  const filterTags = useMemo(() => {
    const tagSet = new Set(["All"]);
    projectGroups.forEach((group) => {
      group.items.forEach((item) => {
        (item.tags || []).forEach((tag) => tagSet.add(tag));
      });
    });
    return Array.from(tagSet);
  }, [projectGroups]);

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projectGroups
      .map((group) => {
        const items = group.items.filter((item) => {
          const text = `${item.title} ${item.summary} ${(item.tags || []).join(" ")}`.toLowerCase();
          const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
          const matchesTag =
            activeTag === "All" || (item.tags || []).includes(activeTag);
          return matchesQuery && matchesTag;
        });

        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [projectGroups, query, activeTag]);

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div className="projects-shell">
          <span className="projects-eyebrow">A'Dash Portfolio</span>
          <h1>Projects</h1>
          <p>
            A dedicated index of all highlighted projects. Every entry below links
            to a summary page, including newly added summaries for projects that
            previously had no standalone page.
          </p>

          <div className="projects-controls">
            <input
              type="text"
              className="projects-search"
              placeholder="Search projects, sectors, or keywords"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <div className="projects-filter-tags">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`projects-filter-tag ${activeTag === tag ? "active" : ""}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {filteredGroups.length ? filteredGroups.map((group) => (
        <section key={group.title} className="projects-section">
          <div className="projects-shell">
            <header className="projects-head">
              <h2>{group.title}</h2>
              <p>{group.subtitle}</p>
            </header>

            <div className="projects-grid">
              {group.items.map((item) => (
                <ProjectCard key={`${group.title}-${item.title}`} item={item} />
              ))}
            </div>
          </div>
        </section>
      )) : (
        <section className="projects-section">
          <div className="projects-shell">
            <div className="projects-empty">
              <h2>No matching projects found</h2>
              <p>Try a different keyword or switch the active tag filter.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
