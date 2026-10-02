import React from "react";
import { domains, education, workItems } from "../siteConfig";

function ExpertiseLayer() {
  return (
    <div className="expertise-index" aria-label="Technical domain index">
      {domains.map((domain) => {
        const inWork = workItems.some((item) => item.domains.includes(domain.id));
        const inEducation = education.some((item) => item.domains.includes(domain.id));
        const source = inWork && inEducation ? "WORK + EDUCATION" : inWork ? "WORK" : "EDUCATION";

        return (
          <article className="expertise-domain" key={domain.id}>
            <span className="expertise-domain-source">{source}</span>
            <strong>{domain.label}</strong>
            <span className="expertise-domain-line" aria-hidden="true" />
          </article>
        );
      })}
    </div>
  );
}

export default ExpertiseLayer;
