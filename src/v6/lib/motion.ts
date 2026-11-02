import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };

/** The page's one easing: an overshoot in and out, the way a sticker lands. */
export const BOUNCE = 'back.inOut(2.2)';

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/* ------------------------------------------------------------------------ */
/* The preloader's timing, shared with every entrance that waits for it.    */

const SEEN_KEY = 'v6-preloader-seen';

export type PreloaderPlan = { from: number; hold: number };

/**
 * How long the curtain stays and where its counter starts. A first visit
 * counts from zero and holds; a return in the same session counts from the
 * middle and leaves sooner.
 */
export function preloaderPlan(): PreloaderPlan {
  const seen = sessionStorage.getItem(SEEN_KEY) === '1';
  sessionStorage.setItem(SEEN_KEY, '1');
  return seen ? { from: 53, hold: 1.3 } : { from: 0, hold: 2.1 };
}

/** Set by the preloader when it mounts; the reveals read it. */
export const intro = { delay: 0 };

/** The curtain delay applies to what is on screen when it lifts, not below. */
function introDelayFor(el: Element) {
  return el.getBoundingClientRect().top < window.innerHeight ? intro.delay : 0;
}

/* ------------------------------------------------------------------------ */
/* Reveals: `[data-reveal]` elements, hidden by the stylesheet until here.  */

type Kind = 'chars' | 'words' | 'lines' | 'up' | 'image' | 'scale' | 'slide-rotate';

function parseMove(s: string | undefined, fallback: string) {
  const v = (s ?? fallback).trim();
  if (v.endsWith('%')) return { prop: 'yPercent', value: parseFloat(v) } as const;
  return { prop: 'y', value: v } as const;
}

/* ------------------------------------------------------------------------ */
/* Gradient type that survives a split: each piece paints its own slice of  */
/* the parent's gradient, sized to the parent and offset to where it sits. */

const painted = new Map<HTMLElement, HTMLElement[]>();
let repaintBound = false;

function paintGradient(el: HTMLElement, units: HTMLElement[]) {
  const bg = getComputedStyle(el).backgroundImage;
  if (!bg || bg === 'none') return;
  const box = el.getBoundingClientRect();
  for (const unit of units) {
    // The mask around a letter is never moved, so it says where the letter rests.
    const at = (unit.parentElement && unit.parentElement !== el ? unit.parentElement : unit).getBoundingClientRect();
    Object.assign(unit.style, {
      backgroundImage: bg,
      backgroundSize: `${box.width}px ${box.height}px`,
      backgroundPosition: `${box.left - at.left}px ${box.top - at.top}px`,
      backgroundRepeat: 'no-repeat',
      backgroundClip: 'text',
      webkitBackgroundClip: 'text',
      webkitTextFillColor: 'transparent',
      color: 'transparent',
    });
  }
  painted.set(el, units);
  if (!repaintBound) {
    repaintBound = true;
    let t = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => painted.forEach((u, host) => (host.isConnected ? paintGradient(host, u) : painted.delete(host))), 150);
    });
  }
}

function splitReveal(el: HTMLElement) {
  const kind = el.dataset.reveal as 'chars' | 'words' | 'lines';
  const duration = parseFloat(el.dataset.duration ?? '') || 0.6;
  const delay = parseFloat(el.dataset.delay ?? '') || 0;
  const amount = parseFloat(el.dataset.stagger ?? '');
  const move = parseMove(el.dataset.move, '110%');
  const split = new SplitText(el, {
    type: kind === 'chars' ? 'words,chars' : kind,
    mask: kind,
    linesClass: 'v6-line',
  });
  const units = kind === 'chars' ? split.chars : kind === 'lines' ? split.lines : split.words;
  if (el.dataset.gradient !== undefined) paintGradient(el, units as HTMLElement[]);
  gsap.from(units, {
    [move.prop]: move.value,
    duration,
    ease: el.dataset.ease ?? BOUNCE,
    delay: introDelayFor(el) + delay,
    stagger: { amount: Number.isNaN(amount) ? 0.25 : amount },
    scrollTrigger: { trigger: el, start: 'top bottom', once: true },
    onStart: () => {
      el.style.visibility = 'visible';
    },
  });
  return split;
}

function fadeReveal(elements: HTMLElement[], settings: HTMLElement) {
  const kind = settings.dataset.reveal as Kind;
  const duration = parseFloat(settings.dataset.duration ?? '') || (kind === 'scale' ? 0.7 : 0.8);
  const delay = parseFloat(settings.dataset.delay ?? '') || 0;
  const amount = parseFloat(settings.dataset.stagger ?? '');
  const ease = settings.dataset.ease ?? BOUNCE;
  const onLoad = settings.dataset.trigger === 'load';

  gsap.set(elements, { visibility: 'visible' });
  const from: gsap.TweenVars = {};
  if (kind === 'slide-rotate') {
    from.xPercent = 100;
    from.rotate = 0;
  } else if (kind === 'scale') {
    from.scale = parseFloat(settings.dataset.scale ?? '') || 0;
    from.opacity = parseFloat(settings.dataset.opacity ?? '') || 0;
  } else {
    const move = parseMove(settings.dataset.move, kind === 'image' ? '120vh' : '160%');
    from[move.prop] = move.value;
    const rotate = settings.dataset.rotate;
    from.rotate = rotate === undefined ? (kind === 'image' ? 0 : 14) : parseFloat(rotate);
  }
  const to: gsap.TweenVars = {
    duration,
    ease,
    delay: introDelayFor(settings) + delay,
    stagger: { amount: Number.isNaN(amount) ? 0.4 : amount },
  };
  if (kind === 'slide-rotate') {
    to.xPercent = 0;
    to.rotate = parseFloat(settings.dataset.rotate ?? '') || -4;
  }
  if (!onLoad) to.scrollTrigger = { trigger: elements[0] ?? settings, start: 'top bottom', once: true };
  if (kind === 'slide-rotate') gsap.fromTo(elements, from, to);
  else gsap.from(elements, { ...from, ...to });
}

/**
 * Bring in every `[data-reveal]` under `scope`. Split kinds (`chars`, `words`,
 * `lines`) rise through a mask; the others slide, drop or pop in. Elements
 * sharing a `data-group` stagger as one. Returns the splits for reverting.
 */
export function reveals(scope: ParentNode): SplitText[] {
  const splits: SplitText[] = [];
  const groups = new Map<string, HTMLElement[]>();
  const singles: HTMLElement[] = [];
  scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const kind = el.dataset.reveal;
    if (kind === 'chars' || kind === 'words' || kind === 'lines') {
      splits.push(splitReveal(el));
      return;
    }
    const group = el.dataset.group;
    if (group) {
      const list = groups.get(group);
      if (list) list.push(el);
      else groups.set(group, [el]);
    } else {
      singles.push(el);
    }
  });
  groups.forEach((list) => list[0] && fadeReveal(list, list[0]));
  singles.forEach((el) => fadeReveal([el], el));
  return splits;
}

/* ------------------------------------------------------------------------ */
/* Magnetic: `[data-magnetic]` zones pull their target toward the pointer.  */

export function magnetic(scope: ParentNode): () => void {
  if (!finePointer()) return () => {};
  const offs: (() => void)[] = [];
  scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((zone) => {
    const strength = parseFloat(zone.dataset.magnetic ?? '') || 0.4;
    const sel = zone.dataset.magneticTarget;
    const target = sel ? zone.querySelector<HTMLElement>(sel) : zone;
    if (!target) return;
    const move = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect();
      const x = gsap.utils.mapRange(r.left, r.right, -r.width / 2, r.width / 2, e.clientX);
      const y = gsap.utils.mapRange(r.top, r.bottom, -r.height / 2, r.height / 2, e.clientY);
      gsap.to(target, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power2.out', overwrite: true });
    };
    const leave = () => gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: true });
    zone.addEventListener('mousemove', move);
    zone.addEventListener('mouseleave', leave);
    offs.push(() => {
      zone.removeEventListener('mousemove', move);
      zone.removeEventListener('mouseleave', leave);
    });
  });
  return () => offs.forEach((off) => off());
}

/* ------------------------------------------------------------------------ */
/* Scenes: `[data-scene]` holds pieces that float, lean with the pointer and */
/* shy away from it. Each `img[data-layer]` has a depth from 0 to 1.        */

export function scenes(scope: ParentNode): () => void {
  const stops: (() => void)[] = [];
  scope.querySelectorAll<HTMLElement>('[data-scene]').forEach((scene) => stops.push(runScene(scene)));
  return () => stops.forEach((stop) => stop());
}

function runScene(scene: HTMLElement): () => void {
  const cfg = (key: string, fallback: number) => {
    const v = scene.dataset[key];
    return v === undefined ? fallback : parseFloat(v);
  };
  const items = Array.from(scene.querySelectorAll<HTMLElement>('[data-layer]')).map((el) => ({
    el,
    layer: parseFloat(el.dataset.layer ?? '0.5'),
    rot: parseFloat(el.dataset.rot ?? '0'),
    phX: Math.random() * Math.PI * 2,
    phY: Math.random() * Math.PI * 2,
    phS: Math.random() * Math.PI * 2,
    phR: Math.random() * Math.PI * 2,
    pxK: 0.85 + Math.random() * 0.3,
    pyK: 0.85 + Math.random() * 0.3,
    fqK: 0.75 + Math.random() * 0.55,
    repX: 0,
    repY: 0,
    pop: 0,
    popV: 0,
    near: false,
  }));
  if (items.length === 0) return () => {};
  const still = reducedMotion();
  const fine = finePointer();

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let mouseX = -9999;
  let mouseY = -9999;
  let last: number | null = null;
  let elapsed = 0;
  let visible = true;
  let raf = 0;

  const onMove = (e: MouseEvent) => {
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  const onLeave = () => {
    targetX = 0;
    targetY = 0;
    mouseX = -9999;
    mouseY = -9999;
  };
  if (fine) {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
  }
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  });
  io.observe(scene);

  function tick(now: number) {
    raf = 0;
    if (!visible) return;
    raf = requestAnimationFrame(tick);
    if (last === null) last = now;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;

    const lerp = cfg('lerp', 5.5) / 100;
    currentX += (targetX - currentX) * lerp;
    currentY += (targetY - currentY) * lerp;
    const parallax = cfg('parallax', 60);
    const rotStr = cfg('rot', 3.5);
    const floatY = still ? 0 : cfg('floatY', 10);
    const floatX = still ? 0 : cfg('floatX', 8);
    const breath = cfg('breath', 1.3) / 100;
    const speed = cfg('speed', 12) * 0.025;
    const frot = still ? 0 : cfg('floatRot', 4);
    const repR = cfg('repulse', 260);
    const repS = cfg('repulseStrength', 34);
    const repL = cfg('repulseLerp', 3.5) / 100;
    const bounce = scene.dataset.bounce !== undefined && !still;

    for (const it of items) {
      const ft = elapsed * speed * it.fqK;
      const fY = Math.sin(ft + it.phY) * floatY;
      const fX = Math.sin(ft * 0.6 + it.phX) * floatX;
      const sc = 1 + Math.sin(ft * 0.35 + it.phS) * breath;
      const fR = Math.sin(ft * 0.5 + it.phR) * frot;
      const mX = currentX * -parallax * it.layer * it.pxK;
      const mY = currentY * -parallax * 0.7 * it.layer * it.pyK;
      const mR = (currentX * rotStr + currentY * rotStr * 0.6) * it.layer;

      let tRepX = 0;
      let tRepY = 0;
      if (fine) {
        const r = it.el.getBoundingClientRect();
        const dx = mouseX - (r.left + r.width / 2);
        const dy = mouseY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < repR && dist > 0) {
          const force = 1 - dist / repR;
          tRepX = (-dx / dist) * force * repS;
          tRepY = (-dy / dist) * force * repS;
        }
        // Reaching a piece kicks it: it squashes, overshoots and settles.
        const near = dist < Math.max(r.width * 0.75, 70);
        if (bounce && near && !it.near) it.popV += 4.2;
        it.near = near;
      }
      if (bounce) {
        it.popV += (-170 * it.pop - 8 * it.popV) * dt;
        it.pop += it.popV * dt;
      }
      it.repX += (tRepX - it.repX) * repL;
      it.repY += (tRepY - it.repY) * repL;
      const tx = mX + fX + it.repX;
      const ty = mY + fY + it.repY;
      it.el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${(it.rot + fR + mR).toFixed(2)}deg) scale(${(sc * (1 + it.pop)).toFixed(4)}, ${(sc * (1 - it.pop * 0.7)).toFixed(4)})`;
    }
  }
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseleave', onLeave);
  };
}
