import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand block */}
        <div className="footer-brand">
          <div className="footer-logo">
            A’Dash<span>.</span>
          </div>
          <p>
            Production-grade software engineering.<br />
            Built in Jamaica. Designed for the world.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-links">
          <div className="footer-col">
            <span>Explore</span>
            <Link to="/">Home</Link>
            <Link to="/#work">Work</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <span>Company</span>
            <Link to="/about">About</Link>
            <a
              href="https://wa.me/18765947320"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} A’Dash Technology
        </span>
        <span>
          Founded & led by Ashandie Powell
        </span>
      </div>
    </footer>
  );
}
