export default function Step1Client({ data, update }) {
  return (
    <div className="rw-grid">
      <div className="rw-field">
        <label>Full Name *</label>
        <input value={data.fullName} onChange={(e) => update({ fullName: e.target.value })} placeholder="Your name" />
      </div>

      <div className="rw-field">
        <label>Company / Brand Name</label>
        <input value={data.brandName} onChange={(e) => update({ brandName: e.target.value })} placeholder="Brand name (optional)" />
      </div>

      <div className="rw-field">
        <label>Email *</label>
        <input value={data.email} onChange={(e) => update({ email: e.target.value })} placeholder="name@company.com" />
      </div>

      <div className="rw-field">
        <label>Phone / WhatsApp *</label>
        <input value={data.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} placeholder="+1-876-..." />
      </div>

      <div className="rw-field">
        <label>Country / Region</label>
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
        <label>Client Type</label>
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
