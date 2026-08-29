'use client';

import { useId, useLayoutEffect, useRef } from 'react';

import {
  atkinson,
  CENTER_RX,
  CENTER_RY,
  clampByte,
  imageInkShare,
  MAX_DPR,
  parseInk,
  PRINT_PAPER,
  squircleR,
  trueInk,
  workSize,
  type RGB,
} from '@/lib/dither';

export type PlateDitherFieldProps = {
  /** Edge ink — same role as `PrintCard`'s `ink`. */
  ink: string;
  /** Colour of the dense core, the "photograph" the dither is of. */
  accent: string;
  originX: number;
  originY: number;
};

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [
    clampByte(a[0] + (b[0] - a[0]) * t),
    clampByte(a[1] + (b[1] - a[1]) * t),
    clampByte(a[2] + (b[2] - a[2]) * t),
  ];
}

/** Tiny hash so a smooth field does not lock Atkinson into luma contours. */
function jitter(p: number): number {
  const x = Math.sin(p * 12.9898) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 10;
}

function paintField(canvas: HTMLCanvasElement, spec: PlateDitherFieldProps) {
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const cssW = Math.max(1, Math.round(canvas.clientWidth));
  const cssH = Math.max(1, Math.round(canvas.clientHeight));
  const outW = Math.round(cssW * dpr);
  const outH = Math.round(cssH * dpr);
  if (canvas.width !== outW || canvas.height !== outH) {
    canvas.width = outW;
    canvas.height = outH;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const { w: workW, h: workH } = workSize(cssW, cssH, dpr);
  const work = document.createElement('canvas');
  work.width = workW;
  work.height = workH;
  const wctx = work.getContext('2d', { alpha: true, willReadFrequently: true });
  if (!wctx) return;

  const ink = parseInk(spec.ink);
  const accent = parseInk(spec.accent);
  const luma = new Float32Array(workW * workH);
  const inkR = new Uint8ClampedArray(workW * workH);
  const inkG = new Uint8ClampedArray(workW * workH);
  const inkB = new Uint8ClampedArray(workW * workH);
  const cx = workW / 2;
  const cy = workH / 2;
  const rx = Math.max(1, workW * CENTER_RX);
  const ry = Math.max(1, workH * CENTER_RY);

  for (let y = 0; y < workH; y++) {
    for (let x = 0; x < workW; x++) {
      const p = y * workW + x;
      const edge = 0.88 + 0.12 * imageInkShare(squircleR((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry));
      const dx = (x + 0.5) / workW - spec.originX;
      const dy = (y + 0.5) / workH - spec.originY;
      const t = Math.hypot(dx, dy) / 1.08;
      const fall = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
      const density = (0.93 - fall * 0.6) * edge;
      const chroma = 0.96 - fall * 0.72;
      const [ir, ig, ib] = trueInk(lerpRgb(ink, accent, chroma));
      inkR[p] = ir;
      inkG[p] = ig;
      inkB[p] = ib;
      luma[p] = clampByte(204 - density * 138 + jitter(p));
    }
  }

  const bits = atkinson(luma, workW, workH);
  const out = wctx.createImageData(workW, workH);
  for (let p = 0; p < bits.length; p++) {
    if ((bits[p] ?? 255) !== 0) continue;
    const i = p * 4;
    out.data[i] = inkR[p] ?? 0;
    out.data[i + 1] = inkG[p] ?? 0;
    out.data[i + 2] = inkB[p] ?? 0;
    out.data[i + 3] = 255;
  }
  wctx.putImageData(out, 0, 0);

  ctx.clearRect(0, 0, outW, outH);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(work, 0, 0, outW, outH);
}

function PaperGrain() {
  const id = useId().replace(/:/g, '');
  const filter = `pg-${id}`;

  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.14,
        mixBlendMode: 'multiply',
      }}
    >
      <filter id={filter} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.22  0 0 0 0 0.2  0 0 0 0 0.16  0 0 0 0.55 0"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filter})`} />
    </svg>
  );
}

/**
 * Atkinson print of a colour field, on the same cream stock as the hero
 * articles. Off-bits stay empty; the parent paints `PRINT_PAPER`.
 */
export function PlateDitherField(spec: PlateDitherFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let cancelled = false;
    let raf = 0;
    const run = () => {
      if (cancelled || !canvasRef.current) return;
      paintField(canvasRef.current, spec);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(run);
    };

    schedule();
    const parent = canvas.parentElement;
    const observer =
      parent && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(parent ?? canvas);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [spec.ink, spec.accent, spec.originX, spec.originY]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
      <PaperGrain />
    </>
  );
}

export { PRINT_PAPER };
