import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/services.css";

export default function Services() {
  const services = [
    {
      title: "Web & Platform Engineering",
      desc: "Production-grade websites, dashboards, and internal platforms built for scale, speed, and longevity.",
    },
    {
      title: "Custom Software Systems",
      desc: "Tailored operational software, admin portals, and internal tools engineered around real workflows.",
    },
    {
      title: "Mobile & App Development",
      desc: "Modern mobile-first applications with secure backends and cloud-ready infrastructure.",
    },
    {
      title: "AI Builders & Automation",
      desc: "AI-assisted workflows, smart forms, automations, and intelligent system design.",
    },
    {
      title: "3D & Visualization Software",
      desc: "Interactive 3D tools and visualization systems that elevate user understanding and engagement.",
    },
    {
      title: "Integrations & Infrastructure",
      desc: "APIs, payments, WhatsApp flows, Supabase, Firebase, and enterprise-grade integrations.",
    },
    {
      title: "A'Dash Graphics",
      desc: "Brand systems, logo work, digital visual assets, and graphic design tailored for product-first businesses.",
      path: "/graphics",
      cta: "View graphics",
    },
    {
      title: "Website Showcase",
      desc: "High-converting website work across logistics, marketplaces, healthcare, and product-led digital experiences.",
      path: "/websites",
      cta: "View websites",
    },
  ];

  return (
    <section className="services">
      <div className="services-container">
        <motion.div
          className="services-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="services-eyebrow">WHAT WE BUILD</span>
          <h2 className="services-title">
            Full-spectrum <span>digital systems</span>
          </h2>
          <p className="services-description">
            From public-facing platforms to deeply integrated internal systems,
            A&apos;Dash Technology builds software that operates in the real world
            rather than demos.
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="service-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -8 }}
            >
              <div className="service-glow" />
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              {service.path ? (
                <Link to={service.path} className="service-link">
                  {service.cta}
                </Link>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
