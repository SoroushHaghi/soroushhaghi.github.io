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
  const pointerRef = useRef({ x: 0, y: 0 });
  const targetPointerRef = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const capabilities = useMemo(
    () =>
      expertiseCapabilities.map((item) => {
        const x = item.x / 100;
        const y = item.y / 100;
        const k = item.K;
        const e = item.E;
        const zBalance = 0.72 * ((k - e) / Math.max(0.001, k + e));
        const dLen = Math.hypot(x, y, zBalance) || 1;
        const strength = Math.max(0, Math.min(0.94, item.score * 0.2));
        return {
          ...item,
          px: x,
          py: y,
          k,
          e,
          zBalance,
          strength,
          dir: { x: x / dLen, y: y / dLen, z: zBalance / dLen },
        };
      }),
    []
  );

  const selectedTarget = useMemo(
    () => [...expertiseTargets].sort((a, b) => b.support - a.support)[0],
    []
  );

  useEffect(() => {
    const onScroll = () => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const scrollable = Math.max(1, root.offsetHeight - window.innerHeight);
      const next = clamp01(-rect.top / scrollable);
      progressRef.current = next;
      setProgress(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
      pointerRef.current.y += (targetPointerRef.current.y - pointerRef.current.y) * 0.055;

      const centerX = W * 0.5;
      const centerY = H * 0.5;
      const planeScale = Math.min(W * 0.34, H * 0.34);
      const sphereR = Math.min(W, H) * (W < 760 ? 0.31 : 0.285);
      const mouseYaw = pointerRef.current.x * 0.14;
      const mousePitch = pointerRef.current.y * 0.10;

      const stage2d = smooth(0.06, 0.18, p);
      const planeIn = smooth(0.15, 0.28, p);
      const pointsIn = smooth(0.24, 0.39, p);
      const zIn = smooth(0.38, 0.47, p);
      const knowledgeGrow = smooth(0.43, 0.51, p);
      const experienceGrow = smooth(0.50, 0.58, p);
      const sphereIn = smooth(0.56, 0.69, p);
      const recenter = smooth(0.62, 0.76, p);
      const targetsIn = smooth(0.75, 0.84, p);
      const futureIn = smooth(0.82, 0.90, p);
      const collapse = smooth(0.91, 0.985, p);

      const planeFade = 1 - smooth(0.60, 0.73, p);

      ctx.save();
      ctx.fillStyle = "#020406";
      ctx.fillRect(0, 0, W, H);
      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H) * 0.72);
      glow.addColorStop(0, "rgba(40,55,76,.15)");
      glow.addColorStop(0.48, "rgba(14,20,29,.065)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      const projectPlane = (x: number, y: number, z = 0): Point3 => {
        const tiltX = mix(0, -0.50 + mousePitch, planeIn);
        const tiltZ = mix(0, -0.12 + mouseYaw, planeIn);
        const cz = Math.cos(tiltZ), sz = Math.sin(tiltZ);
        const x1 = cz * x - sz * y;
        const y1 = sz * x + cz * y;
        const cx = Math.cos(tiltX), sx = Math.sin(tiltX);
        return { x: x1, y: cx * y1 - sx * z, z: sx * y1 + cx * z };
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

      const drawLine = (a: { x: number; y: number }, b: { x: number; y: number }, color: string, width = 1) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      };

      // Scene 1 + 2: basis appears from black.
      if (stage2d > 0.001) {
        const axisLen = planeScale * 1.20 * stage2d;
        drawLine(
          { x: centerX - axisLen, y: centerY },
          { x: centerX + axisLen, y: centerY },
          `rgba(232,238,247,${0.34 * planeFade})`,
          1
        );

        ctx.save();
        ctx.globalAlpha = stage2d * planeFade;
        ctx.fillStyle = "rgba(238,242,248,.78)";
        ctx.font = "600 12px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HARDWARE", centerX - axisLen - 42, centerY + 4);
        ctx.fillText("SOFTWARE", centerX + axisLen + 42, centerY + 4);
        ctx.restore();

        const yAxis = smooth(0.10, 0.21, p);
        if (yAxis > 0) {
          drawLine(
            { x: centerX, y: centerY - axisLen * yAxis },
            { x: centerX, y: centerY + axisLen * yAxis },
            `rgba(232,238,247,${0.30 * planeFade})`,
            1
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

      // Scene 3: plane + evidence points.
      if (planeIn > 0.001 && planeFade > 0.001) {
        ctx.save();
        ctx.globalAlpha = planeIn * planeFade * 0.34;
        ctx.strokeStyle = "rgba(176,191,210,.18)";
        ctx.lineWidth = 1;
        const gridN = 6;
        for (let i = -gridN; i <= gridN; i += 1) {
          const v = i / gridN;
          const a = toScreen(projectPlane(-1.1, v));
          const b = toScreen(projectPlane(1.1, v));
          drawLine(a, b, "rgba(176,191,210,.11)");
          const c = toScreen(projectPlane(v, -1.1));
          const d = toScreen(projectPlane(v, 1.1));
          drawLine(c, d, "rgba(176,191,210,.11)");
        }
        ctx.restore();
      }

      // Scene 4 + 5: points become vertical knowledge/experience evidence bars.
      for (let i = 0; i < capabilities.length; i += 1) {
        const item = capabilities[i];
        const stagger = clamp01((pointsIn * capabilities.length - i) / 4);
        const base3 = projectPlane(item.px, item.py, 0);
        const base = toScreen(base3);

        if (stagger > 0 && planeFade > 0) {
          ctx.save();
          ctx.globalAlpha = stagger * planeFade * 0.82;
          ctx.fillStyle = "rgba(219,228,240,.74)";
          ctx.beginPath();
          ctx.arc(base.x, base.y, 2.1 + 1.7 * stagger, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (zIn > 0 && recenter < 0.99) {
          const kTop = toScreen(projectPlane(item.px, item.py, item.k * 0.9 * knowledgeGrow));
          const eBottom = toScreen(projectPlane(item.px, item.py, -item.e * 0.9 * experienceGrow));
          drawLine(base, kTop, rgba(KNOWLEDGE, (1 - recenter) * 0.72), 1.4);
          drawLine(base, eBottom, rgba(EXPERIENCE, (1 - recenter) * 0.72), 1.4);
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

      // Scene 6: BEGIN + shell. The prior plane dissolves while the same data
      // deterministically reprojects into radial capability rays.
      if (sphereIn > 0.001) {
        const easedR = sphereR * sphereIn;
        ctx.save();
        ctx.strokeStyle = `rgba(224,232,242,${0.18 * sphereIn})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, easedR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        const inner = ctx.createRadialGradient(centerX - easedR * 0.18, centerY - easedR * 0.2, 0, centerX, centerY, easedR);
        inner.addColorStop(0, `rgba(190,210,236,${0.035 * sphereIn})`);
        inner.addColorStop(0.72, `rgba(120,146,180,${0.014 * sphereIn})`);
        inner.addColorStop(1, "rgba(10,14,20,0)");
        ctx.save();
        ctx.fillStyle = inner;
        ctx.beginPath();
        ctx.arc(centerX, centerY, easedR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = (1 - smooth(0.66, 0.76, p)) * sphereIn;
        ctx.fillStyle = "rgba(236,241,248,.68)";
        ctx.font = "600 10px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BEGIN", centerX, centerY - 12);
        ctx.restore();

        const yaw = -0.34 + mouseYaw * 0.55;
        const pitch = -0.46 + mousePitch * 0.45;
        const roll = 0.18;

        const rotateSphere = (v: Point3) => {
          const cy = Math.cos(yaw), sy = Math.sin(yaw);
          const x1 = cy * v.x + sy * v.z;
          const z1 = -sy * v.x + cy * v.z;
          const cp = Math.cos(pitch), sp = Math.sin(pitch);
          const y2 = cp * v.y - sp * z1;
          const z2 = sp * v.y + cp * z1;
          const cr = Math.cos(roll), sr = Math.sin(roll);
          return {
            x: cr * x1 - sr * y2,
            y: sr * x1 + cr * y2,
            z: z2,
          };
        };

        const projectSphere = (v: Point3) => {
          const r = rotateSphere(v);
          const camera = 3.7;
          const persp = camera / (camera - r.z * 0.62);
          return {
            x: centerX + r.x * sphereR * persp,
            y: centerY - r.y * sphereR * persp,
            z: r.z,
            persp,
          };
        };

        for (const item of capabilities) {
          const basePlane = toScreen(projectPlane(item.px, item.py, 0));
          const radial = {
            x: item.dir.x * item.strength,
            y: item.dir.y * item.strength,
            z: item.dir.z * item.strength,
          };
          const radialScreen = projectSphere(radial);
          const end = {
            x: mix(basePlane.x, radialScreen.x, recenter),
            y: mix(basePlane.y, radialScreen.y, recenter),
          };
          const start = {
            x: mix(basePlane.x, centerX, recenter),
            y: mix(basePlane.y, centerY, recenter),
          };
          const color = item.k >= item.e ? KNOWLEDGE : EXPERIENCE;
          drawLine(start, end, rgba(color, 0.18 + recenter * 0.64), 1.5 + item.strength * 2.2);
          ctx.save();
          ctx.fillStyle = rgba(color, 0.38 + recenter * 0.52);
          ctx.beginPath();
          ctx.arc(end.x, end.y, 2 + item.strength * 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Target states live on the shell.
        const targetRows = expertiseTargets.map((target) => {
          const n = Math.hypot(target.pos.x, target.pos.y, target.pos.z) || 1;
          const point = projectSphere({
            x: target.pos.x / n,
            y: target.pos.y / n,
            z: target.pos.z / n,
          });
          return { target, point };
        });

        for (const row of targetRows) {
          const isChosen = row.target.id === selectedTarget.id;
          const targetAlpha = targetsIn * (collapse > 0 ? (isChosen ? 1 : 1 - collapse) : 1);
          if (targetAlpha <= 0.01) continue;
          ctx.save();
          ctx.globalAlpha = targetAlpha * (row.point.z < -0.15 ? 0.34 : 0.96);
          ctx.fillStyle = TARGET;
          ctx.strokeStyle = "rgba(255,231,130,.88)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(row.point.x, row.point.y, 4.2 + (isChosen ? collapse * 2.8 : 0), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          if (targetsIn > 0.5 && row.point.z > -0.1 && (collapse < 0.1 || isChosen)) {
            ctx.save();
            ctx.globalAlpha = targetAlpha * 0.84;
            ctx.fillStyle = "rgba(233,219,153,.92)";
            ctx.font = "600 9px Inter, system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(row.target.name, row.point.x + 10, row.point.y - 7);
            ctx.restore();
          }
        }
      }

      // Fine film grain, still mathematically deterministic.
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
    progress < 0.12 ? "identity" :
    progress < 0.24 ? "basis" :
    progress < 0.40 ? "evidence" :
    progress < 0.59 ? "knowledge-experience" :
    progress < 0.76 ? "sphere" :
    progress < 0.91 ? "state" :
    "measurement";

  return (
    <section
      ref={rootRef}
      className="cinematic-hero"
      aria-label="Interactive technical profile narrative"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        targetPointerRef.current = {
          x: ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2,
          y: ((event.clientY - rect.top) / Math.max(1, window.innerHeight) - 0.5) * 2,
        };
      }}
      onPointerLeave={() => {
        targetPointerRef.current = { x: 0, y: 0 };
      }}
    >
      <div className="cinematic-hero-sticky">
        <canvas ref={canvasRef} className="cinematic-hero-canvas" aria-hidden="true" />

        <div className={`cinematic-copy cinematic-copy-${phase}`}>
          {phase === "identity" && (
            <div className="cinematic-card centered">
              <div className="cinematic-kicker">SOROUSH HAGHI</div>
              <h1>Computer Engineering <span>→</span> Quantum Technologies</h1>
              <p>A technical profile assembled from evidence, not a static list of skills.</p>
            </div>
          )}

          {phase === "basis" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">01 / BASIS</div>
              <h2>Where does the work live?</h2>
              <p>Hardware ↔ Software. Classical ↔ Quantum.</p>
            </div>
          )}

          {phase === "evidence" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">02 / EVIDENCE</div>
              <h2>The plane is populated by what I have actually studied and built.</h2>
              <p>Each point is generated from the current public-safe Career OS state.</p>
            </div>
          )}

          {phase === "knowledge-experience" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">03 / DEPTH</div>
              <h2>Knowledge grows upward. Experience grows downward.</h2>
              <p>The same evidence now acquires a third dimension.</p>
            </div>
          )}

          {phase === "sphere" && (
            <div className="cinematic-card side">
              <div className="cinematic-kicker">04 / BEGIN</div>
              <h2>The coordinate space dissolves. The state remains.</h2>
              <p>Every capability is re-projected by the same deterministic transform.</p>
            </div>
          )}

          {phase === "state" && (
            <div className="cinematic-card equation-card">
              <div className="cinematic-kicker">CURRENT TECHNICAL STATE</div>
              <div className="cinematic-equation">|ψ<sub>current</sub>⟩ = Σ α<sub>i</sub>|c<sub>i</sub>⟩</div>
              <p>Blue: knowledge-dominant. Red: experience-dominant. Yellow: possible career directions.</p>
            </div>
          )}

          {phase === "measurement" && (
            <div className="cinematic-card equation-card measurement-card">
              <div className="cinematic-kicker">MEASUREMENT</div>
              <div className="cinematic-equation">|ψ<sub>future</sub>⟩ → |Your Company⟩</div>
              <p>One possible future state, grounded in the state you just saw.</p>
              <div className="cinematic-cta">Seeking an internship.</div>
            </div>
          )}
        </div>

        <div className="cinematic-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(0.002, progress)})` }} />
        </div>
        <div className="cinematic-scroll-cue" aria-hidden="true">
          <span>SCROLL TO RESOLVE THE STATE</span>
        </div>
      </div>
    </section>
  );
}

export default CinematicHero;
