import { useState } from "react";
import { supabase } from "../../lib/supabase";
import FormGuideLabel from "../../components/FormGuideLabel";
import { insertServiceRequest } from "../../lib/serviceRequests";
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

    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      const { error } = await insertServiceRequest(
        supabase,
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
        session?.user?.id
      );

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
            <div className="rw-field">
              <FormGuideLabel
                text="Full name"
                title="Full Name"
                description="Enter the name of the main person we should coordinate with."
                tips={["Use the decision-maker or project lead.", "Make sure spelling is accurate."]}
              />
              <input
                value={data.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
            </div>

            <div className="rw-field">
              <FormGuideLabel
                text="Company"
                title="Company"
                description="Share your company or brand name if applicable."
                tips={["Optional for personal projects.", "Use your public-facing brand name."]}
              />
              <input
                value={data.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>
          </div>

          <div className="rw-grid">
            <div className="rw-field">
              <FormGuideLabel
                text="Email"
                title="Email"
                description="Provide the best inbox for updates and follow-up questions."
                tips={["Use an email checked daily.", "Team inbox is fine if shared."]}
              />
              <input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div className="rw-field">
              <FormGuideLabel
                text="WhatsApp / phone"
                title="WhatsApp or Phone"
                description="Share your quickest contact method for clarifications."
                tips={["Include country code.", "WhatsApp number is preferred."]}
              />
              <input
                value={data.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
              />
            </div>
          </div>

          <div className="rw-grid">
            <div className="rw-field">
              <FormGuideLabel
                text="Project stage"
                title="Project Stage"
                description="Tell us how mature your project is so we can recommend the right starting approach."
                tips={["Choose the closest current state.", "If in-between, select the earlier stage."]}
              />
              <select
                value={data.projectStage}
                onChange={(e) => update("projectStage", e.target.value)}
              >
                <option>Idea / early concept</option>
                <option>Planning with requirements</option>
                <option>Ready to start build</option>
                <option>Existing system needs upgrade</option>
              </select>
            </div>

            <div className="rw-field">
              <FormGuideLabel
                text="Preferred track"
                title="Preferred Track"
                description="Pick the direction you think fits best, or choose help deciding if you want guidance first."
                tips={["This is not permanent and can be adjusted later.", "Choose help deciding if uncertain."]}
              />
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
            </div>
          </div>

          <div className="rw-grid">
            <div className="rw-field">
              <FormGuideLabel
                text="Budget range"
                title="Budget Range"
                description="Budget helps us shape scope and phase planning realistically."
                tips={["Pick your comfortable investment range.", "You can refine this during discovery calls."]}
              />
              <select
                value={data.budgetRange}
                onChange={(e) => update("budgetRange", e.target.value)}
              >
                <option>Not sure yet</option>
                <option>Under J$350,000</option>
                <option>J$350,000 - J$1,500,000</option>
                <option>J$1,500,000+</option>
              </select>
            </div>

            <div className="rw-field">
              <FormGuideLabel
                text="Timeline"
                title="Timeline"
                description="Target timeline helps prioritize urgency and delivery sequencing."
                tips={["Choose ASAP only for urgent launch targets.", "Flexible gives better planning options."]}
              />
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
            </div>
          </div>

          <div className="rw-field">
            <FormGuideLabel
              text="Project summary"
              title="Project Summary"
              description="Describe your challenge and desired outcome in plain language so we can guide the right next step."
              tips={[
                "Explain current problem, desired result, and who benefits.",
                "Include any constraints, deadlines, or must-have outcomes.",
              ]}
            />
            <textarea
              rows={6}
              value={data.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="Describe the business problem, what you think you need, and what outcome you want."
            />
          </div>

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
