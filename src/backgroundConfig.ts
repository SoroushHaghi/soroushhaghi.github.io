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
  mode: "ambient",
  hue: 190,
  intensity: 0.36,
  edge: 0.22,
  speed: 28,
  scale: 1,
};

export const backgroundModes = [
  ["off", "Off", "Plain dark base"],
  ["ambient", "Ambient field", "Slow light volume with almost no visible pattern"],
  ["grazing", "Grazing light", "Directional light that catches glass edges"],
  ["interference", "Interference", "Restrained moving wave interference"],
  ["caustic", "Caustic drift", "Soft refractive light patches"],
  ["layered", "Layered optics", "Ambient, edge light and subtle interference"],
] as const;

export const backgroundStorageKey = "portfolio-background-lab-v1";

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
