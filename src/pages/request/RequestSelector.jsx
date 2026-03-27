import { useNavigate } from "react-router-dom";
import "../../styles/request-selector.css";

export default function RequestSelector() {
  const navigate = useNavigate();

  const services = [
    {
      label: "Discovery",
      hint: "Scope • qualification • roadmap",
      path: "/request/discovery",
      glow: "#f59e0b",
      orbitStyle: { "--orbit-x": "30%", "--orbit-y": "24%" },
    },
    {
      label: "Software",
      hint: "Systems • APIs • platforms",
      path: "/request/software",
      glow: "#00ffff",
      orbitStyle: { "--orbit-x": "72%", "--orbit-y": "24%" },
    },
    {
      label: "Websites",
      hint: "Sites • web apps • portals",
      path: "/request/website",
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
              key={item.path}
              type="button"
              className="rs-service-card"
              onClick={() => navigate(item.path)}
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
              key={item.path}
              type="button"
              className="rs-orbit-node"
              style={{
                ...item.orbitStyle,
                "--node-glow": item.glow,
              }}
              onClick={() => navigate(item.path)}
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
    </main>
  );
}
