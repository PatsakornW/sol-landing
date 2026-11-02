/**
 * Dissolves the text in an input into particles that drift off to the right
 * and fade into `toColor`, drawn on a canvas laid over the input. The sweep
 * starts at the text's end and runs back to its start, so the value is carried
 * away the way it was typed, last character first.
 *
 * The caller hides the input's own text once this returns (the canvas already
 * shows it by then). The promise resolves when the last particle has gone, or
 * at once when there is nothing to dissolve, no 2D canvas, or the visitor
 * prefers reduced motion.
 */

// The sweep from the text's end to its start, and how long a particle lives.
const SWEEP_MS = 420;
const LIFE_MS: readonly [min: number, max: number] = [450, 780];
// More samples than this and the sampling step grows, so long values stay cheap.
const MAX_PARTICLES = 4000;
// Particles fade through this many colour steps, one fill style per step.
const COLOR_STEPS = 6;

type Particle = {
  x: number;
  y: number;
  alpha: number;
  delay: number;
  life: number;
  vx: number;
  vy: number;
  lift: number;
};

type Rgb = readonly [number, number, number];

// Any CSS colour (computed styles come back as oklch() here) as RGB: paint one
// pixel with it and read the pixel back.
function toRgb(context: CanvasRenderingContext2D, color: string): Rgb {
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r = 255, g = 255, b = 255] = context.getImageData(0, 0, 1, 1).data;
  context.clearRect(0, 0, 1, 1);
  return [r, g, b];
}

const rgb = ([r, g, b]: Rgb) => `rgb(${r}, ${g}, ${b})`;

function mixRgb(from: Rgb, to: Rgb, t: number) {
  const channel = (i: 0 | 1 | 2) => Math.round(from[i] + (to[i] - from[i]) * t);
  return rgb([channel(0), channel(1), channel(2)]);
}

export function dissolveText(
  input: HTMLInputElement,
  canvas: HTMLCanvasElement,
  toColor: string,
): Promise<void> {
  const context = canvas.getContext('2d');
  if (
    !input.value.trim() ||
    !context ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return Promise.resolve();
  }

  // Lay the canvas over the input's box, at the screen's resolution.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = input.offsetWidth;
  const height = input.offsetHeight;
  canvas.style.left = `${input.offsetLeft}px`;
  canvas.style.top = `${input.offsetTop}px`;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  // Draw the text where the input shows it, cut where the input cuts a long
  // value at its padding, then sample its pixels.
  const style = getComputedStyle(input);
  const from = toRgb(context, style.color);
  const to = toRgb(context, toColor);
  const left = parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
  const right = width - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth);
  context.save();
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.beginPath();
  context.rect(left, 0, right - left, height);
  context.clip();
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  context.textBaseline = 'middle';
  context.fillStyle = rgb(from);
  context.fillText(input.value, left - input.scrollLeft, height / 2);
  context.restore();
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

  let inked = 0;
  for (let i = 3; i < pixels.length; i += 4) if ((pixels[i] ?? 0) > 64) inked += 1;
  const step = Math.max(1, Math.ceil(Math.sqrt(inked / MAX_PARTICLES)));

  const particles: Particle[] = [];
  let start = canvas.width;
  let end = 0;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const alpha = pixels[(y * canvas.width + x) * 4 + 3] ?? 0;
      if (alpha <= 64) continue;
      start = Math.min(start, x);
      end = Math.max(end, x);
      particles.push({
        x,
        y,
        alpha: alpha / 255,
        delay: 0,
        life: LIFE_MS[0] + Math.random() * (LIFE_MS[1] - LIFE_MS[0]),
        vx: (0.05 + Math.random() * 0.11) * dpr,
        vy: (Math.random() - 0.5) * 0.04 * dpr,
        lift: (Math.random() - 0.65) * 0.00012 * dpr,
      });
    }
  }
  if (!particles.length) return Promise.resolve();
  for (const particle of particles) {
    // A little jitter, so the sweep's front is ragged rather than a ruled line.
    const along = (end - particle.x) / Math.max(1, end - start);
    particle.delay = Math.max(0, along * SWEEP_MS + (Math.random() - 0.5) * 60);
  }

  const fills = Array.from({ length: COLOR_STEPS }, (_, i) =>
    mixRgb(from, to, i / (COLOR_STEPS - 1)),
  );
  const total = SWEEP_MS + 60 + LIFE_MS[1];

  return new Promise((resolve) => {
    const begin = performance.now();
    const frame = (now: number) => {
      const elapsed = now - begin;
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (elapsed >= total || !canvas.isConnected) {
        resolve();
        return;
      }
      for (const [bucket, fill] of fills.entries()) {
        context.fillStyle = fill;
        for (const particle of particles) {
          const age = elapsed - particle.delay;
          const t = age <= 0 ? 0 : age / particle.life;
          if (t >= 1 || Math.min(COLOR_STEPS - 1, Math.floor(t * COLOR_STEPS)) !== bucket) continue;
          // Still in place until the sweep reaches it, then away and fading.
          const drift = Math.max(0, age);
          context.globalAlpha = particle.alpha * (1 - t) ** 1.6;
          context.fillRect(
            particle.x + particle.vx * drift,
            particle.y + particle.vy * drift + particle.lift * drift * drift,
            step,
            step,
          );
        }
      }
      context.globalAlpha = 1;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}
