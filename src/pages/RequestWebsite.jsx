import { useMemo, useState } from "react";
import "../styles/request-website.css";
import { supabase } from "../lib/supabase";
import { insertServiceRequest } from "../lib/serviceRequests";

import Step1Client from "../components/requestWebsite/Step1Client";
import Step2Project from "../components/requestWebsite/Step2Project";
import Step3Features from "../components/requestWebsite/Step3Features";
import Step4Design from "../components/requestWebsite/Step4Design";
import Step5Timeline from "../components/requestWebsite/Step5Timeline";
import Step6Review from "../components/requestWebsite/Step6Review";

const TOTAL_STEPS = 6;

const initialData = {
  fullName: "",
  brandName: "",
  email: "",
  whatsapp: "",
  region: "Jamaica",
  clientType: "Startup",
  projectType: "Business Website",
  goals: [],
  hasWebsite: "No",
  websiteUrl: "",
  features: [],
  customFeatures: "",
  brandAssets: [],
  stylePreference: "Futuristic / Tech",
  referenceLinks: "",
  timeline: "2-4 weeks",
  budget: "J$180,000 - J$350,000",
  phased: "Yes",
  referralSource: "",
  notes: "",
  agree: false,
};

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());
}

function normalizeUrl(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function RequestWebsite() {
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
      if (data.hasWebsite === "Yes" && !data.websiteUrl.trim()) {
        return "Please provide your existing website URL (or select No).";
      }
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

    const payload = {
      ...data,
      websiteUrl: normalizeUrl(data.websiteUrl),
    };

    try {
      const { error } = await insertServiceRequest(
        supabase,
        {
          service_type: "website",
          full_name: data.fullName,
          company: data.brandName || null,
          email: data.email,
          whatsapp: data.whatsapp,
          region: data.region,
          client_type: data.clientType,
          payload,
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
      title: "Project Type & Goal",
      subtitle: "What are we building - and why?",
      node: <Step2Project data={data} update={update} />,
    },
    {
      title: "Features & Functionality",
      subtitle: "What should the website do?",
      node: <Step3Features data={data} update={update} />,
    },
    {
      title: "Design & Branding",
      subtitle: "How should it look and feel?",
      node: <Step4Design data={data} update={update} />,
    },
    {
      title: "Timeline & Budget",
      subtitle: "Let's align on expectations.",
      node: <Step5Timeline data={data} update={update} />,
    },
    {
      title: "Review & Submit",
      subtitle: "Confirm details and request a build.",
      node: <Step6Review data={data} update={update} />,
    },
  ];

  if (submitted) {
    return (
      <main className="rw-shell">
        <div className="rw-bg" />
        <section className="rw-card rw-success">
          <div className="rw-badge">Request Received</div>
          <h1 className="rw-title">Welcome to the A&apos;Dash pipeline.</h1>
          <p className="rw-subtitle">
            We&apos;ll review your request and contact you within <strong>24-48 hours</strong> with a scope summary,
            timeline, and proposal.
          </p>

          <div className="rw-success-grid">
            <div className="rw-mini">
              <div className="rw-mini-k">Next</div>
              <div className="rw-mini-v">Scope Confirmation</div>
            </div>
            <div className="rw-mini">
              <div className="rw-mini-k">Then</div>
              <div className="rw-mini-v">Timeline + Proposal</div>
            </div>
            <div className="rw-mini">
              <div className="rw-mini-k">After</div>
              <div className="rw-mini-v">Build Kickoff</div>
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
            Submit Another Request
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
            <div className="rw-badge">A&apos;Dash • Website Build Request</div>
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
                {submitting ? "Submitting..." : "Request Website Build"}
              </button>
            )}
          </div>
        </footer>
      </section>
    </main>
  );
}
