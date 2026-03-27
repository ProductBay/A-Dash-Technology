import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ownedPlatforms } from "../data/ownedPlatforms";
import "../styles/software-logos.css";

function LogoItem({ item }) {
  return (
    <Link
      to={`/platform/${item.slug}`}
      className="software-logo-item"
      aria-label={item.alt}
    >
      <div className="software-logo-mark">
        {item.src ? (
          <img src={item.src} alt={item.alt} loading="lazy" />
        ) : (
          <div className="software-logo-fallback" aria-hidden="true">
            <span>{item.name}</span>
          </div>
        )}
      </div>
      <span className="software-logo-name">{item.name}</span>
      {item.type && <span className="software-logo-type">{item.type}</span>}
    </Link>
  );
}

export default function SoftwareLogos() {
  const railItems = [...ownedPlatforms, ...ownedPlatforms];

  return (
    <section className="software-logos" aria-labelledby="software-logos-title">
      <div className="software-logos-shell">
        <motion.div
          className="software-logos-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="software-logos-eyebrow">Software Ecosystem</span>
          <h2 id="software-logos-title">Platforms A&apos;Dash owns and builds</h2>
          <p>
            A curated view of the software products inside the A&apos;Dash
            ecosystem, spanning logistics, mobility, healthcare, inventory,
            education, visualization, and digital operations.
          </p>
        </motion.div>

        <div className="software-logos-marquee" aria-label="A'Dash software platform logos">
          <div className="software-logos-track">
            {railItems.map((item, index) => (
              <LogoItem key={`${item.name}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
