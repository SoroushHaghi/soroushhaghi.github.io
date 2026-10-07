import React, { useState } from "react";
import Wordmark from "../components/Wordmark";

type HeroValues = {
  height: number;
  gap: number;
  nameScale: number;
  visualScale: number;
};

const defaults: HeroValues = {
  height: 100,
  gap: 72,
  nameScale: 1,
  visualScale: 1,
};

const storageKey = "portfolio-hero-lab-v1";

function applyHero(values: HeroValues) {
  const root = document.documentElement;
  root.style.setProperty("--hero-min-height", values.height + "svh");
  root.style.setProperty("--hero-gap", values.gap + "px");
  root.style.setProperty("--hero-name-scale", String(values.nameScale));
  root.style.setProperty("--hero-visual-scale", String(values.visualScale));
  window.localStorage.setItem(storageKey, JSON.stringify(values));
}

function HeroLab() {
  const [values, setValues] = useState<HeroValues>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const update = (key: keyof HeroValues, value: number) => {
    const next = { ...values, [key]: value };
    setValues(next);
    applyHero(next);
  };

  const reset = () => {
    setValues(defaults);
    applyHero(defaults);
  };

  return (
    <main className="subpage page-shell hero-lab-page">
      <div className="hero-lab-head">
        <div>
          <div className="eyebrow">DEV ONLY · HERO LAB</div>
          <h1>Hero composition</h1>
          <p>These controls affect the real Home hero. Nothing here depends on fixed page pixels or current content length.</p>
        </div>
        <button className="button secondary" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="hero-lab-layout">
        <aside className="hero-lab-controls glass-panel" data-native-scroll>
          <label>
            <span>Viewport height <strong>{values.height}svh</strong></span>
            <input type="range" min="78" max="100" step="1" value={values.height} onChange={(e) => update("height", Number(e.target.value))} />
          </label>
          <label>
            <span>Hero gap <strong>{values.gap}px</strong></span>
            <input type="range" min="28" max="120" step="2" value={values.gap} onChange={(e) => update("gap", Number(e.target.value))} />
          </label>
          <label>
            <span>Name scale <strong>{values.nameScale.toFixed(2)}</strong></span>
            <input type="range" min="0.82" max="1.14" step="0.01" value={values.nameScale} onChange={(e) => update("nameScale", Number(e.target.value))} />
          </label>
          <label>
            <span>Hero visual scale <strong>{values.visualScale.toFixed(2)}</strong></span>
            <input type="range" min="0.82" max="1.16" step="0.01" value={values.visualScale} onChange={(e) => update("visualScale", Number(e.target.value))} />
          </label>

          <div className="hero-lab-note">
            <strong>HOW TO USE</strong>
            <span>Adjust here, then open Home. The values persist in this browser so you can judge the real composition before sending me the numbers.</span>
          </div>
        </aside>

        <section className="hero-lab-preview glass-panel">
          <div className="hero-lab-copy">
            <div className="eyebrow">COMPUTER ENGINEERING → QUANTUM TECHNOLOGIES</div>
            <h2 className="hero-lab-name"><Wordmark variant="hero" /></h2>
            <p>Connecting software and computation with physical systems, communication, and quantum technologies.</p>
            <span className="button primary">View work →</span>
          </div>
          <div className="hero-lab-stage hero-lab-static-stage">
            <img
              src={`${process.env.PUBLIC_URL}/media/hero/hero-constellation-v5.webp`}
              alt=""
              draggable={false}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default HeroLab;
