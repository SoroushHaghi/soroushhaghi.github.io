import React, { useEffect, useState } from "react";
import SiteNav from "./components/SiteNav";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import EducationPage from "./pages/EducationPage";
import StyleLab from "./pages/StyleLab";
import { fromPublicPath, toPublicPath } from "./routes";
import "./index.scss";

type ThemeMode = "system" | "light" | "dark";

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

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem("portfolio-theme-mode");
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");

    const applyTheme = () => {
      const resolved = themeMode === "system" ? (media.matches ? "light" : "dark") : themeMode;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.dataset.themeMode = themeMode;
      window.localStorage.setItem("portfolio-theme-mode", themeMode);
    };

    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [themeMode]);

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
    if (path === "/lab" && (process.env.NODE_ENV !== "production" || process.env.REACT_APP_ENABLE_LAB === "true")) {
      return <StyleLab themeMode={themeMode} onThemeModeChange={setThemeMode} />;
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
