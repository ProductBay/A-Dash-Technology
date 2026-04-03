import FormGuideLabel from "../FormGuideLabel";

export default function Step6Review({ data, update }) {
  const lines = [
    ["Name", data.fullName],
    ["Brand", data.brandName || "—"],
    ["Email", data.email],
    ["WhatsApp", data.whatsapp],
    ["Region", data.region],
    ["Client type", data.clientType],
    ["Project type", data.projectType],
    ["Goals", data.goals.length ? data.goals.join(", ") : "—"],
    ["Has website", data.hasWebsite],
    ["Website URL", data.websiteUrl || "—"],
    ["Features", data.features.length ? data.features.join(", ") : "—"],
    ["Style", data.stylePreference],
    ["Brand assets", data.brandAssets.length ? data.brandAssets.join(", ") : "—"],
    ["Timeline", data.timeline],
    ["Budget", data.budget],
    ["Phased", data.phased],
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
          <FormGuideLabel
            text="How did you hear about A'Dash?"
            title="Referral Source"
            description="This helps us understand which channels are most useful for future clients."
            tips={[
              "You can keep this short.",
              "Examples: Instagram, referral, Google, LinkedIn.",
            ]}
          />
          <input
            value={data.referralSource}
            onChange={(e) => update({ referralSource: e.target.value })}
            placeholder="Instagram, referral, Google, etc."
          />
        </div>

        <div className="rw-field">
          <FormGuideLabel
            text="Additional notes"
            title="Additional Notes"
            description="Share anything else that can improve scoping accuracy before kickoff."
            tips={[
              "Mention deadlines, stakeholders, or constraints.",
              "Add context that did not fit earlier steps.",
            ]}
          />
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
        <span>
          I understand this is a project request and not instant delivery.
        </span>
      </label>
    </div>
  );
}
