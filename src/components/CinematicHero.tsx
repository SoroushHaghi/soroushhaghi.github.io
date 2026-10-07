import React, { useEffect, useMemo, useRef, useState } from "react";
import { expertiseCapabilities } from "../expertise/expertiseData";
import { useSiteCopy } from "../content/useSiteCopy";
import Wordmark from "./Wordmark";
import "./cinematicHero.scss";

type Point3 = { x: number; y: number; z: number };
type Point2 = { x: number; y: number };
type BasisKey = "QH" | "QS" | "CH" | "CS";
type PreparedCapability = (typeof expertiseCapabilities)[number] & {
  base2D: Point3;
  initialDirection: Point3;
  preSphereDirection: Point3;
  semanticDirection: Point3;
  radialStrength: number;
  depthLength: number;
  rodLength: number;
  color: string;
  weights: Record<BasisKey, number>;
  dominant: BasisKey;
};
type HitRod = { item: PreparedCapability; a: Point2; b: Point2 };
type Measurement = { key: BasisKey; started: number };

const SPHERE_R = 115;
const AXIS_R = 132;
const CAMERA_DISTANCE = 430;
const VIEW_SPIN = (-20 * Math.PI) / 180;
const VIEW_PITCH = (-60 * Math.PI) / 180;
const VIEW_ROLL = (8 * Math.PI) / 180;
const INSPECT_SPIN = (-10 * Math.PI) / 180;
const INSPECT_PITCH = (-54 * Math.PI) / 180;
const INSPECT_ROLL = (3 * Math.PI) / 180;

const KNOWLEDGE = "#4b86d8";
const EXPERIENCE = "#cf5a5a";
const BASIS_COLORS: Record<BasisKey, string> = {
  QH: "#63e6be",
  QS: "#cf7cff",
  CH: "#5e9fff",
  CS: "#f0b957",
};
const BASIS_KEYS: BasisKey[] = ["CH", "QH", "CS", "QS"];

const STOPS = [0, 0.18, 0.36, 0.58, 0.78, 1];
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const clamp01 = (v: number) => clamp(v, 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / Math.max(1e-6, b - a));
  return t * t * (3 - 2 * t);
};
const smoother = (t: number) => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const normalize = (x: number, y: number, z: number): Point3 => {
  const n = Math.hypot(x, y, z) || 1;
  return { x: x / n, y: y / n, z: z / n };
};
const scaleV = (v: Point3, s: number): Point3 => ({ x: v.x * s, y: v.y * s, z: v.z * s });
const add4 = (a: Point3, b: Point3, c: Point3, d: Point3): Point3 => ({
  x: a.x + b.x + c.x + d.x,
  y: a.y + b.y + c.y + d.y,
  z: a.z + b.z + c.z + d.z,
});
const dot = (a: Point3, b: Point3) => a.x * b.x + a.y * b.y + a.z * b.z;
const mixDirection = (a: Point3, b: Point3, t: number): Point3 =>
  normalize(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));

const BASIS: Record<BasisKey, Point3> = {
  CH: normalize(-1, -1, 1),
  QH: normalize(-1, 1, -1),
  CS: normalize(1, -1, -1),
  QS: normalize(1, 1, 1),
};

const shellDots = (() => {
  const rows: Array<{ p: Point3; basis: BasisKey; jitter: number }> = [];
  const count = 3000;
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = golden * i;
    const p = { x: Math.cos(angle) * r, y, z: Math.sin(angle) * r };

    let basis: BasisKey = "QH";
    let best = -Infinity;
    BASIS_KEYS.forEach((key) => {
      const score = dot(p, BASIS[key]);
      if (score > best) {
        best = score;
        basis = key;
      }
    });

    rows.push({ p, basis, jitter: 0.8 + (((i * 43) % 101) / 101) * 0.2 });
  }

  return rows;
})();

const pointSegmentDistance = (px: number, py: number, a: Point2, b: Point2) => {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const wx = px - a.x;
  const wy = py - a.y;
  const vv = vx * vx + vy * vy || 1;
  const t = clamp((wx * vx + wy * vy) / vv, 0, 1);
  const qx = a.x + t * vx;
  const qy = a.y + t * vy;
  return Math.hypot(px - qx, py - qy);
};

function CinematicHero() {
  const copy = useSiteCopy();
  const {
    hardware: axisHardware,
    software: axisSoftware,
    classical: axisClassical,
    quantum: axisQuantum,
    experience: axisExperience,
    knowledge: axisKnowledge,
  } = copy.careerState.axes;
  const rootRef = useRef<HTMLElement | null>(null);
  const introVisualRef = useRef<HTMLDivElement | null>(null);
  const introCopyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const activeStageRef = useRef(0);
  const wheelLockUntilRef = useRef(0);
  const wheelAnimationRef = useRef<number | null>(null);
  const measureRef = useRef<Measurement | null>(null);
  const measurementEndingRef = useRef(false);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const inspectSpinRef = useRef(0);
  const inspectPitchRef = useRef(0);
  const userSpinRef = useRef(0);
  const userPitchRef = useRef(0);
  const autoSpinRef = useRef(0);
  const lastFrameRef = useRef(0);
  const hitRodsRef = useRef<HitRod[]>([]);

  const [activeStage, setActiveStage] = useState(0);
  const [measurementKey, setMeasurementKey] = useState<BasisKey | null>(null);
  const [finalReady, setFinalReady] = useState(false);
  const [legendReady, setLegendReady] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; mode: string } | null>(null);

  const capabilities = useMemo<PreparedCapability[]>(() => {
    return expertiseCapabilities.map((item) => {
      const knowledge100 = clamp(item.K * 100, 0, 100);
      const experience100 = clamp(item.E * 100, 0, 100);
      const sourceValue = item.mode === "Knowledge" ? knowledge100 : experience100;
      const depthSign = item.mode === "Knowledge" ? 1 : -1;
      const sx = clamp(item.x / 100, -1, 1);
      const sy = clamp(item.y / 100, -1, 1);
      const pSoftware = (sx + 1) / 2;
      const pHardware = 1 - pSoftware;
      const pQuantum = (sy + 1) / 2;
      const pClassical = 1 - pQuantum;
      const weights: Record<BasisKey, number> = {
        QH: pQuantum * pHardware,
        QS: pQuantum * pSoftware,
        CH: pClassical * pHardware,
        CS: pClassical * pSoftware,
      };
      const bary = add4(
        scaleV(BASIS.QH, weights.QH),
        scaleV(BASIS.QS, weights.QS),
        scaleV(BASIS.CH, weights.CH),
        scaleV(BASIS.CS, weights.CS)
      );
      const dominant = BASIS_KEYS.reduce((best, key) =>
        weights[key] > weights[best] ? key : best
      , BASIS_KEYS[0]);
      const radialStrength = clamp01((knowledge100 + experience100) / 200);
      const zValue = depthSign * sourceValue;

      return {
        ...item,
        base2D: { x: item.x, y: item.y, z: 0 },
        initialDirection: { x: 0, y: 0, z: depthSign },
        preSphereDirection: normalize(item.x, item.y, zValue),
        semanticDirection: normalize(bary.x, bary.y, bary.z),
        radialStrength,
        depthLength: (sourceValue / 100) * 100,
        rodLength: radialStrength * SPHERE_R,
        color: item.mode === "Knowledge" ? KNOWLEDGE : EXPERIENCE,
        weights,
        dominant,
      };
    });
  }, []);

  const liveState = useMemo<Record<BasisKey, number>>(() => {
    const out: Record<BasisKey, number> = { QH: 0, QS: 0, CH: 0, CS: 0 };
    let den = 0;
    capabilities.forEach((item) => {
      const evidenceWeight = Math.max(0.08, item.radialStrength);
      den += evidenceWeight;
      BASIS_KEYS.forEach((key) => {
        out[key] += item.weights[key] * evidenceWeight;
      });
    });
    BASIS_KEYS.forEach((key) => {
      out[key] /= den || 1;
    });
    return out;
  }, [capabilities]);

  useEffect(() => {
    const updateProgress = () => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = clamp01(-rect.top / travel);
      progressRef.current = progress;
      const introFade = smooth(0.02, 0.16, progress);
      const introCopyFade = smooth(0.055, 0.13, progress);
      if (introVisualRef.current) {
        const visible = 1 - introFade;
        introVisualRef.current.style.opacity = String(visible);
        introVisualRef.current.style.transform = `scale(${1 - introFade * 0.022})`;
        introVisualRef.current.style.filter = `blur(${introFade * 3.5}px)`;
        introVisualRef.current.style.visibility = visible <= 0.002 ? "hidden" : "visible";
      }
      if (introCopyRef.current) {
        introCopyRef.current.style.opacity = String(1 - introCopyFade);
        introCopyRef.current.style.transform = `translateY(calc(-50% - ${introCopyFade * 6}px))`;
      }
      const equationReady = progress >= 0.94;
      const basisLegendReady = progress >= 0.96;
      setFinalReady((prev) => (prev === equationReady ? prev : equationReady));
      setLegendReady((prev) => (prev === basisLegendReady ? prev : basisLegendReady));

      let nearest = 0;
      let best = Infinity;
      STOPS.forEach((stop, index) => {
        const d = Math.abs(stop - progress);
        if (d < best) {
          best = d;
          nearest = index;
        }
      });
      if (nearest !== activeStageRef.current) {
        activeStageRef.current = nearest;
        setActiveStage(nearest);
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const animateTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const started = performance.now();
      if (wheelAnimationRef.current !== null) cancelAnimationFrame(wheelAnimationRef.current);

      const tick = (now: number) => {
        const t = clamp01((now - started) / duration);
        window.scrollTo(0, startY + distance * smoother(t));
        if (t < 1) wheelAnimationRef.current = requestAnimationFrame(tick);
        else wheelAnimationRef.current = null;
      };
      wheelAnimationRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const active = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!active || Math.abs(event.deltaY) < 4) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const current = progressRef.current;
      if ((direction < 0 && current <= 0.001) || (direction > 0 && current >= 0.999)) return;

      event.preventDefault();
      const now = performance.now();
      if (now < wheelLockUntilRef.current) return;

      let nearest = 0;
      let best = Infinity;
      STOPS.forEach((stop, index) => {
        const d = Math.abs(stop - current);
        if (d < best) {
          best = d;
          nearest = index;
        }
      });

      const next = clamp(nearest + direction, 0, STOPS.length - 1);
      const sectionTop = window.scrollY + rect.top;
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      const duration = next === STOPS.length - 1 ? 2800 : 1100;
      wheelLockUntilRef.current = now + duration + 90;
      animateTo(sectionTop + STOPS[next] * travel, duration);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (wheelAnimationRef.current !== null) cancelAnimationFrame(wheelAnimationRef.current);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const W = Math.max(1, rect.width);
      const H = Math.max(1, rect.height);
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const targetW = Math.round(W * dpr);
      const targetH = Math.round(H * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      const p = progressRef.current;
      const xAxisIn = smooth(0.115, STOPS[1], p);
      const yAxisIn = smooth(STOPS[1], STOPS[2], p);
      const planeIn = smooth(STOPS[1] + (STOPS[2] - STOPS[1]) * 0.42, STOPS[2], p);
      const pointsIn = smooth(STOPS[2], STOPS[3], p);
      const zAxisIn = smooth(STOPS[3], STOPS[4], p);
      const rodsGrow = zAxisIn;
      const finalIn = smooth(STOPS[4], STOPS[5], p);
      const pointsOut = smooth(0, 0.15, finalIn);
      const centering = smooth(0.06, 0.32, finalIn);
      const planeFade = 1 - smooth(0.03, 0.27, finalIn);
      const collapse = smooth(0.22, 0.61, finalIn);
      const sphereReveal = smooth(0.61, 0.98, finalIn);
      const settle = smooth(0.88, 1, finalIn);
      const hold = smooth(0.12, 0.24, finalIn) * (1 - smooth(0.36, 0.47, finalIn));

      const mobile = W < 760;
      const tablet = W >= 760 && W < 1180;
      const centerX = mobile ? W * 0.5 : tablet ? W * 0.58 : W * 0.61;
      const centerY = mobile ? H * 0.60 : tablet ? H * 0.55 : H * 0.54;
      const leftReserve = mobile ? 0 : tablet ? Math.max(230, W * 0.27) : Math.max(320, W * 0.31);
      const sideSafe = mobile ? 18 : tablet ? 30 : 44;
      const topSafe = mobile ? 165 : tablet ? 120 : 102;
      const bottomSafe = mobile ? 84 : tablet ? 72 : 68;
      const labelReserve = mobile ? 34 : 46;
      const availableLeft = mobile
        ? centerX - sideSafe - labelReserve
        : centerX - leftReserve - sideSafe - labelReserve;
      const availableRight = W - sideSafe - centerX - labelReserve;
      const scaleX = Math.max(0.72, Math.min(availableLeft, availableRight) / AXIS_R);
      const scaleTop = Math.max(0.72, (centerY - topSafe - labelReserve) / AXIS_R);
      const scaleBottom = Math.max(0.72, (H - bottomSafe - centerY - labelReserve) / AXIS_R);
      const fittedScale = Math.min(scaleX, scaleTop, scaleBottom) * (mobile ? 1.04 : tablet ? 0.96 : 0.92);

      const depthInteractive = smooth(STOPS[3], STOPS[4], p);
      const rotation = smooth(STOPS[3], STOPS[4], p);
      const baseSpin = VIEW_SPIN * rotation;
      const basePitch = VIEW_PITCH * rotation;
      const baseRoll = VIEW_ROLL * rotation;
      const inspectionBlend = smooth(0, 1, depthInteractive) * 0.62;
      const spin = lerp(baseSpin, INSPECT_SPIN, inspectionBlend) + inspectSpinRef.current * depthInteractive;
      const pitch = lerp(basePitch, INSPECT_PITCH, inspectionBlend) + inspectPitchRef.current * depthInteractive;
      const roll = lerp(baseRoll, INSPECT_ROLL, inspectionBlend);

      const rotateLegacy = (point: Point3): Point3 => {
        const cs = Math.cos(spin);
        const ss = Math.sin(spin);
        const x1 = cs * point.x - ss * point.y;
        const y1 = ss * point.x + cs * point.y;
        const z1 = point.z;
        const cp = Math.cos(pitch);
        const sp = Math.sin(pitch);
        const x2 = x1;
        const y2 = cp * y1 - sp * z1;
        const z2 = sp * y1 + cp * z1;
        const cr = Math.cos(roll);
        const sr = Math.sin(roll);
        return { x: cr * x2 - sr * y2, y: sr * x2 + cr * y2, z: z2 };
      };

      if (lastFrameRef.current) {
        const dt = Math.min(40, now - lastFrameRef.current);
        const sphereSettled = p >= STOPS[4] + (STOPS[5] - STOPS[4]) * 0.88;
        if (sphereSettled && !draggingRef.current && !measureRef.current) {
          autoSpinRef.current = (autoSpinRef.current + dt * 0.000045) % (Math.PI * 2);
        }
      }
      lastFrameRef.current = now;

      const rotateFinal = (point: Point3): Point3 => {
        const yaw = -0.52 + userSpinRef.current + autoSpinRef.current;
        const finalPitch = -0.3 + userPitchRef.current;
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        const x1 = cy * point.x + sy * point.z;
        const z1 = -sy * point.x + cy * point.z;
        const y1 = point.y;
        const cp = Math.cos(finalPitch);
        const sp = Math.sin(finalPitch);
        return { x: x1, y: cp * y1 - sp * z1, z: sp * y1 + cp * z1 };
      };

      const projectLegacy = (point: Point3, legacyScale = 1) => {
        const q = { x: point.x * legacyScale, y: point.y * legacyScale, z: point.z * legacyScale };
        const r = rotateLegacy(q);
        const persp = CAMERA_DISTANCE / (CAMERA_DISTANCE - r.z);
        return { x: centerX + r.x * fittedScale * persp, y: centerY - r.y * fittedScale * persp, depth: r.z, persp };
      };

      const line = (a: Point2, b: Point2, stroke: string, width = 1, alpha = 1) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      };
      const dot2 = (a: Point2, radius: number, fill: string, alpha = 1, blur = 0) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        if (blur) {
          ctx.shadowColor = fill;
          ctx.shadowBlur = blur;
        }
        ctx.beginPath();
        ctx.arc(a.x, a.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      const label = (labelText: string, a: Point2, alpha: number, dx = 0, dy = 0) => {
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(229,235,244,.57)";
        ctx.font = `${mobile ? 8 : 10}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(labelText, a.x + dx, a.y + dy);
        ctx.restore();
      };
      const arrow = (negative: Point2, positive: Point2, alpha: number) => {
        line(negative, positive, "rgba(224,232,242,.72)", 1, alpha);
        [[negative, positive], [positive, negative]].forEach(([tip, from]) => {
          const angle = Math.atan2(tip.y - from.y, tip.x - from.x);
          const size = mobile ? 6 : 8;
          const spread = 0.48;
          line(tip, { x: tip.x - size * Math.cos(angle - spread), y: tip.y - size * Math.sin(angle - spread) }, "rgba(224,232,242,.72)", 1, alpha);
          line(tip, { x: tip.x - size * Math.cos(angle + spread), y: tip.y - size * Math.sin(angle + spread) }, "rgba(224,232,242,.72)", 1, alpha);
        });
      };
      const axisLabel = (labelText: string, end: Point2, alpha: number, gap = 25) => {
        const dx = end.x - centerX;
        const dy = end.y - centerY;
        const n = Math.hypot(dx, dy) || 1;
        label(labelText, end, alpha, (dx / n) * gap, (dy / n) * gap);
      };

      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H) * 0.68);
      const ambient = smooth(0.07, 0.20, p);
      glow.addColorStop(0, `rgba(31,46,66,${0.10 * ambient})`);
      glow.addColorStop(0.56, `rgba(8,15,22,${0.024 * ambient})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const legacyScale = 1 - collapse;
      hitRodsRef.current = [];

      if (planeIn > 0.001 && planeFade > 0.001 && collapse < 0.999) {
        const gridCount = 5;
        const extent = 100;
        for (let i = -gridCount; i <= gridCount; i += 1) {
          const v = (i / gridCount) * extent;
          line(projectLegacy({ x: -extent, y: v, z: 0 }, legacyScale), projectLegacy({ x: extent, y: v, z: 0 }, legacyScale), "rgba(172,189,210,.30)", 1, 0.08 * planeIn * planeFade * (1 - collapse));
          line(projectLegacy({ x: v, y: -extent, z: 0 }, legacyScale), projectLegacy({ x: v, y: extent, z: 0 }, legacyScale), "rgba(172,189,210,.30)", 1, 0.08 * planeIn * planeFade * (1 - collapse));
        }
      }

      if (pointsIn > 0.001 && pointsOut < 1 && collapse < 0.999) {
        const alpha = pointsIn * (1 - pointsOut) * (1 - collapse);
        capabilities.forEach((item) => dot2(projectLegacy(item.base2D, legacyScale), mobile ? 2.25 : 2.7, "#dbe5f0", alpha * 0.9, 2));
      }

      if (rodsGrow > 0.001 && collapse < 0.999) {
        capabilities.forEach((item) => {
          const base = { x: lerp(item.base2D.x, 0, centering), y: lerp(item.base2D.y, 0, centering), z: 0 };
          const dir = mixDirection(item.initialDirection, item.preSphereDirection, centering);
          const visible = lerp(item.depthLength, item.rodLength, centering) * rodsGrow;
          const tip = { x: base.x + dir.x * visible, y: base.y + dir.y * visible, z: dir.z * visible };
          const a = projectLegacy(base, legacyScale);
          const b = projectLegacy(tip, legacyScale);
          line(a, b, item.color, 1.35 + (item.rodLength / SPHERE_R) * 1.8, 0.82 * (1 - collapse));
          dot2(b, 1.9 + (item.rodLength / SPHERE_R) * 1.25, item.color, 0.92 * (1 - collapse), 4);
          if (zAxisIn > 0.72 && collapse < 0.35) hitRodsRef.current.push({ item, a, b });
        });
      }

      if (xAxisIn > 0.001 && collapse < 0.999) {
        const ex = AXIS_R * xAxisIn;
        const left = projectLegacy({ x: -ex, y: 0, z: 0 }, legacyScale);
        const right = projectLegacy({ x: ex, y: 0, z: 0 }, legacyScale);
        arrow(left, right, 0.3 * xAxisIn * (1 - collapse));
        axisLabel(axisHardware, left, 0.64 * xAxisIn * (1 - collapse), mobile ? 28 : 42);
        axisLabel(axisSoftware, right, 0.64 * xAxisIn * (1 - collapse), mobile ? 28 : 42);
      }
      if (yAxisIn > 0.001 && collapse < 0.999) {
        const ex = AXIS_R * yAxisIn;
        const classical = projectLegacy({ x: 0, y: -ex, z: 0 }, legacyScale);
        const quantum = projectLegacy({ x: 0, y: ex, z: 0 }, legacyScale);
        arrow(classical, quantum, 0.28 * yAxisIn * (1 - collapse));
        axisLabel(axisClassical, classical, 0.62 * yAxisIn * (1 - collapse), mobile ? 28 : 42);
        axisLabel(axisQuantum, quantum, 0.62 * yAxisIn * (1 - collapse), mobile ? 28 : 42);
      }
      if (zAxisIn > 0.001 && collapse < 0.999) {
        const ex = AXIS_R * zAxisIn;
        const experience = projectLegacy({ x: 0, y: 0, z: -ex }, legacyScale);
        const knowledge = projectLegacy({ x: 0, y: 0, z: ex }, legacyScale);
        arrow(experience, knowledge, 0.28 * zAxisIn * (1 - collapse));
        axisLabel(axisExperience, experience, 0.62 * zAxisIn * (1 - collapse), mobile ? 28 : 42);
        axisLabel(axisKnowledge, knowledge, 0.62 * zAxisIn * (1 - collapse), mobile ? 28 : 42);
      }

      if (collapse > 0.001 && sphereReveal < 0.75) {
        const core = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 110);
        core.addColorStop(0, "rgba(0,0,0,.99)");
        core.addColorStop(0.28, `rgba(30,60,98,${0.18 + 0.24 * collapse})`);
        core.addColorStop(0.62, `rgba(76,133,198,${0.04 + 0.12 * collapse})`);
        core.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(centerX, centerY, mobile ? 80 : 110, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.globalAlpha = 0.08 + 0.3 * collapse;
        ctx.strokeStyle = "rgba(120,179,240,.43)";
        ctx.shadowColor = "rgba(86,151,225,.52)";
        ctx.shadowBlur = 15;
        for (let i = 0; i < 26; i += 1) {
          const angle = (i / 26) * Math.PI * 2 + collapse * 0.75;
          const rr = (28 + ((i * 19) % 37)) * (1 - collapse);
          ctx.beginPath();
          ctx.moveTo(centerX + Math.cos(angle) * rr, centerY + Math.sin(angle) * rr);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
        }
        ctx.restore();
      }

      const currentMeasurement = measureRef.current;
      let measureAmount = 0;
      if (currentMeasurement) {
        const t = (now - currentMeasurement.started) / 1000;
        if (t < 0.42) measureAmount = smooth(0, 0.42, t);
        else if (t < 1.35) measureAmount = 1;
        else if (t < 2.1) measureAmount = 1 - smooth(1.35, 2.1, t);
        else if (!measurementEndingRef.current) {
          measurementEndingRef.current = true;
          measureRef.current = null;
          requestAnimationFrame(() => {
            setMeasurementKey(null);
            measurementEndingRef.current = false;
          });
        }
      }

      if (sphereReveal > 0.001) {
        const R = SPHERE_R * (0.18 + 0.82 * smooth(0, 0.62, sphereReveal));
        const scale = fittedScale * (0.96 + 0.04 * settle);
        const shellR = scale * R * (CAMERA_DISTANCE / Math.sqrt(Math.max(1, CAMERA_DISTANCE * CAMERA_DISTANCE - R * R)));
        const selectedKey = currentMeasurement?.key || null;

        const projectFinal = (point: Point3) => {
          const r = rotateFinal(point);
          const persp = CAMERA_DISTANCE / (CAMERA_DISTANCE - r.z);
          return { x: centerX + r.x * scale * persp, y: centerY - r.y * scale * persp, depth: r.z, persp };
        };

        ctx.save();
        const glass = ctx.createRadialGradient(centerX - shellR * 0.22, centerY - shellR * 0.24, shellR * 0.04, centerX, centerY, shellR);
        glass.addColorStop(0, "rgba(232,240,251,.054)");
        glass.addColorStop(0.46, "rgba(147,169,197,.018)");
        glass.addColorStop(1, "rgba(72,94,124,.026)");
        ctx.globalAlpha = sphereReveal;
        ctx.fillStyle = glass;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const dots = shellDots.map((row) => {
          const point = { x: row.p.x * R, y: row.p.y * R, z: row.p.z * R };
          const rotated = rotateFinal(point);
          const projected = projectFinal(point);
          return { row, rotated, projected };
        }).sort((a, b) => a.rotated.z - b.rotated.z);

        dots.forEach(({ row, rotated, projected }) => {
          const front = clamp01((rotated.z / Math.max(1, R) + 1) / 2);
          const selected = !selectedKey || row.basis === selectedKey;
          const dim = selectedKey ? (selected ? 1 : 0.08 + 0.12 * (1 - measureAmount)) : 1;
          ctx.save();
          ctx.globalAlpha = sphereReveal * (0.05 + 0.28 * front) * row.jitter * dim;
          ctx.fillStyle = BASIS_COLORS[row.basis];
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, (mobile ? 0.55 : 0.65) + front * 0.9, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        const drawCircle = (plane: "xy" | "xz" | "yz", backAlpha: number, frontAlpha: number) => {
          const rows: Array<{ q: Point2; front: boolean }> = [];
          const count = 180;
          for (let i = 0; i <= count; i += 1) {
            const angle = (i / count) * Math.PI * 2;
            let point: Point3;
            if (plane === "xy") point = { x: R * Math.cos(angle), y: R * Math.sin(angle), z: 0 };
            else if (plane === "xz") point = { x: R * Math.cos(angle), y: 0, z: R * Math.sin(angle) };
            else point = { x: 0, y: R * Math.cos(angle), z: R * Math.sin(angle) };
            const rotated = rotateFinal(point);
            rows.push({ q: projectFinal(point), front: rotated.z >= 0 });
          }
          [false, true].forEach((frontWanted) => {
            ctx.save();
            ctx.globalAlpha = sphereReveal * (frontWanted ? frontAlpha : backAlpha) * (selectedKey ? 1 - measureAmount * 0.55 : 1);
            ctx.strokeStyle = "rgba(225,235,248,.58)";
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            let open = false;
            rows.forEach((row) => {
              if (row.front === frontWanted) {
                if (!open) {
                  ctx.moveTo(row.q.x, row.q.y);
                  open = true;
                } else ctx.lineTo(row.q.x, row.q.y);
              } else open = false;
            });
            ctx.stroke();
            ctx.restore();
          });
        };
        drawCircle("xy", 0.025, 0.1);
        drawCircle("xz", 0.018, 0.075);
        drawCircle("yz", 0.018, 0.07);

        const origin = projectFinal({ x: 0, y: 0, z: 0 });
        const vectorRows = capabilities.map((item) => {
          const d = item.semanticDirection;
          const tip = { x: d.x * R * item.radialStrength, y: d.y * R * item.radialStrength, z: d.z * R * item.radialStrength };
          const rotated = rotateFinal(tip);
          return { item, rotated, q: projectFinal(tip), anchor: projectFinal({ x: d.x * R, y: d.y * R, z: d.z * R }) };
        }).sort((a, b) => a.rotated.z - b.rotated.z);

        vectorRows.forEach(({ item, rotated, q, anchor }) => {
          const front = clamp01((rotated.z / Math.max(1, R) + 1) / 2);
          const belongs = !selectedKey || item.dominant === selectedKey;
          const dim = selectedKey ? (belongs ? 1 : 0.1 + 0.16 * (1 - measureAmount)) : 1;
          ctx.save();
          ctx.globalAlpha = sphereReveal * (0.22 + 0.68 * front) * dim;
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 1.05 + item.radialStrength * 1.2;
          ctx.lineCap = "round";
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.restore();
          if (sphereReveal > 0.82) hitRodsRef.current.push({ item, a: origin, b: q });
          ctx.save();
          ctx.globalAlpha = sphereReveal * (0.28 + 0.52 * front) * dim;
          ctx.strokeStyle = BASIS_COLORS[item.dominant];
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(anchor.x, anchor.y, 2 + front * 0.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });

        BASIS_KEYS.forEach((key) => {
          const point = { x: BASIS[key].x * R, y: BASIS[key].y * R, z: BASIS[key].z * R };
          const rotated = rotateFinal(point);
          const projected = projectFinal(point);
          const front = clamp01((rotated.z / Math.max(1, R) + 1) / 2);
          const selected = !selectedKey || selectedKey === key;
          const dim = selectedKey ? (selected ? 1 : 0.1 + 0.13 * (1 - measureAmount)) : 1;
          ctx.save();
          ctx.globalAlpha = sphereReveal * (0.44 + 0.54 * front) * dim;
          ctx.fillStyle = BASIS_COLORS[key];
          ctx.shadowColor = BASIS_COLORS[key];
          ctx.shadowBlur = 13;
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, mobile ? 2.4 : 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(242,247,253,.90)";
          ctx.font = `650 ${mobile ? 8 : 10}px Inter, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(key, projected.x, projected.y - (mobile ? 11 : 14));
          ctx.restore();
        });

        if (selectedKey && measureAmount > 0) {
          const d = BASIS[selectedKey];
          const q = projectFinal({ x: d.x * R * 0.91, y: d.y * R * 0.91, z: d.z * R * 0.91 });
          ctx.save();
          ctx.globalAlpha = measureAmount * 0.2;
          ctx.strokeStyle = BASIS_COLORS[selectedKey];
          ctx.lineWidth = 12;
          ctx.shadowColor = BASIS_COLORS[selectedKey];
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = measureAmount;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = sphereReveal * 0.43;
        ctx.strokeStyle = "rgba(229,237,248,.64)";
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (hold > 0.001 && collapse < 0.001) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 420);
        ctx.save();
        ctx.globalAlpha = 0.08 * hold * hold;
        ctx.strokeStyle = "rgba(151,194,244,.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6 + 8 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const pointer = pointerRef.current;
      if (!draggingRef.current && !measureRef.current && window.matchMedia("(pointer:fine)").matches) {
        const depthStage = p >= STOPS[3] - 0.01 && p <= STOPS[4] + 0.015;
        const finalStage = p >= STOPS[4] + (STOPS[5] - STOPS[4]) * 0.7;
        if (depthStage || finalStage) {
          let best: HitRod | null = null;
          let bestDistance = 10;
          hitRodsRef.current.forEach((hit) => {
            const distance = pointSegmentDistance(pointer.x, pointer.y, hit.a, hit.b);
            if (distance < bestDistance) {
              bestDistance = distance;
              best = hit;
            }
          });
          if (best) {
            setTooltip((prev) => {
              const next = { x: pointer.x, y: pointer.y, name: best!.item.name, mode: best!.item.mode };
              if (prev && prev.name === next.name && Math.abs(prev.x - next.x) < 1 && Math.abs(prev.y - next.y) < 1) return prev;
              return next;
            });
          } else setTooltip((prev) => (prev ? null : prev));
        } else setTooltip((prev) => (prev ? null : prev));
      }
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [capabilities, axisHardware, axisSoftware, axisClassical, axisQuantum, axisExperience, axisKnowledge]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "touch") return;
    const p = progressRef.current;
    const depthStage = p >= STOPS[3] - 0.01 && p <= STOPS[4] + 0.015;
    const finalStage = p >= STOPS[4] + (STOPS[5] - STOPS[4]) * 0.7;
    if (!(depthStage || finalStage)) return;
    draggingRef.current = true;
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    pointerRef.current = { x: event.clientX, y: event.clientY };
    setTooltip(null);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (!draggingRef.current) return;
    const dx = event.clientX - lastPointerRef.current.x;
    const dy = event.clientY - lastPointerRef.current.y;
    const p = progressRef.current;
    const finalStage = p >= STOPS[4] + (STOPS[5] - STOPS[4]) * 0.7;
    if (finalStage) {
      userSpinRef.current += dx * 0.006;
      userPitchRef.current = clamp(userPitchRef.current + dy * 0.004, -0.45, 0.45);
    } else {
      inspectSpinRef.current = clamp(inspectSpinRef.current + dx * 0.0045, -0.18, 0.18);
      inspectPitchRef.current = clamp(inspectPitchRef.current + dy * 0.0035, -0.12, 0.12);
    }
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // no-op
    }
  };

  const measure = () => {
    if (progressRef.current < STOPS[4] + (STOPS[5] - STOPS[4]) * 0.8 || measureRef.current) return;
    let r = Math.random();
    let sum = 0;
    let key: BasisKey = "CS";
    for (const candidate of BASIS_KEYS) {
      sum += liveState[candidate];
      if (r <= sum) {
        key = candidate;
        break;
      }
    }
    measureRef.current = { key, started: performance.now() };
    setMeasurementKey(key);
  };

  const stage = copy.careerState.stages[activeStage] || copy.careerState.stages[0];
  const titleLines = stage.title.split("|");

  return (
    <section ref={rootRef} className="cinematic-hero" aria-label={copy.careerState.ariaLabel}>
      <div className="cinematic-hero-sticky">
        <canvas
          ref={canvasRef}
          className="cinematic-hero-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={() => !draggingRef.current && setTooltip(null)}
          aria-hidden="true"
        />

        <div ref={introVisualRef} className="career-state-intro-backdrop" aria-hidden="true">
          <img
            src={`${process.env.PUBLIC_URL}/media/hero/hero-constellation.webp`}
            alt=""
            draggable={false}
          />
        </div>

        <div className="career-state-vignette" aria-hidden="true" />

        <div className="career-state-semantic sr-only">
          <h2>{copy.careerState.semanticHeading}</h2>
          <p>{copy.careerState.semanticIntro}</p>
          <ol>
            {copy.careerState.stages.map((item, index) => (
              <li key={`${item.eyebrow}-${index}`}>
                <strong>{item.eyebrow}</strong>{" "}
                {item.title.replaceAll("|", " ")}
                {item.copy ? ` — ${item.copy}` : ""}
              </li>
            ))}
          </ol>
          <p>
            Axes: {axisHardware} ↔ {axisSoftware};{" "}
            {axisClassical} ↔ {axisQuantum};{" "}
            {axisExperience} ↔ {axisKnowledge}.
          </p>
          <p>
            Final states: QH — {copy.careerState.basisNames.QH}; QS — {copy.careerState.basisNames.QS};{" "}
            CH — {copy.careerState.basisNames.CH}; CS — {copy.careerState.basisNames.CS}.
          </p>
          <ul>
            {capabilities.map((item) => (
              <li key={item.id}>{item.name} — {item.mode}</li>
            ))}
          </ul>
        </div>
        <div ref={introCopyRef} className="career-state-intro-copy">
          <div className="career-state-kicker">{copy.careerState.stages[0].eyebrow}</div>
          <h1 className="hero-name career-state-intro-wordmark">
            <Wordmark variant="hero" />
          </h1>
        </div>

        <div className={`career-state-brand ${activeStage === 0 ? "" : "show"}`}>{copy.careerState.brand}</div>

        {activeStage !== 0 && <div className="career-state-copy">
          <div className="career-state-stage-content" key={activeStage}>
            <div className="career-state-kicker">{stage.eyebrow}</div>
            <h1>
              {titleLines.map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </h1>
            {stage.copy && <p>{stage.copy}</p>}
          </div>
        </div>}

        <div className="career-state-steps" aria-hidden="true">
          {STOPS.slice(1).map((_, index) => (
            <i key={index} className={activeStage === index + 1 ? "on" : ""} />
          ))}
        </div>

        <div className={`career-state-equation ${finalReady ? "show" : ""}`}>
          <button type="button" onClick={measure} className={`career-state-equation-button ${measurementKey ? "measuring" : ""}`}>
            {measurementKey ? (
              <span className="career-state-collapsed-equation">
                <span>|ψ<sub>Career</sub>⟩ = </span>
                <span style={{ color: BASIS_COLORS[measurementKey] }}>|{copy.careerState.basisNames[measurementKey]}⟩</span>
              </span>
            ) : (
              <span className="career-state-full-equation">
                |ψ<sub>Career</sub>⟩ = α|CH⟩ + β|QH⟩ + γ|CS⟩ + δ|QS⟩
              </span>
            )}
          </button>
          <div className="career-state-equation-hint">{copy.careerState.equationHint}</div>
        </div>

        <div className={`career-state-legend ${legendReady ? "show" : ""}`} aria-hidden="true">
          <span><i style={{ background: BASIS_COLORS.QH }} />QH · {copy.careerState.basisNames.QH}</span>
          <span><i style={{ background: BASIS_COLORS.QS }} />QS · {copy.careerState.basisNames.QS}</span>
          <span><i style={{ background: BASIS_COLORS.CH }} />CH · {copy.careerState.basisNames.CH}</span>
          <span><i style={{ background: BASIS_COLORS.CS }} />CS · {copy.careerState.basisNames.CS}</span>
        </div>

        <div className={`career-state-scroll-hint ${activeStage === 0 ? "show" : ""}`} aria-hidden="true">
          <span>↓</span> {copy.careerState.scrollHint}
        </div>

        {tooltip && (
          <div className="career-state-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            <span>{tooltip.name}</span>
            <small>{tooltip.mode}</small>
          </div>
        )}
      </div>
    </section>
  );
}

export default CinematicHero;