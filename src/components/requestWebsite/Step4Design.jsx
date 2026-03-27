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
        <label>Brand assets available</label>
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
        <label>Design style preference</label>
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
        <label>Reference websites (optional)</label>
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
