import React, { useEffect, useState } from "react";
import { toPublicPath } from "../routes";
import Wordmark from "./Wordmark";

type SiteNavProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

function SiteNav({ currentPath, onNavigate }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <header className={`site-nav-shell nav-island-shell ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-island-row">
        <nav className="site-nav main-nav-island glass-surface" aria-label="Primary">
          <a
            href={toPublicPath("/education")}
            className={currentPath === "/education" ? "active" : ""}
            onClick={(event) => go(event, "/education")}
          >
            EDUCATION
          </a>

          <a
            href={toPublicPath("/")}
            className={`brand-mark ${currentPath === "/" ? "active" : ""}`}
            onClick={(event) => go(event, "/")}
            aria-label="S. Haghi — Home"
          >
            <Wordmark variant="nav" />
          </a>

          <a
            href={toPublicPath("/work")}
            className={currentPath === "/work" ? "active" : ""}
            onClick={(event) => go(event, "/work")}
          >
            WORK
          </a>
        </nav>

        <a className="cv-nav-island glass-surface" href={toPublicPath("/cv")} aria-label="Open CV">
          CV
        </a>
      </div>
    </header>
  );
}

export default SiteNav;
