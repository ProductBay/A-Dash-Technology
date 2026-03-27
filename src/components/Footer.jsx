import { Link } from "react-router-dom";
import { ownedPlatforms } from "../data/ownedPlatforms";
import "./footer.css";

const capabilityLinks = Array.from(
  new Set(ownedPlatforms.flatMap((item) => item.capabilities))
).slice(0, 6);

const platformLinks = ownedPlatforms
  .filter((item) => item.slug !== "adash")
  .map((item) => item.name);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            src="/logos/adash.png"
            alt="A'Dash Technologies logo"
            className="footer-logo"
          />
          <p className="footer-intro">
            A&apos;Dash builds production-grade platforms, operational software,
            and intelligent systems for real businesses.
          </p>

          <div className="footer-meta">
            <div className="footer-stat">
              <strong>9+</strong>
              <span>Owned software products</span>
            </div>
            <div className="footer-stat">
              <strong>Logistics to AI</strong>
              <span>Cross-industry platform capability</span>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <span>Navigate</span>
            <Link to="/">Home</Link>
            <Link to="/work">Work</Link>
            <Link to="/graphics">Graphics</Link>
            <Link to="/about">About</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/request">Request Services</Link>
          </div>

          <div className="footer-col">
            <span>Capabilities</span>
            {capabilityLinks.map((item) => (
              <p key={item} className="footer-text-link">
                {item}
              </p>
            ))}
          </div>

          <div className="footer-col footer-projects">
            <span>Projects</span>
            {platformLinks.map((item) => (
              <p key={item} className="footer-text-link">
                {item}
              </p>
            ))}
          </div>

          <div className="footer-col">
            <span>Connect</span>
            <a href="mailto:ash@adash.tech">ash@adash.tech</a>
            <a
              href="https://wa.me/18765947320"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <Link to="/contact">Contact Form</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} A&apos;Dash Technology</span>
        <span>Built in Jamaica. Designed for the world.</span>
        <span>Founded & led by Ashandie Powell</span>
      </div>
    </footer>
  );
}
