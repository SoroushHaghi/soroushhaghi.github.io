import React, { useEffect, useState } from "react";
import SiteNav from "./components/SiteNav";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import EducationPage from "./pages/EducationPage";
import StyleLab from "./pages/StyleLab";
import HeroLab from "./pages/HeroLab";
import { fromPublicPath, toPublicPath } from "./routes";
import useAdaptiveSectionScroll from "./hooks/useAdaptiveSectionScroll";
import "./index.scss";


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
      <SiteNav currentPath={path} onNavigate={navigate} />
      {renderPage()}
      <footer className="site-footer page-shell">
        <span>© {new Date().getFullYear()} S. Haghi</span>
        <span>Built as a modular portfolio system.</span>
      </footer>
    </div>
  );
}

export default App;
