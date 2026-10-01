import React, { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Wordmark from "../components/Wordmark";

const controls = [
  ["glass", "Glass opacity", "NAV + CARDS", 0.04, 0.34, 0.01],
  ["blur", "Backdrop blur", "NAV + CARDS", 4, 34, 1],
  ["border", "Edge highlight", "NAV + CARDS", 0.04, 0.28, 0.01],
  ["navRadius", "Navbar curve", "TOP ISLAND", 14, 34, 1],
  ["surfaceRadius", "Card curve", "PANELS", 14, 42, 1],
  ["shadow", "Shadow strength", "NAV + CARDS", 0.04, 0.36, 0.01],
  ["accentHue", "Accent hue", "TECH ACCENT", 180, 300, 1],
  ["backgroundLightness", "Background lightness", "PAGE BACKGROUND", 4, 14, 0.5],
  ["backgroundDepth", "Background depth", "PAGE BACKGROUND", 0, 0.14, 0.005],
] as const;

type Values = {
  glass: number;
  blur: number;
  border: number;
  navRadius: number;
  surfaceRadius: number;
  shadow: number;
  accentHue: number;
  backgroundLightness: number;
  backgroundDepth: number;
};

function StyleLab() {
  const [values, setValues] = useState<Values>({
    glass: 0.11,
    blur: 20,
    border: 0.12,
    navRadius: 22,
    surfaceRadius: 28,
    shadow: 0.18,
    accentHue: 218,
    backgroundLightness: 7,
    backgroundDepth: 0.055,
  });

  const update = (key: keyof Values, value: number) => {
    const next = { ...values, [key]: value };
    setValues(next);

    const root = document.documentElement;
    root.style.setProperty("--glass-alpha", String(next.glass));
    root.style.setProperty("--glass-blur", `${next.blur}px`);
    root.style.setProperty("--glass-border-alpha", String(next.border));
    root.style.setProperty("--nav-radius", `${next.navRadius}px`);
    root.style.setProperty("--surface-radius", `${next.surfaceRadius}px`);
    root.style.setProperty("--shadow-alpha", String(next.shadow));
    root.style.setProperty("--accent-hue", String(next.accentHue));
    root.style.setProperty("--bg-lightness", `${next.backgroundLightness}%`);
    root.style.setProperty("--bg-depth-alpha", String(next.backgroundDepth));
  };

  return (
    <main className="subpage page-shell lab-page">
      <SectionHeading
        eyebrow="DEV ONLY"
        title="Style Lab"
        copy="Every slider updates the real top navigation and the preview objects below, so you can see exactly where each token is applied."
      />

      <div className="lab-layout">
        <aside className="lab-controls glass-panel">
          <div className="lab-control-note">
            <strong>LIVE</strong>
            <span>Move a slider and watch both the navbar above and the scene on the right.</span>
          </div>

          {controls.map(([key, label, target, min, max, step]) => (
            <label key={key}>
              <span className="lab-label-row">
                <span>
                  {label}
                  <small>{target}</small>
                </span>
                <strong>{values[key]}</strong>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={values[key]}
                onChange={(e) => update(key, Number(e.target.value))}
              />
            </label>
          ))}
        </aside>

        <section className="lab-scene" aria-label="Live style preview">
          <div className="lab-scene-grid" aria-hidden="true" />
          <div className="lab-orb lab-orb-a" aria-hidden="true" />
          <div className="lab-orb lab-orb-b" aria-hidden="true" />
          <div className="lab-line lab-line-a" aria-hidden="true" />
          <div className="lab-line lab-line-b" aria-hidden="true" />

          <div className="lab-demo-stack">
            <div className="lab-demo-nav glass-surface">
              <span className="lab-demo-brand"><Wordmark variant="nav" /></span>
              <span>WORK</span>
              <span>EDUCATION</span>
              <span>CV</span>
            </div>

            <div className="glass-panel preview-card">
              <div className="eyebrow">OPTICAL SURFACE</div>
              <h2>Glass should reveal what is behind it.</h2>
              <p>
                The grid, light forms and line work behind this panel are intentionally visible so transparency,
                blur, edge highlight and shadow changes are obvious.
              </p>
              <div className="lab-demo-actions">
                <button className="button primary">Primary</button>
                <button className="button secondary">Secondary</button>
              </div>
            </div>

            <div className="lab-token-readout">
              <span>Nav curve <strong>{values.navRadius}px</strong></span>
              <span>Card curve <strong>{values.surfaceRadius}px</strong></span>
              <span>Blur <strong>{values.blur}px</strong></span>
              <span>Opacity <strong>{values.glass}</strong></span>
              <span>Background <strong>{values.backgroundLightness}%</strong></span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default StyleLab;
