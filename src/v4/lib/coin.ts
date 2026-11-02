import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * The hero coin, live: matte black with a chrome rim and the mark in chrome
 * relief — the same piece `tools/v4-icons` renders to `public/v4/coin.webp`,
 * which stands in until this has drawn. It sways on its own, leans toward the
 * pointer and turns a little further as the page scrolls.
 */

const black = () => new THREE.MeshPhysicalMaterial({ color: '#141418', roughness: 0.5, metalness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.35 });
const chrome = () => new THREE.MeshPhysicalMaterial({ color: '#dfe1e8', roughness: 0.16, metalness: 1, envMapIntensity: 1.25 });

function coin(): THREE.Group {
  const g = new THREE.Group();
  const r = 1.7;
  const depth = 0.36;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, depth, 128), black());
  body.rotation.x = Math.PI / 2;
  g.add(body);
  for (const side of [1, -1]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.9, depth * 0.24, 24, 128), black());
    ring.position.z = (side * depth) / 2;
    g.add(ring);
  }
  const inner = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.035, 16, 160), chrome());
  inner.position.z = 0.2;
  g.add(inner);

  // The mark: the left circle in horizontal stripes, the right solid and on top.
  const mr = 0.86;
  const mat = chrome();
  const d = (16 / 17) * mr;
  const left = -d / 2;
  const period = (6.5 / 17) * mr;
  const bar = (4 / 17) * mr;
  for (let y0 = -mr; y0 < mr; y0 += period) {
    const y1 = Math.min(y0 + bar, mr);
    if (y1 <= y0) continue;
    const pts: [number, number][] = [];
    for (let i = 0; i <= 24; i++) {
      const y = y0 + ((y1 - y0) * i) / 24;
      pts.push([Math.sqrt(Math.max(mr * mr - y * y, 0)), y]);
    }
    const shape = new THREE.Shape();
    shape.moveTo(left - pts[0]![0], pts[0]![1]);
    pts.forEach(([x, y]) => shape.lineTo(left + x, y));
    pts.toReversed().forEach(([x, y]) => shape.lineTo(left - x, y));
    const stripe = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3 }), mat);
    stripe.position.z = 0.18;
    g.add(stripe);
  }
  const disc = new THREE.Shape();
  disc.absarc(d / 2, 0, mr, 0, Math.PI * 2);
  const solid = new THREE.Mesh(
    new THREE.ExtrudeGeometry(disc, { depth: 0.09, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 4, curveSegments: 96 }),
    mat,
  );
  solid.position.z = 0.18;
  g.add(solid);
  return g;
}

/** Start the coin on a canvas; returns a stop function, or null without WebGL. */
export function startCoin(canvas: HTMLCanvasElement, reduced: boolean): (() => void) | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
  camera.position.set(0, 0, 10.5);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 6, 6);
  const fill = new THREE.DirectionalLight(0xe6e2ff, 0.6);
  fill.position.set(5, -3, 4);
  const rim = new THREE.DirectionalLight(0xffffff, 1.6);
  rim.position.set(3, 4, -6);
  scene.add(key, fill, rim, new THREE.AmbientLight(0xffffff, 0.15));

  const piece = coin();
  scene.add(piece);

  const size = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  };
  size();
  window.addEventListener('resize', size);

  const aim = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    aim.x = (e.clientX / window.innerWidth - 0.5) * 2;
    aim.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e?.isIntersecting ?? true;
  });
  io.observe(canvas);

  const lean = { x: 0, y: 0 };
  const start = performance.now();
  let raf = 0;
  let drawn = false;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const t = reduced ? 0 : (now - start) / 1000;
    lean.x += (aim.x - lean.x) * 0.05;
    lean.y += (aim.y - lean.y) * 0.05;
    const scrolled = Math.min(window.scrollY / window.innerHeight, 1.5);
    piece.rotation.y = 0.26 + Math.sin(t * 0.5) * 0.12 + lean.x * 0.18 + scrolled * 0.6;
    piece.rotation.x = -0.1 + Math.sin(t * 0.37) * 0.05 + lean.y * 0.12;
    piece.rotation.z = 0.06 + Math.sin(t * 0.3) * 0.03;
    renderer.render(scene, camera);
    if (!drawn) {
      drawn = true;
      canvas.classList.add('is-live');
    }
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('resize', size);
    window.removeEventListener('pointermove', onMove);
    canvas.classList.remove('is-live');
    pmrem.dispose();
    renderer.dispose();
  };
}
