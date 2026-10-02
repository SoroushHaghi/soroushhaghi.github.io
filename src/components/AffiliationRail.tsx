import React, { useEffect, useRef, useState } from "react";
import { organizationMarks } from "../siteConfig";

const visibleCount = 6;
const rotationMs = 2800;

type Mark = (typeof organizationMarks)[number];

function MarkVisual({ item }: { item: Mark }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [item.id]);

  if (failed) {
    return <span className="organization-mark-fallback">{item.short}</span>;
  }

  return (
    <img
      key={item.id}
      src={item.logo}
      alt=""
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function AffiliationRail() {
  const [visible, setVisible] = useState(() => organizationMarks.slice(0, visibleCount));
  const cursor = useRef(visibleCount);
  const slot = useRef(0);

  useEffect(() => {
    // Warm the image cache so a mark is ready before it rotates into view.
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
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.name}
          title={item.name}
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
