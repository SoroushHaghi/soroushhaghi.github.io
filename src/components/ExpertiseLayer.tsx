import React from "react";
import { domains } from "../siteConfig";

function ExpertiseLayer() {
  return (
    <div className="expertise-map" aria-label="Expertise layer placeholder">
      <div className="expertise-plane plane-work">
        <span>WORK</span>
      </div>
      <div className="expertise-plane plane-education">
        <span>EDUCATION</span>
      </div>
      <div className="expertise-core">
        <strong>Integrated technical profile</strong>
        <small>Work × Education</small>
      </div>
      <div className="expertise-tags">
        {domains.slice(0, 6).map((domain) => (
          <span key={domain.id}>{domain.label}</span>
        ))}
      </div>
    </div>
  );
}

export default ExpertiseLayer;
