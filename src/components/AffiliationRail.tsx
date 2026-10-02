import React, { useEffect, useRef, useState } from "react";
import { organizationMarks } from "../siteConfig";

const visibleCount = 5;

function AffiliationRail() {
  const [visible, setVisible] = useState(() => organizationMarks.slice(0, visibleCount));
  const cursor = useRef(visibleCount);
  const slot = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || organizationMarks.length <= visibleCount) return;

    const timer = window.setInterval(() => {
      setVisible((current) => {
        const next = [...current];
        next[slot.current] = organizationMarks[cursor.current % organizationMarks.length];
        slot.current = (slot.current + 1) % visibleCount;
        cursor.current = (cursor.current + 1) % organizationMarks.length;
        return next;
      });
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="organization-rail" aria-label="Affiliations and organizational context">
      {visible.map((item, index) => (
        <a
          className="organization-mark"
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name}
          key={index}
          style={{ "--brand-hue": item.hue } as React.CSSProperties}
        >
          <span className="organization-mark-glow" aria-hidden="true" />
          <img
            key={item.id}
            src={item.logo}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </a>
      ))}
    </div>
  );
}

export default AffiliationRail;
