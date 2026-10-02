import React, { useEffect, useState } from "react";
import { navItems } from "../siteConfig";
import { toPublicPath } from "../routes";
import HomeIcon from "./HomeIcon";

type SiteNavProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

function SiteNav({ currentPath, onNavigate }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (!mobileOpen) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    root.classList.add("mobile-nav-open");
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      root.classList.remove("mobile-nav-open");
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const currentLabel =
    currentPath === "/work" ? "WORK" :
    currentPath === "/education" ? "EDUCATION" :
    currentPath === "/" ? "HOME" : "";

  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    setMobileOpen(false);
    if (external) return;
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <>
      <header className={`site-nav-shell ${scrolled ? "is-scrolled" : ""} ${mobileOpen ? "is-open" : ""}`}>
        <nav className="site-nav glass-surface" aria-label="Primary">
          <div className="nav-home-cluster">
            <a
              href={toPublicPath("/")}
              className="brand-mark home-mark"
              onClick={(event) => go(event, "/")}
              aria-label="Home"
            >
              <HomeIcon />
            </a>
            <span className="nav-current-label">{currentLabel}</span>
          </div>

          <div className="desktop-nav">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={toPublicPath(item.href)}
                className={currentPath === item.href ? "active" : ""}
                onClick={(event) => go(event, item.href, item.external)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-primary-navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="mobile-nav-overlay">
          <button
            className="mobile-nav-backdrop"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-primary-navigation"
            className="mobile-nav-panel glass-surface"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={toPublicPath(item.href)}
                className={currentPath === item.href ? "active" : ""}
                onClick={(event) => go(event, item.href, item.external)}
              >
                {item.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SiteNav;
