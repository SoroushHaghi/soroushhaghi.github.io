import React, { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import Wordmark from "../components/Wordmark";

type FocusTarget = "all" | "glass" | "curves" | "shadow" | "accent" | "background";

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

const defaultValues: Values = {
  glass: 0.04,
  blur: 4,
  border: 0.04,
  navRadius: 34,
  surfaceRadius: 42,
  shadow: 0.36,
  accentHue: 231,
  backgroundLightness: 4,
  backgroundDepth: 0.14,
};

const minimalValues: Values = {
  glass: 0.04,
  blur: 4,
  border: 0.04,
  navRadius: 24,
  surfaceRadius: 28,
  shadow: 0.08,
  accentHue: 231,
  backgroundLightness: 4,
  backgroundDepth: 0.03,
};

const controls = [
  ["glass", "Glass opacity", "GLASS", 0.04, 0.34, 0.01],
  ["blur", "Backdrop blur", "GLASS", 4, 34, 1],
  ["border", "Edge highlight", "GLASS", 0.04, 0.28, 0.01],
  ["navRadius", "Navbar curve", "CURVES", 14, 40, 1],
  ["surfaceRadius", "Card curve", "CURVES", 14, 48, 1],
  ["shadow", "Shadow strength", "SHADOW", 0.04, 0.4, 0.01],
  ["accentHue", "Accent hue", "ACCENT", 180, 300, 1],
  ["backgroundLightness", "Background lightness", "BACKGROUND", 4, 14, 0.5],
  ["backgroundDepth", "Background depth", "BACKGROUND", 0, 0.16, 0.005],
] as const;

const cssVarFor = (key: keyof Values, value: number) => {
  if (key === "glass") return ["--glass-alpha", String(value)] as const;
  if (key === "blur") return ["--glass-blur", value + "px"] as const;
  if (key === "border") return ["--glass-border-alpha", String(value)] as const;
  if (key === "navRadius") return ["--nav-radius", value + "px"] as const;
  if (key === "surfaceRadius") return ["--surface-radius", value + "px"] as const;
  if (key === "shadow") return ["--shadow-alpha", String(value)] as const;
  if (key === "accentHue") return ["--accent-hue", String(value)] as const;
  if (key === "backgroundLightness") return ["--bg-lightness", value + "%"] as const;
  return ["--bg-depth-alpha", String(value)] as const;
};

function StyleLab() {
  const [values, setValues] = useState<Values>(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-style-lab-v1");
      return saved ? { ...defaultValues, ...JSON.parse(saved) } : defaultValues;
    } catch {
      return defaultValues;
    }
  });

  const [focus, setFocus] = useState<FocusTarget>("all");

  const apply = (next: Values) => {
    setValues(next);
    const root = document.documentElement;

    (Object.keys(next) as Array<keyof Values>).forEach((key) => {
      const [name, value] = cssVarFor(key, next[key]);
      root.style.setProperty(name, value);
    });

    window.localStorage.setItem("portfolio-style-lab-v1", JSON.stringify(next));
  };

  const update = (key: keyof Values, value: number) => {
    apply({ ...values, [key]: value });
  };

  const setMinimal = (key: keyof Values) => {
    update(key, minimalValues[key]);
  };

  const resetAll = () => {
    apply(defaultValues);
  };

  return (
    <main className="subpage page-shell lab-page">
      <SectionHeading
        eyebrow="DEV ONLY"
        title="Style Lab"
        copy="Dark-mode tuning only. Values are saved in this browser automatically and also affect the real preview pages."
      />

      <div className="lab-toolbar glass-panel">
        <div className="lab-toolbar-group">
          <span className="lab-toolbar-label">MODE</span>
          <div className="lab-mode-lock">DARK ONLY</div>
          <small>Light mode is intentionally deferred. Everything here is calibrated for the dark site.</small>
        </div>

        <div className="lab-toolbar-group">
          <span className="lab-toolbar-label">FOCUS</span>
          <div className="lab-segmented lab-focus-tabs" role="group" aria-label="Preview target">
            {(["all", "glass", "curves", "shadow", "accent", "background"] as FocusTarget[]).map((item) => (
              <button
                key={item}
                className={focus === item ? "active" : ""}
                onClick={() => setFocus(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <small>Use Focus when an effect is hard to distinguish.</small>
        </div>

        <button className="lab-reset" type="button" onClick={resetAll}>Reset to current defaults</button>
      </div>

      <div className="lab-layout">
        <aside className="lab-controls glass-panel">
          <div className="lab-control-note">
            <strong>AUTO-SAVED</strong>
            <span>Your current values stay in this browser while you move between Home, Work, Education and the Lab.</span>
          </div>

          {controls.map(([key, label, target, min, max, step]) => (
            <label key={key} className={`lab-control lab-control-${target.toLowerCase()}`}>
              <span className="lab-label-row">
                <span>
                  {label}
                  <small>{target}</small>
                </span>
                <span className="lab-control-actions">
                  <button type="button" onClick={() => setMinimal(key)}>MIN</button>
                  <strong>{values[key]}</strong>
                </span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={values[key]}
                onChange={(event) => update(key, Number(event.target.value))}
              />
            </label>
          ))}
        </aside>

        <section className={`lab-scene lab-focus-${focus}`} aria-label="Live style preview">
          <div className="lab-scene-grid" aria-hidden="true" />
          <div className="lab-orb lab-orb-a" aria-hidden="true" />
          <div className="lab-orb lab-orb-b" aria-hidden="true" />
          <div className="lab-line lab-line-a" aria-hidden="true" />
          <div className="lab-line lab-line-b" aria-hidden="true" />

          <div className="lab-demo-stack">
            <div className="lab-effect-samples">
              <div className="lab-sample lab-sample-glass">
                <div className="lab-sample-backdrop" aria-hidden="true">
                  <span>Q</span><span>AI</span><span>01</span><span>λ</span>
                </div>
                <div className="lab-sample-pane glass-panel">
                  <small>GLASS</small>
                  <strong>Opacity + blur + edge</strong>
                </div>
              </div>

              <div className="lab-sample lab-sample-curves">
                <div className="lab-curve-nav" />
                <div className="lab-curve-card" />
                <small>CURVES</small>
              </div>

              <div className="lab-sample lab-sample-shadow">
                <div className="lab-shadow-tile">SHADOW</div>
              </div>

              <div className="lab-sample lab-sample-accent">
                <div className="lab-accent-swatch">
                  <span>ACCENT</span>
                  <strong>{values.accentHue}°</strong>
                </div>
              </div>

              <div className="lab-sample lab-sample-background">
                <div className="lab-background-swatch">
                  <span>DARK</span>
                  <strong>{values.backgroundLightness}%</strong>
                </div>
              </div>
            </div>

            <div className="lab-demo-nav glass-surface">
              <span className="lab-demo-brand"><Wordmark variant="nav" /></span>
              <span>WORK</span>
              <span>EDUCATION</span>
              <span>CV</span>
            </div>

            <div className="glass-panel preview-card">
              <div className="eyebrow">OPTICAL SURFACE</div>
              <h2>See each effect in isolation and in context.</h2>
              <p>
                The small samples above isolate glass, curves, shadow and background. The card and navbar show how the same tokens behave in the real interface.
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
              <span>Shadow <strong>{values.shadow}</strong></span>
              <span>Background <strong>{values.backgroundLightness}%</strong></span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default StyleLab;
