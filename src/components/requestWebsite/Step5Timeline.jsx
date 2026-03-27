const timelines = ["ASAP", "2–4 weeks", "1–2 months", "Flexible"];
const budgets = ["Under $1,000", "$1,000 – $3,000", "$3,000 – $6,000", "$6,000+"];

export default function Step5Timeline({ data, update }) {
  return (
    <div className="rw-grid">
      <div className="rw-field">
        <label>Desired timeframe</label>
        <select value={data.timeline} onChange={(e) => update({ timeline: e.target.value })}>
          {timelines.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="rw-field">
        <label>Budget range</label>
        <select value={data.budget} onChange={(e) => update({ budget: e.target.value })}>
          {budgets.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="rw-field">
        <label>Open to phased development?</label>
        <select value={data.phased} onChange={(e) => update({ phased: e.target.value })}>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
    </div>
  );
}
