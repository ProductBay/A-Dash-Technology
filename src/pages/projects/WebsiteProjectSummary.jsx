import { Link, useParams } from "react-router-dom";
import { websiteProjects } from "../../data/websiteProjects";
import { usePageMeta } from "../../lib/usePageMeta";
import "../../styles/project-summary.css";

export default function WebsiteProjectSummary() {
  const { slug } = useParams();
  const project = websiteProjects.find((item) => item.slug === slug);

  usePageMeta({
    title: project ? `${project.title} | Website Project` : "Website Project",
    description:
      project?.summary || "Website project summary for A'Dash portfolio.",
    canonicalPath: project ? `/projects/website/${project.slug}` : "/projects",
    image: "/vite.png",
  });

  if (!project) {
    return (
      <main className="project-summary-page">
        <section className="project-summary-missing">
          <h1>Website project not found</h1>
          <Link to="/projects">Back to Projects</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="project-summary-page">
      <section className="project-summary-shell">
        <Link className="project-summary-back" to="/projects">
          Back to Projects
        </Link>

        <span className="project-summary-kind">Website Project</span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>

        <div className="project-summary-meta">
          <div>
            <span>Type</span>
            <strong>{project.type}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{project.comingSoon ? "Coming Soon" : "Published"}</strong>
          </div>
        </div>

        <div className="project-summary-tags">
          {(project.tags || []).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="project-summary-actions">
          <Link to="/request/website" className="project-summary-cta primary">
            Start Website Request
          </Link>
          <Link to="/contact" className="project-summary-cta">
            Talk To Our Team
          </Link>
        </div>
      </section>
    </main>
  );
}
