import FormGuideLabel from "../FormGuideLabel";

const assets = ["Logo", "Brand colors", "Fonts", "None yet"];
const styles = ["Clean / Minimal", "Corporate / Professional", "Futuristic / Tech", "Creative / Bold"];

export default function Step4Design({ data, update }) {
  const toggle = (value) => {
    const arr = data.brandAssets || [];
    if (arr.includes(value)) update({ brandAssets: arr.filter((x) => x !== value) });
    else update({ brandAssets: [...arr, value] });
  };

  return (
    <div className="rw-stack">
      <div className="rw-field">
        <FormGuideLabel
          text="Brand assets available"
          title="Brand Assets"
          description="Tell us what design materials already exist so we can estimate design effort accurately."
          tips={[
            "Select all assets currently ready.",
            "Choose None yet if branding still needs to be created.",
          ]}
        />
        <div className="rw-chipgrid">
          {assets.map((a) => (
            <button
              key={a}
              type="button"
              className={`rw-chip ${data.brandAssets.includes(a) ? "active" : ""}`}
              onClick={() => toggle(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Design style preference"
          title="Design Style"
          description="Choose the visual direction that best matches your brand and audience expectations."
          tips={[
            "Pick one primary style.",
            "Use reference links below to fine-tune taste.",
          ]}
        />
        <div className="rw-chipgrid">
          {styles.map((s) => (
            <button
              key={s}
              type="button"
              className={`rw-chip ${data.stylePreference === s ? "active" : ""}`}
              onClick={() => update({ stylePreference: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Reference websites (optional)"
          title="Reference Websites"
          description="Share examples to speed up alignment on layout, visuals, and interaction quality."
          tips={[
            "Paste one link per line.",
            "Mention what you like about each example.",
          ]}
        />
        <textarea
          rows={4}
          value={data.referenceLinks}
          onChange={(e) => update({ referenceLinks: e.target.value })}
          placeholder="Paste links to sites you like (one per line) + notes on what you like about them."
        />
      </div>
    </div>
  );
}
