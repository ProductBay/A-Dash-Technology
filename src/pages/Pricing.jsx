import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/pricing.css";

const FX_RATE = 159;

const pricingTiers = [
  {
    title: "Foundational Web",
    badge: "Best for launches",
    price: 150000,
    range: [150000, 300000],
    summary:
      "For brochure sites, landing pages, company profiles, and premium small-business web presence.",
    features: [
      "Strategy-led structure and responsive design",
      "Conversion-focused pages with clear calls to action",
      "Performance, SEO foundations, and secure deployment",
    ],
    cta: "/request",
    ctaLabel: "Request a Website Build",
  },
  {
    title: "Dynamic Business Websites",
    badge: "Growth-ready",
    price: 320000,
    range: [320000, 650000],
    summary:
      "For brands that need custom interactions, CMS workflows, booking logic, gated content, or richer user journeys.",
    features: [
      "Custom UI patterns and dynamic content flows",
      "CMS, backend logic, integrations, or dashboards",
      "Designed for marketing, operations, and future expansion",
    ],
    cta: "/request",
    ctaLabel: "Scope Dynamic Web",
  },
  {
    title: "Platforms & Portals",
    badge: "Operational software",
    price: 1200000,
    range: [1200000, 3500000],
    summary:
      "For logistics systems, client portals, internal tools, marketplaces, and role-based business platforms.",
    features: [
      "Architecture, auth, user roles, and business workflows",
      "Scalable backend foundations and data modelling",
      "Built for maintainability, rollout phases, and system growth",
    ],
    cta: "/request/software",
    ctaLabel: "Request Software Build",
  },
  {
    title: "AI & Automation Systems",
    badge: "Efficiency layer",
    price: 900000,
    range: [900000, 2500000],
    summary:
      "For workflow automation, AI copilots, smart forms, data pipelines, internal assistants, and connected operations.",
    features: [
      "API orchestration, automation logic, and business rules",
      "Human-in-the-loop workflows and guardrails",
      "Designed around measurable time savings and process gains",
    ],
    cta: "/request",
    ctaLabel: "Plan an AI System",
  },
  {
    title: "Mobile & Multi-Channel Products",
    badge: "Custom engagement",
    price: null,
    range: null,
    summary:
      "For mobile apps, multi-role ecosystems, and products that span web, mobile, backend, and operations together.",
    features: [
      "iOS and Android delivery strategy",
      "Backend, integrations, notifications, and release planning",
      "Quoted after feature, platform, and rollout definition",
    ],
    cta: "/request/discovery",
    ctaLabel: "Start with Discovery",
  },
];

const deliveryPrinciples = [
  "Local pricing is set for Jamaica-based delivery while still supporting international execution and billing.",
  "Projects are quoted in phases when that reduces risk, shortens time to launch, or makes investment more practical.",
  "Every serious build includes scoping, architecture decisions, QA, deployment, and handoff planning.",
];

const sampleRanges = [
  {
    label: "Business Website",
    range: [180000, 350000],
    note: "Strong fit for service businesses, professional brands, and market-facing company sites.",
  },
  {
    label: "Dynamic Website or Member Portal",
    range: [350000, 850000],
    note: "Appropriate when content, workflows, gated areas, or integrations are part of the experience.",
  },
  {
    label: "Marketplace or Portal MVP",
    range: [1200000, 2500000],
    note: "Useful for first production releases with real workflows, admin logic, and user roles.",
  },
  {
    label: "Custom Operational Software",
    range: [1500000, 4000000],
    note: "For internal tools, logistics systems, operational platforms, and workflow-heavy products.",
  },
  {
    label: "AI / Automation System",
    range: [900000, 2500000],
    note: "Best for automation with integrations, review steps, analytics, and business process change.",
  },
];

const retainers = [
  {
    title: "Platform Care",
    price: 85000,
    note: "For active custom websites and light operational systems.",
    includes: "Monitoring, fixes, dependency updates, backups, and monthly maintenance cadence.",
  },
  {
    title: "Growth & Iteration",
    price: 180000,
    note: "For platforms that need active monthly improvements and product support.",
    includes: "Feature enhancements, UX refinement, analytics review, and structured product iteration.",
  },
  {
    title: "Enterprise Support",
    price: null,
    note: "For mission-critical systems with priority response and heavier engineering coverage.",
    includes: "Dedicated capacity, incident support expectations, roadmap collaboration, and custom SLAs.",
  },
];

const faqs = [
  {
    question: "Are these fixed prices?",
    answer:
      "No. These are planning ranges and starting points. Final pricing depends on scope depth, integrations, speed, compliance needs, and rollout complexity.",
  },
  {
    question: "Do you work in JMD or USD?",
    answer:
      "Jamaica-based projects are typically contracted in JMD. USD figures are shown only as planning references for regional and international clients.",
  },
  {
    question: "Can smaller budgets still work?",
    answer:
      "Yes, if the scope is phased properly. We would rather shape a credible first release than overpromise a full product at an unrealistic budget.",
  },
  {
    question: "What is not included by default?",
    answer:
      "Third-party subscriptions, paid APIs, ad spend, marketplace fees, app store fees, and heavy content production are usually scoped separately unless stated otherwise.",
  },
];

function formatMoney(value, currency) {
  if (value == null) return "Custom Quote";

  if (currency === "JMD") {
    return `J$${value.toLocaleString()}`;
  }

  return `$${Math.round(value / FX_RATE).toLocaleString()}`;
}

function formatRange(range, currency) {
  if (!range) return "Custom scoped engagement";
  return `${formatMoney(range[0], currency)} - ${formatMoney(range[1], currency)}`;
}

export default function Pricing() {
  usePageMeta({
    title: "Pricing",
    description:
      "Review A'Dash Technology pricing for business websites, custom portals, operational software, mobile products, and AI automation systems.",
    canonicalPath: "/pricing",
    image: "/logos/adash.png",
  });

  const [currency, setCurrency] = useState("JMD");

  return (
    <section className="pricing-page">
      <div className="pricing-orb pricing-orb-left" />
      <div className="pricing-orb pricing-orb-right" />

      <div className="pricing-shell">
        <header className="pricing-hero">
          <div className="pricing-hero-copy">
            <span className="pricing-eyebrow">Jamaica-aware pricing for serious digital builds</span>
            <h1>Enterprise-grade pricing clarity for websites, platforms, and automation.</h1>
            <p>
              We price for production-quality delivery, clean architecture, and long-term business use.
              These ranges are designed to be credible in Jamaica while still reflecting the level of
              engineering, scoping, and delivery discipline serious builds require.
            </p>

            <div className="pricing-hero-actions">
              <Link to="/request/discovery" className="pricing-button pricing-button-primary">
                Book a Discovery Call
              </Link>
              <Link to="/request" className="pricing-button pricing-button-secondary">
                Request a Formal Scope
              </Link>
            </div>
          </div>

          <aside className="pricing-hero-panel">
            <div className="currency-toggle" aria-label="Pricing currency toggle">
              <button
                type="button"
                className={currency === "JMD" ? "active" : ""}
                onClick={() => setCurrency("JMD")}
              >
                JMD
              </button>
              <button
                type="button"
                className={currency === "USD" ? "active" : ""}
                onClick={() => setCurrency("USD")}
              >
                USD
              </button>
            </div>

            <p className="pricing-fx-note">
              USD values are planning references using a J$159/USD internal planning rate. Final billing is
              agreed by contract.
            </p>

            <div className="pricing-stat-grid">
              <div className="pricing-stat-card">
                <strong>Jamaica-based</strong>
                <span>Local market reality, global execution standards.</span>
              </div>
              <div className="pricing-stat-card">
                <strong>Milestone-led</strong>
                <span>Quoted in phases when it improves speed, control, or affordability.</span>
              </div>
              <div className="pricing-stat-card">
                <strong>Production-focused</strong>
                <span>We scope for launch readiness, not just visual mockups.</span>
              </div>
            </div>
          </aside>
        </header>

        <section className="pricing-section-block">
          <div className="pricing-section-heading">
            <span>Starting points</span>
            <h2>Engagements structured around business maturity and system complexity</h2>
            <p>
              The right price depends on what the product has to do after launch, not just how many screens it has.
            </p>
          </div>

          <div className="pricing-tier-grid">
            {pricingTiers.map((tier) => (
              <article className="pricing-tier-card" key={tier.title}>
                <div className="pricing-tier-top">
                  <span className="pricing-tier-badge">{tier.badge}</span>
                  <h3>{tier.title}</h3>
                  <p className="pricing-tier-price">
                    {tier.price ? `From ${formatMoney(tier.price, currency)}` : "Custom Quote"}
                  </p>
                  <p className="pricing-tier-range">{formatRange(tier.range, currency)}</p>
                </div>

                <p className="pricing-tier-summary">{tier.summary}</p>

                <ul className="pricing-tier-list">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <Link to={tier.cta} className="pricing-card-link">
                  {tier.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-section-block pricing-principles-block">
          <div className="pricing-section-heading">
            <span>How pricing is shaped</span>
            <h2>What makes our pricing logic different</h2>
          </div>

          <div className="pricing-principles-grid">
            {deliveryPrinciples.map((item) => (
              <div className="pricing-principle-card" key={item}>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-section-block pricing-range-block">
          <div className="pricing-section-heading">
            <span>Typical project bands</span>
            <h2>Range examples for planning conversations</h2>
            <p>
              These examples help decision-makers estimate investment before a detailed scope session.
            </p>
          </div>

          <div className="pricing-range-table">
            {sampleRanges.map((item) => (
              <div className="pricing-range-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.note}</p>
                </div>
                <span>{formatRange(item.range, currency)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-section-block pricing-retainers-block">
          <div className="pricing-section-heading">
            <span>Post-launch coverage</span>
            <h2>Support retainers for active platforms and business-critical systems</h2>
            <p>
              These are not commodity hosting plans. They are support structures for custom builds that need care,
              iteration, and accountability after launch.
            </p>
          </div>

          <div className="pricing-retainer-grid">
            {retainers.map((retainer) => (
              <article className="pricing-retainer-card" key={retainer.title}>
                <strong>{retainer.title}</strong>
                <p className="pricing-retainer-price">
                  {retainer.price ? `From ${formatMoney(retainer.price, currency)} / month` : "Custom"}
                </p>
                <p className="pricing-retainer-note">{retainer.note}</p>
                <p className="pricing-retainer-copy">{retainer.includes}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-section-block pricing-faq-block">
          <div className="pricing-section-heading">
            <span>Clarifications</span>
            <h2>Common pricing questions before scoping starts</h2>
          </div>

          <div className="pricing-faq-grid">
            {faqs.map((faq) => (
              <article className="pricing-faq-card" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-cta-panel">
          <div>
            <span className="pricing-eyebrow">Next action</span>
            <h2>Need a proposal, not just a rough number?</h2>
            <p>
              The fastest way to get to a serious estimate is to define scope, rollout priorities, integrations,
              and ownership expectations together.
            </p>
          </div>

          <div className="pricing-cta-actions">
            <Link to="/request/discovery" className="pricing-button pricing-button-primary">
              Start Discovery
            </Link>
            <Link to="/contact" className="pricing-button pricing-button-secondary">
              Talk to A&apos;Dash
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
