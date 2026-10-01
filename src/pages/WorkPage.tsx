import React, { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { domains, workItems } from "../siteConfig";

function WorkPage() {
  const [domain, setDomain] = useState("all");

  const filtered = useMemo(
    () => domain === "all" ? workItems : workItems.filter((item) => item.domains.includes(domain)),
    [domain]
  );

  return (
    <main className="subpage page-shell">
      <SectionHeading
        eyebrow="WORK"
        title="Explore by technical domain."
        copy="Projects, systems, experience and academic work share one configurable domain model. Item type stays secondary."
      />

      <div className="filter-row" role="toolbar" aria-label="Filter work by domain">
        <button className={domain === "all" ? "active" : ""} onClick={() => setDomain("all")}>All</button>
        {domains.map((item) => (
          <button
            key={item.id}
            className={domain === item.id ? "active" : ""}
            onClick={() => setDomain(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="work-page-grid">
        {filtered.map((item) => (
          <article className="work-list-card glass-panel" key={item.id}>
            <div className="card-meta">{item.type.toUpperCase()}</div>
            <h2>{item.title}</h2>
            <p>{item.subtitle}</p>
            <div className="domain-tags">
              {item.domains.map((domainId) => (
                <span key={domainId}>{domains.find((entry) => entry.id === domainId)?.label ?? domainId}</span>
              ))}
            </div>
            <span className="text-link">Case study structure →</span>
          </article>
        ))}
      </div>
    </main>
  );
}

export default WorkPage;
