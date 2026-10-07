import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ExpertiseCapability,
  ExpertiseTarget,
  expertiseCapabilities,
  expertiseTargets,
} from "../expertise/expertiseData";
import "./expertiseSphere.scss";

type Point3 = { x: number; y: number; z: number };
type ProjectedPoint = { x: number; y: number; depth: number; persp: number };
type Selected =
  | { type: "capability"; item: ExpertiseCapability }
  | { type: "target"; item: ExpertiseTarget };

type Props = {
  capabilityIds?: readonly string[];
  compact?: boolean;
  ariaLabel?: string;
};

const SPHERE_R = 115;
const CAMERA_DISTANCE = 430;
const VIEW_PITCH = (-68 * Math.PI) / 180;
const VIEW_ROLL = (20 * Math.PI) / 180;
const KNOWLEDGE = "#4b86d8";
const EXPERIENCE = "#cf5a5a";
const TARGET = "#e4c449";

function ExpertiseSphere({
  capabilityIds,
  compact = false,
  ariaLabel = "Interactive expertise sphere",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitItemsRef = useRef<Array<{ selected: Selected; x: number; y: number; r: number }>>([]);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastXRef = useRef(0);

  const [spin, setSpin] = useState(-0.35);
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(false);
  const [showTargetLabels, setShowTargetLabels] = useState(!compact);
  const capabilities = useMemo(() => {
    if (!capabilityIds?.length) return expertiseCapabilities;
    const wanted = new Set(capabilityIds);
    return expertiseCapabilities.filter((item) => wanted.has(item.id));
  }, [capabilityIds]);
  const [selected, setSelected] = useState<Selected>(() => ({
    type: "capability",
    item:
      capabilities.find((item) => item.id === "career") ||
      capabilities[0] ||
      expertiseCapabilities[0],
  }));
  const [sizeTick, setSizeTick] = useState(0);

  useEffect(() => {
    if (!compact) return;
    if (
      selected.type === "capability" &&
      capabilities.some((item) => item.id === selected.item.id)
    ) {
      return;
    }
    if (capabilities[0]) {
      setSelected({ type: "capability", item: capabilities[0] });
    }
  }, [capabilities, compact, selected]);

  const preparedCapabilities = useMemo(
    () =>
      capabilities.map((row) => {
        const score100 = Math.max(0, Math.min(100, Number(row.score || 0) * 20));
        const zBias = row.mode === "Knowledge" ? 70 : -70;
        const n = Math.hypot(row.x, row.y, zBias) || 1;
        return {
          ...row,
          score100,
          dir: { x: row.x / n, y: row.y / n, z: zBias / n },
        };
      }),
    [capabilities]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver(() => setSizeTick((value) => value + 1));
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
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
    hitItemsRef.current = [];

    const scale = (Math.min(W, H) / 330) * zoom;

    const rotatePoint = (p: Point3): Point3 => {
      const cs = Math.cos(spin);
      const ss = Math.sin(spin);
      const x1 = cs * p.x - ss * p.y;
      const y1 = ss * p.x + cs * p.y;
      const z1 = p.z;

      const cp = Math.cos(VIEW_PITCH);
      const sp = Math.sin(VIEW_PITCH);
      const x2 = x1;
      const y2 = cp * y1 - sp * z1;
      const z2 = sp * y1 + cp * z1;

      const cr = Math.cos(VIEW_ROLL);
      const sr = Math.sin(VIEW_ROLL);
      return {
        x: cr * x2 - sr * y2,
        y: sr * x2 + cr * y2,
        z: z2,
      };
    };

    const project = (p: Point3): ProjectedPoint => {
      const rotated = rotatePoint(p);
      const persp = CAMERA_DISTANCE / (CAMERA_DISTANCE - rotated.z);
      return {
        x: W * 0.5 + rotated.x * scale * persp,
        y: H * 0.5 - rotated.y * scale * persp,
        depth: rotated.z,
        persp,
      };
    };

    // Perspective visibility for a point on the sphere surface.
    //
    // With the camera at (0, 0, CAMERA_DISTANCE), a surface point is visible
    // only when its outward normal faces the camera:
    //
    //   p · (camera - p) >= 0
    //   CAMERA_DISTANCE * z - |p|^2 >= 0
    //
    // Using z >= 0 (the old rule) is only valid for orthographic projection.
    // Under perspective it keeps a ring segment "front-facing" too long after
    // it has already crossed the true silhouette.
    const surfaceVisibilityMetric = (rotated: Point3) =>
      CAMERA_DISTANCE * rotated.z -
      (rotated.x * rotated.x + rotated.y * rotated.y + rotated.z * rotated.z);

    const isSurfaceFront = (p: Point3) => surfaceVisibilityMetric(rotatePoint(p)) >= 0;

    /*
      Perspective-correct apparent radius of a sphere whose center lies on the
      camera axis. The old prototype used an arbitrary 0.34 * viewport value,
      which made the bright shell rim sit inside the true projected silhouette.
    */
    const shellRadius =
      scale *
      SPHERE_R *
      (CAMERA_DISTANCE / Math.sqrt(CAMERA_DISTANCE * CAMERA_DISTANCE - SPHERE_R * SPHERE_R));

    const center = project({ x: 0, y: 0, z: 0 });

    const rayEndpoint = (rec: (typeof preparedCapabilities)[number]): Point3 => {
      const length = (rec.score100 / 100) * SPHERE_R;
      return {
        x: rec.dir.x * length,
        y: rec.dir.y * length,
        z: rec.dir.z * length,
      };
    };

    const drawGlassBase = () => {
      ctx.save();
      const shadow = ctx.createRadialGradient(
        center.x - shellRadius * 0.18,
        center.y - shellRadius * 0.22,
        shellRadius * 0.08,
        center.x,
        center.y,
        shellRadius
      );
      shadow.addColorStop(0, "rgba(218,226,238,.040)");
      shadow.addColorStop(0.72, "rgba(179,193,211,.018)");
      shadow.addColorStop(1, "rgba(120,142,172,.006)");
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(center.x, center.y, shellRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const clipToShell = () => {
      ctx.beginPath();
      ctx.arc(center.x, center.y, shellRadius, 0, Math.PI * 2);
      ctx.clip();
    };

    const drawCircle3D = (plane: "xy" | "xz" | "yz", backAlpha: number, frontAlpha: number) => {
      type CirclePoint = ProjectedPoint & { metric: number; back: boolean };
      const points: CirclePoint[] = [];
      const segments = 720;

      for (let i = 0; i <= segments; i += 1) {
        const a = (i / segments) * Math.PI * 2;
        let p: Point3;
        if (plane === "xy") p = { x: SPHERE_R * Math.cos(a), y: SPHERE_R * Math.sin(a), z: 0 };
        else if (plane === "xz") p = { x: SPHERE_R * Math.cos(a), y: 0, z: SPHERE_R * Math.sin(a) };
        else p = { x: 0, y: SPHERE_R * Math.cos(a), z: SPHERE_R * Math.sin(a) };

        const rotated = rotatePoint(p);
        const metric = surfaceVisibilityMetric(rotated);
        points.push({ ...project(p), metric, back: metric < 0 });
      }

      const boundaryPoint = (a: CirclePoint, b: CirclePoint): ProjectedPoint => {
        const denom = a.metric - b.metric;
        const t = Math.abs(denom) < 1e-9 ? 0.5 : a.metric / denom;
        const clamped = Math.max(0, Math.min(1, t));
        return {
          x: a.x + (b.x - a.x) * clamped,
          y: a.y + (b.y - a.y) * clamped,
          depth: a.depth + (b.depth - a.depth) * clamped,
          persp: a.persp + (b.persp - a.persp) * clamped,
        };
      };

      ([true, false] as const).forEach((isBack) => {
        ctx.save();
        ctx.strokeStyle = `rgba(220,230,242,${isBack ? backAlpha : frontAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();

        let open = false;
        for (let i = 0; i < points.length; i += 1) {
          const point = points[i];
          const prev = i > 0 ? points[i - 1] : null;

          if (prev && prev.back !== point.back) {
            const edge = boundaryPoint(prev, point);
            if (prev.back === isBack && open) ctx.lineTo(edge.x, edge.y);
            open = false;
            if (point.back === isBack) {
              ctx.moveTo(edge.x, edge.y);
              open = true;
            }
          }

          if (point.back === isBack) {
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

    const drawAxisAndAnchors = () => {
      const top = project({ x: 0, y: 0, z: SPHERE_R });
      const bottom = project({ x: 0, y: 0, z: -SPHERE_R });

      ctx.save();
      ctx.strokeStyle = "rgba(232,238,246,.075)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "rgba(232,238,246,.82)";
      ctx.font = "700 11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("KNOWLEDGE", top.x, top.y - 10);
      ctx.fillText("EXPERIENCE", bottom.x, bottom.y + 18);
      ctx.restore();

      const anchors: Array<[Point3, string]> = [
        [{ x: -SPHERE_R, y: 0, z: 0 }, "HARDWARE"],
        [{ x: SPHERE_R, y: 0, z: 0 }, "SOFTWARE"],
        [{ x: 0, y: -SPHERE_R, z: 0 }, "CLASSICAL"],
        [{ x: 0, y: SPHERE_R, z: 0 }, "QUANTUM"],
      ];

      ctx.save();
      ctx.fillStyle = "rgba(226,234,244,.68)";
      ctx.font = "600 9px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      for (const [point, label] of anchors) {
        const projected = project(point);
        ctx.fillText(label, projected.x, projected.y - 7);
      }
      ctx.restore();
    };

    const drawCapabilities = () => {
      const origin = project({ x: 0, y: 0, z: 0 });
      const rows = preparedCapabilities
        .map((rec) => ({ rec, p: project(rayEndpoint(rec)) }))
        .sort((a, b) => a.p.depth - b.p.depth);

      for (const { rec, p } of rows) {
        const color = rec.mode === "Knowledge" ? KNOWLEDGE : EXPERIENCE;
        const lineWidth = 1.8 + (rec.score100 / 100) * 1.45;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.78;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + rec.score100 * 0.009, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (showLabels || (selected.type === "capability" && selected.item.id === rec.id)) {
          const dx = p.x - origin.x;
          const dy = p.y - origin.y;
          const length = Math.hypot(dx, dy) || 1;
          ctx.save();
          ctx.font = "600 9px Inter, system-ui, sans-serif";
          ctx.fillStyle =
            selected.type === "capability" && selected.item.id === rec.id
              ? "#ffffff"
              : "rgba(205,214,225,.62)";
          ctx.textAlign = "center";
          ctx.fillText(rec.name, p.x + (dx / length) * 10, p.y + (dy / length) * 10);
          ctx.restore();
        }

        hitItemsRef.current.push({
          selected: { type: "capability", item: rec },
          x: p.x,
          y: p.y,
          r: 9,
        });
      }
    };

    const targetLabels: Array<{ item: ExpertiseTarget; p: ProjectedPoint; back: boolean }> = [];

    const drawTargets = () => {
      if (compact) return;
      const rows = expertiseTargets
        .map((item) => {
          return { item, p: project(item.pos), back: !isSurfaceFront(item.pos) };
        })
        .sort((a, b) => a.p.depth - b.p.depth);

      for (const row of rows) {
        const { item, p, back } = row;
        ctx.save();
        ctx.globalAlpha = back ? 0.3 : 0.94;
        ctx.fillStyle = TARGET;
        ctx.strokeStyle = back ? "rgba(228,196,73,.26)" : "rgba(246,220,108,.92)";
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.globalAlpha = back ? 0.12 : 0.2 + (item.support / 100) * 0.18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        targetLabels.push(row);
        hitItemsRef.current.push({
          selected: { type: "target", item },
          x: p.x,
          y: p.y,
          r: 11,
        });
      }
    };

    const drawSelected = () => {
      if (compact) return;
      if (selected.type === "capability") {
        const rec = preparedCapabilities.find((item) => item.id === selected.item.id);
        if (!rec) return;
        const origin = project({ x: 0, y: 0, z: 0 });
        const p = project(rayEndpoint(rec));
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,.62)";
        ctx.lineWidth = 1.05;
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
      } else {
        const p = project(selected.item.pos);
        ctx.save();
        ctx.strokeStyle = "rgba(255,246,191,.96)";
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawOuterRim = () => {
      ctx.save();
      ctx.strokeStyle = "rgba(225,233,244,.20)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(center.x, center.y, shellRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,.042)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(center.x, center.y, shellRadius - 2.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    drawGlassBase();

    ctx.save();
    clipToShell();
    drawCircle3D("xy", 0.016, 0.062);
    drawCircle3D("xz", 0.01, 0.04);
    drawCircle3D("yz", 0.01, 0.036);
    drawAxisAndAnchors();
    drawCapabilities();
    drawTargets();
    drawSelected();
    ctx.restore();

    if (!compact && showTargetLabels) {
      for (const { item, p, back } of targetLabels) {
        if (back) continue;
        ctx.save();
        ctx.font = "650 8.8px Inter, system-ui, sans-serif";
        ctx.fillStyle = "rgba(235,220,150,.82)";
        ctx.textAlign = "left";
        ctx.fillText(item.name, p.x + 8, p.y - 7);
        ctx.restore();
      }
    }

    drawOuterRim();
  }, [compact, preparedCapabilities, selected, showLabels, showTargetLabels, sizeTick, spin, zoom]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    movedRef.current = false;
    lastXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const dx = event.clientX - lastXRef.current;
    if (Math.abs(dx) > 1) movedRef.current = true;
    lastXRef.current = event.clientX;
    setSpin((value) => value + dx * 0.012);
  };

  const endPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (movedRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let best: { selected: Selected; distance: number } | null = null;
    for (const item of hitItemsRef.current) {
      const distance = Math.hypot(x - item.x, y - item.y);
      if (distance <= item.r && (!best || distance < best.distance)) {
        best = { selected: item.selected, distance };
      }
    }
    if (best) setSelected(best.selected);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setZoom((value) => {
      const next = value * (event.deltaY > 0 ? 0.92 : 1.08);
      return Math.max(0.62, Math.min(1.72, next));
    });
  };

  const reset = () => {
    setSpin(-0.35);
    setZoom(1);
  };

  return (
    <div className={`expertise-sphere${compact ? " expertise-sphere--compact" : ""}`}>
      <div className="expertise-sphere-stage">
        <canvas
          ref={canvasRef}
          className="expertise-sphere-canvas"
          onPointerDown={compact ? undefined : handlePointerDown}
          onPointerMove={compact ? undefined : handlePointerMove}
          onPointerUp={compact ? undefined : endPointer}
          onPointerCancel={compact ? undefined : endPointer}
          onClick={compact ? undefined : handleClick}
          onWheel={compact ? undefined : handleWheel}
          aria-label={ariaLabel}
        />
        {!compact && (
          <>
            <div className="expertise-sphere-hud">
              <span>Blue = Knowledge</span>
              <span>Red = Experience</span>
              <span>Yellow = Target areas</span>
            </div>
            <div className="expertise-sphere-controls">
              <button type="button" onClick={reset}>Reset</button>
              <button type="button" onClick={() => setShowLabels((value) => !value)}>
                Nodes {showLabels ? "on" : "off"}
              </button>
              <button type="button" onClick={() => setShowTargetLabels((value) => !value)}>
                Targets {showTargetLabels ? "on" : "off"}
              </button>
            </div>
          </>
        )}
      </div>

      {!compact && (
      <aside className="expertise-sphere-panel">
        <div className="expertise-sphere-kicker">
          {selected.type === "capability" ? "Selected capability" : "Selected target area"}
        </div>
        <h2>{selected.item.name}</h2>

        {selected.type === "capability" ? (
          <>
            <div className="expertise-sphere-pills">
              <span>{selected.item.mode}</span>
              <span>{selected.item.provenance}</span>
            </div>
            <dl>
              <div><dt>Hardware ↔ Software</dt><dd>{selected.item.x > 0 ? "+" : ""}{selected.item.x}</dd></div>
              <div><dt>Classical ↔ Quantum</dt><dd>{selected.item.y > 0 ? "+" : ""}{selected.item.y}</dd></div>
              <div><dt>Knowledge</dt><dd>{Math.round(selected.item.K * 100)}%</dd></div>
              <div><dt>Experience</dt><dd>{Math.round(selected.item.E * 100)}%</dd></div>
              <div><dt>Prototype strength</dt><dd>{Math.round(selected.item.score * 20)}%</dd></div>
            </dl>
          </>
        ) : (
          <>
            <div className="expertise-sphere-pills">
              <span>Career direction</span>
              <span>Target</span>
            </div>
            <dl>
              <div><dt>Support</dt><dd>{selected.item.support}%</dd></div>
              <div><dt>Surface state</dt><dd>Directional</dd></div>
            </dl>
          </>
        )}

        <p className="expertise-sphere-note">
          Renderer lab only. The shell geometry is now perspective-correct; visual material,
          hierarchy and final data pipeline remain intentionally open for refinement.
        </p>
      </aside>
      )}
    </div>
  );
}

export default ExpertiseSphere;
