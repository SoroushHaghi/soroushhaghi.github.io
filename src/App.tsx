import React, { useEffect, useState } from "react";
import SiteNav from "./components/SiteNav";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import EducationPage from "./pages/EducationPage";
import StyleLab from "./pages/StyleLab";
import HeroLab from "./pages/HeroLab";
import WorkLab from "./pages/WorkLab";
import EducationLab from "./pages/EducationLab";
import BackgroundLab from "./pages/BackgroundLab";
import ExpertiseLab from "./pages/ExpertiseLab";
import DynamicBackground from "./components/DynamicBackground";
import { backgroundDefaults, backgroundStorageKey } from "./backgroundConfig";
import { fromPublicPath, toPublicPath } from "./routes";
import useAdaptiveSectionScroll from "./hooks/useAdaptiveSectionScroll";
import "./index.scss";
import "./dynamicBackground.scss";


const normalizePath = (path: string) => {
  const cleaned = path.replace(/\/+$/, "");
  return cleaned || "/";
};

function App() {
  const [path, setPath] = useState(() => {
    const restoredPath = sessionStorage.getItem("spaPath");
    if (restoredPath) {
      sessionStorage.removeItem("spaPath");
      window.history.replaceState({}, "", restoredPath);
    }
    return normalizePath(fromPublicPath(window.location.pathname));
  });

  useAdaptiveSectionScroll({ enabled: path === "/" });

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.dataset.themeMode = "dark";
    window.localStorage.setItem("portfolio-theme-mode", "dark");
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(backgroundStorageKey);
      const values = saved ? { ...backgroundDefaults, ...JSON.parse(saved) } : backgroundDefaults;
      const root = document.documentElement;
      root.dataset.backgroundMode = values.mode;
      root.style.setProperty("--dynamic-hue", String(values.hue));
      root.style.setProperty("--dynamic-intensity", String(values.intensity));
      root.style.setProperty("--dynamic-edge", String(values.edge));
      root.style.setProperty("--dynamic-speed", values.speed + "s");
      root.style.setProperty("--dynamic-field-scale", String(values.scale));
    } catch {
      const root = document.documentElement;
      root.dataset.backgroundMode = backgroundDefaults.mode;
      root.style.setProperty("--dynamic-hue", String(backgroundDefaults.hue));
      root.style.setProperty("--dynamic-intensity", String(backgroundDefaults.intensity));
      root.style.setProperty("--dynamic-edge", String(backgroundDefaults.edge));
      root.style.setProperty("--dynamic-speed", backgroundDefaults.speed + "s");
      root.style.setProperty("--dynamic-field-scale", String(backgroundDefaults.scale));
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-style-lab-v1");
      if (!saved) return;
      const values = JSON.parse(saved);
      const root = document.documentElement;
      if (typeof values.glass === "number") root.style.setProperty("--glass-alpha", String(values.glass));
      if (typeof values.blur === "number") root.style.setProperty("--glass-blur", values.blur + "px");
      if (typeof values.border === "number") root.style.setProperty("--glass-border-alpha", String(values.border));
      if (typeof values.navRadius === "number") root.style.setProperty("--nav-radius", values.navRadius + "px");
      if (typeof values.surfaceRadius === "number") root.style.setProperty("--surface-radius", values.surfaceRadius + "px");
      if (typeof values.shadow === "number") root.style.setProperty("--shadow-alpha", String(values.shadow));
      if (typeof values.accentHue === "number") root.style.setProperty("--accent-hue", String(values.accentHue));
      if (typeof values.backgroundLightness === "number") root.style.setProperty("--bg-lightness", values.backgroundLightness + "%");
      if (typeof values.backgroundDepth === "number") root.style.setProperty("--bg-depth-alpha", String(values.backgroundDepth));
    } catch {
      // Ignore malformed local preview state and keep repository defaults.
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-education-lab-v1");
      if (!saved) return;
      const values = JSON.parse(saved);
      const root = document.documentElement;
      if (typeof values.artifactWidth === "number") root.style.setProperty("--education-artifact-width", values.artifactWidth + "%");
      if (typeof values.artifactHeight === "number") root.style.setProperty("--education-artifact-height", values.artifactHeight + "px");
      if (typeof values.titleScale === "number") root.style.setProperty("--education-title-scale", String(values.titleScale));
      if (typeof values.rowSpace === "number") root.style.setProperty("--education-row-space", values.rowSpace + "px");
    } catch {
      // Keep repository defaults if local Education Lab state is malformed.
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-work-lab-v1");
      if (!saved) return;
      const values = JSON.parse(saved);
      const root = document.documentElement;
      if (typeof values.artifactWidth === "number") root.style.setProperty("--work-artifact-width", values.artifactWidth + "%");
      if (typeof values.artifactHeight === "number") root.style.setProperty("--work-artifact-height", values.artifactHeight + "px");
      if (typeof values.rowSpace === "number") root.style.setProperty("--work-row-space", values.rowSpace + "px");
      if (typeof values.titleScale === "number") root.style.setProperty("--work-title-scale", String(values.titleScale));
    } catch {
      // Keep repository defaults if local Work Lab state is malformed.
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-hero-lab-v1");
      if (!saved) return;
      const values = JSON.parse(saved);
      const root = document.documentElement;
      if (typeof values.height === "number") root.style.setProperty("--hero-min-height", values.height + "svh");
      if (typeof values.gap === "number") root.style.setProperty("--hero-gap", values.gap + "px");
      if (typeof values.nameScale === "number") root.style.setProperty("--hero-name-scale", String(values.nameScale));
      if (typeof values.visualScale === "number") root.style.setProperty("--hero-visual-scale", String(values.visualScale));
    } catch {
      // Keep repository defaults if local preview state is malformed.
    }
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(fromPublicPath(window.location.pathname)));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [path]);

  const navigate = (nextPath: string) => {
    const normalized = normalizePath(nextPath);
    if (normalized === path) return;
    window.history.pushState({}, "", toPublicPath(normalized));
    setPath(normalized);
  };

  const renderPage = () => {
    if (path === "/work") return <WorkPage />;
    if (path === "/education") return <EducationPage />;
    if (path === "/lab/background" && (process.env.NODE_ENV !== "production" || process.env.REACT_APP_ENABLE_LAB === "true")) {
      return <BackgroundLab />;
    }
    if (path === "/lab/expertise" && (process.env.NODE_ENV !== "production" || process.env.REACT_APP_ENABLE_LAB === "true")) {
      return <ExpertiseLab />;
    }
    if (path === "/lab/education" && (process.env.NODE_ENV !== "production" || process.env.REACT_APP_ENABLE_LAB === "true")) {
      return <EducationLab />;
    }
    if (path === "/lab/work" && (process.env.NODE_ENV !== "production" || process.env.REACT_APP_ENABLE_LAB === "true")) {
      return <WorkLab />;
    }
    if (path === "/lab/hero" && (process.env.NODE_ENV !== "production" || process.env.REACT_APP_ENABLE_LAB === "true")) {
      return <HeroLab />;
    }
    if (path === "/lab" && (process.env.NODE_ENV !== "production" || process.env.REACT_APP_ENABLE_LAB === "true")) {
      return <StyleLab />;
    }
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="site-root">
      <DynamicBackground />
      <SiteNav currentPath={path} onNavigate={navigate} />
      {renderPage()}
      <footer className="site-footer page-shell">
        <span>© {new Date().getFullYear()} S. Haghi</span>
        <span>All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
