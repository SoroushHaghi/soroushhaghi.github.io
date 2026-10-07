import { ExpertiseCapability } from "../expertise/expertiseData";

export type Point3 = { x: number; y: number; z: number };
export type Point2 = { x: number; y: number };
export type BasisKey = "QH" | "QS" | "CH" | "CS";

export type PreparedCapability = ExpertiseCapability & {
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

export type HitRod = { item: PreparedCapability; a: Point2; b: Point2 };

export const SPHERE_R = 115;
export const AXIS_R = 132;
export const CAMERA_DISTANCE = 430;

const KNOWLEDGE = "#4b86d8";
const EXPERIENCE = "#cf5a5a";

export const BASIS_COLORS: Record<BasisKey, string> = {
  QH: "#63e6be",
  QS: "#cf7cff",
  CH: "#5e9fff",
  CS: "#f0b957",
};

export const BASIS_KEYS: BasisKey[] = ["CH", "QH", "CS", "QS"];

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const clamp01 = (v: number) => clamp(v, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const normalize = (x: number, y: number, z: number): Point3 => {
  const n = Math.hypot(x, y, z) || 1;
  return { x: x / n, y: y / n, z: z / n };
};

export const scaleV = (v: Point3, s: number): Point3 => ({
  x: v.x * s,
  y: v.y * s,
  z: v.z * s,
});

export const add4 = (a: Point3, b: Point3, c: Point3, d: Point3): Point3 => ({
  x: a.x + b.x + c.x + d.x,
  y: a.y + b.y + c.y + d.y,
  z: a.z + b.z + c.z + d.z,
});

export const dot = (a: Point3, b: Point3) => a.x * b.x + a.y * b.y + a.z * b.z;

export const mixDirection = (a: Point3, b: Point3, t: number): Point3 =>
  normalize(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));

export const BASIS: Record<BasisKey, Point3> = {
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

export const prepareCareerStateCapabilities = (
  items: readonly ExpertiseCapability[]
): PreparedCapability[] =>
  items.map((item) => {
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
    const dominant = BASIS_KEYS.reduce(
      (best, key) => (weights[key] > weights[best] ? key : best),
      BASIS_KEYS[0]
    );

    // Knowledge/Experience are evidence probabilities/strength inputs here.
    // They do not define a visible final-sphere axis. The final direction is
    // determined by the four semantic basis states; evidence strength controls
    // rod length.
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

export const computeCareerStateProbabilities = (
  capabilities: readonly PreparedCapability[]
): Record<BasisKey, number> => {
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
};

type DrawCareerStateQubitOptions = {
  ctx: CanvasRenderingContext2D;
  centerX: number;
  centerY: number;
  scale: number;
  radius: number;
  reveal: number;
  capabilities: readonly PreparedCapability[];
  yaw: number;
  pitch: number;
  mobile?: boolean;
  selectedKey?: BasisKey | null;
  measureAmount?: number;
  collectHitRods?: boolean;
  showBasisLabels?: boolean;
};

export const drawCareerStateQubit = ({
  ctx,
  centerX,
  centerY,
  scale,
  radius: R,
  reveal,
  capabilities,
  yaw,
  pitch,
  mobile = false,
  selectedKey = null,
  measureAmount = 0,
  collectHitRods = false,
  showBasisLabels = true,
}: DrawCareerStateQubitOptions): HitRod[] => {
  if (reveal <= 0.001) return [];

  const hitRods: HitRod[] = [];
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  const rotate = (point: Point3): Point3 => {
    const x1 = cy * point.x + sy * point.z;
    const z1 = -sy * point.x + cy * point.z;
    const y1 = point.y;
    return {
      x: x1,
      y: cp * y1 - sp * z1,
      z: sp * y1 + cp * z1,
    };
  };

  const project = (point: Point3) => {
    const r = rotate(point);
    const persp = CAMERA_DISTANCE / (CAMERA_DISTANCE - r.z);
    return {
      x: centerX + r.x * scale * persp,
      y: centerY - r.y * scale * persp,
      depth: r.z,
      persp,
    };
  };

  const shellR =
    scale *
    R *
    (CAMERA_DISTANCE /
      Math.sqrt(Math.max(1, CAMERA_DISTANCE * CAMERA_DISTANCE - R * R)));

  ctx.save();
  const glass = ctx.createRadialGradient(
    centerX - shellR * 0.22,
    centerY - shellR * 0.24,
    shellR * 0.04,
    centerX,
    centerY,
    shellR
  );
  glass.addColorStop(0, "rgba(232,240,251,.054)");
  glass.addColorStop(0.46, "rgba(147,169,197,.018)");
  glass.addColorStop(1, "rgba(72,94,124,.026)");
  ctx.globalAlpha = reveal;
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.arc(centerX, centerY, shellR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const dots = shellDots
    .map((row) => {
      const point = { x: row.p.x * R, y: row.p.y * R, z: row.p.z * R };
      const rotated = rotate(point);
      const projected = project(point);
      return { row, rotated, projected };
    })
    .sort((a, b) => a.rotated.z - b.rotated.z);

  dots.forEach(({ row, rotated, projected }) => {
    const front = clamp01((rotated.z / Math.max(1, R) + 1) / 2);
    const selected = !selectedKey || row.basis === selectedKey;
    const dim = selectedKey
      ? selected
        ? 1
        : 0.08 + 0.12 * (1 - measureAmount)
      : 1;
    ctx.save();
    ctx.globalAlpha = reveal * (0.05 + 0.28 * front) * row.jitter * dim;
    ctx.fillStyle = BASIS_COLORS[row.basis];
    ctx.beginPath();
    ctx.arc(
      projected.x,
      projected.y,
      (mobile ? 0.55 : 0.65) + front * 0.9,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  });

  const drawCircle = (
    plane: "xy" | "xz" | "yz",
    backAlpha: number,
    frontAlpha: number
  ) => {
    const rows: Array<{ q: Point2; front: boolean }> = [];
    const count = 180;

    for (let i = 0; i <= count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      let point: Point3;
      if (plane === "xy") {
        point = { x: R * Math.cos(angle), y: R * Math.sin(angle), z: 0 };
      } else if (plane === "xz") {
        point = { x: R * Math.cos(angle), y: 0, z: R * Math.sin(angle) };
      } else {
        point = { x: 0, y: R * Math.cos(angle), z: R * Math.sin(angle) };
      }
      const rotated = rotate(point);
      rows.push({ q: project(point), front: rotated.z >= 0 });
    }

    [false, true].forEach((frontWanted) => {
      ctx.save();
      ctx.globalAlpha =
        reveal *
        (frontWanted ? frontAlpha : backAlpha) *
        (selectedKey ? 1 - measureAmount * 0.55 : 1);
      ctx.strokeStyle = "rgba(225,235,248,.58)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      let open = false;
      rows.forEach((row) => {
        if (row.front === frontWanted) {
          if (!open) {
            ctx.moveTo(row.q.x, row.q.y);
            open = true;
          } else {
            ctx.lineTo(row.q.x, row.q.y);
          }
        } else {
          open = false;
        }
      });
      ctx.stroke();
      ctx.restore();
    });
  };

  drawCircle("xy", 0.025, 0.1);
  drawCircle("xz", 0.018, 0.075);
  drawCircle("yz", 0.018, 0.07);

  const origin = project({ x: 0, y: 0, z: 0 });
  const vectorRows = capabilities
    .map((item) => {
      const d = item.semanticDirection;
      const tip = {
        x: d.x * R * item.radialStrength,
        y: d.y * R * item.radialStrength,
        z: d.z * R * item.radialStrength,
      };
      const rotated = rotate(tip);
      return {
        item,
        rotated,
        q: project(tip),
        anchor: project({ x: d.x * R, y: d.y * R, z: d.z * R }),
      };
    })
    .sort((a, b) => a.rotated.z - b.rotated.z);

  vectorRows.forEach(({ item, rotated, q, anchor }) => {
    const front = clamp01((rotated.z / Math.max(1, R) + 1) / 2);
    const belongs = !selectedKey || item.dominant === selectedKey;
    const dim = selectedKey
      ? belongs
        ? 1
        : 0.1 + 0.16 * (1 - measureAmount)
      : 1;

    ctx.save();
    ctx.globalAlpha = reveal * (0.22 + 0.68 * front) * dim;
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

    if (collectHitRods && reveal > 0.82) {
      hitRods.push({ item, a: origin, b: q });
    }

    ctx.save();
    ctx.globalAlpha = reveal * (0.28 + 0.52 * front) * dim;
    ctx.strokeStyle = BASIS_COLORS[item.dominant];
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 2 + front * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  BASIS_KEYS.forEach((key) => {
    const point = {
      x: BASIS[key].x * R,
      y: BASIS[key].y * R,
      z: BASIS[key].z * R,
    };
    const rotated = rotate(point);
    const projected = project(point);
    const front = clamp01((rotated.z / Math.max(1, R) + 1) / 2);
    const selected = !selectedKey || selectedKey === key;
    const dim = selectedKey
      ? selected
        ? 1
        : 0.1 + 0.13 * (1 - measureAmount)
      : 1;

    ctx.save();
    ctx.globalAlpha = reveal * (0.44 + 0.54 * front) * dim;
    ctx.fillStyle = BASIS_COLORS[key];
    ctx.shadowColor = BASIS_COLORS[key];
    ctx.shadowBlur = 13;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, mobile ? 2.4 : 2.8, 0, Math.PI * 2);
    ctx.fill();

    if (showBasisLabels) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(242,247,253,.90)";
      ctx.font = `650 ${mobile ? 8 : 10}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(key, projected.x, projected.y - (mobile ? 11 : 14));
    }
    ctx.restore();
  });

  if (selectedKey && measureAmount > 0) {
    const d = BASIS[selectedKey];
    const q = project({
      x: d.x * R * 0.91,
      y: d.y * R * 0.91,
      z: d.z * R * 0.91,
    });
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
  ctx.globalAlpha = reveal * 0.43;
  ctx.strokeStyle = "rgba(229,237,248,.64)";
  ctx.lineWidth = 1.15;
  ctx.beginPath();
  ctx.arc(centerX, centerY, shellR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  return hitRods;
};
