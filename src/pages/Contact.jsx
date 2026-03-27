import { motion } from "framer-motion";
import "../styles/contact.css";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePageMeta } from "../lib/usePageMeta";

export default function Contact() {
  const [searchParams] = useSearchParams();

  usePageMeta({
    title: "Contact",
    description:
      "Start a conversation with A'Dash Technology about software engineering, websites, portals, AI tools, and operational systems.",
    canonicalPath: "/contact",
    image: "/vite.png",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tier: "",
    budget: "",
    message: "",
  });

  useEffect(() => {
    const tier = searchParams.get("tier");
    const budget = searchParams.get("budget");

    setFormData((prev) => ({
      ...prev,
      tier: tier || "",
      budget: budget
        ? `Approx. starting at J$${Number(budget).toLocaleString()}`
        : "",
    }));
  }, [searchParams]);

  return (
    <section className="contact-page">
      <div className="contact-inner">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          Start a conversation
        </motion.h1>

        <p className="contact-intro">
          Tell us what you&apos;re building. We&apos;ll tell you what it takes to do it
          properly.
        </p>

        <form
          className="contact-form"
          action="https://formsubmit.co/ash@adash.tech"
          method="POST"
        >
          <input type="hidden" name="_subject" value="New A'Dash Inquiry" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value={`${window.location.origin}/contact`} />

          <input type="hidden" name="Interested Tier" value={formData.tier} />
          <input type="hidden" name="Estimated Budget" value={formData.budget} />

          <label>
            Name
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </label>

          <label>
            What are you building?
            <textarea
              name="message"
              rows="5"
              required
              placeholder="Describe the project, the business need, and the outcome you want."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </label>

          <button type="submit">Send inquiry</button>
        </form>

        <div className="contact-alt">
          <span>Prefer WhatsApp?</span>
          <a href="https://wa.me/18765947320" target="_blank" rel="noreferrer">
            Message directly →
          </a>
        </div>
      </div>
    </section>
  );
}
