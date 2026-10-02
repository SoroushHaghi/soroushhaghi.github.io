import React, { useEffect, useMemo, useRef } from "react";
import { expertiseCapabilities } from "../expertise/expertiseData";
import "./cinematicHero.scss";

type Point3 = { x: number; y: number; z: number };

const SPHERE_R = 115;
const CAMERA_DISTANCE = 430;
const VIEW_SPIN = -0.35;
const VIEW_PITCH = (-68 * Math.PI) / 180;
const VIEW_ROLL = (20 * Math.PI) / 180;

const BLUE = "#4b86d8";
const RED = "#cf5a5a";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / Math.max(1e-6, b - a));
  return t * t * (3 - 2 * t);
};

const normalize = (x: number, y: number, z: number): Point3 => {
  const n = Math.hypot(x, y, z) || 1;
  return { x: x / n, y: y / n, z: z / n };
};

const mixDir = (a: Point3, b: Point3, t: number): Point3 =>
  normalize(
    lerp(a.x, b.x, t),
    lerp(a.y, b.y, t),
    lerp(a.z, b.z, t)
  );

function CinematicHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);

  const capabilities = useMemo(
    () =>
      expertiseCapabilities.map((item) => {
        const z = 70 * ((item.K - item.E) / (item.K + item.E + 1e-6));
        const finalDir = normalize(item.x, item.y, z);
        const rodLength = clamp01(item.score / 5) * SPHERE_R;

        return {
          ...item,
          base2D: { x: item.x, y: item.y, z: 0 } as Point3,
          finalDir,
          rodLength,
          color: item.mode === "Knowledge" ? BLUE : RED,
        };
      }),
    []
  );

  useEffect(() => {
    const updateProgress = () => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      progressRef.current = clamp01(-rect.top / travel);
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
    let frame = 0;

    const draw = () => {
      frame = requestAnimationFrame(draw);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const W = Math.max(1, rect.width);
      const H = Math.max(1, rect.height);
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      const pw = Math.round(W * dpr);
      const ph = Math.round(H * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const p = progressRef.current;

      const axes2D = smooth(0.03, 0.14, p);
      const planeIn = smooth(0.12, 0.24, p);
      const pointsIn = smooth(0.22, 0.34, p);
      const thirdAxisIn = smooth(0.34, 0.44, p);
      const rodsGrow = smooth(0.38, 0.52, p);
      const centerStage = smooth(0.52, 0.78, p);
      const planeFade = 1 - smooth(0.60, 0.80, p);
      const sphereGrow = smooth(0.78, 0.98, p);

      const centerX = W * 0.5;
      const centerY = H * 0.52;
      const scale = Math.min(W, H) / 340;

      const spin = VIEW_SPIN * centerStage;
      const pitch = VIEW_PITCH * centerStage;
      const roll = VIEW_ROLL * centerStage;

      const rotate = (point: Point3): Point3 => {
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

        return {
          x: cr * x2 - sr * y2,
          y: sr * x2 + cr * y2,
          z: z2,
        };
      };

      const project = (point: Point3) => {
        const r = rotate(point);
        const persp = CAMERA_DISTANCE / (CAMERA_DISTANCE - r.z);
        return {
          x: centerX + r.x * scale * persp,
          y: centerY - r.y * scale * persp,
          z: r.z,
        };
      };

      const line = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        stroke: string,
        width = 1
      ) => {
        ctx.save();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      };

      const dot = (
        point: { x: number; y: number },
        radius: number,
        fill: string,
        alpha = 1
      ) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const label = (
        text: string,
        point: { x: number; y: number },
        alpha: number,
        dx = 0,
        dy = 0
      ) => {
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(230,236,244,.55)";
        ctx.font = "600 10px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, point.x + dx, point.y + dy);
        ctx.restore();
      };

      ctx.save();
      ctx.fillStyle = "#020406";
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(W, H) * 0.72
      );
      glow.addColorStop(0, "rgba(28,41,58,.12)");
      glow.addColorStop(0.55, "rgba(10,16,23,.04)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      const axisAlpha = Math.max(axes2D, sphereGrow * 0.45);

      const axisExtent = 115 * Math.max(axes2D, sphereGrow);
      const hwL = project({ x: -axisExtent, y: 0, z: 0 });
      const hwR = project({ x: axisExtent, y: 0, z: 0 });
      const cqB = project({ x: 0, y: -axisExtent, z: 0 });
      const cqT = project({ x: 0, y: axisExtent, z: 0 });

      line(hwL, hwR, "rgba(224,232,242," + 0.28 * axisAlpha + ")", 1);
      line(cqB, cqT, "rgba(224,232,242," + 0.26 * axisAlpha + ")", 1);

      label("HARDWARE", hwL, axisAlpha * 0.9, -24, 4);
      label("SOFTWARE", hwR, axisAlpha * 0.9, 26, 4);
      label("CLASSICAL", cqB, axisAlpha * 0.9, 0, 18);
      label("QUANTUM", cqT, axisAlpha * 0.9, 0, -12);

      if (thirdAxisIn > 0.001 || sphereGrow > 0.001) {
        const zLen = 115 * Math.max(thirdAxisIn, sphereGrow);
        const zB = project({ x: 0, y: 0, z: -zLen });
        const zT = project({ x: 0, y: 0, z: zLen });

        line(
          zB,
          zT,
          "rgba(224,232,242," +
            0.22 * Math.max(thirdAxisIn, sphereGrow * 0.55) +
            ")",
          1
        );

        label(
          "EXPERIENCE",
          zB,
          Math.max(thirdAxisIn, sphereGrow * 0.55) * 0.9,
          0,
          16
        );
        label(
          "KNOWLEDGE",
          zT,
          Math.max(thirdAxisIn, sphereGrow * 0.55) * 0.9,
          0,
          -10
        );
      }

      if (planeIn > 0.001 && planeFade > 0.001) {
        const gridN = 5;
        const extent = 100;

        for (let i = -gridN; i <= gridN; i += 1) {
          const v = (i / gridN) * extent;
          const a = project({ x: -extent, y: v, z: 0 });
          const b = project({ x: extent, y: v, z: 0 });
          const c = project({ x: v, y: -extent, z: 0 });
          const d = project({ x: v, y: extent, z: 0 });

          line(
            a,
            b,
            "rgba(170,187,208," + 0.09 * planeIn * planeFade + ")"
          );
          line(
            c,
            d,
            "rgba(170,187,208," + 0.09 * planeIn * planeFade + ")"
          );
        }
      }

      const planeNormal: Point3 = { x: 0, y: 0, z: 1 };

      capabilities.forEach((item, index) => {
        const pointStagger = clamp01(
          (pointsIn * capabilities.length - index) / 3.8
        );
        const rodLocalGrow = rodsGrow * pointStagger;

        const point2D = project(item.base2D);

        if (pointStagger > 0.001 && rodLocalGrow < 0.98) {
          dot(
            point2D,
            2.7,
            "rgba(219,227,238,1)",
            (1 - rodLocalGrow) * 0.88
          );
        }

        if (rodLocalGrow <= 0.001) return;

        const dirNow = mixDir(planeNormal, item.finalDir, centerStage);

        const baseNow: Point3 = {
          x: lerp(item.base2D.x, 0, centerStage),
          y: lerp(item.base2D.y, 0, centerStage),
          z: 0,
        };

        const tipNow: Point3 = {
          x: baseNow.x + dirNow.x * item.rodLength * rodLocalGrow,
          y: baseNow.y + dirNow.y * item.rodLength * rodLocalGrow,
          z: baseNow.z + dirNow.z * item.rodLength * rodLocalGrow,
        };

        const a = project(baseNow);
        const b = project(tipNow);

        line(
          a,
          b,
          item.color === BLUE
            ? "rgba(75,134,216,.90)"
            : "rgba(207,90,90,.86)",
          1.35 + (item.rodLength / SPHERE_R) * 2
        );

        dot(
          b,
          2.2 + (item.rodLength / SPHERE_R) * 1.6,
          item.color,
          0.95
        );
      });

      if (sphereGrow > 0.001) {
        const sphereRadius3D = SPHERE_R * sphereGrow;
        const shellRadius =
          scale *
          sphereRadius3D *
          (CAMERA_DISTANCE /
            Math.sqrt(
              Math.max(
                1,
                CAMERA_DISTANCE * CAMERA_DISTANCE -
                  sphereRadius3D * sphereRadius3D
              )
            ));

        const visibilityMetric = (rotated: Point3) =>
          CAMERA_DISTANCE * rotated.z -
          (rotated.x * rotated.x +
            rotated.y * rotated.y +
            rotated.z * rotated.z);

        const drawGreatCircle = (
          plane: "xy" | "xz" | "yz",
          backAlpha: number,
          frontAlpha: number
        ) => {
          const samples = 420;
          const points: Array<{
            x: number;
            y: number;
            back: boolean;
            m: number;
          }> = [];

          for (let i = 0; i <= samples; i += 1) {
            const t = (i / samples) * Math.PI * 2;
            let p3: Point3;

            if (plane === "xy") {
              p3 = {
                x: sphereRadius3D * Math.cos(t),
                y: sphereRadius3D * Math.sin(t),
                z: 0,
              };
            } else if (plane === "xz") {
              p3 = {
                x: sphereRadius3D * Math.cos(t),
                y: 0,
                z: sphereRadius3D * Math.sin(t),
              };
            } else {
              p3 = {
                x: 0,
                y: sphereRadius3D * Math.cos(t),
                z: sphereRadius3D * Math.sin(t),
              };
            }

            const rot = rotate(p3);
            const pr = project(p3);
            const m = visibilityMetric(rot);

            points.push({
              x: pr.x,
              y: pr.y,
              back: m < 0,
              m,
            });
          }

          ([true, false] as const).forEach((drawBack) => {
            ctx.save();
            ctx.strokeStyle =
              "rgba(220,230,242," +
              (drawBack ? backAlpha : frontAlpha) +
              ")";
            ctx.lineWidth = 1;
            ctx.beginPath();

            let open = false;

            for (let i = 0; i < points.length; i += 1) {
              const curr = points[i];
              const prev = i > 0 ? points[i - 1] : null;

              if (prev && prev.back !== curr.back) {
                const denom = prev.m - curr.m;
                const u =
                  Math.abs(denom) < 1e-9
                    ? 0.5
                    : clamp01(prev.m / denom);

                const ix = prev.x + (curr.x - prev.x) * u;
                const iy = prev.y + (curr.y - prev.y) * u;

                if (prev.back === drawBack && open) {
                  ctx.lineTo(ix, iy);
                }

                open = false;

                if (curr.back === drawBack) {
                  ctx.moveTo(ix, iy);
                  open = true;
                }
              }

              if (curr.back === drawBack) {
                if (!open) {
                  ctx.moveTo(curr.x, curr.y);
                  open = true;
                } else {
                  ctx.lineTo(curr.x, curr.y);
                }
              }
            }

            ctx.stroke();
            ctx.restore();
          });
        };

        const glass = ctx.createRadialGradient(
          centerX - shellRadius * 0.18,
          centerY - shellRadius * 0.22,
          shellRadius * 0.08,
          centerX,
          centerY,
          Math.max(1, shellRadius)
        );

        glass.addColorStop(0, "rgba(218,226,238,.040)");
        glass.addColorStop(0.72, "rgba(179,193,211,.018)");
        glass.addColorStop(1, "rgba(120,142,172,.006)");

        ctx.save();
        ctx.fillStyle = glass;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        drawGreatCircle("xy", 0.008, 0.020);
        drawGreatCircle("xz", 0.007, 0.017);
        drawGreatCircle("yz", 0.007, 0.015);

        ctx.save();
        ctx.strokeStyle = "rgba(229,236,246,.22)";
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [capabilities]);

  return (
    <section
      ref={rootRef}
      className="cinematic-hero"
      aria-label="Scroll-driven expertise state construction"
    >
      <div className="cinematic-hero-sticky">
        <canvas
          ref={canvasRef}
          className="cinematic-hero-canvas"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

export default CinematicHero;
