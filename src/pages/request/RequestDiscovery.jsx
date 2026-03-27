import { useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/request-website.css";

const initialData = {
  fullName: "",
  company: "",
  email: "",
  whatsapp: "",
  projectStage: "Idea / early concept",
  preferredTrack: "Need help deciding",
  budgetRange: "Not sure yet",
  timeline: "Flexible",
  summary: "",
};

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());
}

export default function RequestDiscovery() {
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.fullName.trim()) return alert("Full name is required.");
    if (!isValidEmail(data.email)) return alert("Please enter a valid email.");
    if (!data.summary.trim()) return alert("Please describe what you need.");

    setSubmitting(true);

    try {
      const { error } = await supabase.from("service_requests").insert([
        {
          service_type: "discovery",
          full_name: data.fullName,
          company: data.company || null,
          email: data.email,
          whatsapp: data.whatsapp || null,
          region: "Unknown",
          client_type: data.projectStage,
          payload: data,
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("Discovery request failed:", error);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="rw-shell">
        <div className="rw-bg" />
        <section className="rw-card rw-success">
          <div className="rw-badge">Discovery Request Received</div>
          <h1 className="rw-title">We'll guide the next step from here.</h1>
          <p className="rw-subtitle">
            A&apos;Dash will review your context and recommend the right build
            path, scope direction, and next conversation.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="rw-shell">
      <div className="rw-bg" />
      <section className="rw-card">
        <header className="rw-header">
          <div>
            <div className="rw-badge">A&apos;Dash • Discovery Request</div>
            <h1 className="rw-title">Start with discovery and qualification</h1>
            <p className="rw-subtitle">
              If you&apos;re still shaping the project, use this flow and we&apos;ll
              help you define the right software, website, AI, or 3D path.
            </p>
          </div>
        </header>

        <form className="rw-body rw-stack" onSubmit={handleSubmit}>
          <div className="rw-grid">
            <label className="rw-field">
              <span>Full name</span>
              <input
                value={data.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </label>

            <label className="rw-field">
              <span>Company</span>
              <input
                value={data.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </label>
          </div>

          <div className="rw-grid">
            <label className="rw-field">
              <span>Email</span>
              <input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </label>

            <label className="rw-field">
              <span>WhatsApp / phone</span>
              <input
                value={data.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
              />
            </label>
          </div>

          <div className="rw-grid">
            <label className="rw-field">
              <span>Project stage</span>
              <select
                value={data.projectStage}
                onChange={(e) => update("projectStage", e.target.value)}
              >
                <option>Idea / early concept</option>
                <option>Planning with requirements</option>
                <option>Ready to start build</option>
                <option>Existing system needs upgrade</option>
              </select>
            </label>

            <label className="rw-field">
              <span>Preferred track</span>
              <select
                value={data.preferredTrack}
                onChange={(e) => update("preferredTrack", e.target.value)}
              >
                <option>Need help deciding</option>
                <option>Software / platform</option>
                <option>Website / portal</option>
                <option>AI / automation</option>
                <option>3D / visualization</option>
              </select>
            </label>
          </div>

          <div className="rw-grid">
            <label className="rw-field">
              <span>Budget range</span>
              <select
                value={data.budgetRange}
                onChange={(e) => update("budgetRange", e.target.value)}
              >
                <option>Not sure yet</option>
                <option>Under $3,000</option>
                <option>$3,000 - $10,000</option>
                <option>$10,000+</option>
              </select>
            </label>

            <label className="rw-field">
              <span>Timeline</span>
              <select
                value={data.timeline}
                onChange={(e) => update("timeline", e.target.value)}
              >
                <option>Flexible</option>
                <option>ASAP</option>
                <option>Within 1 month</option>
                <option>1-3 months</option>
                <option>3+ months</option>
              </select>
            </label>
          </div>

          <label className="rw-field">
            <span>Project summary</span>
            <textarea
              rows={6}
              value={data.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="Describe the business problem, what you think you need, and what outcome you want."
            />
          </label>

          <footer className="rw-footer">
            <div className="rw-footer-right">
              <button
                className="rw-btn rw-btn-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Request Discovery"}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </main>
  );
}
