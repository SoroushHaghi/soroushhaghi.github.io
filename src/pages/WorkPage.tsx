import React, { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import WorkArtifactPreview from "../components/WorkArtifactPreview";
import { workTimeline, WorkTimelineItem } from "../portfolioContent";

type Filter = "all" | WorkTimelineItem["kind"];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "experience", label: "Experience" },
  { id: "project", label: "Projects" },
  { id: "co-op", label: "Co-op" },
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
        title="Experience and projects over time."
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
          <article className="timeline-item timeline-item-visual" key={item.id}>
            <div className="timeline-rail" aria-hidden="true">
              <span className="timeline-dot" />
            </div>

            <div className="timeline-period">
              <span>{item.period}</span>
              <small>{item.kind.toUpperCase()}</small>
            </div>

            <div className="timeline-content timeline-content-compact">
              <div className="timeline-heading">
                <div>
                  <h2>{item.title}</h2>
                  {item.organization && <p className="timeline-org">{item.organization}</p>}
                </div>
              </div>

              <p className="timeline-summary">{item.summary}</p>

              <div className="timeline-tags">
                {item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
              </div>

              {(item.bullets || item.scope || item.links) && (
                <details className="timeline-details">
                  <summary>Details</summary>
                  <div className="timeline-details-body">
                    {item.bullets && (
                      <ul className="timeline-bullets">
                        {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    )}
                    {item.scope && <p className="timeline-scope-note">{item.scope}</p>}
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
                </details>
              )}
            </div>

            <div className="timeline-artifact-column">
              <WorkArtifactPreview artifact={item.artifact} title={item.title} tags={item.tags} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default WorkPage;
