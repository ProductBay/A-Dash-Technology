import ServicePageTemplate from "../../components/services/ServicePageTemplate";

const highlights = [
  {
    title: "Custom Platform Engineering",
    body: "We design and build robust software platforms, internal systems, and APIs aligned to your business model and growth goals.",
  },
  {
    title: "Secure Architecture",
    body: "Our software delivery includes security-focused decisions from data design to permission models and operational reliability.",
  },
  {
    title: "Scalable Product Foundations",
    body: "We build systems prepared for adoption growth, feature expansion, and long-term maintainability.",
  },
];

const workstreams = [
  {
    title: "Product-Centric Delivery",
    body: "We break delivery into strategic phases so your team can launch value early while keeping future evolution clean.",
  },
  {
    title: "Quality Engineering Standards",
    body: "We apply enterprise implementation discipline with testing, validation, and review cycles designed to reduce regressions.",
  },
  {
    title: "Operational Continuity",
    body: "We plan maintainability and support so your software remains reliable beyond initial launch.",
  },
];

const integrityPoints = [
  "Architecture choices explained with clear trade-offs.",
  "Implementation quality prioritized over shortcuts.",
  "Delivery accountability through transparent milestones.",
];

const benefits = [
  "Improved operational efficiency and workflow automation.",
  "Higher reliability and better user experience.",
  "Reduced rework from cleaner architecture decisions.",
  "A foundation ready for scaling, integrations, and innovation.",
];

export default function SoftwareService() {
  return (
    <ServicePageTemplate
      badge="Service • Software"
      title="Software Engineering Service"
      subtitle="Build resilient digital systems that support real business growth."
      intro="Our Software service delivers tailored applications, platforms, APIs, and internal systems with enterprise-grade architecture and implementation quality."
      accentClass="sp-accent-cyan"
      requestPath="/request/software"
      highlights={highlights}
      workstreams={workstreams}
      integrityPoints={integrityPoints}
      benefits={benefits}
    />
  );
}
