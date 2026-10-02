import React, { useEffect, useMemo, useRef, useState } from "react";
import { expertiseCapabilities, expertiseTargets } from "../expertise/expertiseData";
import "./cinematicHero.scss";

type Point3 = { x: number; y: number; z: number };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / Math.max(1e-6, b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rgba = (hex: string, a: number) => {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const KNOWLEDGE = "#4b86d8";
const EXPERIENCE = "#cf5a5a";
const TARGET = "#e4c449";

function CinematicHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0 });
  const targetPointerRef = useRef({ x: 0 });
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const capabilities = useMemo(() => {
    const projected = expertiseCapabilities.map((item) => {
      const zCoordinate =
        70 * ((item.K - item.E) / (item.K + item.E + 1e-6));
      const directionLength =
        Math.hypot(item.x, item.y, zCoordinate) || 1;
      const strength = Math.max(0, Math.min(1, item.score / 5));
      const azimuth = Math.atan2(item.y, item.x);
      const elevation = Math.atan2(
        zCoordinate,
        Math.hypot(item.x, item.y)
      );

      return {
        ...item,
        planeX: item.x / 100,
        planeY: item.y / 100,
        zCoordinate,
        strength,
        azimuth,
        elevation,
        dir: {
          x: item.x / directionLength,
          y: item.y / directionLength,
          z: zCoordinate / directionLength,
        },
      };
    });

    const amplitudeNorm =
      Math.sqrt(
        projected.reduce(
          (sum, item) => sum + item.strength * item.strength,
          0
        )
      ) || 1;

    return projected.map((item) => ({
      ...item,
      amplitude: item.strength / amplitudeNorm,
    }));
  }, []);

  const targetStates = useMemo(() => {
    const norm =
      Math.sqrt(
        expertiseTargets.reduce(
          (sum, item) => sum + item.support * item.support,
          0
        )
      ) || 1;

    return expertiseTargets.map((item) => {
      const length =
        Math.hypot(item.pos.x, item.pos.y, item.pos.z) || 1;
      const amplitude = item.support / norm;

      return {
        ...item,
        direction: {
          x: item.pos.x / length,
          y: item.pos.y / length,
          z: item.pos.z / length,
        },
        amplitude,
        probability: amplitude * amplitude,
      };
    });
  }, []);

  const selectedTarget = useMemo(() => {
    let hash = 2166136261;
    const source = capabilities
      .map(
        (item) =>
          item.id +
          ":" +
          item.strength.toFixed(4) +
          ":" +
          item.zCoordinate.toFixed(3)
      )
      .join("|");

    for (let i = 0; i < source.length; i += 1) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const sample = ((hash >>> 0) % 1000003) / 1000003;
    let cumulative = 0;

    for (const target of targetStates) {
      cumulative += target.probability;
      if (sample <= cumulative) return target;
    }

    return targetStates[targetStates.length - 1];
  }, [capabilities, targetStates]);

  useEffect(() => {
    const updateProgressFromScroll = () => {
      const root = rootRef.current;
      if (!root) return;

      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, root.offsetHeight - window.innerHeight);
      const next = clamp01(-rect.top / travel);

      progressRef.current = next;
      setProgress((current) =>
        Math.abs(current - next) > 0.0005 ? next : current
      );
    };

    updateProgressFromScroll();
    window.addEventListener("scroll", updateProgressFromScroll, {
      passive: true,
    });
    window.addEventListener("resize", updateProgressFromScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateProgressFromScroll);
      window.removeEventListener("resize", updateProgressFromScroll);
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
      const w = Math.round(W * dpr);
      const h = Math.round(H * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const p = progressRef.current;
      pointerRef.current.x += (targetPointerRef.current.x - pointerRef.current.x) * 0.055;

      const centerX = W * 0.5;
      const centerY = H * 0.5;
      const planeScale = Math.min(W * 0.34, H * 0.34);
      const sphereR = Math.min(W, H) * (W < 760 ? 0.31 : 0.285);
      const mouseYaw = pointerRef.current.x * 0.14;

      const stage2d = smooth(0.035, 0.13, p);
      const planeIn = smooth(0.18, 0.30, p);
      const pointsIn = smooth(0.27, 0.42, p);
      const zIn = smooth(0.40, 0.48, p);
      const knowledgeGrow = smooth(0.44, 0.52, p);
      const experienceGrow = smooth(0.50, 0.58, p);
      const vectorResolve = smooth(0.58, 0.66, p);
      const recenter = smooth(0.65, 0.76, p);
      const sphereIn = smooth(0.76, 0.84, p);
      const targetsIn = smooth(0.85, 0.92, p);
      const collapse = smooth(0.94, 0.995, p);
      const planeFade = 1 - smooth(0.62, 0.75, p);

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
      glow.addColorStop(0, "rgba(40,55,76,.15)");
      glow.addColorStop(0.48, "rgba(14,20,29,.065)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      const projectPlane = (x: number, y: number, z = 0): Point3 => {
        const tiltX = mix(0, -0.50, planeIn);
        const tiltZ = mix(0, -0.12 + mouseYaw, planeIn);
        const cz = Math.cos(tiltZ);
        const sz = Math.sin(tiltZ);
        const x1 = cz * x - sz * y;
        const y1 = sz * x + cz * y;
        const cx = Math.cos(tiltX);
        const sx = Math.sin(tiltX);

        return {
          x: x1,
          y: cx * y1 - sx * z,
          z: sx * y1 + cx * z,
        };
      };

      const toScreen = (v: Point3, scale = planeScale) => {
        const camera = 3.8;
        const persp = camera / (camera - v.z * 0.65);
        return {
          x: centerX + v.x * scale * persp,
          y: centerY - v.y * scale * persp,
          z: v.z,
          persp,
        };
      };

      const drawLine = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        color: string,
        width = 1
      ) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      };

      // 01 — Hardware / Software.
      if (stage2d > 0.001) {
        const axisLen = planeScale * 1.20 * stage2d;

        drawLine(
          { x: centerX - axisLen, y: centerY },
          { x: centerX + axisLen, y: centerY },
          `rgba(232,238,247,${0.34 * planeFade})`
        );

        ctx.save();
        ctx.globalAlpha = stage2d * planeFade;
        ctx.fillStyle = "rgba(238,242,248,.78)";
        ctx.font = "600 12px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HARDWARE", centerX - axisLen - 42, centerY + 4);
        ctx.fillText("SOFTWARE", centerX + axisLen + 42, centerY + 4);
        ctx.restore();

        // 02 — Classical / Quantum.
        const yAxis = smooth(0.115, 0.22, p);
        if (yAxis > 0) {
          drawLine(
            { x: centerX, y: centerY - axisLen * yAxis },
            { x: centerX, y: centerY + axisLen * yAxis },
            `rgba(232,238,247,${0.30 * planeFade})`
          );

          ctx.save();
          ctx.globalAlpha = yAxis * planeFade;
          ctx.fillStyle = "rgba(238,242,248,.72)";
          ctx.font = "600 12px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("QUANTUM", centerX, centerY - axisLen * yAxis - 18);
          ctx.fillText("CLASSICAL", centerX, centerY + axisLen * yAxis + 24);
          ctx.restore();
        }
      }

      // 03 — The 2D basis becomes a plane.
      if (planeIn > 0.001 && planeFade > 0.001) {
        const gridN = 6;
        for (let i = -gridN; i <= gridN; i += 1) {
          const v = i / gridN;
          const a = toScreen(projectPlane(-1.1, v));
          const b = toScreen(projectPlane(1.1, v));
          const c = toScreen(projectPlane(v, -1.1));
          const d = toScreen(projectPlane(v, 1.1));

          drawLine(a, b, `rgba(176,191,210,${0.11 * planeIn * planeFade})`);
          drawLine(c, d, `rgba(176,191,210,${0.11 * planeIn * planeFade})`);
        }
      }

      // 04 + 05 — Live evidence points, then Knowledge / Experience depth.
      for (let i = 0; i < capabilities.length; i += 1) {
        const item = capabilities[i];
        const stagger = clamp01((pointsIn * capabilities.length - i) / 4);
        const base = toScreen(projectPlane(item.planeX, item.planeY, 0));

        if (stagger > 0 && planeFade > 0) {
          ctx.save();
          ctx.globalAlpha = stagger * planeFade * (1 - vectorResolve) * 0.82;
          ctx.fillStyle = "rgba(219,228,240,.74)";
          ctx.beginPath();
          ctx.arc(base.x, base.y, 2.1 + 1.7 * stagger, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (zIn > 0 && vectorResolve < 0.999) {
          const kTop = toScreen(
            projectPlane(item.planeX, item.planeY, item.K * 0.9 * knowledgeGrow)
          );
          const eBottom = toScreen(
            projectPlane(item.planeX, item.planeY, -item.E * 0.9 * experienceGrow)
          );
          const barAlpha = (1 - vectorResolve) * 0.72;

          drawLine(base, kTop, rgba(KNOWLEDGE, barAlpha), 1.4);
          drawLine(base, eBottom, rgba(EXPERIENCE, barAlpha), 1.4);
        }
      }

      if (zIn > 0 && planeFade > 0) {
        const top = toScreen(projectPlane(0, 0, 1.08 * zIn));
        const bottom = toScreen(projectPlane(0, 0, -1.08 * zIn));

        drawLine(top, bottom, `rgba(236,241,247,${0.34 * planeFade})`);

        ctx.save();
        ctx.globalAlpha = zIn * planeFade;
        ctx.fillStyle = "rgba(238,242,248,.78)";
        ctx.font = "600 11px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("KNOWLEDGE", top.x, top.y - 12);
        ctx.fillText("EXPERIENCE", bottom.x, bottom.y + 20);
        ctx.restore();
      }

      // Shared 3D camera for rods and sphere. The same mathematical state is
      // viewed throughout the resolve/centering/sphere transition.
      const cameraDistance = 430 / 115;
      const spin = -0.35 + pointerRef.current.x * 0.18;
      const pitch = (-68 * Math.PI) / 180;
      const roll = (20 * Math.PI) / 180;

      const rotateState = (v: Point3) => {
        const cs = Math.cos(spin);
        const ss = Math.sin(spin);
        const x1 = cs * v.x - ss * v.y;
        const y1 = ss * v.x + cs * v.y;
        const z1 = v.z;

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

      const projectState = (v: Point3) => {
        const rotated = rotateState(v);
        const persp =
          cameraDistance / (cameraDistance - rotated.z);

        return {
          x: centerX + rotated.x * sphereR * persp,
          y: centerY - rotated.y * sphereR * persp,
          z: rotated.z,
          persp,
        };
      };

      const shellRadius =
        sphereR *
        (cameraDistance /
          Math.sqrt(cameraDistance * cameraDistance - 1));

      const visibilityMetric = (rotated: Point3) =>
        cameraDistance * rotated.z -
        (rotated.x * rotated.x +
          rotated.y * rotated.y +
          rotated.z * rotated.z);

      const drawGreatCircle = (
        plane: "xy" | "xz" | "yz",
        alpha: number
      ) => {
        const samples = 420;
        const points: Array<{
          x: number;
          y: number;
          metric: number;
          back: boolean;
        }> = [];

        for (let i = 0; i <= samples; i += 1) {
          const angle = (i / samples) * Math.PI * 2;
          let point: Point3;

          if (plane === "xy") {
            point = {
              x: Math.cos(angle),
              y: Math.sin(angle),
              z: 0,
            };
          } else if (plane === "xz") {
            point = {
              x: Math.cos(angle),
              y: 0,
              z: Math.sin(angle),
            };
          } else {
            point = {
              x: 0,
              y: Math.cos(angle),
              z: Math.sin(angle),
            };
          }

          const rotated = rotateState(point);
          const projected = projectState(point);
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
          ctx.strokeStyle = drawBack
            ? "rgba(220,230,242," + alpha * 0.24 + ")"
            : "rgba(220,230,242," + alpha + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();

          let open = false;
          for (let i = 0; i < points.length; i += 1) {
            const point = points[i];
            if (point.back === drawBack) {
              if (!open) {
                ctx.moveTo(point.x, point.y);
                open = true;
              } else {
                ctx.lineTo(point.x, point.y);
              }
            } else {
              open = false;
            }
          }

          ctx.stroke();
          ctx.restore();
        });
      };

      // 06 — Resolve each evidence column into its final rod. The canonical
      // normalized length stays constant. Re-centering translates the whole
      // rod to the same 3D origin; it does not stretch or shrink the rod.
      if (vectorResolve > 0.001) {
        for (const item of capabilities) {
          const baseOffset: Point3 = {
            x: item.planeX * 0.68 * (1 - recenter),
            y: item.planeY * 0.68 * (1 - recenter),
            z: 0,
          };

          const tip: Point3 = {
            x: baseOffset.x + item.dir.x * item.strength,
            y: baseOffset.y + item.dir.y * item.strength,
            z: baseOffset.z + item.dir.z * item.strength,
          };

          const start = projectState(baseOffset);
          const end = projectState(tip);
          const color = item.mode === "Knowledge" ? KNOWLEDGE : EXPERIENCE;
          const alpha = vectorResolve * (0.24 + recenter * 0.58);

          drawLine(
            start,
            end,
            rgba(color, alpha),
            1.5 + item.strength * 2.2
          );

          ctx.save();
          ctx.globalAlpha = vectorResolve * (0.42 + recenter * 0.48);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(end.x, end.y, 2 + item.strength * 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // BEGIN is the origin of the existing 3D state, not a destination off to
      // one side. It appears only after the rods have nearly converged.
      const beginAlpha = smooth(0.70, 0.77, p) * (1 - smooth(0.82, 0.87, p));
      if (beginAlpha > 0.001) {
        ctx.save();
        ctx.globalAlpha = beginAlpha;
        ctx.fillStyle = "rgba(236,241,248,.72)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "600 10px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BEGIN", centerX, centerY - 13);
        ctx.restore();
      }

      // 07 — Only after the same rods are centered does the shell form around
      // the same origin.
      if (sphereIn > 0.001) {
        const easedR = shellRadius * sphereIn;

        const inner = ctx.createRadialGradient(
          centerX - easedR * 0.18,
          centerY - easedR * 0.2,
          0,
          centerX,
          centerY,
          easedR
        );
        inner.addColorStop(0, `rgba(190,210,236,${0.035 * sphereIn})`);
        inner.addColorStop(0.72, `rgba(120,146,180,${0.014 * sphereIn})`);
        inner.addColorStop(1, "rgba(10,14,20,0)");

        ctx.save();
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.arc(centerX, centerY, easedR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(224,232,242,${0.20 * sphereIn})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(centerX, centerY, easedR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (sphereIn > 0.18) {
          drawGreatCircle("xy", 0.050 * sphereIn);
          drawGreatCircle("xz", 0.036 * sphereIn);
          drawGreatCircle("yz", 0.032 * sphereIn);

          const knowledge = projectState({ x: 0, y: 0, z: 1 });
          const experience = projectState({ x: 0, y: 0, z: -1 });
          const hardware = projectState({ x: -1, y: 0, z: 0 });
          const software = projectState({ x: 1, y: 0, z: 0 });
          const classical = projectState({ x: 0, y: -1, z: 0 });
          const quantum = projectState({ x: 0, y: 1, z: 0 });

          ctx.save();
          ctx.globalAlpha = sphereIn * 0.62;
          ctx.fillStyle = "rgba(229,235,244,.72)";
          ctx.font = "600 9px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("KNOWLEDGE", knowledge.x, knowledge.y - 10);
          ctx.fillText("EXPERIENCE", experience.x, experience.y + 18);
          ctx.fillText("HARDWARE", hardware.x, hardware.y - 7);
          ctx.fillText("SOFTWARE", software.x, software.y - 7);
          ctx.fillText("CLASSICAL", classical.x, classical.y - 7);
          ctx.fillText("QUANTUM", quantum.x, quantum.y - 7);
          ctx.restore();
        }

        // 08 — Target states are generated on the shell.
        const targetRows = targetStates.map((target) => ({
          target,
          point: projectState(target.direction),
        }));

        for (const row of targetRows) {
          const isChosen = row.target.id === selectedTarget.id;
          const targetAlpha =
            targetsIn *
            (collapse > 0 ? (isChosen ? 1 : 1 - collapse) : 1);

          if (targetAlpha <= 0.01) continue;

          ctx.save();
          ctx.globalAlpha =
            targetAlpha * (row.point.z < -0.15 ? 0.34 : 0.96);
          ctx.fillStyle = TARGET;
          ctx.strokeStyle = "rgba(255,231,130,.88)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(
            row.point.x,
            row.point.y,
            4.2 + (isChosen ? collapse * 2.8 : 0),
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          if (
            targetsIn > 0.5 &&
            row.point.z > -0.1 &&
            (collapse < 0.1 || isChosen)
          ) {
            ctx.save();
            ctx.globalAlpha = targetAlpha * 0.84;
            ctx.fillStyle = "rgba(233,219,153,.92)";
            ctx.font = "600 9px Inter, system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(
              row.target.name,
              row.point.x + 10,
              row.point.y - 7
            );
            ctx.restore();
          }
        }

        if (collapse > 0.52) {
          const measured = projectState(selectedTarget.direction);
          ctx.save();
          ctx.globalAlpha = smooth(0.52, 1, collapse);
          ctx.strokeStyle = "rgba(255,240,170,.94)";
          ctx.fillStyle = "rgba(255,244,193,.96)";
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(measured.x, measured.y, 8 + collapse * 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = "700 10px Inter, system-ui, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("YOUR COMPANY", measured.x + 14, measured.y - 8);
          ctx.restore();
        }

        // Redraw the true outer silhouette last.
        ctx.save();
        ctx.globalAlpha = sphereIn;
        ctx.strokeStyle = "rgba(229,236,246,.22)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Stable fine grain. It does not carry semantic state.
      ctx.save();
      ctx.globalAlpha = 0.025;
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 90; i += 1) {
        const x = ((i * 97 + Math.floor(p * 1000)) % 997) / 997 * W;
        const y = ((i * 193 + 23) % 991) / 991 * H;
        ctx.fillRect(x, y, 0.65, 0.65);
      }
      ctx.restore();
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [capabilities, selectedTarget, targetStates]);

  const phase =
    progress < 0.035
      ? "void"
      : progress < 0.24
      ? "basis"
      : progress < 0.40
      ? "evidence"
      : progress < 0.59
      ? "knowledge-experience"
      : progress < 0.78
      ? "centering"
      : progress < 0.88
      ? "state"
      : progress < 0.94
      ? "future"
      : "measurement";

  const updatePointerX = (clientX: number) => {
    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    targetPointerRef.current.x =
      ((clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
  };

  return (
    <section
      ref={rootRef}
      className="cinematic-hero"
      aria-label="Interactive technical profile narrative"
      onPointerMove={(event) => updatePointerX(event.clientX)}
      onPointerLeave={() => {
        targetPointerRef.current.x = 0;
      }}
    >
      <div className="cinematic-hero-sticky">
        <canvas
          ref={canvasRef}
          className="cinematic-hero-canvas"
          aria-hidden="true"
        />

        <div className={`cinematic-copy cinematic-copy-${phase}`}>
          {phase === "basis" && (
            <div className="cinematic-card equation-card">
              <div className="cinematic-kicker">01 / BASIS</div>
              <p>Hardware ↔ Software · Classical ↔ Quantum</p>
            </div>
          )}

          {phase === "evidence" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">02 / LIVE EVIDENCE PLANE</div>
              <h2>Evidence finds a position.</h2>
              <p>
                The same public-safe state can regenerate this map whenever
                the underlying Career OS evidence changes.
              </p>
            </div>
          )}

          {phase === "knowledge-experience" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">03 / DEPTH</div>
              <h2>Knowledge rises. Experience extends below.</h2>
              <p>
                K and E are independent evidence components. They add depth
                without replacing the original Hardware/Software and
                Classical/Quantum coordinates.
              </p>
            </div>
          )}

          {phase === "centering" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">04 / ONE ORIGIN</div>
              <h2>The state centers in place.</h2>
              <p>
                Rod lengths stay normalized and unchanged. Their angles come
                from the same deterministic transform; only their origins
                converge to the center of this 3D space.
              </p>
            </div>
          )}

          {phase === "state" && (
            <div className="cinematic-card equation-card">
              <div className="cinematic-kicker">
                CURRENT TECHNICAL STATE
              </div>
              <div className="cinematic-equation">
                |ψ<sub>profile</sub>⟩ = Σ α<sub>i</sub>|c<sub>i</sub>⟩
              </div>
              <p>
                α<sub>i</sub> = S<sub>i</sub> / √ΣS<sub>j</sub>² ·
                the sphere is a quantum-inspired representation of the same
                live evidence state.
              </p>
            </div>
          )}

          {phase === "future" && (
            <div className="cinematic-card equation-card future-card">
              <div className="cinematic-kicker">POSSIBLE FUTURE STATES</div>
              <div className="cinematic-equation">
                |ψ<sub>future</sub>⟩ = Σ β<sub>j</sub>|t<sub>j</sub>⟩
              </div>
              <p>
                P(t<sub>j</sub>) = |β<sub>j</sub>|² · yellow points are
                evidence-supported directions on the same state space.
              </p>
            </div>
          )}

          {phase === "measurement" && (
            <div className="cinematic-card equation-card measurement-card">
              <div className="cinematic-kicker">MEASUREMENT</div>
              <div className="cinematic-equation">
                |ψ<sub>future</sub>⟩ → |Your Company⟩
              </div>
              <p>
                The other possible yellow states collapse away. This build's
                deterministic sample resolves through {selectedTarget.name}.
              </p>
              <div className="cinematic-cta">Seeking an internship.</div>
            </div>
          )}
        </div>

        <div className="cinematic-progress" aria-hidden="true">
          <span
            style={{
              transform: `scaleX(${Math.max(0.002, progress)})`,
            }}
          />
        </div>

        <div className="cinematic-scroll-cue" aria-hidden="true">
          <span>SCROLL DOWN TO RESOLVE · SCROLL UP TO REWIND</span>
        </div>
      </div>
    </section>
  );
}

export default CinematicHero;
