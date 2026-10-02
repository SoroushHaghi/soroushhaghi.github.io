import React, { useEffect, useRef, useState } from "react";
import { organizationMarks } from "../siteConfig";

const desktopVisibleCount = 6;
const mobileVisibleCount = 3;
const rotationMs = 2800;

type Mark = (typeof organizationMarks)[number];

const getVisibleCount = () =>
  window.matchMedia("(max-width: 900px)").matches
    ? mobileVisibleCount
    : desktopVisibleCount;

function MarkVisual({ item }: { item: Mark }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [item.id]);

  return (
    <span
      className="organization-logo-frame"
      style={{ "--logo-scale": String(item.scale) } as React.CSSProperties}
    >
      {failed ? (
        <span className="organization-mark-fallback">{item.short}</span>
      ) : "variant" in item && item.variant === "luh-mark" ? (
        <span className="organization-special-logo organization-special-logo-luh" aria-hidden="true">
          <img
            key={item.id}
            src={item.logo}
            alt=""
            loading="eager"
            decoding="async"
            onError={() => setFailed(true)}
          />
        </span>
      ) : (
        <img
          key={item.id}
          src={item.logo}
          alt=""
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {"caption" in item && item.caption && (
        <span className="organization-mark-caption">{item.caption}</span>
      )}
    </span>
  );
}

function AffiliationRail() {
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  const [visible, setVisible] = useState(() =>
    organizationMarks.slice(0, getVisibleCount())
  );
  const cursor = useRef(visibleCount);
  const slot = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const onChange = () =>
      setVisibleCount(media.matches ? mobileVisibleCount : desktopVisibleCount);

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setVisible(organizationMarks.slice(0, visibleCount));
    cursor.current = visibleCount;
    slot.current = 0;
  }, [visibleCount]);

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
  }, [visibleCount]);

  return (
    <div className="organization-rail" aria-label="Affiliations and organizational context">
      {visible.map((item, index) => (
        <div
          className="organization-mark"
          aria-label={item.name}
          title={item.name}
          key={index}
          style={{ "--brand-hue": item.hue } as React.CSSProperties}
        >
          <span className="organization-mark-content" key={item.id}>
            <MarkVisual item={item} />
          </span>
        </div>
      ))}
    </div>
  );
}

export default AffiliationRail;
