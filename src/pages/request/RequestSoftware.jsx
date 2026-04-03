import { useMemo, useState } from "react";
import "../../styles/request-website.css";
import { supabase } from "../../lib/supabase";
import { insertServiceRequest } from "../../lib/serviceRequests";

import Step1Client from "../../components/requestsoftware/Step1Client";
import Step2SoftwareType from "../../components/requestsoftware/Step2SoftwareType";
import Step3Requirements from "../../components/requestsoftware/Step3Requirements";
import Step4TechData from "../../components/requestsoftware/Step4TechData";
import Step5TimelineBudget from "../../components/requestsoftware/Step5TimelineBudget";
import Step6Review from "../../components/requestsoftware/Step6Review";

const TOTAL_STEPS = 6;

const initialData = {
  serviceType: "Software",
  fullName: "",
  company: "",
  email: "",
  whatsapp: "",
  region: "Jamaica",
  clientType: "Startup",
  softwareType: "Web Application",
  users: "Customers",
  scale: "Small (1-500 users)",
  problemStatement: "",
  coreFeatures: [],
  roles: [],
  workflows: "",
  mustHave: "",
  niceToHave: "",
  hasDesign: "No",
  hasApi: "No",
  integrations: [],
  dataSources: "",
  securityNeeds: [],
  preferredStack: "",
  timeline: "1-2 months",
  budget: "J$1,200,000 - J$2,500,000",
  phased: "Yes",
  maintenance: "Yes",
  referralSource: "",
  notes: "",
  agree: false,
};

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());
}

export default function RequestSoftware() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);
  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const validateStep = (s = step) => {
    if (s === 1) {
      if (!data.fullName.trim()) return "Full name is required.";
      if (!isValidEmail(data.email)) return "Please enter a valid email address.";
      if (!data.whatsapp.trim()) return "WhatsApp/Phone is required.";
      return null;
    }

    if (s === 2) {
      if (!data.problemStatement.trim()) {
        return "Please describe what you're trying to build (problem statement).";
      }
      return null;
    }

    if (s === 3) {
      if (!data.coreFeatures.length) return "Select at least one core feature.";
      return null;
    }

    if (s === 6) {
      if (!data.agree) return "You must agree before submitting.";
      return null;
    }

    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) return alert(err);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    const err = validateStep(6);
    if (err) return alert(err);

    setSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      const { error } = await insertServiceRequest(
        supabase,
        {
          service_type: "software",
          full_name: data.fullName,
          company: data.company || null,
          email: data.email,
          whatsapp: data.whatsapp,
          region: data.region,
          client_type: data.clientType,
          payload: data,
        },
        session?.user?.id
      );

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      await new Promise((r) => setTimeout(r, 700));
      setSubmitted(true);
    } catch (e) {
      console.error("Submission failed:", e);
      alert("Something went wrong while submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Client Identity",
      subtitle: "Who are you and how do we reach you?",
      node: <Step1Client data={data} update={update} />,
    },
    {
      title: "What are we building?",
      subtitle: "Define the system type, users, and the core problem.",
      node: <Step2SoftwareType data={data} update={update} />,
    },
    {
      title: "Core Requirements",
      subtitle: "Select features, roles, and workflows.",
      node: <Step3Requirements data={data} update={update} />,
    },
    {
      title: "Tech, Data & Integrations",
      subtitle: "APIs, security, integrations, and your preferred stack.",
      node: <Step4TechData data={data} update={update} />,
    },
    {
      title: "Timeline & Budget",
      subtitle: "Let's align expectations.",
      node: <Step5TimelineBudget data={data} update={update} />,
    },
    {
      title: "Review & Submit",
      subtitle: "Confirm details and request software development.",
      node: <Step6Review data={data} update={update} />,
    },
  ];

  if (submitted) {
    return (
      <main className="rw-shell">
        <div className="rw-bg" />
        <section className="rw-card rw-success">
          <div className="rw-badge">Software Request Received</div>
          <h1 className="rw-title">You're officially in the build pipeline.</h1>
          <p className="rw-subtitle">
            We&apos;ll review your request and contact you within <strong>24-48 hours</strong> with a scope summary,
            timeline, and proposal.
          </p>

          <div className="rw-success-grid">
            <div className="rw-mini">
              <div className="rw-mini-k">Next</div>
              <div className="rw-mini-v">Technical Scoping</div>
            </div>
            <div className="rw-mini">
              <div className="rw-mini-k">Then</div>
              <div className="rw-mini-v">Architecture + Quote</div>
            </div>
            <div className="rw-mini">
              <div className="rw-mini-k">After</div>
              <div className="rw-mini-v">Sprint Kickoff</div>
            </div>
          </div>

          <button
            className="rw-btn rw-btn-primary"
            onClick={() => {
              setData(initialData);
              setStep(1);
              setSubmitted(false);
            }}
          >
            Submit Another Software Request
          </button>
        </section>
      </main>
    );
  }

  const current = steps[step - 1];

  return (
    <main className="rw-shell">
      <div className="rw-bg" />
      <section className="rw-card">
        <header className="rw-header">
          <div>
            <div className="rw-badge">A&apos;Dash • Software Engineering Request</div>
            <h1 className="rw-title">{current.title}</h1>
            <p className="rw-subtitle">{current.subtitle}</p>
          </div>

          <div className="rw-progress">
            <div className="rw-progress-top">
              <span>Step {step} of {TOTAL_STEPS}</span>
              <span>{progress}%</span>
            </div>
            <div className="rw-progress-bar">
              <div className="rw-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        <div className="rw-body">{current.node}</div>

        <footer className="rw-footer">
          <button className="rw-btn" onClick={back} disabled={step === 1 || submitting}>
            Back
          </button>

          <div className="rw-footer-right">
            {step < TOTAL_STEPS ? (
              <button className="rw-btn rw-btn-primary" onClick={next} disabled={submitting}>
                Next
              </button>
            ) : (
              <button className="rw-btn rw-btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Request Software Build"}
              </button>
            )}
          </div>
        </footer>
      </section>
    </main>
  );
}
