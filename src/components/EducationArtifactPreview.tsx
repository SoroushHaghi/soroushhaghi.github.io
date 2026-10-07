import React from "react";
import { EducationArtifact } from "../portfolioContent";
import { PortfolioMedia } from "../content/portfolioMedia";

type Props = {
  artifact: EducationArtifact;
  compact?: boolean;
  media?: PortfolioMedia;
};

function EducationArtifactPreview({ artifact, compact = false, media }: Props) {
  const image = media?.src ?? artifact.image;

  if (image) {
    const visual = (
      <figure className={`education-artifact education-artifact-image${compact ? " compact" : ""}`}>
        <img
          src={image}
          alt={media?.alt ?? artifact.label}
          loading="lazy"
          decoding="async"
          style={{
            objectFit: media?.fit ?? "cover",
            objectPosition: media?.position ?? "center",
          }}
        />
      </figure>
    );

    return media?.href ? (
      <a
        className="education-artifact-link"
        href={media.href}
        target="_blank"
        rel="noreferrer"
        aria-label={media.alt}
      >
        {visual}
      </a>
    ) : visual;
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
