import { motion } from "framer-motion";
import "../styles/contact-cta.css";

export default function ContactCTA() {
  return (
    <section className="contact-cta" id="contact">
      <div className="contact-cta-inner">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Let’s build something <span>real</span>
        </motion.h2>

        <p>
          If you’re looking for production-grade software — not templates,
          not experiments — start a conversation.
        </p>

        <div className="cta-actions">
          <a
            href="https://wa.me/18765947320"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary"
          >
            Start on WhatsApp
          </a>

          <a href="/contact" className="cta-secondary">
            Contact Form
          </a>
        </div>
      </div>
    </section>
  );
}
