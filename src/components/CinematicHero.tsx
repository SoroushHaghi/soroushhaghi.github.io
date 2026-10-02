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

const mixDirection = (a: Point3, b: Point3, t: number): Point3 =>
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
        const z =
          70 * ((item.K - item.E) / (item.K + item.E + 1e-6));
        const finalDirection = normalize(item.x, item.y, z);
        const initialDirection: Point3 = {
          x: 0,
          y: 0,
          z: z >= 0 ? 1 : -1,
        };

        return {
          ...item,
          base2D: { x: item.x, y: item.y, z: 0 } as Point3,
          zValue: z,
          initialDirection,
          finalDirection,
          rodLength: clamp01(item.score / 5) * SPHERE_R,
          color: z >= 0 ? BLUE : RED,
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

      const targetWidth = Math.round(W * dpr);
      const targetHeight = Math.round(H * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const p = progressRef.current;

      // Strictly separated stages.
      const xAxisIn = smooth(0.02, 0.08, p);
      const yAxisIn = smooth(0.10, 0.16, p);
      const planeIn = smooth(0.18, 0.25, p);
      const pointsIn = smooth(0.30, 0.35, p);
      const cameraMove = smooth(0.40, 0.53, p);
      const zAxisIn = smooth(0.57, 0.63, p);
      const rodsGrow = smooth(0.67, 0.76, p);
      const pointsOut = smooth(0.77, 0.81, p);
      const centering = smooth(0.83, 0.92, p);
      const planeFade = 1 - smooth(0.84, 0.93, p);
      const sphereGrow = smooth(0.95, 1.0, p);

      const centerX = W * 0.5;
      const centerY = H * 0.5;
      const scale = Math.min(W, H) / 340;

      const spin = VIEW_SPIN * cameraMove;
      const pitch = VIEW_PITCH * cameraMove;
      const roll = VIEW_ROLL * cameraMove;

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
        const rotated = rotate(point);
        const persp = CAMERA_DISTANCE / (CAMERA_DISTANCE - rotated.z);

        return {
          x: centerX + rotated.x * scale * persp,
          y: centerY - rotated.y * scale * persp,
          depth: rotated.z,
          persp,
        };
      };

      const drawLine = (
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

      const drawDot = (
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

      const drawLabel = (
        text: string,
        point: { x: number; y: number },
        alpha: number,
        dx = 0,
        dy = 0
      ) => {
        if (alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(229,235,244,.56)";
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
      glow.addColorStop(0, "rgba(30,43,59,.115)");
      glow.addColorStop(0.56, "rgba(9,15,22,.035)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Stage 1 — Hardware / Software only.
      if (xAxisIn > 0.001) {
        const extent = SPHERE_R * xAxisIn;
        const left = project({ x: -extent, y: 0, z: 0 });
        const right = project({ x: extent, y: 0, z: 0 });

        drawLine(
          left,
          right,
          "rgba(224,232,242," + 0.30 * xAxisIn + ")"
        );

        drawLabel("HARDWARE", left, xAxisIn * 0.88, -24, 4);
        drawLabel("SOFTWARE", right, xAxisIn * 0.88, 26, 4);
      }

      // Stage 2 — Classical / Quantum, only after X is complete.
      if (yAxisIn > 0.001) {
        const extent = SPHERE_R * yAxisIn;
        const classical = project({ x: 0, y: -extent, z: 0 });
        const quantum = project({ x: 0, y: extent, z: 0 });

        drawLine(
          classical,
          quantum,
          "rgba(224,232,242," + 0.28 * yAxisIn + ")"
        );

        drawLabel("CLASSICAL", classical, yAxisIn * 0.88, 0, 18);
        drawLabel("QUANTUM", quantum, yAxisIn * 0.88, 0, -12);
      }

      // Stage 3 — 2D plane appears after both axes are finished.
      if (planeIn > 0.001 && planeFade > 0.001) {
        const gridCount = 5;
        const extent = 100;

        for (let i = -gridCount; i <= gridCount; i += 1) {
          const v = (i / gridCount) * extent;
          const a = project({ x: -extent, y: v, z: 0 });
          const b = project({ x: extent, y: v, z: 0 });
          const c = project({ x: v, y: -extent, z: 0 });
          const d = project({ x: v, y: extent, z: 0 });

          drawLine(
            a,
            b,
            "rgba(170,187,208," + 0.095 * planeIn * planeFade + ")"
          );

          drawLine(
            c,
            d,
            "rgba(170,187,208," + 0.095 * planeIn * planeFade + ")"
          );
        }
      }

      // Stage 4 — all data points arrive together after a pause.
      if (pointsIn > 0.001 && pointsOut < 1) {
        const pointAlpha = pointsIn * (1 - pointsOut);

        capabilities.forEach((item) => {
          const point = project(item.base2D);
          drawDot(
            point,
            2.8,
            "rgba(221,229,239,1)",
            pointAlpha * 0.90
          );
        });
      }

      // Stage 5 — camera rotates the already-complete 2D state into the
      // calibrated 3D perspective. No rods or Z axis yet.
      // The transform is handled by cameraMove above.

      // Keep the original X/Y axes fully visible after the camera settles.
      if (cameraMove > 0.001) {
        const axisAlpha = 0.26 + cameraMove * 0.06;
        const left = project({ x: -SPHERE_R, y: 0, z: 0 });
        const right = project({ x: SPHERE_R, y: 0, z: 0 });
        const classical = project({ x: 0, y: -SPHERE_R, z: 0 });
        const quantum = project({ x: 0, y: SPHERE_R, z: 0 });

        drawLine(
          left,
          right,
          "rgba(224,232,242," + axisAlpha + ")"
        );
        drawLine(
          classical,
          quantum,
          "rgba(224,232,242," + (axisAlpha - 0.02) + ")"
        );

        drawLabel("HARDWARE", left, 0.58, -24, 4);
        drawLabel("SOFTWARE", right, 0.58, 26, 4);
        drawLabel("CLASSICAL", classical, 0.58, 0, 18);
        drawLabel("QUANTUM", quantum, 0.58, 0, -12);
      }

      // Stage 6 — Knowledge / Experience axis only after camera movement ends.
      if (zAxisIn > 0.001) {
        const extent = SPHERE_R * zAxisIn;
        const experience = project({ x: 0, y: 0, z: -extent });
        const knowledge = project({ x: 0, y: 0, z: extent });

        drawLine(
          experience,
          knowledge,
          "rgba(224,232,242," + 0.28 * zAxisIn + ")"
        );

        drawLabel("EXPERIENCE", experience, zAxisIn * 0.9, 0, 16);
        drawLabel("KNOWLEDGE", knowledge, zAxisIn * 0.9, 0, -10);
      }

      // Stage 7 — rods grow clearly positive OR negative along the Z axis.
      if (rodsGrow > 0.001) {
        capabilities.forEach((item) => {
          const base = item.base2D;

          const tip: Point3 = {
            x: base.x,
            y: base.y,
            z:
              base.z +
              item.initialDirection.z * item.rodLength * rodsGrow,
          };

          const a = project(base);
          const b = project(tip);

          drawLine(
            a,
            b,
            item.color === BLUE
              ? "rgba(75,134,216,.90)"
              : "rgba(207,90,90,.86)",
            1.45 + (item.rodLength / SPHERE_R) * 2
          );

          drawDot(
            b,
            2.25 + (item.rodLength / SPHERE_R) * 1.55,
            item.color,
            0.95
          );
        });
      }

      // Stage 8 — the plane points disappear completely before centering.
      // pointsOut is handled above.

      // Stage 9 — the SAME rods move from their bases on the plane to the
      // origin. Length is fixed. Direction resolves during the same motion.
      if (centering > 0.001) {
        capabilities.forEach((item) => {
          const base: Point3 = {
            x: lerp(item.base2D.x, 0, centering),
            y: lerp(item.base2D.y, 0, centering),
            z: 0,
          };

          const direction = mixDirection(
            item.initialDirection,
            item.finalDirection,
            centering
          );

          const tip: Point3 = {
            x: base.x + direction.x * item.rodLength,
            y: base.y + direction.y * item.rodLength,
            z: base.z + direction.z * item.rodLength,
          };

          const a = project(base);
          const b = project(tip);

          drawLine(
            a,
            b,
            item.color === BLUE
              ? "rgba(75,134,216,.92)"
              : "rgba(207,90,90,.88)",
            1.45 + (item.rodLength / SPHERE_R) * 2
          );

          drawDot(
            b,
            2.25 + (item.rodLength / SPHERE_R) * 1.55,
            item.color,
            0.96
          );
        });
      }

      // During centering, fade only the grid. Principal axes remain.
      if (centering > 0.001) {
        const left = project({ x: -SPHERE_R, y: 0, z: 0 });
        const right = project({ x: SPHERE_R, y: 0, z: 0 });
        const classical = project({ x: 0, y: -SPHERE_R, z: 0 });
        const quantum = project({ x: 0, y: SPHERE_R, z: 0 });
        const experience = project({ x: 0, y: 0, z: -SPHERE_R });
        const knowledge = project({ x: 0, y: 0, z: SPHERE_R });

        drawLine(left, right, "rgba(224,232,242,.20)");
        drawLine(classical, quantum, "rgba(224,232,242,.18)");
        drawLine(experience, knowledge, "rgba(224,232,242,.18)");
      }

      // Stage 10 — sphere appears only after centering is complete.
      if (sphereGrow > 0.001) {
        const radius = SPHERE_R * sphereGrow;

        const shellRadius =
          scale *
          radius *
          (CAMERA_DISTANCE /
            Math.sqrt(
              Math.max(
                1,
                CAMERA_DISTANCE * CAMERA_DISTANCE - radius * radius
              )
            ));

        const visibilityMetric = (rotated: Point3) =>
          CAMERA_DISTANCE * rotated.z -
          (rotated.x * rotated.x +
            rotated.y * rotated.y +
            rotated.z * rotated.z);

        const drawSurfacePath = (
          generator: (t: number) => Point3,
          backAlpha: number,
          frontAlpha: number
        ) => {
          const samples = 360;
          const points: Array<{
            x: number;
            y: number;
            metric: number;
            back: boolean;
          }> = [];

          for (let i = 0; i <= samples; i += 1) {
            const t = (i / samples) * Math.PI * 2;
            const point = generator(t);
            const rotated = rotate(point);
            const projected = project(point);
            const metric = visibilityMetric(rotated);

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
              const current = points[i];
              const previous = i > 0 ? points[i - 1] : null;

              if (previous && previous.back !== current.back) {
                const denom = previous.metric - current.metric;
                const u =
                  Math.abs(denom) < 1e-9
                    ? 0.5
                    : clamp01(previous.metric / denom);

                const edgeX =
                  previous.x + (current.x - previous.x) * u;
                const edgeY =
                  previous.y + (current.y - previous.y) * u;

                if (previous.back === drawBack && open) {
                  ctx.lineTo(edgeX, edgeY);
                }

                open = false;

                if (current.back === drawBack) {
                  ctx.moveTo(edgeX, edgeY);
                  open = true;
                }
              }

              if (current.back === drawBack) {
                if (!open) {
                  ctx.moveTo(current.x, current.y);
                  open = true;
                } else {
                  ctx.lineTo(current.x, current.y);
                }
              }
            }

            ctx.stroke();
            ctx.restore();
          });
        };

        ctx.save();
        const glass = ctx.createRadialGradient(
          centerX - shellRadius * 0.18,
          centerY - shellRadius * 0.22,
          shellRadius * 0.06,
          centerX,
          centerY,
          Math.max(1, shellRadius)
        );
        glass.addColorStop(0, "rgba(218,226,238,.045)");
        glass.addColorStop(0.68, "rgba(179,193,211,.020)");
        glass.addColorStop(1, "rgba(120,142,172,.006)");

        ctx.fillStyle = glass;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Longitude family.
        for (let i = 0; i < 8; i += 1) {
          const phi = (i / 8) * Math.PI;

          drawSurfacePath(
            (t) => {
              const latitude = t - Math.PI;
              const c = Math.cos(latitude);
              return {
                x: radius * c * Math.cos(phi),
                y: radius * c * Math.sin(phi),
                z: radius * Math.sin(latitude),
              };
            },
            0.006,
            0.022
          );
        }

        // Latitude family.
        [-60, -35, 0, 35, 60].forEach((degrees) => {
          const latitude = (degrees * Math.PI) / 180;
          const ringRadius = radius * Math.cos(latitude);
          const z = radius * Math.sin(latitude);

          drawSurfacePath(
            (t) => ({
              x: ringRadius * Math.cos(t),
              y: ringRadius * Math.sin(t),
              z,
            }),
            0.006,
            degrees === 0 ? 0.026 : 0.018
          );
        });

        // Principal axes stay visible through the sphere.
        const left = project({ x: -radius, y: 0, z: 0 });
        const right = project({ x: radius, y: 0, z: 0 });
        const classical = project({ x: 0, y: -radius, z: 0 });
        const quantum = project({ x: 0, y: radius, z: 0 });
        const experience = project({ x: 0, y: 0, z: -radius });
        const knowledge = project({ x: 0, y: 0, z: radius });

        drawLine(left, right, "rgba(230,236,245,.19)", 1);
        drawLine(classical, quantum, "rgba(230,236,245,.17)", 1);
        drawLine(experience, knowledge, "rgba(230,236,245,.17)", 1);

        ctx.save();
        ctx.strokeStyle = "rgba(229,236,246,.28)";
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
