import { Link } from "react-router-dom";
import "../../styles/service-pages.css";

export default function ServicePageTemplate({
  badge,
  title,
  subtitle,
  intro,
  accentClass,
  requestPath,
  highlights,
  workstreams,
  integrityPoints,
  benefits,
}) {
  return (
    <main className="sp-shell">
      <div className="sp-bg" />

      <section className="sp-hero">
        <span className={`sp-badge ${accentClass}`}>{badge}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <div className="sp-hero-actions">
          <Link to={requestPath} className="sp-btn sp-btn-primary">
            Begin Service Request
          </Link>
          <Link to="/contact" className="sp-btn sp-btn-ghost">
            Talk to Our Team
          </Link>
        </div>
      </section>

      <section className="sp-panel">
        <header>
          <h2>What This Service Delivers</h2>
        </header>
        <p className="sp-intro">{intro}</p>

        <div className="sp-highlights">
          {highlights.map((item) => (
            <article key={item.title} className="sp-highlight-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sp-panel">
        <header>
          <h2>How We Work With Quality and Integrity</h2>
        </header>

        <div className="sp-workstreams">
          {workstreams.map((item) => (
            <article key={item.title} className="sp-work-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="sp-integrity">
          {integrityPoints.map((point) => (
            <div key={point} className="sp-integrity-item">
              <span className="sp-dot" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sp-panel">
        <header>
          <h2>Customer Benefits</h2>
        </header>

        <ul className="sp-benefits">
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>

      <section className="sp-cta-panel">
        <h2>Ready to Start?</h2>
        <p>
          Start the intake flow and we will respond with the right strategy,
          scope direction, and timeline for your service.
        </p>
        <Link to={requestPath} className="sp-btn sp-btn-primary">
          Begin Service Request
        </Link>
      </section>
    </main>
  );
}
