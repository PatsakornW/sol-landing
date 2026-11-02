'use client';

import { useRef, useState, type ReactNode } from 'react';
import {
  m as motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from 'motion/react';
import { useHydrated } from '@/v5/hooks/useHydrated';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Once the capsule is this far open, what it holds (`children`) appears.
const EXPANDED = 0.9;

/**
 * The closing section's centrepiece, after a capsule-hero pattern (rebuilt
 * here): two giant words, Yes and No, sit together and part as the section
 * scrolls in (side to side; top to bottom on narrow screens), opening a rounded
 * capsule between them like a window. Once it is open, `children` (the
 * waitlist form) fades in at its centre.
 *
 * Before hydration, without JavaScript, or with reduced motion, it renders
 * open with its children in place. The words are decorative; the section's
 * heading carries the meaning. Focus inside opens it at once (`:focus-within`
 * in _home.scss), so a keyboard user never lands on a hidden form.
 */
export function CapsuleSplit({
  yes,
  no,
  children,
}: {
  yes: string;
  no: string;
  children?: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const live = useHydrated() && !reduced;

  const row = useRef<HTMLDivElement>(null);
  // Closed as the row enters at the bottom, fully open a little above centre.
  const { scrollYProgress } = useScroll({ target: row, offset: ['start end', 'center 55%'] });
  const eased = useTransform(scrollYProgress, (p) => {
    const c = clamp01(p);
    return c * c * (3 - 2 * c);
  });
  const open = useSpring(eased, { stiffness: 140, damping: 30 });
  const [expanded, setExpanded] = useState(false);
  useMotionValueEvent(open, 'change', (v) => setExpanded(v > EXPANDED));
  const shown = !live || expanded;

  return (
    <div className="capsule-row" ref={row}>
      <motion.div
        className="capsule-row__inner"
        data-expanded={shown ? '' : undefined}
        style={{ '--open': live ? open : 1 } as MotionStyle}
      >
        <span className="capsule-row__word" aria-hidden="true">
          {yes}
        </span>
        <div className="capsule">
          <div className="capsule__window" aria-hidden="true" />
          {children ? <div className="capsule__cta">{children}</div> : null}
        </div>
        <span className="capsule-row__word" aria-hidden="true">
          {no}
        </span>
      </motion.div>
    </div>
  );
}
