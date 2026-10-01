import React, { useState } from "react";
import SectionHeading from "../components/SectionHeading";

const controls = [
  ["glass", "Glass opacity", 0.06, 0.36, 0.01],
  ["blur", "Backdrop blur", 6, 34, 1],
  ["border", "Edge highlight", 0.05, 0.28, 0.01],
  ["radius", "Corner radius", 16, 40, 1],
  ["shadow", "Shadow strength", 0.08, 0.4, 0.01],
  ["accentHue", "Accent hue", 180, 300, 1],
] as const;

function StyleLab() {
  const [values, setValues] = useState({ glass: 0.11, blur: 20, border: 0.12, radius: 28, shadow: 0.18, accentHue: 218 });

  const update = (key: keyof typeof values, value: number) => {
    const next = { ...values, [key]: value };
    setValues(next);
    const root = document.documentElement;
    root.style.setProperty("--glass-alpha", String(next.glass));
    root.style.setProperty("--glass-blur", `${next.blur}px`);
    root.style.setProperty("--glass-border-alpha", String(next.border));
    root.style.setProperty("--surface-radius", `${next.radius}px`);
    root.style.setProperty("--shadow-alpha", String(next.shadow));
    root.style.setProperty("--accent-hue", String(next.accentHue));
  };

  return (
    <main className="subpage page-shell lab-page">
      <SectionHeading eyebrow="DEV ONLY" title="Style Lab" copy="Live design tokens for optical glass and surface geometry." />
      <div className="lab-layout">
        <div className="lab-controls glass-panel">
          {controls.map(([key, label, min, max, step]) => (
            <label key={key}>
              <span>{label}<strong>{values[key]}</strong></span>
              <input type="range" min={min} max={max} step={step} value={values[key]} onChange={(e) => update(key, Number(e.target.value))} />
            </label>
          ))}
        </div>
        <div className="lab-preview">
          <div className="glass-panel preview-card">
            <div className="eyebrow">OPTICAL SURFACE</div>
            <h2>Live material preview</h2>
            <p>Adjust transparency, blur, edge highlight, curvature and accent hue without rewriting component CSS.</p>
            <button className="button primary">Sample action</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default StyleLab;
