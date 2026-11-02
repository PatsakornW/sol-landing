'use client';

import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { font } from '../../styles/tokens.stylex';
import { icon, type IconName } from '../lib/assets';
import { gsap, intro, reducedMotion } from '../lib/motion';
import { bp, C } from '../styles/candy.stylex';
import { Orb } from './Orb';

const styles = stylex.create({
  hero: {
    position: 'sticky',
    top: 0,
    zIndex: 0,
    height: '100svh',
    minHeight: 560,
    overflow: 'hidden',
    backgroundColor: C.base,
    display: 'grid',
    gridTemplateRows: { default: 'auto 1fr', [bp.max760]: 'auto auto' },
    alignContent: { default: null, [bp.max760]: 'center' },
    rowGap: { default: 0, [bp.max760]: 28 },
    paddingTop: { default: 110, [bp.max760]: 90 },
    paddingBottom: { default: 0, [bp.max760]: 70 },
  },
  scene: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  piece: {
    position: 'absolute',
    height: 'auto',
    willChange: 'transform',
    filter: 'drop-shadow(0 18px 24px rgba(28, 24, 48, 0.18))',
  },
  copy: { position: 'relative', zIndex: 2, textAlign: 'center', paddingInline: C.gutter },
  kicker: {
    margin: 0,
    marginBottom: 14,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: 'clamp(14px, 1.2vw, 18px)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: C.type,
  },
  title: {
    margin: 0,
    marginInline: 'auto',
    maxWidth: '11ch',
    fontFamily: font.display,
    fontWeight: 400,
    fontSize: 'clamp(60px, 12.5vw, 196px)',
    lineHeight: 0.92,
    letterSpacing: '0.005em',
    textTransform: 'uppercase',
    textWrap: 'balance',
    /* The mark's blue running into its pink, as on the footer. */
    color: C.blue,
    backgroundImage: `linear-gradient(100deg, ${C.blue} 10%, ${C.pink} 90%)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    /* Depth: a hard edge in the deep blue, a darker one under it, and a
       pink glow on the ground. */
    filter: 'drop-shadow(0 4px 0 #143F9E) drop-shadow(0 4px 0 #0D0E15) drop-shadow(0 24px 34px rgba(220, 116, 236, 0.28))',
  },
  /* The liquid: the title and the drops that pour it share one gooey filter
     while they move, so they melt into one another. */
  goo: { position: 'relative' },
  blob: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: '50%',
    opacity: 0,
    pointerEvents: 'none',
    willChange: 'transform, left, top',
  },
  blobBlue: { backgroundImage: 'radial-gradient(circle at 34% 30%, #8DB8FF 0%, #1E69F6 52%, #143F9E 100%)' },
  blobPink: { backgroundImage: 'radial-gradient(circle at 34% 30%, #F2B8F6 0%, #DC74EC 52%, #8A2FA6 100%)' },
  filters: { position: 'absolute', width: 0, height: 0, overflow: 'hidden' },
  stage: {
    position: 'relative',
    zIndex: 1,
    alignSelf: { default: 'end', [bp.max760]: 'center' },
    justifySelf: 'center',
    width: { default: 'clamp(300px, 52vw, 760px)', [bp.max760]: 'min(78vw, 360px)' },
    height: { default: 'clamp(240px, 46vh, 520px)', [bp.max760]: 'min(32vh, 260px)' },
    marginBottom: { default: '-6vh', [bp.max760]: 0 },
  },
  hint: {
    position: 'absolute',
    left: C.gutter,
    bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
    zIndex: 3,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: font.sans,
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: C.type,
    textDecorationLine: 'none',
  },
  hintArrow: { display: 'inline-grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', backgroundColor: C.type, color: C.plate },
  hideSm: { display: { default: 'block', [bp.max760]: 'none' } },
});

/* Each floating piece: where it hangs, how big, how deep, and its rest tilt. */
const PIECES: { k: IconName; left?: string; right?: string; top: string; w: string; layer: number; rot: number; sm?: boolean }[] = [
  { k: 'yes', left: '5%', top: '20%', w: 'clamp(90px, 12vw, 200px)', layer: 0.85, rot: -14, sm: true },
  { k: 'no', right: '6%', top: '24%', w: 'clamp(84px, 11vw, 180px)', layer: 0.6, rot: 12, sm: true },
  { k: 'usdc', left: '13%', top: '62%', w: 'clamp(64px, 8vw, 130px)', layer: 0.5, rot: 8 },
  { k: 'sol', right: '14%', top: '58%', w: 'clamp(70px, 9vw, 150px)', layer: 0.95, rot: -8, sm: true },
  { k: 'question', left: '27%', top: '9%', w: 'clamp(56px, 7vw, 120px)', layer: 0.4, rot: 6 },
  { k: 'up', right: '27%', top: '11%', w: 'clamp(56px, 7vw, 120px)', layer: 0.7, rot: -6 },
  { k: 'btc', left: '3%', top: '46%', w: 'clamp(56px, 7vw, 120px)', layer: 0.3, rot: 16, sm: true },
  { k: 'bolt', right: '3%', top: '45%', w: 'clamp(50px, 6vw, 100px)', layer: 0.5, rot: -18 },
];

const at = stylex.create({
  place: (p: { left?: string; right?: string; top: string; w: string }) => ({ left: p.left ?? null, right: p.right ?? null, top: p.top, width: p.w }),
});

/* The drops: size as a share of the title's height, and which colour. */
const BLOBS = [
  { size: 0.62, pink: false },
  { size: 0.5, pink: true },
  { size: 0.7, pink: false },
  { size: 0.46, pink: true },
  { size: 0.58, pink: false },
  { size: 0.66, pink: true },
  { size: 0.44, pink: false },
  { size: 0.6, pink: true },
  { size: 0.52, pink: false },
] as const;

/* The title's own depth, as a string GSAP can grow from nothing. */
const SHADOW_ON = 'drop-shadow(0px 4px 0px rgba(20, 63, 158, 1)) drop-shadow(0px 4px 0px rgba(13, 14, 21, 1)) drop-shadow(0px 24px 34px rgba(220, 116, 236, 0.28))';
const SHADOW_OFF = 'drop-shadow(0px 0px 0px rgba(20, 63, 158, 1)) drop-shadow(0px 0px 0px rgba(13, 14, 21, 1)) drop-shadow(0px 0px 0px rgba(220, 116, 236, 0))';

/**
 * The liquid pour. Drops of the mark's blue and pink run in from the edges
 * and from below, meet on the title and swell into one mass; the mass thins
 * out into the letters as the blur that joins them drains away. Then the
 * filter comes off, so the title is crisp type again, and its depth rises
 * under it.
 */
function useLiquidTitle() {
  const goo = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);

  useEffect(() => {
    const wrap = goo.current;
    const h1 = title.current;
    const fe = blur.current;
    if (!wrap || !h1 || !fe) return;
    if (reducedMotion()) {
      gsap.set(h1, { opacity: 1 });
      return;
    }
    const blobs = Array.from(wrap.querySelectorAll<HTMLElement>('[data-blob]'));
    const ctx = gsap.context(() => {
      const L = h1.offsetLeft;
      const T = h1.offsetTop;
      const W = h1.offsetWidth;
      const H = h1.offsetHeight;
      const fs = parseFloat(getComputedStyle(h1).fontSize) || 120;
      const line = fs * 0.92;
      const state = { b: Math.max(8, fs * 0.13) };
      const setBlur = () => fe.setAttribute('stdDeviation', state.b.toFixed(2));
      setBlur();
      wrap.style.filter = 'url(#v6-goo)';
      h1.style.filter = 'none';

      const finish = () => {
        wrap.style.filter = '';
        gsap.fromTo(h1, { filter: SHADOW_OFF }, { filter: SHADOW_ON, duration: 0.7, ease: 'back.out(2.4)', clearProps: 'filter' });
      };
      const tl = gsap.timeline({ delay: Math.max(0, intro.delay - 0.2), onComplete: finish });
      const n = blobs.length;
      blobs.forEach((b, i) => {
        const size = line * (BLOBS[i]?.size ?? 0.5) * 1.6;
        // In from the left, the right and from under the title, in turn.
        const side = i % 3;
        const fromX = side === 0 ? L - W * 0.55 : side === 1 ? L + W * 1.55 : L + W * (0.15 + 0.7 * (i / n));
        const fromY = side === 2 ? T + H + line * 2.2 : T + H * (0.15 + 0.7 * ((i * 7) % 10) / 10);
        const toX = L + W * (0.1 + 0.8 * (i / (n - 1)));
        const toY = T + H * (0.2 + 0.6 * ((i * 3) % 5) / 4);
        gsap.set(b, { width: size, height: size, left: fromX, top: fromY, xPercent: -50, yPercent: -50, scale: 0.45, opacity: 1 });
        tl.to(b, { left: toX, top: toY, scale: 1, duration: 1.05, ease: 'power3.out' }, i * 0.05);
        tl.to(b, { scale: 1.45, duration: 0.45, ease: 'sine.inOut' }, 0.7 + i * 0.02);
        tl.to(b, { scale: 0, top: T + H * 0.5, left: L + W * 0.5 + (toX - L - W * 0.5) * 0.7, duration: 0.6, ease: 'power2.in' }, 1.0 + i * 0.025);
      });
      tl.fromTo(h1, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.9);
      tl.fromTo(h1, { scaleX: 0.94, scaleY: 1.12 }, { scaleX: 1, scaleY: 1, duration: 1.3, ease: 'elastic.out(1, 0.45)' }, 1.5);
      // The goo holds until the drops are inside the letters, then drains.
      tl.to(state, { b: 0, duration: 0.85, ease: 'power2.in', onUpdate: setBlur }, 1.2);
    }, wrap);
    return () => {
      ctx.revert();
      wrap.style.filter = '';
      h1.style.filter = '';
    };
  }, []);

  return { goo, title, blur };
}

export type HeroLabels = { kicker: string; title: string; scroll: string };

/**
 * The opening: the claim at poster size over a lilac sky, the brand mark in
 * the round rising from the floor, and the page's coins hanging around it.
 * The section is sticky, so the next one slides up over it.
 */
export function Hero({ labels }: { labels: HeroLabels }) {
  const liquid = useLiquidTitle();
  return (
    <section {...stylex.props(styles.hero)} aria-labelledby="hero-title">
      {/* The goo: blur everything, then cut the alpha back to a hard edge. */}
      <svg {...stylex.props(styles.filters)} aria-hidden="true" focusable="false">
        <filter id="v6-goo" x="-60%" y="-120%" width="220%" height="340%" colorInterpolationFilters="sRGB">
          <feGaussianBlur ref={liquid.blur} in="SourceGraphic" stdDeviation="0" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
        </filter>
      </svg>
      <div {...stylex.props(styles.scene)} data-scene="" data-bounce="" data-parallax="56" data-repulse="240" aria-hidden="true">
        {PIECES.map((p) => (
          <img key={p.k} src={icon(p.k)} alt="" data-layer={p.layer} data-rot={p.rot} {...stylex.props(styles.piece, at.place(p), !p.sm && styles.hideSm)} />
        ))}
      </div>
      <div {...stylex.props(styles.copy)}>
        <p {...stylex.props(styles.kicker)} data-reveal="words" data-delay="0.3">
          {labels.kicker}
        </p>
        <div ref={liquid.goo} data-liquid="" {...stylex.props(styles.goo)}>
          {BLOBS.map((b, i) => (
            <span key={i} data-blob="" aria-hidden="true" {...stylex.props(styles.blob, b.pink ? styles.blobPink : styles.blobBlue)} />
          ))}
          <h1 ref={liquid.title} id="hero-title" {...stylex.props(styles.title)}>
            {labels.title}
          </h1>
        </div>
      </div>
      <div {...stylex.props(styles.stage)} data-reveal="image" data-move="110vh" data-duration="1.1" data-delay="0.2" data-trigger="load">
        <Orb jelly />
      </div>
      <a href="#feature" {...stylex.props(styles.hint)} data-reveal="up" data-delay="0.9" data-trigger="load">
        <span {...stylex.props(styles.hintArrow)} aria-hidden="true">
          ↓
        </span>
        {labels.scroll}
      </a>
    </section>
  );
}
