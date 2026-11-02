/**
 * The page's light: a soft colour field seen through fluted glass, drawn by
 * one fragment shader on a full-screen triangle.
 *
 * It is the one background for the whole page, footer included: a three-lobe
 * blob in the hero that sinks and dims, then a wash that runs through the four
 * step colours, then the blob again, turning with the scroll behind every scene
 * to the end. The scroll timeline writes into `FieldState`; the loop reads it
 * every frame.
 */

export type FieldState = {
  /** The hero blob's strength, 0–1. */
  blob: number;
  /** How far the blob has sunk, in screen heights. */
  blobY: number;
  /** The blob's size. */
  blobScale: number;
  /** How far the blob's three lobes have turned about the middle, in radians. */
  blobRot: number;
  /** The load-in bloom, 0–1: the blob grows out of the dark and turns into place. */
  intro: number;
  /** The step wash's strength, 0–1. */
  wash: number;
  /** Where the wash sits in the step palette, 0–3 (blue, violet, pink, rose). */
  step: number;
  /** How far the wash narrows toward the bottom, 0–1. */
  taper: number;
};

export const initialField = (): FieldState => ({ blob: 1, blobY: 0, blobScale: 1, blobRot: 0, intro: 1, wash: 0, step: 0, taper: 0 });

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uBlob;
uniform float uBlobY;
uniform float uBlobScale;
uniform float uBlobRot;
uniform float uIntro;
uniform float uWash;
uniform float uStep;
uniform float uTaper;
uniform float uRib;

/* Deep, saturated tones: the glass glows in colour and falls off to black,
   never to a pale wash. */
const vec3 BLUE = vec3(0.12, 0.3, 0.86);
const vec3 VIOLET = vec3(0.4, 0.24, 0.88);
const vec3 PINK = vec3(0.78, 0.3, 0.86);
const vec3 ROSE = vec3(0.7, 0.1, 0.48);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 lobe(vec2 p, vec2 c, vec2 r, vec3 col) {
  vec2 d = (p - c) / r;
  return col * exp(-dot(d, d));
}

vec3 palette(float s) {
  s = clamp(s, 0.0, 3.0);
  vec3 a = mix(BLUE, VIOLET, smoothstep(0.0, 1.0, s));
  a = mix(a, PINK, smoothstep(1.0, 2.0, s));
  return mix(a, ROSE, smoothstep(2.0, 3.0, s));
}

void main() {
  float aspect = uRes.x / uRes.y;
  /* Fluted glass: wide vertical ribs, each bending what is behind it a touch
     and catching a faint highlight — smooth across the rib, so no hard lines. */
  float ribs = max(10.0, uRes.x / uRib);
  float cell = fract(vUv.x * ribs);
  float wave = sin(cell * 6.2832);
  vec2 q = vUv;
  q.x += wave * 0.005;
  vec2 p = vec2((q.x - 0.5) * aspect, q.y - 0.5);
  float t = uTime * 0.16;
  vec3 col = vec3(0.0);

  /* The hero: blue across the top right, pink through the middle, magenta
     low on the left — a diagonal of light with black corners around it. */
  vec2 bp = (p + vec2(0.0, uBlobY)) / max(uBlobScale * mix(0.3, 1.0, uIntro), 0.001);
  float c = cos(uBlobRot + (1.0 - uIntro) * 1.4);
  float sn = sin(uBlobRot + (1.0 - uIntro) * 1.4);
  bp = mat2(c, sn, -sn, c) * bp;
  col += lobe(bp, vec2(0.22 + 0.06 * sin(t), 0.2 + 0.04 * cos(t * 1.3)), vec2(0.52, 0.25), BLUE) * 1.15;
  col += lobe(bp, vec2(-0.12 + 0.05 * cos(t * 0.8), -0.06 + 0.03 * sin(t * 1.1)), vec2(0.34, 0.24), PINK) * 1.0;
  col += lobe(bp, vec2(-0.52 + 0.04 * sin(t * 0.7), -0.42), vec2(0.34, 0.24), ROSE) * 1.2;
  col *= 1.0 - smoothstep(0.3, 0.95, length(bp * vec2(0.6, 1.0)));
  col *= uBlob * uIntro;

  /* The step wash: the palette runs down the screen, so the next colour is
     always rising from the bottom. It is an arch — full in the middle, black
     at the sides, narrowing toward the bottom — and tapers away at the end. */
  float s = uStep + (0.55 - q.y) * 1.15;
  vec3 w = palette(s);
  float side = abs(p.x) / (aspect * 0.5);
  float edge = mix(0.74 + 0.3 * q.y, 0.34 + 0.5 * q.y, uTaper);
  float shape = 1.0 - smoothstep(edge - 0.4, edge, side);
  float fade = mix(smoothstep(-0.1, 0.25, q.y), smoothstep(0.1, 0.6, q.y), uTaper);
  col += w * shape * fade * uWash;

  /* Soft tone curve: bright overlaps stay coloured instead of going white. */
  col = 1.0 - exp(-col * 1.35);
  col *= 1.0 + 0.045 * wave * wave - 0.02;
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0) * 91.0) - 0.5) * 0.035;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`;

/** How much of the screen's resolution the field draws at; it is soft anyway. */
const SCALE = 0.7;

/**
 * Start the field on a canvas. Returns a stop function, or null when WebGL is
 * not there (the canvas's CSS gradient stays as the fallback).
 *
 * Stopping frees the program and buffer but keeps the context: the same canvas
 * can be started again (React runs effects twice in development), and a
 * context that had been thrown away would leave the canvas blank. If the
 * browser drops the context itself, the CSS gradient shows until it comes back.
 */
export function startField(canvas: HTMLCanvasElement, state: FieldState, reduced: boolean): (() => void) | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return null;

  type Scene = { prog: WebGLProgram; buf: WebGLBuffer | null; draw: (now: number) => void };

  const build = (): Scene | null => {
    if (gl.isContextLost()) return null;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return null;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u('uRes');
    const uTime = u('uTime');
    const uBlob = u('uBlob');
    const uBlobY = u('uBlobY');
    const uBlobScale = u('uBlobScale');
    const uBlobRot = u('uBlobRot');
    const uIntro = u('uIntro');
    const uWash = u('uWash');
    const uStep = u('uStep');
    const uTaper = u('uTaper');
    // One rib every 64 CSS pixels, at whatever resolution the field draws.
    gl.uniform1f(u('uRib'), 64 * SCALE);

    const draw = (now: number) => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, reduced ? 4 : (now - start) / 1000);
      gl.uniform1f(uBlob, state.blob);
      gl.uniform1f(uBlobY, state.blobY);
      gl.uniform1f(uBlobScale, state.blobScale);
      gl.uniform1f(uBlobRot, state.blobRot);
      gl.uniform1f(uIntro, state.intro);
      gl.uniform1f(uWash, state.wash);
      gl.uniform1f(uStep, state.step);
      gl.uniform1f(uTaper, state.taper);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    return { prog, buf, draw };
  };

  const start = performance.now();
  let scene = build();
  if (!scene) return null;
  canvas.classList.add('is-live');

  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e?.isIntersecting ?? true;
  });
  io.observe(canvas);

  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!scene || !visible || document.hidden) return;
    scene.draw(now);
  };
  raf = requestAnimationFrame(frame);

  const onLost = (e: Event) => {
    e.preventDefault();
    scene = null;
    canvas.classList.remove('is-live');
  };
  const onRestored = () => {
    scene = build();
    if (scene) canvas.classList.add('is-live');
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    canvas.classList.remove('is-live');
    if (scene && !gl.isContextLost()) {
      gl.deleteBuffer(scene.buf);
      gl.deleteProgram(scene.prog);
    }
    scene = null;
  };
}
