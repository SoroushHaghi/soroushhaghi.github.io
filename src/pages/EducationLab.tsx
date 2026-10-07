import React, { useState } from "react";

type Values = {
  artifactWidth: number;
  artifactHeight: number;
  titleScale: number;
  rowSpace: number;
};

const defaults: Values = {
  artifactWidth: 30,
  artifactHeight: 230,
  titleScale: 1,
  rowSpace: 34,
};

const storageKey = "portfolio-education-lab-v1";

function apply(values: Values) {
  const root = document.documentElement;
  root.style.setProperty("--education-artifact-width", values.artifactWidth + "%");
  root.style.setProperty("--education-artifact-height", values.artifactHeight + "px");
  root.style.setProperty("--education-title-scale", String(values.titleScale));
  root.style.setProperty("--education-row-space", values.rowSpace + "px");
  window.localStorage.setItem(storageKey, JSON.stringify(values));
}

function EducationLab() {
  const [values, setValues] = useState<Values>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const update = (key: keyof Values, value: number) => {
    const next = { ...values, [key]: value };
    setValues(next);
    apply(next);
  };

  const reset = () => {
    setValues(defaults);
    apply(defaults);
  };

  return (
    <main className="subpage page-shell education-lab-page">
      <div className="hero-lab-head">
        <div>
          <div className="eyebrow">DEV ONLY · EDUCATION LAB</div>
          <h1>Education timeline</h1>
          <p>Same visual language as Work, with stronger degree anchors. These controls only tune the remaining layout balance.</p>
        </div>
        <button className="button secondary" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="hero-lab-layout">
        <aside className="hero-lab-controls glass-panel" data-native-scroll>
          <label>
            <span>Document width <strong>{values.artifactWidth}%</strong></span>
            <input type="range" min="24" max="40" step="1" value={values.artifactWidth} onChange={(e) => update("artifactWidth", Number(e.target.value))} />
          </label>
          <label>
            <span>Document height <strong>{values.artifactHeight}px</strong></span>
            <input type="range" min="180" max="300" step="10" value={values.artifactHeight} onChange={(e) => update("artifactHeight", Number(e.target.value))} />
          </label>
          <label>
            <span>Degree emphasis <strong>{values.titleScale.toFixed(2)}</strong></span>
            <input type="range" min="0.86" max="1.1" step="0.01" value={values.titleScale} onChange={(e) => update("titleScale", Number(e.target.value))} />
          </label>
          <label>
            <span>Row spacing <strong>{values.rowSpace}px</strong></span>
            <input type="range" min="22" max="54" step="2" value={values.rowSpace} onChange={(e) => update("rowSpace", Number(e.target.value))} />
          </label>

          <div className="hero-lab-note">
            <strong>HOW TO USE</strong>
            <span>Change the values here, then open Education and send me the final numbers or a screenshot.</span>
          </div>
        </aside>

        <section className="education-lab-preview">
          <div className="education-lab-line education-lab-line-degree">
            <div className="education-lab-rail"><span /></div>
            <div className="education-lab-period">2024 — PRESENT<br /><small>DEGREE</small></div>
            <div className="education-lab-copy">
              <span>IN PROGRESS</span>
              <strong>M.Sc. Quantum Technologies</strong>
              <p>Degree anchor with concise focus and expandable coursework.</p>
            </div>
            <div className="education-lab-doc">DEGREE / RECORD</div>
          </div>
          <div className="education-lab-line education-lab-line-muted">
            <div className="education-lab-rail"><span /></div>
            <div className="education-lab-period">M.SC.<br /><small>ACADEMIC WORK</small></div>
            <div className="education-lab-copy">
              <span>COMPLETED</span>
              <strong>Presentation / coursework</strong>
              <p>Short explanation and artifact on the right.</p>
            </div>
            <div className="education-lab-doc">SLIDE / DOCUMENT</div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EducationLab;
