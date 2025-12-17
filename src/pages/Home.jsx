import Hero from "../sections/Hero";
import Trust from "../sections/Trust";
import Services from "../sections/Services";
import CaseStudies from "../sections/CaseStudies";
import ContactCTA from "../sections/ContactCTA";
import TechStack from "../sections/TechStack";

export default function Home() {
  return (
    <>
      <Hero />

      <Trust />

      {/* SERVICES */}
      <section id="services">
        <Services />
      </section>
        <TechStack />
        
      {/* WORK / CASE STUDIES */}
      <section id="work">
        <CaseStudies />
      </section>

      <ContactCTA />
    </>
  );
}
