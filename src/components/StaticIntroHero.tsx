import React, { useEffect, useRef } from "react";
import { useSiteCopy } from "../content/useSiteCopy";
import Wordmark from "./Wordmark";
import "./staticIntroHero.scss";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (a: number, b: number, value: number) => {
  const t = clamp01((value - a) / Math.max(0.0001, b - a));
  return t * t * (3 - 2 * t);
};

function StaticIntroHero() {
  const copy = useSiteCopy();
  const rootRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => {
      const root = rootRef.current;
      if (!root || !visualRef.current) return;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = clamp01(-rect.top / travel);
      const fade = smooth(0.08, 0.92, progress);
      visualRef.current.style.opacity = String(1 - fade);
      visualRef.current.style.transform = `scale(${1 - fade * 0.025})`;
      visualRef.current.style.filter = `blur(${fade * 4}px)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const intro = copy.careerState.stages[0];

  return (
    <section ref={rootRef} className="static-intro-hero" aria-label="AI and Quantum portfolio introduction">
      <div className="static-intro-sticky">
        <div ref={visualRef} className="static-intro-visual" aria-hidden="true">
          <img
            src={`${process.env.PUBLIC_URL}/media/hero/hero-constellation.webp`}
            alt=""
            draggable={false}
          />
        </div>

        <div className="static-intro-vignette" aria-hidden="true" />

        <div className="static-intro-copy">
          <div className="static-intro-kicker">{intro.eyebrow}</div>
          <h1 className="hero-name static-intro-wordmark">
            <Wordmark variant="hero" />
          </h1>
        </div>

        <div className="static-intro-scroll" aria-hidden="true">
          <span>↓</span> {copy.careerState.scrollHint}
        </div>
      </div>
    </section>
  );
}

export default StaticIntroHero;
