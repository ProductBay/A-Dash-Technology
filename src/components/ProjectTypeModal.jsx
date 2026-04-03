import { useEffect } from "react";

const DEFINITIONS = {
  // Website Project Types
  "Business Website": {
    title: "Business Website",
    description:
      "A professional site showcasing your company, services, and expertise. Ideal for establishing credibility and providing information to potential clients.",
    examples: ["Corporate sites", "Service providers", "Professional portfolios"],
  },
  "E-commerce": {
    title: "E-commerce Platform",
    description:
      "An online store where customers can browse, purchase, and pay for products. Includes shopping carts, inventory management, and secure payment processing.",
    examples: ["Online stores", "Product catalogs", "Digital marketplaces"],
  },
  "Web Application": {
    title: "Web Application",
    description:
      "A sophisticated interactive platform with advanced functionality. Users log in, interact with complex features, and data persists over time.",
    examples: ["SaaS platforms", "Project management tools", "Community platforms"],
  },
  "Landing Page": {
    title: "Landing Page",
    description:
      "A focused, single-page designed to convert visitors into leads or customers. Typically supports a specific campaign or offer.",
    examples: ["Campaign pages", "Lead capture pages", "Product launches"],
  },
  Portfolio: {
    title: "Portfolio",
    description:
      "A showcase site displaying your creative work, projects, and experience. Perfect for freelancers, designers, and creative professionals.",
    examples: ["Designer portfolios", "Artist galleries", "Freelancer profiles"],
  },
  "Custom Platform": {
    title: "Custom Platform",
    description:
      "A bespoke solution tailored to your unique business needs. Built from scratch to solve specific problems not addressed by standard solutions.",
    examples: ["Custom tools", "Proprietary systems", "Specialized platforms"],
  },

  // Software Types
  "Mobile App": {
    title: "Mobile App",
    description:
      "A native or cross-platform application for iOS and/or Android devices. Provides offline functionality and hardware integration.",
    examples: ["iOS apps", "Android apps", "Cross-platform apps"],
  },
  "Internal System": {
    title: "Internal System",
    description:
      "Software built for your organization's internal use. Streamlines workflows, improves efficiency, and manages company data.",
    examples: ["HR systems", "Inventory management", "Employee dashboards"],
  },
  "Marketplace / Platform": {
    title: "Marketplace / Platform",
    description:
      "A multi-party ecosystem where users (sellers, buyers, or service providers) interact. Includes reputation systems, payments, and ratings.",
    examples: ["Service marketplaces", "Peer-to-peer platforms", "Vendor ecosystems"],
  },
  "API / Backend Service": {
    title: "API / Backend Service",
    description:
      "Server-side infrastructure that other applications connect to. Provides data, processing power, or functionality to external clients.",
    examples: ["REST APIs", "Microservices", "Data services"],
  },
  "Automation System": {
    title: "Automation System",
    description:
      "Software that automates repetitive tasks, workflows, or business processes. Reduces manual work and improves consistency.",
    examples: ["Workflow automation", "Task schedulers", "Integration systems"],
  },
  "Custom CRM / ERP": {
    title: "Custom CRM / ERP",
    description:
      "Enterprise software tailored to manage customer relationships (CRM) or company resources (ERP). Centralizes all business operations.",
    examples: ["Customer management", "Resource planning", "Business operations"],
  },
};

export default function ProjectTypeModal({ isOpen, onClose, projectType }) {
  const definition = DEFINITIONS[projectType];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !definition) return null;

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="project-modal-header">
          <h2>{definition.title}</h2>
          <button className="project-modal-close" onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="project-modal-body">
          <p className="project-modal-description">{definition.description}</p>

          <div className="project-modal-examples">
            <h3>Examples:</h3>
            <ul>
              {definition.examples.map((example) => (
                <li key={example}>
                  <span className="example-dot">•</span>
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="project-modal-footer">
          <button className="project-modal-button" onClick={onClose} type="button">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
