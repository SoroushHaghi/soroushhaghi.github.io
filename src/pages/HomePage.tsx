import React from "react";
import AffiliationRail from "../components/AffiliationRail";
import ExpertiseLayer from "../components/ExpertiseLayer";
import SectionHeading from "../components/SectionHeading";
import CinematicHero from "../components/CinematicHero";
import SignaturePlaceholder from "../components/SignaturePlaceholder";
import Wordmark from "../components/Wordmark";
import { education, workItems } from "../siteConfig";
import { toPublicPath } from "../routes";
import { useSiteCopy } from "../content/useSiteCopy";

type Props = { onNavigate: (path: string) => void };

function HomePage({ onNavigate }: Props) {
  const copy = useSiteCopy();
  const featured = workItems.filter((item) => item.featured).slice(0, 3);

  return (
    <main>
      <section className="hero page-shell" data-scroll-section="hero" aria-labelledby="home-hero-name">
        <div className="hero-copy">
          <div className="eyebrow">{copy.home.hero.eyebrow}</div>
          <h1 className="hero-name" id="home-hero-name">
            <Wordmark variant="hero" />
          </h1>
          <p className="hero-lead">{copy.home.hero.lead}</p>
          <div className="hero-actions">
            <a
              href={toPublicPath("/work")}
              className="button primary"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/work");
              }}
            >
              {copy.home.hero.cta} <span>→</span>
            </a>
          </div>
        </div>
        <SignaturePlaceholder />
      </section>

      <CinematicHero />

      <section className="section page-shell" id="education-preview" data-scroll-section="education">
        <SectionHeading
          eyebrow={copy.home.education.eyebrow}
          title={copy.home.education.title}
          copy={copy.home.education.copy}
          action={{ label: copy.home.education.action, href: "/education" }}
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
          eyebrow={copy.home.expertise.eyebrow}
          title={copy.home.expertise.title}
          copy={copy.home.expertise.copy}
        />
        <ExpertiseLayer />
      </section>

      <section className="section page-shell" data-scroll-section="work">
        <SectionHeading
          eyebrow={copy.home.work.eyebrow}
          title={copy.home.work.title}
          copy={copy.home.work.copy}
          action={{ label: copy.home.work.action, href: "/work" }}
          onNavigate={onNavigate}
        />
        <div className="work-preview-grid">
          {featured.map((item) => (
            <article className="work-card glass-panel" key={item.id}>
              <div className="card-meta">{item.type.toUpperCase()}</div>
              <div className="work-visual-placeholder" />
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <a
                href={toPublicPath("/work")}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("/work");
                }}
                className="text-link"
              >
                {copy.home.work.cardAction} <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="affiliations-section page-shell" data-scroll-section="affiliations" aria-label="Affiliations and context">
        <div className="affiliations-head affiliations-head-compact">
          <div className="eyebrow">{copy.home.affiliations.eyebrow}</div>
        </div>
        <AffiliationRail />
      </section>

      <section className="contact-section page-shell" data-scroll-section="contact">
        <div className="contact-layout">
          <div className="contact-copy">
            <div className="eyebrow">{copy.home.contact.eyebrow}</div>
            <h2>{copy.home.contact.title}</h2>
          </div>
          <div className="contact-actions">
            <a className="button primary" href="mailto:s.haghi.career@outlook.com">{copy.home.contact.email}</a>
            <a className="button secondary" href="/cv/">{copy.home.contact.cv}</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
