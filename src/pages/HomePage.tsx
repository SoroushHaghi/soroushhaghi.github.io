import React from "react";
import ExpertiseLayer from "../components/ExpertiseLayer";
import SectionHeading from "../components/SectionHeading";
import SignaturePlaceholder from "../components/SignaturePlaceholder";
import Wordmark from "../components/Wordmark";
import { education, trustSignals, workItems } from "../siteConfig";
import { toPublicPath } from "../routes";

type Props = { onNavigate: (path: string) => void };

function HomePage({ onNavigate }: Props) {
  const featured = workItems.filter((item) => item.featured).slice(0, 3);

  return (
    <main>
      <section className="hero page-shell" data-scroll-section="hero">
        <div className="hero-copy">
          <div className="eyebrow">B.SC. COMPUTER ENGINEERING → M.SC. QUANTUM TECHNOLOGIES</div>
          <h1 className="hero-name"><Wordmark variant="hero" /></h1>
          <p className="hero-lead">
            From computer engineering to quantum technologies, connecting software, sensing, communication, and computation.
          </p>
          <div className="hero-actions">
            <a href={toPublicPath("/work")} className="button primary" onClick={(e) => { e.preventDefault(); onNavigate("/work"); }}>
              View work <span>→</span>
            </a>
            <a href={toPublicPath("/cv")} className="button secondary">CV</a>
          </div>
        </div>
        <SignaturePlaceholder />
      </section>

      <section className="section page-shell" id="education-preview" data-scroll-section="education">
        <SectionHeading
          eyebrow="EDUCATION"
          title="Current direction, built on an engineering foundation."
          copy="A concise preview here; the Education page carries the full academic story."
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

      <section className="section page-shell" data-scroll-section="expertise">
        <SectionHeading
          eyebrow="EXPERTISE"
          title="One profile, seen through connected technical domains."
          copy="This is the structural placeholder for the future layered optical map that combines Work and Education."
        />
        <ExpertiseLayer />
      </section>

      <section className="section page-shell" data-scroll-section="work">
        <SectionHeading
          eyebrow="SELECTED WORK"
          title="Concrete evidence, not a skills wall."
          copy="Three selected items on Home; the full Work page will support domain-driven exploration."
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
        <div className="continuation-cue" aria-hidden="true"><span /><span /><span /></div>
      </section>

      <section className="trust-strip page-shell" aria-label="Selected institutions and organizations">
        {trustSignals.map((signal) => <span key={signal}>{signal}</span>)}
      </section>

      <section className="contact-section page-shell" data-scroll-section="contact">
        <div className="contact-card glass-panel">
          <div>
            <div className="eyebrow">CONTACT</div>
            <h2>Open to technical conversations and industrial internships.</h2>
          </div>
          <div className="contact-actions">
            <a className="button primary" href="mailto:s.haghi.career@outlook.com">Email</a>
            <a className="button secondary" href={toPublicPath("/cv")}>Open CV</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
