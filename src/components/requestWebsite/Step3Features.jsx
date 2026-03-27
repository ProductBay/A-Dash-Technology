const features = [
  "Contact forms",
  "WhatsApp integration",
  "Online payments",
  "Booking system",
  "User accounts / login",
  "Admin dashboard",
  "Blog / CMS",
  "API integrations",
  "AI / automation",
  "3D / interactive elements",
  "Multilingual support",
];

export default function Step3Features({ data, update }) {
  const toggle = (value) => {
    const arr = data.features || [];
    if (arr.includes(value)) update({ features: arr.filter((x) => x !== value) });
    else update({ features: [...arr, value] });
  };

  return (
    <div className="rw-stack">
      <div className="rw-field">
        <label>Choose features</label>
        <div className="rw-chipgrid">
          {features.map((f) => (
            <button
              key={f}
              type="button"
              className={`rw-chip ${data.features.includes(f) ? "active" : ""}`}
              onClick={() => toggle(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <label>Custom features / notes</label>
        <textarea
          rows={5}
          value={data.customFeatures}
          onChange={(e) => update({ customFeatures: e.target.value })}
          placeholder="Describe any custom functionality, automation, AI workflows, integrations, or 3D ideas..."
        />
      </div>
    </div>
  );
}
