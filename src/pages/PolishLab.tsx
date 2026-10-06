import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import defaultCopy from "../content/siteCopy.json";
import { SITE_COPY_DRAFT_KEY } from "../content/useSiteCopy";
import { toPublicPath } from "../routes";
import "./polishLab.scss";

type Device = "desktop" | "tablet" | "mobile";
type Tab = "copy" | "css";

const LAB_STATE_KEY = "portfolio-polish-lab-v2";

const defaultCss = `/* Temporary preview-only CSS overrides.
   Nothing here changes the redesign branch until we explicitly implement it. */

/* Example:
.hero {
  min-height: 92svh;
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
  const [copyText, setCopyText] = useState(() => {
    try {
      return window.localStorage.getItem(SITE_COPY_DRAFT_KEY) || JSON.stringify(defaultCopy, null, 2);
    } catch {
      return JSON.stringify(defaultCopy, null, 2);
    }
  });
  const [cssText, setCssText] = useState(defaultCss);
  const [frameVersion, setFrameVersion] = useState(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LAB_STATE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed.cssText === "string") setCssText(parsed.cssText);
      if (parsed.device === "desktop" || parsed.device === "tablet" || parsed.device === "mobile") {
        setDevice(parsed.device);
      }
    } catch {
      // Keep defaults if a previous local draft is malformed.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LAB_STATE_KEY, JSON.stringify({ cssText, device }));
  }, [cssText, device]);

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

  const applyCss = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    let style = doc.getElementById("career-os-polish-lab-overrides") as HTMLStyleElement | null;
    if (!style) {
      style = doc.createElement("style");
      style.id = "career-os-polish-lab-overrides";
      doc.head.appendChild(style);
    }
    style.textContent = cssText;
  }, [cssText]);

  useEffect(() => {
    applyCss();
  }, [applyCss, frameVersion]);

  const reset = () => {
    setCopyText(JSON.stringify(defaultCopy, null, 2));
    setCssText(defaultCss);
    setDevice("desktop");
    window.localStorage.removeItem(SITE_COPY_DRAFT_KEY);
    window.localStorage.removeItem(LAB_STATE_KEY);
    frameRef.current?.contentWindow?.dispatchEvent(new Event("portfolio-site-copy-draft"));
    setFrameVersion((value) => value + 1);
  };

  const copyDraft = async () => {
    const payload = [
      "SITE COPY JSON",
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
          Every structural text field here feeds the real preview from one canonical content model.
          Career-State motion text and its machine-readable semantic transcript use the same values,
          so you do not maintain a second bot-only copy.
        </div>

        <div className="polish-lab-tabs" role="tablist" aria-label="Polish editor mode">
          <button type="button" className={tab === "copy" ? "active" : ""} onClick={() => setTab("copy")}>SITE COPY</button>
          <button type="button" className={tab === "css" ? "active" : ""} onClick={() => setTab("css")}>CSS</button>
        </div>

        {tab === "copy" ? (
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
          <button type="button" onClick={copyDraft}>Copy final draft</button>
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
            onLoad={applyCss}
          />
        </div>
      </section>
    </div>
  );
}

export default PolishLab;
