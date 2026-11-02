'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  m as motion,
  motionValue,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { FAN_CARDS, FanCardBody, type FanCardData } from '@/v5/components/landing/fanCards';
import { useHydrated } from '@/v5/hooks/useHydrated';

// Below this width the two end cards are dropped: seven do not fit a phone.
const NARROW = 560;
// How often the sample figures move (prices, volume).
const TICK_MS = 1000;
// Springs without overshoot (damping ratio ~1), so hover moves glide and settle.
const SPRING_FOCUS = { stiffness: 220, damping: 30 };
const SPRING_LIFT = { stiffness: 260, damping: 32 };
// A card under the mouse keeps the focus unless another card's centre is
// clearly nearer (its score must beat this share of the focused card's).
const KEEP_FOCUS = 0.8;
// The app's card height (cardShell CARD_HEIGHT); `.fcard` uses the same.
const CARD_H = 224;
// `.fcard` rotates about a point this far down its height (transform-origin).
const ORIGIN_Y = 1.2;

// The flick: a fast sweep knocks the cards it crosses, and each springs home,
// pulling on its neighbours so the knock ripples along the hand.
const FLICK = {
  // Slower than this (px/s), the mouse only points; it does not push.
  minSpeed: 350,
  // Moves further apart than this (s) are two separate gestures.
  maxGap: 0.12,
  stiffness: { x: 95, y: 110, r: 90 },
  damping: 11,
  coupling: { x: 44, y: 52, r: 12 },
  clamp: { x: 70, y: 46, r: 7 },
  step: 1 / 120,
  maxDt: 0.064,
};

type Kick = { x: number; y: number; r: number; vx: number; vy: number; vr: number };
type KickValues = { x: MotionValue<number>; y: MotionValue<number>; r: MotionValue<number> };

const clamp = (v: number, a: number) => Math.max(-a, Math.min(a, v));

/**
 * Where a card sits on the arc. `t` runs -1 (left end) to 1 (right end); the
 * ends drop and tilt outward, so the row reads as a hand of cards.
 */
function arc(t: number, cardW: number, width: number) {
  const spread = Math.min(width / 2 - cardW * 0.42, cardW * 2.55);
  return { x: t * spread, y: t * t * cardW * 0.5, rotate: t * 17 };
}

/**
 * The focused card pushes its neighbours apart along the arc (a dock-style
 * spread): zero at the focus, strongest a little to either side, fading with
 * distance. Moving along the arc, they also rise or drop and re-tilt with it.
 */
function spread(t: number, focus: number, strength: number) {
  const d = t - focus;
  return t + strength * 0.42 * d * Math.exp(-(d * d) / 0.14);
}

/** A card's resting centre and tilt in the fan's own coordinates. */
function restingCard(t: number, cardW: number, width: number) {
  const a = arc(t, cardW, width);
  const theta = (a.rotate * Math.PI) / 180;
  const ox = width / 2 + a.x;
  const oy = a.y + CARD_H * ORIGIN_Y;
  const arm = CARD_H * (ORIGIN_Y - 0.5);
  return { cx: ox + arm * Math.sin(theta), cy: oy - arm * Math.cos(theta), theta };
}

/**
 * One fixed step of the flick springs. Each card is pulled home and toward its
 * neighbours' offsets (the ends have one neighbour). Returns whether anything
 * is still moving, so the loop can sleep once the hand is still.
 */
function stepKicks(kicks: Kick[], dt: number) {
  const { stiffness: k, damping: c, coupling: g, clamp: lim } = FLICK;
  for (let i = 0; i < kicks.length; i++) {
    const s = kicks[i]!;
    const l = kicks[i - 1] ?? s;
    const r = kicks[i + 1] ?? s;
    s.vx += (-k.x * s.x - c * s.vx + g.x * (l.x + r.x - 2 * s.x)) * dt;
    s.vy += (-k.y * s.y - c * s.vy + g.y * (l.y + r.y - 2 * s.y)) * dt;
    s.vr += (-k.r * s.r - c * s.vr + g.r * (l.r + r.r - 2 * s.r)) * dt;
  }
  let moving = false;
  for (const s of kicks) {
    s.x = clamp(s.x + s.vx * dt, lim.x);
    s.y = clamp(s.y + s.vy * dt, lim.y);
    s.r = clamp(s.r + s.vr * dt, lim.r);
    const still =
      Math.abs(s.x) + Math.abs(s.vx) + Math.abs(s.y) + Math.abs(s.vy) < 0.02 &&
      Math.abs(s.r) + Math.abs(s.vr) < 0.005;
    if (still) Object.assign(s, { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 });
    else moving = true;
  }
  return moving;
}

/**
 * Sample markets fanned out on an arc, after the card ribbon in graphicalui.com's
 * footer (its behaviour studied with REA, rebuilt here). The fan opens when it
 * scrolls into view, then rests still. The card under the mouse (hit-tested
 * against each card's tilted outline) lifts a little, straightens, grows and
 * comes to the front while its neighbours slide apart along the arc; over empty
 * space nothing is picked. A quick sweep through the hand knocks the cards it
 * crosses, and they spring home, rippling into their neighbours. Inside, every
 * card is one of the web app's own market cards running sample prices.
 * Decorative only.
 */
export function CategoryFan() {
  const ref = useRef<HTMLDivElement>(null);
  // The server cannot know the preference, so the first client render matches
  // the server's (motion on) and the preference applies once hydrated.
  const prefersReduced = useReducedMotion() ?? false;
  const reduced = useHydrated() && prefersReduced;
  const entered = useInView(ref, { once: true, amount: 0.35 });
  const visible = useInView(ref, { amount: 0 });
  const [width, setWidth] = useState(1200);
  const [tick, setTick] = useState(0);
  // The card under the mouse, while there is one.
  const [active, setActive] = useState<number | null>(null);

  const focus = useMotionValue(0);
  const hover = useMotionValue(0);
  const open = useMotionValue(0);
  const focusS = useSpring(focus, SPRING_FOCUS);
  const hoverS = useSpring(hover, { stiffness: 120, damping: 22 });
  const openS = useSpring(open, { stiffness: 70, damping: 18 });
  const widthMV = useMotionValue(width);

  // Flick state: plain numbers integrated each frame, mirrored into motion
  // values the cards read. The loop sleeps while nothing moves.
  // Made once (a lazy initial state), then changed in place by the loop and the
  // flick handler; nothing renders from it, so it never needs setting.
  const [kicks] = useState<Kick[]>(() =>
    FAN_CARDS.map(() => ({ x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 })),
  );
  const kickValues = useMemo<KickValues[]>(
    () => FAN_CARDS.map(() => ({ x: motionValue(0), y: motionValue(0), r: motionValue(0) })),
    [],
  );
  const awake = useRef(false);
  const lastPoint = useRef<{ x: number; y: number; t: number } | null>(null);

  useAnimationFrame((_, delta) => {
    if (!awake.current) return;
    let left = Math.min(delta / 1000, FLICK.maxDt);
    let moving = true;
    while (left > 0) {
      const dt = Math.min(left, FLICK.step);
      moving = stepKicks(kicks, dt);
      left -= dt;
    }
    kicks.forEach((s, i) => {
      kickValues[i]!.x.set(s.x);
      kickValues[i]!.y.set(s.y);
      kickValues[i]!.r.set(s.r);
    });
    awake.current = moving;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect.width ?? 1200;
      setWidth(w);
      widthMV.set(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [widthMV]);

  useEffect(() => {
    if (reduced) {
      open.jump(1);
      openS.jump(1);
    } else if (entered) {
      open.set(1);
    }
  }, [entered, reduced, open, openS]);

  // Sample data only moves while the fan is on screen.
  useEffect(() => {
    if (reduced || !visible) return;
    const id = window.setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduced, visible]);

  const cards = width < NARROW ? FAN_CARDS.slice(1, -1) : FAN_CARDS;
  const mid = (cards.length - 1) / 2;
  const bases = cards.map((_, i) => (i - mid) / mid);
  // Wide enough on desktop that the multi card keeps its compact Yes/No buttons
  // (the app drops them below a 240px content width), and never so narrow that
  // the front card cuts its question short.
  const cardW = Math.round(Math.min(288, Math.max(200, width * 0.23)));
  // Cards are the app's fixed 224px tall; the arc's ends drop half a width.
  const height = Math.round(CARD_H + cardW * 0.55 + 16);

  const clearFocus = () => {
    hover.set(0);
    setActive(null);
    lastPoint.current = null;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (reduced || event.pointerType !== 'mouse' || openS.get() < 0.98) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const rest = bases.map((t) => restingCard(t, cardW, rect.width));

    // Focus: of the cards whose tilted outline holds the mouse, the one whose
    // centre is nearest (side to side counts more than up and down).
    let next: number | null = null;
    let best = Infinity;
    rest.forEach(({ cx, cy, theta }, i) => {
      const dx = px - cx;
      const dy = py - cy;
      const lx = (dx * Math.cos(theta) + dy * Math.sin(theta)) / (cardW / 2);
      const ly = (-dx * Math.sin(theta) + dy * Math.cos(theta)) / (CARD_H / 2);
      if (Math.abs(lx) > 1 || Math.abs(ly) > 1) return;
      const score = (lx * lx + ly * ly * 0.25) * (i === active ? KEEP_FOCUS : 1);
      if (score < best) {
        best = score;
        next = i;
      }
    });
    if (next !== active) {
      setActive(next);
      if (next !== null) focus.set(bases[next]!);
    }
    hover.set(next === null ? 0 : 1);

    // Flick: a quick move pushes each card near its path along the move.
    const now = event.timeStamp / 1000;
    const prev = lastPoint.current;
    lastPoint.current = { x: px, y: py, t: now };
    if (!prev) return;
    const dt = now - prev.t;
    const mx = px - prev.x;
    const my = py - prev.y;
    const len = Math.hypot(mx, my);
    if (dt <= 0 || dt > FLICK.maxGap || len / dt < FLICK.minSpeed) return;
    const gain = Math.min(len / dt / 1500, 1.6) * 7;
    rest.forEach(({ cx, cy }, i) => {
      // Distance from the card's centre to the move's segment.
      const u = Math.max(0, Math.min(1, ((cx - prev.x) * mx + (cy - prev.y) * my) / (len * len)));
      const d = Math.hypot(prev.x + u * mx - cx, prev.y + u * my - cy);
      const w = Math.exp(-((d / (cardW * 0.55)) ** 2));
      if (w < 0.05) return;
      const s = kicks[i]!;
      s.vx += mx * gain * w;
      s.vy += my * gain * w * 0.6;
      // Off-centre pushes turn the card, like a nudge at one end.
      s.vr += (((cx - px) * my - (cy - py) * mx) / (cardW * cardW)) * gain * w * 9;
    });
    awake.current = true;
  };

  const style = { '--fan-card-w': `${cardW}px`, height } as CSSProperties;

  return (
    <div
      className="fan"
      ref={ref}
      style={style}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={clearFocus}
    >
      {cards.map((card, i) => (
        <FanCard
          key={card.id}
          card={card}
          base={bases[i]!}
          cardW={cardW}
          widthMV={widthMV}
          focus={focusS}
          hover={hoverS}
          open={openS}
          kick={kickValues[i]!}
          active={active === i}
          tick={tick}
          live={!reduced}
        />
      ))}
    </div>
  );
}

function FanCard({
  card,
  base,
  cardW,
  widthMV,
  focus,
  hover,
  open,
  kick,
  active,
  tick,
  live,
}: {
  card: FanCardData;
  base: number;
  cardW: number;
  widthMV: MotionValue<number>;
  focus: MotionValue<number>;
  hover: MotionValue<number>;
  open: MotionValue<number>;
  kick: KickValues;
  active: boolean;
  tick: number;
  live: boolean;
}) {
  // 1 while this card is the one under the mouse, eased.
  const lift = useSpring(0, SPRING_LIFT);
  useEffect(() => {
    lift.set(active ? 1 : 0);
  }, [active, lift]);

  // Stacking: the focused card goes straight to the front; a card losing focus
  // stays above its neighbours until it has settled back, so it never drops
  // behind them while still lifted.
  // A function of `active` and the lift, recomputed on every render and every
  // lift change (the lift spring is critically damped, so it never bounces back
  // over the threshold once settled).
  const restZ = 20 - Math.round(Math.abs(base) * 10);
  const zIndex = useTransform(lift, (l) => (active ? 30 : l < 0.02 ? restZ : 25));

  // Closed, every card stacks near the centre; opening walks each one out to
  // its place on the arc. Hovering parts the cards around the focused one.
  const place = (values: number[]) => {
    const [f = 0, h = 0, o = 0, w = 1200] = values;
    return arc(spread(base, f, h) * (0.12 + 0.88 * o), cardW, w);
  };
  const inputs = [focus, hover, open, widthMV];
  const x = useTransform([...inputs, kick.x], (v: number[]) => place(v).x + (v[4] ?? 0));
  const y = useTransform([...inputs, kick.y, lift], (v: number[]) => {
    const [, , o = 0, , k = 0, l = 0] = v;
    return place(v).y + (1 - o) * cardW * 0.35 + k - l * 18;
  });
  const rotate = useTransform([...inputs, kick.r, lift], (v: number[]) => {
    const [, , , , k = 0, l = 0] = v;
    return place(v).rotate * (1 - l * 0.6) + k;
  });
  const scale = useTransform(lift, (l) => 1 + l * 0.05);
  const opacity = useTransform(open, [0, 0.6], [0, 1]);

  const delay = { '--fan-delay': `${(base + 1) * 0.6}s` } as CSSProperties;

  return (
    <motion.div
      className={`fcard fcard--${card.variant}${live ? ' is-live' : ''}${active ? ' is-active' : ''}`}
      style={{ x, y, rotate, scale, opacity, zIndex, ...delay }}
    >
      <FanCardBody card={card} tick={tick} />
    </motion.div>
  );
}
