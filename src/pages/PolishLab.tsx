import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import defaultCopy from "../content/siteCopy.json";
import { SITE_COPY_DRAFT_KEY } from "../content/useSiteCopy";
import { toPublicPath } from "../routes";
import "./polishLab.scss";

type Device = "desktop" | "tablet" | "mobile";
type Tab = "copy" | "layout" | "css";

type LayoutValues = {
  openingX: number;
  openingY: number;
  openingSize: number;
  stageX: number;
  stageY: number;
  stageSize: number;
  dotsX: number;
  dotsY: number;
  scrollBottom: number;
};

type LayoutByDevice = Record<Device, LayoutValues>;

type MockText = {
  id: string;
  device: Device;
  x: number;
  y: number;
  size: number;
  text: string;
};

const LAB_STATE_KEY = "portfolio-polish-lab-v3";

const defaultCss = `/* Temporary preview-only CSS overrides.
   Nothing here changes the redesign branch until we explicitly implement it. */`;

const deviceWidths: Record<Device, number> = {
  desktop: 1440,
  tablet: 820,
  mobile: 390,
};

const defaultLayouts: LayoutByDevice = {
  desktop: {
    openingX: 75,
    openingY: 55,
    openingSize: 104,
    stageX: 75,
    stageY: 172,
    stageSize: 60,
    dotsX: 37,
    dotsY: 50,
    scrollBottom: 18,
  },
  tablet: {
    openingX: 44,
    openingY: 55,
    openingSize: 59,
    stageX: 44,
    stageY: 156,
    stageSize: 42,
    dotsX: 26,
    dotsY: 50,
    scrollBottom: 18,
  },
  mobile: {
    openingX: 18,
    openingY: 55,
    openingSize: 62,
    stageX: 18,
    stageY: 120,
    stageSize: 32,
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
    <label className="polish-control">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{value}{unit}</output>
    </label>
  );
}

function PolishLab() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [tab, setTab] = useState<Tab>("copy");
  const [copyText, setCopyText] = useState(() => {
    try {
      return window.localStorage.getItem(SITE_COPY_DRAFT_KEY) || JSON.stringify(defaultCopy, null, 2);
    } catch {
      return JSON.stringify(defaultCopy, null, 2);
    }
  });
  const [cssText, setCssText] = useState(defaultCss);
  const [layouts, setLayouts] = useState<LayoutByDevice>(defaultLayouts);
  const [mockTexts, setMockTexts] = useState<MockText[]>([]);
  const [addTextMode, setAddTextMode] = useState(false);
  const [frameVersion, setFrameVersion] = useState(0);
  const [frameReady, setFrameReady] = useState(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LAB_STATE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed.cssText === "string") setCssText(parsed.cssText);
      if (parsed.device === "desktop" || parsed.device === "tablet" || parsed.device === "mobile") {
        setDevice(parsed.device);
      }
      if (parsed.layouts && typeof parsed.layouts === "object") {
        setLayouts({
          desktop: { ...defaultLayouts.desktop, ...(parsed.layouts.desktop || {}) },
          tablet: { ...defaultLayouts.tablet, ...(parsed.layouts.tablet || {}) },
          mobile: { ...defaultLayouts.mobile, ...(parsed.layouts.mobile || {}) },
        });
      }
      if (Array.isArray(parsed.mockTexts)) setMockTexts(parsed.mockTexts);
    } catch {
      // Keep defaults if a previous local draft is malformed.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      LAB_STATE_KEY,
      JSON.stringify({ cssText, device, layouts, mockTexts })
    );
  }, [cssText, device, layouts, mockTexts]);

  const parseResult = useMemo(() => {
    try {
      return {
        parsed: JSON.parse(copyText),
        error: "",
      };
    } catch (error) {
      return {
        parsed: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [copyText]);

  useEffect(() => {
    if (!parseResult.parsed) return;
    window.localStorage.setItem(SITE_COPY_DRAFT_KEY, JSON.stringify(parseResult.parsed));
    frameRef.current?.contentWindow?.dispatchEvent(new Event("portfolio-site-copy-draft"));
  }, [parseResult]);

  const layoutCss = useMemo(() => {
    const value = layouts[device];
    return `
/* Final Polish Lab layout mockup — preview only */
.career-state-copy {
  left: ${value.stageX}px !important;
  top: ${value.stageY}px !important;
}
.career-state-copy.is-intro {
  left: ${value.openingX}px !important;
  top: ${value.openingY}% !important;
  transform: translateY(-50%) !important;
}
.career-state-intro-wordmark {
  font-size: ${value.openingSize}px !important;
}
.career-state-copy:not(.is-intro) h1 {
  font-size: ${value.stageSize}px !important;
}
.career-state-steps {
  left: ${value.dotsX}px !important;
  top: ${value.dotsY}% !important;
}
.career-state-scroll-hint {
  bottom: ${value.scrollBottom}px !important;
}
`;
  }, [device, layouts]);

  const renderMockTexts = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    let root = doc.getElementById("career-os-polish-mock-texts");
    if (!root) {
      root = doc.createElement("div");
      root.id = "career-os-polish-mock-texts";
      root.setAttribute("aria-hidden", "true");
      doc.body.appendChild(root);
    }

    root.innerHTML = "";
    root.style.position = "fixed";
    root.style.inset = "0";
    root.style.zIndex = "9998";
    root.style.pointerEvents = "none";

    mockTexts
      .filter((item) => item.device === device)
      .forEach((item) => {
        const node = doc.createElement("div");
        node.textContent = item.text;
        node.style.position = "absolute";
        node.style.left = `${item.x}%`;
        node.style.top = `${item.y}%`;
        node.style.transform = "translate(-50%, -50%)";
        node.style.color = "#f4f6f8";
        node.style.font = `600 ${item.size}px/1.05 Inter, system-ui, sans-serif`;
        node.style.letterSpacing = "-0.035em";
        node.style.whiteSpace = "pre-wrap";
        node.style.textAlign = "center";
        node.style.textShadow = "0 0 18px rgba(0,0,0,.55)";
        node.style.padding = "4px 6px";
        node.style.border = "1px dashed rgba(190,215,244,.26)";
        node.style.borderRadius = "7px";
        node.style.background = "rgba(5,9,14,.18)";
        root!.appendChild(node);
      });
  }, [device, mockTexts]);

  const applyPreview = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    let style = doc.getElementById("career-os-polish-lab-overrides") as HTMLStyleElement | null;
    if (!style) {
      style = doc.createElement("style");
      style.id = "career-os-polish-lab-overrides";
      doc.head.appendChild(style);
    }
    style.textContent = `${cssText}\n${layoutCss}`;
    renderMockTexts();
  }, [cssText, layoutCss, renderMockTexts]);

  useEffect(() => {
    applyPreview();
  }, [applyPreview, frameReady]);

  useEffect(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    const previousCursor = doc.documentElement.style.cursor;
    if (addTextMode) doc.documentElement.style.cursor = "crosshair";

    const onClick = (event: MouseEvent) => {
      if (!addTextMode) return;
      event.preventDefault();
      event.stopPropagation();

      const text = window.prompt("Text to place on this preview:");
      if (!text?.trim()) {
        setAddTextMode(false);
        return;
      }

      const viewportWidth = Math.max(1, doc.documentElement.clientWidth);
      const viewportHeight = Math.max(1, doc.documentElement.clientHeight);
      const next: MockText = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        device,
        x: Math.max(0, Math.min(100, (event.clientX / viewportWidth) * 100)),
        y: Math.max(0, Math.min(100, (event.clientY / viewportHeight) * 100)),
        size: device === "mobile" ? 24 : 32,
        text: text.trim(),
      };

      setMockTexts((current) => [...current, next]);
      setAddTextMode(false);
    };

    doc.addEventListener("click", onClick, true);
    return () => {
      doc.removeEventListener("click", onClick, true);
      doc.documentElement.style.cursor = previousCursor;
    };
  }, [addTextMode, device, frameReady]);

  const updateLayout = (key: keyof LayoutValues, value: number) => {
    setLayouts((current) => ({
      ...current,
      [device]: {
        ...current[device],
        [key]: value,
      },
    }));
  };

  const updateMockText = (id: string, patch: Partial<MockText>) => {
    setMockTexts((current) =>
      current.map((item) => item.id === id ? { ...item, ...patch } : item)
    );
  };

  const reset = () => {
    setCopyText(JSON.stringify(defaultCopy, null, 2));
    setCssText(defaultCss);
    setLayouts(defaultLayouts);
    setMockTexts([]);
    setDevice("desktop");
    setAddTextMode(false);
    window.localStorage.removeItem(SITE_COPY_DRAFT_KEY);
    window.localStorage.removeItem(LAB_STATE_KEY);
    frameRef.current?.contentWindow?.dispatchEvent(new Event("portfolio-site-copy-draft"));
    setFrameVersion((value) => value + 1);
  };

  const resetCurrentLayout = () => {
    setLayouts((current) => ({
      ...current,
      [device]: { ...defaultLayouts[device] },
    }));
    setMockTexts((current) => current.filter((item) => item.device !== device));
  };

  const copyDraft = async () => {
    const payload = [
      "SITE COPY JSON",
      copyText,
      "",
      "LAYOUT PRESETS JSON",
      JSON.stringify(layouts, null, 2),
      "",
      "MOCKUP TEXT ANNOTATIONS JSON",
      JSON.stringify(mockTexts, null, 2),
      "",
      "CSS OVERRIDES",
      cssText,
    ].join("\n");
    await navigator.clipboard.writeText(payload);
  };

  const currentLayout = layouts[device];
  const visibleMockTexts = mockTexts.filter((item) => item.device === device);

  return (
    <div className="polish-lab">
      <aside className="polish-lab-editor">
        <div className="polish-lab-head">
          <div>
            <div className="polish-lab-kicker">FINAL POLISH LAB</div>
            <h1>Copy + visual tuning</h1>
          </div>
          <a href={toPublicPath("/")} target="_blank" rel="noreferrer">Open preview ↗</a>
        </div>

        <div className="polish-lab-note">
          Copy, position and size changes stay inside this Lab until you send the final draft.
          Added mockup text is also Lab-only and never appears on the real site.
        </div>

        <div className="polish-lab-tabs" role="tablist" aria-label="Polish editor mode">
          <button type="button" className={tab === "copy" ? "active" : ""} onClick={() => setTab("copy")}>SITE COPY</button>
          <button type="button" className={tab === "layout" ? "active" : ""} onClick={() => setTab("layout")}>LAYOUT</button>
          <button type="button" className={tab === "css" ? "active" : ""} onClick={() => setTab("css")}>CSS</button>
        </div>

        {tab === "copy" && (
          <div className="polish-lab-editor-body">
            <textarea
              aria-label="Canonical site copy JSON"
              spellCheck={false}
              value={copyText}
              onChange={(event) => setCopyText(event.target.value)}
            />
            <div className={parseResult.error ? "polish-lab-status error" : "polish-lab-status"}>
              {parseResult.error ? `JSON error: ${parseResult.error}` : "Valid JSON · real preview updates live"}
            </div>
          </div>
        )}

        {tab === "layout" && (
          <div className="polish-lab-layout-body">
            <div className="polish-control-group">
              <div className="polish-control-group-head">
                <strong>Opening identity</strong>
                <span>{device}</span>
              </div>
              <Slider label="Left / right" value={currentLayout.openingX} min={0} max={deviceWidths[device] - 40} unit="px" onChange={(value) => updateLayout("openingX", value)} />
              <Slider label="Up / down" value={currentLayout.openingY} min={15} max={85} unit="%" onChange={(value) => updateLayout("openingY", value)} />
              <Slider label="Name size" value={currentLayout.openingSize} min={28} max={150} unit="px" onChange={(value) => updateLayout("openingSize", value)} />
            </div>

            <div className="polish-control-group">
              <div className="polish-control-group-head">
                <strong>Career stage text</strong>
                <span>01 → 05</span>
              </div>
              <Slider label="Left / right" value={currentLayout.stageX} min={0} max={deviceWidths[device] - 40} unit="px" onChange={(value) => updateLayout("stageX", value)} />
              <Slider label="Up / down" value={currentLayout.stageY} min={60} max={420} unit="px" onChange={(value) => updateLayout("stageY", value)} />
              <Slider label="Title size" value={currentLayout.stageSize} min={20} max={90} unit="px" onChange={(value) => updateLayout("stageSize", value)} />
            </div>

            <div className="polish-control-group">
              <div className="polish-control-group-head">
                <strong>Progress + scroll cue</strong>
                <span>Lab preview</span>
              </div>
              <Slider label="Dots left / right" value={currentLayout.dotsX} min={0} max={160} unit="px" onChange={(value) => updateLayout("dotsX", value)} />
              <Slider label="Dots up / down" value={currentLayout.dotsY} min={10} max={90} unit="%" onChange={(value) => updateLayout("dotsY", value)} />
              <Slider label="Scroll cue from bottom" value={currentLayout.scrollBottom} min={0} max={120} unit="px" onChange={(value) => updateLayout("scrollBottom", value)} />
            </div>

            <div className="polish-control-group">
              <div className="polish-control-group-head">
                <strong>Click-to-add mockup text</strong>
                <span>Lab only</span>
              </div>
              <button
                type="button"
                className={addTextMode ? "polish-add-text active" : "polish-add-text"}
                onClick={() => setAddTextMode((value) => !value)}
              >
                {addTextMode ? "Click a position in the preview…" : "+ Add text on preview"}
              </button>
              {visibleMockTexts.length === 0 && (
                <p className="polish-empty-note">No mockup text on this device yet.</p>
              )}
              {visibleMockTexts.map((item) => (
                <div className="polish-mock-row" key={item.id}>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(event) => updateMockText(item.id, { text: event.target.value })}
                    aria-label="Mockup text"
                  />
                  <Slider label="X" value={Math.round(item.x)} min={0} max={100} unit="%" onChange={(value) => updateMockText(item.id, { x: value })} />
                  <Slider label="Y" value={Math.round(item.y)} min={0} max={100} unit="%" onChange={(value) => updateMockText(item.id, { y: value })} />
                  <Slider label="Size" value={item.size} min={10} max={96} unit="px" onChange={(value) => updateMockText(item.id, { size: value })} />
                  <button type="button" className="polish-remove-text" onClick={() => setMockTexts((current) => current.filter((row) => row.id !== item.id))}>Remove</button>
                </div>
              ))}
              <button type="button" className="polish-reset-layout" onClick={resetCurrentLayout}>Reset {device} layout</button>
            </div>
          </div>
        )}

        {tab === "css" && (
          <div className="polish-lab-editor-body">
            <textarea
              aria-label="CSS overrides"
              spellCheck={false}
              value={cssText}
              onChange={(event) => setCssText(event.target.value)}
            />
            <div className="polish-lab-status">Preview-only CSS · safe to experiment</div>
          </div>
        )}

        <div className="polish-lab-actions">
          <button type="button" onClick={copyDraft}>Copy final draft</button>
          <button type="button" onClick={() => setFrameVersion((value) => value + 1)}>Reload preview</button>
          <button type="button" onClick={reset}>Reset all</button>
        </div>
      </aside>

      <section className="polish-lab-preview">
        <div className="polish-lab-preview-bar">
          <div className="polish-device-switcher" aria-label="Preview device">
            {(["desktop", "tablet", "mobile"] as Device[]).map((item) => (
              <button
                key={item}
                type="button"
                className={device === item ? "active" : ""}
                onClick={() => {
                  setDevice(item);
                  setAddTextMode(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <span>{addTextMode ? "Click preview to place text" : `${deviceWidths[device]} px`}</span>
        </div>

        <div className={`polish-frame-shell is-${device}`}>
          <iframe
            key={frameVersion}
            ref={frameRef}
            title="Redesign live preview"
            src={toPublicPath("/")}
            style={{ width: deviceWidths[device] }}
            onLoad={() => {
              setFrameReady((value) => value + 1);
              applyPreview();
            }}
          />
        </div>
      </section>
    </div>
  );
}

export default PolishLab;
