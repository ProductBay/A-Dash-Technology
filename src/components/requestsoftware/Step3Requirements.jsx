const features = [
  "User authentication / login",
  "Role-based access control",
  "Admin dashboard",
  "Payments / billing",
  "Bookings / scheduling",
  "Messaging / notifications",
  "Reports / analytics",
  "File uploads",
  "Search & filters",
  "Audit logs",
  "Multi-tenant (multiple companies)",
];

const roles = ["Customer", "Staff", "Admin", "Super Admin", "Partner", "Vendor"];

export default function Step3Requirements({ data, update }) {
  const toggle = (key, value) => {
    const arr = data[key] || [];
    update({ [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] });
  };

  return (
    <div className="rw-stack">
      <div className="rw-field">
        <label>Core features *</label>
        <div className="rw-chipgrid">
          {features.map((f) => (
            <button
              key={f}
              type="button"
              className={`rw-chip ${data.coreFeatures.includes(f) ? "active" : ""}`}
              onClick={() => toggle("coreFeatures", f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <label>User roles (select any)</label>
        <div className="rw-chipgrid">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              className={`rw-chip ${data.roles.includes(r) ? "active" : ""}`}
              onClick={() => toggle("roles", r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <label>Workflow / business logic</label>
        <textarea
          rows={5}
          value={data.workflows}
          onChange={(e) => update({ workflows: e.target.value })}
          placeholder="Explain the flow: how users sign up, what they do, approval steps, and key actions."
        />
      </div>

      <div className="rw-grid">
        <div className="rw-field">
          <label>Must-have features</label>
          <textarea
            rows={4}
            value={data.mustHave}
            onChange={(e) => update({ mustHave: e.target.value })}
            placeholder="Top priorities — required for launch."
          />
        </div>

        <div className="rw-field">
          <label>Nice-to-have features</label>
          <textarea
            rows={4}
            value={data.niceToHave}
            onChange={(e) => update({ niceToHave: e.target.value })}
            placeholder="Optional features for later phases."
          />
        </div>
      </div>
    </div>
  );
}
