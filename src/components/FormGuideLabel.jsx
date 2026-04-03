import { useState } from "react";
import InfoIcon from "./InfoIcon";
import GuideModal from "./GuideModal";
import "./InfoIcon.css";
import "./ProjectTypeModal.css";

export default function FormGuideLabel({
  text,
  title,
  description,
  tips = [],
  iconClassName = "",
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <label className="rw-label-with-help">
        <span>{text}</span>
        <InfoIcon
          onClick={() => setOpen(true)}
          title={`Open help for ${title}`}
          ariaLabel={`Help: ${title}`}
          className={iconClassName}
        />
      </label>

      <GuideModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        tips={tips}
      />
    </>
  );
}