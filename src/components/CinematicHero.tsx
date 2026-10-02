import React, { useEffect, useMemo, useRef } from "react";
import { expertiseCapabilities } from "../expertise/expertiseData";
import "./cinematicHero.scss";

type Point3 = { x: number; y: number; z: number };

const SPHERE_R = 115;
const AXIS_R = 142;
const CAMERA_DISTANCE = 430;
const VIEW_SPIN = -0.35;
const VIEW_PITCH = (-68 * Math.PI) / 180;
const VIEW_ROLL = (-7 * Math.PI) / 180;

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
  const wheelLockUntilRef = useRef(0);
  const wheelAnimationRef = useRef<number | null>(null);

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
    const stageStops = [
      0,
      0.08,
      0.16,
      0.25,
      0.35,
      0.53,
      0.63,
      0.76,
      0.81,
      0.92,
      1,
    ];

    const animateTo = (targetY: number) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = 1450;
      const startedAt = performance.now();

      if (wheelAnimationRef.current !== null) {
        cancelAnimationFrame(wheelAnimationRef.current);
      }

      const tick = (now: number) => {
        const t = clamp01((now - startedAt) / duration);
        const eased = 0.5 - Math.cos(Math.PI * t) / 2;

        window.scrollTo(0, startY + distance * eased);

        if (t < 1) {
          wheelAnimationRef.current = requestAnimationFrame(tick);
        } else {
          wheelAnimationRef.current = null;
        }
      };

      wheelAnimationRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      const root = rootRef.current;
      if (!root) return;

      const rect = root.getBoundingClientRect();
      const active =
        rect.top <= 1 && rect.bottom >= window.innerHeight - 1;

      if (!active || Math.abs(event.deltaY) < 4) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const current = progressRef.current;

      if (
        (direction < 0 && current <= 0.001) ||
        (direction > 0 && current >= 0.999)
      ) {
        return;
      }

      event.preventDefault();

      const now = performance.now();
      if (now < wheelLockUntilRef.current) return;

      let nearest = 0;
      let nearestDistance = Infinity;

      stageStops.forEach((stop, index) => {
        const distance = Math.abs(stop - current);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      const nextIndex = Math.max(
        0,
        Math.min(stageStops.length - 1, nearest + direction)
      );

      const sectionTop = window.scrollY + rect.top;
      const travel = Math.max(
        1,
        root.offsetHeight - window.innerHeight
      );
      const targetY =
        sectionTop + stageStops[nextIndex] * travel;

      wheelLockUntilRef.current = now + 1520;
      animateTo(targetY);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);

      if (wheelAnimationRef.current !== null) {
        cancelAnimationFrame(wheelAnimationRef.current);
        wheelAnimationRef.current = null;
      }
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

      const drawArrowHead = (
        tip: { x: number; y: number },
        from: { x: number; y: number },
        stroke: string,
        size = 8
      ) => {
        const angle = Math.atan2(tip.y - from.y, tip.x - from.x);
        const spread = 0.48;

        const left = {
          x: tip.x - size * Math.cos(angle - spread),
          y: tip.y - size * Math.sin(angle - spread),
        };
        const right = {
          x: tip.x - size * Math.cos(angle + spread),
          y: tip.y - size * Math.sin(angle + spread),
        };

        drawLine(tip, left, stroke, 1);
        drawLine(tip, right, stroke, 1);
      };

      const drawAxis = (
        negative: { x: number; y: number },
        positive: { x: number; y: number },
        stroke: string,
        width = 1
      ) => {
        drawLine(negative, positive, stroke, width);
        drawArrowHead(negative, positive, stroke);
        drawArrowHead(positive, negative, stroke);
      };

      const drawAxisLabel = (
        text: string,
        endpoint: { x: number; y: number },
        alpha: number,
        gap = 25
      ) => {
        const dx = endpoint.x - centerX;
        const dy = endpoint.y - centerY;
        const n = Math.hypot(dx, dy) || 1;

        drawLabel(
          text,
          endpoint,
          alpha,
          (dx / n) * gap,
          (dy / n) * gap
        );
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
        const extent = AXIS_R * xAxisIn;
        const left = project({ x: -extent, y: 0, z: 0 });
        const right = project({ x: extent, y: 0, z: 0 });
        const preCamera = 1 - cameraMove;
        const stroke =
          "rgba(224,232,242," +
          0.30 * xAxisIn * preCamera +
          ")";

        drawAxis(left, right, stroke);

        drawAxisLabel(
          "HARDWARE",
          left,
          xAxisIn * 0.88 * preCamera,
          38
        );
        drawAxisLabel(
          "SOFTWARE",
          right,
          xAxisIn * 0.88 * preCamera,
          38
        );
      }

      // Stage 2 — Classical / Quantum, only after X is complete.
      if (yAxisIn > 0.001) {
        const extent = AXIS_R * yAxisIn;
        const classical = project({ x: 0, y: -extent, z: 0 });
        const quantum = project({ x: 0, y: extent, z: 0 });
        const preCamera = 1 - cameraMove;
        const stroke =
          "rgba(224,232,242," +
          0.28 * yAxisIn * preCamera +
          ")";

        drawAxis(classical, quantum, stroke);

        drawAxisLabel(
          "CLASSICAL",
          classical,
          yAxisIn * 0.88 * preCamera,
          38
        );
        drawAxisLabel(
          "QUANTUM",
          quantum,
          yAxisIn * 0.88 * preCamera,
          38
        );
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

      // Keep the original X/Y axes visible after the camera settles.
      // Labels cross-fade out before the sphere labels take over, avoiding
      // duplicate words.
      if (cameraMove > 0.001) {
        const axisAlpha = 0.30 * cameraMove;
        const labelAlpha =
          0.64 * cameraMove * (1 - sphereGrow);

        const left = project({ x: -AXIS_R, y: 0, z: 0 });
        const right = project({ x: AXIS_R, y: 0, z: 0 });
        const classical = project({ x: 0, y: -AXIS_R, z: 0 });
        const quantum = project({ x: 0, y: AXIS_R, z: 0 });
        const xStroke =
          "rgba(224,232,242," + axisAlpha + ")";
        const yStroke =
          "rgba(224,232,242," +
          Math.max(0, axisAlpha - 0.02) +
          ")";

        drawAxis(left, right, xStroke);
        drawAxis(classical, quantum, yStroke);

        drawAxisLabel("HARDWARE", left, labelAlpha, 42);
        drawAxisLabel("SOFTWARE", right, labelAlpha, 42);
        drawAxisLabel("CLASSICAL", classical, labelAlpha, 42);
        drawAxisLabel("QUANTUM", quantum, labelAlpha, 42);
      }

      // Stage 6 — Knowledge / Experience axis only after camera movement ends.
      // This pre-sphere label set fades out before the sphere label set appears.
      if (zAxisIn > 0.001) {
        const preSphere = 1 - sphereGrow;
        const extent = AXIS_R * zAxisIn;
        const experience = project({ x: 0, y: 0, z: -extent });
        const knowledge = project({ x: 0, y: 0, z: extent });
        const stroke =
          "rgba(224,232,242," +
          0.28 * zAxisIn * preSphere +
          ")";

        drawAxis(experience, knowledge, stroke);

        drawAxisLabel(
          "EXPERIENCE",
          experience,
          zAxisIn * 0.9 * preSphere,
          42
        );
        drawAxisLabel(
          "KNOWLEDGE",
          knowledge,
          zAxisIn * 0.9 * preSphere,
          42
        );
      }

      // Stages 7–9 — one continuous rod object per capability.
      // Rods first grow signed along Z. After point removal, the SAME rods
      // translate from their plane bases to the shared origin while their
      // direction resolves to the final Career OS direction. No duplicate
      // rod set is created at any point.
      if (rodsGrow > 0.001) {
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

          const visibleLength = item.rodLength * rodsGrow;

          const tip: Point3 = {
            x: base.x + direction.x * visibleLength,
            y: base.y + direction.y * visibleLength,
            z: base.z + direction.z * visibleLength,
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

      // Stage 8 — the original plane points disappear completely before
      // centering. pointsOut is handled in the point-rendering stage above.

      // During centering, fade only the grid. Principal axes remain.
      if (centering > 0.001) {
        const left = project({ x: -AXIS_R, y: 0, z: 0 });
        const right = project({ x: AXIS_R, y: 0, z: 0 });
        const classical = project({ x: 0, y: -AXIS_R, z: 0 });
        const quantum = project({ x: 0, y: AXIS_R, z: 0 });
        const experience = project({ x: 0, y: 0, z: -AXIS_R });
        const knowledge = project({ x: 0, y: 0, z: AXIS_R });

        drawAxis(left, right, "rgba(224,232,242,.20)");
        drawAxis(classical, quantum, "rgba(224,232,242,.18)");
        drawAxis(experience, knowledge, "rgba(224,232,242,.18)");
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

        // Glass body: asymmetric highlight + subtle edge density makes the
        // shell read as a volume rather than a flat circle.
        ctx.save();
        const glass = ctx.createRadialGradient(
          centerX - shellRadius * 0.24,
          centerY - shellRadius * 0.28,
          shellRadius * 0.04,
          centerX,
          centerY,
          Math.max(1, shellRadius)
        );
        glass.addColorStop(0, "rgba(226,235,247,.075)");
        glass.addColorStop(0.34, "rgba(185,202,224,.032)");
        glass.addColorStop(0.72, "rgba(125,148,178,.018)");
        glass.addColorStop(1, "rgba(58,76,101,.030)");
        ctx.fillStyle = glass;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // A soft edge-density pass gives the eye a clear curved volume cue.
        ctx.save();
        const edgeShade = ctx.createRadialGradient(
          centerX,
          centerY,
          shellRadius * 0.46,
          centerX,
          centerY,
          shellRadius
        );
        edgeShade.addColorStop(0, "rgba(0,0,0,0)");
        edgeShade.addColorStop(0.74, "rgba(96,120,151,.006)");
        edgeShade.addColorStop(1, "rgba(188,207,232,.040)");
        ctx.fillStyle = edgeShade;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Three orthogonal great circles are the primary depth scaffold.
        drawSurfacePath(
          (t) => ({
            x: radius * Math.cos(t),
            y: radius * Math.sin(t),
            z: 0,
          }),
          0.012,
          0.065
        );

        drawSurfacePath(
          (t) => ({
            x: radius * Math.cos(t),
            y: 0,
            z: radius * Math.sin(t),
          }),
          0.012,
          0.060
        );

        drawSurfacePath(
          (t) => ({
            x: 0,
            y: radius * Math.cos(t),
            z: radius * Math.sin(t),
          }),
          0.012,
          0.056
        );

        // Additional meridians. Front halves are intentionally stronger than
        // rear halves to make occlusion and curvature immediately legible.
        for (let i = 0; i < 10; i += 1) {
          const phi = (i / 10) * Math.PI;

          drawSurfacePath(
            (t) => ({
              x: radius * Math.cos(t) * Math.cos(phi),
              y: radius * Math.cos(t) * Math.sin(phi),
              z: radius * Math.sin(t),
            }),
            0.006,
            0.030
          );
        }

        // Latitude rings provide the missing foreshortening cue.
        [-70, -50, -30, 0, 30, 50, 70].forEach((degrees) => {
          const latitude = (degrees * Math.PI) / 180;
          const ringRadius = radius * Math.cos(latitude);
          const z = radius * Math.sin(latitude);

          drawSurfacePath(
            (t) => ({
              x: ringRadius * Math.cos(t),
              y: ringRadius * Math.sin(t),
              z,
            }),
            0.005,
            degrees === 0 ? 0.040 : 0.024
          );
        });

        // Curved specular arc on the near rim.
        ctx.save();
        ctx.strokeStyle = "rgba(235,243,252,.18)";
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          shellRadius - 1.2,
          Math.PI * 1.08,
          Math.PI * 1.72
        );
        ctx.stroke();
        ctx.restore();

        // Principal axes stay visible through the sphere.
        const axisRadius = AXIS_R * sphereGrow;
        const left = project({ x: -axisRadius, y: 0, z: 0 });
        const right = project({ x: axisRadius, y: 0, z: 0 });
        const classical = project({ x: 0, y: -axisRadius, z: 0 });
        const quantum = project({ x: 0, y: axisRadius, z: 0 });
        const experience = project({ x: 0, y: 0, z: -axisRadius });
        const knowledge = project({ x: 0, y: 0, z: axisRadius });

        drawAxis(left, right, "rgba(230,236,245,.22)", 1);
        drawAxis(classical, quantum, "rgba(230,236,245,.20)", 1);
        drawAxis(experience, knowledge, "rgba(230,236,245,.20)", 1);

        const finalLabelAlpha = smooth(0.35, 1, sphereGrow) * 0.68;
        drawAxisLabel("HARDWARE", left, finalLabelAlpha, 46);
        drawAxisLabel("SOFTWARE", right, finalLabelAlpha, 46);
        drawAxisLabel("CLASSICAL", classical, finalLabelAlpha, 46);
        drawAxisLabel("QUANTUM", quantum, finalLabelAlpha, 46);
        drawAxisLabel("EXPERIENCE", experience, finalLabelAlpha, 46);
        drawAxisLabel("KNOWLEDGE", knowledge, finalLabelAlpha, 46);

        ctx.save();
        ctx.strokeStyle = "rgba(229,236,246,.42)";
        ctx.lineWidth = 1.45;
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
