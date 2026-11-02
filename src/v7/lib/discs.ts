/*
 * The page's 3D: glossy discs, pucks and frosted plates drifting in a studio,
 * in the mark's pink and blue. One small three.js scene per canvas, built from
 * a preset; each renders only while its canvas is on screen.
 */

type Three = typeof import('three');

export type DiscPreset = 'hero' | 'film' | 'fall' | 'oval';

export type DiscStage = {
  dispose: () => void;
  /** Freeze or resume the motion (the film's pause button). */
  setPlaying: (on: boolean) => void;
  /** Scroll progress through the block, 0 to 1; only the falling set uses it. */
  setProgress: (p: number) => void;
};

type Piece = {
  /** Radius; for a ring, the radius of its centre line. */
  r: number;
  /** Thickness; for a ring, the radius of its tube. */
  t: number;
  color: string;
  /** Frosted and see-through rather than solid. */
  glass?: boolean;
  ring?: boolean;
  /** The mark in 3D: a pink striped disc with a blue one laid over its right side. */
  logo?: boolean;
  pos: [number, number, number];
  /** Degrees. A disc lies flat at zero, so 90 on x turns it to face the camera. */
  rot: [number, number, number];
};

type Setup = {
  fov: number;
  z: number;
  /** Centre, middle and edge of the backdrop; null leaves the canvas transparent. */
  bg: [string, string, string] | null;
  glow?: string;
  pieces: Piece[];
};

const PINK = '#DC74EC';
const PINK_LIGHT = '#F2B8F6';
const PINK_DEEP = '#C04BDB';
const BLUE = '#1E69F6';
const BLUE_LIGHT = '#6E9DFF';
const FROST = '#C9B6FF';

const SETUPS: Record<DiscPreset, Setup> = {
  // A wide still life: a huge frosted plate, a long pink blade across the middle,
  // the mark's two discs, a fat blue coin on the left.
  hero: {
    fov: 35,
    z: 10,
    bg: ['#5B82FF', '#2453E0', '#0B1F78'],
    glow: 'rgba(220, 116, 236, 0.55)',
    pieces: [
      { r: 4.4, t: 0.14, color: FROST, glass: true, pos: [4.7, 0.1, -2.6], rot: [72, 8, 24] },
      { r: 2.9, t: 0.09, color: PINK_DEEP, pos: [-0.5, 0.95, 0], rot: [7, 0, 27] },
      { r: 1.2, t: 0.22, color: PINK, logo: true, pos: [1.35, 0.35, 0.8], rot: [76, -12, -10] },
      { r: 1.4, t: 0.42, color: BLUE_LIGHT, pos: [-4.7, -1.35, 0.4], rot: [78, 32, 12] },
      { r: 2.6, t: 0.09, color: BLUE_LIGHT, glass: true, pos: [-5.5, 1.25, -1.3], rot: [8, 0, 21] },
      { r: 2.9, t: 0.11, color: FROST, glass: true, pos: [0.4, -2.75, -0.5], rot: [62, 0, -36] },
    ],
  },
  // The close-up the film card plays: the mark sitting in a deep pink ring.
  film: {
    fov: 40,
    z: 7.4,
    bg: ['#8A4BE8', '#4A2EC2', '#160B5C'],
    glow: 'rgba(242, 184, 246, 0.5)',
    pieces: [
      { r: 2.1, t: 0.5, color: PINK_DEEP, ring: true, pos: [-0.4, 0.1, -0.6], rot: [72, 0, 18] },
      { r: 0.95, t: 0.22, color: PINK, logo: true, pos: [-0.35, 0.05, 0.2], rot: [78, 10, 8] },
      { r: 3.6, t: 0.16, color: FROST, glass: true, pos: [3.4, -0.6, -1.6], rot: [60, -10, -40] },
      { r: 3.2, t: 0.1, color: PINK, pos: [-3.8, 2.6, -2.2], rot: [20, 0, 35] },
    ],
  },
  // Pieces that tumble across the pink-to-white seam as the page scrolls.
  fall: {
    fov: 35,
    z: 10,
    bg: null,
    pieces: [
      { r: 1.9, t: 0.16, color: PINK_LIGHT, glass: true, pos: [1.7, 0.5, -0.5], rot: [64, 10, 32] },
      { r: 1.0, t: 0.22, color: PINK, logo: true, pos: [2.6, -0.3, 0.8], rot: [64, -16, -24] },
      { r: 2.4, t: 0.1, color: BLUE_LIGHT, glass: true, pos: [3.6, -1.3, -1.4], rot: [12, 0, 30] },
      { r: 0.7, t: 0.2, color: PINK_DEEP, pos: [2.9, -2.4, 0.4], rot: [24, 0, -64] },
      { r: 0.42, t: 0.28, color: BLUE, pos: [4.8, 1.4, 0.2], rot: [50, 30, 10] },
    ],
  },
  // The closing card's tall window: the mark up top, a frosted plate and a puck below.
  oval: {
    fov: 34,
    z: 9.5,
    bg: ['#6C8FFF', '#2B5BE8', '#1238A8'],
    glow: 'rgba(220, 116, 236, 0.5)',
    pieces: [
      { r: 1.05, t: 0.22, color: PINK, logo: true, pos: [0, 1.05, 0.4], rot: [76, 0, -6] },
      { r: 2.1, t: 0.12, color: FROST, glass: true, pos: [0.3, -1.4, -0.6], rot: [70, 10, 18] },
      { r: 2.2, t: 0.09, color: PINK_LIGHT, pos: [-1.7, 2.7, -1.2], rot: [10, 0, 38] },
      { r: 0.55, t: 0.34, color: PINK_LIGHT, pos: [1.25, -0.4, 0.9], rot: [56, 36, 6] },
      { r: 0.4, t: 0.26, color: BLUE, pos: [-1.2, -2.6, 0.6], rot: [40, -20, 10] },
    ],
  },
};

const rad = (d: number) => (d * Math.PI) / 180;

/** A disc with a rounded rim, turned on a lathe; it lies flat in the XZ plane. */
function discGeometry(T: Three, r: number, t: number) {
  const e = t / 2;
  const pts = [new T.Vector2(0, e), new T.Vector2(r - e, e)];
  for (let i = 1; i < 12; i++) {
    const a = Math.PI / 2 - (i / 12) * Math.PI;
    pts.push(new T.Vector2(r - e + Math.cos(a) * e, Math.sin(a) * e));
  }
  pts.push(new T.Vector2(r - e, -e), new T.Vector2(0, -e));
  return new T.LatheGeometry(pts, 112);
}

/** The mark's stripes for a face: pink bands on a pale pink ground, as the logo draws them. */
function stripes() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d')!;
  g.fillStyle = '#FBE3FD';
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = PINK;
  // The mark's pattern: a 4-unit band every 6.5 units across a 34-unit circle.
  const period = (6.5 / 34) * 512;
  const band = (4 / 34) * 512;
  for (let y = (0.5 / 34) * 512; y < 512; y += period) g.fillRect(0, y, 512, band);
  return c;
}

/**
 * One disc of the mark with a rounded rim: a torus for the rim and a flat
 * circle on each side, so the faces take a texture the right way up. It lies
 * flat in the XZ plane, like the lathe discs.
 */
function markDisc(T: Three, r: number, t: number, face: InstanceType<Three['Material']>, rim: InstanceType<Three['Material']>, keep: (d: { dispose: () => void }) => void) {
  const e = t / 2;
  const g = new T.Group();
  const rimGeo = new T.TorusGeometry(r - e, e, 24, 128);
  const faceGeo = new T.CircleGeometry(r - e, 128);
  keep(rimGeo);
  keep(faceGeo);
  const edge = new T.Mesh(rimGeo, rim);
  edge.rotation.x = Math.PI / 2;
  g.add(edge);
  for (const side of [1, -1]) {
    const f = new T.Mesh(faceGeo, face);
    f.rotation.x = -side * (Math.PI / 2);
    f.position.y = side * e;
    g.add(f);
  }
  return g;
}

/** The backdrop: a soft radial gradient with a warm glow in one corner. */
function backdrop(bg: [string, string, string], glow: string | undefined) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d')!;
  const base = g.createRadialGradient(230, 260, 10, 256, 256, 420);
  base.addColorStop(0, bg[0]);
  base.addColorStop(0.55, bg[1]);
  base.addColorStop(1, bg[2]);
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  if (glow) {
    const hot = g.createRadialGradient(400, 90, 0, 400, 90, 300);
    hot.addColorStop(0, glow);
    hot.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = hot;
    g.fillRect(0, 0, 512, 512);
  }
  return c;
}

export async function mountDiscs(canvas: HTMLCanvasElement, preset: DiscPreset): Promise<DiscStage> {
  const T = await import('three');
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
  const setup = SETUPS[preset];
  const opaque = setup.bg !== null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: !opaque, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  if (!opaque) renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const pmrem = new T.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  // Just enough studio in the gloss; more turns every colour to pastel.
  scene.environmentIntensity = 0.38;
  pmrem.dispose();

  let bgTex: InstanceType<Three['CanvasTexture']> | null = null;
  if (setup.bg) {
    bgTex = new T.CanvasTexture(backdrop(setup.bg, setup.glow));
    bgTex.colorSpace = T.SRGBColorSpace;
    scene.background = bgTex;
  }

  scene.add(new T.AmbientLight(0xffffff, 0.25));
  const key = new T.DirectionalLight(0xffffff, 1.9);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new T.DirectionalLight(0xf2b8f6, 0.9);
  rim.position.set(-6, -2, -4);
  scene.add(rim);

  const camera = new T.PerspectiveCamera(setup.fov, 1, 0.1, 100);
  camera.position.set(0, 0, setup.z);

  const group = new T.Group();
  scene.add(group);

  const disposables: { dispose: () => void }[] = [];
  const keep = (d: { dispose: () => void }) => disposables.push(d);
  const glossy = (opts: ConstructorParameters<Three['MeshPhysicalMaterial']>[0]) => {
    const m = new T.MeshPhysicalMaterial({ roughness: 0.38, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.18, ...opts });
    keep(m);
    return m;
  };
  let stripeTex: InstanceType<Three['CanvasTexture']> | null = null;

  const meshes = setup.pieces.map((p) => {
    if (p.logo) {
      if (!stripeTex) {
        stripeTex = new T.CanvasTexture(stripes());
        stripeTex.colorSpace = T.SRGBColorSpace;
        stripeTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        keep(stripeTex);
      }
      // The pink disc on the left, the blue one over its right side, as in the mark.
      const pair = new T.Group();
      const pink = markDisc(T, p.r, p.t, glossy({ map: stripeTex }), glossy({ color: PINK }), keep);
      pink.position.x = -0.47 * p.r;
      const blue = markDisc(T, p.r, p.t, glossy({ color: BLUE }), glossy({ color: BLUE }), keep);
      blue.position.set(0.47 * p.r, p.t * 1.15, 0);
      pair.add(pink, blue);
      pair.position.set(...p.pos);
      pair.rotation.set(rad(p.rot[0]), rad(p.rot[1]), rad(p.rot[2]));
      group.add(pair);
      return { mesh: pair, base: p };
    }
    const geo = p.ring ? new T.TorusGeometry(p.r, p.t, 48, 160) : discGeometry(T, p.r, p.t);
    const mat = p.glass
      ? opaque
        ? new T.MeshPhysicalMaterial({
            color: p.color,
            transmission: 1,
            thickness: 1.1,
            roughness: 0.14,
            ior: 1.4,
            attenuationColor: new T.Color(p.color),
            attenuationDistance: 1.1,
            clearcoat: 0.6,
            clearcoatRoughness: 0.3,
          })
        : new T.MeshPhysicalMaterial({
            color: p.color,
            transparent: true,
            opacity: 0.5,
            roughness: 0.3,
            clearcoat: 1,
            clearcoatRoughness: 0.2,
            depthWrite: false,
          })
      : new T.MeshPhysicalMaterial({
          color: p.color,
          roughness: 0.42,
          metalness: 0,
          clearcoat: 0.45,
          clearcoatRoughness: 0.25,
        });
    disposables.push(geo, mat);
    const mesh = new T.Mesh(geo, mat);
    mesh.position.set(...p.pos);
    mesh.rotation.set(rad(p.rot[0]), rad(p.rot[1]), rad(p.rot[2]));
    group.add(mesh);
    return { mesh, base: p };
  });

  /* ---- Size, pointer, visibility ---------------------------------------- */

  const host = canvas.parentElement ?? canvas;
  const resize = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  const onMove = (e: PointerEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
  });
  io.observe(canvas);

  /* ---- Loop --------------------------------------------------------------- */

  let playing = true;
  let progress = 0;
  let time = 0;
  let last = performance.now();
  let frame = 0;

  const render = () => {
    const live = reduced ? 0 : 1;
    mouse.sx += (mouse.x * live - mouse.sx) * 0.04;
    mouse.sy += (mouse.y * live - mouse.sy) * 0.04;

    meshes.forEach(({ mesh, base }, i) => {
      const drift = Math.sin(time * 0.35 + i * 1.7);
      mesh.position.y = base.pos[1] + drift * 0.14;
      mesh.rotation.x = rad(base.rot[0]) + Math.sin(time * 0.22 + i) * 0.08 + (preset === 'fall' ? progress * 0.9 : 0);
      mesh.rotation.z = rad(base.rot[2]) + Math.cos(time * 0.18 + i * 0.6) * 0.06;
    });

    if (preset === 'film') {
      const a = time * 0.12;
      camera.position.set(Math.sin(a) * 1.4 + mouse.sx * 0.3, Math.sin(a * 0.7) * 0.5 + mouse.sy * 0.2, setup.z + Math.cos(a) * 0.4);
      group.rotation.z = time * 0.04;
    } else {
      camera.position.set(mouse.sx * 0.35, mouse.sy * 0.22, setup.z);
    }
    if (preset === 'fall') {
      group.position.y = 3.6 - progress * 7.2;
      group.rotation.z = -0.25 + progress * 0.5;
    }
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };

  function tick() {
    frame = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!visible || document.hidden) return;
    if (playing && !reduced) time += dt;
    render();
  }
  render();
  tick();

  return {
    setPlaying: (on) => {
      playing = on;
    },
    setProgress: (p) => {
      progress = Math.min(1, Math.max(0, p));
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      disposables.forEach((d) => d.dispose());
      bgTex?.dispose();
      envRT.dispose();
      renderer.dispose();
    },
  };
}
