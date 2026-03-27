import { motion } from "framer-motion";
import "../styles/platforms.css";

const platformGroups = [
  {
    title: "Client Portals",
    state: "Live-ready",
    summary:
      "Secure customer-facing environments for onboarding, requests, account activity, and operational visibility.",
    points: [
      "Role-aware access",
      "Self-service workflows",
      "Status tracking",
    ],
  },
  {
    title: "Operations Core",
    state: "Scalable",
    summary:
      "Internal systems that coordinate fulfillment, approvals, data flow, and multi-team execution with less friction.",
    points: [
      "Workflow orchestration",
      "Admin control surfaces",
      "Structured process data",
    ],
  },
  {
    title: "AI Assist Layers",
    state: "Adaptive",
    summary:
      "Automation and intelligence modules that sit on top of production systems to reduce repetitive work and improve decisions.",
    points: [
      "Smart intake",
      "Process automation",
      "Model-assisted actions",
    ],
  },
];

const platformSignals = [
  "Public web presence connected to business systems",
  "Operational dashboards built around real workflows",
  "Admin, customer, and partner surfaces in one ecosystem",
  "Integrations designed for payments, messaging, and data sync",
];

export default function Platforms() {
  return (
    <section className="platforms">
      <div className="platforms-shell">
        <motion.div
          className="platforms-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="platforms-eyebrow">PLATFORMS</span>
          <h2>
            One software ecosystem.
            <span> Multiple surfaces working together.</span>
          </h2>
          <p>
            A&apos;Dash doesn&apos;t just ship isolated pages or tools. We design connected
            platform ecosystems where public websites, portals, operations
            software, and AI-assisted workflows reinforce each other.
          </p>
        </motion.div>

        <div className="platforms-grid">
          <motion.div
            className="platforms-rail"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="platforms-rail-top">
              <span className="platforms-kicker">Ecosystem View</span>
              <span className="platforms-badge">Enterprise structure</span>
            </div>

            <div className="platforms-stack">
              <div className="platforms-layer">
                <span>Experience Layer</span>
                <strong>Websites, product surfaces, branded client entry points</strong>
              </div>
              <div className="platforms-layer">
                <span>Platform Layer</span>
                <strong>Dashboards, portals, workflows, approvals, data movement</strong>
              </div>
              <div className="platforms-layer">
                <span>Intelligence Layer</span>
                <strong>Automation, AI assistance, integrations, system triggers</strong>
              </div>
            </div>

            <div className="platforms-signals">
              {platformSignals.map((item) => (
                <div className="platforms-signal" key={item}>
                  <span className="platforms-signal-dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="platforms-cards">
            {platformGroups.map((group, index) => (
              <motion.article
                key={group.title}
                className="platform-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div className="platform-card-top">
                  <span className="platform-card-state">{group.state}</span>
                  <h3>{group.title}</h3>
                </div>

                <p>{group.summary}</p>

                <ul>
                  {group.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
