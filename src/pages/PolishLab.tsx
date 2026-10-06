import React, { useEffect, useMemo, useRef, useState } from "react";
import { toPublicPath } from "../routes";
import "./polishLab.scss";

type Device = "desktop" | "tablet" | "mobile";
type Tab = "copy" | "css";

const STORAGE_KEY = "portfolio-polish-lab-v1";

const defaultCopy = {
  educationTitle: "Current direction, built on an engineering foundation.",
  educationCopy: "From Computer Engineering into Quantum Technologies, with focus spanning computation, communication, photonics and devices.",
  expertiseTitle: "Where my education and technical work connect.",
  expertiseCopy: "A readable index of the domains that recur across my coursework, projects and systems.",
  workTitle: "Selected technical work.",
  workCopy: "Three representative projects and systems; the Work page carries the broader set.",
  affiliationsEyebrow: "AFFILIATIONS & CONTEXT",
  contactTitle: "Seeking an internship."
};

const defaultCss = `/* Temporary preview-only CSS overrides.
   Nothing here changes the redesign branch until we explicitly implement it. */

/* Example:
[data-scroll-section="education"] {
  padding-top: 96px;
}
*/`;

const deviceWidths: Record<Device, number> = {
  desktop: 1440,
  tablet: 820,
  mobile: 390,
};

function PolishLab() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [tab, setTab] = useState<Tab>("copy");
  const [copyText, setCopyText] = useState(() => JSON.stringify(defaultCopy, null, 2));
  const [cssText, setCssText] = useState(defaultCss);
  const [frameVersion, setFrameVersion] = useState(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed.copyText === "string") setCopyText(parsed.copyText);
      if (typeof parsed.cssText === "string") setCssText(parsed.cssText);
      if (parsed.device === "desktop" || parsed.device === "tablet" || parsed.device === "mobile") {
        setDevice(parsed.device);
      }
    } catch {
      // Keep defaults if a previous local draft is malformed.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ copyText, cssText, device }));
  }, [copyText, cssText, device]);

  const parseResult = useMemo(() => {
    try {
      return {
        parsed: JSON.parse(copyText) as Record<string, string>,
        error: "",
      };
    } catch (error) {
      return {
        parsed: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [copyText]);

  const applyPatches = () => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!doc) return;

    let style = doc.getElementById("career-os-polish-lab-overrides") as HTMLStyleElement | null;
    if (!style) {
      style = doc.createElement("style");
      style.id = "career-os-polish-lab-overrides";
      doc.head.appendChild(style);
    }
    style.textContent = cssText;

    if (!parseResult.parsed) return;

    const parsedCopy = parseResult.parsed;
    const patches: Array<[string, string | undefined]> = [
      ['#education-preview .section-heading h2', parsedCopy.educationTitle],
      ['#education-preview .section-heading p', parsedCopy.educationCopy],
      ['.expertise-section .section-heading h2', parsedCopy.expertiseTitle],
      ['.expertise-section .section-heading p', parsedCopy.expertiseCopy],
      ['[data-scroll-section="work"] .section-heading h2', parsedCopy.workTitle],
      ['[data-scroll-section="work"] .section-heading p', parsedCopy.workCopy],
      ['[data-scroll-section="affiliations"] .eyebrow', parsedCopy.affiliationsEyebrow],
      ['[data-scroll-section="contact"] h2', parsedCopy.contactTitle],
    ];

    patches.forEach(([selector, value]) => {
      if (typeof value !== "string") return;
      const node = doc.querySelector(selector);
      if (node) node.textContent = value;
    });
  };

  useEffect(() => {
    applyPatches();
  }, [copyText, cssText, frameVersion, parseResult]);

  const reset = () => {
    setCopyText(JSON.stringify(defaultCopy, null, 2));
    setCssText(defaultCss);
    setDevice("desktop");
    window.localStorage.removeItem(STORAGE_KEY);
    setFrameVersion((value) => value + 1);
  };

  const copyDraft = async () => {
    const payload = [
      "COPY JSON",
      copyText,
      "",
      "CSS OVERRIDES",
      cssText,
    ].join("\n");
    await navigator.clipboard.writeText(payload);
  };

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
          This is a browser-only scratchpad. It does not commit or publish changes.
          The site source is React/TypeScript, so this lab exposes the editable copy as JSON
          plus CSS overrides rather than pretending the app is one HTML file.
        </div>

        <div className="polish-lab-tabs" role="tablist" aria-label="Polish editor mode">
          <button type="button" className={tab === "copy" ? "active" : ""} onClick={() => setTab("copy")}>COPY JSON</button>
          <button type="button" className={tab === "css" ? "active" : ""} onClick={() => setTab("css")}>CSS</button>
        </div>

        {tab === "copy" ? (
          <div className="polish-lab-editor-body">
            <textarea
              aria-label="Homepage copy JSON"
              spellCheck={false}
              value={copyText}
              onChange={(event) => setCopyText(event.target.value)}
            />
            <div className={parseResult.error ? "polish-lab-status error" : "polish-lab-status"}>
              {parseResult.error ? `JSON error: ${parseResult.error}` : "Valid JSON · preview updates live"}
            </div>
          </div>
        ) : (
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
          <button type="button" onClick={copyDraft}>Copy draft</button>
          <button type="button" onClick={() => setFrameVersion((value) => value + 1)}>Reload preview</button>
          <button type="button" onClick={reset}>Reset</button>
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
                onClick={() => setDevice(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span>{deviceWidths[device]} px</span>
        </div>

        <div className={`polish-frame-shell is-${device}`}>
          <iframe
            key={frameVersion}
            ref={frameRef}
            title="Redesign live preview"
            src={toPublicPath("/")}
            style={{ width: deviceWidths[device] }}
            onLoad={applyPatches}
          />
        </div>
      </section>
    </div>
  );
}

export default PolishLab;
