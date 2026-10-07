import React, { useEffect, useMemo, useRef, useState } from "react";
import { ExpertiseCapability } from "../expertise/expertiseData";
import {
  SPHERE_R,
  drawCareerStateQubit,
  prepareCareerStateCapabilities,
} from "./careerStateQubitCore";
import "./careerStateQubit.scss";

type Props = {
  data: readonly ExpertiseCapability[];
  ariaLabel: string;
  className?: string;
  yaw?: number;
  pitch?: number;
};

function CareerStateQubit({
  data,
  ariaLabel,
  className = "",
  yaw = -0.52,
  pitch = -0.3,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sizeTick, setSizeTick] = useState(0);
  const capabilities = useMemo(() => prepareCareerStateCapabilities(data), [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => setSizeTick((value) => value + 1));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
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

    const mobile = W < 220;
    const labelReserve = mobile ? 20 : 28;
    const available = Math.max(1, Math.min(W, H) - labelReserve * 2);
    const scale = available / (SPHERE_R * 2.16);

    drawCareerStateQubit({
      ctx,
      centerX: W * 0.5,
      centerY: H * 0.5,
      scale,
      radius: SPHERE_R,
      reveal: 1,
      capabilities,
      yaw,
      pitch,
      mobile,
      selectedKey: null,
      measureAmount: 0,
      collectHitRods: false,
      showBasisLabels: true,
    });
  }, [capabilities, pitch, sizeTick, yaw]);

  return (
    <div className={`career-state-qubit ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="career-state-qubit-canvas"
        aria-label={ariaLabel}
        role="img"
      />
    </div>
  );
}

export default CareerStateQubit;
