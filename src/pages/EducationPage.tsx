import React, { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import EducationArtifactPreview from "../components/EducationArtifactPreview";
import {
  academicWork,
  degreeArtifacts,
  masterCourseAreas,
  trainingAndCredentials
} from "../portfolioContent";

type Filter = "all" | "degree" | "academic" | "credential";

type EducationTimelineItem =
  | {
      id: string;
      kind: "degree";
      era: "master" | "bachelor";
      period: string;
      status: string;
      title: string;
      institution: string;
      focus: string[];
      achievement?: string;
    }
  | {
      id: string;
      kind: "academic";
      era: "master";
      period: string;
      status: string;
      title: string;
      context: string;
      summary: string;
      tags: string[];
    }
  | {
      id: string;
      kind: "credential";
      era: "master" | "bachelor";
      period: string;
      status: string;
      title: string;
      issuer: string;
      artifact: string;
    };

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "degree", label: "Degrees" },
  { id: "academic", label: "Academic Work" },
  { id: "credential", label: "Credentials" }
];

const masterItems: EducationTimelineItem[] = [
  {
    id: "msc-qtec",
    kind: "degree",
    era: "master",
    period: "Oct 2024 — Present",
    status: "IN PROGRESS · 66/120 ECTS",
    title: "M.Sc. Quantum Technologies in Electrical and Computer Engineering",
    institution: "Technische Universität Braunschweig",
    focus: [
      "Quantum Information & Computing",
      "Communication & Information",
      "Photonics, Devices & Fields"
    ]
  },
  ...academicWork.map((item): EducationTimelineItem => ({
    id: item.id,
    kind: "academic",
    era: "master",
    period: item.status.includes("PENDING") ? "M.Sc. · Current" : "M.Sc. academic work",
    status: item.status,
    title: item.title,
    context: item.context,
    summary: item.summary,
    tags: item.tags
  })),
  ...trainingAndCredentials
    .filter((item) => Number(item.period) >= 2024)
    .map((item): EducationTimelineItem => ({
      id: item.period + item.title,
      kind: "credential",
      era: "master",
      period: item.period,
      status: item.status,
      title: item.title,
      issuer: item.issuer,
      artifact: item.artifact ?? "Credential"
    }))
];

const bachelorItems: EducationTimelineItem[] = [
  {
    id: "bsc-computer-engineering",
    kind: "degree",
    era: "bachelor",
    period: "2018 — Feb 2024",
    status: "COMPLETED",
    title: "B.Sc. Computer Engineering — AI specialization",
    institution: "Islamic Azad University, Mashhad Branch",
    achievement: "Ranked 5th of 131 students",
    focus: [
      "Software & Algorithms",
      "AI & Computer Vision",
      "Embedded Systems & Hardware",
      "Databases & Information Systems"
    ]
  },
  ...trainingAndCredentials
    .filter((item) => Number(item.period) < 2024)
    .map((item): EducationTimelineItem => ({
      id: item.period + item.title,
      kind: "credential",
      era: "bachelor",
      period: item.period,
      status: item.status,
      title: item.title,
      issuer: item.issuer,
      artifact: item.artifact ?? "Credential"
    }))
];

function EducationPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const eras = useMemo(() => {
    const include = (item: EducationTimelineItem) => filter === "all" || item.kind === filter;

    return [
      {
        id: "master",
        label: "MASTER'S ERA",
        items: masterItems.filter(include)
      },
      {
        id: "bachelor",
        label: "BACHELOR'S ERA",
        items: bachelorItems.filter(include)
      }
    ].filter((era) => era.items.length > 0);
  }, [filter]);

  return (
    <main className="subpage page-shell education-journey-page">
      <SectionHeading
        eyebrow="EDUCATION"
        title="Academic journey, in one timeline."
        copy="Degrees anchor the path; selected academic work and credentials sit beneath them."
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

      <div className="education-journey">
        {eras.map((era) => (
          <section className="education-era" key={era.id}>
            <div className="education-era-label">{era.label}</div>

            <div className="education-timeline">
              {era.items.map((item) => {
                const isDegree = item.kind === "degree";

                return (
                  <article
                    className={`education-timeline-item-v2${isDegree ? " education-degree-anchor" : ""}`}
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
                      <div className="education-timeline-meta">{item.status}</div>

                      {item.kind === "degree" && (
                        <>
                          <h2>{item.title}</h2>
                          <p className="education-institution">{item.institution}</p>

                          {item.achievement && (
                            <div className="education-achievement">{item.achievement}</div>
                          )}

                          <div className="education-focus-tags">
                            {item.focus.map((focus) => <span key={focus}>{focus}</span>)}
                          </div>

                          {item.era === "master" && (
                            <details className="education-details">
                              <summary>Selected coursework</summary>
                              <div className="course-area-list">
                                {masterCourseAreas.map((area) => (
                                  <div className="course-area" key={area.title}>
                                    <strong>{area.title}</strong>
                                    <ul>
                                      {area.courses.map((course) => <li key={course}>{course}</li>)}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </>
                      )}

                      {item.kind === "academic" && (
                        <>
                          <span className="education-context">{item.context}</span>
                          <h3>{item.title}</h3>
                          <p className="education-summary">{item.summary}</p>
                          <div className="academic-work-tags">
                            {item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                          </div>
                        </>
                      )}

                      {item.kind === "credential" && (
                        <>
                          <h3>{item.title}</h3>
                          <p className="education-institution">{item.issuer}</p>
                        </>
                      )}
                    </div>

                    <div className="education-timeline-artifact-v2">
                      {item.kind === "degree" && (
                        <EducationArtifactPreview artifact={degreeArtifacts[item.era]} />
                      )}

                      {item.kind === "academic" && (
                        <EducationArtifactPreview
                          compact
                          artifact={{
                            label: item.status.includes("PENDING")
                              ? "Presentation in preparation"
                              : "Presentation / academic artifact",
                            note: "Approved slide or document image can be added here later."
                          }}
                        />
                      )}

                      {item.kind === "credential" && (
                        <EducationArtifactPreview
                          compact
                          artifact={{
                            label: item.artifact,
                            note: "Approved credential image can be added here later."
                          }}
                        />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="education-timeline-note">
        <span>Timeline rule</span>
        <p>
          Academic work without a verified public date is grouped under its degree instead of being assigned a guessed date.
        </p>
      </div>
    </main>
  );
}

export default EducationPage;
