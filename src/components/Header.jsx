import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./header.css";

const navItems = [
  {
    kind: "dropdown",
    id: "services",
    label: "Services",
    accentRgb: "0, 255, 255",
    items: [
      { to: "/services/discovery", label: "Discovery" },
      { to: "/services/software", label: "Software" },
      { to: "/services/websites", label: "Websites" },
    ],
  },
  { kind: "route", to: "/projects", label: "Projects", accentRgb: "0, 255, 128" },
  { kind: "route", to: "/work", label: "Work", accentRgb: "44, 214, 255" },
  { kind: "route", to: "/graphics", label: "Graphics", accentRgb: "96, 148, 255" },
  { kind: "route", to: "/about", label: "About", accentRgb: "255, 112, 214" },
  { kind: "route", to: "/pricing", label: "Pricing", accentRgb: "180, 132, 255" },
  { kind: "route", to: "/contact", label: "Contact", accentRgb: "255, 198, 76" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

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
    setOpenDropdown(null);
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
                item.kind === "route" &&
                (location.pathname === item.to ||
                  (item.to === "/projects" &&
                    location.pathname.startsWith("/projects/")));
              const isActive = isSection || isRoute;
              const isDropdown = item.kind === "dropdown";
              const isDropdownOpen = openDropdown === item.id;

              if (isDropdown) {
                return (
                  <div
                    key={item.id}
                    className="nav-dropdown-wrapper"
                    style={{ "--tab-accent-rgb": item.accentRgb }}
                  >
                    <button
                      type="button"
                      className={`nav-link ${isDropdownOpen ? "open" : ""}`}
                      onClick={() =>
                        setOpenDropdown(isDropdownOpen ? null : item.id)
                      }
                    >
                      <span className="nav-link-copy">{item.label}</span>
                      <span className="nav-link-glow" />
                    </button>
                    {isDropdownOpen && (
                      <div className="nav-dropdown-menu">
                        {item.items.map((subitem) => (
                          <Link
                            key={subitem.to}
                            to={subitem.to}
                            className="nav-dropdown-item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

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
                  style={{ "--tab-accent-rgb": item.accentRgb }}
                >
                  <span className="nav-link-copy">{item.label}</span>
                  <span className="nav-link-glow" />
                </Link>
              );
            })}
          </div>

          <Link to="/client" className="nav-client-cta">
            Client Portal
          </Link>

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

            {navItems.map((item) => {
              const isDropdown = item.kind === "dropdown";
              const isMobileOpen = openDropdown === item.id;

              if (isDropdown) {
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      className="mobile-nav-link"
                      style={{ "--tab-accent-rgb": item.accentRgb }}
                      onClick={() =>
                        setOpenDropdown(isMobileOpen ? null : item.id)
                      }
                    >
                      {item.label}
                      <span className="mobile-dropdown-arrow">
                        {isMobileOpen ? "▼" : "▶"}
                      </span>
                    </button>
                    {isMobileOpen && (
                      <div
                        className="mobile-dropdown-menu"
                        style={{ "--tab-accent-rgb": item.accentRgb }}
                      >
                        {item.items.map((subitem) => (
                          <Link
                            key={subitem.to}
                            to={subitem.to}
                            className="mobile-dropdown-item"
                            style={{ "--tab-accent-rgb": item.accentRgb }}
                            onClick={() => {
                              setMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.kind === "section") {
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="mobile-nav-link"
                    onClick={() => goToSection(item.id)}
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="mobile-nav-link"
                  style={{ "--tab-accent-rgb": item.accentRgb }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              to="/client"
              className="mobile-client-cta"
              onClick={() => setMenuOpen(false)}
            >
              Client Portal
            </Link>

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
