import FormGuideLabel from "../FormGuideLabel";

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
        <FormGuideLabel
          text="Core features *"
          title="Core Features"
          description="Select the capabilities required for your first production release."
          tips={[
            "Choose essentials for launch.",
            "Use must-have and nice-to-have fields below to prioritize clearly.",
          ]}
        />
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
        <FormGuideLabel
          text="User roles (select any)"
          title="User Roles"
          description="Roles define permissions, dashboards, and approval paths in your system."
          tips={[
            "Select every role expected at launch.",
            "Add missing role details in workflow notes.",
          ]}
        />
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
        <FormGuideLabel
          text="Workflow / business logic"
          title="Workflow and Business Logic"
          description="Explain what users do step-by-step and how approvals, status changes, or automations should work."
          tips={[
            "Describe process from first action to completion.",
            "Include exceptions and approval rules if possible.",
          ]}
        />
        <textarea
          rows={5}
          value={data.workflows}
          onChange={(e) => update({ workflows: e.target.value })}
          placeholder="Explain the flow: how users sign up, what they do, approval steps, and key actions."
        />
      </div>

      <div className="rw-grid">
        <div className="rw-field">
          <FormGuideLabel
            text="Must-have features"
            title="Must-have Features"
            description="List features that are required before go-live."
            tips={[
              "Focus on mission-critical requirements.",
              "Anything here should be non-negotiable for launch.",
            ]}
          />
          <textarea
            rows={4}
            value={data.mustHave}
            onChange={(e) => update({ mustHave: e.target.value })}
            placeholder="Top priorities — required for launch."
          />
        </div>

        <div className="rw-field">
          <FormGuideLabel
            text="Nice-to-have features"
            title="Nice-to-have Features"
            description="List enhancements that can be delivered after launch or in later phases."
            tips={[
              "Great place for future optimizations.",
              "Keep this separate from core launch requirements.",
            ]}
          />
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
