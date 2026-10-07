import React from "react";
import { EducationArtifact } from "../portfolioContent";

type Props = {
  artifact: EducationArtifact;
  compact?: boolean;
};

function EducationArtifactPreview({ artifact, compact = false }: Props) {
  if (artifact.image) {
    return (
      <figure className={`education-artifact education-artifact-image${compact ? " compact" : ""}`}>
        <img src={artifact.image} alt={artifact.label} loading="lazy" />
      </figure>
    );
  }

  return (
    <div className={`education-artifact education-artifact-placeholder${compact ? " compact" : ""}`}>
      <div className="education-doc-stack" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="education-artifact-copy">
        <small>DOCUMENT</small>
        <strong>{artifact.label}</strong>
        <span>{artifact.note}</span>
      </div>
    </div>
  );
}

export default EducationArtifactPreview;
