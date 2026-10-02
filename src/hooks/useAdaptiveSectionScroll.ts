import { useEffect } from "react";

type Options = {
  enabled: boolean;
  selector?: string;
};

const WHEEL_IDLE_MS = 150;
const SMOOTH_SCROLL_MS = 560;
const RESIZE_SETTLE_MS = 140;
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    // Touch/coarse-pointer scrolling remains native. This hook normalizes
    // mouse-wheel and trackpad gestures on desktop/responsive desktop layouts.
    if (!finePointer.matches) return;

    let gestureActive = false;
    let lastWheelAt = 0;
    let animationUntil = 0;
    let releaseTimer = 0;
    let resizeTimer = 0;

    const releaseWhenIdle = () => {
      window.clearTimeout(releaseTimer);

      const now = performance.now();
      const wheelWait = Math.max(0, WHEEL_IDLE_MS - (now - lastWheelAt));
      const animationWait = Math.max(0, animationUntil - now);
      const wait = Math.max(wheelWait, animationWait);

      if (wait > 0) {
        releaseTimer = window.setTimeout(releaseWhenIdle, Math.max(24, wait));
        return;
      }

      gestureActive = false;
    };

    const scrollToSection = (section: HTMLElement) => {
      const clearance = getNavClearance();
      const targetTop =
        window.scrollY + section.getBoundingClientRect().top - clearance;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: reducedMotion.matches ? "auto" : "smooth",
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

      const now = performance.now();
      lastWheelAt = now;

      // All events belonging to the same physical wheel/trackpad gesture are
      // consumed after the first navigation. The next section can only fire
      // after both the gesture and the scroll animation have settled.
      if (gestureActive) {
        event.preventDefault();
        releaseWhenIdle();
        return;
      }

      const sections = getVisibleSections(selector);
      if (sections.length < 2) return;

      const direction = Math.sign(event.deltaY);
      if (!direction) return;

      const clearance = getNavClearance();
      const anchorY = window.scrollY + clearance;
      const tops = getSectionTops(sections);
      const currentIndex = getCurrentSectionIndex(tops, anchorY);
      const targetIndex = currentIndex + direction;

      // Keep native scrolling available beyond the first/last managed section
      // (for example, to reach the footer).
      if (targetIndex < 0 || targetIndex >= sections.length) return;

      event.preventDefault();
      gestureActive = true;
      animationUntil = now + (reducedMotion.matches ? 0 : SMOOTH_SCROLL_MS);

      scrollToSection(sections[targetIndex]);
      releaseWhenIdle();
    };

    // When the viewport changes size, realign the current section after layout
    // settles. No viewport percentage thresholds are used.
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (gestureActive) return;

        const sections = getVisibleSections(selector);
        if (!sections.length) return;

        const clearance = getNavClearance();
        const anchorY = window.scrollY + clearance;
        const tops = getSectionTops(sections);
        const currentIndex = getCurrentSectionIndex(tops, anchorY);
        scrollToSection(sections[currentIndex]);
      }, RESIZE_SETTLE_MS);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.clearTimeout(releaseTimer);
      window.clearTimeout(resizeTimer);
    };
  }, [enabled, selector]);
}
