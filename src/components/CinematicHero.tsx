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
  const lastPointerYRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const capabilities = useMemo(
    () =>
      expertiseCapabilities.map((item) => {
        const x = item.x / 100;
        const y = item.y / 100;
        const k = item.K;
        const e = item.E;

        // Vertical balance is derived from the two normalized evidence
        // components. It is not a new visual-only score.
        const zBalance = 0.72 * ((k - e) / Math.max(0.001, k + e));

        // Preserve the original normalized rod length. Only direction changes
        // during the in-place centering stage.
        const length = Math.max(0, Math.min(0.94, item.score * 0.2));

        // Direction is expressed explicitly through spherical angles so the
        // same Career OS record always maps to the same final orientation.
        const azimuth = Math.atan2(y, x);
        const elevation = Math.atan2(zBalance, Math.hypot(x, y));
        const cosElevation = Math.cos(elevation);

        return {
          ...item,
          px: x,
          py: y,
          k,
          e,
          zBalance,
          length,
          azimuth,
          elevation,
          dir: {
            x: cosElevation * Math.cos(azimuth),
            y: cosElevation * Math.sin(azimuth),
            z: Math.sin(elevation),
          },
        };
      }),
    []
  );

  const selectedTarget = useMemo(
    () => [...expertiseTargets].sort((a, b) => b.support - a.support)[0],
    []
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const delta = event.key === "ArrowDown" ? 0.06 : -0.06;
      const next = clamp01(progressRef.current + delta);
      progressRef.current = next;
      setProgress(next);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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

      const stage2d = smooth(0.05, 0.16, p);
      const planeIn = smooth(0.17, 0.29, p);
      const pointsIn = smooth(0.25, 0.40, p);
      const zIn = smooth(0.38, 0.47, p);
      const knowledgeGrow = smooth(0.43, 0.51, p);
      const experienceGrow = smooth(0.50, 0.58, p);
      const vectorResolve = smooth(0.57, 0.66, p);
      const recenter = smooth(0.64, 0.76, p);
      const sphereIn = smooth(0.75, 0.84, p);
      const targetsIn = smooth(0.83, 0.90, p);
      const collapse = smooth(0.93, 0.995, p);
      const planeFade = 1 - smooth(0.61, 0.74, p);

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
        const yAxis = smooth(0.10, 0.21, p);
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
        const base = toScreen(projectPlane(item.px, item.py, 0));

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
            projectPlane(item.px, item.py, item.k * 0.9 * knowledgeGrow)
          );
          const eBottom = toScreen(
            projectPlane(item.px, item.py, -item.e * 0.9 * experienceGrow)
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

      // Shared 3D camera for the resolved rods and the final sphere. This is
      // what makes the transition in-place rather than moving the state to a
      // second location.
      const yaw = -0.34 + mouseYaw * 0.55;
      const pitch = -0.46;
      const roll = 0.18;

      const rotateState = (v: Point3) => {
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        const x1 = cy * v.x + sy * v.z;
        const z1 = -sy * v.x + cy * v.z;

        const cp = Math.cos(pitch);
        const sp = Math.sin(pitch);
        const y2 = cp * v.y - sp * z1;
        const z2 = sp * v.y + cp * z1;

        const cr = Math.cos(roll);
        const sr = Math.sin(roll);

        return {
          x: cr * x1 - sr * y2,
          y: sr * x1 + cr * y2,
          z: z2,
        };
      };

      const projectState = (v: Point3) => {
        const r = rotateState(v);
        const camera = 3.7;
        const persp = camera / (camera - r.z * 0.62);

        return {
          x: centerX + r.x * sphereR * persp,
          y: centerY - r.y * sphereR * persp,
          z: r.z,
          persp,
        };
      };

      // 06 — Resolve each evidence column into its final rod. The canonical
      // normalized length stays constant. Re-centering translates the whole
      // rod to the same 3D origin; it does not stretch or shrink the rod.
      if (vectorResolve > 0.001) {
        for (const item of capabilities) {
          const baseOffset: Point3 = {
            x: item.px * 0.68 * (1 - recenter),
            y: item.py * 0.68 * (1 - recenter),
            z: 0,
          };

          const tip: Point3 = {
            x: baseOffset.x + item.dir.x * item.length,
            y: baseOffset.y + item.dir.y * item.length,
            z: baseOffset.z + item.dir.z * item.length,
          };

          const start = projectState(baseOffset);
          const end = projectState(tip);
          const color = item.k >= item.e ? KNOWLEDGE : EXPERIENCE;
          const alpha = vectorResolve * (0.24 + recenter * 0.58);

          drawLine(
            start,
            end,
            rgba(color, alpha),
            1.5 + item.length * 2.2
          );

          ctx.save();
          ctx.globalAlpha = vectorResolve * (0.42 + recenter * 0.48);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(end.x, end.y, 2 + item.length * 1.8, 0, Math.PI * 2);
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
        const easedR = sphereR * sphereIn;

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

        // 08 — Target states are generated on the shell.
        const targetRows = expertiseTargets.map((target) => {
          const n = Math.hypot(target.pos.x, target.pos.y, target.pos.z) || 1;
          const point = projectState({
            x: target.pos.x / n,
            y: target.pos.y / n,
            z: target.pos.z / n,
          });

          return { target, point };
        });

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
  }, [capabilities, selectedTarget]);

  const phase =
    progress < 0.10
      ? "identity"
      : progress < 0.24
      ? "basis"
      : progress < 0.40
      ? "evidence"
      : progress < 0.59
      ? "knowledge-experience"
      : progress < 0.77
      ? "centering"
      : progress < 0.91
      ? "state"
      : "measurement";

  const advanceNarrative = (
    clientY: number,
    clientX: number,
    pointerType: string
  ) => {
    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    targetPointerRef.current.x =
      ((clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;

    if (lastPointerYRef.current === null) {
      lastPointerYRef.current = clientY;
      return;
    }

    const dy = clientY - lastPointerYRef.current;
    lastPointerYRef.current = clientY;

    // One deliberate downward sweep through roughly half the viewport resolves
    // the full story. Moving upward rewinds the same deterministic sequence.
    const travel = Math.max(
      260,
      window.innerHeight * (pointerType === "touch" ? 0.72 : 0.48)
    );

    const next = clamp01(progressRef.current + dy / travel);
    progressRef.current = next;
    setProgress(next);
  };

  return (
    <section
      ref={rootRef}
      className="cinematic-hero"
      aria-label="Interactive technical profile narrative"
      onPointerMove={(event) =>
        advanceNarrative(
          event.clientY,
          event.clientX,
          event.pointerType || "mouse"
        )
      }
      onPointerLeave={() => {
        lastPointerYRef.current = null;
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
          {phase === "identity" && (
            <div className="cinematic-card centered">
              <div className="cinematic-kicker">SOROUSH HAGHI</div>
              <h1>
                Computer Engineering <span>→</span> Quantum Technologies
              </h1>
              <p>
                Move the cursor downward to resolve the state. Move upward to
                rewind it.
              </p>
            </div>
          )}

          {phase === "basis" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">01 / BASIS</div>
              <h2>First, place the work.</h2>
              <p>Hardware ↔ Software. Classical ↔ Quantum.</p>
            </div>
          )}

          {phase === "evidence" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">02 / EVIDENCE</div>
              <h2>
                The plane fills with what I have actually studied and built.
              </h2>
              <p>
                Each point is generated from the current public-safe Career OS
                state.
              </p>
            </div>
          )}

          {phase === "knowledge-experience" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">03 / DEPTH</div>
              <h2>Knowledge rises. Experience extends below.</h2>
              <p>
                The same evidence acquires a third dimension without changing
                its source.
              </p>
            </div>
          )}

          {phase === "centering" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">04 / RESOLVE</div>
              <h2>Same lengths. Same evidence. One origin.</h2>
              <p>
                Each rod keeps its normalized length while its angle is derived
                from the same coordinates and the whole state centers in place.
              </p>
            </div>
          )}

          {phase === "state" && (
            <div className="cinematic-card equation-card">
              <div className="cinematic-kicker">
                CURRENT TECHNICAL STATE
              </div>
              <div className="cinematic-equation">
                |ψ<sub>current</sub>⟩ = Σ α<sub>i</sub>|c<sub>i</sub>⟩
              </div>
              <p>
                Blue: knowledge-dominant. Red: experience-dominant. Yellow:
                possible career directions.
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
                Other possible target states fade as one measured state remains.
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
          <span>MOVE CURSOR DOWN · UP TO REWIND</span>
        </div>
      </div>
    </section>
  );
}

export default CinematicHero;
