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
          <h1>Education density</h1>
          <p>Adjust only the uncertain layout balance. These values affect the real Education page and stay in this browser.</p>
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
            <span>Degree title scale <strong>{values.titleScale.toFixed(2)}</strong></span>
            <input type="range" min="0.86" max="1.1" step="0.01" value={values.titleScale} onChange={(e) => update("titleScale", Number(e.target.value))} />
          </label>
          <label>
            <span>Academic row spacing <strong>{values.rowSpace}px</strong></span>
            <input type="range" min="22" max="54" step="2" value={values.rowSpace} onChange={(e) => update("rowSpace", Number(e.target.value))} />
          </label>

          <div className="hero-lab-note">
            <strong>HOW TO USE</strong>
            <span>Change the values here, then open Education and send me the final numbers or a screenshot.</span>
          </div>
        </aside>

        <section className="education-lab-preview">
          <div className="education-lab-degree">
            <div>
              <span>2024 — PRESENT</span>
              <strong>M.Sc. Quantum Technologies</strong>
              <p>Degree information and focus remain on the left.</p>
            </div>
            <div className="education-lab-doc">DOCUMENT IMAGE</div>
          </div>
          <div className="education-lab-degree education-lab-degree-muted">
            <div>
              <span>ACADEMIC WORK</span>
              <strong>Presentation / coursework</strong>
              <p>Short description, then visual proof or slides on the right.</p>
            </div>
            <div className="education-lab-doc">ARTIFACT</div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EducationLab;
