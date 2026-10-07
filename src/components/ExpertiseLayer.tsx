import React from "react";
import { domains } from "../siteConfig";
import { expertiseViews } from "../expertise/expertiseData";
import ExpertiseSphere from "./ExpertiseSphere";

const domainSphereCapabilities: Record<string, readonly string[]> = {
  quantum: expertiseViews.quantum,
  communication: expertiseViews.communication,
  photonics: expertiseViews.photonics,
  "ai-perception": expertiseViews["ai-perception"],
  "devices-sensing": expertiseViews["devices-sensing"],
  "software-systems": expertiseViews["software-systems"],
};

function ExpertiseLayer() {
  return (
    <div className="expertise-index" aria-label="Technical domain index">
      {domains.map((domain) => (
        <article className="expertise-domain expertise-domain--with-sphere" key={domain.id}>
          <strong>{domain.label}</strong>
          <ExpertiseSphere
            compact
            capabilityIds={domainSphereCapabilities[domain.id]}
            ariaLabel={`${domain.label} knowledge and experience state`}
          />
          <span className="expertise-domain-line" aria-hidden="true" />
        </article>
      ))}
    </div>
  );
}

export default ExpertiseLayer;
