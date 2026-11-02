'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { translations } from '@/v5/i18n/messages';
import { BRAND_ORB_SHARE, BrandOrb } from '@/v5/components/brand/BrandMark';
import { startSun } from '@/v5/components/landing/openingSun';
import { ArrowDownIcon, HugeiconsIcon } from '@/v5/lib/icons';

/** `loading` until the sun's first frame, `off` when it cannot render. */
type SunState = 'loading' | 'ready' | 'off';

const SUN_PROGRESS = 'opening-sun-progress';

/** Matches the CSS gate for the pinned intro in components/_home.scss. */
function introRuns() {
  return (
    CSS.supports('animation-timeline: scroll()') &&
    CSS.supports('animation-range: 0px 1px') &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  );
}

/**
 * The sun's place in the scroll, read from its CSS scroll-driven animation, so
 * the stylesheet stays the one source of the timing. 1 once it has run, or
 * when the animation is absent (the intro is not running).
 */
function sunProgress(sun: HTMLElement) {
  const animation = sun
    .getAnimations()
    .find((a) => a instanceof CSSAnimation && a.animationName === SUN_PROGRESS);
  return animation?.effect?.getComputedTiming().progress ?? 1;
}

/** How long a click on the cue takes to play the rest of the intro. */
const FAST_FORWARD_MS = 1800;

/** Input that hands the scroll back to the reader while the intro plays. */
const TAKE_OVER = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/**
 * easeInOutSine (easings.net): an even pace through the middle, where the disc
 * splits and the mark flies, eased only at the two ends.
 */
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Scrolls the page to `top` over FAST_FORWARD_MS, which plays the scroll-driven
 * intro on the way. Each step is instant: the page scrolls smoothly by default
 * (base/_reset.scss), which would lag every step. Any wheel, touch, key or
 * press stops it where it is. Returns the stop.
 */
function playIntroTo(top: number) {
  const from = window.scrollY;
  const start = performance.now();
  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    for (const type of TAKE_OVER) window.removeEventListener(type, stop);
  };
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / FAST_FORWARD_MS);
    window.scrollTo({ top: from + (top - from) * easeInOutSine(t), behavior: 'instant' });
    if (t < 1) frame = requestAnimationFrame(step);
    else stop();
  };
  for (const type of TAKE_OVER) window.addEventListener(type, stop, { passive: true });
  frame = requestAnimationFrame(step);
  return stop;
}

/**
 * Aims the flying mark at the header's logo (`data-opening-target` in
 * SiteNav): the translate and scale that put the mark's box on it. The stage
 * pins at the top of the viewport, so its pinned frame starts at y = 0, and
 * the mark's layout box (offsets ignore transforms) is where it flies from.
 */
function aimAtHeaderLogo(track: HTMLElement, stage: HTMLElement, mark: HTMLElement) {
  const target = document.querySelector('[data-opening-target]');
  if (!target) return;
  const logo = target.getBoundingClientRect();
  const frame = stage.getBoundingClientRect();
  const x = logo.left + logo.width / 2 - (frame.left + mark.offsetLeft + mark.offsetWidth / 2);
  const y = logo.top + logo.height / 2 - (mark.offsetTop + mark.offsetHeight / 2);
  const scale = (logo.width * BRAND_ORB_SHARE) / mark.offsetWidth;
  track.style.setProperty('--opening-fly-x', `${x}px`);
  track.style.setProperty('--opening-fly-y', `${y}px`);
  track.style.setProperty('--opening-fly-s', String(scale));
}

const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/**
 * The cue's letters, one each so they can jiggle in turn. Graphemes, not code
 * points, so a Thai vowel or tone mark stays on its consonant.
 */
function letters(text: string) {
  return Array.from(graphemes.segment(text), ({ segment }) => segment);
}

/** Layout distance from the page's top: offsets ignore the opening's transforms. */
function layoutTop(element: HTMLElement) {
  let y = 0;
  for (
    let node: HTMLElement | null = element;
    node;
    node = node.offsetParent as HTMLElement | null
  ) {
    y += node.offsetTop;
  }
  return y;
}

/**
 * Where the headline settles on screen (`--opening-title-top`), which the
 * opening's CSS measures the headline's drop from. The hero holds at the top
 * of the viewport while the stage is pinned, so it is the headline's offset in
 * the hero, which centres it with the waitlist.
 */
function measureTitle(title: HTMLElement) {
  const hero = title.closest('section');
  if (!hero) return;
  const top = layoutTop(title) - layoutTop(hero);
  document.documentElement.style.setProperty('--opening-title-top', `${top}px`);
}

/**
 * The home page's opening. It starts on the sun (components/landing/openingSun.ts).
 * Scrolling shrinks it and sets it through the mark's purple into its blue,
 * while the headline rises in under it. The blue disc splits into the mark's
 * two orbs over the waiting headline, then the mark flies into the header to
 * become its logo as the hero rises into place.
 *
 * Everything but the sun's shading is CSS scroll-driven ("Opening" in
 * components/_home.scss), and the server HTML is the settled frame. The intro
 * needs JavaScript, scroll timelines (not in Firefox yet) and no
 * reduced-motion preference; without WebGL2 it starts on the blue disc. The
 * stage is decoration, so assistive tech skips it. The "See more" cue under it
 * plays the rest of the intro when clicked.
 */
export function OpeningStage() {
  const t = translations('hero');
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sun, setSun] = useState<SunState>('loading');
  const stopPlayRef = useRef<(() => void) | null>(null);
  const cue = letters(t('scroll'));

  // The intro ends where the stage unpins: the track is the stage's screen
  // plus the intro's scroll (`--opening-pin`), and it starts at the page's top.
  const fastForward = (button: HTMLButtonElement) => {
    // Left focused, the button would take the Space key that scrolls the page.
    button.blur();
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    stopPlayRef.current?.();
    stopPlayRef.current = playIntroTo(track.offsetHeight - stage.offsetHeight);
  };

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const mark = markRef.current;
    const sunEl = sunRef.current;
    const canvas = canvasRef.current;
    if (!track || !stage || !mark || !sunEl || !canvas || !introRuns()) return;

    // The logo's place follows the viewport, which the stage spans, and the
    // headline's settled place follows the viewport and the headline's own
    // size (its font, its line count). The waitlist under it is not watched:
    // its success message is shorter, and a later re-measure would move the
    // pinned layout under the reader.
    const title = document.querySelector<HTMLElement>('[data-opening-title]');
    const measure = () => {
      aimAtHeaderLogo(track, stage, mark);
      if (title) measureTitle(title);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    if (title) observer.observe(title);

    const stopSun = startSun(canvas, {
      progress: () => sunProgress(sunEl),
      discShare: () => sunEl.clientWidth / canvas.clientWidth,
      onReady: () => setSun('ready'),
      onFail: () => setSun('off'),
    });

    return () => {
      observer.disconnect();
      stopSun();
      stopPlayRef.current?.();
      document.documentElement.style.removeProperty('--opening-title-top');
    };
  }, []);

  return (
    <>
      <div className="opening__track" data-sun={sun} ref={trackRef} aria-hidden="true">
        <div className="opening__stage" ref={stageRef}>
          <div className="opening__art">
            <div className="opening__halo">
              <span className="opening__glow opening__glow--back" />
              <span className="opening__glow opening__glow--front" />
            </div>
            <div className="opening__sun" ref={sunRef}>
              <canvas className="opening__sun-canvas" ref={canvasRef} />
            </div>
            <div className="opening__mark" ref={markRef}>
              <div className="opening__orbs">
                <BrandOrb className="opening__orb opening__orb--back" side="back" />
                <BrandOrb className="opening__orb opening__orb--front" side="front" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Outside the stage, which sits under the hero: the hero's box covers the
        first screen while it waits and would take the clicks. Skipped by
        assistive tech with the rest of the intro, and out of the tab order,
        since keys already scroll the page. */}
      <div className="opening__cue" aria-hidden="true">
        <button
          type="button"
          className="opening__cue-pill"
          tabIndex={-1}
          onClick={(event) => fastForward(event.currentTarget)}
        >
          <span>
            {cue.map((letter, i) => (
              <span
                key={i}
                className={letter.trim() ? 'opening__cue-letter' : undefined}
                style={{ '--i': i } as CSSProperties}
              >
                {letter}
              </span>
            ))}
          </span>
          <span className="opening__cue-arrow" style={{ '--i': cue.length } as CSSProperties}>
            <HugeiconsIcon icon={ArrowDownIcon} size={14} strokeWidth={2.2} />
          </span>
        </button>
      </div>
    </>
  );
}
