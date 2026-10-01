import { useEffect } from "react";

type Options = {
  enabled: boolean;
  selector?: string;
};

const getNavClearance = () => {
  const nav = document.querySelector<HTMLElement>(".site-nav-shell");
  if (!nav) return 0;
  const rect = nav.getBoundingClientRect();
  return Math.max(0, rect.bottom + 10);
};

const closestSectionIndex = (sections: HTMLElement[], clearance: number) => {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section, index) => {
    const distance = Math.abs(section.getBoundingClientRect().top - clearance);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
};

export default function useAdaptiveSectionScroll({
  enabled,
  selector = "[data-scroll-section]",
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (reducedMotion.matches || !finePointer.matches) return;

    let wheelTotal = 0;
    let lockedUntil = 0;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const source = event.target as HTMLElement | null;
      if (
        source?.closest(
          "input, textarea, select, [contenteditable='true'], [data-native-scroll]"
        )
      ) {
        return;
      }

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(selector)
      ).filter((section) => section.offsetParent !== null);

      if (sections.length < 2) return;

      const now = performance.now();
      if (now < lockedUntil) {
        event.preventDefault();
        return;
      }

      const direction = Math.sign(event.deltaY);
      if (!direction) return;

      const clearance = getNavClearance();
      const viewportHeight = window.innerHeight;
      const currentIndex = closestSectionIndex(sections, clearance);
      const current = sections[currentIndex];
      const currentRect = current.getBoundingClientRect();

      // If a future section becomes taller than the viewport, keep ordinary
      // scrolling inside it. Snap only when the user reaches its boundary.
      const usableViewport = Math.max(1, viewportHeight - clearance);
      const isTallSection = currentRect.height > usableViewport * 1.05;
      const boundaryTolerance = Math.max(24, viewportHeight * 0.04);

      if (isTallSection) {
        const canScrollInsideDown =
          direction > 0 &&
          currentRect.bottom > viewportHeight + boundaryTolerance;
        const canScrollInsideUp =
          direction < 0 &&
          currentRect.top < clearance - boundaryTolerance;

        if (canScrollInsideDown || canScrollInsideUp) {
          wheelTotal = 0;
          return;
        }
      }

      wheelTotal += event.deltaY;

      // Scale the trigger with viewport height so mouse wheels and trackpads
      // feel consistent without tying the behavior to a hard-coded distance.
      const trigger = Math.max(28, Math.min(88, viewportHeight * 0.055));
      if (Math.abs(wheelTotal) < trigger) {
        event.preventDefault();
        return;
      }

      const step = wheelTotal > 0 ? 1 : -1;
      wheelTotal = 0;

      const targetIndex = Math.min(
        sections.length - 1,
        Math.max(0, currentIndex + step)
      );

      if (targetIndex === currentIndex) return;

      event.preventDefault();

      const target = sections[targetIndex];
      const targetTop =
        window.scrollY + target.getBoundingClientRect().top - getNavClearance();

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });

      const distance = Math.abs(targetTop - window.scrollY);
      const viewportUnits = distance / Math.max(1, viewportHeight);
      lockedUntil =
        now + Math.max(420, Math.min(900, 420 + viewportUnits * 180));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [enabled, selector]);
}
