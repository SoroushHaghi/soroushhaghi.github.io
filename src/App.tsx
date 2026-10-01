import React, { useEffect, useState } from "react";
import SiteNav from "./components/SiteNav";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import EducationPage from "./pages/EducationPage";
import StyleLab from "./pages/StyleLab";
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
    return normalizePath(window.location.pathname);
  });

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [path]);

  const navigate = (nextPath: string) => {
    const normalized = normalizePath(nextPath);
    if (normalized === path) return;
    window.history.pushState({}, "", normalized);
    setPath(normalized);
  };

  const renderPage = () => {
    if (path === "/work") return <WorkPage />;
    if (path === "/education") return <EducationPage />;
    if (path === "/lab" && process.env.NODE_ENV !== "production") return <StyleLab />;
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
