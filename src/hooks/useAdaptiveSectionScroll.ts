import { useEffect } from "react";

type Options = {
  enabled: boolean;
  selector?: string;
};

const getNavClearance = () => {
  const nav = document.querySelector<HTMLElement>(".site-nav-shell");
  if (!nav) return 0;
  const rect = nav.getBoundingClientRect();
  return Math.max(0, rect.bottom + 12);
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

      const direction = Math.sign(event.deltaY);
      if (!direction) return;

      const now = performance.now();
      if (now < lockedUntil) {
        event.preventDefault();
        return;
      }

      const clearance = getNavClearance();
      const viewportHeight = window.innerHeight;
      const tolerance = Math.max(24, viewportHeight * 0.035);
      const usableViewport = Math.max(1, viewportHeight - clearance);

      const active = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= clearance + tolerance && rect.bottom > clearance + tolerance;
      });

      if (active) {
        const rect = active.getBoundingClientRect();
        const isTall = rect.height > usableViewport * 1.25;

        if (isTall) {
          const canContinueDown =
            direction > 0 && rect.bottom > viewportHeight + tolerance;
          const canContinueUp =
            direction < 0 && rect.top < clearance - tolerance;

          if (canContinueDown || canContinueUp) {
            wheelTotal = 0;
            return;
          }
        }
      }

      wheelTotal += event.deltaY;
      const trigger = Math.max(24, Math.min(72, viewportHeight * 0.045));

      if (Math.abs(wheelTotal) < trigger) {
        event.preventDefault();
        return;
      }

      const currentY = clearance;
      const rects = sections.map((section) => ({
        section,
        rect: section.getBoundingClientRect(),
      }));

      let target: HTMLElement | undefined;

      if (direction > 0) {
        target = rects
          .filter(({ rect }) => rect.top > currentY + tolerance)
          .sort((a, b) => a.rect.top - b.rect.top)[0]?.section;
      } else {
        target = rects
          .filter(({ rect }) => rect.top < currentY - tolerance)
          .sort((a, b) => b.rect.top - a.rect.top)[0]?.section;
      }

      wheelTotal = 0;
      if (!target) return;

      event.preventDefault();

      const targetTop =
        window.scrollY + target.getBoundingClientRect().top - getNavClearance();

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });

      const distance = Math.abs(targetTop - window.scrollY);
      const viewportUnits = distance / Math.max(1, viewportHeight);
      lockedUntil =
        now + Math.max(420, Math.min(880, 400 + viewportUnits * 170));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [enabled, selector]);
}
