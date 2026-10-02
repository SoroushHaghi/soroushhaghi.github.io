export type BackgroundMode = "off" | "ambient" | "grazing" | "interference" | "caustic" | "layered";

export type BackgroundValues = {
  mode: BackgroundMode;
  hue: number;
  intensity: number;
  edge: number;
  speed: number;
  scale: number;
};

export const backgroundDefaults: BackgroundValues = {
  mode: "caustic",
  hue: 210,
  intensity: 0.72,
  edge: 0.04,
  speed: 6,
  scale: 1.45,
};

export const backgroundModes = [
  ["off", "Off", "Plain dark base"],
  ["ambient", "Ambient field", "Slow light volume with almost no visible pattern"],
  ["grazing", "Grazing light", "Directional light that catches glass edges"],
  ["interference", "Interference", "Restrained moving wave interference"],
  ["caustic", "Caustic drift", "Soft refractive light patches"],
  ["layered", "Layered optics", "Ambient, edge light and subtle interference"],
] as const;

export const backgroundPresets = [
  {
    id: "quiet",
    title: "Quiet ambient",
    copy: "Low-contrast field for recruiter-first pages",
    values: { mode: "ambient", hue: 190, intensity: 0.22, edge: 0.14, speed: 44, scale: 0.92 },
  },
  {
    id: "edge",
    title: "Glass edge",
    copy: "Directional light with stronger material response",
    values: { mode: "grazing", hue: 188, intensity: 0.28, edge: 0.36, speed: 38, scale: 1 },
  },
  {
    id: "refractive",
    title: "Refractive drift",
    copy: "Soft caustic light without a visible image layer",
    values: { mode: "caustic", hue: 194, intensity: 0.26, edge: 0.24, speed: 42, scale: 1.08 },
  },
  {
    id: "layered",
    title: "Layered optics",
    copy: "Combined field for testing the full material system",
    values: { mode: "layered", hue: 190, intensity: 0.24, edge: 0.24, speed: 48, scale: 0.96 },
  },
  {
    id: "layered-bands",
    title: "Layered bands",
    copy: "Higher glass response with slow optical bands",
    values: { mode: "layered", hue: 199, intensity: 0.49, edge: 0.47, speed: 35, scale: 0.96 },
  },
  {
    id: "interference-ribbon",
    title: "Interference ribbon",
    copy: "High-contrast cyan wave band with strong glass response",
    values: { mode: "interference", hue: 178, intensity: 0.72, edge: 0.44, speed: 14, scale: 1.45 },
  },
] satisfies Array<{ id: string; title: string; copy: string; values: BackgroundValues }>;

export const backgroundStorageKey = "portfolio-background-lab-v2";

export function applyBackground(values: BackgroundValues) {
  const root = document.documentElement;
  root.dataset.backgroundMode = values.mode;
  root.style.setProperty("--dynamic-hue", String(values.hue));
  root.style.setProperty("--dynamic-intensity", String(values.intensity));
  root.style.setProperty("--dynamic-edge", String(values.edge));
  root.style.setProperty("--dynamic-speed", values.speed + "s");
  root.style.setProperty("--dynamic-field-scale", String(values.scale));
  window.localStorage.setItem(backgroundStorageKey, JSON.stringify(values));
}
