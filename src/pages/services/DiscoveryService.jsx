import ServicePageTemplate from "../../components/services/ServicePageTemplate";

const highlights = [
  {
    title: "Business and Technical Discovery",
    body: "We clarify your goals, constraints, and opportunity areas so you can move from uncertainty to a practical execution path.",
  },
  {
    title: "Scope and Priority Modeling",
    body: "We define what should launch first, what can be phased, and what should wait so investment stays aligned to outcomes.",
  },
  {
    title: "Risk and Readiness Assessment",
    body: "We identify delivery risks early and provide mitigation recommendations before build decisions are locked in.",
  },
];

const workstreams = [
  {
    title: "Structured Workshops",
    body: "We run focused sessions with stakeholders to document requirements, success metrics, dependencies, and business logic.",
  },
  {
    title: "Decision Support",
    body: "We advise on architecture direction, platform choices, and phased rollout strategy with clear trade-off visibility.",
  },
  {
    title: "Actionable Roadmap",
    body: "We provide a practical plan with next-step recommendations you can execute with confidence.",
  },
];

const integrityPoints = [
  "Transparent recommendations grounded in your context, not generic templates.",
  "Scope discipline to prevent overbuilding and reduce delivery risk.",
  "Clear communication at every stage with documented assumptions.",
];

const benefits = [
  "Faster decision-making with reduced ambiguity.",
  "Better budget control through phased planning.",
  "Higher confidence before committing to implementation.",
  "Improved stakeholder alignment across business and technical teams.",
];

export default function DiscoveryService() {
  return (
    <ServicePageTemplate
      badge="Service • Discovery"
      title="Discovery and Qualification Service"
      subtitle="Align strategy, scope, and execution before the build starts."
      intro="Our Discovery service helps organizations define the right problem, validate priorities, and build a clear roadmap for software, websites, AI automation, or digital platforms."
      accentClass="sp-accent-gold"
      requestPath="/request/discovery"
      highlights={highlights}
      workstreams={workstreams}
      integrityPoints={integrityPoints}
      benefits={benefits}
    />
  );
}
