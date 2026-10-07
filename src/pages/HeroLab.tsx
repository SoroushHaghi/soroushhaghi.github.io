import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPublicPath } from "../routes";
import "./heroLab.scss";

type Device = "desktop" | "tablet" | "mobile";

type HeroLayoutValues = {
  openingX: number;
  openingY: number;
  openingNameSize: number;
  kickerSize: number;
  artworkX: number;
  artworkY: number;
  artworkScale: number;
  stageX: number;
  stageY: number;
  stageTitleSize: number;
  visualX: number;
  visualY: number;
  visualScale: number;
  dotsX: number;
  dotsY: number;
  scrollBottom: number;
};

type HeroLayouts = Record<Device, HeroLayoutValues>;

const STORAGE_KEY = "portfolio-hero-lab-v2";
const STOPS = [0, 0.18, 0.36, 0.58, 0.78, 1];
const STAGE_LABELS = [
  "00 · Opening",
  "01 · X axis",
  "02 · Plane",
  "03 · Capabilities",
  "04 · Depth",
  "05 · Career state",
];

const deviceWidths: Record<Device, number> = {
  desktop: 1440,
  tablet: 820,
  mobile: 390,
};

const defaults: HeroLayouts = {
  desktop: {
    openingX: 75,
    openingY: 55,
    openingNameSize: 104,
    kickerSize: 11,
    artworkX: 0,
    artworkY: 0,
    artworkScale: 1,
    stageX: 75,
    stageY: 172,
    stageTitleSize: 60,
    visualX: 0,
    visualY: 0,
    visualScale: 1,
    dotsX: 37,
    dotsY: 50,
    scrollBottom: 18,
  },
  tablet: {
    openingX: 44,
    openingY: 55,
    openingNameSize: 59,
    kickerSize: 10,
    artworkX: 0,
    artworkY: 0,
    artworkScale: 1,
    stageX: 44,
    stageY: 156,
    stageTitleSize: 42,
    visualX: 0,
    visualY: 0,
    visualScale: 1,
    dotsX: 26,
    dotsY: 50,
    scrollBottom: 18,
  },
  mobile: {
    openingX: 18,
    openingY: 55,
    openingNameSize: 62,
    kickerSize: 9,
    artworkX: 0,
    artworkY: 0,
    artworkScale: 1,
    stageX: 18,
    stageY: 120,
    stageTitleSize: 32,
    visualX: 0,
    visualY: 0,
    visualScale: 1,
    dotsX: 14,
    dotsY: 50,
    scrollBottom: 14,
  },
};

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="hero-tune-control">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{step < 1 ? value.toFixed(2) : Math.round(value)}{unit}</output>
    </label>
  );
}

function HeroLab() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [layouts, setLayouts] = useState<HeroLayouts>(defaults);
  const [stageIndex, setStageIndex] = useState(0);
  const [frameReady, setFrameReady] = useState(0);
  const [copyState, setCopyState] = useState("Copy values");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed.device === "desktop" || parsed.device === "tablet" || parsed.device === "mobile") {
        setDevice(parsed.device);
      }
      if (typeof parsed.stageIndex === "number") {
        setStageIndex(Math.max(0, Math.min(STOPS.length - 1, parsed.stageIndex)));
      }
      if (parsed.layouts && typeof parsed.layouts === "object") {
        setLayouts({
          desktop: { ...defaults.desktop, ...(parsed.layouts.desktop || {}) },
          tablet: { ...defaults.tablet, ...(parsed.layouts.tablet || {}) },
          mobile: { ...defaults.mobile, ...(parsed.layouts.mobile || {}) },
        });
      }
    } catch {
      // Keep repository defaults when old local lab state is malformed.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ device, stageIndex, layouts })
    );
  }, [device, stageIndex, layouts]);

  const current = layouts[device];

  const previewCss = useMemo(() => `
/* Hero Lab v2 — preview-only overrides */
.site-nav-shell,
.site-footer {
  display: none !important;
}

.career-state-intro-copy {
  left: ${current.openingX}px !important;
  top: ${current.openingY}% !important;
  transform: translateY(-50%) !important;
}

.career-state-intro-copy .career-state-kicker {
  font-size: ${current.kickerSize}px !important;
  color: #fff !important;
  opacity: 1 !important;
}

.career-state-intro-wordmark {
  font-size: ${current.openingNameSize}px !important;
}

.career-state-intro-artwork {
  transform:
    translate(${current.artworkX}px, ${current.artworkY}px)
    scale(${current.artworkScale}) !important;
  transform-origin: center !important;
  filter: none !important;
}

.career-state-intro-backdrop::after {
  display: none !important;
}

.career-state-intro-backdrop img {
  filter: none !important;
  -webkit-mask-image: none !important;
  mask-image: none !important;
  clip-path: none !important;
}

.career-state-copy {
  left: ${current.stageX}px !important;
  top: ${current.stageY}px !important;
}

.career-state-copy h1 {
  font-size: ${current.stageTitleSize}px !important;
}

.cinematic-hero-canvas {
  transform:
    translate(${current.visualX}px, ${current.visualY}px)
    scale(${current.visualScale}) !important;
  transform-origin: center !important;
}

.career-state-steps {
  left: ${current.dotsX}px !important;
  top: ${current.dotsY}% !important;
}

.career-state-scroll-hint {
  bottom: ${current.scrollBottom}px !important;
}
`, [current]);

  const applyPreview = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    let style = doc.getElementById("career-os-hero-lab-overrides") as HTMLStyleElement | null;
    if (!style) {
      style = doc.createElement("style");
      style.id = "career-os-hero-lab-overrides";
      doc.head.appendChild(style);
    }
    style.textContent = previewCss;
  }, [previewCss]);

  const scrollToStage = useCallback((index: number) => {
    const frame = frameRef.current;
    const win = frame?.contentWindow;
    const doc = frame?.contentDocument;
    if (!win || !doc) return;

    const hero = doc.querySelector(".cinematic-hero") as HTMLElement | null;
    if (!hero) return;

    const stop = STOPS[Math.max(0, Math.min(STOPS.length - 1, index))];
    const travel = Math.max(1, hero.offsetHeight - win.innerHeight);
    const heroTop = hero.offsetTop;
    win.scrollTo({ top: heroTop + travel * stop, behavior: "auto" });
  }, []);

  useEffect(() => {
    applyPreview();
    const timer = window.setTimeout(() => scrollToStage(stageIndex), 30);
    return () => window.clearTimeout(timer);
  }, [applyPreview, frameReady, stageIndex, scrollToStage]);

  const update = (key: keyof HeroLayoutValues, value: number) => {
    setLayouts((existing) => ({
      ...existing,
      [device]: {
        ...existing[device],
        [key]: value,
      },
    }));
  };

  const resetDevice = () => {
    setLayouts((existing) => ({
      ...existing,
      [device]: { ...defaults[device] },
    }));
  };

  const resetAll = () => {
    setLayouts(defaults);
    setDevice("desktop");
    setStageIndex(0);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const copyValues = async () => {
    const payload = [
      "HERO LAB V2",
      JSON.stringify(layouts, null, 2),
    ].join("\n");
    await navigator.clipboard.writeText(payload);
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy values"), 1200);
  };

  return (
    <div className="hero-tuning-lab">
      <aside className="hero-tuning-panel">
        <header className="hero-tuning-head">
          <div>
            <div className="hero-tuning-kicker">HERO LAB · LIVE SITE</div>
            <h1>Hero composition</h1>
          </div>
          <a href={toPublicPath("/")} target="_blank" rel="noreferrer">Open site ↗</a>
        </header>

        <div className="hero-tuning-note">
          This is the real Home Hero inside the preview. Every slider below changes the live iframe only.
          Desktop, tablet and mobile values are stored separately in this browser.
        </div>

        <div className="hero-tuning-device-switcher" aria-label="Preview device">
          {(["desktop", "tablet", "mobile"] as Device[]).map((item) => (
            <button
              type="button"
              key={item}
              className={device === item ? "active" : ""}
              onClick={() => setDevice(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="hero-tuning-stage-picker">
          <div className="hero-tuning-group-head">
            <strong>Hero stage</strong>
            <span>{STAGE_LABELS[stageIndex]}</span>
          </div>
          <input
            aria-label="Hero stage"
            type="range"
            min="0"
            max={STOPS.length - 1}
            step="1"
            value={stageIndex}
            onChange={(event) => setStageIndex(Number(event.target.value))}
          />
          <div className="hero-tuning-stage-buttons">
            {STOPS.map((_, index) => (
              <button
                type="button"
                key={index}
                className={stageIndex === index ? "active" : ""}
                onClick={() => setStageIndex(index)}
              >
                {String(index).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-tuning-scroll">
          <section className="hero-tuning-group">
            <div className="hero-tuning-group-head">
              <strong>Opening identity</strong>
              <span>Stage 00</span>
            </div>
            <Slider label="Text left / right" value={current.openingX} min={0} max={Math.max(120, deviceWidths[device] - 80)} unit="px" onChange={(value) => update("openingX", value)} />
            <Slider label="Text up / down" value={current.openingY} min={10} max={90} unit="%" onChange={(value) => update("openingY", value)} />
            <Slider label="Name size" value={current.openingNameSize} min={28} max={170} unit="px" onChange={(value) => update("openingNameSize", value)} />
            <Slider label="AI & QUANTUM size" value={current.kickerSize} min={7} max={24} unit="px" onChange={(value) => update("kickerSize", value)} />
          </section>

          <section className="hero-tuning-group">
            <div className="hero-tuning-group-head">
              <strong>Hero artwork</strong>
              <span>Stage 00</span>
            </div>
            <Slider label="Artwork left / right" value={current.artworkX} min={-500} max={500} unit="px" onChange={(value) => update("artworkX", value)} />
            <Slider label="Artwork up / down" value={current.artworkY} min={-400} max={400} unit="px" onChange={(value) => update("artworkY", value)} />
            <Slider label="Artwork scale" value={current.artworkScale} min={0.45} max={1.8} step={0.01} unit="×" onChange={(value) => update("artworkScale", value)} />
          </section>

          <section className="hero-tuning-group">
            <div className="hero-tuning-group-head">
              <strong>Career-stage text</strong>
              <span>Stages 01–05</span>
            </div>
            <Slider label="Text left / right" value={current.stageX} min={0} max={Math.max(120, deviceWidths[device] - 80)} unit="px" onChange={(value) => update("stageX", value)} />
            <Slider label="Text up / down" value={current.stageY} min={60} max={520} unit="px" onChange={(value) => update("stageY", value)} />
            <Slider label="Title size" value={current.stageTitleSize} min={20} max={100} unit="px" onChange={(value) => update("stageTitleSize", value)} />
          </section>

          <section className="hero-tuning-group">
            <div className="hero-tuning-group-head">
              <strong>Career visual / sphere</strong>
              <span>Stages 01–05</span>
            </div>
            <Slider label="Visual left / right" value={current.visualX} min={-500} max={500} unit="px" onChange={(value) => update("visualX", value)} />
            <Slider label="Visual up / down" value={current.visualY} min={-400} max={400} unit="px" onChange={(value) => update("visualY", value)} />
            <Slider label="Visual scale" value={current.visualScale} min={0.55} max={1.6} step={0.01} unit="×" onChange={(value) => update("visualScale", value)} />
          </section>

          <section className="hero-tuning-group">
            <div className="hero-tuning-group-head">
              <strong>Progress + scroll cue</strong>
              <span>All stages</span>
            </div>
            <Slider label="Dots left / right" value={current.dotsX} min={0} max={180} unit="px" onChange={(value) => update("dotsX", value)} />
            <Slider label="Dots up / down" value={current.dotsY} min={5} max={95} unit="%" onChange={(value) => update("dotsY", value)} />
            <Slider label="Scroll cue from bottom" value={current.scrollBottom} min={0} max={140} unit="px" onChange={(value) => update("scrollBottom", value)} />
          </section>
        </div>

        <div className="hero-tuning-actions">
          <button type="button" onClick={copyValues}>{copyState}</button>
          <button type="button" onClick={resetDevice}>Reset {device}</button>
          <button type="button" onClick={resetAll}>Reset all</button>
        </div>
      </aside>

      <section className="hero-tuning-preview">
        <div className="hero-tuning-preview-bar">
          <div>
            <strong>{device}</strong>
            <span>{deviceWidths[device]} px</span>
          </div>
          <span>{STAGE_LABELS[stageIndex]}</span>
        </div>

        <div className={`hero-tuning-frame-shell is-${device}`}>
          <iframe
            ref={frameRef}
            title="Hero live preview"
            src={toPublicPath("/")}
            style={{ width: deviceWidths[device] }}
            onLoad={() => setFrameReady((value) => value + 1)}
          />
        </div>
      </section>
    </div>
  );
}

export default HeroLab;
