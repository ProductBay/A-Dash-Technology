import { useState } from "react";
import InfoIcon from "../InfoIcon";
import ProjectTypeModal from "../ProjectTypeModal";
import FormGuideLabel from "../FormGuideLabel";
import "../InfoIcon.css";
import "../ProjectTypeModal.css";

const softwareTypes = [
  "Web Application",
  "Mobile App",
  "Internal System",
  "Marketplace / Platform",
  "API / Backend Service",
  "Automation System",
  "Custom CRM / ERP",
];

const userGroups = ["Customers", "Staff", "Admins", "Partners", "Mixed"];
const scales = ["Small (1–500 users)", "Medium (500–10k)", "Large (10k+)", "Not sure yet"];

export default function Step2SoftwareType({ data, update }) {
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          text="Software Type"
          title="Software Type"
          description="Select the software model you want. Each card has its own info icon with a precise definition."
          tips={[
            "Choose the option that best matches your intended user experience.",
            "If you need a hybrid system, pick the core type and note the rest later.",
          ]}
        />
        <div className="rw-chipgrid">
          {softwareTypes.map((t) => (
            <div key={t} className={`rw-typecard ${data.softwareType === t ? "active" : ""}`}>
              <button
                type="button"
                className="rw-typecard-main"
                onClick={() => update({ softwareType: t })}
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

      <div className="rw-grid">
        <div className="rw-field">
          <FormGuideLabel
            text="Primary users"
            title="Primary Users"
            description="Tell us who will use the system most so we can optimize workflows, permissions, and UX."
            tips={[
              "Choose the dominant daily user group.",
              "Use Mixed if multiple groups share core workflows.",
            ]}
          />
          <select value={data.users} onChange={(e) => update({ users: e.target.value })}>
            {userGroups.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>

        <div className="rw-field">
          <FormGuideLabel
            text="Expected scale"
            title="Expected Scale"
            description="This helps us plan architecture, performance targets, and infrastructure sizing early."
            tips={[
              "Estimate active users over 12 months.",
              "Pick Not sure yet if adoption is still being validated.",
            ]}
          />
          <select value={data.scale} onChange={(e) => update({ scale: e.target.value })}>
            {scales.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="rw-field">
        <FormGuideLabel
          text="Problem statement *"
          title="Problem Statement"
          description="Describe the business problem clearly so we can propose the right scope, architecture, and delivery phases."
          tips={[
            "State the current pain point.",
            "Describe desired outcome and measurable success.",
          ]}
        />
        <textarea
          rows={5}
          value={data.problemStatement}
          onChange={(e) => update({ problemStatement: e.target.value })}
          placeholder="Describe what you want to build, the problem it solves, and how success looks."
        />
      </div>
    </div>
  );
}
