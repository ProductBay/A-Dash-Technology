import { useState } from "react";
import "../styles/pricing.css";

/* =========================
   PRICING DATA (NUMBERS ONLY)
========================= */

const pricingTiers = [
  {
    title: "Foundational Web",
    price: 75000,
    features: [
      "Static & landing pages",
      "Responsive design",
      "Fast, secure delivery",
    ],
  },
  {
    title: "Dynamic Web",
    price: 400000,
    features: [
      "Custom dynamic UI",
      "CMS / Backend",
      "Interactive UX",
    ],
  },
  {
    title: "Web Apps & Portals",
    price: 1000000,
    features: [
      "Custom dashboards",
      "User roles & authentication",
      "Scalable foundations",
    ],
  },
  {
    title: "Mobile Apps",
    price: null,
    features: [
      "iOS & Android apps",
      "Cloud backend integration",
      "Performance-tuned builds",
    ],
  },
  {
    title: "AI & Automation",
    price: null,
    features: [
      "Workflow automation",
      "Smart forms & bots",
      "API & system integrations",
    ],
  },
];

export default function Pricing() {
  /* =========================
     CURRENCY TOGGLE STATE
  ========================= */

  const [currency, setCurrency] = useState("JMD");

  const convert = (jmd) =>
    currency === "JMD"
      ? `J$${jmd.toLocaleString()}`
      : `$${Math.round(jmd / 155).toLocaleString()}`;

  return (
    <section className="pricing-section">
      {/* Header */}
      <div className="pricing-header">
        <h2>Transparent Starting Rates</h2>
        <p>
          These are starting points to help with planning. Every project is
          custom scoped based on complexity, integrations, and long-term goals.
        </p>
      </div>

      {/* Currency Toggle */}
      <div className="currency-toggle">
        <button
          className={currency === "JMD" ? "active" : ""}
          onClick={() => setCurrency("JMD")}
        >
          JMD
        </button>
        <button
          className={currency === "USD" ? "active" : ""}
          onClick={() => setCurrency("USD")}
        >
          USD
        </button>
      </div>
<p className="currency-disclaimer">
  USD pricing shown for international reference only. Local billing is done in
  JMD at agreed exchange rates.
</p>

      {/* Pricing Grid */}
      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <div className="pricing-card" key={tier.title}>
            <h3>{tier.title}</h3>

            <p className="pricing-price">
  {tier.price
    ? <>From {convert(tier.price)}</>
    : "Custom Quote"}
</p>


            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

   <div className="pricing-why">
  <h3>Why our pricing works</h3>
  <p>
    Our rates reflect engineering-led builds, not template work. We price for
    clarity, scalability, and long-term value—so clients don’t pay twice to fix
    shortcuts later.
  </p>

  <ul>
    <li>Architecture-first planning before code is written</li>
    <li>Clean, maintainable systems built to scale</li>
    <li>Transparent scope and milestone-based delivery</li>
  </ul>
</div>


<div className="pricing-examples">
  <h3>Example Project Ranges</h3>

  <div className="example-item">
    <strong>Business Website</strong>
    <span>J$180,000 – J$350,000</span>
  </div>

  <div className="example-item">
    <strong>Marketplace or Portal MVP</strong>
    <span>J$1,000,000 – J$2,500,000</span>
  </div>

  <div className="example-item">
    <strong>Custom Operational Software</strong>
    <span>J$1,500,000 – J$4,000,000+</span>
  </div>

  <div className="example-item">
    <strong>AI / Automation System</strong>
    <span>J$900,000 – J$2,500,000</span>
  </div>
</div>
<div className="pricing-retainers">
  <h3>Ongoing Support & Retainers</h3>
  <p>
    For active platforms and long-term systems, we offer monthly retainers to
    keep everything secure, optimized, and evolving.
  </p>

  <div className="retainer-grid">
    <div className="retainer-card">
      <strong>Maintenance</strong>
      <span>From J$80,000 / month</span>
      <p>Bug fixes, updates, monitoring</p>
    </div>

    <div className="retainer-card">
      <strong>Growth & Iteration</strong>
      <span>From J$150,000 / month</span>
      <p>Feature enhancements & UX improvements</p>
    </div>

    <div className="retainer-card">
      <strong>Enterprise Support</strong>
      <span>Custom</span>
      <p>Dedicated engineering & priority response</p>
    </div>
  </div>
</div>

{/* FAQs */}
      <div className="pricing-faq">
        <h3>Pricing FAQs</h3>

        <div className="faq-item">
          <h4>Are these fixed prices?</h4>
          <p>
            No. These are starting ranges. Final pricing depends on scope,
            integrations, and system complexity.
          </p>
        </div>

        <div className="faq-item">
          <h4>Do you offer payment plans?</h4>
          <p>
            Yes. Larger projects are typically split into milestone-based
            payments.
          </p>
        </div>

        <div className="faq-item">
          <h4>Can you work with international clients?</h4>
          <p>
            Absolutely. We build globally while operating from Jamaica.
          </p>
        </div>
      </div>
      
      {/* CTA */}
      <div className="pricing-cta">
        <h3>Not sure where your project fits?</h3>
        <p>
          Every serious build starts with a scope conversation. We’ll help you
          define the right approach before pricing anything.
        </p>

       <a
  href="/contact"
  className="pricing-cta-button"
  onClick={() => {
    window.dispatchEvent(new Event("pricing_cta_click"));
  }}
>
  Book a Scope Call
</a>

      </div>

      {/* Footnote */}
      <div className="pricing-footnote">
        <p>
          Looking for a detailed estimate or enterprise-level system?
          <br />
          <strong>Let’s scope it properly.</strong>
        </p>
      </div>
    </section>
  );
}
