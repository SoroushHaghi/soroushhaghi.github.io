import React from "react";
import AffiliationRail from "../components/AffiliationRail";
import ExpertiseLayer from "../components/ExpertiseLayer";
import SectionHeading from "../components/SectionHeading";
import CinematicHero from "../components/CinematicHero";
import { education, workItems } from "../siteConfig";
import { toPublicPath } from "../routes";

type Props = { onNavigate: (path: string) => void };

function HomePage({ onNavigate }: Props) {
  const featured = workItems.filter((item) => item.featured).slice(0, 3);

  return (
    <main>
      <CinematicHero />

      <section className="section page-shell" id="education-preview" data-scroll-section="education">
        <SectionHeading
          eyebrow="EDUCATION"
          title="Current direction, built on an engineering foundation."
          copy="From Computer Engineering into Quantum Technologies, with focus spanning computation, communication, photonics and devices."
          action={{ label: "Explore education", href: "/education" }}
          onNavigate={onNavigate}
        />
        <div className="education-preview-grid">
          {education.map((item) => (
            <article className="education-card glass-panel" key={item.id}>
              <div className="card-meta">{item.period}</div>
              <h3>{item.degree}</h3>
              <p className="muted">{item.institution}</p>
              <ul>
                {item.focus.slice(0, 3).map((focus) => <li key={focus}>{focus}</li>)}
              </ul>
              {"achievement" in item && item.achievement && <div className="achievement">{item.achievement}</div>}
            </article>
          ))}
        </div>
      </section>

      <section className="section page-shell expertise-section" data-scroll-section="expertise">
        <SectionHeading
          eyebrow="EXPERTISE"
          title="Where my education and technical work connect."
          copy="A readable index of the domains that recur across my coursework, projects and systems."
        />
        <ExpertiseLayer />
      </section>

      <section className="section page-shell" data-scroll-section="work">
        <SectionHeading
          eyebrow="SELECTED WORK"
          title="Selected technical work."
          copy="Three representative projects and systems; the Work page carries the broader set."
          action={{ label: "View all work", href: "/work" }}
          onNavigate={onNavigate}
        />
        <div className="work-preview-grid">
          {featured.map((item) => (
            <article className="work-card glass-panel" key={item.id}>
              <div className="card-meta">{item.type.toUpperCase()}</div>
              <div className="work-visual-placeholder" />
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <a href={toPublicPath("/work")} onClick={(e) => { e.preventDefault(); onNavigate("/work"); }} className="text-link">
                View work <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="affiliations-section page-shell" data-scroll-section="affiliations" aria-label="Affiliations and context">
        <div className="affiliations-head affiliations-head-compact">
          <div className="eyebrow">AFFILIATIONS & CONTEXT</div>
        </div>
        <AffiliationRail />
      </section>

      <section className="contact-section page-shell" data-scroll-section="contact">
        <div className="contact-layout">
          <div className="contact-copy">
            <div className="eyebrow">CONTACT</div>
            <h2>Seeking an internship.</h2>
          </div>
          <div className="contact-actions">
            <a className="button primary" href="mailto:s.haghi.career@outlook.com">Email</a>
            <a className="button secondary" href="/cv/">Open CV</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
