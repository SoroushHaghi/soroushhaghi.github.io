import React from "react";
import SectionHeading from "../components/SectionHeading";
import EducationArtifactPreview from "../components/EducationArtifactPreview";
import {
  academicWork,
  degreeArtifacts,
  masterCourseAreas,
  trainingAndCredentials
} from "../portfolioContent";

function EducationPage() {
  return (
    <main className="subpage page-shell education-detail-page">
      <SectionHeading
        eyebrow="EDUCATION"
        title="Degrees, academic work and credentials."
        copy="Academic evidence stays compact here: degree trajectory first, then selected presentations/coursework, then credentials."
      />

      <section className="education-block">
        <div className="education-block-head">
          <span className="eyebrow">DEGREES</span>
          <p>Formal academic trajectory, without publishing detailed grades.</p>
        </div>

        <div className="degree-stack">
          <article className="degree-record degree-record-with-artifact">
            <div className="degree-period">Oct 2024 — Present</div>
            <div className="degree-body">
              <span className="degree-status">IN PROGRESS · 66/120 ECTS</span>
              <h2>M.Sc. Quantum Technologies in Electrical and Computer Engineering</h2>
              <p className="degree-institution">Technische Universität Braunschweig</p>

              <div className="degree-focus degree-focus-compact">
                <span>Quantum Information & Computing</span>
                <span>Communication & Information</span>
                <span>Photonics, Devices & Fields</span>
              </div>

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
            </div>
            <div className="degree-artifact-column">
              <EducationArtifactPreview artifact={degreeArtifacts.master} />
            </div>
          </article>

          <article className="degree-record degree-record-with-artifact">
            <div className="degree-period">2018 — Feb 2024</div>
            <div className="degree-body">
              <span className="degree-status">COMPLETED</span>
              <h2>B.Sc. Computer Engineering — AI specialization</h2>
              <p className="degree-institution">Islamic Azad University, Mashhad Branch</p>

              <div className="degree-achievement">Ranked 5th of 131 students</div>

              <div className="degree-focus degree-focus-compact">
                <span>Software & Algorithms</span>
                <span>AI & Computer Vision</span>
                <span>Embedded Systems & Hardware</span>
                <span>Databases & Information Systems</span>
              </div>
            </div>
            <div className="degree-artifact-column">
              <EducationArtifactPreview artifact={degreeArtifacts.bachelor} />
            </div>
          </article>
        </div>
      </section>

      <section className="education-block">
        <div className="education-block-head">
          <span className="eyebrow">ACADEMIC WORK & PRESENTATIONS</span>
          <p>Only work worth showing publicly; internal course numbering and visit records are omitted here.</p>
        </div>

        <div className="academic-timeline">
          {academicWork.map((item) => (
            <article className="academic-timeline-item" key={item.id}>
              <div className="academic-timeline-status">{item.status}</div>
              <div className="academic-timeline-copy">
                <span>{item.context}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="academic-work-tags">
                  {item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <div className="academic-timeline-artifact">
                <EducationArtifactPreview
                  compact
                  artifact={{
                    label: item.status === "IN PROGRESS" ? "Presentation in preparation" : "Presentation / academic artifact",
                    note: "Approved slide or document image can be added here later."
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="education-block education-block-last">
        <div className="education-block-head">
          <span className="eyebrow">TRAINING & CREDENTIALS</span>
          <p>Certificates and structured learning, with a visual slot ready for the actual credential image.</p>
        </div>

        <div className="credential-list credential-list-visual">
          {trainingAndCredentials.map((item) => (
            <article className="credential-row credential-row-visual" key={item.period + item.title}>
              <span className="credential-period">{item.period}</span>
              <div className="credential-main">
                <strong>{item.title}</strong>
                <span>{item.issuer}</span>
              </div>
              <small>{item.status}</small>
              <div className="credential-artifact">
                <EducationArtifactPreview
                  compact
                  artifact={{
                    label: item.artifact ?? "Credential",
                    note: "Approved image can be added here later."
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default EducationPage;
