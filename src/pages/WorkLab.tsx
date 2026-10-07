import React, { useState } from "react";

type Values = {
  artifactWidth: number;
  artifactHeight: number;
  rowSpace: number;
  titleScale: number;
};

const defaults: Values = {
  artifactWidth: 34,
  artifactHeight: 250,
  rowSpace: 48,
  titleScale: 1,
};

const storageKey = "portfolio-work-lab-v1";

function apply(values: Values) {
  const root = document.documentElement;
  root.style.setProperty("--work-artifact-width", values.artifactWidth + "%");
  root.style.setProperty("--work-artifact-height", values.artifactHeight + "px");
  root.style.setProperty("--work-row-space", values.rowSpace + "px");
  root.style.setProperty("--work-title-scale", String(values.titleScale));
  window.localStorage.setItem(storageKey, JSON.stringify(values));
}

function WorkLab() {
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
    <main className="subpage page-shell work-lab-page">
      <div className="hero-lab-head">
        <div>
          <div className="eyebrow">DEV ONLY · WORK LAB</div>
          <h1>Work timeline density</h1>
          <p>Use this only for layout balance. The Work page keeps the content minimal and stores these values locally.</p>
        </div>
        <button className="button secondary" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="hero-lab-layout">
        <aside className="hero-lab-controls glass-panel" data-native-scroll>
          <label>
            <span>Artifact width <strong>{values.artifactWidth}%</strong></span>
            <input type="range" min="28" max="44" step="1" value={values.artifactWidth} onChange={(e) => update("artifactWidth", Number(e.target.value))} />
          </label>
          <label>
            <span>Artifact height <strong>{values.artifactHeight}px</strong></span>
            <input type="range" min="190" max="320" step="10" value={values.artifactHeight} onChange={(e) => update("artifactHeight", Number(e.target.value))} />
          </label>
          <label>
            <span>Row spacing <strong>{values.rowSpace}px</strong></span>
            <input type="range" min="28" max="72" step="2" value={values.rowSpace} onChange={(e) => update("rowSpace", Number(e.target.value))} />
          </label>
          <label>
            <span>Title scale <strong>{values.titleScale.toFixed(2)}</strong></span>
            <input type="range" min="0.85" max="1.12" step="0.01" value={values.titleScale} onChange={(e) => update("titleScale", Number(e.target.value))} />
          </label>

          <div className="hero-lab-note">
            <strong>HOW TO USE</strong>
            <span>Change a value here, then open Work. Send me the final numbers once the balance feels right.</span>
          </div>
        </aside>

        <section className="work-lab-preview">
          <div className="work-lab-line">
            <div className="work-lab-copy">
              <span>2025 · PROJECT</span>
              <strong>MRI Segmentation</strong>
              <p>One short sentence, then optional details.</p>
              <div><i /><i /><i /></div>
            </div>
            <div className="work-lab-artifact">
              <span>LIVE / GIF / REPO / EVIDENCE</span>
            </div>
          </div>
          <div className="work-lab-line work-lab-line-muted">
            <div className="work-lab-copy">
              <span>2023 · EXPERIENCE</span>
              <strong>Teaching Assistant</strong>
              <p>Compact role summary.</p>
            </div>
            <div className="work-lab-artifact">
              <span>EVIDENCE</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default WorkLab;
