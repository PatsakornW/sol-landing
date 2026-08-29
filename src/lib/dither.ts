/**
 * Print dither for mechanism grounds. Hero article cards keep their own
 * one-ink path in `StippleCanvas`.
 */

export const MAX_DPR = 1.5;
/**
 * Device pixels per dither cell. 1 keeps the grain dense; raise it if the
 * plate starts to read as noise instead of print.
 */
export const DOT = 2;
/** Long-edge cap for the dither buffer. Atkinson is O(pixels). */
export const MAX_WORK = 520;
/** Crush midtones so a field reads as ink, not a grey wash. */
export const CONTRAST = 1.55;
/**
 * Half-size of the plate in the same units as `squircleR`. 0.5 means r = 1 is
 * the mid-edge of the card.
 */
export const CENTER_RX = 0.5;
export const CENTER_RY = 0.5;
/**
 * Where the source colour gives way to the card's fixed ink, in squircle
 * radii. A plate mid-edge is 1, a corner is ~1.19.
 */
export const INK_FADE_START = 0.74;
export const INK_FADE_END = 1.08;
/** Cream stock the articles print onto. Off-bits stay empty so this shows. */
export const PRINT_PAPER = '#F2EDE2';

export type RGB = readonly [number, number, number];

export function parseInk(hex: string): RGB {
  const n = hex.replace('#', '');
  const v = Number.parseInt(n.length === 3 ? n.replace(/(.)/g, '$1$1') : n, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, (v >> 0) & 255];
}

export function clampByte(n: number): number {
  return n < 0 ? 0 : n > 255 ? 255 : n;
}

/**
 * Superellipse n = 4. Contours follow the rectangular plate (a circle would
 * leave the corners as a different ink).
 */
export function squircleR(nx: number, ny: number): number {
  const ax = nx * nx;
  const ay = ny * ny;
  return Math.sqrt(Math.sqrt(ax * ax + ay * ay));
}

/**
 * Share of the source colour at radius `r`: 1 in the core, 0 out past the
 * fade, smoothstepped between so the two inks meet without a ring.
 */
export function imageInkShare(r: number): number {
  if (r <= INK_FADE_START) return 1;
  if (r >= INK_FADE_END) return 0;
  const t = (r - INK_FADE_START) / (INK_FADE_END - INK_FADE_START);
  return 1 - t * t * (3 - 2 * t);
}

export function rgbToHsl(r: number, g: number, b: number): readonly [number, number, number] {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6;
  else if (max === G) h = ((B - R) / d + 2) / 6;
  else h = ((R - G) / d + 4) / 6;
  return [h, s, l];
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  if (s <= 0) {
    const v = clampByte(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let T = t;
    if (T < 0) T += 1;
    if (T > 1) T -= 1;
    if (T < 1 / 6) return p + (q - p) * 6 * T;
    if (T < 1 / 2) return q;
    if (T < 2 / 3) return p + (q - p) * (2 / 3 - T) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    clampByte(hue2rgb(p, q, h + 1 / 3) * 255),
    clampByte(hue2rgb(p, q, h) * 255),
    clampByte(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

/** Photograph pixel as ink: keep hue and lightness, lift chroma a hair. */
export function trueInk(c: RGB): RGB {
  const [h, s, l] = rgbToHsl(c[0], c[1], c[2]);
  if (s < 0.04) return c;
  return hslToRgb(h, Math.min(0.7, s * 1.06), l);
}

/**
 * Cells the dither runs on, sized from the *output* so a cell is `DOT`
 * device pixels wide however large the plate is.
 */
export function workSize(cssW: number, cssH: number, dpr: number): { w: number; h: number } {
  const long = Math.max(cssW, cssH);
  const target = Math.min((long * dpr) / DOT, MAX_WORK);
  const scale = target / long;
  return {
    w: Math.max(1, Math.round(cssW * scale)),
    h: Math.max(1, Math.round(cssH * scale)),
  };
}

/**
 * Atkinson error diffusion. Carries 6/8 of the error, so it stays grainy
 * instead of locking into a Bayer grid — the print look on the articles.
 */
export function atkinson(luma: Float32Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(w * h);
  const add = (x: number, y: number, err: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    luma[i] = (luma[i] ?? 0) + err;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = luma[i] ?? 0;
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
