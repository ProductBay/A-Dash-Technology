import { motion } from "framer-motion";
import "../styles/cta.css";

export default function CTA() {
  return (
    <section className="cta">
      <div className="cta-inner">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>
            Let’s build something
            <span>serious</span>
          </h2>

          <p>
            A’Dash Technology partners with founders, teams, and organizations
            to design and engineer custom software platforms, operational systems,
            and next-generation digital products.
          </p>

          <div className="cta-actions">
            <a href="#contact" className="cta-primary">
              Start a conversation
            </a>
            <span className="cta-note">
              Founder-led • Engineering-first • Built in Jamaica
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
