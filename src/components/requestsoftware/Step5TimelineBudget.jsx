import FormGuideLabel from "../FormGuideLabel";

const timelines = ["ASAP", "2-4 weeks", "1-2 months", "3-6 months", "Flexible"];
const budgets = [
  "Under J$900,000",
  "J$900,000 - J$1,500,000",
  "J$1,500,000 - J$2,500,000",
  "J$2,500,000+",
];

export default function Step5TimelineBudget({ data, update }) {
  return (
    <div className="rw-grid">
      <div className="rw-field">
        <FormGuideLabel
          text="Desired timeframe"
          title="Desired Timeframe"
          description="Your target launch window helps us design realistic milestones and team allocation."
          tips={[
            "Pick the nearest practical timeline.",
            "Flexible improves quality and reduces risk.",
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
          description="Budget range helps us recommend the right scope, architecture, and rollout strategy."
          tips={[
            "Choose your comfortable investment range.",
            "We can structure phased delivery to match budgets.",
          ]}
        />
        <select value={data.budget} onChange={(e) => update({ budget: e.target.value })}>
          {budgets.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Open to phased development?"
          title="Phased Development"
          description="Phased builds release core value early while reducing launch risk and upfront cost."
          tips={[
            "Yes is ideal for complex platforms.",
            "No suits fixed all-at-once launches.",
          ]}
        />
        <select value={data.phased} onChange={(e) => update({ phased: e.target.value })}>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Ongoing maintenance / support?"
          title="Maintenance and Support"
          description="This helps plan post-launch monitoring, updates, and technical support coverage."
          tips={[
            "Choose Yes if you want long-term support plans.",
            "Choose No if your internal team will own operations.",
          ]}
        />
        <select value={data.maintenance} onChange={(e) => update({ maintenance: e.target.value })}>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
    </div>
  );
}
