import React from "react";

type Props = {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: { label: string; href: string };
  onNavigate?: (path: string) => void;
};

function SectionHeading({ eyebrow, title, copy, action, onNavigate }: Props) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action && (
        <a
          className="text-link"
          href={action.href}
          onClick={(event) => {
            if (onNavigate && action.href.startsWith("/")) {
              event.preventDefault();
              onNavigate(action.href);
            }
          }}
        >
          {action.label} <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}

export default SectionHeading;
