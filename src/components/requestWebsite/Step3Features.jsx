import FormGuideLabel from "../FormGuideLabel";

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
        <FormGuideLabel
          text="Choose features"
          title="Feature Selection"
          description="Select capabilities your website must include at launch."
          tips={[
            "Pick only the features needed for version one.",
            "You can add advanced features in later phases.",
          ]}
        />
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
        <FormGuideLabel
          text="Custom features / notes"
          title="Custom Feature Notes"
          description="Add special requirements that are not already listed in the feature cards."
          tips={[
            "Describe integrations, automation, or workflows.",
            "Include business rules if known.",
          ]}
        />
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
