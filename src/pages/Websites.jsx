import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import "../styles/portfolio-page.css";

export default function Websites() {
  usePageMeta({
    title: "Website Examples",
    description:
      "Request a curated review of A'Dash website work relevant to your industry, product, or platform direction.",
    canonicalPath: "/websites",
    image: "/vite.png",
  });

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <div className="portfolio-shell">
          <span className="portfolio-eyebrow">Website Showcase</span>
          <h1>Website examples are currently shared through a curated review flow</h1>
          <p>
            The public website portfolio is being tightened before broader
            release. If you&apos;re evaluating A&apos;Dash for a website, portal, or
            commercial frontend system, request a conversation and we&apos;ll share
            the most relevant examples directly.
          </p>

          <div className="showcase-actions" style={{ marginTop: "2rem" }}>
            <Link to="/contact" className="showcase-link-primary">
              Request Website Examples
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
