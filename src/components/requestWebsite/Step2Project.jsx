import { useState } from "react";
import InfoIcon from "../InfoIcon";
import ProjectTypeModal from "../ProjectTypeModal";
import FormGuideLabel from "../FormGuideLabel";
import "../InfoIcon.css";
import "../ProjectTypeModal.css";

const projectTypes = [
  "Business Website",
  "E-commerce",
  "Web Application",
  "Landing Page",
  "Portfolio",
  "Custom Platform",
];

const goals = [
  "Generate leads",
  "Sell products",
  "Accept bookings",
  "Showcase brand",
  "Internal system",
];

export default function Step2Project({ data, update }) {
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = (key, value) => {
    const arr = data[key] || [];
    if (arr.includes(value)) update({ [key]: arr.filter((x) => x !== value) });
    else update({ [key]: [...arr, value] });
  };

  const handleInfoClick = (type) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="rw-stack">
      <ProjectTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectType={selectedType}
      />

      <div className="rw-field">
        <FormGuideLabel
          text="Project Type"
          title="Project Type"
          description="Choose the product format you need most. Use the info icon on each card for a clear definition."
          tips={[
            "Pick the closest type to your main outcome.",
            "If unsure, choose the best fit and explain details later.",
          ]}
        />
        <div className="rw-chipgrid">
          {projectTypes.map((t) => (
            <div key={t} className={`rw-typecard ${data.projectType === t ? "active" : ""}`}>
              <button
                type="button"
                className="rw-typecard-main"
                onClick={() => update({ projectType: t })}
              >
                {t}
              </button>
              <InfoIcon
                onClick={() => handleInfoClick(t)}
                title={`Learn about ${t}`}
                ariaLabel={`Learn about ${t}`}
                className="info-icon-card"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Primary Goal (select all that apply)"
          title="Primary Goals"
          description="Tell us the outcomes this project must deliver so we can shape features and launch strategy correctly."
          tips={[
            "You can select multiple goals.",
            "Prioritize goals tied to revenue, operations, or customer experience.",
          ]}
        />
        <div className="rw-chipgrid">
          {goals.map((g) => (
            <button
              key={g}
              type="button"
              className={`rw-chip ${data.goals.includes(g) ? "active" : ""}`}
              onClick={() => toggle("goals", g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="rw-grid">
        <div className="rw-field">
          <FormGuideLabel
            text="Do you already have a website?"
            title="Existing Website Status"
            description="This helps us decide whether to rebuild, redesign, or migrate your current setup."
            tips={[
              "Choose Yes if you already have a live or staging website.",
              "Choose No if this is a brand-new build.",
            ]}
          />
          <select value={data.hasWebsite} onChange={(e) => update({ hasWebsite: e.target.value })}>
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        <div className="rw-field">
          <FormGuideLabel
            text={`Existing Website URL ${data.hasWebsite === "Yes" ? "*" : ""}`}
            title="Website URL"
            description="Share your current site link so we can review structure, performance, and improvement opportunities."
            tips={[
              "Paste the full domain like yourdomain.com.",
              "Only required when you selected Yes above.",
            ]}
          />
          <input
            value={data.websiteUrl}
            onChange={(e) => update({ websiteUrl: e.target.value })}
            placeholder="example.com"
            disabled={data.hasWebsite !== "Yes"}
          />
        </div>
      </div>
    </div>
  );
}
