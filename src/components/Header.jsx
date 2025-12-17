import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./header.css";
import logo from "../assets/adash-logo.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function goToSection(id) {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Section observer (homepage only)
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const ids = ["services", "work"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand */}
        <Link to="/" className="header-brand">
  <img
    src={logo}
    alt="A’Dash Technology logo"
    className="header-logo"
  />
  <span className="brand-text">
    We architect what comes next, then build!<span></span>
  </span>
</Link>

        {/* Desktop nav */}
       <nav className="header-nav desktop">
  {/* Scroll sections (home only) */}
  <span
    className={`nav-link ${activeSection === "services" ? "active" : ""}`}
    onClick={() => goToSection("services")}
  >
    Services
  </span>

  <span
    className={`nav-link ${activeSection === "work" ? "active" : ""}`}
    onClick={() => goToSection("work")}
  >
    Work
  </span>

  {/* Route pages */}
  <Link
    to="/about"
    className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
  >
    About
  </Link>

  <Link
    to="/pricing"
    className={`nav-link ${location.pathname === "/pricing" ? "active" : ""}`}
  >
    Pricing
  </Link>

  <Link to="/contact" className="nav-cta">
    Contact
  </Link>
</nav>

        {/* Mobile hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
  <span onClick={() => goToSection("services")}>Services</span>
  <span onClick={() => goToSection("work")}>Work</span>

  <Link to="/about" onClick={() => setMenuOpen(false)}>
    About
  </Link>

  <Link to="/pricing" onClick={() => setMenuOpen(false)}>
    Pricing
  </Link>

  <Link to="/contact" className="mobile-cta" onClick={() => setMenuOpen(false)}>
    Contact
  </Link>
</div>

    </header>
  );
}
