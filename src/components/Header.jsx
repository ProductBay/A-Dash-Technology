import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./header.css";

const navItems = [
  { kind: "section", id: "services", label: "Services" },
  { kind: "route", to: "/work", label: "Work" },
  { kind: "route", to: "/graphics", label: "Graphics" },
  { kind: "route", to: "/about", label: "About" },
  { kind: "route", to: "/pricing", label: "Pricing" },
  { kind: "route", to: "/contact", label: "Contact" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const HOME_PATH = "/";
  const HOME_SECTIONS = ["services", "work"];

  const goToSection = (id) => {
    setMenuOpen(false);

    const scrollTo = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    if (location.pathname !== HOME_PATH) {
      navigate(HOME_PATH);
      setTimeout(scrollTo, 150);
    } else {
      scrollTo();
    }
  };

  useEffect(() => {
    if (location.pathname !== HOME_PATH) {
      setActiveSection(null);
      return;
    }

    const sections = HOME_SECTIONS
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

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <img
            src="/logos/adash.png"
            alt="A'Dash Technologies logo"
            className="header-logo"
          />
        </Link>

        <nav className="header-nav desktop" aria-label="Primary navigation">
          <div className="header-nav-shell">
            {navItems.map((item) => {
              const isSection =
                item.kind === "section" && activeSection === item.id;
              const isRoute =
                item.kind === "route" && location.pathname === item.to;
              const isActive = isSection || isRoute;

              if (item.kind === "section") {
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={() => goToSection(item.id)}
                  >
                    <span className="nav-link-copy">{item.label}</span>
                    <span className="nav-link-glow" />
                  </button>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <span className="nav-link-copy">{item.label}</span>
                  <span className="nav-link-glow" />
                </Link>
              );
            })}
          </div>

          <Link to="/request" className="nav-cta">
            Request Our Services
          </Link>
        </nav>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div
            className="mobile-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="mobile-menu-label">Navigate</span>

            {navItems.map((item) =>
              item.kind === "section" ? (
                <button
                  key={item.id}
                  type="button"
                  className="mobile-nav-link"
                  onClick={() => goToSection(item.id)}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}

            <Link
              to="/request"
              className="mobile-cta"
              onClick={() => setMenuOpen(false)}
            >
              Request Our Services
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
