const softwareTypes = [
  "Web Application",
  "Mobile App",
  "Internal System",
  "Marketplace / Platform",
  "API / Backend Service",
  "Automation System",
  "Custom CRM / ERP",
];

const userGroups = ["Customers", "Staff", "Admins", "Partners", "Mixed"];
const scales = ["Small (1–500 users)", "Medium (500–10k)", "Large (10k+)", "Not sure yet"];

export default function Step2SoftwareType({ data, update }) {
  return (
    <div className="rw-stack">
      <div className="rw-field">
        <label>Software Type</label>
        <div className="rw-chipgrid">
          {softwareTypes.map((t) => (
            <button
              key={t}
              type="button"
              className={`rw-chip ${data.softwareType === t ? "active" : ""}`}
              onClick={() => update({ softwareType: t })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-grid">
        <div className="rw-field">
          <label>Primary users</label>
          <select value={data.users} onChange={(e) => update({ users: e.target.value })}>
            {userGroups.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>

        <div className="rw-field">
          <label>Expected scale</label>
          <select value={data.scale} onChange={(e) => update({ scale: e.target.value })}>
            {scales.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="rw-field">
        <label>Problem statement *</label>
        <textarea
          rows={5}
          value={data.problemStatement}
          onChange={(e) => update({ problemStatement: e.target.value })}
          placeholder="Describe what you want to build, the problem it solves, and how success looks."
        />
      </div>
    </div>
  );
}
