import FormGuideLabel from "../FormGuideLabel";

const timelines = ["ASAP", "2-4 weeks", "1-2 months", "Flexible"];
const budgets = [
  "Under J$180,000",
  "J$180,000 - J$350,000",
  "J$350,000 - J$650,000",
  "J$650,000+",
];

export default function Step5Timeline({ data, update }) {
  return (
    <div className="rw-grid">
      <div className="rw-field">
        <FormGuideLabel
          text="Desired timeframe"
          title="Desired Timeframe"
          description="Your target launch window helps us shape scope and team planning."
          tips={[
            "Choose ASAP only for truly urgent launches.",
            "Flexible gives room for best quality and risk reduction.",
          ]}
        />
        <select value={data.timeline} onChange={(e) => update({ timeline: e.target.value })}>
          {timelines.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Budget range"
          title="Budget Range"
          description="This keeps recommendations realistic and aligned to available investment."
          tips={[
            "Pick your comfortable range, not your maximum possible.",
            "We can phase work to fit budget constraints.",
          ]}
        />
        <select value={data.budget} onChange={(e) => update({ budget: e.target.value })}>
          {budgets.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Open to phased development?"
          title="Phased Delivery"
          description="Phased delivery launches core features first and expands in planned milestones."
          tips={[
            "Yes is recommended for speed and budget control.",
            "No suits fixed full-scope launches.",
          ]}
        />
        <select value={data.phased} onChange={(e) => update({ phased: e.target.value })}>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
    </div>
  );
}
