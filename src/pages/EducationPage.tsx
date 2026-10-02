import React from "react";
import SectionHeading from "../components/SectionHeading";
import { academicWork, masterModules, trainingAndCredentials } from "../portfolioContent";

function EducationPage() {
  return (
    <main className="subpage page-shell education-detail-page">
      <SectionHeading
        eyebrow="EDUCATION"
        title="Degrees, coursework, presentations and academic technical work."
        copy="The academic page separates degree progress, completed coursework, presentations and training so the evidence stays readable without turning coursework into professional experience."
      />

      <section className="education-block">
        <div className="education-block-head">
          <span className="eyebrow">DEGREES</span>
          <p>Formal academic trajectory.</p>
        </div>

        <div className="degree-stack">
          <article className="degree-record degree-record-primary">
            <div className="degree-period">Oct 2024 — Present</div>
            <div className="degree-body">
              <span className="degree-status">IN PROGRESS · 66/120 ECTS</span>
              <h2>M.Sc. Quantum Technologies in Electrical and Computer Engineering</h2>
              <p className="degree-institution">Technische Universität Braunschweig</p>
              <div className="degree-focus">
                <span>Quantum information processing & computing</span>
                <span>Quantum structures, devices & photonics</span>
                <span>Communication, information & field theory</span>
              </div>
              <p className="degree-note">Current degree path is being completed toward the industrial internship and thesis phases.</p>
            </div>
          </article>

          <article className="degree-record">
            <div className="degree-period">2018 — Feb 2024</div>
            <div className="degree-body">
              <span className="degree-status">COMPLETED · 150 CREDITS</span>
              <h2>B.Sc. Computer Engineering — AI specialization</h2>
              <p className="degree-institution">Islamic Azad University, Mashhad Branch</p>
              <div className="degree-metrics">
                <span><strong>17.28/20</strong><small>Overall grade</small></span>
                <span><strong>5 / 131</strong><small>Program rank</small></span>
              </div>
              <div className="degree-focus">
                <span>Software, programming & algorithms</span>
                <span>AI, machine learning & computer vision</span>
                <span>Embedded systems & hardware</span>
                <span>Databases & information systems</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="education-block">
        <div className="education-block-head">
          <span className="eyebrow">MASTER'S COURSEWORK</span>
          <p>Completed or formally credited coursework, with the transcript boundary preserved.</p>
        </div>

        <div className="module-list">
          {masterModules.map((module) => (
            <article className="module-row" key={module.title}>
              <strong>{module.title}</strong>
              <span>{module.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="education-block">
        <div className="education-block-head">
          <span className="eyebrow">ACADEMIC WORK & PRESENTATIONS</span>
          <p>Presentations, analytical portfolios, graded work and academic activities with their actual scope retained.</p>
        </div>

        <div className="academic-work-grid">
          {academicWork.map((item) => (
            <article className="academic-work-card" key={item.id}>
              <div className="academic-work-meta">
                <span>{item.status}</span>
                <span>{item.context}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="academic-work-tags">
                {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="education-block education-block-last">
        <div className="education-block-head">
          <span className="eyebrow">TRAINING & CREDENTIALS</span>
          <p>Additional structured learning and credentials outside the degree timeline.</p>
        </div>

        <div className="credential-list">
          {trainingAndCredentials.map((item) => (
            <article className="credential-row" key={item.period + item.title}>
              <span className="credential-period">{item.period}</span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.issuer}</span>
              </div>
              <small>{item.status}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default EducationPage;
