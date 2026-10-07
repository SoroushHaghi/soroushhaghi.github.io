import { useEffect, useMemo, useState } from "react";
import defaultCopy from "./siteCopy.json";

export const SITE_COPY_DRAFT_KEY = "portfolio-site-copy-draft-v1";

export type SiteCopy = typeof defaultCopy;

const merge = <T extends Record<string, any>>(base: T, override: any): T => {
  if (!override || typeof override !== "object") return base;
  const out: Record<string, any> = Array.isArray(base) ? [...(base as any)] : { ...base };

  Object.keys(override).forEach((key) => {
    const baseValue = (base as any)[key];
    const nextValue = override[key];

    if (
      baseValue &&
      nextValue &&
      typeof baseValue === "object" &&
      typeof nextValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(nextValue)
    ) {
      out[key] = merge(baseValue, nextValue);
    } else {
      out[key] = nextValue;
    }
  });

  return out as T;
};

export function getSiteCopy(): SiteCopy {
  if (typeof window === "undefined" || process.env.REACT_APP_ENABLE_LAB !== "true") {
    return defaultCopy;
  }

  try {
    const raw = window.localStorage.getItem(SITE_COPY_DRAFT_KEY);
    if (!raw) return defaultCopy;
    return merge(defaultCopy, JSON.parse(raw));
  } catch {
    return defaultCopy;
  }
}

export function useSiteCopy(): SiteCopy {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (process.env.REACT_APP_ENABLE_LAB !== "true") return;

    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE_COPY_DRAFT_KEY) setVersion((value) => value + 1);
    };

    const onDraft = () => setVersion((value) => value + 1);

    window.addEventListener("storage", onStorage);
    window.addEventListener("portfolio-site-copy-draft", onDraft);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("portfolio-site-copy-draft", onDraft);
    };
  }, []);

  return useMemo(() => {
    void version;
    return getSiteCopy();
  }, [version]);
}

export default defaultCopy;
