import React, { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import WorkArtifactPreview from "../components/WorkArtifactPreview";
import { workTimeline, WorkTimelineItem } from "../portfolioContent";
import { useSiteCopy } from "../content/useSiteCopy";
import { getPortfolioMedia } from "../content/portfolioMedia";

type Filter = "all" | WorkTimelineItem["kind"];

function WorkPage() {
  const copy = useSiteCopy();
  const [filter, setFilter] = useState<Filter>("all");
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: copy.workPage.filters.all },
    { id: "experience", label: copy.workPage.filters.experience },
    { id: "project", label: copy.workPage.filters.project },
    { id: "co-op", label: copy.workPage.filters["co-op"] },
  ];

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
        eyebrow={copy.workPage.eyebrow}
        title={copy.workPage.title}
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
                  <summary>{copy.workPage.details}</summary>
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
              <WorkArtifactPreview artifact={item.artifact} title={item.title} tags={item.tags} media={getPortfolioMedia(item.id)} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default WorkPage;
