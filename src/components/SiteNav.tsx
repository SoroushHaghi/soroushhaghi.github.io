import React, { useEffect, useState } from "react";
import { navItems } from "../siteConfig";
import { toPublicPath } from "../routes";

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

  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (external) return;
    event.preventDefault();
    setMobileOpen(false);
    onNavigate(href);
  };

  return (
    <>
      <header className={`site-nav-shell ${scrolled ? "is-scrolled" : ""} ${mobileOpen ? "is-open" : ""}`}>
        <nav className="site-nav glass-surface" aria-label="Primary">
          <a
            href={toPublicPath("/")}
            className="brand-mark"
            onClick={(event) => go(event, "/")}
            aria-label="S. Haghi — Home"
          >
            <span className="brand-short">SH</span>
            <span className="brand-long">S. HAGHI</span>
          </a>

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
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="mobile-nav-panel glass-surface">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={toPublicPath(item.href)}
              onClick={(event) => go(event, item.href, item.external)}
            >
              {item.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default SiteNav;
