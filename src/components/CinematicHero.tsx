import React, { useEffect, useMemo, useRef } from "react";
import { expertiseCapabilities } from "../expertise/expertiseData";
import "./cinematicHero.scss";

type Point3 = { x: number; y: number; z: number };

const SPHERE_R = 115;
const CAMERA_DISTANCE = 430;
const VIEW_PITCH = (-68 * Math.PI) / 180;
const VIEW_ROLL = (20 * Math.PI) / 180;
const VIEW_SPIN = -0.35;

const KNOWLEDGE = "#4b86d8";
const EXPERIENCE = "#cf5a5a";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / Math.max(1e-6, b - a));
  return t * t * (3 - 2 * t);
};

function CinematicHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);

  const capabilities = useMemo(
    () =>
      expertiseCapabilities.map((item) => {
        const z =
          70 * ((item.K - item.E) / (item.K + item.E + 1e-6));
        const n = Math.hypot(item.x, item.y, z) || 1;
        const strength = clamp01(item.score / 5);
        const length = strength * SPHERE_R;

        return {
          ...item,
          base: { x: item.x, y: item.y, z: 0 } as Point3,
          direction: {
            x: item.x / n,
            y: item.y / n,
            z: z / n,
          } as Point3,
          length,
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

      const p = progressRef.current;
      const centerX = W * 0.5;
      const centerY = H * 0.5;
      const scale = Math.min(W, H) / 330;

      const xAxisIn = smooth(0.03, 0.11, p);
      const yAxisIn = smooth(0.10, 0.19, p);
      const planeIn = smooth(0.17, 0.29, p);
      const pointsIn = smooth(0.28, 0.41, p);
      const view3D = smooth(0.40, 0.57, p);
      const rodGrow = smooth(0.43, 0.60, p);
      const recenter = smooth(0.60, 0.80, p);
      const planeFade = 1 - smooth(0.64, 0.82, p);
      const sphereGrow = smooth(0.80, 0.98, p);

      const spin = VIEW_SPIN * view3D;
      const pitch = VIEW_PITCH * view3D;
      const roll = VIEW_ROLL * view3D;

      const rotatePoint = (point: Point3): Point3 => {
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
        const rotated = rotatePoint(point);
        const persp = CAMERA_DISTANCE / (CAMERA_DISTANCE - rotated.z);

        return {
          x: centerX + rotated.x * scale * persp,
          y: centerY - rotated.y * scale * persp,
          depth: rotated.z,
          persp,
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
        ctx.fillStyle = "rgba(225,232,241,.72)";
        ctx.font = "600 10px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, point.x + dx, point.y + dy);
        ctx.restore();
      };

      ctx.save();
      ctx.fillStyle = "#020406";
      ctx.fillRect(0, 0, W, H);

      const background = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(W, H) * 0.72
      );
      background.addColorStop(0, "rgba(30,44,61,.105)");
      background.addColorStop(0.55, "rgba(10,16,23,.035)");
      background.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      const planeAlpha = planeFade * Math.max(xAxisIn, yAxisIn, planeIn);

      // 1) Hardware <-> Software appears first.
      const xLeft = project({ x: -112 * xAxisIn, y: 0, z: 0 });
      const xRight = project({ x: 112 * xAxisIn, y: 0, z: 0 });
      line(
        xLeft,
        xRight,
        "rgba(224,232,242," + 0.34 * planeFade + ")"
      );
      label("HARDWARE", xLeft, xAxisIn * planeFade, -24, 4);
      label("SOFTWARE", xRight, xAxisIn * planeFade, 26, 4);

      // 2) Classical <-> Quantum appears second.
      if (yAxisIn > 0.001) {
        const yClassical = project({ x: 0, y: -112 * yAxisIn, z: 0 });
        const yQuantum = project({ x: 0, y: 112 * yAxisIn, z: 0 });

        line(
          yClassical,
          yQuantum,
          "rgba(224,232,242," + 0.30 * planeFade + ")"
        );
        label("CLASSICAL", yClassical, yAxisIn * planeFade, 0, 18);
        label("QUANTUM", yQuantum, yAxisIn * planeFade, 0, -12);
      }

      // 3) The basis fills into a flat plane. The plane stays front-facing
      // while evidence is placed, then rotates continuously into the final
      // lab/expertise camera as depth becomes visible.
      if (planeIn > 0.001 && planeFade > 0.001) {
        const grid = 5;
        const extent = 100;

        for (let i = -grid; i <= grid; i += 1) {
          const v = (i / grid) * extent;
          const a = project({ x: -extent, y: v, z: 0 });
          const b = project({ x: extent, y: v, z: 0 });
          const c = project({ x: v, y: -extent, z: 0 });
          const d = project({ x: v, y: extent, z: 0 });

          line(
            a,
            b,
            "rgba(170,187,208," + 0.095 * planeIn * planeFade + ")"
          );
          line(
            c,
            d,
            "rgba(170,187,208," + 0.095 * planeIn * planeFade + ")"
          );
        }
      }

      // 4) The third axis is distinct from Classical/Quantum. It becomes
      // visible only when the camera begins to reveal actual depth.
      if (view3D > 0.08 && planeFade > 0.001) {
        const zKnowledge = project({ x: 0, y: 0, z: 105 * view3D });
        const zExperience = project({ x: 0, y: 0, z: -105 * view3D });

        line(
          zExperience,
          zKnowledge,
          "rgba(224,232,242," + 0.26 * view3D * planeFade + ")"
        );
        label(
          "KNOWLEDGE",
          zKnowledge,
          view3D * planeFade,
          0,
          -12
        );
        label(
          "EXPERIENCE",
          zExperience,
          view3D * planeFade,
          0,
          18
        );
      }

      // Perspective-correct sphere helpers copied from the calibrated
      // lab/expertise projection.
      const sphereRadius3D = SPHERE_R * sphereGrow;
      const shellRadius =
        sphereRadius3D > 0
          ? scale *
            sphereRadius3D *
            (CAMERA_DISTANCE /
              Math.sqrt(
                CAMERA_DISTANCE * CAMERA_DISTANCE -
                  sphereRadius3D * sphereRadius3D
              ))
          : 0;

      const surfaceVisibilityMetric = (rotated: Point3) =>
        CAMERA_DISTANCE * rotated.z -
        (rotated.x * rotated.x +
          rotated.y * rotated.y +
          rotated.z * rotated.z);

      const drawSphereCircle = (
        plane: "xy" | "xz" | "yz",
        backAlpha: number,
        frontAlpha: number,
        radius: number
      ) => {
        if (radius <= 0) return;

        type RingPoint = {
          x: number;
          y: number;
          metric: number;
          back: boolean;
        };

        const points: RingPoint[] = [];
        const segments = 480;

        for (let i = 0; i <= segments; i += 1) {
          const a = (i / segments) * Math.PI * 2;
          let point: Point3;

          if (plane === "xy") {
            point = {
              x: radius * Math.cos(a),
              y: radius * Math.sin(a),
              z: 0,
            };
          } else if (plane === "xz") {
            point = {
              x: radius * Math.cos(a),
              y: 0,
              z: radius * Math.sin(a),
            };
          } else {
            point = {
              x: 0,
              y: radius * Math.cos(a),
              z: radius * Math.sin(a),
            };
          }

          const rotated = rotatePoint(point);
          const projected = project(point);
          const metric = surfaceVisibilityMetric(rotated);

          points.push({
            x: projected.x,
            y: projected.y,
            metric,
            back: metric < 0,
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
            const point = points[i];
            const previous = i > 0 ? points[i - 1] : null;

            if (previous && previous.back !== point.back) {
              const denom = previous.metric - point.metric;
              const t =
                Math.abs(denom) < 1e-9
                  ? 0.5
                  : previous.metric / denom;
              const u = clamp01(t);
              const edge = {
                x: previous.x + (point.x - previous.x) * u,
                y: previous.y + (point.y - previous.y) * u,
              };

              if (previous.back === drawBack && open) {
                ctx.lineTo(edge.x, edge.y);
              }

              open = false;

              if (point.back === drawBack) {
                ctx.moveTo(edge.x, edge.y);
                open = true;
              }
            }

            if (point.back === drawBack) {
              if (!open) {
                ctx.moveTo(point.x, point.y);
                open = true;
              } else {
                ctx.lineTo(point.x, point.y);
              }
            }
          }

          ctx.stroke();
          ctx.restore();
        });
      };

      // 5) Sphere grows only after the same rods have converged.
      if (sphereGrow > 0.001) {
        ctx.save();

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

        ctx.fillStyle = glass;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        drawSphereCircle("xy", 0.010, 0.024, sphereRadius3D);
        drawSphereCircle("xz", 0.009, 0.020, sphereRadius3D);
        drawSphereCircle("yz", 0.008, 0.018, sphereRadius3D);
      }

      // 6) Evidence points land first. Once a rod grows, the point itself
      // dissolves into the rod base instead of remaining as a second object.
      const pointAlpha = pointsIn * (1 - rodGrow) * planeFade;

      if (pointAlpha > 0.001) {
        capabilities.forEach((item, index) => {
          const stagger = clamp01(
            (pointsIn * capabilities.length - index) / 3.5
          );
          if (stagger <= 0) return;

          const point = project(item.base);

          ctx.save();
          ctx.globalAlpha = pointAlpha * stagger;
          ctx.fillStyle = "rgba(222,230,241,.86)";
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // 7) One continuous rod object per capability:
      // - it grows from the evidence point,
      // - then keeps exactly the same vector/length,
      // - then only its base translates to the shared origin.
      capabilities.forEach((item) => {
        if (rodGrow <= 0.001) return;

        const base: Point3 = {
          x: item.base.x * (1 - recenter),
          y: item.base.y * (1 - recenter),
          z: 0,
        };

        const vectorScale = rodGrow;
        const tip: Point3 = {
          x: base.x + item.direction.x * item.length * vectorScale,
          y: base.y + item.direction.y * item.length * vectorScale,
          z: base.z + item.direction.z * item.length * vectorScale,
        };

        const start = project(base);
        const end = project(tip);
        const color =
          item.mode === "Knowledge" ? KNOWLEDGE : EXPERIENCE;

        line(
          start,
          end,
          color === KNOWLEDGE
            ? "rgba(75,134,216,.86)"
            : "rgba(207,90,90,.82)",
          1.45 + item.length / SPHERE_R * 2.2
        );

        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        ctx.arc(
          end.x,
          end.y,
          2.3 + (item.length / SPHERE_R) * 1.8,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      });

      // 8) Redraw the sphere's front geometry and true silhouette last.
      if (sphereGrow > 0.001) {
        drawSphereCircle("xy", 0, 0.034, sphereRadius3D);
        drawSphereCircle("xz", 0, 0.028, sphereRadius3D);
        drawSphereCircle("yz", 0, 0.024, sphereRadius3D);

        ctx.save();
        ctx.strokeStyle = "rgba(229,236,246,.22)";
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (sphereGrow > 0.86) {
          const hardware = project({ x: -SPHERE_R, y: 0, z: 0 });
          const software = project({ x: SPHERE_R, y: 0, z: 0 });
          const classical = project({ x: 0, y: -SPHERE_R, z: 0 });
          const quantum = project({ x: 0, y: SPHERE_R, z: 0 });
          const knowledge = project({ x: 0, y: 0, z: SPHERE_R });
          const experience = project({ x: 0, y: 0, z: -SPHERE_R });

          const axisAlpha = smooth(0.86, 1, sphereGrow) * 0.58;
          label("HARDWARE", hardware, axisAlpha, -18, 0);
          label("SOFTWARE", software, axisAlpha, 20, 0);
          label("CLASSICAL", classical, axisAlpha, 0, 16);
          label("QUANTUM", quantum, axisAlpha, 0, -10);
          label("KNOWLEDGE", knowledge, axisAlpha, 0, -10);
          label("EXPERIENCE", experience, axisAlpha, 0, 16);
        }
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
