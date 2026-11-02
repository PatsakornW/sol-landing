'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  AnimatePresence,
  m as motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react';
import { ClaimPoster, type ClaimFact } from '@/v5/components/landing/ClaimPoster';
import { useHydrated } from '@/v5/hooks/useHydrated';

type Claim = {
  key: string;
  href: string;
  mark: string;
  title: string;
  label: string;
  desc: string;
  facts: ClaimFact[];
  action: string;
};

// A card takes the front once this much of it has slid up (its title then
// rises), and gives it back only when it has slid down below RELEASE_AT. The
// gap keeps a small scroll back and forth from flipping the front card, and its
// text, on and off.
const SETTLE_AT = 0.7;
const RELEASE_AT = 0.3;
// Scroll (in cards) the first card holds before the next rises, and the last
// holds before the stack lets go.
const HOLD = 0.3;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The claims as a stack that holds the screen while the page scrolls (a
 * stacking-cards pattern): each new poster slides up through a fixed frame and
 * covers the last, which shrinks back, tilts, sinks and darkens while its
 * picture zooms a little further than its frame, so it reads as moving away.
 * The stack scrolls in on the page's content edges, then opens out to fill the
 * screen under the nav, edge to edge. Titles and their
 * lines rise on their own once a card is mostly in, and a counter keeps the
 * place and jumps to any card.
 *
 * Before hydration, without JavaScript, or with reduced motion, the same
 * posters render as a plain grid with their descriptions.
 */
export function ClaimStack({ claims }: { claims: Claim[] }) {
  const reduced = useReducedMotion() ?? false;
  const hydrated = useHydrated();

  if (!hydrated || reduced) {
    return (
      <ul className="posters">
        {claims.map((c) => (
          <li key={c.key}>
            <ClaimPoster
              art={c.key}
              href={c.href}
              mark={c.mark}
              title={c.title}
              action={c.action}
            />
            <p className="poster-item__desc">{c.desc}</p>
          </li>
        ))}
      </ul>
    );
  }
  return <Stack claims={claims} />;
}

function Stack({ claims }: { claims: Claim[] }) {
  const n = claims.length;
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  // On the way in, the frame starts on the page's content edges, in line with
  // the header above, and opens out to the screen's edges by the time it pins.
  const { scrollYProgress: approach } = useScroll({
    target: track,
    offset: ['start 90%', 'start 64px'],
  });
  const expand = useTransform(approach, (p) => {
    const t = clamp01(p);
    return t * t * (3 - 2 * t); // smoothstep: eases out of the column and into the edges
  });
  // 0 → n-1: how many cards have slid in.
  const stage = useTransform(scrollYProgress, (p) =>
    Math.min(n - 1, Math.max(0, p * (n - 1 + 2 * HOLD) - HOLD)),
  );
  // The card in front, and which way the counter last turned (1 forward, -1
  // back). One state, so a step sets both in a single pure update.
  const [{ active, dir }, setPlace] = useState({ active: 0, dir: 1 });
  // The body's width (100vw counts the scrollbar gutter the root reserves):
  // the stack bleeds to exactly the edges the content column is centred in.
  const [pageW, setPageW] = useState<number | null>(null);

  useEffect(() => {
    const body = document.body;
    const measure = () => setPageW(body.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(stage, 'change', (s) => {
    // The furthest card in past SETTLE_AT, and the furthest still in past RELEASE_AT.
    const settled = Math.min(n - 1, Math.floor(s + 1 - SETTLE_AT));
    const held = Math.min(n - 1, Math.floor(s + 1 - RELEASE_AT));
    setPlace((prev) => {
      const next = settled > prev.active ? settled : held < prev.active ? held : prev.active;
      return next === prev.active ? prev : { active: next, dir: next > prev.active ? 1 : -1 };
    });
  });

  const jump = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    // Land where card i has fully slid in.
    window.scrollTo({ top: top + (range * (i + HOLD)) / (n - 1 + 2 * HOLD), behavior: 'smooth' });
  };

  return (
    <div
      className="cstack"
      ref={track}
      style={{ '--n': n, ...(pageW ? { '--page-w': `${pageW}px` } : {}) } as CSSProperties}
    >
      <div className="cstack__pin">
        <motion.div className="cstack__frame" style={{ '--e': expand } as MotionStyle}>
          {claims.map((c, i) => (
            <StackCard key={c.key} claim={c} index={i} stage={stage} active={active} />
          ))}
          <nav className="cstack__counter" aria-label={`${pad(active + 1)} / ${pad(n)}`}>
            <span className="cstack__num" aria-hidden="true">
              <span className="cstack__roll">
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <motion.span
                    key={active}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ y: d * 14, opacity: 0 }),
                      center: { y: 0, opacity: 1 },
                      exit: (d: number) => ({ y: d * -14, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {pad(active + 1)}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="cstack__of">/ {pad(n)}</span>
            </span>
            <span className="cstack__dashes">
              {claims.map((c, i) => (
                <button
                  type="button"
                  key={c.key}
                  className="cstack__dash"
                  data-on={i <= active}
                  aria-label={c.title}
                  aria-current={i === active || undefined}
                  onClick={() => jump(i)}
                />
              ))}
            </span>
          </nav>
        </motion.div>
      </div>
    </div>
  );
}

function StackCard({
  claim,
  index,
  stage,
  active,
}: {
  claim: Claim;
  index: number;
  stage: MotionValue<number>;
  active: number;
}) {
  // enter: 0 below the frame → 1 in place (the first card starts in).
  // cover: 0 on top → 1 fully covered by the next card.
  const enter = useTransform(stage, (s) => (index === 0 ? 1 : clamp01(s - (index - 1))));
  const cover = useTransform(stage, (s) => clamp01(s - index));
  const tilt = index % 2 === 0 ? -1 : 1;

  const y = useTransform([enter, cover], ([e = 0, c = 0]: number[]) => `${(1 - e) * 100 + c * 5}%`);
  const scale = useTransform(cover, (c) => 1 - c * 0.12);
  const rotate = useTransform(cover, (c) => c * 2.5 * tilt);
  // The picture zooms and turns further than its frame, and trails the card in.
  const mediaScale = useTransform(cover, (c) => 1 + c * 0.2);
  const mediaRotate = useTransform(cover, (c) => c * 2 * tilt);
  const mediaY = useTransform(enter, (e) => `${(1 - e) * -18}%`);
  const shade = useTransform(cover, (c) => c * 0.65);

  return (
    <ClaimPoster
      art={claim.key}
      href={claim.href}
      mark={claim.mark}
      title={claim.title}
      label={claim.label}
      desc={claim.desc}
      facts={claim.facts}
      action={claim.action}
      style={{ y, scale, rotate, zIndex: index + 1 }}
      mediaStyle={{ scale: mediaScale, rotate: mediaRotate, y: mediaY }}
      shade={shade}
      settled={index <= active}
      inert={index !== active}
    />
  );
}
