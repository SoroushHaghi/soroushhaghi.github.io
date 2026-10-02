import { useEffect, useState } from "react";
import {
  applyBackground,
  backgroundDefaults,
  backgroundStorageKey,
  BackgroundMode,
  BackgroundValues,
} from "./backgroundConfig";

function loadInitialValues(): BackgroundValues {
  try {
    const saved = window.localStorage.getItem(backgroundStorageKey);
    return saved ? { ...backgroundDefaults, ...JSON.parse(saved) } : backgroundDefaults;
  } catch {
    return backgroundDefaults;
  }
}

export function useBackgroundLab() {
  const [values, setValues] = useState<BackgroundValues>(loadInitialValues);

  useEffect(() => {
    applyBackground(values);
    // Apply the stored Lab state only while this Lab is mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: BackgroundValues) => {
    setValues(next);
    applyBackground(next);
  };

  const number = (key: Exclude<keyof BackgroundValues, "mode">, value: number) => {
    apply({ ...values, [key]: value });
  };

  const mode = (nextMode: BackgroundMode) => {
    apply({ ...values, mode: nextMode });
  };

  const preset = (nextValues: BackgroundValues) => {
    apply(nextValues);
  };

  const reset = () => {
    apply(backgroundDefaults);
  };

  return { values, number, mode, preset, reset };
}
