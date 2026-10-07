import { useEffect } from "react";

type Options = {
  enabled: boolean;
  selector?: string;
};

const STEP_COOLDOWN_MS = 160;
const GESTURE_RESET_MS = 240;
const RESIZE_SETTLE_MS = 120;
const MIN_VERTICAL_DELTA = 0.5;

const getNavClearance = () => {
  const nav = document.querySelector<HTMLElement>(".site-nav-shell");
  if (!nav) return 0;
  const rect = nav.getBoundingClientRect();
  return Math.max(0, rect.bottom + 12);
};

const getVisibleSections = (selector: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (section) => section.offsetParent !== null
  );

const getSectionTops = (sections: HTMLElement[]) =>
  sections.map((section) => window.scrollY + section.getBoundingClientRect().top);

const getCurrentSectionIndex = (tops: number[], anchorY: number) => {
  let current = 0;

  for (let index = 0; index < tops.length; index += 1) {
    if (tops[index] <= anchorY + 2) current = index;
    else break;
  }

  return current;
};

export default function useAdaptiveSectionScroll({
  enabled,
  selector = "[data-scroll-section]",
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let lastStepAt = -Infinity;
    let lastWheelAt = -Infinity;
    let virtualIndex: number | null = null;
    let lastDirection = 0;
    let resizeTimer = 0;

    const syncClearance = () => {
      root.style.setProperty("--section-scroll-clearance", `${getNavClearance()}px`);
    };

    const scrollToSection = (
      section: HTMLElement,
      behavior: ScrollBehavior = reducedMotion.matches ? "auto" : "smooth"
    ) => {
      const clearance = getNavClearance();
      const targetTop =
        window.scrollY + section.getBoundingClientRect().top - clearance;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior,
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        Math.abs(event.deltaY) < MIN_VERTICAL_DELTA
      ) {
        return;
      }

      const source = event.target as HTMLElement | null;
      if (
        source?.closest(
          "input, textarea, select, [contenteditable='true'], [data-native-scroll]"
        )
      ) {
        return;
      }

      const sections = getVisibleSections(selector);
      if (sections.length < 2) return;

      const direction = Math.sign(event.deltaY);
      if (!direction) return;

      const now = performance.now();
      const newGesture = now - lastWheelAt > GESTURE_RESET_MS;
      lastWheelAt = now;

      // Keep the section system, but only add a short throttle. A user who
      // keeps scrolling can move through several sections quickly instead of
      // being locked until the previous smooth animation fully settles.
      if (!newGesture && now - lastStepAt < STEP_COOLDOWN_MS) {
        event.preventDefault();
        return;
      }

      const clearance = getNavClearance();
      const anchorY = window.scrollY + clearance;
      const tops = getSectionTops(sections);
      const actualIndex = getCurrentSectionIndex(tops, anchorY);

      if (newGesture || virtualIndex === null || direction !== lastDirection) {
        virtualIndex = actualIndex;
      }

      const targetIndex = virtualIndex + direction;

      // Keep native scrolling outside the managed range so the footer and page
      // boundaries remain naturally reachable.
      if (targetIndex < 0 || targetIndex >= sections.length) {
        virtualIndex = null;
        return;
      }

      event.preventDefault();
      lastStepAt = now;
      lastDirection = direction;
      virtualIndex = targetIndex;
      scrollToSection(sections[targetIndex]);
    };

    const realignAfterResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        virtualIndex = null;

        const sections = getVisibleSections(selector);
        if (!sections.length) return;

        const clearance = getNavClearance();
        const anchorY = window.scrollY + clearance;
        const tops = getSectionTops(sections);
        const currentIndex = getCurrentSectionIndex(tops, anchorY);

        scrollToSection(sections[currentIndex], "auto");
      }, RESIZE_SETTLE_MS);
    };

    const onViewportChange = () => {
      syncClearance();
      if (finePointer.matches) realignAfterResize();
    };

    root.classList.add("home-section-scroll");
    syncClearance();

    window.addEventListener("resize", onViewportChange, { passive: true });
    window.addEventListener("orientationchange", onViewportChange);

    // Touch/coarse-pointer devices remain native and use light CSS snap assist.
    if (!finePointer.matches) {
      return () => {
        root.classList.remove("home-section-scroll");
        root.style.removeProperty("--section-scroll-clearance");
        window.removeEventListener("resize", onViewportChange);
        window.removeEventListener("orientationchange", onViewportChange);
      };
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      root.classList.remove("home-section-scroll");
      root.style.removeProperty("--section-scroll-clearance");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      window.clearTimeout(resizeTimer);
    };
  }, [enabled, selector]);
}
