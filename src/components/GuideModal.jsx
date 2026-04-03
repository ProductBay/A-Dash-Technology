import { useEffect } from "react";

export default function GuideModal({ isOpen, onClose, title, description, tips = [] }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="project-modal-header">
          <h2>{title}</h2>
          <button className="project-modal-close" onClick={onClose} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="project-modal-body">
          <p className="project-modal-description">{description}</p>

          {tips.length > 0 && (
            <div className="project-modal-examples">
              <h3>Quick guide:</h3>
              <ul>
                {tips.map((tip) => (
                  <li key={tip}>
                    <span className="example-dot">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="project-modal-footer">
          <button className="project-modal-button" onClick={onClose} type="button">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}