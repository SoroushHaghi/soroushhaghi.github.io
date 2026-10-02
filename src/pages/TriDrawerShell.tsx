import React, { useEffect, useMemo, useRef } from "react";
import EducationPage from "./EducationPage";
import HomePage from "./HomePage";
import WorkPage from "./WorkPage";

type MainPath = "/" | "/education" | "/work";

type Props = {
  currentPath: MainPath;
  resetVersion: number;
  onNavigate: (path: MainPath, preserveScroll?: boolean) => void;
};

const paneOrder: MainPath[] = ["/education", "/", "/work"];

function TriDrawerShell({ currentPath, resetVersion, onNavigate }: Props) {
  const educationRef = useRef<HTMLElement>(null);
  const homeRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const paneRefs = useMemo(
    () => ({
      "/education": educationRef,
      "/": homeRef,
      "/work": workRef,
    }),
    []
  );

  const activeIndex = paneOrder.indexOf(currentPath);

  useEffect(() => {
    const target = paneRefs[currentPath].current;
    if (!target) return;
    target.scrollTo({ top: 0, behavior: "auto" });
  }, [resetVersion, currentPath, paneRefs]);

  const activate = (path: MainPath, preserveScroll = true) => {
    if (path === currentPath) return;
    onNavigate(path, preserveScroll);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a,button,input,summary,.timeline-filter-row")) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.2) return;

    const nextIndex = dx < 0
      ? Math.min(paneOrder.length - 1, activeIndex + 1)
      : Math.max(0, activeIndex - 1);

    const nextPath = paneOrder[nextIndex];
    if (nextPath !== currentPath) activate(nextPath, true);
  };

  return (
    <div
      className={`tri-drawer-shell active-${currentPath === "/" ? "home" : currentPath.slice(1)}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <section
        ref={educationRef}
        className={`tri-drawer drawer-education ${currentPath === "/education" ? "is-active" : ""}`}
        data-drawer="education"
        aria-label="Education drawer"
      >
        <EducationPage />
      </section>

      <section
        ref={homeRef}
        className={`tri-drawer drawer-home ${currentPath === "/" ? "is-active" : ""}`}
        data-drawer="home"
        aria-label="Home drawer"
      >
        <HomePage onNavigate={(path) => onNavigate(path as MainPath, false)} />
      </section>

      <section
        ref={workRef}
        className={`tri-drawer drawer-work ${currentPath === "/work" ? "is-active" : ""}`}
        data-drawer="work"
        aria-label="Work drawer"
      >
        <WorkPage />
      </section>
    </div>
  );
}

export default TriDrawerShell;
