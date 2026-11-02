import { BRAND_FILLS } from '@/v5/components/brand/BrandMark';

/**
 * The opening's sun, drawn per pixel by one WebGL2 fragment shader, with no
 * geometry and no 3D library: the canvas is a square three times the sphere's
 * width, with room for its glow. It is lit like a photograph: the light is
 * worked out in linear units, the glow is added to it, and one tone map takes
 * the sum to the screen, so the centre rolls off toward white and the glow
 * fades from gold through orange to red. The surface is granulation (cellular
 * noise) over slow plasma currents (domain-warped noise), with sunspots and
 * faculae, under limb darkening. It turns on a tilted axis, so the spots and
 * granules cross the face on curved paths.
 *
 * As the visitor scrolls, the sun sets: it dims and reddens, then it and its
 * glow slide through the mark's purple into its blue as the glow dies down.
 * The CSS disc then takes over at the same size and colour, and the split
 * carries on (components/_home.scss, "Opening").
 */

// The sun sets as dusk falls, each step overlapping the last: it dims and
// reddens, slides into the mark's purple and then into its blue, while its
// glow follows and dies away. The CSS fades the disc in over the last 10% of
// the sun's scroll, so the sun must be the flat blue disc, its glow gone, by
// then.
const SUNSET: Range = [0.1, 0.55]; // dims and reddens
const TINT: Range = [0.45, 0.8]; // to the mark's purple
const TO_BLUE: Range = [0.64, 0.88]; // purple to the mark's blue
const CORONA_OUT: Range = [0.5, 0.88];
// Idle frames redraw at most this often; scrolling redraws every frame.
const IDLE_FRAME_MS = 33;
// The noise is the costly part, so the canvas stops short of a 2x backing store.
const MAX_DPR = 1.5;

const VERTEX = `#version 300 es
in vec2 aPos;
out vec2 vXY;
void main() {
  vXY = aPos;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

in vec2 vXY;
out vec4 outColor;

uniform float uTime;
uniform float uSpin;    // the sun's turn about its axis, radians
uniform float uRadius;  // the disc's radius in vXY units
uniform float uPx;      // one device pixel in vXY units
uniform float uSunset;  // 0 high, 1 set: dimmer and redder
uniform float uTint;    // 0 sun, 1 brand colour
uniform float uToBlue;  // 0 the mark's purple, 1 its blue
uniform float uCorona;  // glow strength
uniform vec3 uPurple;   // linear
uniform vec3 uBlue;     // linear

// The axis leans toward the viewer and to one side, so the turn reads as a
// sphere's: features cross the face on curved paths, slowing at the limb.
const float TILT = 0.3;
const float ROLL = -0.26;
// Exposure of the disc before tone mapping: its centre lands on a warm white.
const float EXPOSURE = 2.6;

vec3 toSrgb(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

float hash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

vec3 hash3(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), u.x),
      mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x),
      u.y
    ),
    mix(
      mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x),
      mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x),
      u.y
    ),
    u.z
  );
}

float fbm(vec3 p, int octaves) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    sum += amp * noise(p);
    p = p * 2.02 + 19.7;
    amp *= 0.5;
  }
  return sum;
}

// From view space (x right, y up, z toward the viewer) to body space, which
// turns with the sun: undo the roll, the tilt, then the turn.
vec3 toBody(vec3 v) {
  v.xy = mat2(cos(ROLL), -sin(ROLL), sin(ROLL), cos(ROLL)) * v.xy;
  v.yz = mat2(cos(TILT), sin(TILT), -sin(TILT), cos(TILT)) * v.yz;
  v.xz = mat2(cos(uSpin), sin(uSpin), -sin(uSpin), cos(uSpin)) * v.xz;
  return v;
}

// Distance to the nearest cell edge (F2 - F1): bright granules, dark lanes.
float granulation(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  float f1 = 9.0;
  float f2 = 9.0;
  for (int z = -1; z <= 1; z++) {
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec3 cell = vec3(float(x), float(y), float(z));
        vec3 d = cell + hash3(i + cell) - f;
        float dist = dot(d, d);
        if (dist < f1) {
          f2 = f1;
          f1 = dist;
        } else if (dist < f2) {
          f2 = dist;
        }
      }
    }
  }
  return sqrt(f2) - sqrt(f1);
}

// Plasma currents: noise warped by drifting noise, so the surface churns in
// slow, broad waves instead of sliding as one sheet.
float plasmaFlow(vec3 p) {
  vec3 q = p * 1.8;
  vec3 warp = vec3(
    fbm(q + vec3(0.0, 0.0, uTime * 0.02), 3),
    fbm(q + vec3(5.2, 1.3, -uTime * 0.017), 3),
    fbm(q + vec3(2.7, 8.1, uTime * 0.015), 3)
  );
  return fbm(p * 4.0 + warp * 1.6, 4);
}

// A point on the sphere at a latitude and longitude, in body space.
vec3 site(float lat, float lon) {
  return vec3(cos(lat) * sin(lon), sin(lat), cos(lat) * cos(lon));
}

// A sunspot of umbra radius u (radians) at c: a dark umbra inside a ragged
// penumbra. Returns how far p is in each, 0 to 1.
vec2 spot(vec3 p, vec3 c, float u, float rag) {
  float d = length(p - c);
  return vec2(1.0 - smoothstep(0.5 * u, 1.1 * u, d), 1.0 - smoothstep(1.5 * u, 2.5 * u, d * rag));
}

// Three spot groups, a third of a turn apart, so one is always in view. Each
// is a leading spot with smaller followers, a little off the equator as real
// ones are. x: umbra, y: penumbra, z: the bright plage round each group.
vec3 sunspots(vec3 p) {
  float rag = 0.8 + 0.4 * noise(p * 45.0);
  vec3 a = site(0.28, 0.0);
  vec3 b = site(-0.22, 2.2);
  vec3 c = site(0.2, 4.3);
  vec2 s = max(max(spot(p, a, 0.022, rag), spot(p, site(0.3, 0.09), 0.013, rag)),
    max(spot(p, site(0.25, 0.14), 0.008, rag), spot(p, b, 0.018, rag)));
  s = max(s, max(spot(p, site(-0.2, 2.27), 0.01, rag), spot(p, c, 0.012, rag)));
  float plage = exp(-dot(p - a, p - a) * 60.0) + exp(-dot(p - b, p - b) * 70.0)
    + exp(-dot(p - c, p - c) * 90.0);
  return vec3(s, plage);
}

// The light from p (body space), seen at mu, the cosine of the angle to the
// viewer: linear and before tone mapping, 1 at the centre of a quiet disc.
vec3 photosphere(vec3 p, float mu) {
  float edge = 1.0 - mu;
  // Limb darkening (quadratic law): toward the limb we see higher, cooler gas.
  float intensity = 1.0 - 0.56 * edge - 0.2 * edge * edge;
  // Granules: bright cells and dark lanes, flattened toward the limb, where
  // their contrast fades instead of turning to pixel noise.
  float cells = granulation(p * 40.0 + vec3(0.0, 0.0, uTime * 0.03));
  float grain = (smoothstep(0.0, 0.7, cells) - 0.5) * 0.08 * mu;
  float plasma = plasmaFlow(p);
  vec3 spots = sunspots(p);
  intensity *= (1.0 + grain + 0.12 * (plasma - 0.5))
    * (1.0 - 0.38 * spots.y) * (1.0 - 0.7 * spots.x);
  // Faculae: bright plage round the spots and where the currents crest, seen
  // only toward the limb.
  intensity += (0.6 * spots.z + smoothstep(0.45, 0.8, plasma)) * edge * mu * 0.35;
  // Dimmer gas is cooler, so the limb and the spots redden.
  vec3 chroma = mix(vec3(1.0, 0.17, 0.01), vec3(1.0, 0.47, 0.115), smoothstep(0.15, 1.05, intensity));
  return chroma * intensity;
}

void main() {
  float r = length(vXY);
  float coverage = 1.0 - smoothstep(uRadius - uPx, uRadius + uPx, r);
  vec3 brand = mix(uPurple, uBlue, uToBlue);

  // The glow: the sun's light spread by the eye or a lens, so it falls on
  // both sides of the limb, over the disc's edge as well as round it. A glare,
  // a glow and a wide haze, gone before the canvas edge two radii out. It is
  // the light's own colour, and the tone mapping below turns it from gold at
  // the limb through orange to red as it fades.
  float d = abs(r - uRadius) / uRadius;
  // Setting, the light crosses more air: it dims, and its green and blue go
  // first.
  vec3 dusk = mix(vec3(1.0), vec3(0.8, 0.36, 0.2), uSunset);
  vec3 glow = vec3(0.0);
  if (uCorona > 0.0 && d < 2.0) {
    float spread = 0.65 * exp(-d * 16.0) + 0.26 * exp(-d * 6.5)
      + 0.022 / (1.0 + d * d * 4.9) * (1.0 - smoothstep(1.0, 1.95, d));
    glow = mix(vec3(1.0, 0.22, 0.027) * dusk, brand, uTint) * spread * uCorona;
  }

  vec3 disc = vec3(0.0);
  if (coverage > 0.0) {
    vec2 q = vXY / uRadius;
    float mu = sqrt(max(0.0, 1.0 - dot(q, q)));
    vec3 p = toBody(vec3(q, mu));
    // Tone mapping: the centre rolls off toward white, as bright light does.
    disc = 1.0 - exp(-(photosphere(p, mu) * EXPOSURE * dusk + glow));
    disc = mix(disc, brand, uTint);
  }

  // Premultiplied over the page: the glow's sRGB colour with its brightest
  // channel as alpha, so over the black page it shows exactly as encoded.
  vec3 halo = toSrgb(1.0 - exp(-glow));
  float alpha = max(halo.r, max(halo.g, halo.b));
  // Dither by under one 8-bit step, so the long falloff does not band. The
  // brightest channel stays equal to alpha, so the colour stays premultiplied.
  float dither = (hash(vec3(gl_FragCoord.xy, 7.0)) - 0.5) / 255.0;
  vec4 light = max(vec4(halo, alpha) + dither * step(1e-3, alpha), 0.0);

  outColor = vec4(toSrgb(disc), 1.0) * coverage + light * (1.0 - coverage);
}`;

type Range = readonly [start: number, end: number];

type SunOptions = {
  /** Scroll progress through the sun's part of the opening, 0 to 1. */
  progress: () => number;
  /** The disc's diameter as a share of the canvas's width. */
  discShare: () => number;
  /** The first frame is on the canvas. */
  onReady: () => void;
  /** WebGL2 is missing, the shader failed, or the context was lost. */
  onFail: () => void;
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Smootherstep over `range`: zero velocity and acceleration at both ends. */
function ease([start, end]: Range, x: number) {
  const t = clamp01((x - start) / (end - start));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function linearRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const c = ((n >> shift) & 255) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return [channel(16), channel(8), channel(0)];
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed');
  }
  return shader;
}

/**
 * Draws the sun into `canvas` until the returned function is called. It draws
 * only while the sun is on screen (progress below 1): every frame while the
 * visitor scrolls, and at about 30 fps for the idle turn.
 */
export function startSun(canvas: HTMLCanvasElement, options: SunOptions): () => void {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
  });
  if (!gl) {
    options.onFail();
    return () => {};
  }

  const program = gl.createProgram();
  try {
    const shaders = [
      compile(gl, gl.VERTEX_SHADER, VERTEX),
      compile(gl, gl.FRAGMENT_SHADER, FRAGMENT),
    ];
    for (const shader of shaders) gl.attachShader(program, shader);
    gl.linkProgram(program);
    for (const shader of shaders) gl.deleteShader(shader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link failed');
  } catch {
    gl.deleteProgram(program);
    options.onFail();
    return () => {};
  }

  const quad = gl.createBuffer();
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    time: uniform('uTime'),
    spin: uniform('uSpin'),
    radius: uniform('uRadius'),
    px: uniform('uPx'),
    sunset: uniform('uSunset'),
    tint: uniform('uTint'),
    toBlue: uniform('uToBlue'),
    corona: uniform('uCorona'),
    purple: uniform('uPurple'),
    blue: uniform('uBlue'),
  };
  gl.useProgram(program);
  gl.uniform3fv(u.purple, linearRgb(BRAND_FILLS.back));
  gl.uniform3fv(u.blue, linearRgb(BRAND_FILLS.front));
  gl.clearColor(0, 0, 0, 0);

  let disposed = false;
  let frameId = 0;
  let lastDraw = 0;
  let lastProgress = -1;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const size = Math.max(1, Math.round(canvas.clientWidth * dpr));
    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }
    gl.viewport(0, 0, size, size);
    gl.uniform1f(u.px, 2 / size);
    gl.uniform1f(u.radius, options.discShare());
    lastProgress = -1;
  };

  const draw = (progress: number, seconds: number) => {
    gl.uniform1f(u.time, seconds);
    // About a turn a minute, a little faster as the visitor scrolls.
    gl.uniform1f(u.spin, seconds * 0.1 + progress * 0.9);
    gl.uniform1f(u.sunset, ease(SUNSET, progress));
    gl.uniform1f(u.tint, ease(TINT, progress));
    gl.uniform1f(u.toBlue, ease(TO_BLUE, progress));
    gl.uniform1f(u.corona, 1 - ease(CORONA_OUT, progress));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const frame = (now: number) => {
    frameId = 0;
    const progress = clamp01(options.progress());
    if (progress !== lastProgress || now - lastDraw >= IDLE_FRAME_MS) {
      draw(progress, now / 1000);
      lastDraw = now;
      lastProgress = progress;
    }
    if (progress < 1) schedule();
  };

  const schedule = () => {
    if (!frameId && !disposed) frameId = requestAnimationFrame(frame);
  };

  const observer = new ResizeObserver(() => {
    resize();
    schedule();
  });

  const stop = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    gl.deleteBuffer(quad);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
  };

  function onContextLost(event: Event) {
    event.preventDefault();
    stop();
    options.onFail();
  }

  resize();
  observer.observe(canvas);
  window.addEventListener('scroll', schedule, { passive: true });
  canvas.addEventListener('webglcontextlost', onContextLost);

  draw(clamp01(options.progress()), performance.now() / 1000);
  options.onReady();
  schedule();

  return stop;
}
