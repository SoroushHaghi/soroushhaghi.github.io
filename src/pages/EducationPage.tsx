import React, { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import EducationArtifactPreview from "../components/EducationArtifactPreview";
import {
  academicWork,
  degreeArtifacts,
  trainingAndCredentials
} from "../portfolioContent";
import { useSiteCopy } from "../content/useSiteCopy";
import { getPortfolioMedia } from "../content/portfolioMedia";

type Filter = "all" | "degree" | "academic" | "credential";

type EducationTimelineItem = {
  id: string;
  kind: "degree" | "academic" | "credential";
  sort: number;
  period: string;
  status?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  tags?: string[];
  artifactLabel: string;
  artifactNote: string;
  mediaKey?: string;
  achievement?: string;
};

const timelineItems: EducationTimelineItem[] = [
  {
    id: "msc-qtec",
    kind: "degree",
    sort: 20261001,
    period: "Oct 2024 — Present",
    status: "IN PROGRESS · 66/120 ECTS",
    title: "M.Sc. Quantum Technologies in Electrical and Computer Engineering",
    subtitle: "Technische Universität Braunschweig",
    artifactLabel: degreeArtifacts.master.label,
    artifactNote: degreeArtifacts.master.note,
    mediaKey: "msc-qtec"
  },

  ...academicWork.map((item, index): EducationTimelineItem => ({
    id: item.id,
    kind: "academic",
    // Exact dates are not yet canonical. Keep them within the Master's period
    // without inventing a specific month/day; pending work appears first.
    sort: item.status.includes("PENDING") ? 20260900 - index : 20250800 - index,
    period: item.status.includes("PENDING") ? "2026 · Current" : "2025–2026",
    status: item.status,
    title: item.title,
    subtitle: item.context,
    summary: item.summary,
    tags: item.tags,
    artifactLabel: item.status.includes("PENDING")
      ? "Presentation in preparation"
      : "Presentation / academic artifact",
    artifactNote: "Approved slide or document image can be added here later.",
    mediaKey: item.id
  })),

  ...trainingAndCredentials.map((item, index): EducationTimelineItem => ({
    id: item.id,
    kind: "credential",
    sort: item.title === "TOEFL iBT"
      ? 20240522
      : Number(item.period) * 10000 + (99 - index),
    period: item.period,
    status: item.status,
    title: item.title,
    subtitle: item.issuer,
    artifactLabel: item.artifact ?? "Credential",
    artifactNote: "Approved credential image can be added here later.",
    mediaKey: item.id
  })),

  {
    id: "bsc-computer-engineering",
    kind: "degree",
    sort: 20240201,
    period: "2018 — Feb 2024",
    status: "COMPLETED",
    title: "B.Sc. Computer Engineering — AI specialization",
    subtitle: "Islamic Azad University, Mashhad Branch",
    achievement: "Ranked 5th of 131 students",
    artifactLabel: degreeArtifacts.bachelor.label,
    artifactNote: degreeArtifacts.bachelor.note,
    mediaKey: "bsc-computer-engineering"
  }
];

function EducationPage() {
  const copy = useSiteCopy();
  const [filter, setFilter] = useState<Filter>("all");
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: copy.educationPage.filters.all },
    { id: "degree", label: copy.educationPage.filters.degree },
    { id: "academic", label: copy.educationPage.filters.academic },
    { id: "credential", label: copy.educationPage.filters.credential },
  ];

  const items = useMemo(
    () =>
      [...timelineItems]
        .filter((item) => filter === "all" || item.kind === filter)
        .sort((a, b) => b.sort - a.sort),
    [filter]
  );

  return (
    <main className="subpage page-shell education-journey-page">
      <SectionHeading
        eyebrow={copy.educationPage.eyebrow}
        title={copy.educationPage.title}
        copy={copy.educationPage.copy}
      />

      <div className="timeline-filter-row" role="toolbar" aria-label="Filter education timeline">
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

      <div className="education-timeline-v3">
        {items.map((item) => (
          <article
            className={`education-timeline-row${item.kind === "degree" ? " education-timeline-row-degree" : ""}`}
            key={item.id}
          >
            <div className="education-timeline-rail" aria-hidden="true">
              <span className="education-timeline-dot" />
            </div>

            <div className="education-timeline-period">
              <span>{item.period}</span>
              <small>{item.kind === "degree" ? "DEGREE" : item.kind === "academic" ? "ACADEMIC WORK" : "CREDENTIAL"}</small>
            </div>

            <div className="education-timeline-content">
              {item.status && <div className="education-timeline-meta">{item.status}</div>}
              <h2>{item.title}</h2>
              {item.subtitle && <p className="education-institution">{item.subtitle}</p>}
              {item.achievement && <div className="education-achievement">{item.achievement}</div>}
              {item.summary && <p className="education-summary">{item.summary}</p>}
              {item.tags && (
                <div className="academic-work-tags">
                  {item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              )}
            </div>

            <div className="education-timeline-artifact-v2">
              <EducationArtifactPreview
                compact={item.kind !== "degree"}
                artifact={{
                  label: item.artifactLabel,
                  note: item.artifactNote
                }}
                media={getPortfolioMedia(item.mediaKey ?? item.id)}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="education-timeline-note">
        <span>{copy.educationPage.timelineRuleLabel}</span>
        <p>
          {copy.educationPage.timelineRuleCopy}
        </p>
      </div>
    </main>
  );
}

export default EducationPage;
