export default function Step6Review({ data, update }) {
  const lines = [
    ["Service", data.serviceType],
    ["Name", data.fullName],
    ["Company", data.company || "—"],
    ["Email", data.email],
    ["WhatsApp", data.whatsapp],
    ["Region", data.region],
    ["Client Type", data.clientType],
    ["Software Type", data.softwareType],
    ["Users", data.users],
    ["Scale", data.scale],
    ["Core Features", data.coreFeatures.length ? data.coreFeatures.join(", ") : "—"],
    ["Roles", data.roles.length ? data.roles.join(", ") : "—"],
    ["Integrations", data.integrations.length ? data.integrations.join(", ") : "—"],
    ["Security", data.securityNeeds.length ? data.securityNeeds.join(", ") : "—"],
    ["Timeline", data.timeline],
    ["Budget", data.budget],
    ["Phased", data.phased],
    ["Maintenance", data.maintenance],
  ];

  return (
    <div className="rw-stack">
      <div className="rw-review">
        {lines.map(([k, v]) => (
          <div className="rw-review-row" key={k}>
            <div className="rw-review-k">{k}</div>
            <div className="rw-review-v">{v}</div>
          </div>
        ))}
      </div>

      <div className="rw-grid">
        <div className="rw-field">
          <label>How did you hear about A’Dash?</label>
          <input
            value={data.referralSource}
            onChange={(e) => update({ referralSource: e.target.value })}
            placeholder="Instagram, referral, Google, etc."
          />
        </div>

        <div className="rw-field">
          <label>Additional notes</label>
          <input
            value={data.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Anything else we should know?"
          />
        </div>
      </div>

      <label className="rw-check">
        <input
          type="checkbox"
          checked={data.agree}
          onChange={(e) => update({ agree: e.target.checked })}
        />
        <span>I understand this is a project request and not instant delivery.</span>
      </label>
    </div>
  );
}
