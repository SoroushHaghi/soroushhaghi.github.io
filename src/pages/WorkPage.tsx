import React, { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { workTimeline, WorkTimelineItem } from "../portfolioContent";

type Filter = "all" | WorkTimelineItem["kind"];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "experience", label: "Experience" },
  { id: "project", label: "Projects" },
  { id: "system", label: "Systems" },
];

function WorkPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(
    () =>
      [...workTimeline]
        .filter((item) => filter === "all" || item.kind === filter)
        .sort((a, b) => b.sort - a.sort),
    [filter]
  );

  return (
    <main className="subpage page-shell work-timeline-page">
      <SectionHeading
        eyebrow="WORK"
        title="Experience and projects, in one technical timeline."
        copy="Professional roles, project work and public systems stay distinct by type, while the chronology shows how the work developed over time."
      />

      <div className="timeline-filter-row" role="toolbar" aria-label="Filter work timeline">
        {filters.map((item) => (
          <button
            key={item.id}
            className={filter === item.id ? "active" : ""}
            onClick={() => setFilter(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="work-timeline">
        {items.map((item) => (
          <article className="timeline-item" key={item.id}>
            <div className="timeline-rail" aria-hidden="true">
              <span className="timeline-dot" />
            </div>

            <div className="timeline-period">
              <span>{item.period}</span>
              <small>{item.kind.toUpperCase()}</small>
            </div>

            <div className="timeline-content">
              <div className="timeline-heading">
                <div>
                  <h2>{item.title}</h2>
                  {item.organization && <p className="timeline-org">{item.organization}</p>}
                </div>
                {item.scope && <span className="timeline-scope">{item.scope}</span>}
              </div>

              <p className="timeline-summary">{item.summary}</p>

              {item.bullets && (
                <ul className="timeline-bullets">
                  {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              )}

              <div className="timeline-tags">
                {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>

              {item.links && (
                <div className="timeline-links">
                  {item.links.map((link) => (
                    <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                      {link.label} <span>↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="work-timeline-note">
        <span>Scope note</span>
        <p>
          Timeline dates use verified role periods where available. For some projects, the public-repository publication date or broad coursework period is shown instead of inventing an unsupported project start date.
        </p>
      </div>
    </main>
  );
}

export default WorkPage;
