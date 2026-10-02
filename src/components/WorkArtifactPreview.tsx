import React, { useState } from "react";
import { WorkArtifact } from "../portfolioContent";

type Props = {
  artifact?: WorkArtifact;
  title: string;
};

function WorkArtifactPreview({ artifact, title }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!artifact) {
    return (
      <div className="work-artifact work-artifact-empty" aria-hidden="true">
        <span>NO PUBLIC ARTIFACT</span>
      </div>
    );
  }

  if (artifact.kind === "gif" && artifact.image) {
    return (
      <a
        className="work-artifact work-artifact-gif"
        href={artifact.href}
        target="_blank"
        rel="noreferrer"
        aria-label={artifact.label}
      >
        <img src={artifact.image} alt={artifact.label} loading="lazy" />
        <span className="artifact-chip">DEMO GIF</span>
      </a>
    );
  }

  if (artifact.kind === "live" && artifact.href) {
    return (
      <div className="work-artifact work-artifact-live">
        {loaded ? (
          <>
            <iframe
              src={artifact.href}
              title={artifact.label}
              loading="lazy"
              allow="clipboard-read; clipboard-write"
            />
            <a className="artifact-open-link" href={artifact.href.replace("?embed=true", "")} target="_blank" rel="noreferrer">
              Open full demo ↗
            </a>
          </>
        ) : (
          <button type="button" className="artifact-load" onClick={() => setLoaded(true)}>
            <span className="artifact-live-dot" />
            <strong>{artifact.label}</strong>
            <small>{artifact.note ?? "Load live preview"}</small>
            <span className="artifact-load-action">LOAD DEMO</span>
          </button>
        )}
      </div>
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
        <span className="artifact-repo-link">Open GitHub ↗</span>
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
