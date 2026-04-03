import { useNavigate } from "react-router-dom";
import "../../styles/request-selector.css";

export default function RequestSelector() {
  const navigate = useNavigate();

  const services = [
    {
      label: "Discovery",
      hint: "Scope • qualification • roadmap",
      requestPath: "/request/discovery",
      detailPath: "/services/discovery",
      glow: "#f59e0b",
      orbitStyle: { "--orbit-x": "30%", "--orbit-y": "24%" },
    },
    {
      label: "Software",
      hint: "Systems • APIs • platforms",
      requestPath: "/request/software",
      detailPath: "/services/software",
      glow: "#00ffff",
      orbitStyle: { "--orbit-x": "72%", "--orbit-y": "24%" },
    },
    {
      label: "Websites",
      hint: "Sites • web apps • portals",
      requestPath: "/request/website",
      detailPath: "/services/websites",
      glow: "#00ff80",
      orbitStyle: { "--orbit-x": "50%", "--orbit-y": "78%" },
    },
  ];

  return (
    <main className="rs-shell">
      <div className="rs-bg" />

      <div className="rs-overlay">
        <div className="rs-badge">A&apos;Dash • Request a Service</div>
        <h1 className="rs-title">Choose what you want to build.</h1>
        <p className="rs-subtitle">
          Start with the direct service cards below, or use the orbit map to
          move quickly into the most relevant intake flow.
        </p>
      </div>

      <section className="rs-panel">
        <div className="rs-panel-head">
          <div>
            <span className="rs-panel-label">Direct request paths</span>
            <h2>Fastest way to start</h2>
          </div>
          <span className="rs-note">Optimized for fast load and mobile clarity.</span>
        </div>

        <div className="rs-service-grid">
          {services.map((item) => (
            <button
              key={item.requestPath}
              type="button"
              className="rs-service-card"
              onClick={() => navigate(item.requestPath)}
            >
              <span
                className="rs-service-glow"
                style={{ "--service-glow": item.glow }}
              />
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rs-preview">
        <div className="rs-preview-head">
          <div>
            <span className="rs-panel-label">Visual service map</span>
            <h2>Start with the lane that matches the build</h2>
          </div>
        </div>

        <div className="rs-orbit-stage">
          <div className="rs-orbit-core">
            <span>A&apos;Dash</span>
            <strong>Build Engine</strong>
          </div>
          <div className="rs-orbit-ring" aria-hidden="true" />

          {services.map((item) => (
            <button
              key={item.detailPath}
              type="button"
              className="rs-orbit-node"
              style={{
                ...item.orbitStyle,
                "--node-glow": item.glow,
              }}
              onClick={() => navigate(item.detailPath)}
            >
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="rs-footerhint">
        <span>Tip:</span> If you are still deciding, start with{" "}
        <button className="rs-link" onClick={() => navigate("/request/discovery")}>
          Discovery
        </button>
        .
      </div>

      <nav className="rs-mobile-actionbar" aria-label="Quick request actions">
        <button
          type="button"
          className="rs-mobile-action"
          onClick={() => navigate("/request/discovery")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
            <path d="M12 8v8" />
            <path d="M8.5 10l3.5-2 3.5 2" />
          </svg>
          <span>Discovery</span>
        </button>

        <button
          type="button"
          className="rs-mobile-action"
          onClick={() => navigate("/request/software")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <rect x="4" y="5" width="16" height="14" rx="3" />
            <path d="M8 9h8" />
            <path d="M8 13h4" />
            <circle cx="16.5" cy="13.5" r="1.5" />
          </svg>
          <span>Software</span>
        </button>

        <button
          type="button"
          className="rs-mobile-action"
          onClick={() => navigate("/request/website")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <path d="M3 9h18" />
            <path d="M8 4v5" />
          </svg>
          <span>Websites</span>
        </button>

        <button
          type="button"
          className="rs-mobile-action"
          onClick={() => navigate("/contact")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9z" />
            <path d="M5 8l7 5 7-5" />
          </svg>
          <span>Contact</span>
        </button>
      </nav>
    </main>
  );
}
