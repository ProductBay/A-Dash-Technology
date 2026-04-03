import FormGuideLabel from "../FormGuideLabel";

const integrations = [
  "Stripe / Payments",
  "Twilio / SMS",
  "WhatsApp",
  "Google Maps",
  "QuickBooks",
  "Shopify",
  "Mailchimp",
  "HubSpot",
  "Custom API",
];

const securityNeeds = [
  "2FA / MFA",
  "Encryption at rest",
  "Audit logs",
  "Admin activity tracking",
  "Compliance (GDPR/PCI)",
];

export default function Step4TechData({ data, update }) {
  const toggle = (key, value) => {
    const arr = data[key] || [];
    update({ [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] });
  };

  return (
    <div className="rw-stack">
      <div className="rw-grid">
        <div className="rw-field">
          <FormGuideLabel
            text="Do you already have designs?"
            title="Design Readiness"
            description="Knowing if designs are available helps us estimate UI/UX effort and timeline."
            tips={[
              "Choose Yes if you have usable Figma or design files.",
              "Choose No if design is part of the project scope.",
            ]}
          />
          <select value={data.hasDesign} onChange={(e) => update({ hasDesign: e.target.value })}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="rw-field">
          <FormGuideLabel
            text="Do you already have an API/backend?"
            title="Backend Availability"
            description="This determines whether we integrate with existing services or build backend systems from scratch."
            tips={[
              "Choose Yes if endpoints already exist and are documented.",
              "Choose No if backend still needs architecture and development.",
            ]}
          />
          <select value={data.hasApi} onChange={(e) => update({ hasApi: e.target.value })}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Integrations (select any)"
          title="Third-party Integrations"
          description="Select external services your software must connect with at launch."
          tips={[
            "Choose all known integrations now.",
            "Use Custom API for private or internal services.",
          ]}
        />
        <div className="rw-chipgrid">
          {integrations.map((i) => (
            <button
              key={i}
              type="button"
              className={`rw-chip ${data.integrations.includes(i) ? "active" : ""}`}
              onClick={() => toggle("integrations", i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Security requirements (select any)"
          title="Security Requirements"
          description="Security controls shape architecture and compliance planning from day one."
          tips={[
            "Select controls needed by policy or regulation.",
            "Add extra security details in notes fields if needed.",
          ]}
        />
        <div className="rw-chipgrid">
          {securityNeeds.map((s) => (
            <button
              key={s}
              type="button"
              className={`rw-chip ${data.securityNeeds.includes(s) ? "active" : ""}`}
              onClick={() => toggle("securityNeeds", s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-grid">
        <div className="rw-field">
          <FormGuideLabel
            text="Data sources / existing systems"
            title="Data Sources"
            description="Describe where existing data lives so migration and syncing can be scoped correctly."
            tips={[
              "List current tools, databases, and spreadsheets.",
              "Mention data quality or formatting concerns if known.",
            ]}
          />
          <textarea
            rows={4}
            value={data.dataSources}
            onChange={(e) => update({ dataSources: e.target.value })}
            placeholder="Excel, existing database, legacy system, current app, etc."
          />
        </div>

        <div className="rw-field">
          <FormGuideLabel
            text="Preferred tech stack (optional)"
            title="Preferred Tech Stack"
            description="Share stack preferences, internal standards, or platform constraints for architecture planning."
            tips={[
              "Optional if you want us to recommend the stack.",
              "Mention hosting or language constraints if they exist.",
            ]}
          />
          <textarea
            rows={4}
            value={data.preferredStack}
            onChange={(e) => update({ preferredStack: e.target.value })}
            placeholder="e.g., React, Node, Python, Supabase, AWS, etc."
          />
        </div>
      </div>
    </div>
  );
}
