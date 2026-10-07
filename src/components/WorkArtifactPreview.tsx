import React from "react";
import { WorkArtifact } from "../portfolioContent";
import { PortfolioMedia } from "../content/portfolioMedia";

type Props = {
  artifact?: WorkArtifact;
  title: string;
  tags?: string[];
  media?: PortfolioMedia;
};

function WorkArtifactPreview({ artifact, title, tags = [], media }: Props) {
  const primaryHref = artifact?.href?.replace("?embed=true", "");
  const resolvedMedia: PortfolioMedia | undefined = media ?? (
    artifact?.image
      ? {
          src: artifact.image,
          alt: `${title} project preview`,
          href: primaryHref,
          label: artifact.label,
        }
      : undefined
  );

  if (resolvedMedia) {
    const preview = (
      <>
        <img
          src={resolvedMedia.src}
          alt={resolvedMedia.alt}
          loading="lazy"
          decoding="async"
          style={{
            objectFit: resolvedMedia.fit ?? "cover",
            objectPosition: resolvedMedia.position ?? "center",
          }}
        />
        <span className="artifact-chip">{resolvedMedia.label ?? artifact?.label ?? "PROJECT"}</span>
      </>
    );

    if (resolvedMedia.href ?? primaryHref) {
      return (
        <a
          className="work-artifact work-artifact-media"
          href={resolvedMedia.href ?? primaryHref}
          target="_blank"
          rel="noreferrer"
          aria-label={artifact?.label ?? resolvedMedia.alt}
        >
          {preview}
        </a>
      );
    }

    return <div className="work-artifact work-artifact-media">{preview}</div>;
  }

  if (!artifact) {
    return (
      <div className="work-artifact work-artifact-empty" aria-hidden="true">
        <span>NO PUBLIC ARTIFACT</span>
      </div>
    );
  }

  if (artifact.kind === "live") {
    return (
      <a
        className="work-artifact work-artifact-poster work-artifact-poster-live"
        href={primaryHref}
        target="_blank"
        rel="noreferrer"
        aria-label={artifact.label}
      >
        <div className="artifact-poster-top">
          <span className="artifact-live-dot" />
          <span>LIVE DEMO AVAILABLE</span>
        </div>
        <div className="artifact-poster-window" aria-hidden="true">
          <div className="artifact-poster-bar"><i /><i /><i /></div>
          <div className="artifact-poster-grid">
            <span /><span /><span /><span />
          </div>
        </div>
        <div className="artifact-poster-copy">
          <strong>{title}</strong>
          <span>{tags.slice(0, 2).join(" · ")}</span>
        </div>
        <span className="artifact-poster-action">OPEN DEMO ↗</span>
      </a>
    );
  }

  if (artifact.kind === "gif") {
    return (
      <a
        className="work-artifact work-artifact-poster work-artifact-poster-gif"
        href={artifact.href}
        target="_blank"
        rel="noreferrer"
        aria-label={artifact.label}
      >
        <div className="artifact-poster-top">
          <span className="artifact-play">▶</span>
          <span>DEMO AVAILABLE</span>
        </div>
        <div className="artifact-poster-motion" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className="artifact-poster-copy">
          <strong>{title}</strong>
          <span>{tags.slice(0, 2).join(" · ")}</span>
        </div>
        <span className="artifact-poster-action">OPEN DEMO ↗</span>
      </a>
    );
  }

  if (artifact.kind === "repo") {
    return (
      <a
        className="work-artifact work-artifact-repo"
        href={artifact.href}
        target="_blank"
        rel="noreferrer"
        aria-label={artifact.label}
      >
        <div className="artifact-repo-top">
          <span className="artifact-repo-mark">GH</span>
          <span>PUBLIC REPOSITORY</span>
        </div>
        <strong>{artifact.repo ?? title}</strong>
        <span className="artifact-repo-meta">{tags.slice(0, 2).join(" · ")}</span>
        <span className="artifact-repo-link">OPEN GITHUB ↗</span>
      </a>
    );
  }

  return (
    <div className="work-artifact work-artifact-evidence">
      <span className="artifact-doc-icon" aria-hidden="true">▤</span>
      <div>
        <small>EVIDENCE</small>
        <strong>{artifact.label}</strong>
        <span>{artifact.note ?? "Evidence on file"}</span>
      </div>
    </div>
  );
}

export default WorkArtifactPreview;
