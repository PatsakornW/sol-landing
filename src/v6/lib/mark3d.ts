/**
 * The brand mark in the round: a striped purple orb behind a glossy blue one,
 * lit like candy. Mounted into a host element; `three` arrives in its own
 * chunk. The caller feeds it a scroll progress (0..1) to turn it, and the
 * pointer leans it.
 */

type Three = typeof import('three');

const clampN = (v: number, a: number) => Math.max(-a, Math.min(a, v));

export type MarkHandle = {
  /** 0..1 scroll progress through a section; the mark turns with it. */
  setProgress: (p: number) => void;
  dispose: () => void;
};

export async function mountMark(host: HTMLElement, opts: { spin?: number; idle?: boolean; jelly?: boolean } = {}): Promise<MarkHandle> {
  const T: Three = await import('three');
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const spinTurns = opts.spin ?? 0;

  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = T.SRGBColorSpace;
  Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  const pmrem = new T.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = env.texture;
  pmrem.dispose();

  const camera = new T.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  const key = new T.DirectionalLight(0xffffff, 2.2);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const fill = new T.DirectionalLight(0xdcd4ff, 0.8);
  fill.position.set(5, -2, 4);
  scene.add(fill);
  const rim = new T.DirectionalLight(0xffffff, 1.2);
  rim.position.set(2, 4, -6);
  scene.add(rim);
  scene.add(new T.AmbientLight(0xffffff, 0.25));

  const candy = (color: string, extra: Record<string, unknown> = {}) =>
    new T.MeshPhysicalMaterial({ color, roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.9, ...extra });

  // Jelly: a ripple along each surface's normal, its height driven from JS.
  const wobble = { uTime: { value: 0 }, uAmp: { value: 0 }, uDir: { value: new T.Vector3(1, 0.4, 0.2).normalize() } };
  const jellify = (m: InstanceType<Three['MeshPhysicalMaterial']>) => {
    if (!opts.jelly) return;
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, wobble);
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
uniform float uTime;
uniform float uAmp;
uniform vec3 uDir;`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
float jw = sin(dot(position, uDir) * 3.4 - uTime * 11.0) * 0.6 + sin(position.y * 5.0 + uTime * 8.0) * 0.4;
transformed += normal * jw * uAmp;`,
        );
    };
  };

  const group = new T.Group();
  const r = 1;
  const blueMat = candy('#1E69F6');
  jellify(blueMat);
  const blue = new T.Mesh(new T.SphereGeometry(r, 96, 96), blueMat);
  blue.position.set(0.5, 0, 0.35);
  group.add(blue);

  // The stripes: an alpha map with five horizontal cuts, in the mark's rows.
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 512;
  const g = c.getContext('2d')!;
  g.fillStyle = '#fff';
  g.fillRect(0, 0, 64, 512);
  g.fillStyle = '#000';
  for (const y of [18, 25, 32, 39, 46]) g.fillRect(0, ((y - 13) / 38) * 512, 64, (2.25 / 38) * 512);
  const alpha = new T.CanvasTexture(c);
  const purpleMat = candy('#DC74EC', { alphaMap: alpha, transparent: true, alphaTest: 0.5, side: T.DoubleSide });
  jellify(purpleMat);
  const purple = new T.Mesh(new T.SphereGeometry(r, 96, 96), purpleMat);
  purple.position.set(-0.5, 0, -0.35);
  group.add(purple);
  scene.add(group);

  const fit = () => {
    const rect = host.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const visibleH = camera.position.z * Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    const visibleW = visibleH * camera.aspect;
    // The pair spans about 3 units wide and 2 tall.
    const s = Math.min(visibleW / 3.2, visibleH / 2.2);
    baseScale = s;
    group.scale.setScalar(s);
    render();
  };
  let baseScale = 1;
  const render = () => renderer.render(scene, camera);
  const ro = new ResizeObserver(fit);
  ro.observe(host);

  let progress = 0;
  let tx = 0;
  let ty = 0;
  let mx = 0;
  let my = 0;
  let pdx = 0;
  let pdy = 0;
  let lastX: number | null = null;
  let lastY: number | null = null;
  const onMove = (e: MouseEvent) => {
    tx = (e.clientX / window.innerWidth) * 2 - 1;
    ty = (e.clientY / window.innerHeight) * 2 - 1;
    if (lastX !== null && lastY !== null) {
      pdx += e.clientX - lastX;
      pdy += e.clientY - lastY;
    }
    lastX = e.clientX;
    lastY = e.clientY;
  };
  if (fine) window.addEventListener('mousemove', onMove, { passive: true });

  const clock = new T.Clock();
  let frame = 0;
  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
    if (visible && !frame) frame = requestAnimationFrame(loop);
  });
  io.observe(host);

  // The jelly springs: `amp` is the ripple height, `sq` the squash (+ tall, - flat).
  let amp = 0;
  let ampV = 0;
  let sq = 0;
  let sqV = 0;
  let lastT = 0;
  let lastTop: number | null = null;
  let lastScroll = window.scrollY;
  function jiggle(t: number) {
    const dt = Math.min(0.05, Math.max(0.001, t - lastT));
    lastT = t;
    const top = host.getBoundingClientRect().top;
    const vy = lastTop === null ? 0 : (top - lastTop) / dt;
    lastTop = top;
    const sy = window.scrollY;
    const vs = (sy - lastScroll) / dt;
    lastScroll = sy;
    const pv = Math.hypot(pdx, pdy) / dt;
    if (pv > 1) wobble.uDir.value.set(pdx, -pdy, 0.35).normalize();
    pdx = 0;
    pdy = 0;
    // Rising stretches it, the stop flattens it, and the spring does the rest.
    const sqTarget = clampN(-vy * 0.00009, 0.22);
    sqV += (190 * (sqTarget - sq) - 7 * sqV) * dt;
    sq += sqV * dt;
    const ampTarget = Math.min(0.13, pv * 0.00005 + Math.abs(vs) * 0.00004 + Math.abs(vy) * 0.00003);
    ampV += (110 * (ampTarget - amp) - 6 * ampV) * dt;
    amp += ampV * dt;
    wobble.uTime.value = t;
    wobble.uAmp.value = amp;
    group.scale.set(baseScale * (1 - sq * 0.55), baseScale * (1 + sq), baseScale * (1 - sq * 0.55));
  }

  function pose(t: number) {
    if (opts.jelly && !reduced) jiggle(t);
    mx += (tx - mx) * 0.06;
    my += (ty - my) * 0.06;
    const idle = opts.idle === false || reduced ? 0 : 1;
    group.rotation.y = -0.35 + mx * 0.5 + Math.sin(t * 0.6) * 0.12 * idle + progress * Math.PI * 2 * spinTurns;
    group.rotation.x = 0.18 + my * 0.3 + Math.cos(t * 0.5) * 0.08 * idle;
    group.position.y = Math.sin(t * 0.9) * 0.06 * idle;
  }
  function loop() {
    frame = 0;
    if (!visible) return;
    frame = requestAnimationFrame(loop);
    pose(clock.getElapsedTime());
    render();
  }
  fit();
  if (reduced) {
    pose(0);
    render();
  } else {
    frame = requestAnimationFrame(loop);
  }

  return {
    setProgress: (p) => {
      progress = p;
      if (reduced) {
        pose(0);
        render();
      }
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      blue.geometry.dispose();
      purple.geometry.dispose();
      blueMat.dispose();
      purpleMat.dispose();
      alpha.dispose();
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
