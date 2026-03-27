import { Suspense, lazy } from "react";
import Trust from "../sections/Trust";
import Services from "../sections/Services";
import ContactCTA from "../sections/ContactCTA";
import TechStack from "../sections/TechStack";
import SoftwareLogos from "../sections/SoftwareLogos";
import Platforms from "../sections/Platforms";
import GraphicsShowcase from "../sections/GraphicsShowcase";
import { usePageMeta } from "../lib/usePageMeta";

const Hero = lazy(() => import("../sections/Hero"));

function SectionLoader({ minHeight = "70vh" }) {
  return (
    <section
      style={{
        minHeight,
        display: "grid",
        placeItems: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          padding: "0.9rem 1.15rem",
          borderRadius: "999px",
          border: "1px solid rgba(157,220,255,0.16)",
          background: "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.78)",
          fontSize: "0.76rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Loading section
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta({
    title: "Software, Platforms, and Digital Systems",
    description:
      "A'Dash Technology designs and builds production-grade platforms, websites, portals, and internal systems for real businesses.",
    canonicalPath: "/",
    image: "/vite.png",
  });

  return (
    <>
      <Suspense fallback={<SectionLoader />}>
        <Hero />
      </Suspense>

      <Trust />

      <section id="services">
        <Services />
      </section>

      <GraphicsShowcase />
      <TechStack />
      <SoftwareLogos />
      <Platforms />
      <ContactCTA />
    </>
  );
}
