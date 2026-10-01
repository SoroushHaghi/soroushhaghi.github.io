import React, { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { domains, education } from "../siteConfig";

function EducationPage() {
  const [domain, setDomain] = useState("all");
  const filtered = useMemo(
    () => domain === "all" ? education : education.filter((item) => item.domains.includes(domain)),
    [domain]
  );

  return (
    <main className="subpage page-shell">
      <SectionHeading
        eyebrow="EDUCATION"
        title="Academic depth, organized by the same technical map."
        copy="The taxonomy is intentionally configurable; domain labels and groupings can change without restructuring the page."
      />

      <div className="filter-row" role="toolbar" aria-label="Filter education by domain">
        <button className={domain === "all" ? "active" : ""} onClick={() => setDomain("all")}>All</button>
        {domains.map((item) => (
          <button key={item.id} className={domain === item.id ? "active" : ""} onClick={() => setDomain(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="education-page-list">
        {filtered.map((item) => (
          <article className="education-story glass-panel" key={item.id}>
            <div className="education-story-head">
              <div>
                <div className="card-meta">{item.period}</div>
                <h2>{item.degree}</h2>
                <p className="muted">{item.institution}</p>
              </div>
              {"achievement" in item && item.achievement && <div className="achievement">{item.achievement}</div>}
            </div>
            <div className="focus-grid">
              {item.focus.map((focus) => <span key={focus}>{focus}</span>)}
            </div>
            <p className="story-placeholder">
              Long-form academic story, selected evidence, presentations and related work will be composed here in the content pass.
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

export default EducationPage;
