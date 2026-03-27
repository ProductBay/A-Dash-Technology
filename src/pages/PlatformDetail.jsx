import { Link, useParams } from "react-router-dom";
import { ownedPlatforms } from "../data/ownedPlatforms";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/platform-detail.css";

export default function PlatformDetail() {
  const { slug } = useParams();
  const platform = ownedPlatforms.find((item) => item.slug === slug);

  usePageMeta({
    title: platform ? `${platform.name}` : "Platform",
    description:
      platform?.summary ||
      "Explore a platform inside the A'Dash Technologies software ecosystem.",
    canonicalPath: platform ? `/platform/${platform.slug}` : "/platform",
    image: platform?.src || "/vite.png",
  });

  if (!platform) {
    return (
      <main className="platform-page">
        <section className="platform-missing">
          <h1>Platform not found</h1>
          <Link to="/">Back to home</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="platform-page">
      <section className="platform-hero">
        <div className="platform-hero-inner">
          <Link to="/" className="platform-back">
            Back to home
          </Link>

          <div className="platform-hero-grid">
            <div className="platform-copy">
              <span className="platform-eyebrow">{platform.type}</span>
              <h1>{platform.name}</h1>
              <p>{platform.summary}</p>

              <div className="platform-meta">
                <div>
                  <span>Industry</span>
                  <strong>{platform.industry}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{platform.stage}</strong>
                </div>
              </div>
            </div>

            <div className="platform-logo-card">
              <img src={platform.src} alt={platform.alt} />
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-section-grid">
          <div className="platform-panel">
            <span className="platform-panel-label">What it represents</span>
            <h2>Product direction</h2>
            <p>
              {platform.name} is part of the A&apos;Dash software ecosystem and
              reflects how we think about systems as durable products, not just
              one-off builds.
            </p>
          </div>

          <div className="platform-panel">
            <span className="platform-panel-label">Core capabilities</span>
            <h2>Platform focus</h2>
            <ul className="platform-capabilities">
              {platform.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-tags">
          {platform.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
