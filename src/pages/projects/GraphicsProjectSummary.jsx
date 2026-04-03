import { Link, useParams } from "react-router-dom";
import { graphicsProjects } from "../../data/graphicsProjects";
import { usePageMeta } from "../../lib/usePageMeta";
import "../../styles/project-summary.css";

export default function GraphicsProjectSummary() {
  const { slug } = useParams();
  const project = graphicsProjects.find((item) => item.slug === slug);

  usePageMeta({
    title: project ? `${project.title} | Graphics Project` : "Graphics Project",
    description:
      project?.summary || "Graphics project summary for A'Dash portfolio.",
    canonicalPath: project ? `/projects/graphics/${project.slug}` : "/projects",
    image: project?.image || "/vite.png",
  });

  if (!project) {
    return (
      <main className="project-summary-page">
        <section className="project-summary-missing">
          <h1>Graphics project not found</h1>
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

        <span className="project-summary-kind">Graphics Project</span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>

        {project.image ? (
          <div className="project-summary-logo">
            <img src={project.image} alt={project.title} />
          </div>
        ) : null}

        <div className="project-summary-meta">
          <div>
            <span>Type</span>
            <strong>{project.type}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>Portfolio Summary</strong>
          </div>
        </div>

        <div className="project-summary-tags">
          {(project.tags || []).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="project-summary-actions">
          <Link to="/contact" className="project-summary-cta primary">
            Request Similar Work
          </Link>
          <Link to="/projects" className="project-summary-cta">
            View More Projects
          </Link>
        </div>
      </section>
    </main>
  );
}
