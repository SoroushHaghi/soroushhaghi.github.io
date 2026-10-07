import React, { useEffect, useRef, useState } from "react";
import { organizationMarks } from "../siteConfig";

const visibleCount = 4;
const rotationMs = 2800;

type Mark = (typeof organizationMarks)[number];

function MarkVisual({ item }: { item: Mark }) {
  const [failed, setFailed] = useState(false);
  const variant = "variant" in item ? item.variant : "standard";

  useEffect(() => {
    setFailed(false);
  }, [item.id]);

  return (
    <span
      className={`organization-logo-frame organization-logo-frame-${variant}`}
      style={{ "--logo-scale": String(item.scale) } as React.CSSProperties}
    >
      {failed ? (
        <span className="organization-mark-fallback">{item.short}</span>
      ) : (
        <span className={`organization-logo-asset organization-logo-asset-${variant}`}>
          <img
            key={item.id}
            src={item.logo}
            alt={`${item.name} logo`}
            loading="eager"
            decoding="async"
            draggable={false}
            onError={() => setFailed(true)}
          />
        </span>
      )}
    </span>
  );
}

function AffiliationRail() {
  const [visible, setVisible] = useState(() =>
    organizationMarks.slice(0, visibleCount)
  );
  const cursor = useRef(visibleCount);
  const slot = useRef(0);

  useEffect(() => {
    organizationMarks.forEach((item) => {
      const image = new Image();
      image.decoding = "async";
      image.src = item.logo;
    });

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
    }, rotationMs);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="organization-rail" aria-label="Affiliations and organizational context">
      {visible.map((item, index) => (
        <a
          className="organization-mark"
          data-brand={item.id}
          aria-label={item.name}
          title={item.name}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          key={index}
          style={{ "--brand-hue": item.hue } as React.CSSProperties}
        >
          <span className="organization-mark-content" key={item.id}>
            <MarkVisual item={item} />
          </span>
        </a>
      ))}
    </div>
  );
}

export default AffiliationRail;
