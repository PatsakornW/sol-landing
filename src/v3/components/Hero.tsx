'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { media } from '../../styles/breakpoints.stylex';
import { font } from '../../styles/tokens.stylex';
import { clamp01, useScrollFrame } from '../hooks/use-scroll-frame';
import { bp, V3 } from '../styles/eclipse.stylex';
import { shared } from '../styles/shared.styles';
import { Btn } from './Buttons';
import { initEclipse } from './hero-shader';
import { useReady } from './Ready';

const rise = stylex.keyframes({
  to: { transform: 'none' },
});

const cue = stylex.keyframes({
  '0%': { transform: 'scaleY(0)' },
  '50%': { transform: 'scaleY(1)' },
  '100%': { transform: 'scaleY(1)', opacity: 0 },
});

const styles = stylex.create({
  hero: {
    position: 'relative',
    minHeight: 'max(100svh, 660px)',
    display: 'grid',
    isolation: 'isolate',
    overflow: 'clip',
    backgroundColor: '#010104',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: -2,
  },
  /* What stands in for the shader where WebGL will not run: the same two orbs
     and the same corona, in gradients. */
  fallback: {
    display: 'none',
    position: 'absolute',
    inset: 0,
    zIndex: -2,
    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 240, 214, 0.9) 0 2%, rgba(255, 214, 160, 0.35) 6%, transparent 22%),
      radial-gradient(circle at 58% 50%, #2f78ff 0, #1640b0 13%, transparent 13.2%),
      repeating-linear-gradient(to bottom, transparent 0 14px, #010104 14px 18px),
      radial-gradient(circle at 42% 50%, #dc74ec 0, #5d1f70 13%, transparent 13.2%)`,
    backgroundColor: '#010104',
  },
  fallbackOn: {
    display: 'block',
  },
  shade: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    pointerEvents: 'none',
    backgroundImage: {
      default:
        'linear-gradient(to bottom, rgba(1, 1, 4, 0.55) 0, transparent 26%, transparent 68%, #030309 100%)',
      [bp.max900]:
        'linear-gradient(to bottom, rgba(1, 1, 4, 0.7) 0, transparent 30%, transparent 48%, rgba(3, 3, 9, 0.85) 78%, #030309 100%)',
    },
  },
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: 1680,
    marginInline: 'auto',
    minHeight: 'inherit',
    display: 'grid',
    gridTemplateColumns: { default: 'repeat(12, minmax(0, 1fr))', [bp.max900]: '1fr' },
    gridTemplateRows: { default: 'auto 1fr auto', [bp.max900]: 'auto 1fr auto auto' },
    columnGap: 24,
    paddingTop: 'clamp(108px, 15vh, 160px)',
    paddingInline: V3.gutter,
    paddingBottom: 'clamp(34px, 6vh, 64px)',
  },
  title: {
    margin: 0,
    fontFamily: font.display,
    fontSize: { default: 'clamp(46px, 7.9vw, 138px)', [bp.max900]: 'clamp(44px, 12.4vw, 96px)' },
    lineHeight: 0.92,
    letterSpacing: '-0.035em',
    fontWeight: 500,
    textShadow: '0 2px 40px rgba(1, 1, 4, 0.55)',
    willChange: 'transform',
  },
  titleA: {
    gridColumnStart: 1,
    gridColumnEnd: { default: 'span 8', [bp.max900]: 'auto' },
    gridRowStart: 1,
    fontWeight: 300,
  },
  titleB: {
    gridColumnStart: { default: 5, [bp.max900]: 1 },
    gridColumnEnd: { default: -1, [bp.max900]: 'auto' },
    gridRowStart: 3,
    textAlign: 'right',
    alignSelf: 'end',
  },
  line: {
    display: 'block',
    overflow: 'hidden',
    paddingRight: '0.12em',
    paddingBottom: '0.1em',
    marginBottom: '-0.1em',
  },
  /* Each line waits below its own clip until the page is ready, then rises.
     Without a script, or for a reader who asked for less motion, it is simply
     there. */
  lineText: {
    display: 'block',
    transform: {
      default: 'translateY(108%)',
      [media.noScript]: 'none',
      [media.reduce]: 'none',
    },
  },
  lineOn: {
    animationName: { default: rise, [media.reduce]: 'none' },
    animationDuration: '1.5s',
    animationTimingFunction: 'cubic-bezier(0.16, 0.84, 0.2, 1)',
    animationFillMode: 'forwards',
  },
  foot: {
    gridColumnStart: 1,
    gridColumnEnd: { default: 'span 4', [bp.max900]: 'auto' },
    gridRowStart: { default: 3, [bp.max900]: 4 },
    alignSelf: 'end',
    maxWidth: { default: 400, [bp.max900]: 'none' },
    marginTop: { default: 0, [bp.max900]: 26 },
    paddingBottom: '0.4em',
    opacity: { default: 0, [media.noScript]: 1, [media.reduce]: 1 },
    translate: { default: '0 18px', [media.noScript]: '0 0', [media.reduce]: '0 0' },
    transitionProperty: 'opacity, translate',
    transitionDuration: { default: '1.2s', [media.reduce]: '1ms' },
    transitionDelay: { default: '2.6s', [media.reduce]: '0s' },
    transitionTimingFunction: `ease, ${V3.ease}`,
  },
  footOn: {
    opacity: 1,
    translate: '0 0',
  },
  lead: {
    margin: 0,
    color: '#cfcce6',
    fontSize: 'clamp(16px, 1.25vw, 18px)',
    lineHeight: 1.55,
  },
  ctaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 26,
  },
  cue: {
    position: 'absolute',
    left: '50%',
    bottom: 22,
    translate: '-50% 0',
    display: { default: 'flex', [bp.max900]: 'none' },
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    fontSize: 12,
    letterSpacing: '0.04em',
    color: V3.dust,
    opacity: { default: 0, [media.noScript]: 1, [media.reduce]: 1 },
    transitionProperty: 'opacity',
    transitionDuration: { default: '1s', [media.reduce]: '1ms' },
    transitionDelay: { default: '3.4s', [media.reduce]: '0s' },
  },
  cueOn: {
    opacity: 1,
  },
  cueLine: {
    width: 1,
    height: 46,
    backgroundImage: `linear-gradient(${V3.corona}, transparent)`,
    transformOrigin: 'top',
    animationName: { default: cue, [media.reduce]: 'none' },
    animationDuration: '2.4s',
    animationTimingFunction: V3.ease,
    animationIterationCount: 'infinite',
  },
});

const delay = stylex.create({
  at: (seconds: number) => ({ animationDelay: `${seconds}s` }),
});

export type HeroLabels = {
  title: string;
  lineA1: string;
  lineA2: string;
  lineB1: string;
  lineB2: string;
  lead: string;
  primary: string;
  secondary: string;
  cue: string;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** How far each title drifts up, in viewport heights, over the hero's scroll. */
const DRIFT_A = -0.22;
const DRIFT_B = -0.08;

/**
 * The opening screen: two lines of a sentence at opposite corners of a live
 * eclipse.
 *
 * The picture is a shader on a canvas; where WebGL is refused the gradient
 * fallback stands in. The canvas only draws while the hero is on screen, and
 * draws a single frame for a reader who asked for less motion.
 */
export function Hero({ labels }: { labels: HeroLabels }) {
  const ready = useReady();
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleARef = useRef<HTMLParagraphElement>(null);
  const titleBRef = useRef<HTMLParagraphElement>(null);
  /* Shared with the draw loop, which reads it every frame. */
  const scrollRef = useRef(0);
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    const uniforms = gl ? initEclipse(gl) : null;
    if (!gl || !uniforms) {
      setNoGl(true);
      return;
    }

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let visible = true;
    let raf = 0;
    const t0 = performance.now();

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const intro = reduce ? 1 : easeInOut(clamp01((t - 0.35) / 2.3));
      const fade = reduce ? 1 : easeOut(clamp01(t / 1.4));
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      size();
      gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uTime, t);
      gl.uniform1f(uniforms.uIntro, intro);
      gl.uniform1f(uniforms.uFade, fade);
      gl.uniform1f(uniforms.uScroll, scrollRef.current);
      gl.uniform2f(uniforms.uMouse, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      draw(now);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };
    const onResize = () => draw(performance.now());
    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    if (reduce) {
      draw(t0);
      window.addEventListener('resize', onResize);
    } else {
      raf = requestAnimationFrame(loop);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !raf && !reduce) raf = requestAnimationFrame(loop);
    });
    observer.observe(hero);
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) hero.addEventListener('pointermove', onPointer);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      hero.removeEventListener('pointermove', onPointer);
    };
  }, []);

  const onFrame = useCallback((reduce: boolean) => {
    const hero = heroRef.current;
    if (!hero || reduce) return;
    const hp = clamp01(window.scrollY / hero.offsetHeight);
    scrollRef.current = hp;
    const vh = window.innerHeight;
    if (titleARef.current) {
      titleARef.current.style.transform = `translate3d(0, ${(hp * DRIFT_A * vh).toFixed(1)}px, 0)`;
    }
    if (titleBRef.current) {
      titleBRef.current.style.transform = `translate3d(0, ${(hp * DRIFT_B * vh).toFixed(1)}px, 0)`;
    }
  }, []);
  useScrollFrame(onFrame);

  const line = (text: string, at: number) => (
    <span {...stylex.props(styles.line)}>
      <span {...stylex.props(styles.lineText, ready && styles.lineOn, delay.at(at))}>{text}</span>
    </span>
  );

  return (
    <section
      ref={heroRef}
      id="overview"
      {...stylex.props(styles.hero, shared.section)}
      aria-labelledby="overview-title"
    >
      <canvas ref={canvasRef} {...stylex.props(styles.canvas)} aria-hidden="true" />
      <div {...stylex.props(styles.fallback, noGl && styles.fallbackOn)} aria-hidden="true" />
      <div {...stylex.props(styles.shade)} aria-hidden="true" />
      <div {...stylex.props(styles.inner)}>
        <h1 id="overview-title" {...stylex.props(shared.srOnly)}>
          {labels.title}
        </h1>
        <p ref={titleARef} {...stylex.props(styles.title, styles.titleA)} aria-hidden="true">
          {line(labels.lineA1, 1.5)}
          {line(labels.lineA2, 1.65)}
        </p>
        <p ref={titleBRef} {...stylex.props(styles.title, styles.titleB)} aria-hidden="true">
          {line(labels.lineB1, 2.15)}
          {line(labels.lineB2, 2.3)}
        </p>
        <div {...stylex.props(styles.foot, ready && styles.footOn)}>
          <p {...stylex.props(styles.lead)}>{labels.lead}</p>
          <div {...stylex.props(styles.ctaRow)}>
            <Btn tone="sun" href="#join" arrow>
              {labels.primary}
            </Btn>
            <Btn tone="ghost" href="#mechanism">
              {labels.secondary}
            </Btn>
          </div>
        </div>
      </div>
      <div {...stylex.props(styles.cue, ready && styles.cueOn)} aria-hidden="true">
        {labels.cue}
        <i {...stylex.props(styles.cueLine)} />
      </div>
    </section>
  );
}
