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
          <label>Do you already have designs?</label>
          <select value={data.hasDesign} onChange={(e) => update({ hasDesign: e.target.value })}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="rw-field">
          <label>Do you already have an API/backend?</label>
          <select value={data.hasApi} onChange={(e) => update({ hasApi: e.target.value })}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      </div>

      <div className="rw-field">
        <label>Integrations (select any)</label>
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
        <label>Security requirements (select any)</label>
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
          <label>Data sources / existing systems</label>
          <textarea
            rows={4}
            value={data.dataSources}
            onChange={(e) => update({ dataSources: e.target.value })}
            placeholder="Excel, existing database, legacy system, current app, etc."
          />
        </div>

        <div className="rw-field">
          <label>Preferred tech stack (optional)</label>
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
