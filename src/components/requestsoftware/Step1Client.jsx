import FormGuideLabel from "../FormGuideLabel";

export default function Step1Client({ data, update }) {
  return (
    <div className="rw-grid">
      <div className="rw-field">
        <FormGuideLabel
          text="Full Name *"
          title="Full Name"
          description="Enter the primary contact person for this request."
          tips={["Use legal name of the decision-maker.", "This helps us keep communication clear."]}
        />
        <input value={data.fullName} onChange={(e) => update({ fullName: e.target.value })} placeholder="Your name" />
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Company / Brand Name"
          title="Company or Brand"
          description="Share the business or brand name tied to this project."
          tips={["Optional for personal projects.", "Use the customer-facing brand name if different."]}
        />
        <input value={data.company} onChange={(e) => update({ company: e.target.value })} placeholder="Company (optional)" />
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Email *"
          title="Email Address"
          description="Provide the best email for project updates, proposals, and approvals."
          tips={["Use an inbox you check daily.", "Team email is fine if multiple people review updates."]}
        />
        <input value={data.email} onChange={(e) => update({ email: e.target.value })} placeholder="name@company.com" />
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Phone / WhatsApp *"
          title="Phone or WhatsApp"
          description="Give us the quickest channel for urgent clarifications during scoping."
          tips={["Include country code.", "WhatsApp-enabled number is preferred."]}
        />
        <input value={data.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} placeholder="+1-876-..." />
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Country / Region"
          title="Country or Region"
          description="Location helps with timezone planning, regulations, and support coverage."
          tips={["Choose where your team operates primarily.", "Select Other if not listed."]}
        />
        <select value={data.region} onChange={(e) => update({ region: e.target.value })}>
          <option>Jamaica</option>
          <option>Trinidad & Tobago</option>
          <option>Barbados</option>
          <option>The Bahamas</option>
          <option>Cayman Islands</option>
          <option>United States</option>
          <option>Canada</option>
          <option>Other</option>
        </select>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Client Type"
          title="Client Type"
          description="This helps us tailor recommendations, documentation depth, and delivery process."
          tips={["Startup is ideal for early growth teams.", "Enterprise usually implies governance and compliance needs."]}
        />
        <select value={data.clientType} onChange={(e) => update({ clientType: e.target.value })}>
          <option>Individual</option>
          <option>Startup</option>
          <option>Small Business</option>
          <option>Enterprise</option>
        </select>
      </div>
    </div>
  );
}
