const projectTypes = [
  "Business Website",
  "E-commerce",
  "Web Application",
  "Landing Page",
  "Portfolio",
  "Custom Platform",
];

const goals = [
  "Generate leads",
  "Sell products",
  "Accept bookings",
  "Showcase brand",
  "Internal system",
];

export default function Step2Project({ data, update }) {
  const toggle = (key, value) => {
    const arr = data[key] || [];
    if (arr.includes(value)) update({ [key]: arr.filter((x) => x !== value) });
    else update({ [key]: [...arr, value] });
  };

  return (
    <div className="rw-stack">
      <div className="rw-field">
        <label>Project Type</label>
        <div className="rw-chipgrid">
          {projectTypes.map((t) => (
            <button
              key={t}
              type="button"
              className={`rw-chip ${data.projectType === t ? "active" : ""}`}
              onClick={() => update({ projectType: t })}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <label>Primary Goal (select all that apply)</label>
        <div className="rw-chipgrid">
          {goals.map((g) => (
            <button
              key={g}
              type="button"
              className={`rw-chip ${data.goals.includes(g) ? "active" : ""}`}
              onClick={() => toggle("goals", g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-grid">
        <div className="rw-field">
          <label>Do you already have a website?</label>
          <select value={data.hasWebsite} onChange={(e) => update({ hasWebsite: e.target.value })}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="rw-field">
          <label>Existing Website URL {data.hasWebsite === "Yes" ? "*" : ""}</label>
          <input
            value={data.websiteUrl}
            onChange={(e) => update({ websiteUrl: e.target.value })}
            placeholder="example.com"
            disabled={data.hasWebsite !== "Yes"}
          />
        </div>
      </div>
    </div>
  );
}
