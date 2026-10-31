'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';

const MAX_DPR = 1.5;
/** Long-edge cap for the dither buffer. Sized from the output so a cell
 *  stays close to one device pixel; the cap keeps three plates cheap. */
const MAX_WORK = 440;
/** Crush midtones so a photograph reads as ink, not a grey wash. */
const CONTRAST = 1.55;

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src);
  if (hit) return hit;
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.addEventListener('load', () => resolve(img), { once: true });
    img.addEventListener(
      'error',
      () => {
        imageCache.delete(src);
        reject(new Error(`dither source failed to decode: ${src}`));
      },
      { once: true },
    );
    img.src = src;
  });
  imageCache.set(src, pending);
  return pending;
}

function parseInk(hex: string): readonly [number, number, number] {
  const n = hex.replace('#', '');
  const v = Number.parseInt(n.length === 3 ? n.replace(/(.)/g, '$1$1') : n, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function coverFit(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
): { dx: number; dy: number; dw: number; dh: number } {
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const dw = imgW * scale;
  const dh = imgH * scale;
  return {
    dx: (boxW - dw) / 2,
    dy: (boxH - dh) / 2,
    dw,
    dh,
  };
}

function clampByte(n: number): number {
  return n < 0 ? 0 : n > 255 ? 255 : n;
}

/**
 * Atkinson error diffusion. Carries 6/8 of the error, so it stays grainy
 * instead of locking into a Bayer grid — the print look in the reference.
 */
function atkinson(luma: Float32Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(w * h);
  const buf = luma;
  const add = (x: number, y: number, err: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    buf[i] = (buf[i] ?? 0) + err;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = buf[i] ?? 0;
      const next = old < 128 ? 0 : 255;
      out[i] = next;
      const err = (old - next) / 8;
      add(x + 1, y, err);
      add(x + 2, y, err);
      add(x - 1, y + 1, err);
      add(x, y + 1, err);
      add(x + 1, y + 1, err);
      add(x, y + 2, err);
    }
  }
  return out;
}

type PaintOpts = {
  image: HTMLImageElement;
  ink: string;
};

function workSize(outW: number, outH: number): { w: number; h: number } {
  const long = Math.max(outW, outH);
  if (long <= MAX_WORK) return { w: outW, h: outH };
  const scale = MAX_WORK / long;
  return {
    w: Math.max(1, Math.round(outW * scale)),
    h: Math.max(1, Math.round(outH * scale)),
  };
}

function paint(canvas: HTMLCanvasElement, { image, ink }: PaintOpts) {
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

  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;
  if (imgW === 0 || imgH === 0) return;

  const { w: workW, h: workH } = workSize(outW, outH);
  const work = document.createElement('canvas');
  work.width = workW;
  work.height = workH;
  const wctx = work.getContext('2d', { alpha: true, willReadFrequently: true });
  if (!wctx) return;

  const box = coverFit(imgW, imgH, workW, workH);
  wctx.drawImage(image, box.dx, box.dy, box.dw, box.dh);
  const src = wctx.getImageData(0, 0, workW, workH);
  const luma = new Float32Array(workW * workH);

  for (let i = 0, p = 0; i < src.data.length; i += 4, p++) {
    const a = (src.data[i + 3] ?? 0) / 255;
    const y =
      ((src.data[i] ?? 0) * 0.299 +
        (src.data[i + 1] ?? 0) * 0.587 +
        (src.data[i + 2] ?? 0) * 0.114) *
      a;
    luma[p] = clampByte((y - 128) * CONTRAST + 128);
  }

  const bits = atkinson(luma, workW, workH);
  const [ir, ig, ib] = parseInk(ink);
  const out = wctx.createImageData(workW, workH);
  for (let p = 0; p < bits.length; p++) {
    if ((bits[p] ?? 255) !== 0) continue;
    const i = p * 4;
    out.data[i] = ir;
    out.data[i + 1] = ig;
    out.data[i + 2] = ib;
    out.data[i + 3] = 255;
  }
  wctx.putImageData(out, 0, 0);

  ctx.clearRect(0, 0, outW, outH);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(work, 0, 0, outW, outH);
}

type DitherCanvasProps = {
  src: string;
  ink: string;
  /**
   * Where the canvas sits in the caller's plate. A typed `StyleXStyles` rather
   * than the `className`/`style` pair this used to take: the caller hands over
   * a style *value*, so the type checker sees what it is and the merge order is
   * the argument order, not a race between two attributes.
   */
  style?: StyleXStyles;
};

/**
 * Turns a photograph into a one-ink Atkinson dither on a transparent ground.
 * The cream plate behind the canvas is the paper; off-bits stay empty.
 */
export function StippleCanvas({ src, ink, style }: DitherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let cancelled = false;
    let raf = 0;
    let observer: ResizeObserver | null = null;

    const stop = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      observer = null;
    };

    loadImage(src)
      .then((image) => {
        if (cancelled || !canvasRef.current) return;

        const run = () => {
          if (cancelled || !canvasRef.current) return;
          paint(canvasRef.current, { image, ink });
        };
        const schedule = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(run);
        };

        schedule();
        const parent = canvas.parentElement;
        if (!parent || typeof ResizeObserver === 'undefined') return;
        observer = new ResizeObserver(schedule);
        observer.observe(parent);
      })
      .catch(() => {
        stop();
      });

    return stop;
  }, [src, ink]);

  return <canvas ref={canvasRef} {...stylex.props(style)} aria-hidden />;
}
