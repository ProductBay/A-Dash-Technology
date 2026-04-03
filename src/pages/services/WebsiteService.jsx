import ServicePageTemplate from "../../components/services/ServicePageTemplate";

const highlights = [
  {
    title: "Brand-Aligned Web Presence",
    body: "We create websites and web experiences that clearly communicate your value, credibility, and positioning.",
  },
  {
    title: "Performance and Conversion Focus",
    body: "Our websites are engineered for speed, usability, and conversion outcomes such as leads, bookings, or sales.",
  },
  {
    title: "Future-Ready Implementation",
    body: "We build with maintainable structures and extensible foundations so your website can evolve with your business.",
  },
];

const workstreams = [
  {
    title: "Strategic UX and Content Structure",
    body: "We design information flow and page structure to guide visitors toward meaningful customer actions.",
  },
  {
    title: "High-Quality Visual Execution",
    body: "We deliver polished interfaces aligned to modern standards and your brand identity.",
  },
  {
    title: "Launch and Optimization Support",
    body: "We help ensure smooth launch quality and provide recommendations to improve ongoing performance.",
  },
];

const integrityPoints = [
  "No template-first shortcuts that dilute brand impact.",
  "Quality standards applied to design and implementation.",
  "Clear communication from concept through launch.",
];

const benefits = [
  "Stronger digital credibility and customer trust.",
  "Better lead generation and conversion outcomes.",
  "Improved usability across desktop and mobile.",
  "A scalable website foundation for future growth.",
];

export default function WebsiteService() {
  return (
    <ServicePageTemplate
      badge="Service • Websites"
      title="Website Development Service"
      subtitle="Deliver digital experiences that convert attention into business value."
      intro="Our Website service combines strategy, design, and engineering to produce high-performance web experiences for modern organizations."
      accentClass="sp-accent-mint"
      requestPath="/request/website"
      highlights={highlights}
      workstreams={workstreams}
      integrityPoints={integrityPoints}
      benefits={benefits}
    />
  );
}
