import React from "react";
import CareerStateQubit from "./CareerStateQubit";
import { domains } from "../siteConfig";
import {
  ExpertiseViewKey,
  getExpertiseView,
} from "../expertise/expertiseData";

const domainOrder = [
  "quantum",
  "ai-perception",
  "photonics",
  "devices-sensing",
  "communication",
  "software-systems",
] as const;

const orderedDomains = domainOrder
  .map((id) => domains.find((domain) => domain.id === id))
  .filter((domain): domain is (typeof domains)[number] => Boolean(domain));

function ExpertiseLayer() {
  return (
    <div className="expertise-index expertise-index--qubit-grid" aria-label="Technical domain index">
      {orderedDomains.map((domain) => (
        <article className="expertise-domain expertise-domain--with-qubit" key={domain.id}>
          <strong>{domain.label}</strong>
          <div className="expertise-domain-qubit">
            <CareerStateQubit
              data={getExpertiseView(domain.id as ExpertiseViewKey)}
              ariaLabel={`${domain.label} career-state Qubit`}
            />
          </div>
          <span className="expertise-domain-line" aria-hidden="true" />
        </article>
      ))}
    </div>
  );
}

export default ExpertiseLayer;
